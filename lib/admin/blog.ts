import { requireAdmin } from "@/lib/auth";

export type AdminBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  content: string;
  cover_url: string;
  cover_alt: string;
  meta_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  is_published: boolean;
  published_at: string | null;
  updated_at: string;
};

const fields = "id,slug,title,excerpt,category,content,cover_url,cover_alt,meta_title,meta_description,focus_keyword,is_published,published_at,updated_at";

export async function getAdminBlogPosts() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("blog_posts").select(fields).order("updated_at", { ascending: false });
  return { posts: (data ?? []) as AdminBlogPost[], error: error?.message };
}

export async function getAdminBlogPost(id: string) {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("blog_posts").select(fields).eq("id", id).maybeSingle();
  return data as AdminBlogPost | null;
}
