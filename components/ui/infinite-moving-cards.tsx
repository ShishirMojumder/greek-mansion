"use client";

import {useEffect, useRef, useState} from "react";
import {Star} from "lucide-react";
import type {Review} from "@/data/reviews";

export type ReviewItem=Review;
/** `direction` is the way the CARDS travel: "left" means each card enters from
 *  the right edge and drifts toward the left. */
type Props={items:ReviewItem[];direction?:"left"|"right";speed?:"normal"|"slow";pauseOnHover?:boolean};

/** A fling can push the rail this much faster than its resting drift (px/s). */
const MAX_FLING=3000;
/** Below this the fling is over and the rail eases back to its own pace. */
const FLING_FLOOR=8;
/** Time constant of the fling's decay, in ms — higher coasts longer. */
const FLING_DECAY=320;
const clamp=(n:number,limit:number)=>Math.max(-limit,Math.min(limit,n));

/** Long reviews get clamped; anything past this is worth a "Read more". */
const CLAMP_AT=340;

function ReviewCard({item,hidden=false,onExpandChange}:{item:ReviewItem;hidden?:boolean;onExpandChange:(open:boolean)=>void}){
 const [open,setOpen]=useState(false);
 const longform=item.quote.length>CLAMP_AT;
 // Every aspect scored top marks — the only case where a five-star row is
 // something the review itself actually says.
 const allFive=item.ratings?item.ratings.food===5&&item.ratings.service===5&&item.ratings.atmosphere===5:false;
 const toggle=()=>{const next=!open;setOpen(next);onExpandChange(next)};

 return <li aria-hidden={hidden||undefined} className="relative flex w-[300px] shrink-0 flex-col rounded-2xl border border-white/20 bg-white p-5 shadow-xl shadow-black/10 sm:w-[380px] sm:p-6">
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

  <blockquote className={`mt-4 whitespace-pre-line text-sm leading-7 text-ink/65 ${open||!longform?"":"line-clamp-[7]"}`}>
   {item.quote}
  </blockquote>
  {longform&&<button type="button" onClick={toggle} className="focus-ring mt-2 self-start font-label text-[10px] uppercase tracking-[.14em] text-navy underline decoration-gold decoration-2 underline-offset-4 hover:text-gold">
   {open?"Show less":"Read more"}
  </button>}

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

export function InfiniteMovingCards({items,direction="left",speed="slow",pauseOnHover=true}:Props){
 const scrollerRef=useRef<HTMLDivElement>(null);
 const interacting=useRef(false);
 const hovering=useRef(false);
 // While anyone is reading an expanded review, the rail holds still.
 const expanded=useRef(0);
 const dragStart=useRef({x:0,scrollLeft:0});
 // Extra px/s carried over from a swipe; decays back to zero on its own.
 const fling=useRef(0);
 // Running estimate of the pointer's speed while a drag is in progress.
 const swipe=useRef({x:0,t:0,v:0});

 useEffect(()=>{
  const scroller=scrollerRef.current;
  if(!scroller)return;
  let frame=0;
  let previous=performance.now();
  const pixelsPerSecond=speed==="slow"?28:42;
  // scrollLeft grows to the right, so a positive delta slides the cards left.
  const drift=direction==="left"?1:-1;

  const loop=(now:number)=>{
   const elapsed=Math.min(now-previous,40);
   previous=now;

   // A fling outranks hover-pause: releasing a swipe under the cursor should
   // still coast, otherwise a desktop flick does nothing at all.
   const coasting=Math.abs(fling.current)>0;
   const held=interacting.current||expanded.current>0||(pauseOnHover&&hovering.current&&!coasting);

   if(!held){
    scroller.scrollLeft+=(drift*pixelsPerSecond+fling.current)*(elapsed/1000);
    fling.current*=Math.exp(-elapsed/FLING_DECAY);
    if(Math.abs(fling.current)<FLING_FLOOR)fling.current=0;
   }

   const halfway=scroller.scrollWidth/2;
   if(halfway>0){
    if(scroller.scrollLeft>=halfway)scroller.scrollLeft-=halfway;
    if(scroller.scrollLeft<0)scroller.scrollLeft+=halfway;
   }
   frame=requestAnimationFrame(loop);
  };
  if(direction==="right")scroller.scrollLeft=scroller.scrollWidth/2;
  frame=requestAnimationFrame(loop);
  return()=>cancelAnimationFrame(frame);
 },[direction,pauseOnHover,speed,items]);

 const onExpandChange=(open:boolean)=>{expanded.current=Math.max(0,expanded.current+(open?1:-1))};

 return <div
  ref={scrollerRef}
  className="review-scroller review-drag-rail relative cursor-grab overflow-x-auto active:cursor-grabbing"
  onMouseEnter={()=>{hovering.current=true}}
  onMouseLeave={()=>{hovering.current=false}}
  onPointerDown={event=>{
   interacting.current=true;
   fling.current=0;
   dragStart.current={x:event.clientX,scrollLeft:event.currentTarget.scrollLeft};
   swipe.current={x:event.clientX,t:performance.now(),v:0};
   event.currentTarget.setPointerCapture(event.pointerId);
  }}
  onPointerMove={event=>{
   if(!interacting.current)return;
   event.currentTarget.scrollLeft=dragStart.current.scrollLeft-(event.clientX-dragStart.current.x);
   // Smoothed pointer speed, in scroll px/s: dragging left (clientX falling)
   // scrolls right, which is the same sense as the resting drift.
   const now=performance.now(),dt=now-swipe.current.t;
   if(dt>0){
    const instant=-(event.clientX-swipe.current.x)/dt*1000;
    swipe.current={x:event.clientX,t:now,v:swipe.current.v*0.7+instant*0.3};
   }
  }}
  onPointerUp={event=>{
   interacting.current=false;
   // Anything slower than this was a nudge to reposition, not a fling.
   fling.current=Math.abs(swipe.current.v)>60?clamp(swipe.current.v,MAX_FLING):0;
   swipe.current.v=0;
   event.currentTarget.releasePointerCapture(event.pointerId);
  }}
  onPointerCancel={()=>{interacting.current=false;swipe.current.v=0}}
  aria-label="Customer reviews from Google. Drag to browse, or swipe faster to speed the rail up."
 >
  <ul className="flex w-max select-none items-stretch gap-4 py-5">
   {items.map((item,index)=><ReviewCard item={item} onExpandChange={onExpandChange} key={`first-${item.initials}-${index}`}/>)}
   {items.map((item,index)=><ReviewCard item={item} hidden onExpandChange={onExpandChange} key={`second-${item.initials}-${index}`}/>)}
  </ul>
 </div>
}
