import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { AdminLogo } from "@/components/admin/AdminLogo";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin();

  return (
    <div className="min-h-screen">
      {/* Brand bar — navy so the admin never gets mistaken for the public site. */}
      <header className="bg-navy">
        <div className="mx-auto flex max-w-[1080px] items-center gap-4 px-4 py-3.5 md:px-8">
          <Link href="/gm-admin" aria-label="Admin dashboard" className="shrink-0">
            <AdminLogo white className="w-[124px] md:w-[150px]" />
          </Link>

          <span className="ml-auto hidden text-xs text-white/45 sm:inline">{user.email}</span>

          <Link
            href="/"
            target="_blank"
            className="hidden rounded-full border border-white/25 px-3.5 py-2 text-xs font-semibold text-white/75 transition hover:border-gold hover:text-white md:inline-block"
          >
            View site ↗
          </Link>

          <form action="/gm-admin/logout" method="post" className="ml-auto shrink-0 sm:ml-0">
            <button
              type="submit"
              className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-gold hover:text-ink"
            >
              Log out
            </button>
          </form>
        </div>
      </header>

      {/* Section tabs stay reachable while scrolling long menu lists. */}
      <div className="sticky top-0 z-40 border-b border-navy/10 bg-marble/95 backdrop-blur">
        <div className="mx-auto max-w-[1080px] px-4 py-2.5 md:px-8">
          <AdminNav />
        </div>
      </div>

      <main className="mx-auto max-w-[1080px] px-4 py-6 md:px-8 md:py-9">{children}</main>
    </div>
  );
}
