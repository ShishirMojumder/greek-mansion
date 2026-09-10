import Link from "next/link";
import { CalendarDays, Clock, Mail, Phone, Users } from "lucide-react";
import { setEnquiryStatus, deleteEnquiry } from "@/app/gm-admin/enquiry-actions";
import {
  getEnquiryBoard,
  ENQUIRY_STATUS,
  ENQUIRY_STATUS_LABEL,
  formatDate,
  formatTime,
  type CateringEnquiry,
  type EnquiryStatus,
} from "@/lib/admin/enquiries";

const STATUS_STYLE: Record<EnquiryStatus, string> = {
  new: "bg-gold/20 text-[#7a6111]",
  contacted: "bg-navy/10 text-navy",
  booked: "bg-[#12603a]/12 text-[#12603a]",
  closed: "bg-ink/8 text-ink/45",
};

export default async function EnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const active = ENQUIRY_STATUS.includes(status as EnquiryStatus) ? (status as EnquiryStatus) : undefined;
  const { today, earlier, newCount, todayCount } = await getEnquiryBoard(active);

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-bold text-navy">Catering enquiries</h1>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-ink/55">
          Every request sent through the catering form on the website, newest first. Times are Toronto time.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-white px-4 py-2 font-semibold text-navy shadow-sm">
            {todayCount} today
          </span>
          <span className="rounded-full bg-gold/20 px-4 py-2 font-semibold text-[#7a6111]">
            {newCount} awaiting reply
          </span>
        </div>
      </div>

      <nav className="flex flex-wrap gap-1.5" aria-label="Filter by status">
        <Filter href="/gm-admin/enquiries" label="All" active={!active} />
        {ENQUIRY_STATUS.map((s) => (
          <Filter
            key={s}
            href={`/gm-admin/enquiries?status=${s}`}
            label={ENQUIRY_STATUS_LABEL[s]}
            active={active === s}
          />
        ))}
      </nav>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[.14em] text-navy/55">Today</h2>
        {today.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-navy/20 bg-white p-8 text-center text-sm text-ink/50">
            No catering requests today{active ? ` with status “${ENQUIRY_STATUS_LABEL[active]}”` : ""}.
          </p>
        ) : (
          <ul className="grid gap-3">
            {today.map((row) => <EnquiryCard key={row.id} row={row} />)}
          </ul>
        )}
      </section>

      {earlier.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[.14em] text-navy/55">Earlier</h2>
          <ul className="grid gap-3">
            {earlier.map((row) => <EnquiryCard key={row.id} row={row} showDate />)}
          </ul>
        </section>
      )}
    </div>
  );
}

function Filter({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active ? "bg-navy text-white" : "text-navy/65 hover:bg-white hover:text-navy"
      }`}
    >
      {label}
    </Link>
  );
}

function EnquiryCard({ row, showDate = false }: { row: CateringEnquiry; showDate?: boolean }) {
  return (
    <li className="rounded-2xl border border-navy/12 bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-navy">{row.name}</p>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink/50">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={13} />
              {formatTime(row.created_at)}
              {showDate && ` · ${formatDate(row.created_at)}`}
            </span>
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[row.status]}`}>
          {ENQUIRY_STATUS_LABEL[row.status]}
        </span>
      </div>

      <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
        <Row icon={<Phone size={14} />} label="Phone">
          <a href={`tel:${row.phone.replace(/[^\d+]/g, "")}`} className="text-navy underline underline-offset-2">
            {row.phone}
          </a>
        </Row>
        <Row icon={<Mail size={14} />} label="Email">
          <a href={`mailto:${row.email}`} className="break-all text-navy underline underline-offset-2">
            {row.email}
          </a>
        </Row>
        <Row icon={<CalendarDays size={14} />} label="Event date">{row.event_date}</Row>
        <Row icon={<Users size={14} />} label="Guests">
          {row.guest_count} · {row.event_type}
        </Row>
      </dl>

      {row.message && (
        <p className="mt-4 whitespace-pre-line rounded-xl bg-marble px-4 py-3 text-sm leading-6 text-ink/70">
          {row.message}
        </p>
      )}

      {row.handled_by && (
        <p className="mt-3 text-xs text-ink/40">
          Marked {ENQUIRY_STATUS_LABEL[row.status].toLowerCase()} by {row.handled_by}
          {row.handled_at && ` · ${formatDate(row.handled_at)}, ${formatTime(row.handled_at)}`}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-navy/10 pt-4">
        {ENQUIRY_STATUS.filter((s) => s !== row.status).map((s) => (
          <form action={setEnquiryStatus} key={s}>
            <input type="hidden" name="id" value={row.id} />
            <input type="hidden" name="status" value={s} />
            <button className="rounded-full border border-navy/20 px-3.5 py-1.5 text-xs font-semibold text-navy transition hover:bg-navy hover:text-white">
              Mark {ENQUIRY_STATUS_LABEL[s].toLowerCase()}
            </button>
          </form>
        ))}
        <form action={deleteEnquiry} className="ml-auto">
          <input type="hidden" name="id" value={row.id} />
          <button className="rounded-full px-3 py-1.5 text-xs font-semibold text-[#8a271d] transition hover:bg-[#8a271d] hover:text-white">
            Delete
          </button>
        </form>
      </div>
    </li>
  );
}

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="mt-0.5 shrink-0 text-navy/40">{icon}</span>
      <span className="shrink-0 text-xs uppercase tracking-wide text-ink/40">{label}</span>
      <span className="min-w-0 text-ink/75">{children}</span>
    </div>
  );
}
