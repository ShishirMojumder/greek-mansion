"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type GalleryImage = { src: string; title: string };
const food = (file: string, title: string): GalleryImage => ({ src: `/images/real-food/${file}`, title });

const galleries: Record<string, GalleryImage[]> = {
  Appetizers: [
    food("greek-fries.jpg", "Greek Fries"), food("gyro-poutine.jpg", "Gyro Poutine"),
    food("tzatziki-pita.jpg", "Tzatziki & Pita"), food("spicy-tzatziki.jpg", "Spicy Tzatziki"),
    food("grilled-calamari.jpg", "Grilled Calamari"), food("chicken-wings.jpg", "Chicken Wings"),
  ],
  "Mansion Pita Wraps": [
    food("greekmansion-chickenwrap-native.jpg", "Chicken Souvlaki Wrap"), food("chicken-fillet-wrap.jpg", "Chicken Fillet Wrap"),
    food("greekmansion-gyrowrap-native.jpg", "Gyro Wrap"), food("greekmansion-falafelwrap-native.jpg", "Falafel Wrap"),
    food("pork-1-stick-wrap.jpg", "Pork Souvlaki Wrap"), food("veggie-wrap.jpg", "Veggie Wrap"),
  ],
  "Dinner Plates": [
    food("greekmansion-chickendinner-native.jpg", "Chicken Souvlaki Dinner"), food("pork-plate.jpg", "Pork Souvlaki Plate"),
    food("gyro-plate.jpg", "Gyro Plate"), food("lamb-plate.jpg", "Lamb Plate"),
    food("greekmansion-steakdinner-native.jpg", "Steak Dinner"), food("falafel-plate.jpg", "Falafel Plate"),
  ],
  "Sandwiches on a Bun": [
    food("greekmansion-phillycheesesteak-native.jpg", "Philly Cheese Steak"), food("philly.jpg", "Philly Chicken"),
    food("philly-veggie.jpg", "Philly Veggie"), food("chicken-sandwich.jpg", "Chicken Souvlaki Sandwich"),
    food("pork-sandwhich.jpg", "Pork Souvlaki Sandwich"), food("gyro-sandwich.jpg", "Gyro Sandwich"),
    food("beef-burger.jpg", "Beef Burger"), food("chicken-burger.jpg", "Chicken Burger"),
  ],
  Salads: [
    food("greekmansion-creeksalad-native.jpg", "Greek Salad"), food("chicken-greek-salad.jpg", "Chicken Greek Salad"),
    food("caesar-salad.jpg", "Caesar Salad"),
  ],
  "Mansion Favourites": [
    food("greekmansion-spanakpita-native.jpg", "Spanakopita"), food("greekmansion-calamari-native.jpg", "Calamari"),
    food("greekmansion-fishandchips-native.jpg", "Fish & Chips"), food("greekmansion-chickenfinger-native.jpg", "Chicken Fingers"),
    food("greekmansion-lunchbox-native.jpg", "Mansion Lunch Box"),
  ],
  Specials: [
    food("greekmansion-familymeal-native.jpg", "Family Meal"), food("chicken-special.jpg", "Chicken Special"),
    food("pork-special.jpg", "Pork Special"), food("gyro-special.jpg", "Gyro Special"),
    food("chicken-on-fries.jpg", "Chicken on Fries"), food("gyro-on-fries.jpg", "Gyro on Fries"),
    food("gyro-on-rice.jpg", "Gyro on Rice"), food("pork-on-rice.jpg", "Pork on Rice"),
  ],
};

export function MenuImageRibbon({ category }: { category: string }) {
  const images = galleries[category];
  const trackRef = useRef<HTMLDivElement>(null);
  if (!images) return null;
  const move = (direction: number) => trackRef.current?.scrollBy({ left: direction * 320, behavior: "smooth" });

  return <div className="mb-12">
    <div className="mb-4 flex items-center justify-center gap-3"><p className="font-label text-[9px] uppercase tracking-[.2em] text-navy/55">Swipe to explore</p><span aria-hidden="true" className="text-gold">↔</span></div>
    <div className="relative">
      <div ref={trackRef} className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-12">
        {images.map((image, index) => <motion.figure key={image.src} className="group relative aspect-square w-[78vw] max-w-[320px] shrink-0 snap-center overflow-hidden rounded-2xl bg-marble shadow-lg shadow-navy/10 ring-1 ring-navy/5 sm:w-[42vw] lg:w-[280px]" initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-60px"}} transition={{duration:.65,delay:Math.min(index*.06,.3),ease:[.22,1,.36,1]}}>
          <Image src={image.src} alt={`${image.title} prepared by Greek Mansion`} fill draggable={false} className="select-none object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]" sizes="(max-width:640px) 78vw,(max-width:1024px) 42vw,280px"/>
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/90 via-navy/55 to-transparent px-5 pb-4 pt-14 text-left font-label text-xs uppercase tracking-[.12em] text-white">{image.title}</figcaption>
        </motion.figure>)}
      </div>
      <button type="button" onClick={() => move(-1)} aria-label={`Previous ${category} photos`} className="focus-ring gold-plate absolute left-0 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full text-navy shadow-lg sm:grid"><ChevronLeft size={20}/></button>
      <button type="button" onClick={() => move(1)} aria-label={`Next ${category} photos`} className="focus-ring gold-plate absolute right-0 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full text-navy shadow-lg sm:grid"><ChevronRight size={20}/></button>
    </div>
  </div>;
}
