import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const slugify = (s) =>
  s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-");

/** Read the `menu` array literal out of data/menu.ts (types stripped) and evaluate it. */
export function readSourceMenu() {
  const src = readFileSync(join(ROOT, "data/menu.ts"), "utf8");
  const m = src.match(/export\s+const\s+menu[^=]*=\s*(\[[\s\S]*?\])\s*;?\s*$/m);
  if (!m) throw new Error("Could not locate `export const menu = [...]` in data/menu.ts");
  // eslint-disable-next-line no-new-func — our own source file, no external input
  return new Function(`return (${m[1]})`)();
}

/** Split "Small $8.95 · Large $11.95" style strings into { label, cents } parts. */
function parsePricePart(part) {
  const t = part.trim();
  const m = t.match(/^(.*?)[\s·]*\$?\s*(\d+(?:\.\d{1,2})?)\s*$/);
  if (!m) return { label: t, cents: null };
  return { label: m[1].replace(/[·\-–:]+$/, "").trim(), cents: Math.round(parseFloat(m[2]) * 100) };
}

const looksLikeLabelList = (parts) =>
  parts.length > 1 && parts.every((p) => p.length > 0 && p.length < 24 && !/\d/.test(p));

/** Turn one source item into { name, slug, description, priceCents, variants:[{name,cents}] }. */
export function normalizeItem(item, usedSlugs) {
  const priceParts = String(item.price).split("·").map((s) => s.trim()).filter(Boolean);
  const descParts = String(item.description || "").split("·").map((s) => s.trim()).filter(Boolean);

  let variants;
  let description = item.description ? String(item.description) : null;

  if (looksLikeLabelList(descParts) && descParts.length === priceParts.length) {
    // description holds the size labels ("Regular · Large"), price holds the numbers
    variants = descParts.map((label, i) => {
      const { cents } = parsePricePart(priceParts[i]);
      return { name: label, cents };
    });
    description = null;
  } else {
    // labels (if any) are inline in the price string
    variants = priceParts.map((p) => {
      const { label, cents } = parsePricePart(p);
      return { name: label, cents };
    });
  }

  variants = variants
    .map((v, i) => ({ name: v.name || "", cents: v.cents, sort_order: i }))
    .filter((v) => Number.isFinite(v.cents));

  let slug = slugify(item.name);
  if (usedSlugs.has(slug)) {
    let n = 2;
    while (usedSlugs.has(`${slug}-${n}`)) n++;
    slug = `${slug}-${n}`;
  }
  usedSlugs.add(slug);

  return {
    name: item.name,
    slug,
    description,
    priceCents: variants.length === 1 && variants[0].name === "" ? variants[0].cents : null,
    is_featured: Boolean(item.featured),
    variants,
    rawPrice: String(item.price),
  };
}

/** Full normalized tree from data/menu.ts. */
export function buildTree() {
  const menu = readSourceMenu();
  return menu.map((cat, ci) => {
    const used = new Set();
    return {
      name: cat.name,
      slug: slugify(cat.name),
      description: cat.note ? String(cat.note) : null,
      sort_order: ci,
      items: cat.items.map((it) => normalizeItem(it, used)).map((it, ii) => ({ ...it, sort_order: ii })),
    };
  });
}
