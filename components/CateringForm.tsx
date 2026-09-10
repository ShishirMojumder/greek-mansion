"use client";

import { useActionState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitCateringEnquiry, type EnquiryResult } from "@/app/actions/catering";

const FIELDS: { name: string; label: string; type?: string; autoComplete?: string }[] = [
  { name: "name", label: "Name", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  { name: "event_date", label: "Event date", type: "date" },
  { name: "guest_count", label: "Guest count", type: "number" },
  { name: "event_type", label: "Event type" },
];

const inputClass =
  "mt-2 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition focus:border-gold focus:bg-white/10";

export default function CateringForm() {
  const [state, action, pending] = useActionState<EnquiryResult | null, FormData>(
    submitCateringEnquiry,
    null,
  );

  if (state?.ok) {
    return (
      <div className="mt-8 rounded-2xl border border-gold/40 bg-white/10 p-7 text-center">
        <CheckCircle2 className="mx-auto text-gold" size={30} />
        <p className="mt-4 font-serif text-2xl uppercase text-white">Request received</p>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/65">
          We have your details and will reply the same day with a menu and a quote. Need it sooner? Call{" "}
          <a href="tel:+14162923333" className="text-gold underline underline-offset-4">416 292 3333</a>.
        </p>
      </div>
    );
  }

  const fieldError = (name: string) => (state?.ok === false ? state.fields?.[name] : undefined);

  return (
    <form action={action} className="mt-8 grid gap-4 sm:grid-cols-2">
      {FIELDS.map((field) => (
        <label className="text-[10px] uppercase tracking-widest text-white/55" key={field.name}>
          {field.label}
          <input
            name={field.name}
            type={field.type ?? "text"}
            autoComplete={field.autoComplete}
            required
            min={field.type === "number" ? 1 : undefined}
            aria-invalid={fieldError(field.name) ? true : undefined}
            className={`${inputClass} ${fieldError(field.name) ? "!border-[#E9A79F]" : ""}`}
          />
        </label>
      ))}

      <label className="text-[10px] uppercase tracking-widest text-white/55 sm:col-span-2">
        Anything we should know?
        <textarea name="message" rows={4} maxLength={2000} className={inputClass} />
      </label>

      {/* Honeypot — hidden from people, catches form-filling bots. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      {state?.ok === false && (
        <p role="alert" className="rounded-lg border border-[#E9A79F]/50 bg-[#E9A79F]/10 px-4 py-3 text-sm text-[#F6D9D4] sm:col-span-2">
          {state.error}
        </p>
      )}

      <button
        disabled={pending}
        className="gold-plate mt-2 flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-xs font-semibold uppercase tracking-[.2em] text-ink transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70 sm:col-span-2"
      >
        {pending && <Loader2 size={15} className="animate-spin" />}
        {pending ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}
