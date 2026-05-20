import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Drill, ExternalLink, User, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toolsList } from "@/lib/tools-list";

export const metadata: Metadata = {
  title: "Tools & Utilities",
  description: "BF1942 server administration tools — Linux server scripts, map alert bots, configuration generators, and more for Battlefield 1942 server admins.",
};

// Map color class strings to hex for inline accent use
const ACCENT_MAP: Record<string, string> = {
  "text-indigo-500":  "#6366f1",
  "text-green-500":   "#22c55e",
  "text-cyan-500":    "#06b6d4",
  "text-amber-500":   "#f59e0b",
  "text-violet-500":  "#8b5cf6",
  "text-emerald-500": "#10b981",
};

export default function ToolsOverviewPage() {
  return (
    <div className="space-y-10 pb-12">

      {/* HERO */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-[#0d1208] via-[#0a0f06] to-[#060a04] px-6 py-14 shadow-2xl sm:px-12 md:py-20">
        <div className="absolute -right-24 -top-24 h-[480px] w-[480px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-[380px] w-[380px] rounded-full bg-teal-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[260px] w-[500px] rounded-full bg-primary/5 blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <Badge variant="outline" className="mb-4 border-indigo-500/30 bg-indigo-500/10 text-indigo-400 uppercase tracking-widest text-[10px]">
            Operational Utilities
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Command & Control
          </h1>
          <p className="mt-4 text-base text-slate-400 max-w-2xl leading-relaxed">
            Essential tools for server administration, community management, and game configuration.
            Built and maintained by the BF1942 community.
          </p>
          <div className="mt-6 flex items-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-indigo-500" />
              {toolsList.length} Tools Available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-teal-500" />
              {toolsList.filter(t => !t.external).length} Hosted Here
            </span>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {toolsList.map((tool) => {
          const accent = ACCENT_MAP[tool.color] ?? "#6366f1";
          return (
            <div
              key={tool.title}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-xl hover:-translate-y-0.5"
            >
              {/* Accent top bar */}
              <div
                className="h-0.5 w-full transition-all duration-300 group-hover:h-1"
                style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
              />

              {/* Header */}
              <div className="flex items-center gap-3 px-5 pt-5">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: accent + "20", border: `1px solid ${accent}30` }}
                >
                  <tool.icon className="h-5 w-5" style={{ color: accent }} />
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {tool.category}
                  </span>
                  <h3 className="font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                    {tool.title}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 px-5 py-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {tool.description}
                </p>
                <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span>
                    by{" "}
                    <a
                      href={tool.authorUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-foreground hover:text-primary transition-colors"
                    >
                      {tool.author}
                    </a>
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div
                className="border-t border-border/30 px-5 py-3"
                style={{ background: accent + "08" }}
              >
                {tool.external ? (
                  <a
                    href={tool.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold transition-colors hover:opacity-80"
                    style={{ color: accent }}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Visit Site
                  </a>
                ) : (
                  <Link
                    href={tool.href}
                    className="flex items-center gap-1.5 text-xs font-semibold transition-all group-hover:gap-2"
                    style={{ color: accent }}
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                    Open Tool
                  </Link>
                )}
              </div>
            </div>
          );
        })}

        {/* Submit card */}
        <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-border/50 bg-transparent p-6 text-center opacity-60 transition-all hover:opacity-100 hover:border-primary/40 cursor-pointer group">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted group-hover:bg-primary/10 transition-colors">
            <Drill className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <h3 className="mt-3 text-sm font-semibold">Build a Tool?</h3>
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
            Have a script or utility to share? Contact us on Discord to get it listed here.
          </p>
        </div>
      </div>
    </div>
  );
}
