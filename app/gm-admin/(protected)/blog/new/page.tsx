import Link from "next/link";
import { BlogForm } from "@/components/admin/BlogForm";

export default function NewBlogPostPage() {
  return <section className="mx-auto max-w-3xl"><Link href="/gm-admin/blog" className="text-sm font-semibold text-navy/65">← Blog posts</Link><h1 className="mt-4 font-serif text-3xl uppercase text-navy">New blog post</h1><p className="mt-2 text-sm text-ink/50">Save as a draft until the copy and search preview are ready.</p><div className="mt-7"><BlogForm/></div></section>;
}
