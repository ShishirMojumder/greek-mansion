import Link from "next/link";
import { requireAdmin } from "@/lib/auth";

const NAV = [
  { href: "/gm-admin", label: "Dashboard" },
  { href: "/gm-admin/menu", label: "Menu" },
  { href: "/gm-admin/categories", label: "Categories" },
  { href: "/gm-admin/specials", label: "Specials" },
];

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin();

  return (
    <div className="mx-auto max-w-[1080px] px-4 py-6 md:px-8 md:py-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1E2A78]/12 pb-5">
        <Link href="/gm-admin" className="leading-tight">
          <span className="block text-[10px] font-semibold uppercase tracking-[.24em] text-[#C9A227]">Greek Mansion</span>
          <span className="block text-lg font-bold text-[#1E2A78]">Admin</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-[#111936]/50 sm:inline">{user.email}</span>
          <form action="/gm-admin/logout" method="post">
            <button
              type="submit"
              className="rounded-lg border border-[#1E2A78]/20 px-4 py-2 text-sm font-semibold text-[#1E2A78] transition hover:bg-[#1E2A78] hover:text-white"
            >
              Log out
            </button>
          </form>
        </div>
      </header>

      <nav className="mt-4 flex flex-wrap gap-1">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className="rounded-lg px-3 py-2 text-sm font-medium text-[#1E2A78]/70 transition hover:bg-white hover:text-[#1E2A78]"
          >
            {n.label}
          </Link>
        ))}
      </nav>

      <main className="mt-6">{children}</main>
    </div>
  );
}
