"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;
const items = [
  { label: "Menu", href: "/menu" },
  { label: "Catering", href: "/catering" },
  { label: "Our Story", href: "/about" },
  { label: "Visit", href: "/contact" },
];

function RollingLabel({ label, index, close }: { label: string; index: number; close: () => void }) {
  const [hovered, setHovered] = useState(false);
  const animating = useRef(false);
  const pendingLeave = useRef(false);
  const chars = label.split("");
  const handleEnter = useCallback(() => {
    pendingLeave.current = false;
    if (hovered) return;
    setHovered(true);animating.current = true;
    window.setTimeout(() => {animating.current = false;if (pendingLeave.current) {pendingLeave.current = false;setHovered(false)}}, 30 * chars.length + 300);
  }, [chars.length, hovered]);
  const handleLeave = useCallback(() => {if (animating.current) pendingLeave.current = true;else setHovered(false)}, []);

  const item = items[index];
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .4, delay: .2 + index * .06, ease }}>
    <Link href={item.href} onClick={close} onMouseEnter={handleEnter} onMouseLeave={handleLeave} className="focus-ring block h-[1em] overflow-hidden font-serif text-[27px] uppercase leading-none tracking-[-.02em] text-marble">
      <span className="flex justify-center">{chars.map((char, i) => <span key={`${char}-${i}`} className="inline-block h-[1em] overflow-hidden"><span className="flex flex-col transition-transform duration-700" style={{ transform: hovered ? "translateY(-50%)" : "translateY(0)", transitionDelay: hovered ? `${i * 30}ms` : "0ms", transitionTimingFunction: "cubic-bezier(.22,1,.36,1)" }}><span className="block h-[1em] leading-[1em]">{char === " " ? "\u00a0" : char}</span><span aria-hidden className="block h-[1em] leading-[1em]">{char === " " ? "\u00a0" : char}</span></span></span>)}</span>
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

  return <motion.div ref={ref} className="fixed right-3 top-[15px] z-[60] flex items-start gap-2 md:right-10 md:gap-3" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55, ease }}>
    <motion.a href="https://www.ubereats.com/ca/store/greek-mansion/2jMowxE1Ts6w_sOBYT_BQA?utm=greekfooddelivery.ca" target="_blank" rel="noreferrer" aria-label="Order Greek Mansion on Uber Eats" className="flex h-[50px] items-center gap-2 rounded-full border border-black/10 bg-white px-4 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:shadow-xl md:px-5" animate={{opacity:open?0:1,x:open?14:0,pointerEvents:open?"none":"auto"}} transition={{duration:.25}}><span className="font-sans text-[11px] font-bold uppercase tracking-[-.02em] text-black md:text-xs">UBER <span className="text-[#06C167]">EATS</span></span><span className="hidden font-label text-[10px] uppercase tracking-[.1em] text-black/55 sm:inline">Order now</span></motion.a>
    <motion.div className="relative flex cursor-pointer flex-col overflow-hidden border border-gold shadow-lg shadow-navy/10" animate={{ width: open ? 290 : 118, height: open ? 290 : 50, borderRadius: open ? 28 : 999 }} whileHover={open ? undefined : { scale: 1.04 }} transition={{ duration: .72, ease, height: { duration: open ? .72 : .22 } }} onClick={() => {if (!open) setOpen(true)}}>
      <motion.div className="absolute inset-0 bg-gold" style={{ borderRadius: "inherit" }}/>
      <motion.div className="absolute left-1/2 h-[200%] w-[200%] -translate-x-1/2 rounded-full bg-navy" animate={{ bottom: open ? "-18%" : "-205%" }} transition={{ duration: .75, delay: open ? .06 : 0, ease }}/>
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 overflow-hidden" style={{ pointerEvents: open ? "auto" : "none" }}>
        <AnimatePresence>{open && items.map((item, index) => <RollingLabel key={item.href} label={item.label} index={index} close={() => setOpen(false)}/>)}</AnimatePresence>
      </div>
      <button type="button" aria-expanded={open} aria-label={open ? "Close navigation menu" : "Open navigation menu"} onClick={(event) => {event.stopPropagation();setOpen(value => !value)}} className="relative z-10 flex h-[50px] w-full shrink-0 items-center justify-between px-5">
        <motion.span className="text-sm font-semibold uppercase tracking-[.14em]" animate={{ color: open ? "#F8F5ED" : "#111936" }}>{open ? "Explore" : "Menu"}</motion.span>
        <span className="relative h-6 w-6"><motion.span className="absolute left-[3px] top-[11px] block h-[1.5px] w-[18px] rounded-full" animate={{ rotate: open ? 45 : 0, y: open ? 0 : -3, backgroundColor: open ? "#F8F5ED" : "#111936" }} transition={{ duration: .35, ease }}/><motion.span className="absolute left-[3px] top-[11px] block h-[1.5px] w-[18px] rounded-full" animate={{ rotate: open ? -45 : 0, y: open ? 0 : 3, backgroundColor: open ? "#F8F5ED" : "#111936" }} transition={{ duration: .35, ease }}/></span>
      </button>
    </motion.div>
  </motion.div>;
}
