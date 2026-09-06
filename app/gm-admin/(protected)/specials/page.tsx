import Link from "next/link";
import { getCategories, getItems } from "@/lib/admin/menu";
import { formatVariants } from "@/lib/price";
import { AvailabilitySelect } from "@/components/admin/AvailabilitySelect";

const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-CA", { timeZone: "America/Toronto", month: "short", day: "numeric", year: "numeric" }) : null;

export default async function SpecialsPage() {
  const categories = await getCategories();
  const specials = categories.find((c) => c.slug === "specials" || c.name.toLowerCase() === "specials");

  if (!specials) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-[#1E2A78]">Specials</h1>
        <p className="rounded-xl border border-dashed border-[#1E2A78]/20 bg-white p-6 text-sm text-[#111936]/55">
          There is no &ldquo;Specials&rdquo; category yet.{" "}
          <Link href="/gm-admin/categories" className="font-semibold text-[#1E2A78]">
            Create one
          </Link>{" "}
          and items added to it will appear here.
        </p>
      </div>
    );
  }

  const items = await getItems({ cat: specials.id });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-[#1E2A78]">Specials</h1>
        <Link
          href={`/gm-admin/menu/new?cat=${specials.id}`}
          className="rounded-full bg-[#1E2A78] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#111936]"
        >
          + Add special
        </Link>
      </div>
      <p className="text-xs text-[#111936]/45">
        Everything in the <strong>{specials.name}</strong> category. Set a start / end date on each item&apos;s editor
        (&ldquo;Availability window&rdquo;) if it&apos;s time-limited.
      </p>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[#1E2A78]/20 bg-white p-8 text-center text-sm text-[#111936]/50">
          No specials yet.
        </p>
      ) : (
        <ul className="divide-y divide-[#1E2A78]/10 overflow-hidden rounded-xl border border-[#1E2A78]/12 bg-white">
          {items.map((item) => {
            const start = fmtDate(item.starts_at);
            const end = fmtDate(item.ends_at);
            return (
              <li key={item.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[#1E2A78]">
                    {item.name}
                    {!item.is_published && (
                      <span className="ml-2 rounded bg-[#111936]/8 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-[#111936]/50">
                        inactive
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-[#111936]/45">
                    {formatVariants(item.menu_item_variants) || "—"}
                    {(start || end) && ` · ${start ?? "…"} – ${end ?? "…"}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:shrink-0">
                  <AvailabilitySelect id={item.id} value={item.availability} />
                  <Link
                    href={`/gm-admin/menu/${item.id}`}
                    className="rounded-full border border-[#1E2A78]/20 px-4 py-2.5 text-sm font-semibold text-[#1E2A78] hover:bg-[#1E2A78] hover:text-white"
                  >
                    Edit
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
