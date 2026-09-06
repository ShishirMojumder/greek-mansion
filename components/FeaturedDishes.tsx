"use client";
import { useRef } from "react";
import { CoverflowCarousel, type CoverflowSlide } from "@/components/ui/coverflow-carousel";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import type { FeaturedItem } from "@/lib/menu";

const fallback: CoverflowSlide[] = [
  { src: "/images/real-food/greekmansion-gyrowrap-native.jpg", alt: "Real Greek Mansion gyro wrap", title: "Gyro Wrap", subtitle: "A house classic", meta: "Tender gyro and fresh vegetables wrapped in warm pita." },
  { src: "/images/real-food/greekmansion-steakdinner-native.jpg", alt: "Real Greek Mansion steak dinner", title: "Steak Dinner", subtitle: "Made generously", meta: "Grilled steak served with rice, potatoes, Greek salad, pita and tzatziki." },
  { src: "/images/real-food/greek-fries.jpg", alt: "Real Greek Mansion fries topped with feta", title: "Greek Fries", subtitle: "A crowd favourite", meta: "Golden fries finished generously with crumbled feta." },
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
    items && items.length >= 2
      ? items.map((i) => ({
          src: i.image_url,
          alt: i.name,
          title: i.name,
          subtitle: i.category,
          meta: i.description ?? i.price_text,
        }))
      : fallback;

  return (
    <div ref={ref}>
      <CoverflowCarousel slides={slides} />
    </div>
  );
}
