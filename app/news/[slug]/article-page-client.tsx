"use client";

import { useParams } from "next/navigation";
import { getArticleBySlug } from "@/lib/articles";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, ArrowLeft, Calendar, Tag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CATEGORY_STYLES: Record<string, { text: string; border: string; bg: string; bar: string }> = {
  Update:          { text: "text-sky-400",      border: "border-sky-500/30",     bg: "bg-sky-500/10",     bar: "bg-sky-500"     },
  News:            { text: "text-emerald-400",  border: "border-emerald-500/30", bg: "bg-emerald-500/10", bar: "bg-emerald-500" },
  Announcement:    { text: "text-amber-400",    border: "border-amber-500/30",   bg: "bg-amber-500/10",   bar: "bg-amber-500"   },
  "Weekly Sitrep": { text: "text-teal-400",     border: "border-teal-500/30",    bg: "bg-teal-500/10",    bar: "bg-teal-500"    },
  default:         { text: "text-primary",      border: "border-primary/30",     bg: "bg-primary/10",     bar: "bg-primary"     },
};

function getStyle(category: string) {
  return CATEGORY_STYLES[category] ?? CATEGORY_STYLES.default;
}

export default function ArticlePageClient() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;

  const article = slug ? getArticleBySlug(slug) : undefined;

  if (!article) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Article Not Found</AlertTitle>
        <AlertDescription>
          This news article could not be found.
          <Button asChild variant="link" className="p-0 pl-2">
            <Link href="/news">Return to News</Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const style = getStyle(article.category);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': article.title,
    'description': article.excerpt,
    'datePublished': new Date(article.date).toISOString(),
    'author': { '@type': 'Organization', 'name': 'BF1942 Online' },
    'publisher': {
      '@type': 'Organization',
      'name': 'BF1942 Online',
      'logo': { '@type': 'ImageObject', 'url': 'https://www.bf1942.online/logo.png' },
    },
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Back nav */}
      <Link
        href="/news"
        className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3 w-3" />
        All Dispatches
      </Link>

      {/* Hero */}
      <div
        className="relative overflow-hidden rounded-2xl border border-[#1e2a14] shadow-2xl"
        style={{ background: "linear-gradient(135deg, #0d1208 0%, #0a0f06 50%, #060a04 100%)" }}
      >
        <div className={`absolute inset-x-0 top-0 h-[3px] ${style.bar}`} />
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-500/6 blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary/6 blur-[70px] pointer-events-none" />

        <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-10">
          <div className="flex items-center gap-3 flex-wrap mb-4">
            <Badge
              variant="outline"
              className={`font-mono text-[9px] font-bold uppercase tracking-[0.15em] ${style.text} ${style.border} ${style.bg}`}
            >
              <Tag className="h-2.5 w-2.5 mr-1" />
              {article.category}
            </Badge>
            <span className="inline-flex items-center gap-1.5 font-mono text-[9px] text-muted-foreground/50">
              <Calendar className="h-2.5 w-2.5" />
              {article.date}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-snug">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="mt-3 text-slate-400 text-sm leading-relaxed max-w-2xl">
              {article.excerpt}
            </p>
          )}
        </div>
      </div>

      {/* Article body */}
      <div className="rounded-xl border border-[#1e2a14] bg-[#070b05] px-6 py-8 sm:px-10">
        <div className="prose prose-sm prose-invert max-w-none
          text-slate-300
          prose-headings:text-white prose-headings:font-bold prose-headings:mt-6 prose-headings:mb-3
          prose-h2:text-2xl prose-h3:text-xl prose-h3:border-b prose-h3:border-[#1e2a14] prose-h3:pb-2
          prose-p:leading-relaxed prose-p:text-slate-400
          prose-ul:my-4 prose-li:my-1 prose-li:text-slate-400
          prose-strong:text-white
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
          {article.content}
        </div>
      </div>

      {/* Footer nav */}
      <div className="flex items-center justify-between pt-2">
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to News
        </Link>
      </div>
    </div>
  );
}