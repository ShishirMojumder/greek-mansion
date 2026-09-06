/** The instant an item marked "sold out today" should auto-clear:
 *  the next 04:00 America/Toronto (after close, before open), as a UTC ISO string. */
export function nextResetUtc(now = new Date()): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Toronto",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  ) as Record<string, string>;

  const y = Number(parts.year);
  const mo = Number(parts.month);
  const d = Number(parts.day);
  const h = Number(parts.hour);
  const mi = Number(parts.minute);

  // Toronto UTC offset at `now` (negative: ~ -4h EDT / -5h EST).
  const offsetMs = Date.UTC(y, mo - 1, d, h, mi) - now.getTime();

  // Target: today 04:00 local, or tomorrow if it's already past 04:00.
  const targetLocalWall = Date.UTC(y, mo - 1, d + (h >= 4 ? 1 : 0), 4, 0, 0);
  return new Date(targetLocalWall - offsetMs).toISOString();
}
