import type {MetadataRoute} from "next";
export default function robots():MetadataRoute.Robots{return {rules:{userAgent:"*",allow:"/",disallow:["/gm-admin"]},sitemap:"https://greekmansion.ca/sitemap.xml"}}
