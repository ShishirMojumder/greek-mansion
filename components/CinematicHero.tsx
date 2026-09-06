"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const ease = [0.22, 1, 0.36, 1] as const;
const marquee = ["Souvlaki over flame", "Family recipes", "Greek hospitality", "Made in Scarborough", "Gather generously"];

function MagneticLink({ href, children, primary = false }: { href: string; children: React.ReactNode; primary?: boolean }) {
  const x = useSpring(useMotionValue(0), { stiffness: 180, damping: 16 });
  const y = useSpring(useMotionValue(0), { stiffness: 180, damping: 16 });
  return <motion.div style={{ x, y }} onMouseMove={(event) => {const rect=event.currentTarget.getBoundingClientRect();x.set((event.clientX-rect.left-rect.width/2)*.18);y.set((event.clientY-rect.top-rect.height/2)*.18)}} onMouseLeave={() => {x.set(0);y.set(0)}}>
    <Link href={href} className={`hero-glass focus-ring flex items-center gap-4 rounded-full px-7 py-4 text-xs uppercase tracking-[.18em] ${primary ? "!border-gold !bg-gold text-ink" : "border-white/40 !bg-white/10 text-white"}`}>{children}<ArrowUpRight size={15}/></Link>
  </motion.div>;
}

function MarqueeSet() {return <div className="flex shrink-0 items-center gap-9 px-5">{marquee.map(item => <span className="flex items-center gap-9" key={item}><span>{item}</span><i className="text-gold">✦</i></span>)}</div>}

export default function CinematicHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const scrub = { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true } as const;
    const img = bgRef.current?.querySelector("img");
    // Parallax + depth: the food imagery drifts down and pushes in as you leave the hero.
    if (img) gsap.to(img, { yPercent: 14, scale: 1.14, ease: "none", scrollTrigger: scrub });
    // The headline block eases up a touch faster and softens — a subtle sense of layers.
    gsap.to(contentRef.current, { yPercent: -8, autoAlpha: 0.55, ease: "none", scrollTrigger: scrub });
  }, { scope: sectionRef });

  return <section ref={sectionRef} className="cinematic-hero noise relative min-h-[calc(100svh-80px)] overflow-hidden bg-ink">
    <motion.div ref={bgRef} className="absolute inset-0" initial={{scale:1.035,opacity:0}} animate={{scale:1,opacity:1}} transition={{duration:1.5,ease}}><Image src="/images/real-food/hero.jpg" alt="A table filled with real Greek Mansion plates, wraps, salad, calamari and fries" fill priority className="object-cover object-[58%_50%] md:object-center" sizes="100vw"/></motion.div>
    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,25,54,.92)_0%,rgba(30,42,120,.80)_34%,rgba(17,25,54,.38)_63%,rgba(17,25,54,.16)_100%)] max-md:bg-[linear-gradient(180deg,rgba(17,25,54,.74),rgba(17,25,54,.84))]"/>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_48%,transparent_0%,transparent_28%,rgba(17,25,54,.24)_100%)]"/>
    <motion.div className="absolute left-0 top-0 z-10 w-full overflow-hidden border-b border-white/15 bg-ink/55 py-3.5 backdrop-blur-md" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .45, duration: .8, ease }}>
      <div className="hero-marquee flex w-max font-label text-[10px] uppercase tracking-[.27em] text-white/65"><MarqueeSet/><MarqueeSet/></div>
    </motion.div>
    <div ref={contentRef} className="relative z-20 mx-auto flex min-h-[calc(100svh-80px)] max-w-[1400px] flex-col items-center justify-center px-5 pb-12 pt-24 text-center md:items-start md:px-10 md:pb-10 md:pt-24 md:text-left lg:px-16">
      <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2, duration: .8, ease }} className="mb-4 md:mb-5"><p className="eyebrow !text-white/75">Scarborough · Toronto</p></motion.div>
      <motion.h1 className="display max-w-[790px] text-[clamp(4.1rem,9vw,8.6rem)] uppercase text-white" initial={{ opacity: 0, y: 55 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3, duration: 1.05, ease }}>Fresh Greek<br/><span className="text-gold">Fair Prices</span></motion.h1>
      <motion.p className="mt-5 max-w-lg text-sm leading-6 text-white/75 md:text-base md:leading-7" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .58, duration: .75, ease }}>Flame-grilled souvlaki, gyros and mezze—made fresh every day.<br/>Generous Greek plates, priced for the whole table.</motion.p>
      <motion.div className="mt-6 flex flex-wrap justify-center gap-3 md:mt-7 md:justify-start" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .72, duration: .75, ease }}><MagneticLink href="/menu" primary>View menu</MagneticLink><MagneticLink href="https://www.ubereats.com/ca/store/greek-mansion/2jMowxE1Ts6w_sOBYT_BQA?utm=greekfooddelivery.ca">Order online</MagneticLink></motion.div>
      <motion.p className="absolute bottom-4 hidden text-[9px] uppercase tracking-[.25em] text-white/45 lg:block" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.1}}>Scroll to enter the mansion ↓</motion.p>
    </div>
  </section>;
}
