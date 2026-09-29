import type { MetadataRoute } from "next";
import { absoluteUrl, sitePages } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return sitePages.map((p) => ({
    url: absoluteUrl(p.path),
    lastModified,
    changeFrequency: p.priority >= 0.7 ? "monthly" : "yearly",
    priority: p.priority,
  }));
}
