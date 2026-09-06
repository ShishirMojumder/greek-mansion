"use client";

import { useEffect, useState } from "react";

// Open minutes-since-midnight → close, per weekday, in the restaurant's local time.
// Mon–Thu 11:00–21:00 · Fri–Sat 11:00–22:00 · Sun 12:00–21:00
const HOURS: Record<string, [number, number]> = {
  Sun: [12 * 60, 21 * 60],
  Mon: [11 * 60, 21 * 60],
  Tue: [11 * 60, 21 * 60],
  Wed: [11 * 60, 21 * 60],
  Thu: [11 * 60, 21 * 60],
  Fri: [11 * 60, 22 * 60],
  Sat: [11 * 60, 22 * 60],
};

const ZONE = "America/Toronto";

function read(now: Date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone: ZONE, weekday: "short", hour: "numeric", minute: "numeric", hour12: false })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  ) as Record<string, string>;
  const minutes = Number(parts.hour) * 60 + Number(parts.minute);
  const [open, close] = HOURS[parts.weekday] ?? [11 * 60, 21 * 60];
  const clock = new Intl.DateTimeFormat("en-US", { timeZone: ZONE, hour: "numeric", minute: "2-digit", hour12: true }).format(now);
  return { isOpen: minutes >= open && minutes < close, clock };
}

export function OpenStatus({ className = "" }: { className?: string }) {
  const [state, setState] = useState<{ isOpen: boolean; clock: string } | null>(null);

  useEffect(() => {
    const tick = () => setState(read(new Date()));
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, []);

  if (!state) return null;

  return (
    <div
      className={`flex items-center gap-2 font-label text-[11px] uppercase tracking-[.12em] ${className}`}
      role="status"
      aria-label={`${state.isOpen ? "Open now" : "Closed now"}, Scarborough time ${state.clock}`}
    >
      <span className={`h-2 w-2 shrink-0 rounded-full ${state.isOpen ? "bg-[#1FA463]" : "bg-ink/35"}`} aria-hidden="true" />
      <span className="font-semibold text-ink/75">{state.isOpen ? "Open now" : "Closed now"}</span>
      <span className="hidden text-ink/45 sm:inline">· {state.clock}</span>
    </div>
  );
}
