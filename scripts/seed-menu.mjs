// Extract data/menu.ts and load it into Supabase.
//   npm run seed:menu            → DRY RUN: prints what would be written, touches nothing
//   npm run seed:menu -- --commit → writes to the database (insert / upsert only, non-destructive)
//
// Requires .env.local with NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.

import { loadEnv, requireEnv } from "./_env.mjs";
import { buildTree } from "./parse-menu.mjs";

const COMMIT = process.argv.includes("--commit");
const money = (c) => (c == null ? "—" : `$${(c / 100).toFixed(2)}`);

const tree = buildTree();

// ---- print the extracted data --------------------------------------------
let items = 0;
let variants = 0;
console.log(`\n${COMMIT ? "COMMIT" : "DRY RUN"} — extracted menu from data/menu.ts\n`);
for (const cat of tree) {
  console.log(`■ ${cat.name}  (slug: ${cat.slug}, order: ${cat.sort_order})`);
  if (cat.description) console.log(`    note: ${cat.description}`);
  for (const it of cat.items) {
    items++;
    variants += it.variants.length;
    const price =
      it.variants.length <= 1
        ? money(it.variants[0]?.cents)
        : it.variants.map((v) => `${v.name || "—"} ${money(v.cents)}`).join(" · ");
    console.log(
      `    • ${it.name}${it.is_featured ? "  ★featured" : ""}\n` +
        `      slug=${it.slug}  price=${price}  (raw: "${it.rawPrice}")` +
        (it.description ? `\n      desc: ${it.description}` : ""),
    );
  }
  console.log("");
}
console.log(`Totals: ${tree.length} categories, ${items} items, ${variants} variants.\n`);

if (!COMMIT) {
  console.log("Dry run only. Review the above, then run:  npm run seed:menu -- --commit\n");
  process.exit(0);
}

// ---- write to Supabase ---------------------------------------------------
loadEnv();
requireEnv(["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]);
const { createClient } = await import("@supabase/supabase-js");
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

for (const cat of tree) {
  const { data: category, error: ce } = await db
    .from("menu_categories")
    .upsert(
      { name: cat.name, slug: cat.slug, description: cat.description, sort_order: cat.sort_order, is_active: true },
      { onConflict: "slug" },
    )
    .select("id")
    .single();
  if (ce) throw new Error(`category "${cat.name}": ${ce.message}`);

  for (const it of cat.items) {
    const { data: item, error: ie } = await db
      .from("menu_items")
      .upsert(
        {
          category_id: category.id,
          name: it.name,
          slug: it.slug,
          description: it.description,
          price_cents: it.priceCents,
          availability: "available",
          is_featured: it.is_featured,
          is_published: true,
          sort_order: it.sort_order,
        },
        { onConflict: "category_id,slug" },
      )
      .select("id")
      .single();
    if (ie) throw new Error(`item "${it.name}": ${ie.message}`);

    // variants: replace to keep the seed idempotent
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
      if (ve) throw new Error(`variants for "${it.name}": ${ve.message}`);
    }
  }
  console.log(`✓ ${cat.name}`);
}

console.log(`\nDone. ${tree.length} categories, ${items} items, ${variants} variants written.\n`);
