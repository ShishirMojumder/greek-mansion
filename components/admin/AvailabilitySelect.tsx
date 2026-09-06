"use client";

import { useRef, useTransition } from "react";
import { setAvailability } from "@/app/gm-admin/actions";
import { AVAILABILITY, AVAILABILITY_LABEL, type Availability } from "@/lib/admin/menu-types";

const TONE: Record<Availability, string> = {
  available: "border-[#1FA463]/40 bg-[#1FA463]/10 text-[#12603a]",
  sold_out_today: "border-[#C9A227]/50 bg-[#C9A227]/12 text-[#7a6111]",
  temporarily_unavailable: "border-[#C0392B]/40 bg-[#C0392B]/10 text-[#8a271d]",
  hidden: "border-[#111936]/25 bg-[#111936]/5 text-[#111936]/60",
};

export function AvailabilitySelect({ id, value }: { id: string; value: Availability }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, start] = useTransition();

  return (
    <form ref={formRef} action={(fd) => start(() => setAvailability(fd))}>
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={value}
        disabled={pending}
        aria-label="Availability"
        onChange={() => formRef.current?.requestSubmit()}
        className={`w-full min-w-[168px] rounded-lg border px-3 py-2.5 text-sm font-semibold outline-none transition disabled:opacity-60 ${TONE[value]}`}
      >
        {AVAILABILITY.map((s) => (
          <option key={s} value={s}>
            {AVAILABILITY_LABEL[s]}
          </option>
        ))}
      </select>
    </form>
  );
}
