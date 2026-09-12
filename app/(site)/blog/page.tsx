import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { getBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Stories from the Greek Mansion kitchen in Scarborough — how we cook gyro and souvlaki, Greek classics explained, and tips for catering a crowd.",
  alternates: { canonical: "/blog" },
};

const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });

export default async function BlogIndex() {
  const posts = await getBlogPosts();
  return <>
    <PageHero
      eyebrow="From the mansion"
      title="The Greek Mansion blog"
      intro="Notes from the kitchen — how the food is made, a few Greek classics explained, and what we've learned catering for a crowd."
    />
    <section className="px-5 pb-28 md:px-10">
      <div className="mx-auto grid max-w-[1240px] gap-8 md:grid-cols-3">
        {posts.map((post) => (
          <article key={post.slug} className="group flex flex-col overflow-hidden rounded-[24px] border border-navy/10 bg-white transition-shadow duration-500 hover:shadow-xl hover:shadow-navy/10">
            <Link href={`/blog/${post.slug}`} className="focus-ring flex flex-1 flex-col">
              <div className="relative aspect-[16/10] overflow-hidden bg-marble">
                <Image src={post.cover} alt={post.coverAlt} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" sizes="(max-width:768px) 100vw, 400px" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="font-label text-[10px] uppercase tracking-[.2em] text-gold">{post.category}</p>
                <h2 className="mt-3 font-serif text-2xl uppercase leading-tight text-navy">{post.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-7 text-ink/60">{post.excerpt}</p>
                <p className="mt-5 text-[11px] uppercase tracking-[.14em] text-ink/40">{fmt(post.date)} · {post.readingMinutes} min read</p>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  </>;
}
