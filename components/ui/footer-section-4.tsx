"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, Facebook, Instagram, MapPin, MessageCircle, Phone, ShoppingBag } from "lucide-react";
import { HandwritingText } from "@/components/ui/handwriting-text";

const WHATSAPP_URL = "https://wa.me/14162923333?text=Hi%20Greek%20Mansion%2C%20I%20have%20a%20question.";

const columns = [
  { title: "Explore", links: [{ label: "Home", href: "/" }, { label: "Full Menu", href: "/menu" }, { label: "Blog", href: "/blog" }, { label: "Our Story", href: "/about" }, { label: "Contact", href: "/contact" }] },
  { title: "Gather", links: [{ label: "Catering", href: "/catering" }, { label: "Family Meals", href: "/menu#specials" }, { label: "Dinner Plates", href: "/menu#dinner-plates" }, { label: "Mansion Favourites", href: "/menu#mansion-favourites" }] },
  { title: "Visit", links: [{ label: "5651 Steeles Ave E #10", href: "https://maps.app.goo.gl/bRD3NCp2ohiZZSp19" }, { label: "Scarborough, Ontario", href: "https://maps.app.goo.gl/bRD3NCp2ohiZZSp19" }, { label: "416-292-3333", href: "tel:+14162923333" }, { label: "Get Directions", href: "https://maps.app.goo.gl/bRD3NCp2ohiZZSp19" }] },
  { title: "Favourites", links: [{ label: "Souvlaki", href: "/menu#dinner-plates" }, { label: "Gyro Plates", href: "/menu#dinner-plates" }, { label: "Mansion Pita Wraps", href: "/menu#mansion-pita-wraps" }, { label: "Desserts", href: "/menu#desserts" }] },
];

const container: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: .14, delayChildren: .08 } } };
const item: Variants = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: .7, ease: [.22, 1, .36, 1] } } };

export default function GreekMansionFooter() {
  return <footer className="marble w-full px-4 py-8 md:px-8 md:py-10">
    <motion.div className="grid w-full gap-4 md:grid-cols-[7fr_13fr]" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={container}>
      <motion.div variants={item} className="footer-brand-card noise relative flex w-full flex-col overflow-hidden rounded-2xl bg-navy p-7 text-white md:p-9">
        <Image src="/images/greek-mansion-logo-white.png" alt="Greek Mansion" width={1254} height={1254} priority className="relative z-10 -my-8 -ml-6 h-auto w-52 self-start md:-my-9 md:-ml-7 md:w-60"/>
        <span aria-hidden className="absolute -right-10 top-14 font-serif text-[10rem] leading-none text-white/[.035]">Ω</span>

        <div className="relative z-10 mt-auto">
          <p className="eyebrow eyebrow-gold">Greek Kitchen · Scarborough</p>
          <h2 className="display mt-4 text-4xl uppercase md:text-5xl">Come <span className="accent">hungry</span>.</h2>
          <div className="mt-1"><HandwritingText text="Leave as family" height="2.6rem" className="text-gold" duration={1.7}/></div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/60">Family recipes, open-flame cooking and warm Greek hospitality in the heart of Scarborough.</p>
          <p className="mt-3 text-[.6875rem] uppercase leading-5 tracking-[.12em] text-white/45">Mon–Thu 11am–9pm<br/>Fri–Sat 11am–10pm · Sun 12–9pm</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <a href="tel:+14162923333" aria-label="Call Greek Mansion" className="footer-action"><Phone size={16}/>Call</a>
            <a href="https://maps.app.goo.gl/bRD3NCp2ohiZZSp19" target="_blank" rel="noreferrer" aria-label="Directions to Greek Mansion" className="footer-action"><MapPin size={16}/>Directions</a>
            <a href="https://www.ubereats.com/ca/store/greek-mansion/2jMowxE1Ts6w_sOBYT_BQA?utm=greekfooddelivery.ca" target="_blank" rel="noreferrer" aria-label="Order Greek Mansion on Uber Eats" className="footer-action"><ShoppingBag size={16}/>Order</a>
            <a href="https://www.facebook.com/profile.php?id=61593538364319" target="_blank" rel="noreferrer" aria-label="Visit Greek Mansion on Facebook" className="footer-action footer-action-icon"><Facebook size={16}/></a>
            <a href="https://www.instagram.com/greekmansion/" target="_blank" rel="noreferrer" aria-label="Visit Greek Mansion on Instagram" className="footer-action footer-action-icon"><Instagram size={16}/></a>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="flex w-full flex-col rounded-2xl border border-navy/15 bg-white p-7 md:p-10">
        <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-x-8 gap-y-9 lg:grid-cols-4">
          {columns.map(column => <div key={column.title}>
            <h3 className="font-label text-sm uppercase tracking-[.15em] text-navy">{column.title}</h3>
            <ul className="mt-5 space-y-2.5">
              {column.links.map(link => <li key={`${column.title}-${link.label}`}>
                <Link href={link.href} className="group inline-flex items-start gap-1 text-sm leading-6 text-ink/55 transition hover:text-navy">
                  {link.label}<ArrowUpRight size={11} className="mt-1 opacity-0 transition group-hover:opacity-100"/>
                </Link>
              </li>)}
            </ul>
          </div>)}
        </nav>

        <div className="mt-10 rounded-2xl bg-marble p-5 sm:flex sm:items-center sm:justify-between sm:gap-6 md:p-6">
          <div>
            <p className="font-label text-sm uppercase tracking-[.15em] text-navy">Quick contact</p>
            <p className="mt-2 max-w-lg text-sm leading-6 text-ink/55">Questions about an order, catering or today&apos;s menu? Message the restaurant directly.</p>
          </div>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="focus-ring mt-5 inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-xs font-semibold uppercase tracking-[.12em] text-black transition hover:-translate-y-0.5 hover:brightness-95 sm:mt-0">
            <MessageCircle size={18} aria-hidden="true"/>WhatsApp us
          </a>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-3 border-t border-navy/10 pt-5 text-[.5625rem] uppercase tracking-[.18em] text-ink/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Greek Mansion Restaurant</p>
          <p>Made by NextRnS in Scarborough</p>
        </div>
      </motion.div>
    </motion.div>
  </footer>;
}
