// Sync the live Supabase menu to data/menu.ts, including renames and removals.
//   npm run sync:menu             → DRY RUN: prints the plan, touches nothing
//   npm run sync:menu -- --commit → applies it
//
// Unlike seed-menu.mjs (insert/upsert only), this reconciles: it renames rows
// that changed name/category so their photos and admin settings survive, then
// deletes whatever is no longer on the menu.
//
// Requires .env.local with NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.

import { loadEnv, requireEnv } from "./_env.mjs";
import { buildTree } from "./parse-menu.mjs";

const COMMIT = process.argv.includes("--commit");

// ---- rename map: old "category-slug/item-slug" → new one -------------------
// Keeps image_url, badges and featured flags attached across the 2026 menu update.
const RENAMES = {
  "appetizers/crab-cakes": "appetizers/crab-cakes-2-pcs",
  "appetizers/gyro-poutine": "appetizers/gyro-poutine-fries-or-onion-rings",
  "appetizers/falafel": "appetizers/falafel-5-pcs",
  "appetizers/chicken-souvlaki": "appetizers/1-stick-chicken-souvlaki",
  "appetizers/pork-souvlaki": "appetizers/1-stick-pork-souvlaki",
  // sides moved out of Appetizers into their own Mansion Extras section
  "appetizers/tzatziki": "mansion-extras/tzatziki",
  "appetizers/spicy-tzatziki": "mansion-extras/spicy-tzatziki",
  "appetizers/french-fries": "mansion-extras/french-fries",
  "appetizers/onion-rings": "mansion-extras/onion-rings",
  "appetizers/rice": "mansion-extras/rice",
  "appetizers/potatoes": "mansion-extras/potatoes",
  "appetizers/vegetables": "mansion-extras/veggies",
  "appetizers/gyro-meat": "mansion-extras/gyro-lamb-and-beef-mixed-meat-only",
  // Mansion Wraps → Mansion Pita Wraps (category renamed below, items here)
  "mansion-pita-wraps/chicken-souvlaki-wrap": "mansion-pita-wraps/chicken-souvlaki-1-stick",
  "mansion-pita-wraps/chicken-souvlaki-wrap-2": "mansion-pita-wraps/chicken-souvlaki-2-sticks",
  "mansion-pita-wraps/pork-souvlaki-wrap": "mansion-pita-wraps/pork-souvlaki-1-stick",
  "mansion-pita-wraps/pork-souvlaki-wrap-2": "mansion-pita-wraps/pork-souvlaki-2-sticks",
  "mansion-pita-wraps/chicken-fillet-wrap": "mansion-pita-wraps/chicken-fillet",
  "mansion-pita-wraps/gyro-wrap": "mansion-pita-wraps/gyro-lamb-beef-mixed-meat",
  "mansion-pita-wraps/falafel-wrap": "mansion-pita-wraps/falafel-chickpeas",
  "mansion-pita-wraps/veggie-wrap": "mansion-pita-wraps/veggie",
  "desserts/bougatsa-phyllo": "desserts/bougatsa-phyllo-custard-pie",
  "mansion-favourites/chicken-fillet-plate": "dinner-plates/chicken-fillet-plate",
  "mansion-favourites/spanakopita": "mansion-favourites/spanakopita-plate",
  "mansion-favourites/fish-plate": "mansion-favourites/fish-plate-large-only",
  "specials/family-special": "specials/family-special-6-people",
  "specials/family-special-2": "specials/family-special-4-people",
};

// Category slug renames, applied before anything else.
const CATEGORY_RENAMES = { "mansion-wraps": { slug: "mansion-pita-wraps", name: "Mansion Pita Wraps" } };

loadEnv();
requireEnv(["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]);
const { createClient } = await import("@supabase/supabase-js");
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const tree = buildTree();
const wanted = new Map(tree.map((c) => [c.slug, new Set(c.items.map((i) => i.slug))]));

const load = async () => {
  const { data, error } = await db
    .from("menu_categories")
    .select("id, name, slug, sort_order, menu_items(id, name, slug, image_url)");
  if (error) throw new Error(error.message);
  return data;
};

let live = await load();
const say = (line) => console.log(line);

console.log(`\n${COMMIT ? "COMMIT" : "DRY RUN"} — syncing Supabase to data/menu.ts\n`);

// ---- 1. category renames ---------------------------------------------------
for (const cat of live) {
  const rename = CATEGORY_RENAMES[cat.slug];
  if (!rename) continue;
  say(`rename category  ${cat.slug} → ${rename.slug}  ("${cat.name}" → "${rename.name}")`);
  if (COMMIT) {
    const { error } = await db.from("menu_categories").update(rename).eq("id", cat.id);
    if (error) throw new Error(`rename category ${cat.slug}: ${error.message}`);
  }
  cat.slug = rename.slug;
  cat.name = rename.name;
}

// ---- 2. upsert categories from the source file ------------------------------
for (const cat of tree) {
  const existing = live.find((c) => c.slug === cat.slug);
  say(`${existing ? "update" : "CREATE"} category  ${cat.slug}  (order ${cat.sort_order})`);
  if (COMMIT) {
    const { error } = await db.from("menu_categories").upsert(
      { name: cat.name, slug: cat.slug, description: cat.description, sort_order: cat.sort_order, is_active: true },
      { onConflict: "slug" },
    );
    if (error) throw new Error(`category ${cat.slug}: ${error.message}`);
  }
}
if (COMMIT) live = await load();
// In a dry run nothing was written, so stand in placeholder rows for the
// categories we would have created — that keeps the printed plan honest.
if (!COMMIT) {
  for (const cat of tree) {
    if (!live.some((c) => c.slug === cat.slug)) live.push({ id: null, name: cat.name, slug: cat.slug, menu_items: [] });
  }
}

const catBySlug = new Map(live.map((c) => [c.slug, c]));

// ---- 3. item renames / moves (keeps the row, so photos survive) -------------
for (const [from, to] of Object.entries(RENAMES)) {
  const [fromCat, fromItem] = from.split("/");
  const [toCat, toItem] = to.split("/");
  const source = catBySlug.get(fromCat);
  const row = source?.menu_items.find((i) => i.slug === fromItem);
  if (!row) {
    say(`skip rename      ${from} → ${to}  (no such row)`);
    continue;
  }
  const target = catBySlug.get(toCat);
  if (!target && COMMIT) throw new Error(`rename target category missing: ${toCat}`);
  say(`rename item      ${from} → ${to}${row.image_url ? `  [keeps photo ${row.image_url}]` : ""}`);
  if (COMMIT) {
    const { error } = await db.from("menu_items").update({ slug: toItem, category_id: target.id }).eq("id", row.id);
    if (error) throw new Error(`rename ${from}: ${error.message}`);
  }
  // mirror the move locally so the rest of the plan sees the row where it lands
  source.menu_items = source.menu_items.filter((i) => i.id !== row.id);
  row.slug = toItem;
  target.menu_items.push(row);
}
if (COMMIT) live = await load();

// ---- 4. upsert items + variants --------------------------------------------
const idOf = new Map(live.map((c) => [c.slug, c.id]));
let created = 0;
let updated = 0;
for (const cat of tree) {
  const categoryId = idOf.get(cat.slug);
  if (!categoryId && COMMIT) throw new Error(`category not found after upsert: ${cat.slug}`);
  const existingSlugs = new Set((live.find((c) => c.slug === cat.slug)?.menu_items ?? []).map((i) => i.slug));
  for (const it of cat.items) {
    if (existingSlugs.has(it.slug)) updated++;
    else {
      created++;
      say(`CREATE item      ${cat.slug}/${it.slug}`);
    }
    if (!COMMIT) continue;
    const { data: item, error } = await db
      .from("menu_items")
      .upsert(
        {
          category_id: categoryId,
          name: it.name,
          slug: it.slug,
          description: it.description,
          price_cents: it.priceCents,
          is_featured: it.is_featured,
          is_published: true,
          sort_order: it.sort_order,
        },
        { onConflict: "category_id,slug" },
      )
      .select("id")
      .single();
    if (error) throw new Error(`item ${cat.slug}/${it.slug}: ${error.message}`);

    await db.from("menu_item_variants").delete().eq("menu_item_id", item.id);
    if (it.variants.length) {
      const { error: ve } = await db.from("menu_item_variants").insert(
        it.variants.map((v) => ({
          menu_item_id: item.id,
          name: v.name,
          price_cents: v.cents,
          sort_order: v.sort_order,
          is_available: true,
        })),
      );
      if (ve) throw new Error(`variants for ${cat.slug}/${it.slug}: ${ve.message}`);
    }
  }
}
say(`\nitems: ${created} new, ${updated} updated (prices and variants rewritten from the source file)`);
if (COMMIT) live = await load();

// ---- 5. remove what is no longer on the menu --------------------------------
say("");
for (const cat of live) {
  const keep = wanted.get(cat.slug);
  if (!keep) {
    say(`DELETE category  ${cat.slug}  (${cat.menu_items.length} items)`);
    if (COMMIT) {
      const ids = cat.menu_items.map((i) => i.id);
      if (ids.length) await db.from("menu_item_variants").delete().in("menu_item_id", ids);
      await db.from("menu_items").delete().eq("category_id", cat.id);
      const { error } = await db.from("menu_categories").delete().eq("id", cat.id);
      if (error) throw new Error(`delete category ${cat.slug}: ${error.message}`);
    }
    continue;
  }
  for (const item of cat.menu_items) {
    if (keep.has(item.slug)) continue;
    say(`DELETE item      ${cat.slug}/${item.slug}  ("${item.name}")${item.image_url ? "  ⚠ had a photo" : ""}`);
    if (COMMIT) {
      await db.from("menu_item_variants").delete().eq("menu_item_id", item.id);
      const { error } = await db.from("menu_items").delete().eq("id", item.id);
      if (error) throw new Error(`delete item ${cat.slug}/${item.slug}: ${error.message}`);
    }
  }
}

console.log(
  COMMIT
    ? "\nDone. Live menu now matches data/menu.ts.\n"
    : "\nDry run only. Review the plan above, then run:  npm run sync:menu -- --commit\n",
);
