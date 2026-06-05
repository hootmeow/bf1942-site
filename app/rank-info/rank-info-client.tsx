"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { LeaderboardItem } from "@/components/leaderboard-table";
import {
    AlertTriangle, Info, ChevronRight, Loader2, Trophy, Crown, Medal,
    Target, Swords, TrendingUp, CalendarDays, Clock,
} from "lucide-react";
import { AnimatedCounter } from "@/components/animated-counter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

interface LeaderboardResponse {
    ok: boolean;
    leaderboard: LeaderboardItem[];
    count: number;
}

type Period = "all" | "weekly" | "monthly";

const ENDPOINTS: Record<Period, string> = {
    all: "/api/v1/leaderboard",
    weekly: "/api/v1/leaderboard/weekly",
    monthly: "/api/v1/leaderboard/monthly",
};

const PERIOD_INFO: Record<Period, { label: string; description: string; icon: React.ElementType }> = {
    all:     { label: "All Time", description: "Career RP — skill rating across all ranked rounds", icon: Crown },
    weekly:  { label: "Weekly",   description: "RP based on rounds from the last 7 days",          icon: Clock },
    monthly: { label: "Monthly",  description: "RP based on rounds from the last 30 days",         icon: CalendarDays },
};

const PODIUM_CFG = {
    1: {
        border:   "border-yellow-500/50",
        bg:       "bg-gradient-to-b from-yellow-500/15 to-yellow-600/5",
        glow:     "shadow-[0_0_28px_rgba(234,179,8,0.15)]",
        text:     "text-yellow-400",
        badge:    "bg-yellow-500 text-black",
        ring:     "ring-yellow-500/40",
        bar:      "bg-yellow-500/25",
        barH:     "h-16",
        avatarSz: "h-20 w-20",
        fontSize: "text-3xl",
    },
    2: {
        border:   "border-slate-500/40",
        bg:       "bg-gradient-to-b from-slate-400/12 to-slate-500/4",
        glow:     "",
        text:     "text-slate-300",
        badge:    "bg-slate-400 text-black",
        ring:     "ring-slate-400/30",
        bar:      "bg-slate-400/20",
        barH:     "h-10",
        avatarSz: "h-16 w-16",
        fontSize: "text-2xl",
    },
    3: {
        border:   "border-amber-700/40",
        bg:       "bg-gradient-to-b from-amber-700/12 to-amber-800/4",
        glow:     "",
        text:     "text-amber-600",
        badge:    "bg-amber-700 text-white",
        ring:     "ring-amber-700/30",
        bar:      "bg-amber-700/20",
        barH:     "h-6",
        avatarSz: "h-14 w-14",
        fontSize: "text-xl",
    },
} as const;

function PodiumCard({ player, position }: { player: LeaderboardItem; position: 1 | 2 | 3 }) {
    const s = PODIUM_CFG[position];
    const rankCode = player.rank_label.split("(")[1]?.replace(")", "") || "PVT";

    return (
        <Link href={`/player/${encodeURIComponent(player.name)}`} className="group block">
            <div className={cn(
                "relative flex flex-col items-center gap-3 rounded-xl border-2 p-5",
                "transition-all duration-200 hover:-translate-y-1 hover:brightness-110",
                s.border, s.bg, s.glow
            )}>
                {/* Rank badge */}
                <div className={cn("absolute -top-3 left-1/2 -translate-x-1/2 font-mono text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded shadow", s.badge)}>
                    #{position}
                </div>

                {/* Crown for #1 */}
                {position === 1 && (
                    <Crown className="absolute -top-7 left-1/2 -translate-x-1/2 h-5 w-5 text-yellow-400 drop-shadow-[0_0_6px_rgba(234,179,8,0.7)]" />
                )}

                {/* Avatar */}
                <Avatar className={cn("ring-2 mt-1", s.avatarSz, s.ring)}>
                    <AvatarFallback className={cn("font-bold bg-[#070b05]", s.fontSize, s.text)}>
                        {player.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                {/* Name + rank code */}
                <div className="text-center">
                    <p className="font-bold text-white text-sm truncate max-w-[130px]">{player.name}</p>
                    <span className={cn("font-mono text-[9px] font-bold uppercase tracking-[0.18em] mt-1 inline-block", s.text)}>
                        {rankCode}
                    </span>
                </div>

                {/* RP */}
                <div className="text-center">
                    <div className={cn("font-extrabold tabular-nums", s.fontSize, s.text)}>
                        <AnimatedCounter value={player.total_score} duration={1200} />
                    </div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground/50 mt-0.5">Rating Points</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 w-full pt-3 border-t border-[#1e2a14] text-center">
                    <div>
                        <Target className="h-2.5 w-2.5 text-muted-foreground/40 mx-auto mb-0.5" />
                        <p className="font-mono text-xs font-bold text-white">{player.kills.toLocaleString()}</p>
                        <p className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground/40">Kills</p>
                    </div>
                    <div>
                        <TrendingUp className="h-2.5 w-2.5 text-muted-foreground/40 mx-auto mb-0.5" />
                        <p className={cn("font-mono text-xs font-bold", player.kdr >= 2.0 ? "text-green-400" : "text-white")}>
                            <AnimatedCounter value={player.kdr} decimals={2} duration={1000} />
                        </p>
                        <p className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground/40">K/D</p>
                    </div>
                    <div>
                        <Swords className="h-2.5 w-2.5 text-muted-foreground/40 mx-auto mb-0.5" />
                        <p className="font-mono text-xs font-bold text-white">{player.rounds.toLocaleString()}</p>
                        <p className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground/40">Rounds</p>
                    </div>
                </div>
            </div>
            {/* Podium step */}
            <div className={cn("w-full rounded-b-lg", s.bar, s.barH)} />
        </Link>
    );
}

function LeaderboardTable({ players }: { players: LeaderboardItem[] }) {
    const rest = players.slice(3);
    return (
        <div className="rounded-xl border border-[#1e2a14] overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-[#0a0f06] hover:bg-[#0a0f06] border-b border-[#1e2a14]">
                        <TableHead className="w-[60px] text-center font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60">Rank</TableHead>
                        <TableHead className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60">Player</TableHead>
                        <TableHead className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 hidden sm:table-cell">Title</TableHead>
                        <TableHead className="text-right font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60">RP</TableHead>
                        <TableHead className="text-right font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 hidden md:table-cell">Kills</TableHead>
                        <TableHead className="text-right font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 hidden md:table-cell">K/D</TableHead>
                        <TableHead className="text-right font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 hidden lg:table-cell">Rounds</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rest.map((player, idx) => (
                        <TableRow
                            key={player.player_id}
                            className={cn(
                                "border-b border-[#1e2a14] transition-colors hover:bg-primary/5",
                                idx % 2 === 0 ? "bg-[#070b05]" : "bg-[#060a04]"
                            )}
                        >
                            <TableCell className="text-center py-3">
                                <span className={cn(
                                    "inline-flex items-center justify-center w-8 h-8 rounded font-mono text-xs font-bold tabular-nums",
                                    player.rank <= 10 ? "bg-primary/20 text-primary" : "bg-[#0a0f06] text-muted-foreground"
                                )}>
                                    {player.rank}
                                </span>
                            </TableCell>
                            <TableCell className="py-3">
                                <Link href={`/player/${encodeURIComponent(player.name)}`} className="flex items-center gap-2.5 group/row">
                                    <Avatar className="h-8 w-8 border border-[#1e2a14] shrink-0">
                                        <AvatarFallback className="font-mono text-[10px] bg-[#0a0f06] font-bold">
                                            {player.name.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="font-semibold text-sm text-white group-hover/row:text-primary transition-colors">
                                        {player.name}
                                    </span>
                                </Link>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell py-3">
                                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60 border border-[#1e2a14] bg-[#0a0f06] px-1.5 py-0.5 rounded">
                                    {player.rank_label.split("(")[1]?.replace(")", "") || "PVT"}
                                </span>
                            </TableCell>
                            <TableCell className="text-right py-3">
                                <span className="font-mono font-bold tabular-nums text-sm text-primary">
                                    {player.total_score.toLocaleString()}
                                </span>
                            </TableCell>
                            <TableCell className="text-right py-3 hidden md:table-cell">
                                <span className="font-mono text-sm tabular-nums text-muted-foreground">
                                    {player.kills.toLocaleString()}
                                </span>
                            </TableCell>
                            <TableCell className="text-right py-3 hidden md:table-cell">
                                <span className={cn("font-mono text-sm tabular-nums", player.kdr >= 2.0 ? "text-green-400 font-bold" : "text-muted-foreground")}>
                                    {player.kdr.toFixed(2)}
                                </span>
                            </TableCell>
                            <TableCell className="text-right py-3 hidden lg:table-cell">
                                <span className="font-mono text-sm tabular-nums text-muted-foreground">
                                    {player.rounds.toLocaleString()}
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

function LeaderboardContent({ period }: { period: Period }) {
    const [leaderboard, setLeaderboard] = useState<LeaderboardItem[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchLeaderboard() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(ENDPOINTS[period]);
                if (!res.ok) throw new Error("Failed to fetch leaderboard");
                const data: LeaderboardResponse = await res.json();
                if (data.ok) setLeaderboard(data.leaderboard);
                else throw new Error("API returned an error");
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred");
            } finally {
                setLoading(false);
            }
        }
        fetchLeaderboard();
    }, [period]);

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="font-mono text-xs uppercase tracking-wider">Loading leaderboard...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-500/30 bg-red-500/8 p-5 flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
            </div>
        );
    }

    if (!leaderboard || leaderboard.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#1e2a14] bg-[#060a04] py-16 text-center">
                <Trophy className="h-10 w-10 mb-3 opacity-20" />
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40">No data available</p>
            </div>
        );
    }

    const topThree = leaderboard.slice(0, 3);

    return (
        <div className="space-y-8">
            {/* Podium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:items-end">
                <div className="order-2 md:order-1">
                    {topThree[1] && <PodiumCard player={topThree[1]} position={2} />}
                </div>
                <div className="order-1 md:order-2">
                    {topThree[0] && <PodiumCard player={topThree[0]} position={1} />}
                </div>
                <div className="order-3">
                    {topThree[2] && <PodiumCard player={topThree[2]} position={3} />}
                </div>
            </div>

            {/* Rest of table */}
            {leaderboard.length > 3 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Medal className="h-4 w-4 text-muted-foreground/50" />
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
                            Ranks 4 – {leaderboard.length}
                        </span>
                    </div>
                    <LeaderboardTable players={leaderboard} />
                </div>
            )}
        </div>
    );
}

export default function RankInfoClient() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const activePeriod = (searchParams.get("period") as Period) || "all";

    const handlePeriodChange = useCallback((value: string) => {
        router.push(`/rank-info?period=${value}`);
    }, [router]);

    return (
        <div className="space-y-8 pb-8">

            {/* ── Hero ──────────────────────────────────────────────────── */}
            <div
                className="relative overflow-hidden rounded-2xl border border-[#1e2a14] shadow-2xl"
                style={{ background: "linear-gradient(135deg, #0d1208 0%, #0a0f06 50%, #060a04 100%)" }}
            >
                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{
                    backgroundImage: "linear-gradient(#6b8c3a 1px, transparent 1px), linear-gradient(90deg, #6b8c3a 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                }} />
                {/* Glow orbs */}
                <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-500/6 blur-[90px] pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary/6 blur-[70px] pointer-events-none" />

                <div className="relative z-10 px-8 py-12 sm:px-12 sm:py-16">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400 mb-4">
                                <Trophy className="h-2.5 w-2.5" />
                                Hall of Fame
                            </span>
                            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                                Leader-<br />
                                <span className="text-primary">boards</span>
                            </h1>
                            <p className="mt-3 text-slate-400 max-w-md text-sm leading-relaxed">
                                Elite soldiers ranked by Rating Points (RP) across all theaters of war.
                            </p>
                        </div>

                        {/* RP info card */}
                        <div className="rounded-xl border border-[#1e2a14] bg-[#070b05] p-4 lg:max-w-xs w-full">
                            <div className="flex items-start gap-3">
                                <div className="rounded-lg border border-primary/20 bg-primary/10 p-2 shrink-0">
                                    <Info className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-white mb-1">How RP Works</p>
                                    <p className="text-xs text-slate-400 leading-relaxed mb-2">
                                        RP (0–2,000) measures skill across 6 components: Objectives, KDR, Kills/Min, Win Rate, Map Variety, and Score/Round.
                                    </p>
                                    <Link href="/rank-system" className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider text-primary hover:underline">
                                        Full breakdown <ChevronRight className="h-3 w-3" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Period tabs ───────────────────────────────────────────── */}
            <Tabs value={activePeriod} onValueChange={handlePeriodChange} className="w-full">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 mb-6">
                    <TabsList className="grid grid-cols-3 max-w-xs bg-[#0a0f06] border border-[#1e2a14]">
                        {(Object.keys(PERIOD_INFO) as Period[]).map((period) => {
                            const info = PERIOD_INFO[period];
                            const Icon = info.icon;
                            return (
                                <TabsTrigger
                                    key={period}
                                    value={period}
                                    className="gap-1.5 font-mono text-[10px] uppercase tracking-wider data-[state=active]:bg-primary/15 data-[state=active]:text-primary"
                                >
                                    <Icon className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline">{info.label}</span>
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>
                    <p className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-wider">
                        {PERIOD_INFO[activePeriod].description}
                    </p>
                </div>

                {(Object.keys(PERIOD_INFO) as Period[]).map((period) => (
                    <TabsContent key={period} value={period} className="mt-0">
                        <LeaderboardContent period={period} />
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
