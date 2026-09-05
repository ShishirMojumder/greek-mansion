import type {MetadataRoute} from "next";
export default function sitemap():MetadataRoute.Sitemap{return ["","/menu","/catering","/about","/contact"].map(route=>({url:`https://greekmansion.ca${route}`,lastModified:new Date(),changeFrequency:route===""?"weekly" as const:"monthly" as const,priority:route===""?1:.8}))}
