import Link from "next/link";
import { getCategories, getItems, AVAILABILITY_LABEL } from "@/lib/admin/menu";
import { formatVariants } from "@/lib/price";
import { AvailabilitySelect } from "@/components/admin/AvailabilitySelect";
import { FilterControls } from "@/components/admin/FilterControls";

const OK: Record<string, string> = {
  created: "Menu item created.",
  updated: "Menu item updated.",
  deleted: "Menu item deleted.",
};

const STATUS_TABS = [
  { key: "", label: "All" },
  { key: "available", label: "Available" },
  { key: "sold_out_today", label: "Sold out" },
  { key: "temporarily_unavailable", label: "Unavailable" },
  { key: "hidden", label: "Hidden" },
];

export default async function MenuAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; cat?: string; ok?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q ?? "";
  const status = sp.status ?? "";
  const cat = sp.cat ?? "";

  const [categories, items] = await Promise.all([
    getCategories(),
    getItems({ q, status, cat }),
  ]);
  const catName = new Map(categories.map((c) => [c.id, c.name]));

  // group by category, preserving category sort order
  const groups = categories
    .map((c) => ({ category: c, items: items.filter((i) => i.category_id === c.id) }))
    .filter((g) => g.items.length > 0);

  const qs = (patch: Record<string, string>) => {
    const p = new URLSearchParams({ ...(q && { q }), ...(status && { status }), ...(cat && { cat }), ...patch });
    for (const [k, v] of [...p.entries()]) if (!v) p.delete(k);
    return `?${p.toString()}`;
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-[#1E2A78]">Menu</h1>
        <Link
          href="/gm-admin/menu/new"
          className="rounded-lg bg-[#1E2A78] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#111936]"
        >
          + Add menu item
        </Link>
      </div>

      {sp.ok && OK[sp.ok] && (
        <p className="rounded-lg bg-[#1FA463]/10 px-3 py-2 text-sm text-[#12603a]">{OK[sp.ok]}</p>
      )}

      <div className="flex flex-wrap gap-1">
        {STATUS_TABS.map((t) => (
          <Link
            key={t.key}
            href={qs({ status: t.key })}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              status === t.key ? "bg-[#1E2A78] text-white" : "border border-[#1E2A78]/20 text-[#1E2A78] hover:bg-white"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <FilterControls q={q} cat={cat} status={status} categories={categories} />

      <p className="text-xs text-[#111936]/45">
        {items.length} item{items.length === 1 ? "" : "s"}
        {(q || status || cat) && (
          <>
            {" "}·{" "}
            <Link href="/gm-admin/menu" className="font-semibold text-[#1E2A78]">
              clear filters
            </Link>
          </>
        )}
      </p>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[#1E2A78]/20 bg-white p-8 text-center text-sm text-[#111936]/50">
          No items match.
        </p>
      ) : (
        <div className="space-y-6">
          {groups.map((g) => (
            <section key={g.category.id}>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-[.16em] text-[#1E2A78]/55">
                {g.category.name}
              </h2>
              <ul className="divide-y divide-[#1E2A78]/10 overflow-hidden rounded-xl border border-[#1E2A78]/12 bg-white">
                {g.items.map((item) => (
                  <li key={item.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[#1E2A78]">
                        {item.name}
                        {item.is_featured && <span className="ml-2 text-xs font-semibold text-[#C9A227]">★</span>}
                        {!item.is_published && (
                          <span className="ml-2 rounded bg-[#111936]/8 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-[#111936]/50">
                            hidden from public
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-[#111936]/45">
                        {catName.get(item.category_id)} ·{" "}
                        {formatVariants(item.menu_item_variants) || "—"}
                        {item.badge ? ` · ${item.badge}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 sm:shrink-0">
                      <AvailabilitySelect id={item.id} value={item.availability} />
                      <Link
                        href={`/gm-admin/menu/${item.id}`}
                        className="rounded-lg border border-[#1E2A78]/20 px-4 py-2.5 text-sm font-semibold text-[#1E2A78] hover:bg-[#1E2A78] hover:text-white"
                      >
                        Edit
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <p className="pt-2 text-[11px] text-[#111936]/40">
        Availability legend — {Object.values(AVAILABILITY_LABEL).join(" · ")}
      </p>
    </div>
  );
}
