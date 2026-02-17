import Link from "next/link";
import { MessageCircle, Users, Globe, Star, ExternalLink, ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Communities & Clans",
  description: "Join the active Battlefield 1942 community. Find clans, Discord servers, and groups keeping the game alive.",
};

const communities = [
  {
    title: "Moongamers",
    description: "Established in 2004, this friendly community runs popular servers known for comprehensive installers. Join them for weekly events, including CTF on Saturdays and Expansions on Sundays.",
    website: "http://www.moongamers.com/",
    discord: "http://moon-discord.sytes.net/",
    types: ["Active", "Vanilla", "Events"],
    featured: true,
  },
  {
    title: "HelloClan",
    description: "A social gaming network started in 2008, specializing in preserving older games. They foster a friendly, inclusive atmosphere and host servers for IS82, Desert Combat, and GC, often holding events for those mods.",
    website: "https://www.helloclan.eu/",
    discord: "https://discord.gg/helloclan-the-social-gaming-network-276061597636624395",
    types: ["Active", "Modded"],
    featured: true,
  },
  {
    title: "Team SiMPLE",
    description: "A long-standing, active BF1942 community that provides resources, downloads, and multiple active servers for vanilla and modded gameplay.",
    website: "https://team-simple.org/forum/",
    discord: "https://discord.gg/w35q7AYD",
    types: ["Active", "Vanilla & Modded"],
    featured: false,
  },
  {
    title: "Tanks'nPlanes Unlimited (TPU)",
    description: "A dedicated co-op (PvE) server where human players and bots team up against a larger team of all bots. It runs 24/7 with modified maps featuring increased vehicle spawns.",
    website: "https://jdrgaming.com/tpu/",
    discord: "https://discord.gg/kvg9mfX",
    types: ["Co-op", "PvE", "24/7"],
    featured: false,
  },
  {
    title: "TheGreatEscape-BF1942-USA (TGE)",
    description: "A US-based Battlefield 1942 server and community with an 18+ atmosphere.",
    website: "https://usa-bf1942.proboards.com/",
    discord: null,
    types: ["Active", "Vanilla", "USA"],
    featured: false,
  },
  {
    title: "Interstate 82 (is82.com)",
    description: "A popular racing, stunt, and vehicular combat mod inspired by 'Interstate '76'. While it's a mod, it has a dedicated community and is actively hosted by groups like HelloClan.",
    website: "http://www.IS82.com",
    discord: "https://discord.com/invite/CHM7AApBAP",
    types: ["Mod-specific", "Racing", "Vehicles"],
    featured: false,
  },
];

const typeColors: Record<string, { bg: string; text: string; border: string }> = {
  'Active': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' },
  'Vanilla': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  'Vanilla & Modded': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  'Modded': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
  'Events': { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/30' },
  'Co-op': { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  'PvE': { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  '24/7': { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
  'USA': { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30' },
  'Mod-specific': { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30' },
  'Racing': { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  'Vehicles': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
};

function getTypeStyle(type: string) {
  return typeColors[type] || { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/30' };
}

export default function CommunityPage() {
  return (
    <div className="space-y-12 pb-12">

      {/* --- HERO SECTION --- */}
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 px-6 py-16 shadow-2xl sm:px-12 md:py-24">
        {/* Background Effects */}
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-green-500/10 blur-[100px]" />

        <div className="relative z-10 max-w-3xl">
          <Badge variant="outline" className="mb-4 border-blue-500/30 bg-blue-500/10 text-blue-400">
            Allied Networks
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Community.
          </h1>
          <p className="mt-6 text-lg text-slate-400 max-w-2xl leading-relaxed">
            Connect with squads, organizers, and creators keeping Battlefield 1942 alive. Find your next clan, Discord server, or community event.
          </p>
        </div>
      </div>

      {/* --- COMMUNITIES GRID --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {communities.map((community) => {
          return (
            <div
              key={community.title}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:border-border hover:shadow-lg hover:-translate-y-1"
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-4 px-6 pt-6">
                <div className="flex flex-wrap gap-1.5">
                  {community.types.map((type) => {
                    const style = getTypeStyle(type);
                    return (
                      <Badge
                        key={type}
                        variant="outline"
                        className={cn("text-xs", style.bg, style.text, style.border)}
                      >
                        {type}
                      </Badge>
                    );
                  })}
                </div>
                {community.featured && (
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500 shrink-0" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 px-6 py-4">
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {community.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground/90">
                  {community.description}
                </p>
              </div>

              {/* Footer / Actions */}
              <div className="border-t border-border/40 bg-muted/20 px-6 py-4 flex items-center gap-4">
                {community.website && (
                  <a
                    href={community.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-primary transition-all group-hover:gap-3 group-hover:text-primary/80"
                  >
                    Website <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                {community.discord && (
                  <>
                    <span className="text-border">|</span>
                    <a
                      href={community.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Discord
                    </a>
                  </>
                )}
              </div>

              {/* Decorative Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-green-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-5 pointer-events-none" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
