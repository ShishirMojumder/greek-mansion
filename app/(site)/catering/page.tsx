import type { Metadata } from "next";
import Image from "next/image";
import { Banknote, BriefcaseBusiness, Check, PartyPopper, Users } from "lucide-react";
import CateringForm from "@/components/CateringForm";

export const metadata: Metadata = {
  title: "Greek Catering Toronto",
  description: "Premium Greek catering in Toronto for corporate events, family gatherings and special occasions. Request catering from Greek Mansion.",
};

const details: [typeof Users, string, string][] = [
  [BriefcaseBusiness, "Corporate events", "Team lunches, meetings and polished client gatherings."],
  [Users, "Family gatherings", "Generous platters designed to pass, share and enjoy."],
  [PartyPopper, "Special occasions", "Birthdays, showers, milestones and everything worth celebrating."],
];

const packages = [
  { people: "10 People", price: "$135.00" },
  { people: "15 People", price: "$202.50" },
  { people: "20 People", price: "$270.00" },
  { people: "25 People", price: "$337.50" },
];

const included = ["Rice", "Potatoes", "Greek Salad", "Tzatziki", "Pita Bread"];

export default function Catering() {
  return <>
    <section className="overflow-hidden bg-navy px-5 py-20 text-white md:px-10 md:py-28">
      <div className="mx-auto max-w-[1240px]">
        <div className="text-center">
          <p className="font-label text-[10px] uppercase tracking-[.22em] text-gold">Feed the whole table</p>
          <h1 className="display mt-5 text-5xl uppercase md:text-7xl">Catering packages</h1>
          <div className="mx-auto mt-7 inline-flex max-w-2xl items-center gap-3 rounded-full border border-gold/40 bg-white/10 px-5 py-3 text-left shadow-lg shadow-black/10">
            <Banknote className="shrink-0 text-gold" size={21} />
            <p className="text-xs leading-5 text-white/75"><strong className="font-label uppercase tracking-[.12em] text-white">All catering cash or debit only.</strong> Surcharges may apply otherwise.</p>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {packages.map((item) => <article key={item.people} className="group rounded-[26px] bg-white p-6 text-center text-ink shadow-xl shadow-black/10 transition duration-500 hover:-translate-y-2">
            <p className="font-label text-[10px] uppercase tracking-[.18em] text-navy/50">Catering combo</p>
            <h3 className="mt-4 font-serif text-3xl uppercase leading-none text-navy">{item.people}</h3>
            <p className="gold-plate mt-5 inline-flex rounded-full px-5 py-2 font-label text-sm tracking-[.08em] text-ink transition-transform duration-300 group-hover:scale-105">{item.price}</p>
          </article>)}
        </div>

        <div className="mt-8 grid overflow-hidden rounded-[28px] bg-white text-ink shadow-2xl shadow-black/15 md:grid-cols-[1.05fr_.95fr]">
          <div className="p-7 md:p-10">
            <p className="eyebrow">Every order includes</p>
            <h3 className="mt-4 font-serif text-4xl uppercase leading-none text-navy md:text-5xl">The complete spread</h3>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {included.map(side => <li key={side} className="flex items-center gap-3 text-sm text-ink/70"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy text-gold"><Check size={16}/></span>{side}</li>)}
            </ul>
            <p className="mt-8 border-t border-navy/10 pt-6 text-sm leading-6 text-ink/55">Substitutions are available for an additional charge.</p>
            <p className="mt-5 font-label text-[10px] uppercase tracking-[.16em] text-navy">All catering cash or debit only</p>
          </div>
          <div className="relative min-h-[300px] md:min-h-full">
            <Image src="/images/real-food/greekmansion-familymeal-native.jpg" alt="A real Greek Mansion catering meal with chicken, rice, pita and tzatziki" fill className="object-cover object-center" sizes="(max-width:768px) 100vw, 540px" />
          </div>
        </div>
      </div>
    </section>

    <section className="marble px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto grid max-w-[1240px] gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-stretch">
        <article className="group overflow-hidden rounded-[28px] bg-white p-3 shadow-2xl shadow-navy/10 ring-1 ring-navy/10 md:p-4">
          <div className="relative h-full min-h-[340px] overflow-hidden rounded-[20px] bg-marble">
            <Image src="/images/real-food/hero.jpg" alt="A generous spread of real Greek Mansion food for catering" fill className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]" sizes="(max-width:1024px) 100vw, 520px" />
          </div>
        </article>
        <div className="rounded-[28px] bg-navy p-7 text-white shadow-2xl shadow-navy/25 md:p-10">
          <p className="font-label text-[10px] uppercase tracking-[.2em] text-gold">Tell us about your event</p>
          <h2 className="mt-3 font-serif text-4xl uppercase leading-none md:text-5xl">Request catering</h2>
          <p className="mt-3 text-sm leading-6 text-white/60">Send it now — we reply the same day with a menu and a quote.</p>
          <CateringForm />
        </div>
      </div>
    </section>

    <section className="bg-[#F1ECE2] px-5 py-24 md:px-10">
      <div className="mx-auto grid max-w-[1240px] gap-14 md:grid-cols-2 md:items-center">
        <div>
          <p className="eyebrow">Made for every gathering</p>
          <h2 className="mt-5 font-serif text-4xl text-navy md:text-5xl">A table everyone remembers.</h2>
          <div className="mt-10 space-y-7">{details.map(([Icon, t, d]) => {
            const C = Icon as typeof Users;
            return <div className="grid grid-cols-[42px_1fr] gap-4 border-b border-navy/15 pb-6" key={t}><C className="text-gold" /><div><h3 className="font-serif text-2xl">{t}</h3><p className="mt-1 text-sm text-ink/55">{d}</p></div></div>;
          })}</div>
        </div>
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[390px] overflow-hidden rounded-[24px] shadow-xl shadow-navy/10 md:mx-0 md:justify-self-end">
          <Image src="/images/real-food/hero.jpg" alt="A generous spread of real Greek Mansion food for a group" fill className="object-cover object-center" sizes="(max-width:768px) 100vw, 560px" />
        </div>
      </div>
    </section>
  </>;
}
