import type { Metadata } from "next";
import Image from "next/image";
import { BriefcaseBusiness, PartyPopper, Users } from "lucide-react";
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

export default function Catering() {
  return <>
    <section className="marble px-5 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-[1240px]">
        <p className="eyebrow">Gather generously</p>
        <div className="mt-5 grid gap-6 md:grid-cols-[1.5fr_1fr] md:items-end">
          <h1 className="display text-5xl uppercase text-navy md:text-8xl">Greek catering</h1>
          <p className="max-w-md text-sm leading-7 text-ink/70">From a working lunch to a once-in-a-lifetime toast, we make feeding a crowd warm, abundant and uncomplicated.</p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-stretch">
          <article className="group order-2 overflow-hidden rounded-[28px] bg-white p-3 shadow-2xl shadow-navy/10 ring-1 ring-navy/10 md:p-4 lg:order-1">
            <div className="relative h-full min-h-[340px] overflow-hidden rounded-[20px] bg-marble">
              <Image src="/images/catering-boxes.png" alt="Greek Mansion Family Catering boxes and foil trays packed at the counter" fill className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]" sizes="(max-width:1024px) 100vw, 560px" />
            </div>
          </article>

          <div className="order-1 rounded-[28px] bg-navy p-7 text-white shadow-2xl shadow-navy/25 md:p-10 lg:order-2">
            <p className="font-label text-[10px] uppercase tracking-[.2em] text-gold">Tell us about your event</p>
            <h2 className="mt-3 font-serif text-4xl uppercase leading-none md:text-5xl">Request catering</h2>
            <p className="mt-3 text-sm leading-6 text-white/60">Send it now — we reply the same day with a menu and a quote.</p>
            <CateringForm />
          </div>
        </div>
      </div>
    </section>

    <section className="px-5 py-24 md:px-10">
      <div className="mx-auto grid max-w-[1240px] gap-14 md:grid-cols-2 md:items-center">
        <div>
          <p className="eyebrow">Made for every gathering</p>
          <h2 className="mt-5 font-serif text-4xl text-navy md:text-5xl">A table everyone remembers.</h2>
          <div className="mt-10 space-y-7">{details.map(([Icon, t, d]) => {
            const C = Icon as typeof Users;
            return <div className="grid grid-cols-[42px_1fr] gap-4 border-b border-navy/15 pb-6" key={t}><C className="text-gold" /><div><h3 className="font-serif text-2xl">{t}</h3><p className="mt-1 text-sm text-ink/55">{d}</p></div></div>;
          })}</div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[24px]">
          <Image src="/images/catering-boxes.png" alt="Stacked Greek Mansion Family Catering boxes with foil trays and pita at the counter" fill className="object-cover object-center" sizes="(max-width:768px) 100vw, 560px" />
        </div>
      </div>
    </section>
  </>;
}
