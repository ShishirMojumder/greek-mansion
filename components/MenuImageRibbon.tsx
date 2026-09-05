"use client";

import Image from "next/image";
import {motion} from "framer-motion";

const galleries:Record<string,{src:string;alt:string}[]>={
 "Appetizers":[
  {src:"/images/menu/appetizer-01.png",alt:"Crispy appetizer pieces served on a wooden board"},{src:"/images/menu/appetizer-02.png",alt:"Fried calamari with lemon and tzatziki"},{src:"/images/menu/appetizer-03.png",alt:"Golden spiral spanakopita on a Greek patterned plate"},{src:"/images/menu/appetizer-04.png",alt:"Greek fries topped with feta and sauce"}],
 "Sandwiches on a Bun":[
  {src:"/images/menu/sandwich-01.png",alt:"Chicken souvlaki sandwich with fresh vegetables"},{src:"/images/menu/sandwich-02.png",alt:"Philly steak sandwich on a sesame bun"},{src:"/images/menu/sandwich-03.png",alt:"Grilled chicken burger with lettuce, tomato and onion"},{src:"/images/menu/sandwich-04.png",alt:"Souvlaki sandwich with grilled meat and vegetables"}],
 "Mansion Wraps":[
  {src:"/images/menu/wrap-01.png",alt:"Falafel pita wrap with lettuce and tahini"},{src:"/images/menu/wrap-02.png",alt:"Chicken souvlaki pita wrap with tzatziki and vegetables"},{src:"/images/menu/wrap-03.png",alt:"Gyro pita wrap with tomato, lettuce and tzatziki"}]
};

export function MenuImageRibbon({category}:{category:string}){const images=galleries[category];if(!images)return null;return <div className="mb-10">
 <p className="mb-4 text-center font-label text-[9px] uppercase tracking-[.2em] text-navy/55">From our kitchen</p>
 <div className="-mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">{images.map((image,index)=><motion.figure key={image.src} className="group relative aspect-[4/3] w-[72vw] shrink-0 snap-center overflow-hidden rounded-2xl bg-marble shadow-lg shadow-navy/10 ring-1 ring-navy/5 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-navy/30 sm:w-[46%] lg:w-[264px]" initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-70px"}} transition={{duration:.7,delay:index*.08,ease:[.22,1,.36,1]}}><Image src={image.src} alt={image.alt} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]" sizes="(max-width:640px) 72vw,(max-width:1024px) 46vw,264px"/></motion.figure>)}</div>
 </div>}
