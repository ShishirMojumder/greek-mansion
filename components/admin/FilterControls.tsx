"use client";

import type { Category } from "@/lib/admin/menu-types";

export function FilterControls({
  q,
  cat,
  status,
  categories,
}: {
  q: string;
  cat: string;
  status: string;
  categories: Category[];
}) {
  return (
    <form method="get" className="flex flex-wrap items-center gap-2">
      {status && <input type="hidden" name="status" value={status} />}
      <input
        name="q"
        defaultValue={q}
        placeholder="Search items…"
        className="min-w-[180px] flex-1 rounded-lg border border-navy/20 px-3 py-2.5 text-sm outline-none focus:border-gold"
      />
      <select
        name="cat"
        defaultValue={cat}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-full border border-navy/20 px-3 py-2.5 text-sm outline-none focus:border-gold"
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="rounded-full border border-navy/20 px-4 py-2.5 text-sm font-semibold text-navy hover:bg-white"
      >
        Search
      </button>
    </form>
  );
}
