import Image from "next/image";
import Link from "next/link";
import { setFeatured } from "@/app/gm-admin/actions";
import { getFeaturedBoard, featuredBlocker, FEATURED_LIMIT } from "@/lib/admin/menu";
import { formatVariants } from "@/lib/price";
import type { Item } from "@/lib/admin/menu-types";

export default async function FeaturedPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const { featured, candidates, liveCount } = await getFeaturedBoard(q);
  const full = liveCount >= FEATURED_LIMIT;

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-bold text-navy">Homepage highlights</h1>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-ink/55">
          These dishes appear in the <strong>Featured dishes</strong> strip on the home page. Swap them whenever your
          best sellers change — the site updates right away. Up to {FEATURED_LIMIT} show at once.
        </p>
      </div>

      {/* Current picks */}
      <section>
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-[.14em] text-navy/55">
            On the home page now
          </h2>
          <p className="text-xs text-ink/45">
            {liveCount} showing
            {featured.length !== liveCount && ` · ${featured.length - liveCount} can’t show yet`}
          </p>
        </div>

        {featured.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-navy/20 bg-white p-8 text-center text-sm text-ink/50">
            Nothing highlighted yet. Pick dishes from the list below.
          </p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((item) => (
              <FeaturedCard key={item.id} item={item} />
            ))}
          </ul>
        )}
      </section>

      {/* Picker */}
      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-[.14em] text-navy/55">Add a dish</h2>
          <form method="get" className="flex gap-2">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search dishes…"
              className="min-w-[170px] rounded-full border border-navy/20 px-4 py-2 text-sm outline-none focus:border-gold"
            />
            <button className="rounded-full border border-navy/20 px-4 py-2 text-sm font-semibold text-navy hover:bg-white">
              Search
            </button>
            {q && (
              <Link href="/gm-admin/featured" className="self-center text-xs font-semibold text-navy underline">
                clear
              </Link>
            )}
          </form>
        </div>

        {full && (
          <p className="mb-3 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-ink/70">
            {FEATURED_LIMIT} dishes are already showing. Adding another won’t appear until you remove one.
          </p>
        )}

        {candidates.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-navy/20 bg-white p-8 text-center text-sm text-ink/50">
            No dishes match &ldquo;{q}&rdquo;.
          </p>
        ) : (
          <ul className="divide-y divide-navy/10 overflow-hidden rounded-2xl border border-navy/12 bg-white">
            {candidates.map((item) => {
              const blocker = featuredBlocker(item);
              return (
                <li key={item.id} className="flex items-center gap-3 p-3 sm:p-4">
                  <Thumb src={item.image_url} className="h-12 w-12 shrink-0 sm:h-14 sm:w-14" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-navy">{item.name}</p>
                    <p className="truncate text-xs text-ink/45">
                      {item.category?.name ?? "—"} · {formatVariants(item.menu_item_variants) || "—"}
                    </p>
                    {blocker && <p className="mt-0.5 text-xs font-semibold text-[#8a271d]">{blocker}</p>}
                  </div>
                  <Toggle id={item.id} featured={false} disabled={Boolean(blocker)} />
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function FeaturedCard({ item }: { item: Item }) {
  const blocker = featuredBlocker(item);
  return (
    <li
      className={`overflow-hidden rounded-2xl border bg-white ${
        blocker ? "border-[#8a271d]/35" : "border-navy/12"
      }`}
    >
      <Thumb src={item.image_url} className="h-32 w-full rounded-none" />
      <div className="p-4">
        <p className="truncate font-semibold text-navy">{item.name}</p>
        <p className="truncate text-xs text-ink/45">
          {item.category?.name ?? "—"} · {formatVariants(item.menu_item_variants) || "—"}
        </p>

        {blocker ? (
          <p className="mt-2 rounded-lg bg-[#8a271d]/8 px-2.5 py-1.5 text-xs font-semibold text-[#8a271d]">
            Not showing — {blocker.toLowerCase()}.{" "}
            <Link href={`/gm-admin/menu/${item.id}`} className="underline">
              Fix
            </Link>
          </p>
        ) : (
          <p className="mt-2 text-xs font-semibold text-[#12603a]">Showing on the home page</p>
        )}

        <div className="mt-3 flex items-center gap-2">
          <Toggle id={item.id} featured />
          <Link
            href={`/gm-admin/menu/${item.id}`}
            className="rounded-full border border-navy/20 px-3.5 py-2 text-sm font-semibold text-navy hover:bg-navy hover:text-white"
          >
            Edit
          </Link>
        </div>
      </div>
    </li>
  );
}

function Toggle({ id, featured, disabled = false }: { id: string; featured: boolean; disabled?: boolean }) {
  return (
    <form action={setFeatured} className="shrink-0">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="featured" value={featured ? "false" : "true"} />
      <button
        type="submit"
        disabled={disabled}
        title={disabled ? "Add a photo and publish this item first" : undefined}
        className={
          featured
            ? "rounded-full border border-navy/20 px-3.5 py-2 text-sm font-semibold text-navy transition hover:border-[#8a271d] hover:bg-[#8a271d] hover:text-white"
            : "rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:bg-ink/20 disabled:text-ink/45"
        }
      >
        {featured ? "Remove" : "Add"}
      </button>
    </form>
  );
}

function Thumb({ src, className = "" }: { src: string | null; className?: string }) {
  if (!src) {
    return (
      <div className={`grid place-items-center rounded-lg bg-marble text-[10px] font-semibold uppercase tracking-wider text-ink/30 ${className}`}>
        No photo
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden rounded-lg bg-marble ${className}`}>
      <Image src={src} alt="" fill sizes="220px" className="object-cover" />
    </div>
  );
}
