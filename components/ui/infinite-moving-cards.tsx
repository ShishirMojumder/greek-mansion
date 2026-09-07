"use client";

import {useEffect, useRef} from "react";
import {Star} from "lucide-react";

export type ReviewItem={quote:string;name:string;title:string;initials:string};
type Props={items:ReviewItem[];direction?:"left"|"right";speed?:"normal"|"slow";pauseOnHover?:boolean};

function ReviewCard({item,hidden=false}:{item:ReviewItem;hidden?:boolean}){return <li aria-hidden={hidden||undefined} className="relative w-[310px] shrink-0 rounded-2xl border border-white/20 bg-white p-6 shadow-xl shadow-black/10 sm:w-[380px]">
 <div className="flex items-start justify-between gap-4"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-full bg-navy font-label text-sm text-white">{item.initials}</span><div><p className="text-sm font-semibold text-ink">{item.name}</p><p className="mt-0.5 text-[11px] text-ink/45">{item.title}</p></div></div><span aria-label="Google" className="font-sans text-xl font-bold text-[#4285F4]">G</span></div>
 <div className="mt-5 flex items-center gap-1 text-gold" aria-label="5 out of 5 stars">{[0,1,2,3,4].map(star=><Star key={star} size={15} fill="currentColor"/>)}</div>
 <blockquote className="mt-4 text-sm leading-7 text-ink/65">“{item.quote}”</blockquote>
 <p className="mt-5 text-[9px] uppercase tracking-[.16em] text-ink/35">Guest feedback · Google</p>
 </li>}

export function InfiniteMovingCards({items,direction="left",speed="slow",pauseOnHover=true}:Props){
 const scrollerRef=useRef<HTMLDivElement>(null);
 const interacting=useRef(false);
 const hovering=useRef(false);
 const dragStart=useRef({x:0,scrollLeft:0});

 useEffect(()=>{
  const scroller=scrollerRef.current;
  if(!scroller)return;
  let frame=0;
  let previous=performance.now();
  const pixelsPerSecond=speed==="slow"?28:42;
  const loop=(now:number)=>{
   const elapsed=Math.min(now-previous,40);
   previous=now;
   if(!interacting.current&&!(pauseOnHover&&hovering.current)){
    scroller.scrollLeft+=(direction==="left"?1:-1)*pixelsPerSecond*(elapsed/1000);
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

 return <div
  ref={scrollerRef}
  className="review-scroller review-drag-rail relative cursor-grab overflow-x-auto active:cursor-grabbing"
  onMouseEnter={()=>{hovering.current=true}}
  onMouseLeave={()=>{hovering.current=false}}
  onPointerDown={event=>{
   interacting.current=true;
   dragStart.current={x:event.clientX,scrollLeft:event.currentTarget.scrollLeft};
   event.currentTarget.setPointerCapture(event.pointerId);
  }}
  onPointerMove={event=>{
   if(!interacting.current)return;
   event.currentTarget.scrollLeft=dragStart.current.scrollLeft-(event.clientX-dragStart.current.x);
  }}
  onPointerUp={event=>{
   interacting.current=false;
   event.currentTarget.releasePointerCapture(event.pointerId);
  }}
  onPointerCancel={()=>{interacting.current=false}}
  aria-label="Customer reviews. Swipe or drag to browse."
 >
  <ul className="flex w-max select-none gap-4 py-5">{items.map((item,index)=><ReviewCard item={item} key={`first-${item.initials}-${index}`}/>)}{items.map((item,index)=><ReviewCard item={item} hidden key={`second-${item.initials}-${index}`}/>)}</ul>
 </div>
}
