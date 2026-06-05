import Link from "next/link";
import { ArrowRight, Newspaper, Calendar, Tag, Radio } from "lucide-react";
import { articles } from "@/lib/articles";
import { getDbArticles } from "@/app/actions/news-article-actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News & Updates",
  description: "Latest news, sitreps, and operational updates from the BF1942 Online team.",
};

const CATEGORY_STYLES: Record<string, {
  bg: string; text: string; border: string;
  bar: string; glow: string; cardBorder: string;
}> = {
  Update:          { bg: "bg-blue-500/10",   text: "text-blue-400",   border: "border-blue-500/30",   bar: "bg-blue-500",   glow: "hover:shadow-blue-500/10",   cardBorder: "hover:border-blue-500/30" },
  News:            { bg: "bg-green-500/10",  text: "text-green-400",  border: "border-green-500/30",  bar: "bg-green-500",  glow: "hover:shadow-green-500/10",  cardBorder: "hover:border-green-500/30" },
  Announcement:    { bg: "bg-amber-500/10",  text: "text-amber-400",  border: "border-amber-500/30",  bar: "bg-amber-500",  glow: "hover:shadow-amber-500/10",  cardBorder: "hover:border-amber-500/30" },
  "Weekly Sitrep": { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30", bar: "bg-purple-500", glow: "hover:shadow-purple-500/10", cardBorder: "hover:border-purple-500/30" },
  default:         { bg: "bg-primary/10",    text: "text-primary",    border: "border-primary/30",    bar: "bg-primary",    glow: "hover:shadow-primary/10",    cardBorder: "hover:border-primary/30" },
};

function getStyle(category: string) {
  return CATEGORY_STYLES[category] || CATEGORY_STYLES.default;
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
    const range = `${fmt(d.period_start)} – ${fmt(d.period_end)}`;
    return {
      slug: `weekly-sitrep-${d.week_number}`,
      title: `Weekly Sitrep: ${range}`,
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
    <div className="space-y-10 pb-12">

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-[#0d1208] via-[#0a0f06] to-[#060a04] px-6 py-16 shadow-2xl sm:px-12 md:py-20">
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.14),transparent_65%)] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(239,68,68,0.08),transparent_65%)] pointer-events-none" />
        <svg aria-hidden className="absolute inset-0 h-full w-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1200 400">
          <defs>
            <linearGradient id="topoNews" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="rgba(255,255,255,0.0)" />
              <stop offset="0.4" stopColor="rgba(255,255,255,0.08)" />
              <stop offset="1" stopColor="rgba(255,255,255,0.0)" />
            </linearGradient>
          </defs>
          {[70, 130, 190, 250, 320].map((y, i) => (
            <path key={y} d={`M0,${y} L150,${y-7} L300,${y+8} L450,${y-10} L600,${y+4} L750,${y-13} L900,${y+1} L1050,${y-9} L1200,${y}`} fill="none" stroke="url(#topoNews)" strokeWidth={i % 2 === 0 ? "1.2" : "0.6"} opacity="0.5" />
          ))}
        </svg>
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "3px 3px" }} />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 mb-5">
            <Radio className="h-3 w-3 text-amber-400 animate-pulse" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">Intel Reports</span>
            <span className="font-mono text-[10px] text-amber-400/60">· {allItems.length} dispatches</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            News &amp; Updates.
          </h1>
          <p className="mt-4 text-lg text-zinc-400 max-w-2xl leading-relaxed">
            Releases, community highlights, and operational advisories from the BF1942 Online Command Center.
          </p>
        </div>
      </div>

      {/* ── Featured article ───────────────────────────────────────────── */}
      {featured && (() => {
        const style = getStyle(featured.category);
        return (
          <Link href={featured.href} className="group block">
            <article className={`relative overflow-hidden rounded-2xl border border-border/60 bg-[#070b05] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/40 ${style.cardBorder}`}>
              {/* Category bar */}
              <div className={`h-1 w-full ${style.bar}`} />
              <div className="p-6 sm:p-8 lg:grid lg:grid-cols-[1fr_auto] lg:gap-8 lg:items-start">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full border ${style.text} ${style.border} ${style.bg}`}>
                      <Tag className="h-2.5 w-2.5" />
                      {featured.category}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-amber-400/80 border border-amber-500/20 bg-amber-500/8 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
                      </span>
                      Latest
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground/60">
                      <Calendar className="h-3 w-3" />
                      {featured.date}
                    </span>
                  </div>
                  <h2 className={`text-2xl sm:text-3xl font-bold text-white leading-snug transition-colors group-hover:${style.text}`}>
                    {featured.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed max-w-2xl">
                    {featured.excerpt}
                  </p>
                </div>
                <div className={`mt-6 lg:mt-0 flex items-center gap-2 text-sm font-semibold ${style.text} whitespace-nowrap`}>
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((item) => {
            const style = getStyle(item.category);
            return (
              <Link key={item.slug} href={item.href} className="group block h-full">
                <article className={`relative flex flex-col h-full overflow-hidden rounded-xl border border-[#1e2a14] bg-[#070b05] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/40 ${style.cardBorder}`}>
                  {/* Category bar */}
                  <div className={`h-0.5 w-full ${style.bar}`} />

                  <div className="flex flex-col flex-1 p-5 gap-3">
                    {/* Meta */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-full border ${style.text} ${style.border} ${style.bg}`}>
                        {item.category}
                      </span>
                      <span className="text-[10px] text-muted-foreground/50 font-mono">{item.date}</span>
                    </div>

                    {/* Title */}
                    <h3 className={`font-bold text-sm text-foreground leading-snug line-clamp-2 transition-colors group-hover:${style.text}`}>
                      {item.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs text-muted-foreground/70 leading-relaxed line-clamp-3 flex-1">
                      {item.excerpt}
                    </p>

                    {/* Footer */}
                    <div className={`flex items-center gap-1.5 text-xs font-semibold ${style.text} mt-auto pt-3 border-t border-[#1e2a14]`}>
                      Read Dispatch
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </div>

                  {/* Hover shimmer */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </article>
              </Link>
            );
          })}
        </div>
      )}

      {allItems.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/40 py-20 text-center text-muted-foreground/50">
          <Newspaper className="h-10 w-10 mb-3 opacity-30" />
          <p className="text-sm">No dispatches yet. Check back soon.</p>
        </div>
      )}
    </div>
  );
}
