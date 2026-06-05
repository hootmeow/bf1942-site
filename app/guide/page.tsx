import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guides & Tutorials",
  description: "Battlefield 1942 guides — installation walkthrough, gameplay tips, and everything you need to get started or improve your game.",
};

import { guidesList } from "@/lib/guides-list";
import { ArrowRight, BookOpen, Download, ShieldCheck } from "lucide-react";

export default function GuideOverviewPage() {
  return (
    <div className="space-y-10 pb-12">

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {guidesList.map((guide) => (
          <div key={guide.title} className="group relative flex flex-col overflow-hidden rounded-xl border border-[#1e2a14] bg-[#070b05] transition-all duration-300 hover:border-[#2a3a1a] hover:shadow-lg hover:-translate-y-0.5">

            {/* Header with Icon */}
            <div className="flex items-center gap-4 px-5 pt-5">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-[#0a0f06] border border-[#1e2a14] ${guide.color}`}>
                {guide.slug === 'installation' ? <Download className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
              </div>
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground/40">
                  {guide.category}
                </span>
                <h3 className="text-base font-bold text-foreground">
                  {guide.title}
                </h3>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-5 py-4">
              <p className="text-sm leading-relaxed text-muted-foreground/70">
                {guide.description}
              </p>
            </div>

            {/* Footer / Action */}
            <div className="border-t border-[#1e2a14] bg-[#0a0f06]/60 px-5 py-3">
              <Link
                href={`/guide/${guide.slug}`}
                className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-primary transition-all group-hover:gap-3"
              >
                Read Guide <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Hover glow */}
            <div className={`absolute inset-0 ${guide.bgColor} opacity-0 transition-opacity duration-500 group-hover:opacity-5 pointer-events-none`} />

          </div>
        ))}

        {/* --- PLACEHOLDER CARD: COMING SOON --- */}
        <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#1e2a14] bg-[#060a04] p-6 text-center opacity-50 hover:opacity-80 transition-opacity">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#1e2a14] bg-[#0a0f06]">
            <ShieldCheck className="h-5 w-5 text-muted-foreground/40" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-foreground">More Coming Soon</h3>
          <p className="mt-2 text-sm text-muted-foreground/60">
            Mods, performance tweaks, and server admin guides are in the works.
          </p>
        </div>

      </div>
    </div>
  );
}
