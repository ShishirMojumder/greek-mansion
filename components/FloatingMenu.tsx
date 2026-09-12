"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Facebook, Instagram } from "lucide-react";
import ArrowFillButton from "@/components/ui/arrow-fill-button";

const ease = [0.22, 1, 0.36, 1] as const;
const items = [
  { label: "Menu", href: "/menu" },
  { label: "Catering", href: "/catering" },
  { label: "Blog", href: "/blog" },
  { label: "Our Story", href: "/about" },
  { label: "Visit", href: "/contact" },
];

function RollingLabel({ label, index, close }: { label: string; index: number; close: () => void }) {
  const chars = label.split("");
  const item = items[index];
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .4, delay: .2 + index * .06, ease }}>
    <Link href={item.href} onClick={close} className="focus-ring group block h-[1em] overflow-hidden font-serif text-[1.6875rem] uppercase leading-none tracking-[-.02em] text-marble">
      <span className="flex justify-center">{chars.map((char, i) => <span key={`${char}-${i}`} className="inline-block h-[1em] overflow-hidden"><span className="flex flex-col transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-1/2 group-focus-visible:-translate-y-1/2" style={{ transitionDelay: `${i * 30}ms` }}><span className="block h-[1em] leading-[1em]">{char === " " ? "\u00a0" : char}</span><span aria-hidden className="block h-[1em] leading-[1em]">{char === " " ? "\u00a0" : char}</span></span></span>)}</span>
    </Link>
  </motion.div>;
}

export default function FloatingMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const outside = (event: MouseEvent) => {if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false)};
    const escape = (event: KeyboardEvent) => {if (event.key === "Escape") setOpen(false)};
    document.addEventListener("mousedown", outside);document.addEventListener("keydown", escape);
    return () => {document.removeEventListener("mousedown", outside);document.removeEventListener("keydown", escape)};
  }, [open]);

  return <motion.div ref={ref} className="fixed right-3 top-4 z-50 flex items-start gap-2 md:right-10 md:gap-3" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55, ease }}>
    <motion.div className="hidden rounded-full shadow-lg shadow-black/25 sm:block" animate={{opacity:open?0:1,x:open?14:0,pointerEvents:open?"none":"auto"}} transition={{duration:.25}}><ArrowFillButton btnText="Order on Uber Eats" href="https://www.ubereats.com/ca/store/greek-mansion/2jMowxE1Ts6w_sOBYT_BQA?utm=greekfooddelivery.ca" target="_blank" rel="noreferrer" aria-label="Order Greek Mansion on Uber Eats" className="font-label" bgColor="#06C167" textColor="#000000" fillBgColor="#000000" fillTextColor="#06C167" hoverFillBgColor="#000000" hoverFillTextColor="#06C167"/></motion.div>
    <motion.div className="relative flex flex-col overflow-hidden border border-gold shadow-lg shadow-navy/10" animate={{ width: open ? 290 : 118, height: open ? 394 : 50, borderRadius: open ? 28 : 999 }} whileHover={open ? undefined : { scale: 1.04 }} transition={{ duration: .72, ease, height: { duration: open ? .72 : .22 } }}>
      <motion.div className="absolute inset-0 bg-gold" style={{ borderRadius: "inherit" }}/>
      <motion.div className="absolute left-1/2 h-[200%] w-[200%] -translate-x-1/2 rounded-full bg-navy" animate={{ bottom: open ? "-18%" : "-205%" }} transition={{ duration: .75, delay: open ? .06 : 0, ease }}/>
      <div className={`relative z-10 flex flex-1 flex-col items-center justify-center gap-6 overflow-hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
        <AnimatePresence>{open && items.map((item, index) => <RollingLabel key={item.href} label={item.label} index={index} close={() => setOpen(false)}/>)}</AnimatePresence>
      </div>
      <div className="relative z-10 flex h-[50px] w-full shrink-0 items-center justify-between px-5">
        {open ? <div className="flex items-center gap-2">
          <a href="https://www.facebook.com/profile.php?id=61593538364319" target="_blank" rel="noreferrer" aria-label="Visit Greek Mansion on Facebook" className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full border border-marble/35 text-marble transition hover:border-gold hover:bg-gold hover:text-navy">
            <Facebook size={18} aria-hidden="true"/>
          </a>
          <a href="https://www.instagram.com/greekmansion/" target="_blank" rel="noreferrer" aria-label="Visit Greek Mansion on Instagram" className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full border border-marble/35 text-marble transition hover:border-gold hover:bg-gold hover:text-navy">
            <Instagram size={18} aria-hidden="true"/>
          </a>
        </div> : <span className="text-sm font-semibold uppercase tracking-[.14em] text-navy">Menu</span>}
        <button type="button" aria-expanded={open} aria-label={open ? "Close navigation menu" : "Open navigation menu"} onClick={() => setOpen(value => !value)} className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full">
          <span className="relative h-6 w-6"><motion.span className="absolute left-[3px] top-[11px] block h-[1.5px] w-[18px] rounded-full" animate={{ rotate: open ? 45 : 0, y: open ? 0 : -3, backgroundColor: open ? "#F8F5ED" : "#111936" }} transition={{ duration: .35, ease }}/><motion.span className="absolute left-[3px] top-[11px] block h-[1.5px] w-[18px] rounded-full" animate={{ rotate: open ? -45 : 0, y: open ? 0 : 3, backgroundColor: open ? "#F8F5ED" : "#111936" }} transition={{ duration: .35, ease }}/></span>
        </button>
      </div>
    </motion.div>
  </motion.div>;
}
