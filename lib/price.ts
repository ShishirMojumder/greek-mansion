export const centsToUsd = (c: number | null | undefined) =>
  c == null ? "" : `$${(c / 100).toFixed(2)}`;

/** Parse a dollars string ("10", "10.5", "$10.49") to integer cents, or null if invalid. */
export function dollarsToCents(input: string): number | null {
  const n = Number(String(input).replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(n) || n < 0 || n > 100000) return null;
  return Math.round(n * 100);
}

export type PricedVariant = { name: string; price_cents: number };

/** Public-style price string: single blank variant → "$9.00"; multiple → "Small $8.95 · Large $11.95". */
export function formatVariants(variants: PricedVariant[]): string {
  if (!variants.length) return "—";
  if (variants.length === 1) {
    const [v] = variants;
    return v.name ? `${v.name} ${centsToUsd(v.price_cents)}` : centsToUsd(v.price_cents);
  }
  return variants
    .map((v) => (v.name ? `${v.name} ${centsToUsd(v.price_cents)}` : centsToUsd(v.price_cents)))
    .join(" · ");
}
