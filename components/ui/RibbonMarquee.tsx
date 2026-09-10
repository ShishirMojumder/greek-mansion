/** Tilted marquee band that rules a line across a section, the way a takeaway
 *  window sticker does. Two identical copies of the track slide by, so the
 *  loop is seamless; `reverse` runs it left-to-right.
 *
 *  Decorative — the phrases repeat forever, so it is hidden from screen
 *  readers rather than read out on a loop.
 */
/** One half of the loop repeats the phrases this many times, so even an
 *  ultra-wide screen never sees the end of the band. */
const REPEATS = 4;

export function RibbonMarquee({
  items,
  tone = "gold",
  seconds = 38,
  className = "",
}: {
  items: string[];
  tone?: "gold" | "navy" | "marble";
  seconds?: number;
  className?: string;
}) {
  const tones = {
    gold: "gold-plate text-ink",
    navy: "bg-navy text-white",
    marble: "bg-marble text-navy",
  };

  // Repeat first, so each half is comfortably wider than any viewport.
  const filled = Array.from({ length: REPEATS }, (_, pass) =>
    items.map((item) => ({ item, key: `${pass}-${item}` })),
  ).flat();

  const track = (
    <ul className="flex shrink-0 items-center">
      {filled.map(({ item, key }) => (
        <li key={key} className="flex items-center gap-5 whitespace-nowrap px-5 font-label text-[11px] uppercase tracking-[.18em] sm:text-sm sm:tracking-[.2em]">
          {item}
          {/* Greek key tile, standing in for the reference's emoji separators. */}
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3 w-3 shrink-0 opacity-70 sm:h-3.5 sm:w-3.5">
            <path
              d="M2 2h20v20H2V2zm4 4v12h12V6H6zm3 3h6v6h-6V9z"
              fill="currentColor"
            />
          </svg>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative w-full overflow-hidden py-2.5 shadow-lg shadow-black/15 sm:py-3 ${tones[tone]} ${className}`}
    >
      <div
        className="hero-marquee flex w-max [animation-direction:reverse]"
        style={{ animationDuration: `${seconds}s` }}
      >
        {track}
        {track}
      </div>
    </div>
  );
}
