"use server";

import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { AVAILABILITY, BADGES, slugify } from "@/lib/admin/menu-types";
import { nextResetUtc } from "@/lib/admin/soldout";
import { dollarsToCents } from "@/lib/price";

// ---------------------------------------------------------------- availability
export async function setAvailability(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !(AVAILABILITY as readonly string[]).includes(status)) return;

  const { data: before } = await supabase.from("menu_items").select("name, availability").eq("id", id).maybeSingle();
  const { error } = await supabase
    .from("menu_items")
    .update({
      availability: status,
      sold_out_until: status === "sold_out_today" ? nextResetUtc() : null,
    })
    .eq("id", id);

  if (!error && before && before.availability !== status) {
    await supabase.from("menu_audit").insert({
      item_id: id,
      item_name: before.name,
      field: "availability",
      old_value: before.availability,
      new_value: status,
      actor_email: user.email,
    });
  }
  revalidateTag("menu");
}

// ---------------------------------------------------------------- homepage featured
/** Toggle whether an item appears in the homepage "Featured dishes" strip.
 *  The public query also requires published + an image + not hidden, so the
 *  admin page surfaces those conditions rather than silently dropping items. */
export async function setFeatured(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const featured = String(formData.get("featured") ?? "") === "true";
  if (!id) return;

  const { data: before } = await supabase.from("menu_items").select("name, is_featured").eq("id", id).maybeSingle();
  const { error } = await supabase.from("menu_items").update({ is_featured: featured }).eq("id", id);

  if (!error && before && before.is_featured !== featured) {
    await supabase.from("menu_audit").insert({
      item_id: id,
      item_name: before.name,
      field: "is_featured",
      old_value: String(before.is_featured),
      new_value: String(featured),
      actor_email: user.email,
    });
  }
  revalidateTag("menu");
}

// ---------------------------------------------------------------- item editor
const variantSchema = z.array(
  z.object({ name: z.string().max(40), price: z.string(), is_available: z.boolean().optional() }),
);

const itemSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().trim().min(1, "Name is required.").max(120),
  category_id: z.uuid("Choose a category."),
  description: z.string().trim().max(600).optional().or(z.literal("")),
  image_url: z.string().trim().max(400).optional().or(z.literal("")),
  badge: z.enum(["", ...BADGES]).optional(),
  availability: z.enum(AVAILABILITY),
  is_featured: z.boolean(),
  is_published: z.boolean(),
  starts_at: z.string().optional().or(z.literal("")),
  ends_at: z.string().optional().or(z.literal("")),
});

export type ItemFormState = { error?: string };

export async function saveItem(_prev: ItemFormState, formData: FormData): Promise<ItemFormState> {
  const { supabase, user } = await requireAdmin();

  const parsed = itemSchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    category_id: formData.get("category_id"),
    description: formData.get("description") ?? "",
    image_url: formData.get("image_url") ?? "",
    badge: formData.get("badge") ?? "",
    availability: formData.get("availability"),
    is_featured: formData.get("is_featured") === "on",
    is_published: formData.get("is_published") === "on",
    starts_at: formData.get("starts_at") ?? "",
    ends_at: formData.get("ends_at") ?? "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  let rawVariants: unknown;
  try {
    rawVariants = JSON.parse(String(formData.get("variants") ?? "[]"));
  } catch {
    return { error: "Price data was malformed." };
  }
  const vParsed = variantSchema.safeParse(rawVariants);
  if (!vParsed.success) return { error: "Check the prices." };

  const variants = vParsed.data
    .map((v, i) => ({
      name: v.name.trim(),
      price_cents: dollarsToCents(v.price),
      sort_order: i,
      is_available: v.is_available !== false,
    }))
    .filter((v) => v.price_cents != null) as {
    name: string;
    price_cents: number;
    sort_order: number;
    is_available: boolean;
  }[];

  if (variants.length === 0) return { error: "Add at least one valid price." };

  const d = parsed.data;
  const singlePrice = variants.length === 1 && variants[0].name === "" ? variants[0].price_cents : null;

  const row = {
    category_id: d.category_id,
    name: d.name,
    description: d.description || null,
    image_url: d.image_url || null,
    badge: d.badge || null,
    availability: d.availability,
    sold_out_until: d.availability === "sold_out_today" ? nextResetUtc() : null,
    is_featured: d.is_featured,
    is_published: d.is_published,
    starts_at: d.starts_at || null,
    ends_at: d.ends_at || null,
    price_cents: singlePrice,
  };

  let itemId = d.id;

  if (itemId) {
    const { error } = await supabase.from("menu_items").update(row).eq("id", itemId);
    if (error) return { error: "Could not save. Please try again." };
  } else {
    // unique slug within the category
    const base = slugify(d.name) || "item";
    const { data: siblings } = await supabase.from("menu_items").select("slug").eq("category_id", d.category_id);
    const taken = new Set((siblings ?? []).map((s) => s.slug));
    let slug = base;
    for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
    const { data: max } = await supabase
      .from("menu_items")
      .select("sort_order")
      .eq("category_id", d.category_id)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const { data: created, error } = await supabase
      .from("menu_items")
      .insert({ ...row, slug, sort_order: (max?.sort_order ?? -1) + 1 })
      .select("id")
      .single();
    if (error || !created) return { error: "Could not create the item." };
    itemId = created.id;
  }

  await supabase.from("menu_item_variants").delete().eq("menu_item_id", itemId);
  const { error: ve } = await supabase
    .from("menu_item_variants")
    .insert(variants.map((v) => ({ ...v, menu_item_id: itemId })));
  if (ve) return { error: "Item saved, but prices failed. Re-open and retry." };

  await supabase.from("menu_audit").insert({
    item_id: itemId,
    item_name: d.name,
    field: d.id ? "item" : "created",
    new_value: variants.map((v) => `${v.name || "—"} $${(v.price_cents / 100).toFixed(2)}`).join(" · "),
    actor_email: user.email,
  });

  revalidateTag("menu");
  redirect("/gm-admin/menu?ok=" + (d.id ? "updated" : "created"));
}

export async function deleteItem(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await supabase.from("menu_items").delete().eq("id", id);
  revalidateTag("menu");
  redirect("/gm-admin/menu?ok=deleted");
}

// ---------------------------------------------------------------- categories
const categorySchema = z.object({
  id: z.uuid().optional(),
  name: z.string().trim().min(1, "Name is required.").max(80),
  description: z.string().trim().max(400).optional().or(z.literal("")),
  is_active: z.boolean(),
});

export type CategoryFormState = { error?: string };

export async function saveCategory(_prev: CategoryFormState, formData: FormData): Promise<CategoryFormState> {
  const { supabase } = await requireAdmin();
  const parsed = categorySchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    description: formData.get("description") ?? "",
    is_active: formData.get("is_active") === "on",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  const d = parsed.data;

  if (d.id) {
    const { error } = await supabase
      .from("menu_categories")
      .update({ name: d.name, description: d.description || null, is_active: d.is_active })
      .eq("id", d.id);
    if (error) return { error: "Could not save the category." };
  } else {
    const base = slugify(d.name) || "category";
    const { data: all } = await supabase.from("menu_categories").select("slug, sort_order");
    const taken = new Set((all ?? []).map((c) => c.slug));
    let slug = base;
    for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
    const maxOrder = Math.max(-1, ...(all ?? []).map((c) => c.sort_order));
    const { error } = await supabase
      .from("menu_categories")
      .insert({ name: d.name, slug, description: d.description || null, is_active: d.is_active, sort_order: maxOrder + 1 });
    if (error) return { error: "Could not create the category." };
  }
  revalidateTag("menu");
  redirect("/gm-admin/categories?ok=" + (d.id ? "updated" : "created"));
}

export async function moveCategory(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const dir = String(formData.get("dir") ?? "");
  if (!id || (dir !== "up" && dir !== "down")) return;

  const { data: all } = await supabase.from("menu_categories").select("id, sort_order").order("sort_order");
  if (!all) return;
  const i = all.findIndex((c) => c.id === id);
  const j = dir === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= all.length) return;

  await supabase.from("menu_categories").update({ sort_order: all[j].sort_order }).eq("id", all[i].id);
  await supabase.from("menu_categories").update({ sort_order: all[i].sort_order }).eq("id", all[j].id);
  revalidateTag("menu");
}

export async function deleteCategory(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const { count } = await supabase
    .from("menu_items")
    .select("*", { count: "exact", head: true })
    .eq("category_id", id);
  if ((count ?? 0) > 0) {
    redirect("/gm-admin/categories?err=notempty");
  }
  await supabase.from("menu_categories").delete().eq("id", id);
  revalidateTag("menu");
  redirect("/gm-admin/categories?ok=deleted");
}
