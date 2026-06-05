"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { LeaderboardItem } from "@/components/leaderboard-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    AlertTriangle, Info, ChevronRight, Loader2, Trophy, Crown, Medal,
    Target, Swords, TrendingUp, CalendarDays, Clock,
} from "lucide-react";
import { AnimatedCounter } from "@/components/animated-counter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

const PODIUM = {
    1: {
        border:   "border-yellow-500/60",
        bg:       "from-yellow-500/20 via-yellow-600/8 to-transparent",
        glow:     "shadow-[0_0_30px_rgba(234,179,8,0.18)]",
        text:     "text-yellow-400",
        badge:    "bg-yellow-500 text-black",
        ring:     "ring-yellow-500/50",
        crown:    "text-yellow-400",
        bar:      "bg-yellow-500",
        barH:     "h-20",
    },
    2: {
        border:   "border-slate-400/50",
        bg:       "from-slate-400/15 via-slate-500/6 to-transparent",
        glow:     "shadow-[0_0_20px_rgba(148,163,184,0.12)]",
        text:     "text-slate-300",
        badge:    "bg-slate-400 text-black",
        ring:     "ring-slate-400/40",
        crown:    "text-slate-400",
        bar:      "bg-slate-400",
        barH:     "h-14",
    },
    3: {
        border:   "border-amber-700/50",
        bg:       "from-amber-700/15 via-amber-800/6 to-transparent",
        glow:     "shadow-[0_0_20px_rgba(180,83,9,0.15)]",
        text:     "text-amber-600",
        badge:    "bg-amber-700 text-white",
        ring:     "ring-amber-700/40",
        crown:    "text-amber-600",
        bar:      "bg-amber-700",
        barH:     "h-8",
    },
} as const;

function PodiumCard({ player, position }: { player: LeaderboardItem; position: 1 | 2 | 3 }) {
    const s = PODIUM[position];
    const rankCode = player.rank_label.split("(")[1]?.replace(")", "") || "PVT";
    const isFirst = position === 1;

    return (
        <Link href={`/player/${encodeURIComponent(player.name)}`} className="group block">
            <div className={`relative flex flex-col items-center gap-3 rounded-2xl border-2 bg-gradient-to-b ${s.border} ${s.bg} ${s.glow} p-5 transition-all duration-300 group-hover:-translate-y-1 group-hover:brightness-110`}>
                {/* Position badge */}
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 ${s.badge} text-xs font-extrabold px-2.5 py-0.5 rounded-full shadow-lg`}>
                    #{position}
                </div>

                {/* Crown for #1 */}
                {isFirst && (
                    <Crown className={`absolute -top-7 left-1/2 -translate-x-1/2 h-5 w-5 ${s.crown} drop-shadow-[0_0_6px_rgba(234,179,8,0.6)]`} />
                )}

                {/* Avatar */}
                <Avatar className={`ring-2 ${s.ring} ${isFirst ? "h-20 w-20" : "h-16 w-16"}`}>
                    <AvatarFallback className={`font-bold bg-background/60 ${isFirst ? "text-xl" : "text-base"} ${s.text}`}>
                        {player.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                {/* Name */}
                <div className="text-center">
                    <p className={`font-bold ${isFirst ? "text-base" : "text-sm"} text-white truncate max-w-[120px]`}>
                        {player.name}
                    </p>
                    <span className={`inline-block font-mono text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border mt-1 ${s.text} border-current/30`}>
                        {rankCode}
                    </span>
                </div>

                {/* RP score */}
                <div className="text-center">
                    <div className={`font-extrabold tabular-nums ${isFirst ? "text-3xl" : "text-2xl"} ${s.text}`}>
                        <AnimatedCounter value={player.total_score} duration={1200} />
                    </div>
                    <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">Rating Points</p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 w-full border-t border-white/8 pt-3 text-center">
                    <div>
                        <div className="flex items-center justify-center gap-0.5 text-muted-foreground/60 mb-0.5">
                            <Target className="h-2.5 w-2.5" />
                        </div>
                        <p className="text-xs font-bold tabular-nums text-foreground">{player.kills.toLocaleString()}</p>
                        <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider">Kills</p>
                    </div>
                    <div>
                        <div className="flex items-center justify-center gap-0.5 text-muted-foreground/60 mb-0.5">
                            <TrendingUp className="h-2.5 w-2.5" />
                        </div>
                        <p className={`text-xs font-bold tabular-nums ${player.kdr >= 2.0 ? "text-green-400" : "text-foreground"}`}>
                            <AnimatedCounter value={player.kdr} decimals={2} duration={1000} />
                        </p>
                        <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider">K/D</p>
                    </div>
                    <div>
                        <div className="flex items-center justify-center gap-0.5 text-muted-foreground/60 mb-0.5">
                            <Swords className="h-2.5 w-2.5" />
                        </div>
                        <p className="text-xs font-bold tabular-nums text-foreground">{player.rounds.toLocaleString()}</p>
                        <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider">Rounds</p>
                    </div>
                </div>
            </div>

            {/* Podium step bar */}
            <div className={`${s.bar} ${s.barH} w-full rounded-b-xl opacity-30 -mt-2`} />
        </Link>
    );
}

function EnhancedLeaderboardTable({ players }: { players: LeaderboardItem[] }) {
    const remainingPlayers = players.slice(3);

    return (
        <div className="rounded-xl border border-border/60 overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-[#0a0f06] hover:bg-[#0a0f06] border-b border-border/60">
                        <TableHead className="w-[60px] text-center text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Rank</TableHead>
                        <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Player</TableHead>
                        <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 hidden sm:table-cell">Title</TableHead>
                        <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-muted-foreground/70">RP</TableHead>
                        <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-muted-foreground/70 hidden md:table-cell">Kills</TableHead>
                        <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-muted-foreground/70 hidden md:table-cell">K/D</TableHead>
                        <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-muted-foreground/70 hidden lg:table-cell">Rounds</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {remainingPlayers.map((player, idx) => {
                        const isEven = idx % 2 === 0;
                        return (
                            <TableRow
                                key={player.player_id}
                                className={`border-b border-border/30 transition-colors hover:bg-primary/5 ${isEven ? "bg-[#070b05]" : "bg-[#060909]"}`}
                            >
                                <TableCell className="text-center py-3">
                                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold tabular-nums ${player.rank <= 10 ? "bg-primary/20 text-primary" : "bg-muted/40 text-muted-foreground"}`}>
                                        {player.rank}
                                    </span>
                                </TableCell>
                                <TableCell className="py-3">
                                    <Link href={`/player/${encodeURIComponent(player.name)}`} className="flex items-center gap-2.5 group">
                                        <Avatar className="h-8 w-8 border border-border/40 shrink-0">
                                            <AvatarFallback className="text-[10px] bg-secondary/50 font-bold">
                                                {player.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="font-semibold text-sm group-hover:text-primary transition-colors">
                                            {player.name}
                                        </span>
                                    </Link>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell py-3">
                                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground border border-border/50 bg-muted/20 px-1.5 py-0.5 rounded">
                                        {player.rank_label.split("(")[1]?.replace(")", "") || "PVT"}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right py-3">
                                    <span className="font-bold tabular-nums text-sm text-primary">
                                        {player.total_score.toLocaleString()}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right text-muted-foreground tabular-nums text-sm hidden md:table-cell py-3">
                                    {player.kills.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right tabular-nums text-sm hidden md:table-cell py-3">
                                    <span className={player.kdr >= 2.0 ? "text-green-400 font-semibold" : "text-muted-foreground"}>
                                        {player.kdr.toFixed(2)}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right text-muted-foreground tabular-nums text-sm hidden lg:table-cell py-3">
                                    {player.rounds.toLocaleString()}
                                </TableCell>
                            </TableRow>
                        );
                    })}
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
                <p>Loading leaderboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    if (!leaderboard || leaderboard.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Trophy className="h-12 w-12 mb-4 opacity-30" />
                <p>No leaderboard data available.</p>
            </div>
        );
    }

    const topThree = leaderboard.slice(0, 3);

    return (
        <div className="space-y-8">
            {/* Podium — 2nd / 1st / 3rd layout */}
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

            {/* Rest of leaderboard */}
            {leaderboard.length > 3 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Medal className="h-4 w-4 text-muted-foreground" />
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Ranks 4–{leaderboard.length}</h2>
                    </div>
                    <EnhancedLeaderboardTable players={leaderboard} />
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
        <div className="space-y-8">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-[#0d1208] via-[#0a0f06] to-[#060a04] p-6 sm:p-8 shadow-2xl">
                <div className="pointer-events-none absolute -top-12 right-0 h-56 w-56 rounded-full bg-lime-500/12 blur-[90px]" />
                <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-yellow-500/8 blur-[70px]" />
                <svg aria-hidden className="absolute inset-0 h-full w-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1200 300">
                    <defs>
                        <linearGradient id="topoLB" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0" stopColor="rgba(255,255,255,0)" />
                            <stop offset="0.5" stopColor="rgba(255,255,255,0.06)" />
                            <stop offset="1" stopColor="rgba(255,255,255,0)" />
                        </linearGradient>
                    </defs>
                    {[50, 100, 150, 210].map((y, i) => (
                        <path key={y} d={`M0,${y} L200,${y-6} L400,${y+9} L600,${y-4} L800,${y+11} L1000,${y-7} L1200,${y}`} fill="none" stroke="url(#topoLB)" strokeWidth={i % 2 === 0 ? "1.1" : "0.5"} opacity="0.5" />
                    ))}
                </svg>

                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-lime-500/20 p-3 shrink-0">
                            <Trophy className="h-8 w-8 text-lime-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Leaderboards</h1>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-lime-400 border border-lime-500/30 bg-lime-500/10 px-2 py-0.5 rounded-full">
                                    Top 100
                                </span>
                            </div>
                            <p className="text-sm text-slate-400">Elite soldiers ranked by Rating Points (RP) across all theaters</p>
                        </div>
                    </div>

                    <Card className="border-border/60 bg-card/40 lg:max-w-xs w-full backdrop-blur-sm">
                        <CardContent className="p-4 flex items-start gap-3">
                            <div className="bg-primary/15 p-2 rounded-lg text-primary shrink-0">
                                <Info className="h-4 w-4" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm mb-1 text-white">How RP Works</h3>
                                <p className="text-xs text-slate-400 mb-2">
                                    RP (0–2,000) measures skill across 6 components: Objectives, KDR, Kills/Min, Win Rate, Map Variety, and Score/Round.
                                </p>
                                <Button variant="link" size="sm" className="h-auto p-0 text-xs gap-1 text-primary" asChild>
                                    <Link href="/rank-system">
                                        Full breakdown <ChevronRight className="h-3 w-3" />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Period tabs */}
            <Tabs value={activePeriod} onValueChange={handlePeriodChange} className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-sm bg-muted/40 border border-border/50">
                    {(Object.keys(PERIOD_INFO) as Period[]).map((period) => {
                        const info = PERIOD_INFO[period];
                        const Icon = info.icon;
                        return (
                            <TabsTrigger key={period} value={period} className="gap-2 data-[state=active]:bg-background data-[state=active]:text-primary">
                                <Icon className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline text-xs">{info.label}</span>
                            </TabsTrigger>
                        );
                    })}
                </TabsList>

                <p className="mt-3 mb-6 text-sm text-muted-foreground">{PERIOD_INFO[activePeriod].description}</p>

                {(Object.keys(PERIOD_INFO) as Period[]).map((period) => (
                    <TabsContent key={period} value={period} className="mt-0">
                        <LeaderboardContent period={period} />
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
