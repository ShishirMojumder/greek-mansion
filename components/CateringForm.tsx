"use client";

import type { FormEvent } from "react";

const fields = ["Name", "Email", "Phone", "Event date", "Guest count", "Event type"];
const CATERING_EMAIL = "hello@greekmansion.ca";

export default function CateringForm() {
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = Array.from(data.entries())
      .filter(([, value]) => String(value).trim().length > 0)
      .map(([key, value]) => `${key.replace(/-/g, " ")}: ${value}`)
      .join("\n");
    const subject = `Catering request — ${data.get("name") || "new enquiry"}`;
    window.location.href = `mailto:${CATERING_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-4 sm:grid-cols-2">
      {fields.map((x) => <label className="text-[10px] uppercase tracking-widest text-white/55" key={x}>{x}
        <input name={x.toLowerCase().replace(" ", "-")} required className="mt-2 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition focus:border-gold focus:bg-white/10" />
      </label>)}
      <label className="text-[10px] uppercase tracking-widest text-white/55 sm:col-span-2">Anything we should know?
        <textarea name="message" rows={4} className="mt-2 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition focus:border-gold focus:bg-white/10" />
      </label>
      <button className="mt-2 w-full rounded-full bg-gold px-6 py-4 text-xs font-semibold uppercase tracking-[.2em] text-ink transition hover:brightness-105 sm:col-span-2">Send inquiry</button>
    </form>
  );
}
