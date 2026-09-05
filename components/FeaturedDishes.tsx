"use client";
import { useRef } from "react";
import { CoverflowCarousel } from "@/components/ui/coverflow-carousel";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
const dishes=[
 {src:"/images/features/gyro-pita.png",alt:"Greek gyro pita with tzatziki, tomato, red onion and seasoned fries",title:"Gyro Pita",subtitle:"A house classic",meta:"Tender gyro, crisp vegetables and cool tzatziki wrapped in a warm pita."},
 {src:"/images/features/gyro-platter.png",alt:"Generous gyro pita and seasoned fries served against a Greek island setting",title:"Mansion Gyro",subtitle:"Made generously",meta:"A satisfying Greek favourite served fresh with golden seasoned fries."},
 {src:"/images/features/lamb-chops.png",alt:"Grilled lamb chops with Greek potatoes, salad and tzatziki",title:"Lamb Chops",subtitle:"From the flame",meta:"Herb-seasoned lamb chops grilled over flame and served with classic Greek sides."}
];
export default function FeaturedDishes(){
 const ref=useRef<HTMLDivElement>(null);
 useGSAP(()=>{
  if(prefersReducedMotion())return;
  gsap.from(ref.current,{y:48,autoAlpha:0,duration:1,ease:"power3.out",clearProps:"transform,opacity,visibility",scrollTrigger:{trigger:ref.current,start:"top 82%"}});
 },{scope:ref});
 return <div ref={ref}><CoverflowCarousel slides={dishes}/></div>;
}
