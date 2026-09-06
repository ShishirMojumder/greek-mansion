import Link from "next/link";
import { getCategories } from "@/lib/admin/menu";
import { ItemForm } from "@/components/admin/ItemForm";

export default async function NewItemPage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams;
  const categories = await getCategories();
  return (
    <div className="mx-auto max-w-[640px] space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#1E2A78]">New menu item</h1>
        <Link href="/gm-admin/menu" className="text-sm font-semibold text-[#1E2A78]/70 hover:text-[#1E2A78]">
          ← Menu
        </Link>
      </div>
      <ItemForm categories={categories} defaultCategoryId={cat} />
    </div>
  );
}
