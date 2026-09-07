"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveCategory, type CategoryFormState } from "@/app/gm-admin/actions";
import type { Category } from "@/lib/admin/menu-types";

const field = "mt-1.5 w-full rounded-lg border border-navy/20 px-3 py-2.5 text-base outline-none focus:border-gold";

export function CategoryForm({ category }: { category?: Category }) {
  const [state, action, pending] = useActionState<CategoryFormState, FormData>(saveCategory, {});

  return (
    <form action={action} className="space-y-4 rounded-xl border border-navy/15 bg-white p-4">
      {category && <input type="hidden" name="id" value={category.id} />}
      <div>
        <label className="block text-sm font-semibold text-ink/70" htmlFor="cat-name">
          {category ? "Rename category" : "New category"}
        </label>
        <input id="cat-name" name="name" required defaultValue={category?.name ?? ""} className={field} />
      </div>
      <div>
        <label className="block text-sm font-semibold text-ink/70" htmlFor="cat-desc">
          Description <span className="font-normal text-ink/40">(optional — shows under the category on the menu)</span>
        </label>
        <textarea id="cat-desc" name="description" rows={2} defaultValue={category?.description ?? ""} className={field} />
      </div>
      <label className="flex items-center gap-2 text-sm text-ink/75">
        <input type="checkbox" name="is_active" defaultChecked={category?.is_active ?? true} /> Active (visible on the public menu)
      </label>

      {state.error && (
        <p role="alert" className="rounded-full bg-[#C0392B]/10 px-3 py-2 text-sm text-[#C0392B]">{state.error}</p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink disabled:opacity-60"
        >
          {pending ? "Saving…" : category ? "Save" : "Add category"}
        </button>
        {category && (
          <Link href="/gm-admin/categories" className="rounded-full border border-navy/20 px-4 py-2 text-sm font-semibold text-navy">
            Cancel
          </Link>
        )}
      </div>
    </form>
  );
}
