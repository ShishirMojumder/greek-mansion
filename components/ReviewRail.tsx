import {InfiniteMovingCards} from "@/components/ui/infinite-moving-cards";
import {reviews} from "@/data/reviews";
export default function ReviewRail(){return <InfiniteMovingCards items={reviews} direction="right" speed="slow"/>}
