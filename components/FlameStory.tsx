"use client";

import { useRef } from "react";
import Image from "next/image";
import { SectionTitle } from "@/components/SectionTitle";
import { Flame, Leaf, UtensilsCrossed, Heart } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const steps: [typeof Leaf, string, string][] = [
  [Leaf, "Fresh ingredients", "Quality produce and carefully selected cuts."],
  [Heart, "Greek seasoning", "Lemon, garlic, oregano—and time."],
  [Flame, "Open-flame grilling", "Charred at the edges, tender within."],
  [UtensilsCrossed, "Your table", "Finished fresh and served generously."],
];

export default function FlameStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const stepEls = gsap.utils.toArray<HTMLElement>(".flame-step");
    const img = mediaRef.current?.querySelector("img");
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;

    // Media card: one-shot entrance.
    gsap.from(mediaRef.current, {
      autoAlpha: 0, y: 40, duration: 0.9, ease: "power3.out",
      clearProps: "transform,opacity,visibility",
      scrollTrigger: { trigger: mediaRef.current, start: "top 85%" },
    });

    // Ritual steps: one-shot staggered reveal — clears its own props, never scrub-stuck.
    gsap.from(stepEls, {
      autoAlpha: 0, y: 32, duration: 0.7, stagger: 0.14, ease: "power3.out",
      clearProps: "transform,opacity,visibility",
      scrollTrigger: { trigger: copyRef.current, start: "top 78%" },
    });

    // Desktop only: slow scrub zoom on the kitchen image for depth.
    if (isDesktop && img) {
      gsap.fromTo(img, { scale: 1.05 }, {
        scale: 1.12, ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    }
  }, { scope: sectionRef });

  return <section ref={sectionRef} className="overflow-hidden bg-navy px-5 py-20 text-white md:px-10 md:py-28"><div className="mx-auto grid max-w-[1360px] items-center gap-12 md:grid-cols-2 md:gap-16"><div ref={mediaRef}><article className="group rounded-[28px] bg-white p-3 pb-7 text-ink shadow-2xl shadow-black/10 transition-transform duration-500 hover:-translate-y-2 md:p-4 md:pb-8"><div className="relative aspect-[4/3] overflow-hidden rounded-[21px] bg-marble"><Image src="/images/real-food/greekmansion-steakdinner-native.jpg" alt="Greek Mansion steak dinner with Greek salad, rice, potatoes, pita and tzatziki" fill className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]" sizes="(max-width:768px) 100vw,50vw"/></div><div className="px-2 pt-6"><p className="font-label text-[9px] uppercase tracking-[.2em] text-gold">Grilled fresh · Every day</p><p className="mt-2 font-serif text-3xl uppercase leading-none text-navy md:text-4xl">The heart of our kitchen</p></div></article></div><div className="flex items-center md:px-6 lg:px-12"><div ref={copyRef}><SectionTitle eyebrow="The ritual" title={<>From the <span className="accent">flame</span></>} light/><p className="mt-7 max-w-lg text-sm leading-7 text-white/65">A simple process, repeated with patience. The flame does not hurry—and neither do we.</p><ol className="mt-12 space-y-8">{steps.map(([Icon, t, d], i) => {const C = Icon as typeof Leaf;return <li className="flame-step grid grid-cols-[40px_1fr] gap-5 border-b border-white/15 pb-7" key={t}><C className="text-gold" size={23}/><div><p className="font-serif text-2xl">0{i + 1}. {t}</p><p className="mt-1 text-xs text-white/50">{d}</p></div></li>;})}</ol></div></div></div></section>;
}
