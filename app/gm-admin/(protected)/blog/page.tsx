import Link from "next/link";
import { getAdminBlogPosts } from "@/lib/admin/blog";
import { deleteBlogPost } from "@/app/gm-admin/blog-actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

export default async function AdminBlogPage({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const [{ posts, error }, query] = await Promise.all([getAdminBlogPosts(), searchParams]);
  return <section>
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-gold">SEO content</p><h1 className="mt-1 font-serif text-3xl uppercase text-navy">Blog posts</h1><p className="mt-2 text-sm text-ink/55">Write, optimize, save drafts and publish without changing code.</p></div>
      <Link href="/gm-admin/blog/new" className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white">New blog post</Link>
    </div>
    {query.ok && <p className="mt-5 rounded-xl bg-[#25D366]/10 px-4 py-3 text-sm text-navy">Post {query.ok}.</p>}
    {error && <p role="alert" className="mt-5 rounded-xl bg-[#C0392B]/10 px-4 py-3 text-sm text-[#C0392B]">Blog table is unavailable. Apply <code>supabase/migrations/0004_blog_posts.sql</code> in Supabase.</p>}
    <div className="mt-7 overflow-hidden rounded-2xl border border-navy/10 bg-white">
      {posts.length ? <ul className="divide-y divide-navy/10">{posts.map(post => <li key={post.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold text-navy">{post.title}</h2><span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${post.is_published ? "bg-[#25D366]/15 text-[#176b37]" : "bg-ink/8 text-ink/55"}`}>{post.is_published ? "Published" : "Draft"}</span></div><p className="mt-1 truncate text-xs text-ink/45">/blog/{post.slug} · {post.category}</p></div>
        <div className="flex gap-2"><Link href={`/gm-admin/blog/${post.id}`} className="rounded-full border border-navy/20 px-4 py-2 text-xs font-semibold text-navy">Edit</Link>{post.is_published && <Link href={`/blog/${post.slug}`} target="_blank" className="rounded-full border border-navy/20 px-4 py-2 text-xs font-semibold text-navy">View ↗</Link>}<form action={deleteBlogPost}><input type="hidden" name="id" value={post.id}/><ConfirmButton message={`Delete “${post.title}”?`} className="rounded-full border border-[#C0392B]/25 px-4 py-2 text-xs font-semibold text-[#C0392B]">Delete</ConfirmButton></form></div>
      </li>)}</ul> : <p className="p-8 text-center text-sm text-ink/50">No managed posts yet. Your existing hardcoded posts remain visible publicly.</p>}
    </div>
  </section>;
}
