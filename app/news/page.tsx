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
    return {
      slug: `weekly-sitrep-${d.week_number}`,
      title: `Weekly Sitrep #${d.week_number}`,
      category: "Weekly Sitrep",
      date: new Date(d.period_end).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      excerpt: `${s.total_rounds} rounds played, ${s.total_kills.toLocaleString()} kills, ${s.unique_players} active soldiers this week.`,
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
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 px-6 py-16 shadow-2xl sm:px-12 md:py-24">
        {/* Background Effects */}
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-red-500/10 blur-[100px]" />

        <div className="relative z-10 max-w-3xl">
          <Badge variant="outline" className="mb-4 border-amber-500/30 bg-amber-500/10 text-amber-400">
            Intel Reports
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            News & Updates.
          </h1>
          <p className="mt-6 text-lg text-slate-400 max-w-2xl leading-relaxed">
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
