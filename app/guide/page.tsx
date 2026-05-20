import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guides & Tutorials",
  description: "Battlefield 1942 guides — installation walkthrough, gameplay tips, and everything you need to get started or improve your game.",
};
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { guidesList } from "@/lib/guides-list";
import { ArrowRight, BookOpen, Download, ShieldCheck, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function GuideOverviewPage() {
  return (
    <div className="space-y-12 pb-12">

      {/* --- HERO SECTION --- */}
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-[#0d1208] via-[#0a0f06] to-[#060a04] px-6 py-16 shadow-2xl sm:px-12 md:py-24">
        {/* Amber rim light */}
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.13),transparent_65%)] pointer-events-none" />
        {/* Soft white glow */}
        <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.03),transparent_65%)] pointer-events-none" />
        {/* Topographic contour lines */}
        <svg aria-hidden className="absolute inset-0 h-full w-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1200 400">
          <defs>
            <linearGradient id="topoGuide" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="rgba(255,255,255,0.0)" />
              <stop offset="0.4" stopColor="rgba(255,255,255,0.08)" />
              <stop offset="1" stopColor="rgba(255,255,255,0.0)" />
            </linearGradient>
          </defs>
          <path d="M0,70 L150,63 L300,78 L450,60 L600,74 L750,57 L900,71 L1050,61 L1200,70" fill="none" stroke="url(#topoGuide)" strokeWidth="1.2" opacity="0.5" />
          <path d="M0,130 L150,123 L300,138 L450,120 L600,134 L750,117 L900,131 L1050,121 L1200,130" fill="none" stroke="url(#topoGuide)" strokeWidth="0.6" opacity="0.5" />
          <path d="M0,190 L150,183 L300,198 L450,180 L600,194 L750,177 L900,191 L1050,181 L1200,190" fill="none" stroke="url(#topoGuide)" strokeWidth="1.2" opacity="0.5" />
          <path d="M0,250 L150,243 L300,258 L450,240 L600,254 L750,237 L900,251 L1050,241 L1200,250" fill="none" stroke="url(#topoGuide)" strokeWidth="0.6" opacity="0.5" />
          <path d="M0,320 L150,313 L300,328 L450,310 L600,324 L750,307 L900,321 L1050,311 L1200,320" fill="none" stroke="url(#topoGuide)" strokeWidth="1.2" opacity="0.5" />
        </svg>
        {/* Film grain */}
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)", backgroundSize: "3px 3px, 7px 7px", backgroundPosition: "0 0, 1px 2px" }} />

        <div className="relative z-10 max-w-3xl">
          <Badge variant="outline" className="mb-4 border-amber-500/30 bg-amber-500/10 text-amber-400">
            Knowledge Base
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Master the Battlefield.
          </h1>
          <p className="mt-6 text-lg text-zinc-400 max-w-2xl leading-relaxed">
            From essential fixes to veteran tactics. Everything you need to install, optimize, and dominate in Battlefield 1942.
          </p>
        </div>
      </div>

      {/* --- GRID SECTION --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {guidesList.map((guide) => (
          <div key={guide.title} className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:border-border hover:shadow-lg hover:-translate-y-1">

            {/* Header with Icon */}
            <div className={`flex items-center gap-4 px-6 pt-6`}>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-muted ${guide.bgColor} ${guide.color}`}>
                {guide.slug === 'installation' ? <Download className="h-6 w-6" /> : <BookOpen className="h-6 w-6" />}
              </div>
              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {guide.category}
                </span>
                <h3 className="text-xl font-bold text-foreground">
                  {guide.title}
                </h3>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-6 py-4">
              <p className="text-sm leading-relaxed text-muted-foreground/90">
                {guide.description}
              </p>
            </div>

            {/* Footer / Action */}
            <div className="border-t border-border/40 bg-muted/20 px-6 py-4">
              <Link
                href={`/guide/${guide.slug}`}
                className="flex items-center gap-2 text-sm font-medium text-primary transition-all group-hover:gap-3 group-hover:text-primary/80"
              >
                Read Guide <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Decorative Gradient Overlay on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-tr ${guide.bgColor} opacity-0 transition-opacity duration-500 group-hover:opacity-10 pointer-events-none`} />

          </div>
        ))}

        {/* --- PLACEHOLDER CARD: COMING SOON --- */}
        <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border/60 bg-transparent p-6 text-center opacity-60 transition-opacity hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
            <ShieldCheck className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-medium">More Coming Soon</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Mods, performance tweaks, and server admin guides are in the works.
          </p>
        </div>

      </div>
    </div>
  );
}