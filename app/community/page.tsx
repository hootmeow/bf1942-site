import Link from "next/link";
import { MessageCircle, Globe, Star, ExternalLink, Film, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Communities & Clans",
  description: "Join the active Battlefield 1942 community. Find clans, Discord servers, and groups keeping the game alive.",
};

// ── Data ───────────────────────────────────────────────────────────────────────

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

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Active":           { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/25" },
  "Vanilla":          { bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-blue-500/25"    },
  "Vanilla & Modded": { bg: "bg-purple-500/10",  text: "text-purple-400",  border: "border-purple-500/25"  },
  "Modded":           { bg: "bg-orange-500/10",  text: "text-orange-400",  border: "border-orange-500/25"  },
  "Events":           { bg: "bg-pink-500/10",    text: "text-pink-400",    border: "border-pink-500/25"    },
  "Co-op":            { bg: "bg-cyan-500/10",    text: "text-cyan-400",    border: "border-cyan-500/25"    },
  "PvE":              { bg: "bg-cyan-500/10",    text: "text-cyan-400",    border: "border-cyan-500/25"    },
  "24/7":             { bg: "bg-red-500/10",     text: "text-red-400",     border: "border-red-500/25"     },
  "USA":              { bg: "bg-slate-500/10",   text: "text-slate-400",   border: "border-slate-500/25"   },
  "Desert Combat":    { bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/25"   },
  "Mod-specific":     { bg: "bg-indigo-500/10",  text: "text-indigo-400",  border: "border-indigo-500/25"  },
  "Racing":           { bg: "bg-yellow-500/10",  text: "text-yellow-400",  border: "border-yellow-500/25"  },
  "Vehicles":         { bg: "bg-orange-500/10",  text: "text-orange-400",  border: "border-orange-500/25"  },
};

function getTypeStyle(type: string) {
  return TYPE_COLORS[type] ?? { bg: "bg-primary/10", text: "text-primary", border: "border-primary/25" };
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-amber-500">{children}</span>
      <div className="flex-1 h-px bg-gradient-to-r from-amber-500/40 via-amber-500/10 to-transparent" />
    </div>
  );
}

function Initials({ name, accent }: { name: string; accent: string }) {
  const letter = name.replace(/[-\[( ]/g, "").charAt(0).toUpperCase();
  return (
    <div
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-black text-lg select-none"
      style={{
        background: accent + "18",
        color: accent,
        border: `1px solid ${accent}35`,
        boxShadow: `0 0 16px ${accent}12`,
      }}
    >
      {letter}
    </div>
  );
}

function DiscordIcon() {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.5382-9.6739-3.5479-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
    </svg>
  );
}

// ── Community Card ─────────────────────────────────────────────────────────────

function CommunityCard({ community, large = false }: { community: typeof communities[0]; large?: boolean }) {
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-[#070b05]",
        "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/40",
        community.featured
          ? "border-[#2a3a1a] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          : "border-[#1e2a14] hover:border-[#2a3a1a]"
      )}
    >
      {/* Accent top bar — thicker + animated on featured */}
      <div
        className={cn(
          "w-full transition-all duration-500",
          community.featured ? "h-[3px] group-hover:h-1" : "h-[2px] group-hover:h-[3px]"
        )}
        style={{ background: `linear-gradient(90deg, ${community.accent}, ${community.accent}40, transparent)` }}
      />

      {/* Glow behind the card on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top left, ${community.accent}06, transparent 60%)` }}
      />

      {/* Body */}
      <div className="relative flex flex-1 flex-col p-5 gap-4">
        {/* Header row */}
        <div className="flex items-start gap-3">
          <Initials name={community.title} accent={community.accent} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="font-bold text-foreground leading-tight truncate transition-colors duration-200 group-hover:text-white">
                {community.title}
              </h3>
              {community.featured && (
                <Star className="h-3.5 w-3.5 shrink-0 text-amber-400 fill-amber-400" />
              )}
            </div>
            {/* Type badges */}
            <div className="flex flex-wrap gap-1">
              {community.types.map((type) => {
                const s = getTypeStyle(type);
                return (
                  <span
                    key={type}
                    className={cn(
                      "font-mono text-[9px] font-bold uppercase tracking-[0.12em] px-1.5 py-0.5 rounded border",
                      s.bg, s.text, s.border
                    )}
                  >
                    {type}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className={cn(
          "text-sm leading-relaxed text-muted-foreground/80 flex-1 border-l-2 pl-3",
        )}
          style={{ borderColor: community.accent + "30" }}
        >
          {community.description}
        </p>
      </div>

      {/* Footer links */}
      <div
        className="relative flex items-center gap-1 border-t px-5 py-3"
        style={{
          borderColor: community.accent + "15",
          background: community.accent + "06",
        }}
      >
        {community.website && (
          <a
            href={community.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-all duration-150 hover:opacity-90"
            style={{
              color: community.accent,
              borderColor: community.accent + "30",
              background: community.accent + "10",
            }}
          >
            <Globe className="h-3 w-3" />
            Website
            <ExternalLink className="h-2.5 w-2.5 opacity-60" />
          </a>
        )}
        {community.discord && (
          <a
            href={community.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-[#5865F2]/25 bg-[#5865F2]/10 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#7289da] transition-all duration-150 hover:bg-[#5865F2]/15 hover:border-[#5865F2]/40"
          >
            <DiscordIcon />
            Discord
          </a>
        )}
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function CommunityPage() {
  const featured    = communities.filter((c) => c.featured);
  const rest        = communities.filter((c) => !c.featured);
  const activeCount = communities.filter((c) => c.types.includes("Active")).length;

  return (
    <div className="space-y-12 pb-12">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl border border-[#1e2a14] shadow-2xl"
        style={{ background: "linear-gradient(135deg, #0d1208 0%, #0a0f06 50%, #060a04 100%)" }}
      >
        {/* Amber glow */}
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-amber-500/6 blur-[90px] pointer-events-none" />
        {/* Green glow */}
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary/5 blur-[70px] pointer-events-none" />

        <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                Allied Networks
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl leading-tight">
                Community<br />
                <span className="text-primary">& Clans</span>
              </h1>
              <p className="mt-4 text-slate-400 leading-relaxed max-w-lg">
                Connect with squads, organizers, and creators keeping Battlefield 1942 alive since 2002.
                Find your next clan, Discord server, or community event.
              </p>
            </div>

            {/* Stat counters */}
            <div className="flex gap-8 font-mono shrink-0">
              <div className="text-center">
                <p className="text-3xl font-black text-emerald-400 tabular-nums leading-none">{activeCount}</p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50">Active</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black text-amber-400 tabular-nums leading-none">{featured.length}</p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50">Featured</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black text-primary tabular-nums leading-none">{communities.length}</p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50">Total</p>
              </div>
            </div>
          </div>

          {/* Quick-nav to sub-pages */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/community/highlights"
              className="group flex items-center gap-2 rounded-lg border border-[#2a3a1a] bg-[#0a0f06]/80 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground/70 transition-all hover:border-primary/40 hover:text-primary hover:bg-primary/5"
            >
              <Film className="h-3.5 w-3.5" />
              Video Highlights
            </Link>
            <Link
              href="/orgs"
              className="group flex items-center gap-2 rounded-lg border border-[#2a3a1a] bg-[#0a0f06]/80 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground/70 transition-all hover:border-primary/40 hover:text-primary hover:bg-primary/5"
            >
              <Users className="h-3.5 w-3.5" />
              Organizations
            </Link>
          </div>
        </div>
      </div>

      {/* ── FEATURED ──────────────────────────────────────────────────── */}
      {featured.length > 0 && (
        <section>
          <SectionLabel>// Featured Units</SectionLabel>
          <div className="grid gap-5 md:grid-cols-2">
            {featured.map((community) => (
              <CommunityCard key={community.title} community={community} large />
            ))}
          </div>
        </section>
      )}

      {/* ── ALL COMMUNITIES ───────────────────────────────────────────── */}
      <section>
        <SectionLabel>// All Regiments</SectionLabel>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((community) => (
            <CommunityCard key={community.title} community={community} />
          ))}
        </div>
      </section>
    </div>
  );
}
