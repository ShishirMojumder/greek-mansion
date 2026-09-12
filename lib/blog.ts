import { unstable_cache } from "next/cache";
import { posts as fallbackPosts, type BlogPost } from "@/data/blog";
import { publicClient, supabaseConfigured } from "@/lib/supabase/public";

export type ManagedBlogPost = BlogPost & {
  id?: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  isPublished?: boolean;
};

type BlogRow = {
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
};

export function parseBlogContent(content: string) {
  const sections: BlogPost["body"] = [];
  let current: BlogPost["body"][number] = { paragraphs: [] };
  for (const block of content.trim().split(/\n\s*\n/)) {
    const value = block.trim();
    if (!value) continue;
    if (value.startsWith("## ")) {
      if (current.heading || current.paragraphs.length) sections.push(current);
      current = { heading: value.slice(3).trim(), paragraphs: [] };
    } else {
      current.paragraphs.push(value.replace(/\s*\n\s*/g, " "));
    }
  }
  if (current.heading || current.paragraphs.length) sections.push(current);
  return sections;
}

function fromRow(row: BlogRow): ManagedBlogPost {
  const words = row.content.trim().split(/\s+/).filter(Boolean).length;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    date: row.published_at ?? new Date().toISOString(),
    readingMinutes: Math.max(1, Math.ceil(words / 220)),
    cover: row.cover_url,
    coverAlt: row.cover_alt,
    body: parseBlogContent(row.content),
    content: row.content,
    metaTitle: row.meta_title ?? undefined,
    metaDescription: row.meta_description ?? undefined,
    focusKeyword: row.focus_keyword ?? undefined,
    isPublished: row.is_published,
  };
}

const getManagedPosts = unstable_cache(async () => {
  if (!supabaseConfigured()) return null;
  const { data, error } = await publicClient()
    .from("blog_posts")
    .select("id,slug,title,excerpt,category,content,cover_url,cover_alt,meta_title,meta_description,focus_keyword,is_published,published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  if (error) return null;
  return (data as BlogRow[]).map(fromRow);
}, ["published-blog-posts"], { tags: ["blog"], revalidate: 300 });

export async function getBlogPosts(): Promise<ManagedBlogPost[]> {
  const managed = await getManagedPosts();
  if (!managed?.length) return fallbackPosts;
  const managedSlugs = new Set(managed.map((post) => post.slug));
  return [...managed, ...fallbackPosts.filter((post) => !managedSlugs.has(post.slug))];
}

export async function getBlogPost(slug: string) {
  return (await getBlogPosts()).find((post) => post.slug === slug);
}
