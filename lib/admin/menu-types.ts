// Client-safe: types + constants only. No server imports.

export const AVAILABILITY = [
  "available",
  "sold_out_today",
  "temporarily_unavailable",
  "hidden",
] as const;
export type Availability = (typeof AVAILABILITY)[number];

export const AVAILABILITY_LABEL: Record<Availability, string> = {
  available: "Available",
  sold_out_today: "Sold out today",
  temporarily_unavailable: "Temporarily unavailable",
  hidden: "Hidden",
};

export const BADGES = ["popular", "new", "chef", "special"] as const;
export type Badge = (typeof BADGES)[number];

export type Variant = {
  id: string;
  name: string;
  price_cents: number;
  sort_order: number;
  is_available: boolean;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  updated_at: string;
  itemCount?: number;
};

export type Item = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  price_cents: number | null;
  image_url: string | null;
  availability: Availability;
  sold_out_until: string | null;
  is_featured: boolean;
  is_published: boolean;
  badge: Badge | null;
  starts_at: string | null;
  ends_at: string | null;
  sort_order: number;
  updated_at: string;
  category?: { name: string } | null;
  menu_item_variants: Variant[];
};

export const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-");
