import Image from "next/image";

export function BrandLogo({className="w-56",priority=false}:{className?:string;priority?:boolean}){
 return <span className={`relative block aspect-[3.2/1] overflow-hidden ${className}`}><Image src="/images/greek-mansion-logo.png" alt="Greek Mansion" fill priority={priority} className="object-cover object-[50%_54%]" sizes="(max-width: 768px) 190px, 300px"/></span>
}
