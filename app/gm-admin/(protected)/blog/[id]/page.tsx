import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogForm } from "@/components/admin/BlogForm";
import { getAdminBlogPost } from "@/lib/admin/blog";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getAdminBlogPost(id);
  if (!post) notFound();
  return <section className="mx-auto max-w-3xl"><Link href="/gm-admin/blog" className="text-sm font-semibold text-navy/65">← Blog posts</Link><h1 className="mt-4 font-serif text-3xl uppercase text-navy">Edit blog post</h1><div className="mt-7"><BlogForm post={post}/></div></section>;
}
