import Link from "next/link";
import { MessageCircle, Globe, Star, ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Communities & Clans",
  description: "Join the active Battlefield 1942 community. Find clans, Discord servers, and groups keeping the game alive.",
};

const communities = [
  {
    title: "-[ECHO]- Gaming",
    description: "A community centered on Desert Combat, running custom and modded maps. Known for organized events and a tight-knit player base that keeps the DC scene active.",
    website: "https://echo-gaming.com/",
    discord: "https://discord.gg/y7XrcnuzeG",
    types: ["Active", "Modded", "Events", "Desert Combat"],
    featured: true,
    accent: "#f59e0b",
  },
  {
    title: "Moongamers",
    description: "Established in 2004, this friendly community runs popular servers known for comprehensive installers. Join them for weekly events, including CTF on Saturdays and Expansions on Sundays.",
    website: "http://www.moongamers.com/",
    discord: "http://moon-discord.sytes.net/",
    types: ["Active", "Vanilla", "Events"],
    featured: true,
    accent: "#3b82f6",
  },
  {
    title: "HelloClan",
    description: "A social gaming network started in 2008, specializing in preserving older games. They foster a friendly, inclusive atmosphere and host servers for IS82, Desert Combat, and GC, often holding events for those mods.",
    website: "https://www.helloclan.eu/",
    discord: "https://discord.gg/helloclan-the-social-gaming-network-276061597636624395",
    types: ["Active", "Modded"],
    featured: false,
    accent: "#8b5cf6",
  },
  {
    title: "Team SiMPLE",
    description: "A long-standing, active BF1942 community that provides resources, downloads, and multiple active servers for vanilla and modded gameplay.",
    website: "https://team-simple.org/forum/",
    discord: "https://discord.gg/w35q7AYD",
    types: ["Active", "Vanilla & Modded"],
    featured: false,
    accent: "#10b981",
  },
  {
    title: "Tanks'nPlanes Unlimited (TPU)",
    description: "A dedicated co-op (PvE) server where human players and bots team up against a larger team of all bots. It runs 24/7 with modified maps featuring increased vehicle spawns.",
    website: "https://jdrgaming.com/tpu/",
    discord: "https://discord.gg/kvg9mfX",
    types: ["Co-op", "PvE", "24/7"],
    featured: false,
    accent: "#06b6d4",
  },
  {
    title: "TheGreatEscape-BF1942-USA (TGE)",
    description: "A US-based Battlefield 1942 server and community with an 18+ atmosphere.",
    website: "https://usa-bf1942.proboards.com/",
    discord: null,
    types: ["Active", "Vanilla", "USA"],
    featured: false,
    accent: "#ef4444",
  },
  {
    title: "Interstate 82 (is82.com)",
    description: "A popular racing, stunt, and vehicular combat mod inspired by 'Interstate '76'. While it's a mod, it has a dedicated community and is actively hosted by groups like HelloClan.",
    website: "http://www.IS82.com",
    discord: "https://discord.com/invite/CHM7AApBAP",
    types: ["Mod-specific", "Racing", "Vehicles"],
    featured: false,
    accent: "#f97316",
  },
];

const typeColors: Record<string, { bg: string; text: string; border: string }> = {
  'Active':          { bg: 'bg-green-500/10',  text: 'text-green-400',  border: 'border-green-500/30'  },
  'Vanilla':         { bg: 'bg-blue-500/10',   text: 'text-blue-400',   border: 'border-blue-500/30'   },
  'Vanilla & Modded':{ bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  'Modded':          { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
  'Events':          { bg: 'bg-pink-500/10',   text: 'text-pink-400',   border: 'border-pink-500/30'   },
  'Co-op':           { bg: 'bg-cyan-500/10',   text: 'text-cyan-400',   border: 'border-cyan-500/30'   },
  'PvE':             { bg: 'bg-cyan-500/10',   text: 'text-cyan-400',   border: 'border-cyan-500/30'   },
  '24/7':            { bg: 'bg-red-500/10',    text: 'text-red-400',    border: 'border-red-500/30'    },
  'USA':             { bg: 'bg-slate-500/10',  text: 'text-slate-400',  border: 'border-slate-500/30'  },
  'Desert Combat':   { bg: 'bg-amber-500/10',  text: 'text-amber-400',  border: 'border-amber-500/30'  },
  'Mod-specific':    { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30' },
  'Racing':          { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  'Vehicles':        { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
};

function getTypeStyle(type: string) {
  return typeColors[type] || { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/30' };
}

// First letter of community name as avatar
function Initials({ name, accent }: { name: string; accent: string }) {
  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black"
      style={{ background: accent + "20", color: accent, border: `1px solid ${accent}30` }}
    >
      {name.replace(/[-\[( ]/g, "").charAt(0).toUpperCase()}
    </div>
  );
}

export default function CommunityPage() {
  const featured = communities.filter((c) => c.featured);
  const rest     = communities.filter((c) => !c.featured);

  return (
    <div className="space-y-10 pb-12">

      {/* HERO */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 px-6 py-14 shadow-2xl sm:px-12 md:py-20">
        <div className="absolute -right-24 -top-24 h-[480px] w-[480px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-[380px] w-[380px] rounded-full bg-green-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[600px] rounded-full bg-primary/5 blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <Badge variant="outline" className="mb-4 border-blue-500/30 bg-blue-500/10 text-blue-400 uppercase tracking-widest text-[10px]">
            Allied Networks
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Community
          </h1>
          <p className="mt-4 text-base text-slate-400 max-w-2xl leading-relaxed">
            Connect with squads, organizers, and creators keeping Battlefield 1942 alive since 2002.
            Find your next clan, Discord server, or community event.
          </p>
          <div className="mt-6 flex items-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
              {communities.filter(c => c.types.includes("Active")).length} Active Communities
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
              {featured.length} Featured
            </span>
          </div>
        </div>
      </div>

      {/* FEATURED */}
      {featured.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest font-semibold">
            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            Featured Communities
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {featured.map((community) => (
              <CommunityCard key={community.title} community={community} />
            ))}
          </div>
        </section>
      )}

      {/* REST */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest font-semibold">
          <Globe className="h-3.5 w-3.5" />
          All Communities
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((community) => (
            <CommunityCard key={community.title} community={community} />
          ))}
        </div>
      </section>
    </div>
  );
}

function CommunityCard({ community }: { community: typeof communities[0] }) {
  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-xl hover:-translate-y-0.5"
      style={{ "--accent": community.accent } as React.CSSProperties}
    >
      {/* Accent top bar */}
      <div
        className="h-0.5 w-full transition-all duration-300 group-hover:h-1"
        style={{ background: `linear-gradient(90deg, ${community.accent}, transparent)` }}
      />

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Title row */}
        <div className="flex items-start gap-3 mb-3">
          <Initials name={community.title} accent={community.accent} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-foreground leading-tight truncate group-hover:text-primary transition-colors">
                {community.title}
              </h3>
              {community.featured && (
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
              )}
            </div>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {community.types.map((type) => {
                const style = getTypeStyle(type);
                return (
                  <Badge
                    key={type}
                    variant="outline"
                    className={cn("text-[10px] px-1.5 py-0", style.bg, style.text, style.border)}
                  >
                    {type}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground flex-1">
          {community.description}
        </p>
      </div>

      {/* Footer */}
      <div
        className="border-t border-border/30 px-5 py-3 flex items-center gap-4"
        style={{ background: community.accent + "08" }}
      >
        {community.website && (
          <a
            href={community.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold transition-colors hover:text-primary"
            style={{ color: community.accent }}
          >
            <Globe className="h-3.5 w-3.5" />
            Website
            <ExternalLink className="h-3 w-3 opacity-60" />
          </a>
        )}
        {community.discord && (
          <>
            {community.website && <span className="text-border/60 text-xs">·</span>}
            <a
              href={community.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-indigo-400 transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Discord
            </a>
          </>
        )}
      </div>
    </div>
  );
}
