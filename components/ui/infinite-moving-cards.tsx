"use client";

import {useRef,useState} from "react";
import {Star} from "lucide-react";
import type {Review} from "@/data/reviews";

export type ReviewItem=Review;
type Props={items:ReviewItem[];direction?:"left"|"right";speed?:"normal"|"slow"};

/** Long reviews are trimmed so every card stays the same readable height. */
const CLAMP_AT=340;

function ReviewCard({item,hidden=false}:{item:ReviewItem;hidden?:boolean}){
 const longform=item.quote.length>CLAMP_AT;
 // Every aspect scored top marks — the only case where a five-star row is
 // something the review itself actually says.
 const allFive=item.ratings?item.ratings.food===5&&item.ratings.service===5&&item.ratings.atmosphere===5:false;

 return <li aria-hidden={hidden||undefined} className="relative flex w-[86vw] max-w-[370px] shrink-0 flex-col rounded-2xl border border-white/20 bg-white p-5 shadow-xl shadow-black/10 sm:w-[380px] sm:p-6">
  <div className="flex items-start justify-between gap-3">
   <div className="flex min-w-0 items-center gap-3">
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-navy font-label text-sm text-white ring-2 ring-gold/40">{item.initials}</span>
    <div className="min-w-0">
     <p className="truncate text-sm font-semibold text-ink">{item.name}</p>
     <p className="mt-0.5 truncate text-[11px] text-ink/45">{item.credit}</p>
    </div>
   </div>
   <span aria-label="Google" className="shrink-0 font-sans text-xl font-bold text-[#4285F4]">G</span>
  </div>

  <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1.5">
   {allFive&&<span className="flex items-center gap-0.5 text-gold" aria-label="5 out of 5 stars">{[0,1,2,3,4].map(star=><Star key={star} size={14} fill="currentColor"/>)}</span>}
   <span className="text-[11px] text-ink/40">{item.when}</span>
   {item.context.map(chip=><span key={chip} className="rounded-full bg-marble px-2.5 py-0.5 font-label text-[9px] uppercase tracking-[.12em] text-navy/70">{chip}</span>)}
  </div>

  <blockquote className={`mt-4 whitespace-pre-line text-sm leading-7 text-ink/65 ${longform?"line-clamp-[7]":""}`}>
   {item.quote}
  </blockquote>

  <div className="mt-auto pt-5">
   {item.ratings&&<p className="flex flex-wrap gap-1.5 text-[10px] text-ink/50">
    {([["Food",item.ratings.food],["Service",item.ratings.service],["Atmosphere",item.ratings.atmosphere]] as const).map(([label,score])=>
     <span key={label} className="rounded-md bg-navy/[.06] px-2 py-1 font-label uppercase tracking-[.1em]">{label} {score}/5</span>)}
   </p>}
   <p className="mt-3 flex items-center gap-2 text-[9px] uppercase tracking-[.16em] text-ink/35">
    <span>Google review</span>
    {item.reactions&&<span className="tracking-normal">· {item.reactions}</span>}
   </p>
  </div>
 </li>
}

/**
 * Reviews on a constant-speed loop, the same mechanism as the gold ribbon: one
 * CSS animation over two identical copies of the list, so the seam is invisible
 * and the rail never stops, stalls or waits for a gesture.
 */
export function InfiniteMovingCards({items,direction="right",speed="slow"}:Props){
 const seconds=speed==="slow"?96:64;
 // Held down = reading. The CSS animation simply pauses where it stands and
 // picks up again on release; nothing is recalculated.
 const [held,setHeld]=useState(false);
 const dragLayer=useRef<HTMLDivElement>(null);
 const trackRef=useRef<HTMLDivElement>(null);
 const offset=useRef(0);
 const drag=useRef<{id:number;x:number;from:number}|null>(null);

 const applyOffset=(next:number)=>{
  // The list repeats every half of the track, so shifting by exactly that much
  // looks identical — wrapping there keeps a long drag from exposing an edge.
  const half=(trackRef.current?.scrollWidth??0)/2;
  offset.current=half>0?next%half:next;
  if(dragLayer.current)dragLayer.current.style.transform=`translateX(${offset.current}px)`;
 };

 const release=(event:React.PointerEvent<HTMLDivElement>)=>{
  if(drag.current?.id===event.pointerId){
   event.currentTarget.releasePointerCapture(event.pointerId);
   drag.current=null;
  }
  setHeld(false);
 };

 const track=(hidden:boolean)=><ul className="flex shrink-0 items-stretch gap-4 py-5">
  {items.map((item,index)=><ReviewCard item={item} hidden={hidden} key={`${hidden?"b":"a"}-${item.initials}-${index}`}/>)}
 </ul>;

 return <div
  role="region"
  aria-label="Customer reviews. Drag horizontally or use the arrow keys to browse."
  tabIndex={0}
  className="cursor-grab select-none overflow-hidden [touch-action:pan-y] active:cursor-grabbing"
  onKeyDown={event=>{
   if(event.key!=="ArrowLeft"&&event.key!=="ArrowRight")return;
   event.preventDefault();
   applyOffset(offset.current+(event.key==="ArrowLeft"?80:-80));
  }}
  onPointerDown={event=>{
   setHeld(true);
   drag.current={id:event.pointerId,x:event.clientX,from:offset.current};
   event.currentTarget.setPointerCapture(event.pointerId);
  }}
  onPointerMove={event=>{
   const active=drag.current;
   if(!active||active.id!==event.pointerId)return;
   applyOffset(active.from+(event.clientX-active.x));
  }}
  onPointerUp={release}
  onPointerCancel={release}
 >
  <div ref={dragLayer} className="will-change-transform">
   {/* translateX(-50%) is exactly one copy, so the loop point is seamless.
       Reversed, the cards travel left to right. */}
   <div
    ref={trackRef}
    className={`hero-marquee flex w-max ${direction==="right"?"[animation-direction:reverse]":""}`}
    style={{animationDuration:`${seconds}s`,animationPlayState:held?"paused":"running"}}
   >
    {track(false)}
    {track(true)}
   </div>
  </div>
 </div>
}
