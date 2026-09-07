import Link from "next/link";
import { getCategories } from "@/lib/admin/menu";
import { moveCategory, deleteCategory } from "@/app/gm-admin/actions";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

const OK: Record<string, string> = { created: "Category added.", updated: "Category saved.", deleted: "Category deleted." };

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; ok?: string; err?: string }>;
}) {
  const sp = await searchParams;
  const categories = await getCategories(true);
  const editing = sp.edit ? categories.find((c) => c.id === sp.edit) : undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-navy">Categories</h1>
        <Link href="/gm-admin/menu" className="text-sm font-semibold text-navy/70 hover:text-navy">
          Menu →
        </Link>
      </div>

      {sp.ok && OK[sp.ok] && (
        <p className="rounded-full bg-[#1FA463]/10 px-3 py-2 text-sm text-[#12603a]">{OK[sp.ok]}</p>
      )}
      {sp.err === "notempty" && (
        <p className="rounded-full bg-[#C0392B]/10 px-3 py-2 text-sm text-[#C0392B]">
          That category still has menu items. Move or delete them first, or set it inactive.
        </p>
      )}

      <CategoryForm category={editing} />

      <ul className="divide-y divide-navy/10 overflow-hidden rounded-xl border border-navy/12 bg-white">
        {categories.map((c, i) => (
          <li key={c.id} className="flex flex-wrap items-center gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-navy">
                {c.name}
                {!c.is_active && (
                  <span className="ml-2 rounded bg-ink/8 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink/50">
                    inactive
                  </span>
                )}
              </p>
              <p className="text-xs text-ink/45">
                {c.itemCount} item{c.itemCount === 1 ? "" : "s"}
                {c.description ? ` · ${c.description}` : ""}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <form action={moveCategory}>
                <input type="hidden" name="id" value={c.id} />
                <input type="hidden" name="dir" value="up" />
                <button
                  type="submit"
                  disabled={i === 0}
                  aria-label={`Move ${c.name} up`}
                  className="rounded-full border border-navy/20 px-2.5 py-2 text-sm text-navy disabled:opacity-30"
                >
                  ↑
                </button>
              </form>
              <form action={moveCategory}>
                <input type="hidden" name="id" value={c.id} />
                <input type="hidden" name="dir" value="down" />
                <button
                  type="submit"
                  disabled={i === categories.length - 1}
                  aria-label={`Move ${c.name} down`}
                  className="rounded-full border border-navy/20 px-2.5 py-2 text-sm text-navy disabled:opacity-30"
                >
                  ↓
                </button>
              </form>
              <Link
                href={`/gm-admin/categories?edit=${c.id}`}
                className="rounded-full border border-navy/20 px-3 py-2 text-sm font-semibold text-navy hover:bg-navy hover:text-white"
              >
                Edit
              </Link>
              <form action={deleteCategory}>
                <input type="hidden" name="id" value={c.id} />
                <ConfirmButton
                  message={`Delete "${c.name}"? Only works if it has no items.`}
                  className="rounded-full border border-[#C0392B]/30 px-3 py-2 text-sm font-semibold text-[#C0392B] hover:bg-[#C0392B] hover:text-white"
                >
                  Delete
                </ConfirmButton>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
