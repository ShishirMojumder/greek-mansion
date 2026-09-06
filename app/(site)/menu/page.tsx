import type { Metadata } from "next";
import { MenuCategory } from "@/components/MenuCategory";
import { Button } from "@/components/Button";
import { getPublicMenu } from "@/lib/menu";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Explore Greek Mansion's menu of souvlaki, gyro, Greek plates, family meals and desserts in Scarborough.",
};

const anchor = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export default async function MenuPage() {
  const menu = await getPublicMenu();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: "Greek Mansion Menu",
    hasMenuSection: menu.map((c) => ({
      "@type": "MenuSection",
      name: c.name,
      hasMenuItem: c.items.map((i) => ({
        "@type": "MenuItem",
        name: i.name,
        ...(i.description ? { description: i.description } : {}),
        ...(i.price_min_cents != null
          ? { offers: { "@type": "Offer", price: i.price_min_cents / 100, priceCurrency: "CAD" } }
          : {}),
      })),
    })),
  };

  return (
    <>
      <h1 className="sr-only">
        Greek Mansion menu — souvlaki, gyro, Greek plates, family meals and desserts in Scarborough
      </h1>
      <nav
        id="full-menu"
        aria-label="Menu categories"
        className="sticky top-20 z-30 scroll-mt-20 overflow-x-auto border-b border-navy/10 bg-marble/95 px-5 backdrop-blur"
      >
        <div className="mx-auto flex w-max max-w-[1240px] gap-7 py-4 md:w-auto md:justify-center">
          {menu.map((category) => (
            <a
              key={category.name}
              href={`#${anchor(category.name)}`}
              className="whitespace-nowrap text-[10px] uppercase tracking-[.16em] text-navy/65 hover:text-gold"
            >
              {category.name}
            </a>
          ))}
        </div>
      </nav>
      <div>
        {menu.map((category, index) => (
          <MenuCategory category={category} index={index} key={category.name} />
        ))}
      </div>
      <section className="bg-navy px-5 py-20 text-center text-white">
        <h2 className="font-serif text-5xl">Feeding the whole family?</h2>
        <p className="mx-auto mt-4 max-w-lg text-sm text-white/60">
          Ask us about family combinations and large orders, prepared fresh for your table.
        </p>
        <Button href="tel:+14162923333" variant="light" className="mt-7">
          Call to order
        </Button>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}
