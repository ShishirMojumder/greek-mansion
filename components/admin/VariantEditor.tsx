"use client";

import { useState } from "react";

export type VariantRow = { name: string; price: string; is_available: boolean };

export function VariantEditor({ initial }: { initial: VariantRow[] }) {
  const [rows, setRows] = useState<VariantRow[]>(
    initial.length ? initial : [{ name: "", price: "", is_available: true }],
  );

  const patch = (i: number, p: Partial<VariantRow>) =>
    setRows((r) => r.map((row, j) => (j === i ? { ...row, ...p } : row)));

  return (
    <div className="space-y-2">
      {rows.map((row, i) => (
        <div key={i} className="flex flex-wrap items-center gap-2 rounded-lg border border-[#1E2A78]/12 bg-white p-2">
          <input
            value={row.name}
            onChange={(e) => patch(i, { name: e.target.value })}
            placeholder="Size / option — leave blank if one price"
            className="min-w-[150px] flex-1 rounded-md border border-[#1E2A78]/20 px-3 py-2.5 text-sm outline-none focus:border-[#C9A227]"
          />
          <div className="flex items-center gap-1 rounded-md border border-[#1E2A78]/20 px-2 focus-within:border-[#C9A227]">
            <span className="text-sm text-[#111936]/45">$</span>
            <input
              value={row.price}
              onChange={(e) => patch(i, { price: e.target.value.replace(/[^0-9.]/g, "") })}
              inputMode="decimal"
              placeholder="0.00"
              className="w-20 py-2.5 text-sm outline-none"
            />
          </div>
          <label className="flex items-center gap-1.5 whitespace-nowrap text-xs text-[#111936]/60">
            <input type="checkbox" checked={row.is_available} onChange={(e) => patch(i, { is_available: e.target.checked })} />
            available
          </label>
          {rows.length > 1 && (
            <button
              type="button"
              onClick={() => setRows((r) => r.filter((_, j) => j !== i))}
              className="rounded-md px-2 py-1 text-xs font-semibold text-[#C0392B] hover:bg-[#C0392B]/10"
            >
              Remove
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => setRows((r) => [...r, { name: "", price: "", is_available: true }])}
        className="text-sm font-semibold text-[#1E2A78] hover:underline"
      >
        + Add size / option
      </button>
      <input type="hidden" name="variants" value={JSON.stringify(rows)} />
    </div>
  );
}
