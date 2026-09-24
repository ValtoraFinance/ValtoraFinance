import type { MetadataRoute } from "next";
import { BRAND } from "@/config/brand";
import { ARTICLES } from "@/data/site";

const PAGES = ["", "/equities", "/yield", "/treasury", "/token", "/app", "/insights", "/blog", "/learn", "/ecosystem", "/grants", "/docs", "/trust", "/team", "/contact", "/media", "/terms", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  const at = new Date("2026-09-24");
  return [
    ...PAGES.map((path) => ({ url: `${BRAND.url}${path}`, lastModified: at })),
    ...ARTICLES.map((a) => ({ url: `${BRAND.url}/insights/${a.slug}`, lastModified: new Date(a.date) })),
  ];
}
