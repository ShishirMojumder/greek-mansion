import Link from "next/link";
import { getStats } from "@/lib/admin/menu";

function ago(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-CA", {
    timeZone: "America/Toronto",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function Dashboard() {
  const s = await getStats();

  if (!s.ok) {
    return (
      <div className="rounded-xl border border-[#C9A227]/40 bg-[#C9A227]/10 p-4 text-sm text-[#111936]/70">
        Couldn&apos;t reach the menu tables. Run <code className="font-mono">supabase/migrations/0001_init.sql</code> and{" "}
        <code className="font-mono">npm run seed:menu -- --commit</code>.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-xl font-bold text-[#1E2A78]">Dashboard</h1>
        <p className="text-xs text-[#111936]/45">Last menu change: {ago(s.lastUpdated)}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Stat label="Menu items" value={s.items} href="/gm-admin/menu" />
        <Stat label="Categories" value={s.categories} href="/gm-admin/categories" />
        <Stat label="Sold out today" value={s.soldOut} href="/gm-admin/menu?status=sold_out_today" tone="gold" />
        <Stat label="Unavailable" value={s.tempUnavail} href="/gm-admin/menu?status=temporarily_unavailable" tone="red" />
        <Stat label="Hidden" value={s.hidden} href="/gm-admin/menu?status=hidden" tone="muted" />
      </div>

      <div className="rounded-xl border border-[#1E2A78]/12 bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-[.14em] text-[#1E2A78]/60">Quick actions</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Action href="/gm-admin/menu/new" primary>+ Add menu item</Action>
          <Action href="/gm-admin/categories">Manage categories</Action>
          <Action href="/gm-admin/menu?status=sold_out_today">Sold-out items</Action>
          <Action href="/menu">View public menu</Action>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  href,
  tone = "navy",
}: {
  label: string;
  value: number;
  href: string;
  tone?: "navy" | "gold" | "red" | "muted";
}) {
  const color =
    tone === "gold" ? "text-[#7a6111]" : tone === "red" ? "text-[#8a271d]" : tone === "muted" ? "text-[#111936]/55" : "text-[#1E2A78]";
  return (
    <Link href={href} className="rounded-xl border border-[#1E2A78]/12 bg-white p-4 transition hover:border-[#1E2A78]/30">
      <p className="text-[11px] font-semibold uppercase tracking-[.14em] text-[#111936]/45">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
    </Link>
  );
}

function Action({ href, children, primary = false }: { href: string; children: React.ReactNode; primary?: boolean }) {
  return (
    <Link
      href={href}
      className={
        primary
          ? "rounded-full bg-[#1E2A78] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#111936]"
          : "rounded-full border border-[#1E2A78]/20 px-4 py-2 text-sm font-semibold text-[#1E2A78] transition hover:bg-white"
      }
    >
      {children}
    </Link>
  );
}
