import Link from "next/link";
import { formatDate, type Article } from "@/data/site";
import { ArticleArt } from "@/components/art/ArticleArt";

export function ArticleCard({ a, dark = false }: { a: Article; dark?: boolean }) {
  return (
    <Link href={`/insights/${a.slug}`} className="group block min-w-0">
      <div className="aspect-[16/9.6] overflow-hidden rounded-[10px]">
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]">
          <ArticleArt variant={a.art} />
        </div>
      </div>
      <p className={`mt-4 text-[13px] ${dark ? "text-white/55" : "text-mute"}`}>
        {a.kind} <span className="mx-1.5">•</span> {a.topic} <span className="mx-1.5">•</span> {formatDate(a.date)}
      </p>
      <h3 className="mt-1.5 text-[15.5px] leading-snug font-medium">{a.title}</h3>
    </Link>
  );
}
