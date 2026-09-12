"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/admin/menu-types";
import { isAllowedMenuImageUrl } from "@/lib/image-url";

const schema = z.object({
  id: z.uuid().optional(),
  title: z.string().trim().min(5, "Add a descriptive title.").max(100),
  slug: z.string().trim().max(110).optional(),
  category: z.string().trim().min(2, "Add a category.").max(50),
  excerpt: z.string().trim().min(40, "The search excerpt should be at least 40 characters.").max(180),
  content: z.string().trim().min(200, "The article needs at least 200 characters."),
  cover_url: z.string().trim().refine(isAllowedMenuImageUrl, "Upload or select a cover image."),
  cover_alt: z.string().trim().min(8, "Describe the cover image for accessibility and image search.").max(160),
  meta_title: z.string().trim().max(60, "Keep the SEO title at 60 characters or less.").optional(),
  meta_description: z.string().trim().max(160, "Keep the meta description at 160 characters or less.").optional(),
  focus_keyword: z.string().trim().max(80).optional(),
  is_published: z.boolean(),
});

export type BlogFormState = { error?: string };

export async function saveBlogPost(_previous: BlogFormState, formData: FormData): Promise<BlogFormState> {
  const { supabase, user } = await requireAdmin();
  const parsed = schema.safeParse({
    id: formData.get("id") || undefined,
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    category: formData.get("category"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    cover_url: formData.get("cover_url"),
    cover_alt: formData.get("cover_alt"),
    meta_title: formData.get("meta_title") || undefined,
    meta_description: formData.get("meta_description") || undefined,
    focus_keyword: formData.get("focus_keyword") || undefined,
    is_published: formData.get("is_published") === "on",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  const value = parsed.data;
  const slug = slugify(value.slug || value.title);
  if (!slug) return { error: "Could not create a valid URL slug." };
  const { data: existing } = value.id
    ? await supabase.from("blog_posts").select("published_at").eq("id", value.id).maybeSingle()
    : { data: null };
  const row = {
    slug,
    title: value.title,
    category: value.category,
    excerpt: value.excerpt,
    content: value.content,
    cover_url: value.cover_url,
    cover_alt: value.cover_alt,
    meta_title: value.meta_title || null,
    meta_description: value.meta_description || null,
    focus_keyword: value.focus_keyword || null,
    is_published: value.is_published,
    published_at: value.is_published ? existing?.published_at ?? new Date().toISOString() : null,
    author_id: user.id,
  };

  const query = value.id
    ? supabase.from("blog_posts").update(row).eq("id", value.id)
    : supabase.from("blog_posts").insert(row);
  const { error } = await query;
  if (error) return { error: error.code === "23505" ? "That URL slug is already in use." : "Could not save the post. Is migration 0004 applied?" };

  revalidateTag("blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  redirect("/gm-admin/blog?ok=" + (value.id ? "updated" : "created"));
}

export async function deleteBlogPost(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await supabase.from("blog_posts").delete().eq("id", id);
  revalidateTag("blog");
  revalidatePath("/blog");
  redirect("/gm-admin/blog?ok=deleted");
}
