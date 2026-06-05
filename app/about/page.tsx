import type { Metadata } from "next";
import Link from "next/link";
import {
  BarChart3, BookOpen, Download, Globe, Heart, History,
  MessageCircle, Monitor, Server, Shield,
  Trophy, Users, Wrench, ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about BF1942 Online, a community-driven statistics hub for Battlefield 1942, providing live server tracking, player profiles, and detailed round history.",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "BF1942 Online - bf1942.online",
  "url": "https://www.bf1942.online",
  "logo": "https://www.bf1942.online/images/og-image.png",
  "sameAs": ["https://discord.gg/XWkkZnqJnm"],
};

const STATS = [
  { icon: BarChart3, value: "100K+", label: "Rounds Tracked",  color: "text-primary",    border: "border-primary/20",    bg: "bg-primary/10"    },
  { icon: Users,     value: "15K+",  label: "Players Seen",    color: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/10" },
  { icon: Server,    value: "24/7",  label: "Live Monitoring", color: "text-blue-400",    border: "border-blue-500/20",   bg: "bg-blue-500/10"   },
  { icon: Trophy,    value: "1M+",   label: "Kills Logged",    color: "text-amber-400",   border: "border-amber-500/20",  bg: "bg-amber-500/10"  },
];

const FEATURES = [
  { icon: Server,    title: "Live Server Browser",       description: "Real-time tracking of every active BF1942 server with live scoreboards, player counts, and current maps.",                                            href: "/servers",      color: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/20"    },
  { icon: BarChart3, title: "Player Profiles",           description: "Detailed stats for every player — KDR, playtime, personal bests, session history, and performance trends over time.",                               href: "/stats",        color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { icon: Trophy,    title: "Leaderboards & Ranks",      description: "Global leaderboards across multiple categories with a military rank progression system.",                                                             href: "/rank-info",    color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/20"   },
  { icon: History,   title: "Round History",             description: "Browse every round played — full scoreboards, team breakdowns, timelines, and map performance data.",                                                 href: "/stats/rounds", color: "text-purple-400",  bg: "bg-purple-500/10",  border: "border-purple-500/20"  },
  { icon: Monitor,   title: "Game Health Dashboard",     description: "Population trends, peak hours, player retention rates, and long-term health metrics for the entire community.",                                       href: "/game-health",  color: "text-cyan-400",    bg: "bg-cyan-500/10",    border: "border-cyan-500/20"    },
  { icon: Download,  title: "Mods & Downloads",          description: "A central hub for Desert Combat, Forgotten Hope, Galactic Conquest, and more — with install guides and secure downloads.",                           href: "/mods",         color: "text-orange-400",  bg: "bg-orange-500/10",  border: "border-orange-500/20"  },
  { icon: BookOpen,  title: "Game Wiki",                 description: "Comprehensive guides covering maps, weapons, vehicles, kits, and battlefield tactics for new and veteran players.",                                    href: "/wiki",         color: "text-indigo-400",  bg: "bg-indigo-500/10",  border: "border-indigo-500/20"  },
  { icon: Users,     title: "Community Hub",             description: "Create and join organizations, coordinate events, and connect with other players in the BF1942 community.",                                           href: "/community",    color: "text-pink-400",    bg: "bg-pink-500/10",    border: "border-pink-500/20"    },
  { icon: Wrench,    title: "Admin Tools",               description: "Linux server scripts, configuration generators, and server management utilities for BF1942 server admins.",                                           href: "/tools",        color: "text-slate-400",   bg: "bg-slate-400/10",   border: "border-slate-500/20"   },
];

const QUICK_LINKS = [
  { label: "Servers",            href: "/servers"      },
  { label: "Leaderboards",       href: "/rank-info"    },
  { label: "Game Health",        href: "/game-health"  },
  { label: "Installation Guide", href: "/guide"        },
  { label: "Mods",               href: "/mods"         },
  { label: "Wiki",               href: "/wiki"         },
  { label: "Events",             href: "/events"       },
  { label: "Tools",              href: "/tools"        },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl border border-[#1e2a14] shadow-2xl"
        style={{ background: "linear-gradient(135deg, #0d1208 0%, #0a0f06 50%, #060a04 100%)" }}
      >
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/6 blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-emerald-500/6 blur-[70px] pointer-events-none" />

        <div className="relative z-10 px-8 py-12 sm:px-12 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400 mb-4">
                <Globe className="h-2.5 w-2.5" />
                About the Project
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                BF1942<br />
                <span className="text-primary">Online</span>
              </h1>
              <p className="mt-3 text-slate-400 max-w-xl text-sm leading-relaxed">
                A passion project built for the Battlefield 1942 community — a modern, comprehensive hub
                for live server tracking, detailed player statistics, historical round data, and everything
                else the community needs to keep this classic alive.
              </p>
            </div>
            <div className="flex items-center gap-8 font-mono shrink-0">
              {STATS.slice(0, 2).map((s) => (
                <div key={s.label} className="text-center">
                  <p className={`text-2xl font-black tabular-nums ${s.color}`}>{s.value}</p>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`flex items-center gap-3 rounded-xl border p-4 ${s.bg} ${s.border}`}>
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${s.bg} border ${s.border}`}>
                <Icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <div>
                <p className={`text-xl font-black tabular-nums leading-none ${s.color}`}>{s.value}</p>
                <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground/60">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Feature grid ──────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <BookOpen className="h-4 w-4 text-primary" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">What We Offer</span>
          <div className="flex-1 h-px bg-gradient-to-r from-[#1e2a14] to-transparent" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Link key={f.title} href={f.href} className="group block">
              <div className="flex items-start gap-3 rounded-xl border border-[#1e2a14] bg-[#070b05] p-4 h-full transition-all duration-200 hover:border-[#2a3a1a] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${f.bg} ${f.border}`}>
                  <f.icon className={`h-4 w-4 ${f.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-white group-hover:text-primary transition-colors leading-tight">{f.title}</p>
                  <p className="text-xs text-slate-400/80 mt-1 leading-relaxed">{f.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Built with love + Join the fight ──────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-[#1e2a14] bg-[#070b05] p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10">
              <Heart className="h-4 w-4 text-red-400" />
            </div>
            <p className="font-bold text-white">Built With Love</p>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed mb-3">
            BF1942 Online is a community-driven project maintained by dedicated fans of
            Battlefield 1942. Over two decades after release, the community continues to
            play, organize, and keep servers running — this site exists to support that effort.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            If you have ideas, find bugs, or want to contribute, reach out on Discord.
            This project grows through community feedback.
          </p>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10">
              <Shield className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="font-bold text-white">Join the Fight</p>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-1">
            Have questions, feedback, or just want to find a game? Our Discord server is the
            home base for the BF1942 Online community — strategy discussions, event coordination,
            and help getting the game running on modern hardware.
          </p>
          <Link
            href="https://discord.gg/XWkkZnqJnm"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/15 px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-emerald-400 transition-all hover:bg-emerald-500/25 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10"
          >
            <MessageCircle className="h-4 w-4" />
            Join Discord
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* ── Quick links ───────────────────────────────────────────────── */}
      <div className="border-t border-[#1e2a14] pt-6 pb-2">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 mb-4">Quick Links</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg border border-[#1e2a14] bg-[#070b05] px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 transition-all hover:border-[#2a3a1a] hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
