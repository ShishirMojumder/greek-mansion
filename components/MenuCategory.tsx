import { MenuImageRibbon } from "@/components/MenuImageRibbon";
import type { PublicCategory } from "@/lib/menu";

const backgrounds = [
  "bg-marble",
  "bg-white",
  "bg-[#E9ECF7]",
  "bg-[#F3ECD8]",
  "bg-[#EEF1F8]",
  "bg-[#FBF8F0]",
  "bg-[#E5E9F6]",
  "bg-[#F1E8CF]",
];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function MenuCategory({ category, index }: { category: PublicCategory; index: number }) {
  const id = category.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <section id={id} className={`scroll-mt-28 px-5 py-20 md:px-10 md:py-28 ${backgrounds[index % backgrounds.length]}`}>
      <div className="mx-auto max-w-[1120px]">
        <div className="text-center">
          <p className="font-label text-[10px] uppercase tracking-[.2em] text-gold/80">Category · 0{index + 1}</p>
          <h2 className="display mt-4 text-5xl uppercase text-navy md:text-7xl">{category.name}</h2>
          {category.note && <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-ink/55">{category.note}</p>}
        </div>
        <div className="mt-10">
          <MenuImageRibbon category={category.name} />
        </div>
        <div className="mx-auto mt-10 grid max-w-4xl gap-x-16 md:grid-cols-2">
          {category.items.map((item, itemIndex) => {
            const off = item.availability !== "available";
            const badgeText = item.badge ? cap(item.badge) : item.is_featured ? "Popular" : null;
            return (
              <article
                key={`${item.name}-${itemIndex}`}
                className={`flex items-baseline justify-between gap-4 border-b py-5 ${
                  item.is_featured ? "-mx-3 rounded-lg border-transparent bg-gold/[.08] px-3" : "border-navy/10"
                } ${off ? "opacity-55" : ""}`}
              >
                <div className="min-w-0">
                  <h3 className="font-serif text-lg uppercase leading-tight text-navy md:text-xl">
                    {item.name}
                    {badgeText && (
                      <span className="ml-2 align-middle font-label text-[9px] uppercase tracking-[.18em] text-gold">
                        {badgeText}
                      </span>
                    )}
                  </h3>
                  {item.description && <p className="mt-1.5 text-sm leading-6 text-ink/55">{item.description}</p>}
                </div>
                <span className="max-w-[44%] shrink-0 text-right font-label text-sm font-semibold leading-7 tracking-wide md:text-base">
                  {item.availability === "sold_out_today" ? (
                    <span className="text-navy/45">Sold out today</span>
                  ) : item.availability === "temporarily_unavailable" ? (
                    <span className="text-navy/45">Temporarily unavailable</span>
                  ) : (
                    <span className="box-decoration-clone rounded-md bg-navy px-2.5 py-1 text-white">
                      {item.price_text}
                    </span>
                  )}
                </span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
