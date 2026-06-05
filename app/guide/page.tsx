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

export default function GuideOverviewPage() {
  return (
    <div className="space-y-12 pb-12">

      {/* --- HERO SECTION --- */}
      <div
        className="relative overflow-hidden rounded-2xl border border-[#1e2a14] shadow-2xl"
        style={{ background: "linear-gradient(135deg, #0d1208 0%, #0a0f06 50%, #060a04 100%)" }}
      >
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-500/6 blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary/6 blur-[70px] pointer-events-none" />
        <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-12 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 mb-3">
            Knowledge Base
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Master the Battlefield.
          </h1>
          <p className="mt-6 text-lg text-slate-400 max-w-2xl leading-relaxed">
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