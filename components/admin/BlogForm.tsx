"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveBlogPost, type BlogFormState } from "@/app/gm-admin/blog-actions";
import type { AdminBlogPost } from "@/lib/admin/blog";
import { ImageField } from "@/components/admin/ImageField";

const field = "mt-1.5 w-full rounded-xl border border-navy/20 bg-white px-3 py-2.5 text-base outline-none focus:border-gold focus:ring-2 focus:ring-gold/25";
const label = "block text-sm font-semibold text-ink/70";

export function BlogForm({ post }: { post?: AdminBlogPost }) {
  const [state, action, pending] = useActionState<BlogFormState, FormData>(saveBlogPost, {});
  return <form action={action} className="space-y-6">
    {post && <input type="hidden" name="id" value={post.id}/>} 

    <div>
      <label className={label} htmlFor="title">Post title</label>
      <input id="title" name="title" required maxLength={100} defaultValue={post?.title ?? ""} className={field}/>
      <p className="mt-1 text-xs text-ink/45">Clear, specific titles work better than keyword stuffing.</p>
    </div>

    <div className="grid gap-5 sm:grid-cols-2">
      <div><label className={label} htmlFor="slug">URL slug <span className="font-normal text-ink/40">(optional)</span></label><input id="slug" name="slug" defaultValue={post?.slug ?? ""} placeholder="generated-from-title" className={field}/></div>
      <div><label className={label} htmlFor="category">Category</label><input id="category" name="category" required defaultValue={post?.category ?? "Greek food"} className={field}/></div>
    </div>

    <div>
      <label className={label} htmlFor="excerpt">Search and card excerpt</label>
      <textarea id="excerpt" name="excerpt" required minLength={40} maxLength={180} rows={3} defaultValue={post?.excerpt ?? ""} className={field}/>
      <p className="mt-1 text-xs text-ink/45">40–180 characters. This appears on Google when no separate meta description is supplied.</p>
    </div>

    <div>
      <label className={label} htmlFor="content">Article</label>
      <textarea id="content" name="content" required minLength={200} rows={18} defaultValue={post?.content ?? ""} placeholder={"Opening paragraph…\n\n## A useful section heading\n\nSection paragraph…"} className={`${field} font-mono text-sm leading-7`}/>
      <p className="mt-1 text-xs text-ink/45">Separate paragraphs with a blank line. Start a section heading with <code>## </code>.</p>
    </div>

    <fieldset className="rounded-2xl border border-navy/10 bg-marble p-5">
      <legend className="px-2 font-serif text-xl uppercase text-navy">Cover image</legend>
      <ImageField name="cover_url" initial={post?.cover_url} library={[]}/>
      <label className={`${label} mt-4`} htmlFor="cover_alt">Image description</label>
      <input id="cover_alt" name="cover_alt" required maxLength={160} defaultValue={post?.cover_alt ?? ""} placeholder="Describe the food and setting naturally" className={field}/>
    </fieldset>

    <fieldset className="rounded-2xl border border-navy/10 bg-white p-5">
      <legend className="px-2 font-serif text-xl uppercase text-navy">Google preview settings</legend>
      <div className="space-y-5">
        <div><label className={label} htmlFor="focus_keyword">Focus phrase <span className="font-normal text-ink/40">(planning only)</span></label><input id="focus_keyword" name="focus_keyword" maxLength={80} defaultValue={post?.focus_keyword ?? ""} placeholder="best gyro in Scarborough" className={field}/></div>
        <div><label className={label} htmlFor="meta_title">SEO title <span className="font-normal text-ink/40">(max 60)</span></label><input id="meta_title" name="meta_title" maxLength={60} defaultValue={post?.meta_title ?? ""} placeholder="Defaults to the post title" className={field}/></div>
        <div><label className={label} htmlFor="meta_description">Meta description <span className="font-normal text-ink/40">(max 160)</span></label><textarea id="meta_description" name="meta_description" maxLength={160} rows={3} defaultValue={post?.meta_description ?? ""} placeholder="Defaults to the excerpt" className={field}/></div>
      </div>
    </fieldset>

    <label className="flex items-start gap-3 rounded-xl bg-gold/10 p-4 text-sm text-ink/75">
      <input type="checkbox" name="is_published" defaultChecked={post?.is_published ?? false} className="mt-0.5"/>
      <span><strong className="block text-navy">Publish immediately</strong>Leave unchecked to save a private draft.</span>
    </label>

    {state.error && <p role="alert" className="rounded-xl bg-[#C0392B]/10 px-4 py-3 text-sm text-[#C0392B]">{state.error}</p>}
    <div className="flex flex-wrap gap-3 border-t border-navy/10 pt-5">
      <button disabled={pending} className="rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink disabled:opacity-60">{pending ? "Saving…" : post ? "Save post" : "Create post"}</button>
      <Link href="/gm-admin/blog" className="rounded-full border border-navy/20 px-6 py-3 text-sm font-semibold text-navy">Cancel</Link>
    </div>
  </form>;
}
