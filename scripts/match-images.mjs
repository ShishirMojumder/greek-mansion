// Attach photos from /public/images to menu items by matching the dish name
// against the filename. Dry run by default.
//
//   npm run images:match              # show what it would do
//   npm run images:match -- --commit  # write image_url for matched items
//   npm run images:match -- --commit --overwrite   # also replace existing photos
//
// Requires .env.local with NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.

import { readdirSync } from "node:fs";
import path from "node:path";
import { loadEnv, requireEnv } from "./_env.mjs";

const commit = process.argv.includes("--commit");
const overwrite = process.argv.includes("--overwrite");

// ---------------------------------------------------------------- image library
const FOLDERS = ["real-food", "menu", "features"];
const EXT = /\.(jpe?g|png|webp|avif)$/i;

const toLabel = (file) =>
  file
    .replace(EXT, "")
    .replace(/^greekmansion[-_]?/i, "")
    .replace(/[-_]?native$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const library = [];
for (const dir of FOLDERS) {
  let files = [];
  try {
    files = readdirSync(path.join(process.cwd(), "public", "images", dir));
  } catch {
    continue;
  }
  for (const file of files.filter((f) => EXT.test(f)).sort()) {
    library.push({ url: `/images/${dir}/${file}`, label: toLabel(file) });
  }
}

// ---------------------------------------------------------------- matching
// Kept in sync with lib/admin/image-library.ts
const STOP = new Set(["the", "and", "with", "a", "of", "on", "in", "greek", "mansion", "native", "2"]);
const tokens = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP.has(t));

function matchScore(itemName, image) {
  const a = tokens(itemName);
  const b = tokens(image.label);
  if (!a.length || !b.length) return 0;

  let matched = 0;
  let exact = 0;
  const used = new Set();

  for (const t of a) {
    if (b.includes(t)) {
      matched++;
      exact++;
      used.add(t);
    } else {
      const hit = b.find((u) => u.includes(t) || t.includes(u));
      if (hit) {
        matched++;
        used.add(hit);
      }
    }
  }
  if (!matched) return 0;
  const extra = b.filter((u) => !used.has(u) && !a.some((t) => u.includes(t) || t.includes(u))).length;
  return matched * 10 + exact * 0.5 - extra * 3;
}

const best = (name) => {
  const ranked = library
    .map((image) => ({ image, score: matchScore(name, image) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
  return ranked[0] ?? null;
};

// Only auto-apply matches that cover at least two words of the dish name, or one
// word exactly. Weaker hits are listed for a human to confirm in the admin.
const CONFIDENT = 20;

// ---------------------------------------------------------------- run
loadEnv();
requireEnv(["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]);

const { createClient } = await import("@supabase/supabase-js");
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const { data: items, error } = await db.from("menu_items").select("id, name, image_url").order("name");
if (error) {
  console.error(error.message);
  process.exit(1);
}

console.log(`${library.length} photos in /public/images · ${items.length} menu items\n`);

const apply = [];
const weak = [];
const none = [];

for (const item of items) {
  if (item.image_url && !overwrite) continue;
  const hit = best(item.name);
  if (!hit) none.push(item);
  else if (hit.score >= CONFIDENT) apply.push({ item, ...hit });
  else weak.push({ item, ...hit });
}

const pad = (s, n) => String(s).padEnd(n).slice(0, n);

if (apply.length) {
  console.log(`MATCHED (${apply.length}) — will be applied`);
  for (const r of apply) console.log(`  ${pad(r.item.name, 34)} -> ${r.image.url}`);
  console.log();
}
if (weak.length) {
  console.log(`UNCERTAIN (${weak.length}) — skipped, pick these in the admin`);
  for (const r of weak) console.log(`  ${pad(r.item.name, 34)} ~  ${r.image.url}`);
  console.log();
}
if (none.length) {
  console.log(`NO PHOTO (${none.length}) — nothing in the library matches`);
  for (const i of none) console.log(`  ${i.name}`);
  console.log();
}

if (!commit) {
  console.log("Dry run. Re-run with --commit to write these.");
  process.exit(0);
}

let ok = 0;
for (const r of apply) {
  const { error: e } = await db.from("menu_items").update({ image_url: r.image.url }).eq("id", r.item.id);
  if (e) console.error(`  failed: ${r.item.name} — ${e.message}`);
  else ok++;
}
console.log(`Updated ${ok} of ${apply.length} items.`);
