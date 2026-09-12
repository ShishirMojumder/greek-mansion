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
      <div className="rounded-2xl border border-gold/40 bg-gold/10 p-5 text-sm leading-6 text-ink/70">
        Couldn&apos;t reach the menu tables. Run <code className="font-mono">supabase/migrations/0001_init.sql</code> and{" "}
        <code className="font-mono">npm run seed:menu -- --commit</code>.
      </div>
    );
  }

  const needsAttention = s.soldOut + s.tempUnavail;

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
        <p className="mt-1 text-sm text-ink/50">
          Last menu change: {ago(s.lastUpdated)} · Edits appear on the public site immediately.
        </p>
      </div>

      {/* Most common job first: take something off the menu for today. */}
      <section className="rounded-2xl border border-navy/12 bg-white p-5 md:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-[.14em] text-navy/55">Common tasks</h2>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          <Task href="/gm-admin/menu" title="Mark something sold out" body="Find the dish and change its availability." primary />
          <Task href="/gm-admin/menu/new" title="Add a new dish" body="Name, price, category and photo." />
          <Task href="/gm-admin/featured" title="Change homepage highlights" body="Swap the dishes shown on the home page." />
          <Task href="/gm-admin/specials" title="Update specials" body="What's promoted on the site right now." />
          <Task href="/gm-admin/categories" title="Reorder the menu" body="Rename categories or change their order." />
          <Task href="/gm-admin/blog/new" title="Write an SEO blog post" body="Draft, optimize and publish a new article." />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[.14em] text-navy/55">
          What&apos;s on the menu
        </h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <Stat label="Menu items" value={s.items} note="Total dishes" href="/gm-admin/menu" />
          <Stat label="Categories" value={s.categories} note="Sections on the menu" href="/gm-admin/categories" />
          <Stat
            label="Needs attention"
            value={needsAttention}
            note="Sold out or unavailable"
            href="/gm-admin/menu?status=sold_out_today"
            tone={needsAttention > 0 ? "gold" : "navy"}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[.14em] text-navy/55">
          Hidden from customers
        </h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <Stat
            label="Sold out today"
            value={s.soldOut}
            note="Shown greyed out, back tomorrow"
            href="/gm-admin/menu?status=sold_out_today"
            tone="gold"
          />
          <Stat
            label="Unavailable"
            value={s.tempUnavail}
            note="Off the menu until you switch it back"
            href="/gm-admin/menu?status=temporarily_unavailable"
            tone="red"
          />
          <Stat
            label="Hidden"
            value={s.hidden}
            note="Not shown on the site at all"
            href="/gm-admin/menu?status=hidden"
            tone="muted"
          />
        </div>
      </section>

      <Link
        href="/menu"
        target="_blank"
        className="inline-block text-sm font-semibold text-navy underline decoration-gold decoration-2 underline-offset-4"
      >
        See the public menu as customers do ↗
      </Link>
    </div>
  );
}

function Stat({
  label,
  value,
  note,
  href,
  tone = "navy",
}: {
  label: string;
  value: number;
  note: string;
  href: string;
  tone?: "navy" | "gold" | "red" | "muted";
}) {
  const color =
    tone === "gold" ? "text-[#7a6111]" : tone === "red" ? "text-[#8a271d]" : tone === "muted" ? "text-ink/45" : "text-navy";
  return (
    <Link
      href={href}
      className="rounded-2xl border border-navy/12 bg-white p-4 transition hover:-translate-y-0.5 hover:border-gold hover:shadow-sm md:p-5"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[.14em] text-ink/45">{label}</p>
      <p className={`mt-1.5 text-3xl font-bold ${color}`}>{value}</p>
      <p className="mt-1 text-xs leading-5 text-ink/45">{note}</p>
    </Link>
  );
}

function Task({
  href,
  title,
  body,
  primary = false,
}: {
  href: string;
  title: string;
  body: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-xl border p-4 transition ${
        primary
          ? "border-navy bg-navy text-white hover:bg-ink"
          : "border-navy/15 bg-marble/60 hover:border-gold hover:bg-white"
      }`}
    >
      <p className={`text-sm font-bold ${primary ? "text-white" : "text-navy"}`}>{title}</p>
      <p className={`mt-0.5 text-xs leading-5 ${primary ? "text-white/65" : "text-ink/50"}`}>{body}</p>
    </Link>
  );
}
