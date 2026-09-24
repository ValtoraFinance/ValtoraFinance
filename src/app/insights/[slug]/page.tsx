import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ARTICLES, articleBySlug, formatDate } from "@/data/site";
import { ArticleArt } from "@/components/art/ArticleArt";
import { ArticleCard } from "@/components/insights/ArticleCard";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = articleBySlug(slug);
  if (!a) return {};
  return { title: a.title, description: a.excerpt };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = articleBySlug(slug);
  if (!a) notFound();
  const related = ARTICLES.filter((x) => x.slug !== a.slug).slice(0, 3);
  return (
    <div className="bg-night text-white">
      <article className="wrap pt-32 pb-20 md:pt-40">
        <Link href="/insights" className="inline-flex items-center gap-1.5 text-[14px] text-white/60 hover:text-white">
          <ArrowLeft className="size-4" /> All insights
        </Link>
        <p className="mt-8 text-[14px] text-white/55">
          {a.kind} <span className="mx-1.5">•</span> {a.topic} <span className="mx-1.5">•</span> {formatDate(a.date)}
        </p>
        <h1 className="mt-3 max-w-[900px] text-[34px] leading-[1.05] font-medium tracking-[-0.03em] md:text-[52px]">{a.title}</h1>
        <div className="mt-10 aspect-[16/8] overflow-hidden rounded-[18px]">
          <ArticleArt variant={a.art} />
        </div>
        <div className="mx-auto mt-12 max-w-[680px] space-y-6 font-serif text-[19px] leading-[1.55] text-white/85">
          <p className="text-[22px] leading-snug text-white">{a.excerpt}</p>
          {a.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <p className="border-t border-white/10 pt-6 font-sans text-[13px] leading-relaxed text-white/50">
            Written by Valtora contributors. This note describes plans and general concepts; it is not investment
            advice and not an offer of any product.
          </p>
        </div>
      </article>
      <section className="wrap pb-24">
        <h2 className="text-[28px] font-medium tracking-[-0.02em]">Keep reading</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {related.map((r) => (
            <ArticleCard key={r.slug} a={r} dark />
          ))}
        </div>
      </section>
    </div>
  );
}
