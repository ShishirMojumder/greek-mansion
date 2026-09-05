"use client";
import {CoverflowCarousel} from "@/components/ui/coverflow-carousel";
const dishes=[
 {src:"/images/features/gyro-pita.png",alt:"Greek gyro pita with tzatziki, tomato, red onion and seasoned fries",title:"Gyro Pita",subtitle:"A house classic",meta:"Tender gyro, crisp vegetables and cool tzatziki wrapped in a warm pita."},
 {src:"/images/features/gyro-platter.png",alt:"Generous gyro pita and seasoned fries served against a Greek island setting",title:"Mansion Gyro",subtitle:"Made generously",meta:"A satisfying Greek favourite served fresh with golden seasoned fries."},
 {src:"/images/features/lamb-chops.png",alt:"Grilled lamb chops with Greek potatoes, salad and tzatziki",title:"Lamb Chops",subtitle:"From the flame",meta:"Herb-seasoned lamb chops grilled over flame and served with classic Greek sides."}
];
export default function FeaturedDishes(){return <CoverflowCarousel slides={dishes}/>}
