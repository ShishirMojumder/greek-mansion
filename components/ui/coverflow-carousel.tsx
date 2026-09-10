"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

/** The picture, its caption and its price. Wrapped in a link when the dish has one. */
function CardFace({ slide, moved }: { slide: CoverflowSlide; moved: React.MutableRefObject<boolean> }) {
  const face = (
    <>
      <img src={slide.src} alt={slide.alt} draggable={false} className="h-full w-full select-none object-cover" />
      {/* The photo is the point: on phones the caption stays a thin strip and the
          prices live under the carousel instead of covering the food. */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 via-ink/45 to-transparent px-4 pb-3 pt-10 text-white sm:px-6 sm:pb-5 sm:pt-20">
        <p className="font-label text-[8px] uppercase tracking-[.2em] text-gold sm:text-[9px] sm:tracking-[.22em]">{slide.subtitle}</p>
        <p className="mt-0.5 font-serif text-base uppercase leading-tight sm:mt-1 sm:text-2xl md:text-3xl">{slide.title}</p>
        {slide.price && (
          <p className="mt-2 hidden flex-wrap gap-1.5 sm:flex">
            {slide.price.split(" · ").map((part) => (
              <span key={part} className="gold-plate whitespace-nowrap rounded-md px-2.5 py-1 font-label text-xs font-semibold leading-4 text-black">
                {part}
              </span>
            ))}
          </p>
        )}
      </div>
    </>
  );
  if (!slide.href) return face;
  return (
    <Link
      href={slide.href}
      // A swipe must never count as a click-through to the menu.
      onClick={(e) => { if (moved.current) e.preventDefault(); }}
      aria-label={`${slide.title} — see it on the menu`}
      className="focus-ring absolute inset-0 block"
      draggable={false}
    >
      {face}
    </Link>
  );
}

export type CoverflowSlide = {src:string;alt:string;title:string;subtitle:string;meta?:string;price?:string;href?:string};
type Props = {slides:CoverflowSlide[];label?:string};
const useIsoLayoutEffect=typeof window!=="undefined"?React.useLayoutEffect:React.useEffect;

export function CoverflowCarousel({slides,label="Greek Mansion featured dishes"}:Props){
 const count=slides.length,frameRef=React.useRef<HTMLDivElement>(null),cardRefs=React.useRef<(HTMLDivElement|null)[]>([]),posRef=React.useRef(0),targetRef=React.useRef(0),widthRef=React.useRef(0),rafRef=React.useRef<number|null>(null),dragRef=React.useRef<{id:number;x:number;pos:number;v:number;t:number}|null>(null),movedRef=React.useRef(false);const [selected,setSelected]=React.useState(0);
 const indexAt=React.useCallback((pos:number)=>((Math.round(pos)%count)+count)%count,[count]);
 const paint=React.useCallback(()=>{const width=widthRef.current;if(!width)return;const pitch=width*1.2,pos=posRef.current;cardRefs.current.forEach((card,index)=>{if(!card)return;let offset=index-pos;offset=((offset%count)+count)%count;if(offset>count/2)offset-=count;const distance=Math.abs(offset),ramp=Math.pow(distance,.58),tilt=Math.min(38*ramp,76)*Math.sign(offset),edge=Math.min(1,Math.max(0,count/2-distance));card.style.transform=`translateX(calc(-50% + ${offset*pitch}px)) translateZ(${-width*.5*ramp}px) rotateY(${-tilt}deg)`;card.style.opacity=String(Math.max(0,1-.12*distance)*edge);card.style.zIndex=String(100-Math.round(distance))})},[count]);
 const settle=React.useCallback((target:number)=>{if(rafRef.current!==null)cancelAnimationFrame(rafRef.current);targetRef.current=target;setSelected(indexAt(target));const step=()=>{const remaining=target-posRef.current;if(Math.abs(remaining)<.0004){posRef.current=target;paint();rafRef.current=null;return}posRef.current+=remaining*.16;paint();rafRef.current=requestAnimationFrame(step)};rafRef.current=requestAnimationFrame(step)},[indexAt,paint]);
 const nudge=React.useCallback((by:number)=>settle(Math.round(targetRef.current)+by),[settle]);
 const down=(e:React.PointerEvent<HTMLDivElement>)=>{movedRef.current=false;if(rafRef.current!==null)cancelAnimationFrame(rafRef.current);e.currentTarget.setPointerCapture(e.pointerId);targetRef.current=posRef.current;dragRef.current={id:e.pointerId,x:e.clientX,pos:posRef.current,v:0,t:performance.now()}};
 const move=(e:React.PointerEvent<HTMLDivElement>)=>{const drag=dragRef.current;if(!drag||drag.id!==e.pointerId)return;const pitch=widthRef.current*1.2;if(!pitch)return;if(Math.abs(e.clientX-drag.x)>6)movedRef.current=true;const now=performance.now(),previous=posRef.current;posRef.current=drag.pos-(e.clientX-drag.x)/pitch;drag.v=((posRef.current-previous)/Math.max(now-drag.t,1))*1000;drag.t=now;const index=indexAt(posRef.current);if(index!==selected)setSelected(index);paint()};
 const up=(e:React.PointerEvent<HTMLDivElement>)=>{const drag=dragRef.current;if(!drag||drag.id!==e.pointerId)return;dragRef.current=null;settle(Math.round(posRef.current+Math.max(-2,Math.min(2,drag.v*.18))))};
 useIsoLayoutEffect(()=>{const frame=frameRef.current;if(!frame)return;const measure=()=>{const card=cardRefs.current[0];if(!card)return;widthRef.current=card.offsetWidth;paint()};measure();const observer=new ResizeObserver(measure);observer.observe(frame);return()=>observer.disconnect()},[paint]);
 React.useEffect(()=>()=>{if(rafRef.current!==null)cancelAnimationFrame(rafRef.current)},[]);
 const active=slides[selected];
 return <div className="w-full" role="region" aria-roledescription="carousel" aria-label={label}>
  <div className="relative"><div ref={frameRef} tabIndex={0} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onKeyDown={e=>{if(e.key==="ArrowLeft"){e.preventDefault();nudge(-1)}if(e.key==="ArrowRight"){e.preventDefault();nudge(1)}}} className="cursor-grab overflow-hidden py-10 outline-none focus-visible:ring-2 focus-visible:ring-gold active:cursor-grabbing" style={{perspective:"clamp(520px,66vw,950px)",touchAction:"pan-y"}}>
   <div className="relative h-[clamp(290px,76vw,430px)] select-none [transform-style:preserve-3d]">{slides.map((slide,index)=><div key={`${slide.title}-${index}`} ref={node=>{cardRefs.current[index]=node}} role="group" aria-roledescription="slide" aria-label={`${index+1} of ${count}`} className="absolute left-1/2 top-0 aspect-square w-[clamp(290px,76vw,430px)] overflow-hidden rounded-t-[48%] border-[3px] border-navy bg-marble shadow-2xl shadow-ink/20 will-change-transform"><CardFace slide={slide} moved={movedRef}/></div>)}</div>
  </div>{/* The rail is full-bleed, so the arrows ride an inner band instead of
     drifting out to the screen edges on wide displays. */}<div className="pointer-events-none absolute inset-0 mx-auto max-w-[1360px]"><button type="button" aria-label="Previous featured dish" onClick={()=>nudge(-1)} className="pointer-events-auto absolute left-2 top-1/2 z-[200] grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-gold/40 bg-marble/90 text-navy backdrop-blur transition hover:bg-navy hover:text-white md:left-8"><ChevronLeft size={19}/></button><button type="button" aria-label="Next featured dish" onClick={()=>nudge(1)} className="pointer-events-auto absolute right-2 top-1/2 z-[200] grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-gold/40 bg-marble/90 text-navy backdrop-blur transition hover:bg-navy hover:text-white md:right-8"><ChevronRight size={19}/></button></div></div>
  <div key={selected} className="mx-auto mt-2 max-w-md animate-[fadeIn_.45s_ease] text-center"><p className="font-serif text-2xl uppercase leading-tight text-navy sm:text-3xl md:text-4xl">{active.title}</p><p className="mt-2 text-[10px] uppercase tracking-[.16em] text-gold sm:text-xs">{active.subtitle}</p>{active.price&&<p className="mt-4 flex flex-wrap justify-center gap-2">{active.price.split(" · ").map(part=><span key={part} className="gold-plate whitespace-nowrap rounded-md px-3 py-1.5 font-label text-xs font-semibold leading-5 tracking-wide text-black sm:text-sm">{part}</span>)}</p>}{active.meta&&<p className="mt-4 text-sm leading-6 text-ink/55">{active.meta}</p>}{active.href&&<Link href={active.href} className="focus-ring mt-5 inline-flex items-center gap-1.5 font-label text-[11px] uppercase tracking-[.16em] text-navy underline decoration-gold decoration-2 underline-offset-4 hover:text-gold">See it on the menu<ArrowUpRight size={14}/></Link>}</div>
  <div className="mt-6 flex justify-center gap-2">{slides.map((slide,index)=><button key={slide.title} onClick={()=>{const target=index+Math.round((targetRef.current-index)/count)*count;settle(target)}} aria-label={`Show ${slide.title}`} aria-current={index===selected} className={`h-1.5 rounded-full transition-all ${index===selected?"w-1.5 bg-navy":"w-1.5 bg-navy/20"}`}/>)}</div>
 </div>
}
