import Image from "next/image";
import Link from "next/link";
import { setFeatured, setItemImage } from "@/app/gm-admin/actions";
import { getFeaturedBoard, featuredBlocker, FEATURED_LIMIT, HIGHLIGHT_SLOTS } from "@/lib/admin/menu";
import { formatVariants } from "@/lib/price";
import type { Item } from "@/lib/admin/menu-types";
import { getImageLibrary, suggestImages, type LibraryImage } from "@/lib/admin/image-library";

export default async function FeaturedPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const [{ featured, candidates, liveCount, highlightIds }, library] = await Promise.all([getFeaturedBoard(q), getImageLibrary()]);
  const full = liveCount >= FEATURED_LIMIT;

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-bold text-navy">Homepage highlights</h1>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-ink/55">
          These dishes appear in the <strong>Featured dishes</strong> carousel on the home page, and the first{" "}
          {HIGHLIGHT_SLOTS} of them also fill the <strong>Greek favourites</strong> row further down. Swap them whenever
          your best sellers change — the site updates right away. Up to {FEATURED_LIMIT} show at once, and a dish needs a
          photo before it can appear.
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/55">
          Order follows the menu: a dish&apos;s category position, then its position inside that category. Clicking any dish
          on the home page opens the menu scrolled straight to it.
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
            {liveCount < HIGHLIGHT_SLOTS && ` · Greek favourites needs ${HIGHLIGHT_SLOTS}`}
            {featured.length !== liveCount && ` · ${featured.length - liveCount} can’t show yet`}
          </p>
        </div>

        {liveCount > 0 && liveCount < HIGHLIGHT_SLOTS && (
          <p className="mb-3 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-ink/70">
            Only {liveCount} dish{liveCount === 1 ? "" : "es"} can show right now. The Greek favourites row holds{" "}
            {HIGHLIGHT_SLOTS}, so the empty slots fall back to house classics until you add{" "}
            {HIGHLIGHT_SLOTS - liveCount} more.
          </p>
        )}

        {featured.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-navy/20 bg-white p-8 text-center text-sm text-ink/50">
            Nothing highlighted yet. Pick dishes from the list below.
          </p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((item) => (
              <FeaturedCard key={item.id} item={item} library={library} inHighlights={highlightIds.has(item.id)} />
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
                    {blocker === "Needs a photo" && <PhotoPicks item={item} library={library} compact />}
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

function FeaturedCard({ item, library, inHighlights }: { item: Item; library: LibraryImage[]; inHighlights: boolean }) {
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
          <>
            <p className="mt-2 rounded-lg bg-[#8a271d]/8 px-2.5 py-1.5 text-xs font-semibold text-[#8a271d]">
              Not showing — {blocker.toLowerCase()}.{" "}
              <Link href={`/gm-admin/menu/${item.id}`} className="underline">
                Fix
              </Link>
            </p>
            {blocker === "Needs a photo" && <PhotoPicks item={item} library={library} />}
          </>
        ) : (
          <p className="mt-2 text-xs font-semibold text-[#12603a]">
            {inHighlights ? "Showing in the carousel and the Greek favourites row" : "Showing in the carousel"}
          </p>
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

/** One-click photo assignment from the images already in /public/images.
 *  Ranked by how well the filename matches the dish name. */
function PhotoPicks({ item, library, compact = false }: { item: Item; library: LibraryImage[]; compact?: boolean }) {
  const picks = suggestImages(item.name, library, compact ? 3 : 4);
  if (picks.length === 0) {
    return (
      <p className={`text-xs text-ink/45 ${compact ? "mt-1" : "mt-2"}`}>
        No matching photo in the library —{" "}
        <Link href={`/gm-admin/menu/${item.id}`} className="font-semibold text-navy underline">
          pick or upload one
        </Link>
        .
      </p>
    );
  }
  return (
    <div className={compact ? "mt-1.5" : "mt-2"}>
      <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-ink/40">Use one of these</p>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {picks.map((image) => (
          <form action={setItemImage} key={image.url}>
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="image_url" value={image.url} />
            <button
              type="submit"
              title={`Use ${image.label}`}
              className="block overflow-hidden rounded-md border border-navy/15 transition hover:border-gold hover:ring-2 hover:ring-gold/30"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt={image.label} className="h-11 w-14 object-cover" />
            </button>
          </form>
        ))}
        <Link
          href={`/gm-admin/menu/${item.id}`}
          className="grid h-11 w-14 place-items-center rounded-md border border-dashed border-navy/25 text-[10px] font-semibold text-navy/60 hover:border-gold"
        >
          More
        </Link>
      </div>
    </div>
  );
}
