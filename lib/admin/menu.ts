import { requireAdmin } from "@/lib/auth";
import type { Availability, Category, Item } from "./menu-types";

export * from "./menu-types";

export async function getCategories(withCounts = false): Promise<Category[]> {
  const { supabase } = await requireAdmin();
  if (!withCounts) {
    const { data } = await supabase.from("menu_categories").select("*").order("sort_order");
    return (data ?? []) as Category[];
  }
  const { data } = await supabase
    .from("menu_categories")
    .select("*, menu_items(count)")
    .order("sort_order");
  return ((data ?? []) as unknown as (Category & { menu_items: { count: number }[] })[]).map((c) => ({
    ...c,
    itemCount: c.menu_items?.[0]?.count ?? 0,
  }));
}

export async function getItems(opts: { q?: string; status?: string; cat?: string } = {}): Promise<Item[]> {
  const { supabase } = await requireAdmin();
  let q = supabase
    .from("menu_items")
    .select("*, category:menu_categories(name), menu_item_variants(*)")
    .order("sort_order");
  if (opts.cat) q = q.eq("category_id", opts.cat);
  if (opts.status && ["available", "sold_out_today", "temporarily_unavailable", "hidden"].includes(opts.status)) {
    q = q.eq("availability", opts.status);
  }
  if (opts.q?.trim()) q = q.ilike("name", `%${opts.q.trim()}%`);
  const { data } = await q;
  return ((data ?? []) as unknown as Item[])
    .map((i) => ({ ...i, menu_item_variants: [...i.menu_item_variants].sort((a, b) => a.sort_order - b.sort_order) }))
    .sort((a, b) => a.category_id.localeCompare(b.category_id) || a.sort_order - b.sort_order);
}

/** Everything the homepage-featured screen needs: the current picks plus the
 *  full catalogue to choose from. Mirrors getFeatured()'s public filters so the
 *  admin can see exactly why a pick would not show. */
export const FEATURED_LIMIT = 8;

export function featuredBlocker(item: Item): string | null {
  if (!item.image_url) return "Needs a photo";
  if (!item.is_published) return "Hidden from public";
  if (item.availability === "hidden") return "Availability set to hidden";
  return null;
}

export async function getFeaturedBoard(q = "") {
  const all = await getItems(q.trim() ? { q } : {});
  const featured = (await getItems()).filter((i) => i.is_featured);
  return {
    featured,
    candidates: all.filter((i) => !i.is_featured),
    liveCount: featured.filter((i) => !featuredBlocker(i)).length,
  };
}

export async function getItem(id: string): Promise<Item | null> {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("menu_items")
    .select("*, menu_item_variants(*)")
    .eq("id", id)
    .maybeSingle();
  if (!data) return null;
  const item = data as unknown as Item;
  item.menu_item_variants = [...item.menu_item_variants].sort((a, b) => a.sort_order - b.sort_order);
  return item;
}

export async function getStats() {
  const { supabase } = await requireAdmin();
  const itemCount = (status?: Availability) => {
    let q = supabase.from("menu_items").select("*", { count: "exact", head: true });
    if (status) q = q.eq("availability", status);
    return q;
  };
  const [items, cats, soldOut, tempUnavail, hidden, last] = await Promise.all([
    itemCount(),
    supabase.from("menu_categories").select("*", { count: "exact", head: true }),
    itemCount("sold_out_today"),
    itemCount("temporarily_unavailable"),
    itemCount("hidden"),
    supabase.from("menu_items").select("updated_at").order("updated_at", { ascending: false }).limit(1).maybeSingle(),
  ]);
  return {
    ok: !items.error && !cats.error,
    items: items.count ?? 0,
    categories: cats.count ?? 0,
    soldOut: soldOut.count ?? 0,
    tempUnavail: tempUnavail.count ?? 0,
    hidden: hidden.count ?? 0,
    lastUpdated: (last.data?.updated_at as string | undefined) ?? null,
  };
}
