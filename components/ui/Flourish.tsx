/** Hand-drawn squiggle that sits under a section heading. Inherits the text
 *  colour, so it works on marble, white and navy alike. */
export function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 180 14"
      fill="none"
      className={`h-3 w-[150px] ${className}`}
    >
      <path
        d="M2 8.5C14 2 26 2 38 8.5S62 15 74 8.5 98 2 110 8.5s24 6.5 36 0 24-6.5 32-2.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Tilted sticker pill, the way a takeaway menu stamps a callout on the page. */
export function StickerBadge({
  children,
  tone = "gold",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "gold" | "navy";
  className?: string;
}) {
  const tones = {
    gold: "gold-plate text-ink shadow-gold/25",
    navy: "bg-navy text-white shadow-navy/30",
  };
  return (
    <span
      className={`inline-flex select-none items-center rounded-full px-4 py-2 font-label text-[10px] uppercase tracking-[.16em] shadow-lg ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
