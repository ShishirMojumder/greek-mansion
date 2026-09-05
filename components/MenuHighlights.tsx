"use client";

import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/Button";
import { HandwritingText } from "@/components/ui/handwriting-text";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const menuHighlights = [
  { name: "Chicken Souvlaki Wrap", category: "Mansion Wraps", image: "/images/menu/wrap-02.png", position: "object-center" },
  { name: "Traditional Gyro Wrap", category: "Greek classics", image: "/images/menu/wrap-03.png", position: "object-center" },
  { name: "Greek Fries with Feta", category: "Appetizers", image: "/images/menu/appetizer-04.png", position: "object-center" },
];

export default function MenuHighlights() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.from(headRef.current, {
      y: 32, autoAlpha: 0, duration: 0.9, ease: "power3.out",
      clearProps: "transform,opacity,visibility",
      scrollTrigger: { trigger: headRef.current, start: "top 85%" },
    });
    gsap.from(gsap.utils.toArray<HTMLElement>(".mh-card"), {
      y: 48, autoAlpha: 0, duration: 0.9, stagger: 0.12, ease: "power3.out",
      clearProps: "transform,opacity,visibility",
      scrollTrigger: { trigger: gridRef.current, start: "top 82%" },
    });
  }, { scope: sectionRef });

  return <section ref={sectionRef} className="overflow-hidden bg-navy px-5 py-24 text-white md:px-10 md:py-32"><div className="mx-auto max-w-[1360px]"><div ref={headRef} className="grid gap-8 md:grid-cols-[1.3fr_.7fr] md:items-end"><div><span className="inline-flex rounded-full bg-white px-5 py-2 font-label text-[10px] uppercase tracking-[.16em] text-navy">From our kitchen</span><h2 className="display mt-7 max-w-3xl text-[2.75rem] uppercase leading-[0.92] sm:text-6xl md:text-8xl">Greek<br/>favourites,</h2><div className="mt-3 sm:mt-4"><HandwritingText text="made generously" height="2.6rem" className="text-gold" duration={1.6}/></div></div><div className="md:pb-2"><p className="max-w-md text-sm leading-7 text-white/65">From flame-grilled souvlaki to a comforting gyro and feta-topped fries, every plate begins with honest ingredients and familiar Greek flavour.</p><Button href="/menu" variant="light" className="mt-7 hidden md:inline-flex">See our full menu</Button></div></div><div ref={gridRef} className="mt-14 grid gap-5 md:grid-cols-3">{menuHighlights.map((item) => <article key={item.name} className="mh-card group rounded-[28px] bg-white p-3 pb-7 text-ink shadow-lg shadow-navy/5 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-2xl hover:shadow-navy/15 md:p-4 md:pb-8"><div className="relative aspect-[4/3] overflow-hidden rounded-[21px] bg-marble"><Image src={item.image} alt={item.name} fill className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] ${item.position}`} sizes="(max-width:768px) 100vw,33vw"/><span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-navy opacity-0 shadow-md backdrop-blur transition-all duration-300 group-hover:opacity-100"><ArrowUpRight size={18}/></span></div><div className="px-2 pt-6"><p className="font-label text-[9px] uppercase tracking-[.2em] text-gold">{item.category}</p><h3 className="mt-2 font-serif text-3xl uppercase leading-none text-navy md:text-4xl">{item.name}</h3></div></article>)}</div><div className="mt-10 flex justify-center md:hidden"><Button href="/menu" variant="light">See our full menu</Button></div></div></section>;
}
