import Link from "next/link";
import { ArrowRight, Newspaper, Calendar, Radio } from "lucide-react";
import { articles } from "@/lib/articles";
import { getDbArticles } from "@/app/actions/news-article-actions";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News & Updates",
  description: "Latest news, sitreps, and operational updates from the BF1942 Online team.",
};

const CATEGORY_STYLES: Record<string, {
  text: string; border: string; bg: string; bar: string; activeBorder: string;
}> = {
  Update:          { text: "text-blue-400",   border: "border-blue-500/30",   bg: "bg-blue-500/10",   bar: "bg-blue-500",   activeBorder: "hover:border-blue-500/40" },
  News:            { text: "text-green-400",  border: "border-green-500/30",  bg: "bg-green-500/10",  bar: "bg-green-500",  activeBorder: "hover:border-green-500/40" },
  Announcement:    { text: "text-amber-400",  border: "border-amber-500/30",  bg: "bg-amber-500/10",  bar: "bg-amber-500",  activeBorder: "hover:border-amber-500/40" },
  "Weekly Sitrep": { text: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/10", bar: "bg-purple-500", activeBorder: "hover:border-purple-500/40" },
  default:         { text: "text-primary",    border: "border-primary/30",    bg: "bg-primary/10",    bar: "bg-primary",    activeBorder: "hover:border-primary/40" },
};

function getStyle(category: string) {
  return CATEGORY_STYLES[category] ?? CATEGORY_STYLES.default;
}

interface DigestSummary {
  week_number: number;
  period_start: string;
  period_end: string;
  digest_data: { summary: { total_rounds: number; total_kills: number; unique_players: number } };
  created_at: string;
}

async function fetchDigests(): Promise<DigestSummary[]> {
  try {
    const baseUrl = process.env.API_URL?.replace(/\/api\/v1\/$/, "") || "";
    const res = await fetch(`${baseUrl}/api/v1/news/digests`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.ok ? data.digests : [];
  } catch { return []; }
}

interface NewsItem {
  slug: string; title: string; category: string;
  date: string; excerpt: string; href: string;
}

export default async function NewsPage() {
  const [digests, dbArticlesResult] = await Promise.all([fetchDigests(), getDbArticles(false)]);

  const staticItems: NewsItem[] = articles.map((a) => ({
    slug: a.slug, title: a.title, category: a.category,
    date: a.date, excerpt: a.excerpt, href: `/news/${a.slug}`,
  }));

  const digestItems: NewsItem[] = digests.map((d) => {
    const s = d.digest_data.summary;
    const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return {
      slug: `weekly-sitrep-${d.week_number}`,
      title: `Weekly Sitrep: ${fmt(d.period_start)} – ${fmt(d.period_end)}`,
      category: "Weekly Sitrep",
      date: new Date(d.period_end).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      excerpt: `${s.unique_players} soldiers fought across ${s.total_rounds} rounds, racking up ${s.total_kills.toLocaleString()} kills. See who dominated and which maps defined the week.`,
      href: `/news/weekly-sitrep/${d.week_number}`,
    };
  });

  const dbItems: NewsItem[] = (dbArticlesResult.ok ? dbArticlesResult.articles : []).map((a: any) => ({
    slug: a.slug, title: a.title, category: a.category,
    date: new Date(a.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    excerpt: a.excerpt, href: `/news/${a.slug}`,
  }));

  const allItems = [...staticItems, ...dbItems, ...digestItems].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const featured = allItems[0];
  const rest = allItems.slice(1);

  return (
    <div className="space-y-8 pb-8">

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl border border-[#1e2a14] shadow-2xl"
        style={{ background: "linear-gradient(135deg, #0d1208 0%, #0a0f06 50%, #060a04 100%)" }}
      >
        {/* Grid overlay */}
        {/* Glow orbs */}
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-500/6 blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary/6 blur-[70px] pointer-events-none" />

        <div className="relative z-10 px-8 py-12 sm:px-12 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400 mb-4">
                <Radio className="h-2.5 w-2.5 animate-pulse" />
                Intel Reports
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                News &amp;<br />
                <span className="text-primary">Updates</span>
              </h1>
              <p className="mt-3 text-slate-400 max-w-md text-sm leading-relaxed">
                Releases, community highlights, and operational advisories from Command.
              </p>
            </div>
            <div className="flex items-center gap-6 font-mono">
              <div className="text-center">
                <p className="text-2xl font-black text-primary tabular-nums">{allItems.length}</p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">Dispatches</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Featured article ───────────────────────────────────────────── */}
      {featured && (() => {
        const style = getStyle(featured.category);
        return (
          <Link href={featured.href} className="group block">
            <article className={cn(
              "relative overflow-hidden rounded-2xl border border-[#1e2a14] bg-[#070b05]",
              "transition-all duration-200 hover:border-[#2a3a1a] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/40"
            )}>
              {/* Category bar */}
              <div className={`h-[3px] w-full ${style.bar}`} />
              <div className="p-6 sm:p-8 lg:grid lg:grid-cols-[1fr_auto] lg:gap-10 lg:items-center">
                <div className="space-y-4">
                  {/* Meta row */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={cn(
                      "font-mono text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded border",
                      style.text, style.border, style.bg
                    )}>
                      {featured.category}
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-amber-400 border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 rounded">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
                      </span>
                      Latest
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground/50">
                      <Calendar className="h-2.5 w-2.5" />
                      {featured.date}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
                    {featured.title}
                  </h2>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
                    {featured.excerpt}
                  </p>
                </div>
                <div className={cn("mt-6 lg:mt-0 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider whitespace-nowrap shrink-0", style.text)}>
                  Read Dispatch
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </div>
            </article>
          </Link>
        );
      })()}

      {/* ── Article grid ───────────────────────────────────────────────── */}
      {rest.length > 0 && (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((item) => {
            const style = getStyle(item.category);
            return (
              <Link key={item.slug} href={item.href} className="group block h-full">
                <article className={cn(
                  "relative flex flex-col h-full overflow-hidden rounded-xl border border-[#1e2a14] bg-[#070b05]",
                  "transition-all duration-200 hover:border-[#2a3a1a] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/40"
                )}>
                  {/* Category bar */}
                  <div className={`h-[2px] w-full ${style.bar}`} />

                  <div className="flex flex-col flex-1 p-5 gap-3">
                    {/* Meta */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn(
                        "font-mono text-[9px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded border",
                        style.text, style.border, style.bg
                      )}>
                        {item.category}
                      </span>
                      <span className="font-mono text-[9px] text-muted-foreground/40 tabular-nums">{item.date}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-sm text-white leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs text-slate-400/80 leading-relaxed line-clamp-3 flex-1">
                      {item.excerpt}
                    </p>

                    {/* Footer link */}
                    <div className={cn(
                      "flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider mt-auto pt-3 border-t border-[#1e2a14]",
                      style.text
                    )}>
                      Read Dispatch
                      <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      )}

      {allItems.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#1e2a14] bg-[#060a04] py-20 text-center">
          <Newspaper className="h-10 w-10 mb-3 opacity-20" />
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40">No dispatches yet</p>
        </div>
      )}
    </div>
  );
}
