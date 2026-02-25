import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3, BookOpen, Download, Globe, Heart, History,
  MessageCircle, Monitor, Server, Shield,
  Trophy, Users, Wrench
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
  "sameAs": [
    "https://discord.gg/XWkkZnqJnm"
  ]
};

const features = [
  {
    icon: Server,
    title: "Live Server Browser",
    description: "Real-time tracking of every active BF1942 server with live scoreboards, player counts, and current maps.",
    href: "/servers",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: BarChart3,
    title: "Player Profiles",
    description: "Detailed stats for every player — KDR, playtime, personal bests, session history, and performance trends over time.",
    href: "/stats",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Trophy,
    title: "Leaderboards & Ranks",
    description: "Global leaderboards across multiple categories with a military rank progression system.",
    href: "/rank-info",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: History,
    title: "Round History",
    description: "Browse every round played — full scoreboards, team breakdowns, timelines, and map performance data.",
    href: "/stats/rounds",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: Monitor,
    title: "Game Health Dashboard",
    description: "Population trends, peak hours, player retention rates, and long-term health metrics for the entire community.",
    href: "/game-health",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
  {
    icon: Download,
    title: "Mods & Downloads",
    description: "A central hub for Desert Combat, Forgotten Hope, Galactic Conquest, and more — with install guides and secure downloads.",
    href: "/mods",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    icon: BookOpen,
    title: "Game Wiki",
    description: "Comprehensive guides covering maps, weapons, vehicles, kits, and battlefield tactics for new and veteran players.",
    href: "/wiki",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    icon: Users,
    title: "Community Hub",
    description: "Create and join organizations, coordinate events, and connect with other players in the BF1942 community.",
    href: "/community",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
  {
    icon: Wrench,
    title: "Admin Tools",
    description: "Linux server scripts, configuration generators, and server management utilities for BF1942 server admins.",
    href: "/tools",
    color: "text-slate-400",
    bg: "bg-slate-400/10",
  },
];


export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl mb-10">
        {/* Background blur orbs */}
        <div className="pointer-events-none absolute -top-12 right-0 h-48 w-48 rounded-full bg-primary/10 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-12 left-0 h-40 w-40 rounded-full bg-emerald-500/10 blur-[70px]" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-in-up">
            <div className="rounded-xl bg-primary/20 p-3">
              <Globe className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  BF1942 Online
                </h1>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                  About the Project
                </Badge>
              </div>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                A passion project built for the Battlefield 1942 community. We provide a modern,
                comprehensive hub for live server tracking, detailed player statistics, historical
                round data, and everything else the community needs to keep this classic alive.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          What We Offer
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Link key={f.title} href={f.href}>
              <Card className="border-border/60 bg-card/40 h-full card-hover group">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${f.bg} shrink-0`}>
                      <f.icon className={`h-4 w-4 ${f.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{f.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{f.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Credits + Community CTA side by side */}
      <div className="grid gap-4 md:grid-cols-2 mb-10">
        {/* Credits */}
        <Card className="border-border/60 bg-card/40">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="rounded-lg bg-red-500/15 p-2">
                <Heart className="h-4 w-4 text-red-400" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Built With Love</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              BF1942 Online is a community-driven project maintained by dedicated fans of
              Battlefield 1942. Over two decades after release, the community continues to
              play, organize, and keep servers running — this site exists to support that effort.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you have ideas, find bugs, or want to contribute, reach out on Discord.
              This project grows through community feedback.
            </p>
          </CardContent>
        </Card>

        {/* Community CTA */}
        <Card className="border-border/60 bg-card/40 bg-gradient-to-br from-emerald-500/5 to-transparent flex flex-col">
          <CardContent className="p-6 flex flex-col flex-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="rounded-lg bg-emerald-500/15 p-2">
                <Shield className="h-4 w-4 text-emerald-400" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Join the Fight</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
              Have questions, feedback, or just want to find a game? Our Discord server is the
              home base for the BF1942 Online community — strategy discussions, event coordination,
              and help getting the game running on modern hardware.
            </p>
            <Button
              asChild
              size="lg"
              className="w-full bg-emerald-600 text-primary-foreground hover:bg-emerald-700"
            >
              <Link
                href="https://discord.gg/XWkkZnqJnm"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Join Discord
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links Footer */}
      <div className="border-t border-border/40 pt-6 pb-4">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">Quick Links</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Servers", href: "/servers" },
            { label: "Leaderboards", href: "/rank-info" },
            { label: "Game Health", href: "/game-health" },
            { label: "Installation Guide", href: "/guide" },
            { label: "Mods", href: "/mods" },
            { label: "Wiki", href: "/wiki" },
            { label: "Organizations", href: "/orgs" },
            { label: "Events", href: "/events" },
            { label: "Tools", href: "/tools" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-sm rounded-md border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
