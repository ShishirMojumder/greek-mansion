"use client";

import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/Button";
import { HandwritingText } from "@/components/ui/handwriting-text";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import type { FeaturedItem } from "@/lib/menu";

const fallback = [
  { name: "Chicken Souvlaki Wrap", category: "Mansion Wraps", image: "/images/real-food/greekmansion-chickenwrap-native.jpg" },
  { name: "Traditional Gyro Wrap", category: "Greek classics", image: "/images/real-food/greekmansion-gyrowrap-native.jpg" },
  { name: "Greek Fries with Feta", category: "Appetizers", image: "/images/real-food/greek-fries.jpg" },
  { name: "Chicken Souvlaki Sandwich", category: "Sandwiches on a Bun", image: "/images/real-food/chicken-sandwich.jpg" },
];

// Subtle editorial variation per card — resting tilt + gentle arc (px).
const ROT = [-3, 2, -2, 3];
const ARC = [12, -6, -6, 12];

export default function MenuHighlights({ items }: { items?: FeaturedItem[] }) {
  const cards =
    items && items.length >= 2
      ? items.slice(0, 4).map((i) => ({ name: i.name, category: i.category, image: i.image_url }))
      : fallback;

  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;

    // Heading — unchanged one-shot reveal.
    gsap.from(headRef.current, {
      y: 32, autoAlpha: 0, duration: 0.9, ease: "power3.out",
      clearProps: "transform,opacity,visibility",
      scrollTrigger: { trigger: headRef.current, start: "top 85%" },
    });

    const grid = gridRef.current;
    if (!grid) return;
    const slots = gsap.utils.toArray<HTMLElement>(grid.querySelectorAll(".mh-slot"));
    const inners = gsap.utils.toArray<HTMLElement>(grid.querySelectorAll(".mh-card"));
    const path = grid.querySelector<SVGPathElement>(".mh-path path");

    const mm = gsap.matchMedia();

    // ---- Desktop: floating curved arrangement -------------------------------
    mm.add("(min-width: 768px)", () => {
      gsap.set(inners, { rotate: (i) => ROT[i % ROT.length] });

      // Entrance: fade + rise + scale, staggered, settling onto the arc.
      gsap.fromTo(
        slots,
        { autoAlpha: 0, scale: 0.95, y: (i) => ARC[i % ARC.length] + 40 },
        {
          autoAlpha: 1, scale: 1, y: (i) => ARC[i % ARC.length],
          duration: 1, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: grid, start: "top 80%", once: true },
        },
      );

      // Very slow vertical float + micro sway — begins after the entrance.
      slots.forEach((slot, i) => {
        gsap.to(slot, {
          y: `+=9`, rotation: "+=1",
          duration: 3.6 + i * 0.35, ease: "sine.inOut",
          repeat: -1, yoyo: true, delay: 1.4 + i * 0.1,
        });
      });

      // Scroll-linked drift: cards spread gently as you move through the story.
      gsap.to(slots, {
        x: (i) => (i % 2 ? 16 : -16), ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1 },
      });

      // Optional: draw the curved path as the row enters.
      if (path) {
        const len = path.getTotalLength();
        gsap.fromTo(
          path,
          { strokeDasharray: len, strokeDashoffset: len },
          {
            strokeDashoffset: 0, ease: "none",
            scrollTrigger: { trigger: grid, start: "top 85%", end: "top 35%", scrub: 1 },
          },
        );
      }
    });

    // ---- Mobile: clean stacked cards, minimal motion ----------------------
    mm.add("(max-width: 767px)", () => {
      gsap.from(slots, {
        autoAlpha: 0, y: 24, duration: 0.7, stagger: 0.1, ease: "power3.out",
        clearProps: "transform,opacity,visibility",
        scrollTrigger: { trigger: grid, start: "top 85%", once: true },
      });
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  return <section ref={sectionRef} className="overflow-hidden bg-navy px-5 py-24 text-white md:px-10 md:py-32"><div className="mx-auto max-w-[1360px]"><div ref={headRef} className="grid gap-8 md:grid-cols-[1.3fr_.7fr] md:items-end"><div><span className="inline-flex rounded-full bg-white px-5 py-2 font-label text-[10px] uppercase tracking-[.16em] text-navy">From our kitchen</span><h2 className="display mt-7 max-w-3xl text-[2.75rem] uppercase leading-[0.92] sm:text-6xl md:text-8xl">Greek<br/>favourites,</h2><div className="mt-3 sm:mt-4"><HandwritingText text="made generously" height="2.6rem" className="text-gold" duration={1.6}/></div></div><div className="md:pb-2"><p className="max-w-md text-sm leading-7 text-white/65">From flame-grilled souvlaki to a comforting gyro and feta-topped fries, every plate begins with honest ingredients and familiar Greek flavour.</p><Button href="/menu" variant="light" className="mt-7 hidden md:inline-flex">See our full menu</Button></div></div><div ref={gridRef} className="relative mt-14 grid gap-5 md:mt-20 md:flex md:flex-nowrap md:justify-center md:gap-6 md:py-10"><svg className="mh-path pointer-events-none absolute inset-0 z-0 hidden h-full w-full md:block" viewBox="0 0 1200 300" preserveAspectRatio="none" fill="none" aria-hidden="true"><path d="M20 172 C 300 88, 480 92, 620 150 C 780 224, 950 208, 1180 128" stroke="#C9A227" strokeOpacity="0.45" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke"/></svg>{cards.map((item, i) => <div key={item.name} className="mh-slot relative z-10 md:w-[clamp(230px,23vw,300px)] md:shrink-0" style={{ willChange: "transform" }}><article className="mh-card group rounded-[28px] bg-white p-3 pb-7 text-ink shadow-lg shadow-navy/5 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-2xl hover:shadow-navy/15 md:p-4 md:pb-8"><div className="relative aspect-[4/3] overflow-hidden rounded-[21px] bg-marble"><Image src={item.image} alt={item.name} fill className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]" sizes="(max-width:768px) 100vw,300px"/><span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-navy opacity-0 shadow-md backdrop-blur transition-all duration-300 group-hover:opacity-100"><ArrowUpRight size={18}/></span></div><div className="px-2 pt-6"><p className="font-label text-[9px] uppercase tracking-[.2em] text-gold">{item.category}</p><h3 className="mt-2 font-serif text-3xl uppercase leading-none text-navy md:text-4xl">{item.name}</h3></div></article></div>)}</div><div className="mt-10 flex justify-center md:hidden"><Button href="/menu" variant="light">See our full menu</Button></div></div></section>;
}
