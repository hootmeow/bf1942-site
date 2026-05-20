import Link from "next/link";
import { ArrowRight, Newspaper, Calendar, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { articles } from "@/lib/articles";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "News & Updates",
  description: "Latest news, sitreps, and operational updates from the BF1942 Online team.",
};

// Category colors
const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  Update: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  News: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30" },
  Announcement: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
  "Weekly Sitrep": { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
  default: { bg: "bg-primary/10", text: "text-primary", border: "border-primary/30" },
};

function getCategoryStyle(category: string) {
  return CATEGORY_STYLES[category] || CATEGORY_STYLES.default;
}

interface DigestSummary {
  week_number: number;
  period_start: string;
  period_end: string;
  digest_data: {
    summary: { total_rounds: number; total_kills: number; unique_players: number };
  };
  created_at: string;
}

async function fetchDigests(): Promise<DigestSummary[]> {
  try {
    const baseUrl = process.env.API_URL?.replace(/\/api\/v1\/$/, "") || "";
    const res = await fetch(`${baseUrl}/api/v1/news/digests`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.ok ? data.digests : [];
  } catch {
    return [];
  }
}

interface NewsItem {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  href: string;
}

export default async function NewsPage() {
  const digests = await fetchDigests();

  // Convert static articles to NewsItem
  const staticItems: NewsItem[] = articles.map((a) => ({
    slug: a.slug,
    title: a.title,
    category: a.category,
    date: a.date,
    excerpt: a.excerpt,
    href: `/news/${a.slug}`,
  }));

  // Convert digests to NewsItem
  const digestItems: NewsItem[] = digests.map((d) => {
    const s = d.digest_data.summary;
    const fmtDate = (iso: string) =>
      new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const rangeLabel = `${fmtDate(d.period_start)} – ${fmtDate(d.period_end)}`;
    return {
      slug: `weekly-sitrep-${d.week_number}`,
      title: `Weekly Sitrep: ${rangeLabel}`,
      category: "Weekly Sitrep",
      date: new Date(d.period_end).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      excerpt: `${s.unique_players} soldiers fought across ${s.total_rounds} rounds, racking up ${s.total_kills.toLocaleString()} kills. See who dominated and which maps defined the week.`,
      href: `/news/weekly-sitrep/${d.week_number}`,
    };
  });

  // Merge and sort by date descending
  const allItems = [...staticItems, ...digestItems].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-12 pb-12">

      {/* --- HERO SECTION --- */}
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-[#0d1208] via-[#0a0f06] to-[#060a04] px-6 py-16 shadow-2xl sm:px-12 md:py-24">
        {/* Amber rim light */}
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.14),transparent_65%)] pointer-events-none" />
        {/* Warm red glow */}
        <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(239,68,68,0.08),transparent_65%)] pointer-events-none" />
        {/* Topographic contour lines */}
        <svg aria-hidden className="absolute inset-0 h-full w-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1200 400">
          <defs>
            <linearGradient id="topoNews" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="rgba(255,255,255,0.0)" />
              <stop offset="0.4" stopColor="rgba(255,255,255,0.08)" />
              <stop offset="1" stopColor="rgba(255,255,255,0.0)" />
            </linearGradient>
          </defs>
          <path d="M0,70 L150,63 L300,78 L450,60 L600,74 L750,57 L900,71 L1050,61 L1200,70" fill="none" stroke="url(#topoNews)" strokeWidth="1.2" opacity="0.5" />
          <path d="M0,130 L150,123 L300,138 L450,120 L600,134 L750,117 L900,131 L1050,121 L1200,130" fill="none" stroke="url(#topoNews)" strokeWidth="0.6" opacity="0.5" />
          <path d="M0,190 L150,183 L300,198 L450,180 L600,194 L750,177 L900,191 L1050,181 L1200,190" fill="none" stroke="url(#topoNews)" strokeWidth="1.2" opacity="0.5" />
          <path d="M0,250 L150,243 L300,258 L450,240 L600,254 L750,237 L900,251 L1050,241 L1200,250" fill="none" stroke="url(#topoNews)" strokeWidth="0.6" opacity="0.5" />
          <path d="M0,320 L150,313 L300,328 L450,310 L600,324 L750,307 L900,321 L1050,311 L1200,320" fill="none" stroke="url(#topoNews)" strokeWidth="1.2" opacity="0.5" />
        </svg>
        {/* Film grain */}
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)", backgroundSize: "3px 3px, 7px 7px", backgroundPosition: "0 0, 1px 2px" }} />

        <div className="relative z-10 max-w-3xl">
          <Badge variant="outline" className="mb-4 border-amber-500/30 bg-amber-500/10 text-amber-400">
            Intel Reports
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            News & Updates.
          </h1>
          <p className="mt-6 text-lg text-zinc-400 max-w-2xl leading-relaxed">
            Stay informed on product releases, community highlights, and operational advisories from the Command Center.
          </p>
        </div>
      </div>

      {/* --- ARTICLES GRID --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {allItems.map((item, index) => {
          const categoryStyle = getCategoryStyle(item.category);
          const isLatest = index === 0;

          return (
            <div
              key={item.slug}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:border-border hover:shadow-lg hover:-translate-y-1 ${
                isLatest ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-4 px-6 pt-6">
                <Badge
                  variant="outline"
                  className={`${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {item.category}
                </Badge>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {item.date}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 px-6 py-4">
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground/90">
                  {item.excerpt}
                </p>
              </div>

              {/* Footer / Action */}
              <div className="border-t border-border/40 bg-muted/20 px-6 py-4">
                <Link
                  href={item.href}
                  className="flex items-center gap-2 text-sm font-medium text-primary transition-all group-hover:gap-3 group-hover:text-primary/80"
                >
                  Read Full Report <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Decorative Gradient Overlay on Hover */}
              <div className={`absolute inset-0 ${categoryStyle.bg} opacity-0 transition-opacity duration-500 group-hover:opacity-5 pointer-events-none`} />

              {/* Latest Badge */}
              {isLatest && (
                <div className="absolute top-4 right-4">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
