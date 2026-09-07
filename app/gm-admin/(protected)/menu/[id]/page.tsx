import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getItem } from "@/lib/admin/menu";
import { deleteItem } from "@/app/gm-admin/actions";
import { ItemForm } from "@/components/admin/ItemForm";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

export default async function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [categories, item] = await Promise.all([getCategories(), getItem(id)]);
  if (!item) notFound();

  return (
    <div className="mx-auto max-w-[640px] space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-navy">Edit menu item</h1>
        <Link href="/gm-admin/menu" className="text-sm font-semibold text-navy/70 hover:text-navy">
          ← Menu
        </Link>
      </div>

      <p className="text-xs text-ink/45">
        Last updated{" "}
        {new Date(item.updated_at).toLocaleString("en-CA", {
          timeZone: "America/Toronto",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })}
      </p>

      <ItemForm categories={categories} item={item} />

      <form action={deleteItem} className="border-t border-navy/12 pt-5">
        <input type="hidden" name="id" value={item.id} />
        <ConfirmButton
          message={`Delete "${item.name}"? This cannot be undone. (To hide it instead, set Availability to Hidden.)`}
          className="rounded-full border border-[#C0392B]/30 px-4 py-2.5 text-sm font-semibold text-[#C0392B] transition hover:bg-[#C0392B] hover:text-white"
        >
          Delete this item
        </ConfirmButton>
      </form>
    </div>
  );
}
