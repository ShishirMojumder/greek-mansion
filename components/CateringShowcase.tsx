"use client";

import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/Button";
import { HandwritingText } from "@/components/ui/handwriting-text";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

export default function CateringShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    // Image card enters smoothly.
    gsap.from(mediaRef.current, {
      autoAlpha: 0, xPercent: 6, scale: 0.96, duration: 1, ease: "power3.out",
      clearProps: "opacity,visibility",
      scrollTrigger: { trigger: wrapRef.current, start: "top 78%" },
    });
    // Text reveals progressively, line by line.
    gsap.from(gsap.utils.toArray<HTMLElement>(copyRef.current?.children ?? []), {
      y: 28, autoAlpha: 0, duration: 0.8, stagger: 0.12, ease: "power3.out",
      clearProps: "transform,opacity,visibility",
      scrollTrigger: { trigger: copyRef.current, start: "top 80%" },
    });
    // Subtle parallax drift on the card through the section.
    gsap.fromTo(mediaRef.current, { y: 20 }, {
      y: -20, ease: "none",
      scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true },
    });
  }, { scope: sectionRef });

  return <section ref={sectionRef} className="px-5 py-24 md:px-10"><div ref={wrapRef} className="mx-auto max-w-[1360px] bg-white p-7 md:p-16"><div className="grid items-center gap-12 md:grid-cols-[1fr_1.1fr]"><div ref={copyRef}><p className="eyebrow">Greek Mansion Catering</p><h2 className="display mt-5 text-5xl uppercase text-navy md:text-7xl">Bring Greece<br/>to the gathering</h2><div className="mt-5"><HandwritingText text="Gather generously" height="2.9rem" className="text-gold" duration={1.6}/></div><p className="mt-5 max-w-md text-sm leading-7 text-ink/60">Corporate lunches, milestone moments, family celebrations. We bring generous Greek flavours—and make hosting feel effortless.</p><Button href="/catering" className="mt-8">Request catering</Button></div><div ref={mediaRef}><article className="group rounded-[28px] bg-marble p-3 shadow-2xl shadow-navy/10 ring-1 ring-navy/10 transition-transform duration-500 hover:-translate-y-2 md:p-4"><div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-white"><Image src="/images/catering-boxes.png" alt="Greek Mansion Family Catering boxes and foil trays packed at the counter" fill className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]" sizes="600px"/></div></article></div></div></div></section>;
}
