import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/Button";
import { posts, getPost } from "@/data/blog";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      images: [post.cover],
    },
  };
}

const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    image: `https://greekmansion.ca${post.cover}`,
    author: { "@type": "Organization", name: "Greek Mansion Restaurant" },
    publisher: {
      "@type": "Organization",
      name: "Greek Mansion Restaurant",
      logo: { "@type": "ImageObject", url: "https://greekmansion.ca/images/greek-mansion-logo.png" },
    },
    mainEntityOfPage: `https://greekmansion.ca/blog/${post.slug}`,
  };

  return <>
    <article className="px-5 pb-28 pt-16 md:px-10 md:pt-24">
      <div className="mx-auto max-w-[720px]">
        <Link href="/blog" className="focus-ring inline-flex items-center gap-2 font-label text-[11px] uppercase tracking-[.16em] text-ink/50 transition hover:text-navy"><ArrowLeft size={14} />All posts</Link>
        <p className="mt-8 font-label text-[10px] uppercase tracking-[.2em] text-gold">{post.category}</p>
        <h1 className="display mt-4 text-4xl uppercase leading-[1.05] text-navy md:text-6xl">{post.title}</h1>
        <p className="mt-4 text-[11px] uppercase tracking-[.14em] text-ink/40">{fmt(post.date)} · {post.readingMinutes} min read</p>
        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-[20px] bg-marble">
          <Image src={post.cover} alt={post.coverAlt} fill priority className="object-cover" sizes="(max-width:768px) 100vw, 720px" />
        </div>
        <div className="mt-10 space-y-8">
          {post.body.map((section, i) => (
            <div key={i} className="space-y-4">
              {section.heading && <h2 className="font-serif text-2xl uppercase text-navy">{section.heading}</h2>}
              {section.paragraphs.map((p, j) => <p key={j} className="text-base leading-8 text-ink/75">{p}</p>)}
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-wrap gap-3 border-t border-navy/10 pt-10">
          <Button href="/menu">See the menu</Button>
          <Button href="/catering" variant="outline">Request catering</Button>
        </div>
      </div>
    </article>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  </>;
}
