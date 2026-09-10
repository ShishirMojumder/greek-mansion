import { unstable_cache } from "next/cache";
import { publicClient, supabaseConfigured } from "@/lib/supabase/public";
import { menu as fallbackMenu } from "@/data/menu";
import { formatVariants } from "@/lib/price";
import { slugify } from "@/lib/admin/menu-types";

export type PublicAvailability = "available" | "sold_out_today" | "temporarily_unavailable";

export type PublicItem = {
  name: string;
  /** Stable per-item anchor, e.g. /menu#gyro-plate */
  slug: string;
  description: string | null;
  badge: string | null;
  is_featured: boolean;
  availability: PublicAvailability;
  price_text: string;
  price_min_cents: number | null;
  image_url: string | null;
};

export type PublicCategory = { name: string; note: string | null; items: PublicItem[] };

// ---- fallback: shape data/menu.ts like the DB output --------------------------
function fromFallback(): PublicCategory[] {
  return fallbackMenu.map((c) => ({
    name: c.name,
    note: c.note ?? null,
    items: c.items.map((i) => {
      const nums = (i.price.match(/\d+(?:\.\d+)?/g) ?? []).map(Number);
      return {
        name: i.name,
        slug: slugify(i.name),
        description: i.description || null,
        badge: null,
        is_featured: Boolean(i.featured),
        availability: "available" as const,
        price_text: i.price,
        price_min_cents: nums.length ? Math.round(Math.min(...nums) * 100) : null,
        image_url: null,
      };
    }),
  }));
}

// ---- live: from Supabase (published rows only, RLS-enforced) ------------------
type DbCategory = {
  name: string;
  description: string | null;
  sort_order: number;
  menu_items: {
    name: string;
    slug: string;
    description: string | null;
    badge: string | null;
    is_featured: boolean;
    is_published: boolean;
    availability: string;
    sold_out_until: string | null;
    sort_order: number;
    menu_item_variants: { name: string; price_cents: number; sort_order: number; is_available: boolean }[];
  }[];
};

async function fetchLive(): Promise<PublicCategory[] | null> {
  if (!supabaseConfigured()) return null;
  const db = publicClient();
  const { data, error } = await db
    .from("menu_categories")
    .select(
      "name, description, sort_order, menu_items(name, slug, description, badge, is_featured, is_published, availability, sold_out_until, sort_order, menu_item_variants(name, price_cents, sort_order, is_available))",
    )
    .eq("is_active", true)
    .order("sort_order");

  if (error || !data) return null;

  const now = Date.now();
  const cats = (data as unknown as DbCategory[])
    .map((c) => ({
      name: c.name,
      note: c.description ?? null,
      items: (c.menu_items ?? [])
        .filter((i) => i.is_published && i.availability !== "hidden")
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((i): PublicItem => {
          let availability = i.availability as PublicAvailability;
          if (
            availability === "sold_out_today" &&
            i.sold_out_until &&
            Date.parse(i.sold_out_until) < now
          ) {
            availability = "available";
          }
          const variants = [...(i.menu_item_variants ?? [])]
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((v) => ({ name: v.name, price_cents: v.price_cents }));
          const prices = variants.map((v) => v.price_cents);
          return {
            name: i.name,
            slug: i.slug,
            description: i.description ?? null,
            badge: i.badge ?? null,
            is_featured: i.is_featured,
            availability,
            price_text: formatVariants(variants),
            price_min_cents: prices.length ? Math.min(...prices) : null,
            image_url: null,
          };
        }),
    }))
    .filter((c) => c.items.length > 0);

  return cats.length ? cats : null;
}

const cachedMenu = unstable_cache(
  async (): Promise<PublicCategory[]> => (await fetchLive()) ?? fromFallback(),
  ["public-menu-v2"],
  { tags: ["menu"], revalidate: 3600 },
);

export const getPublicMenu = () => cachedMenu();

// ---- featured items for the homepage (only ones with a real image) ----------
export type FeaturedItem = {
  name: string;
  /** Deep link to this exact dish on the menu page. */
  href: string;
  category: string;
  image_url: string;
  description: string | null;
  price_text: string;
};

const cachedFeatured = unstable_cache(
  async (): Promise<FeaturedItem[]> => {
    if (!supabaseConfigured()) return [];
    const db = publicClient();
    const { data, error } = await db
      .from("menu_items")
      .select("name, slug, description, image_url, sort_order, category:menu_categories(name, sort_order), menu_item_variants(name, price_cents, sort_order)")
      .eq("is_featured", true)
      .eq("is_published", true)
      .not("image_url", "is", null)
      .neq("availability", "hidden")
      .order("sort_order")
      .limit(8);
    if (error || !data) return [];
    return (data as unknown as {
      name: string;
      slug: string;
      description: string | null;
      image_url: string;
      sort_order: number;
      category: { name: string; sort_order: number } | null;
      menu_item_variants: { name: string; price_cents: number; sort_order: number }[];
    }[])
      // Menu order, so the homepage matches what the admin screen lists.
      // sort_order is per-category, so the category's own position comes first.
      .sort((a, b) => (a.category?.sort_order ?? 0) - (b.category?.sort_order ?? 0) || a.sort_order - b.sort_order)
      .map((i) => {
      const variants = [...(i.menu_item_variants ?? [])]
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((v) => ({ name: v.name, price_cents: v.price_cents }));
      return {
        name: i.name,
        href: `/menu#${i.slug}`,
        category: i.category?.name ?? "Greek Mansion",
        image_url: i.image_url,
        description: i.description ?? null,
        price_text: formatVariants(variants),
      };
    });
  },
  ["public-featured-v2"],
  { tags: ["menu"], revalidate: 3600 },
);

export const getFeatured = () => cachedFeatured();
