"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveItem, type ItemFormState } from "@/app/gm-admin/actions";
import { AVAILABILITY, AVAILABILITY_LABEL, BADGES, type Category, type Item } from "@/lib/admin/menu-types";
import { VariantEditor, type VariantRow } from "./VariantEditor";
import { ImageField } from "./ImageField";

const field = "mt-1.5 w-full rounded-lg border border-[#1E2A78]/20 px-3 py-2.5 text-base outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/25";
const label = "block text-sm font-semibold text-[#111936]/70";

const dateVal = (iso: string | null | undefined) => (iso ? iso.slice(0, 10) : "");

export function ItemForm({
  categories,
  item,
  defaultCategoryId,
}: {
  categories: Category[];
  item?: Item;
  defaultCategoryId?: string;
}) {
  const [state, action, pending] = useActionState<ItemFormState, FormData>(saveItem, {});

  const initialVariants: VariantRow[] = item
    ? item.menu_item_variants.map((v) => ({
        name: v.name,
        price: (v.price_cents / 100).toFixed(2),
        is_available: v.is_available,
      }))
    : [];

  return (
    <form action={action} className="space-y-5">
      {item && <input type="hidden" name="id" value={item.id} />}

      <div>
        <label className={label} htmlFor="name">Item name</label>
        <input id="name" name="name" required defaultValue={item?.name ?? ""} className={field} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="category_id">Category</label>
          <select id="category_id" name="category_id" required defaultValue={item?.category_id ?? defaultCategoryId ?? ""} className={field}>
            <option value="" disabled>Choose…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="availability">Availability</label>
          <select id="availability" name="availability" defaultValue={item?.availability ?? "available"} className={field}>
            {AVAILABILITY.map((s) => (
              <option key={s} value={s}>{AVAILABILITY_LABEL[s]}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={label} htmlFor="description">Short description <span className="font-normal text-[#111936]/40">(optional)</span></label>
        <textarea id="description" name="description" rows={2} defaultValue={item?.description ?? ""} className={field} />
      </div>

      <div>
        <p className={label}>Price</p>
        <p className="mt-0.5 text-xs text-[#111936]/45">One row for a single price. Add rows for sizes / combo (e.g. Small, Large).</p>
        <div className="mt-2">
          <VariantEditor initial={initialVariants} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="badge">Badge <span className="font-normal text-[#111936]/40">(optional)</span></label>
          <select id="badge" name="badge" defaultValue={item?.badge ?? ""} className={field}>
            <option value="">None</option>
            {BADGES.map((b) => (
              <option key={b} value={b}>{b[0].toUpperCase() + b.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <p className={label}>Image <span className="font-normal text-[#111936]/40">(optional)</span></p>
          <div className="mt-1.5">
            <ImageField name="image_url" initial={item?.image_url} />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-6 pt-1">
        <label className="flex items-center gap-2 text-sm text-[#111936]/75">
          <input type="checkbox" name="is_featured" defaultChecked={item?.is_featured ?? false} /> Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-[#111936]/75">
          <input type="checkbox" name="is_published" defaultChecked={item?.is_published ?? true} /> Visible on the public menu
        </label>
      </div>

      <details className="rounded-lg border border-[#1E2A78]/12 bg-white p-3">
        <summary className="cursor-pointer text-sm font-semibold text-[#111936]/70">
          Availability window <span className="font-normal text-[#111936]/40">(optional — for specials)</span>
        </summary>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="starts_at">Starts</label>
            <input id="starts_at" name="starts_at" type="date" defaultValue={dateVal(item?.starts_at)} className={field} />
          </div>
          <div>
            <label className={label} htmlFor="ends_at">Ends</label>
            <input id="ends_at" name="ends_at" type="date" defaultValue={dateVal(item?.ends_at)} className={field} />
          </div>
        </div>
      </details>

      {state.error && (
        <p role="alert" className="rounded-lg bg-[#C0392B]/10 px-3 py-2 text-sm text-[#C0392B]">{state.error}</p>
      )}

      <div className="flex gap-3 border-t border-[#1E2A78]/12 pt-5">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-[#1E2A78] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#111936] disabled:opacity-60"
        >
          {pending ? "Saving…" : item ? "Save changes" : "Create item"}
        </button>
        <Link href="/gm-admin/menu" className="rounded-lg border border-[#1E2A78]/20 px-5 py-2.5 text-sm font-semibold text-[#1E2A78] transition hover:bg-white">
          Cancel
        </Link>
      </div>
    </form>
  );
}
