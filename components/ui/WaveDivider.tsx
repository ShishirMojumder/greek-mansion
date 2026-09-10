/** Soft, hand-drawn-feeling wave that hands one section off to the next.
 *  Set the colour of the *neighbouring* section with `className` (the path
 *  paints in currentColor), so the wave reads as that section spilling over. */
export function WaveDivider({
  position,
  className = "",
}: {
  position: "top" | "bottom";
  className?: string;
}) {
  // Two crests and a trough — deliberately uneven, so it looks poured rather
  // than generated. The bottom variant is the top one flipped.
  const path =
    position === "top"
      ? "M0,0 H1440 V34 C1318,34 1268,74 1150,74 C1020,74 968,26 840,26 C700,26 654,78 520,78 C398,78 356,38 236,38 C140,38 92,62 0,62 Z"
      : "M0,120 H1440 V86 C1318,86 1268,46 1150,46 C1020,46 968,94 840,94 C700,94 654,42 520,42 C398,42 356,82 236,82 C140,82 92,58 0,58 Z";

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 ${
        position === "top" ? "top-0" : "bottom-0"
      } h-[42px] w-full sm:h-[64px] md:h-[86px] ${className}`}
    >
      <path d={path} fill="currentColor" />
    </svg>
  );
}
