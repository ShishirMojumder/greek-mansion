"use client";

import type {CSSProperties} from "react";
import {Star} from "lucide-react";

export type ReviewItem={quote:string;name:string;title:string;initials:string};
type Props={items:ReviewItem[];direction?:"left"|"right";speed?:"normal"|"slow";pauseOnHover?:boolean};

function ReviewCard({item,hidden=false}:{item:ReviewItem;hidden?:boolean}){return <li aria-hidden={hidden||undefined} className="relative w-[310px] shrink-0 rounded-2xl border border-white/20 bg-white p-6 shadow-xl shadow-black/10 sm:w-[380px]">
 <div className="flex items-start justify-between gap-4"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-full bg-navy font-label text-sm text-white">{item.initials}</span><div><p className="text-sm font-semibold text-ink">{item.name}</p><p className="mt-0.5 text-[11px] text-ink/45">{item.title}</p></div></div><span aria-label="Google" className="font-sans text-xl font-bold text-[#4285F4]">G</span></div>
 <div className="mt-5 flex items-center gap-1 text-gold" aria-label="5 out of 5 stars">{[0,1,2,3,4].map(star=><Star key={star} size={15} fill="currentColor"/>)}</div>
 <blockquote className="mt-4 text-sm leading-7 text-ink/65">“{item.quote}”</blockquote>
 <p className="mt-5 text-[9px] uppercase tracking-[.16em] text-ink/35">Guest feedback · Google</p>
 </li>}

export function InfiniteMovingCards({items,direction="left",speed="slow",pauseOnHover=true}:Props){const style={"--review-duration":speed==="slow"?"58s":"38s","--review-direction":direction==="left"?"normal":"reverse"} as CSSProperties;return <div className="review-scroller relative overflow-hidden" style={style}><ul className={`review-track flex w-max gap-4 py-5 ${pauseOnHover?"hover:[animation-play-state:paused]":""}`}>{items.map((item,index)=><ReviewCard item={item} key={`first-${item.initials}-${index}`}/>)}{items.map((item,index)=><ReviewCard item={item} hidden key={`second-${item.initials}-${index}`}/>)}</ul></div>}
