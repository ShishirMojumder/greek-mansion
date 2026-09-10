"use client";
import { useRef } from "react";
import { CoverflowCarousel, type CoverflowSlide } from "@/components/ui/coverflow-carousel";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import type { FeaturedItem } from "@/lib/menu";

const fallback: CoverflowSlide[] = [
  { src: "/images/real-food/greekmansion-gyrowrap-native.jpg", alt: "Real Greek Mansion gyro wrap", title: "Gyro (Lamb & Beef Mixed Meat)", subtitle: "Mansion Pita Wraps", price: "Pita Only $8.95 · Combo $15.95", href: "/menu#gyro-lamb-beef-mixed-meat", meta: "Tender gyro and fresh vegetables wrapped in warm pita." },
  { src: "/images/real-food/greekmansion-steakdinner-native.jpg", alt: "Real Greek Mansion steak dinner", title: "Steak Plate", subtitle: "Dinner Plates", price: "Regular $19.95 · Large $26.45", href: "/menu#steak-plate", meta: "Grilled steak served with rice, potatoes, Greek salad, pita and tzatziki." },
  { src: "/images/real-food/greek-fries.jpg", alt: "Real Greek Mansion fries topped with feta", title: "Greek Fries or Onion Rings", subtitle: "Appetizers", price: "Small $8.95 · Large $11.95", href: "/menu#greek-fries-or-onion-rings", meta: "Golden fries finished generously with crumbled feta." },
  { src: "/images/real-food/gyro-plate.jpg", alt: "Real Greek Mansion gyro plate", title: "Gyro Plate", subtitle: "Dinner Plates", price: "Regular $14.95 · Large $19.95", href: "/menu#gyro-plate", meta: "Seasoned beef and lamb mix from the vertical rotisserie, with two sides and Greek salad." },
  { src: "/images/real-food/greekmansion-calamari-native.jpg", alt: "Real Greek Mansion grilled calamari plate", title: "Grilled Calamari Plate", subtitle: "Mansion Favourites", price: "$24.95", href: "/menu#grilled-calamari-plate", meta: "Marinated calamari grilled with green peppers and onions." },
  { src: "/images/real-food/greekmansion-fishandchips-native.jpg", alt: "Real Greek Mansion fish and chips", title: "Fish and Chips", subtitle: "Mansion Favourites", price: "$16.95", href: "/menu#fish-and-chips", meta: "Two breaded haddock deep fried to a golden crisp, with fries." },
];

export default function FeaturedDishes({ items }: { items?: FeaturedItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.from(ref.current, {
      y: 48,
      autoAlpha: 0,
      duration: 1,
      ease: "power3.out",
      clearProps: "transform,opacity,visibility",
      scrollTrigger: { trigger: ref.current, start: "top 82%" },
    });
  }, { scope: ref });

  const slides: CoverflowSlide[] =
    // Whatever admin has featured (and that has a photo) wins. The hardcoded
    // fallback is only for a genuinely empty selection, never a partial one.
    items && items.length > 0
      ? items.map((i) => ({
          src: i.image_url,
          alt: i.name,
          title: i.name,
          subtitle: i.category,
          price: i.price_text,
          href: i.href,
          meta: i.description ?? undefined,
        }))
      : fallback;

  return (
    <div ref={ref}>
      <CoverflowCarousel slides={slides} />
    </div>
  );
}
