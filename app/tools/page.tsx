import Link from "next/link";
import { ArrowRight, Drill, Shield, Wrench, ExternalLink, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toolsList } from "@/lib/tools-list";

export default function ToolsOverviewPage() {
  return (
    <div className="space-y-12 pb-12">

      {/* --- HERO SECTION --- */}
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 px-6 py-16 shadow-2xl sm:px-12 md:py-24">
        {/* Background Effects */}
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-teal-500/10 blur-[100px]" />

        <div className="relative z-10 max-w-3xl">
          <Badge variant="outline" className="mb-4 border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
            Operational Utilities
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Command & Control.
          </h1>
          <p className="mt-6 text-lg text-slate-400 max-w-2xl leading-relaxed">
            Essential tools for server administration, community management, and game configuration. Built and maintained by the community.
          </p>
        </div>
      </div>

      {/* --- GRID SECTION --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {toolsList.map((tool) => (
          <div key={tool.title} className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:border-border hover:shadow-lg hover:-translate-y-1">

            {/* Header with Icon */}
            <div className={`flex items-center gap-4 px-6 pt-6`}>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-muted ${tool.bgColor} ${tool.color}`}>
                <tool.icon className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {tool.category}
                </span>
                <h3 className="text-xl font-bold text-foreground">
                  {tool.title}
                </h3>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-6 py-4">
              <p className="text-sm leading-relaxed text-muted-foreground/90">
                {tool.description}
              </p>
              <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span>Created by{" "}
                  <a
                    href={tool.authorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground hover:text-primary hover:underline underline-offset-2 transition-colors"
                  >
                    {tool.author}
                  </a>
                </span>
              </div>
            </div>

            {/* Footer / Action */}
            <div className="border-t border-border/40 bg-muted/20 px-6 py-4">
              {tool.external ? (
                <a
                  href={tool.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium text-primary transition-all group-hover:gap-3 group-hover:text-primary/80"
                >
                  Visit Site <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <Link
                  href={tool.href}
                  className="flex items-center gap-2 text-sm font-medium text-primary transition-all group-hover:gap-3 group-hover:text-primary/80"
                >
                  Go to Tool <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>

            {/* Decorative Gradient Overlay on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-tr ${tool.bgColor} opacity-0 transition-opacity duration-500 group-hover:opacity-10 pointer-events-none`} />

          </div>
        ))}

        {/* --- PLACEHOLDER CARD: SUBMIT TOOL --- */}
        <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border/60 bg-transparent p-6 text-center opacity-70 transition-opacity hover:opacity-100 cursor-pointer group">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted group-hover:bg-primary/10 transition-colors">
            <Drill className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-medium">Build a Tool?</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            If you have a script or utility to share, contact us on Discord to have it listed here.
          </p>
        </div>

      </div>
    </div>
  );
}
