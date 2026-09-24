import type { Metadata } from "next";
import { ARTICLES } from "@/data/site";
import { BRAND } from "@/config/brand";
import { ArticleCard } from "@/components/insights/ArticleCard";

export const metadata: Metadata = {
  title: "Blog",
  description: "Product news and release notes from Valtora Finance.",
};

export default function BlogPage() {
  const posts = ARTICLES.filter((a) => a.blog);
  return (
    <div className="bg-night text-white">
      <section className="wrap pt-36 pb-12 md:pt-44">
        <p className="text-[15px] text-white/60">Blog</p>
        <h1 className="mt-3 text-[44px] leading-none font-medium tracking-[-0.035em] md:text-[56px]">Product Updates</h1>
        <p className="mt-5 max-w-[520px] font-serif text-[18px] text-white/70">Release notes, design decisions and news about the {BRAND.symbol} project.</p>
      </section>
      <section className="wrap pb-24">
        <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((a) => (
            <ArticleCard key={a.slug} a={a} dark />
          ))}
        </div>
      </section>
    </div>
  );
}
