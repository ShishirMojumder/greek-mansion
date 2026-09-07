import {MapPin,Phone,ShoppingBag,Star} from "lucide-react";
const btn="grid h-[52px] w-[52px] place-items-center rounded-full bg-navy text-white shadow-lg shadow-navy/30 ring-1 ring-white/10 transition active:scale-95";
const REVIEW_URL="https://g.page/r/CWjzqGR7i7IAEBM/review";
export function MobileBar(){return <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center gap-4 md:hidden">
 <a className={btn} aria-label="Order Greek Mansion on Uber Eats" href="https://www.ubereats.com/ca/store/greek-mansion/2jMowxE1Ts6w_sOBYT_BQA?utm=greekfooddelivery.ca" target="_blank" rel="noreferrer"><ShoppingBag size={20}/></a>
 <a className={btn} aria-label="Call Greek Mansion" href="tel:+14162923333"><Phone size={20}/></a>
 <a className={btn} aria-label="Directions to Greek Mansion" href="https://maps.app.goo.gl/bRD3NCp2ohiZZSp19" target="_blank" rel="noreferrer"><MapPin size={20}/></a>
 <a className={btn} aria-label="Review Greek Mansion on Google" href={REVIEW_URL} target="_blank" rel="noreferrer"><Star size={20}/></a>
</div>}
