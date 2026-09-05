"use client";
import {InfiniteMovingCards,type ReviewItem} from "@/components/ui/infinite-moving-cards";
const reviews:ReviewItem[]=[
 {quote:"The souvlaki tastes like it came straight from a family grill in Greece—fresh, generous and full of flavour.",name:"Local diner",title:"Scarborough guest",initials:"LD"},
 {quote:"Our catering order was effortless. Everything arrived beautifully and every guest went back for seconds.",name:"Catering guest",title:"Toronto event",initials:"CG"},
 {quote:"A true neighbourhood favourite. Warm service, generous portions and an excellent gyro plate every time.",name:"Regular guest",title:"Local customer",initials:"RG"},
 {quote:"The chicken souvlaki was grilled perfectly, and the potatoes and salad made the whole plate feel homemade.",name:"Dinner guest",title:"Scarborough diner",initials:"DG"},
 {quote:"Wonderful Greek comfort food with the kind of friendly hospitality that makes you want to return.",name:"Family guest",title:"Family dinner",initials:"FG"}
];
export default function ReviewRail(){return <InfiniteMovingCards items={reviews} direction="left" speed="slow"/>}
