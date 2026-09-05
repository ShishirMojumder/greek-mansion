"use client";
import {CoverflowCarousel} from "@/components/ui/coverflow-carousel";
const dishes=[
 {src:"/images/hero-feast.png",alt:"Chicken souvlaki with charred lemon",title:"Chicken Souvlaki",subtitle:"From the flame",meta:"Marinated slowly, grilled over flame, and finished with lemon and oregano."},
 {src:"/images/family-table.png",alt:"A generous Greek family feast",title:"Family Special",subtitle:"Made for sharing",meta:"A generous spread created for gathering around the table together."},
 {src:"/images/open-flame.png",alt:"Souvlaki grilling over charcoal flame",title:"Pork Souvlaki",subtitle:"Greek tradition",meta:"Seasoned the Greek way and cooked over a live charcoal flame."},
 {src:"/images/hero-feast.png",alt:"Traditional Greek plate on marble",title:"Gyro Plate",subtitle:"A house classic",meta:"Seasoned gyro with your choice of sides and a fresh Greek salad."},
 {src:"/images/family-table.png",alt:"Greek Mansion shared dishes",title:"Mansion BBQ Ribs",subtitle:"Guest favourite",meta:"A full or half rack served generously with your choice of sides."}
];
export default function FeaturedDishes(){return <CoverflowCarousel slides={dishes}/>}
