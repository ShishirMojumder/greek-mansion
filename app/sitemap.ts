import type {MetadataRoute} from "next";
import {posts} from "@/data/blog";
export default function sitemap():MetadataRoute.Sitemap{
 const base="https://greekmansion.ca";
 const pages=["","/menu","/catering","/about","/contact","/blog"].map(route=>({url:`${base}${route}`,lastModified:new Date(),changeFrequency:route===""?"weekly" as const:"monthly" as const,priority:route===""?1:.8}));
 const blog=posts.map(p=>({url:`${base}/blog/${p.slug}`,lastModified:new Date(p.date),changeFrequency:"yearly" as const,priority:.6}));
 return [...pages,...blog];
}
