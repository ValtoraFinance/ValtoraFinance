import type { MetadataRoute } from "next";
import { BRAND } from "@/config/brand";
import { ARTICLES } from "@/data/site";

const PAGES = ["", "/terminal", "/transparency", "/roadmap", "/treasury", "/yield", "/equities", "/token", "/insights", "/blog", "/learn", "/ecosystem", "/docs", "/trust", "/contact", "/media", "/terms", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  const at = new Date("2026-09-25");
  return [
    ...PAGES.map((path) => ({ url: `${BRAND.url}${path}`, lastModified: at })),
    ...ARTICLES.map((a) => ({ url: `${BRAND.url}/insights/${a.slug}`, lastModified: new Date(a.date) })),
  ];
}
