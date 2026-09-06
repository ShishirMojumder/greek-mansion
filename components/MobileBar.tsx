import {MapPin,Phone,ShoppingBag} from "lucide-react";
const btn="grid h-[52px] w-[52px] place-items-center rounded-full bg-navy text-white shadow-lg shadow-navy/30 ring-1 ring-white/10 transition active:scale-95";
const orderBtn="grid h-[52px] w-[52px] place-items-center rounded-full bg-[#06C167] text-black shadow-lg shadow-black/25 ring-1 ring-black/10 transition active:scale-95";
export function MobileBar(){return <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center gap-5 md:hidden">
 <a className={orderBtn} aria-label="Order Greek Mansion on Uber Eats" href="https://www.ubereats.com/ca/store/greek-mansion/2jMowxE1Ts6w_sOBYT_BQA?utm=greekfooddelivery.ca" target="_blank" rel="noreferrer"><ShoppingBag size={20}/></a>
 <a className={btn} aria-label="Call Greek Mansion" href="tel:+14162923333"><Phone size={20}/></a>
 <a className={btn} aria-label="Directions to Greek Mansion" href="https://maps.google.com/?q=5651+Steeles+Ave+E+Scarborough+ON"><MapPin size={20}/></a>
</div>}
