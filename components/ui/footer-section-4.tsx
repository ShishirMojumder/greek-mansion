"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, Facebook, Instagram, MapPin, Phone, ShoppingBag } from "lucide-react";
import { HandwritingText } from "@/components/ui/handwriting-text";

const columns=[
 {title:"Explore",links:[{label:"Home",href:"/"},{label:"Full Menu",href:"/menu"},{label:"Blog",href:"/blog"},{label:"Our Story",href:"/about"},{label:"Contact",href:"/contact"}]},
 {title:"Gather",links:[{label:"Catering",href:"/catering"},{label:"Family Meals",href:"/menu#specials"},{label:"Dinner Plates",href:"/menu#dinner-plates"},{label:"Mansion Favourites",href:"/menu#mansion-favourites"}]},
 {title:"Visit",links:[{label:"5651 Steeles Ave E #10",href:"https://maps.google.com/?q=5651+Steeles+Ave+E+Scarborough+ON"},{label:"Scarborough, Ontario",href:"https://maps.google.com/?q=5651+Steeles+Ave+E+Scarborough+ON"},{label:"416-292-3333",href:"tel:+14162923333"},{label:"Get Directions",href:"https://maps.google.com/?q=5651+Steeles+Ave+E+Scarborough+ON"}]},
 {title:"Favourites",links:[{label:"Souvlaki",href:"/menu#dinner-plates"},{label:"Gyro Plates",href:"/menu#dinner-plates"},{label:"Mansion Wraps",href:"/menu#mansion-wraps"},{label:"Desserts",href:"/menu#desserts"}]}
];
const container:Variants={hidden:{opacity:0},visible:{opacity:1,transition:{staggerChildren:.14,delayChildren:.08}}};
const item:Variants={hidden:{opacity:0,y:28},visible:{opacity:1,y:0,transition:{duration:.7,ease:[.22,1,.36,1]}}};

export default function GreekMansionFooter(){return <footer className="marble px-4 py-8 md:px-8 md:py-12"><motion.div className="mx-auto max-w-[1400px]" initial="hidden" whileInView="visible" viewport={{once:true,margin:"-80px"}} variants={container}>
 <div className="flex flex-col gap-4 md:flex-row">
  <motion.div variants={item} className="footer-brand-card noise relative flex min-h-[430px] w-full flex-col justify-between overflow-hidden rounded-2xl bg-navy p-7 text-white md:min-h-[610px] md:w-[35%] md:p-10">
   <Image src="/images/greek-mansion-logo-white.png" alt="Greek Mansion" width={1254} height={1254} priority className="relative z-10 -my-9 -ml-8 h-auto w-[340px] self-start md:-my-14 md:-ml-12 md:w-[430px]"/>
   <div aria-hidden className="absolute -right-12 top-24 font-serif text-[14rem] leading-none text-white/[.035]">Ω</div>
   <div className="relative z-10"><p className="eyebrow !text-gold">Greek Kitchen · Scarborough</p><h2 className="display mt-5 text-5xl uppercase md:text-6xl">Come <span className="accent">hungry</span>.</h2><div className="mt-2"><HandwritingText text="Leave as family" height="3.25rem" className="text-gold" duration={1.7}/></div><p className="mt-6 max-w-xs text-sm leading-7 text-white/60">Family recipes, open-flame cooking and warm Greek hospitality in the heart of Scarborough.</p>
    <p className="mt-5 text-[11px] uppercase leading-5 tracking-[.12em] text-white/45">Mon–Thu 11am–9pm<br/>Fri–Sat 11am–10pm · Sun 12–9pm</p>
    <div className="mt-8 flex flex-wrap gap-2"><a href="tel:+14162923333" aria-label="Call Greek Mansion" className="footer-action"><Phone size={16}/>Call</a><a href="https://maps.google.com/?q=5651+Steeles+Ave+E+Scarborough+ON" aria-label="Directions to Greek Mansion" className="footer-action"><MapPin size={16}/>Directions</a><a href="https://www.ubereats.com/ca/store/greek-mansion/2jMowxE1Ts6w_sOBYT_BQA?utm=greekfooddelivery.ca" target="_blank" rel="noreferrer" aria-label="Order Greek Mansion on Uber Eats" className="footer-action"><ShoppingBag size={16}/>Order</a><span title="Facebook link coming soon" aria-label="Facebook link coming soon" className="footer-action !h-10 !w-10 !justify-center !p-0"><Facebook size={16}/></span><span title="Instagram link coming soon" aria-label="Instagram link coming soon" className="footer-action !h-10 !w-10 !justify-center !p-0"><Instagram size={16}/></span></div>
   </div>
  </motion.div>
  <motion.div variants={item} className="flex min-h-[560px] w-full flex-col justify-between rounded-2xl border border-navy/15 bg-white p-7 md:min-h-[610px] md:w-[65%] md:p-12">
   <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">{columns.map(column=><div key={column.title}><h3 className="font-label text-sm uppercase tracking-[.15em] text-navy">{column.title}</h3><ul className="mt-6 space-y-3">{column.links.map(link=><li key={`${column.title}-${link.label}`}><Link href={link.href} className="group inline-flex items-start gap-1 text-sm leading-6 text-ink/55 transition hover:text-navy">{link.label}<ArrowUpRight size={11} className="mt-1 opacity-0 transition group-hover:opacity-100"/></Link></li>)}</ul></div>)}</div>
   <div className="mt-14 border-t border-navy/10 pt-9"><div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end"><div><p className="font-label text-sm uppercase tracking-[.15em] text-navy">Join the table</p><p className="mt-2 max-w-sm text-sm leading-6 text-ink/50">Occasional news, seasonal specials and gathering inspiration.</p></div><form onSubmit={(event)=>{event.preventDefault();const email=new FormData(event.currentTarget).get("email");window.location.href=`mailto:hello@greekmansion.ca?subject=${encodeURIComponent("Newsletter signup")}&body=${encodeURIComponent(`Please add ${email} to the Greek Mansion list.`)}`;}} className="flex w-full max-w-md flex-col gap-2 sm:flex-row"><label className="sr-only" htmlFor="footer-email">Email address</label><input id="footer-email" name="email" type="email" required placeholder="Your email address" className="min-w-0 flex-1 rounded-full border border-navy/20 bg-marble px-5 py-3 text-sm outline-none placeholder:text-ink/35 focus:border-gold"/><button className="rounded-full bg-ink px-6 py-3 text-[10px] uppercase tracking-[.16em] text-white transition hover:bg-navy">Subscribe</button></form></div></div>
   <div className="mt-10 flex flex-col justify-between gap-3 border-t border-navy/10 pt-6 text-[9px] uppercase tracking-[.18em] text-ink/40 sm:flex-row"><p>© {new Date().getFullYear()} Greek Mansion Restaurant</p><p>Made by NextRnS in Scarborough</p></div>
  </motion.div>
 </div>
 </motion.div></footer>}
