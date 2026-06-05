import { Swords, Flag, Clock, Medal, Trophy, AlertTriangle, Info, CheckCircle2, Star } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "How Ranking Works",
    description: "Detailed breakdown of the BF1942 RP Rating System.",
};

// ── RP component definitions ──────────────────────────────────────────────────

const RP_COMPONENTS = [
    { icon: Flag,   label: "Objective / Round", weight: 30, color: "text-orange-400", bg: "bg-orange-500/15", bar: "bg-orange-500", description: "Objective score per round — flag captures, defenses, and team assists. Calculated as (Score − Kills) / Rounds." },
    { icon: Swords, label: "Kill / Death Ratio", weight: 25, color: "text-red-400",    bg: "bg-red-500/15",    bar: "bg-red-500",    description: "Your overall KDR across all ranked rounds. Higher KDR means more efficient combat." },
    { icon: Clock,  label: "Kills / Minute",     weight: 20, color: "text-yellow-400", bg: "bg-yellow-500/15", bar: "bg-yellow-500", description: "Combat tempo — how quickly you eliminate enemies relative to round duration." },
    { icon: Trophy, label: "Win Rate",            weight: 10, color: "text-emerald-400",bg: "bg-emerald-500/15",bar: "bg-emerald-500",description: "Percentage of rounds where your team won. Rewards teamplay and clutch performance." },
    { icon: Star,   label: "Map Variety",         weight: 10, color: "text-blue-400",   bg: "bg-blue-500/15",   bar: "bg-blue-500",   description: "Number of distinct maps played. Encourages versatility across different battlefields." },
    { icon: Info,   label: "Score / Round",       weight: 5,  color: "text-purple-400", bg: "bg-purple-500/15", bar: "bg-purple-500", description: "Average total score per round. A general measure of overall impact each game." },
];

const UNRANKED_RULES = [
    "Co-op (bot) rounds — Coop gametype is always excluded",
    "Fewer than 4 tracked human players",
    "Round lasted less than 2 minutes",
    "Zero kills and zero deaths (map transitions / empty servers)",
    "Suspected bot farming — flagged by automated detection for abnormal stats",
    "Blacklisted server — rounds are not ingested at all",
];

export default function RankSystemPage() {
    return (
        <div className="space-y-8 max-w-4xl mx-auto">

            {/* ── Hero ──────────────────────────────────────────────────────── */}
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-[#0d1208] via-[#0a0f06] to-[#060a04] p-6 sm:p-10 shadow-2xl">
                <div className="pointer-events-none absolute -top-12 right-0 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(101,163,13,0.18),transparent_65%)]" />
                <div className="pointer-events-none absolute -bottom-12 left-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.04),transparent_65%)]" />
                <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "3px 3px" }} />
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    <div className="rounded-xl bg-primary/20 p-3.5 shrink-0">
                        <Medal className="h-9 w-9 text-primary" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2.5 flex-wrap mb-1">
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Ranking System</h1>
                            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-lime-500/30 bg-lime-500/15 text-lime-400">RP Rating</span>
                        </div>
                        <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
                            Rating Points (RP) measure skill on a 0–2,000 scale. It rewards how well you play, not just how much — every component is benchmarked against the 95th percentile of active players.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── How RP works ──────────────────────────────────────────────── */}
            <div className="rounded-xl border border-border/60 bg-card/40 overflow-hidden">
                <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border/50 bg-muted/20">
                    <div className="rounded-lg bg-primary/15 p-1.5">
                        <Medal className="h-4 w-4 text-primary" />
                    </div>
                    <h2 className="font-semibold text-sm">How RP Works</h2>
                </div>
                <div className="p-5 space-y-3 text-sm leading-relaxed text-muted-foreground">
                    <p>
                        Your <span className="text-foreground font-semibold">Rating Points (RP)</span> are calculated from six weighted components, each normalised against the active player population.
                        Only <span className="text-foreground font-semibold">ranked rounds</span> count — rounds are automatically excluded if they are co-op, too short, or flagged for manipulation.
                    </p>
                    <p>
                        An <span className="text-foreground font-semibold">experience multiplier</span> scales RP linearly up to 30 rounds — this prevents small sample sizes from inflating scores.
                        To appear on the leaderboard you need <span className="text-foreground font-semibold">3+ ranked rounds</span> and activity within the last 60 days.
                    </p>
                </div>
            </div>

            {/* ── RP Components ─────────────────────────────────────────────── */}
            <div className="space-y-3">
                <h2 className="font-semibold text-base px-0.5">RP Components</h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {RP_COMPONENTS.map(({ icon: Icon, label, weight, color, bg, bar, description }) => (
                        <div key={label} className="rounded-xl border border-border/60 bg-card/40 p-4 space-y-3 hover:bg-muted/20 transition-colors">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                    <div className={`rounded-lg p-1.5 ${bg}`}>
                                        <Icon className={`h-4 w-4 ${color}`} />
                                    </div>
                                    <span className="text-sm font-semibold text-foreground">{label}</span>
                                </div>
                                <span className={`text-sm font-bold tabular-nums ${color} shrink-0`}>{weight}%</span>
                            </div>
                            {/* Weight bar */}
                            <div className="h-1 w-full rounded-full bg-muted/50 overflow-hidden">
                                <div className={`h-full rounded-full ${bar}`} style={{ width: `${weight / 30 * 100}%` }} />
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Ranked vs Unranked ────────────────────────────────────────── */}
            <div id="ranked-unranked" className="scroll-mt-20 space-y-3">
                <h2 className="font-semibold text-base px-0.5">Ranked vs Unranked Rounds</h2>

                <div className="rounded-xl border border-border/60 bg-card/40 overflow-hidden">
                    <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border/50">
                        {/* Ranked */}
                        <div className="p-5 space-y-3">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wide">Ranked</span>
                            </div>
                            <ul className="space-y-1.5 text-xs text-muted-foreground">
                                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span> Conquest, TDM, and CTF rounds</li>
                                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span> 4 or more tracked human players</li>
                                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span> At least 2 minutes of playtime</li>
                                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span> At least one kill or death recorded</li>
                                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span> Non-blacklisted server</li>
                            </ul>
                        </div>
                        {/* Unranked */}
                        <div className="p-5 space-y-3">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-orange-400" />
                                <span className="text-sm font-semibold text-orange-400 uppercase tracking-wide">Unranked — excluded</span>
                            </div>
                            <ul className="space-y-1.5 text-xs text-muted-foreground">
                                {UNRANKED_RULES.map(rule => (
                                    <li key={rule} className="flex items-start gap-2">
                                        <span className="text-orange-500 mt-0.5 shrink-0">✕</span>
                                        {rule}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Zero-tolerance warning */}
                <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 flex gap-3.5">
                    <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-red-400">Zero Tolerance Policy</p>
                        <p className="text-xs text-red-400/80 leading-relaxed">
                            Stats padding and manipulation — killing bots or AFK players, farming empty servers, or using mods to artificially inflate scores — will not be tolerated.
                            Offending <strong>servers and usernames will be permanently blacklisted</strong> from the global ranking system.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Achievements ──────────────────────────────────────────────── */}
            <div className="space-y-4">
                <div>
                    <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-primary" />
                        Earnable Achievements
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Unlock medals by completing milestones and challenges in-game.
                    </p>
                </div>

                {/* Group by category */}
                {ACHIEVEMENT_GROUPS.map(group => (
                    <div key={group.label} className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 px-0.5">{group.label}</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                            {group.items.map(ach => (
                                <div key={ach.name} className="group flex items-center gap-2.5 rounded-lg border border-border/50 bg-card/30 hover:bg-muted/30 transition-colors p-2.5">
                                    <div className="shrink-0 w-[68px] h-[28px] bg-black/30 rounded border border-white/5 overflow-hidden">
                                        <img
                                            src={`/images/achievements/${ach.image}`}
                                            alt={ach.name}
                                            className="w-full h-full object-fill"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[11px] font-semibold text-foreground leading-tight truncate">{ach.name}</p>
                                        <p className="text-[10px] text-muted-foreground leading-snug line-clamp-2 mt-0.5">{ach.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Achievement data ───────────────────────────────────────────────────────────

const ACHIEVEMENT_GROUPS = [
    {
        label: "Kill Streaks",
        items: [
            { name: "Kill Streak 5",  image: "kill_streak_5.png",  description: "5 kills in a single life." },
            { name: "Kill Streak 10", image: "kill_streak_10.png", description: "10 kills in a single life." },
            { name: "Kill Streak 15", image: "kill_streak_15.png", description: "15 kills in a single life." },
            { name: "Kill Streak 20", image: "kill_streak_20.png", description: "20 kills in a single life." },
            { name: "Kill Streak 25", image: "kill_streak_25.png", description: "25 kills in a single life." },
            { name: "Kill Streak 30", image: "kill_streak_30.png", description: "30 kills in a single life." },
            { name: "Kill Streak 50", image: "kill_streak_50.png", description: "50 kills in a single life." },
        ],
    },
    {
        label: "Lifetime Kills",
        items: [
            { name: "Killer 100",       image: "total_kills_100.png",    description: "100 lifetime kills."   },
            { name: "Killer 500",       image: "total_kills_500.png",    description: "500 lifetime kills."   },
            { name: "Killer 1,000",     image: "total_kills_1000.png",   description: "1,000 lifetime kills." },
            { name: "Killer 2,500",     image: "total_kills_2500.png",   description: "2,500 lifetime kills." },
            { name: "Killer 5,000",     image: "total_kills_5000.png",   description: "5,000 lifetime kills." },
            { name: "Killer 10,000",    image: "total_kills_10000.png",  description: "10,000 lifetime kills."},
            { name: "Killer 25,000",    image: "total_kills_25000.png",  description: "25,000 lifetime kills."},
            { name: "Killer 50,000",    image: "total_kills_50000.png",  description: "50,000 lifetime kills."},
            { name: "Legendary Killer", image: "total_kills_legend.png", description: "Legendary lifetime kill count." },
        ],
    },
    {
        label: "Career Score",
        items: [
            { name: "Score 10k",   image: "total_score_10000.png",  description: "10,000 total career score."    },
            { name: "Score 50k",   image: "total_score_50000.png",  description: "50,000 total career score."    },
            { name: "Score 100k",  image: "total_score_100000.png", description: "100,000 total career score."   },
            { name: "Score 500k",  image: "total_score_500000.png", description: "500,000 total career score."   },
            { name: "Millionaire", image: "total_score_1000000.png",description: "1,000,000 total career score." },
        ],
    },
    {
        label: "Playtime",
        items: [
            { name: "Recruit (10h)",    image: "milestone_playtime_10h.png",   description: "10 hours on ranked servers."    },
            { name: "Regular (50h)",    image: "milestone_playtime_50h.png",   description: "50 hours on ranked servers."    },
            { name: "Veteran (100h)",   image: "milestone_playtime_100h.png",  description: "100 hours on ranked servers."   },
            { name: "Dedicated (500h)", image: "milestone_playtime_500h.png",  description: "500 hours on ranked servers."   },
            { name: "Life-er (1000h)",  image: "milestone_playtime_1000h.png", description: "1,000 hours on ranked servers." },
        ],
    },
    {
        label: "Elite Warrior",
        items: [
            { name: "Elite Warrior (Bronze)", image: "elite_warrior_bronze.png", description: "Top performing combatant."      },
            { name: "Elite Warrior (Silver)", image: "elite_warrior_silver.png", description: "Superior combat performance."   },
            { name: "Elite Warrior (Gold)",   image: "elite_warrior_gold.png",   description: "Exceptional combat performance."},
            { name: "Elite Warrior (Legend)", image: "elite_warrior_legend.png", description: "Legendary combat performance."  },
        ],
    },
    {
        label: "Habits & Consistency",
        items: [
            { name: "Early Bird",       image: "early_bird.png",        description: "Play in the early morning hours."              },
            { name: "Night Owl",        image: "night_owl.png",         description: "Play late into the night."                     },
            { name: "Server Regular",   image: "server_regular.png",    description: "Play consistently on the same server."         },
            { name: "Consistent Killer",image: "consistent_killer.png", description: "High KPM over many consecutive rounds."        },
            { name: "Rock Solid",       image: "rock_solid.png",        description: "Few deaths and high playtime in a round."      },
        ],
    },
    {
        label: "Map Mastery",
        items: [
            { name: "Map Dominator", image: "map_dominator.png", description: "Win at least one round on every official map." },
            { name: "Map Specialist",image: "map_specialist.png",description: "Very high win rate on a specific map."         },
            { name: "Map Legend",    image: "map_legend.png",    description: "Legend status on a specific map."              },
        ],
    },
    {
        label: "Special",
        items: [
            { name: "Comeback King", image: "comeback_king.png", description: "Win a round after your team was significantly behind." },
        ],
    },
];
