"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { LeaderboardItem } from "@/components/leaderboard-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Info, ChevronRight, Loader2, Trophy, Crown, Medal, Target, Skull, Swords, TrendingUp, Calendar, CalendarDays, Clock } from "lucide-react";
import { AnimatedCounter } from "@/components/animated-counter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
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
    all: { label: "All Time", description: "Career RP — skill rating across all ranked rounds", icon: Crown },
    weekly: { label: "Weekly", description: "RP based on rounds from the last 7 days", icon: Clock },
    monthly: { label: "Monthly", description: "RP based on rounds from the last 30 days", icon: CalendarDays },
};

function TopThreeCard({ player, position }: { player: LeaderboardItem; position: 1 | 2 | 3 }) {
    const colors = {
        1: { bg: "from-yellow-500/20 to-yellow-600/5", border: "border-yellow-500/50", text: "text-yellow-500", badge: "bg-yellow-500" },
        2: { bg: "from-slate-400/20 to-slate-500/5", border: "border-slate-400/50", text: "text-slate-400", badge: "bg-slate-400" },
        3: { bg: "from-amber-700/20 to-amber-800/5", border: "border-amber-700/50", text: "text-amber-600", badge: "bg-amber-700" },
    };
    const style = colors[position];
    const size = position === 1 ? "md:scale-105" : "";

    return (
        <Link href={`/player/${encodeURIComponent(player.name)}`} className={`block ${size}`}>
            <Card className={`relative overflow-hidden border-2 ${style.border} bg-gradient-to-b ${style.bg} hover:shadow-lg transition-all hover:-translate-y-1`}>
                <div className={`absolute top-2 right-2 ${style.badge} text-white text-xs font-bold px-2 py-0.5 rounded-full`}>
                    #{position}
                </div>
                <CardContent className="p-5 text-center">
                    <Avatar className={`h-16 w-16 mx-auto mb-3 border-2 ${style.border}`}>
                        <AvatarFallback className={`text-lg font-bold ${style.text} bg-background`}>
                            {player.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-lg truncate mb-1">{player.name}</h3>
                    <Badge variant="secondary" className="text-[10px] uppercase mb-3">
                        {player.rank_label.split('(')[1]?.replace(')', '') || 'PVT'}
                    </Badge>
                    <div className={`text-2xl font-bold ${style.text} mb-2`}>
                        <AnimatedCounter value={player.total_score} duration={1200} />
                        <span className="text-xs font-normal text-muted-foreground ml-1">RP</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                        <div className="flex flex-col items-center">
                            <Target className="h-3 w-3 mb-0.5" />
                            <AnimatedCounter value={player.kills} duration={1000} />
                        </div>
                        <div className="flex flex-col items-center">
                            <TrendingUp className="h-3 w-3 mb-0.5" />
                            <span className={player.kdr >= 2.0 ? "text-green-500 font-medium" : ""}>
                                <AnimatedCounter value={player.kdr} decimals={2} duration={1000} />
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Swords className="h-3 w-3 mb-0.5" />
                            <AnimatedCounter value={player.rounds} duration={1000} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

function EnhancedLeaderboardTable({ players }: { players: LeaderboardItem[] }) {
    // Skip top 3 as they're shown in cards
    const remainingPlayers = players.slice(3);

    return (
        <div className="rounded-xl border border-border/60 overflow-hidden bg-card/30">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="w-[70px] text-center font-semibold">Rank</TableHead>
                        <TableHead className="font-semibold">Player</TableHead>
                        <TableHead className="font-semibold hidden sm:table-cell">Title</TableHead>
                        <TableHead className="text-right font-semibold">RP</TableHead>
                        <TableHead className="text-right font-semibold hidden md:table-cell">Kills</TableHead>
                        <TableHead className="text-right font-semibold hidden md:table-cell">K/D</TableHead>
                        <TableHead className="text-right font-semibold hidden lg:table-cell">Rounds</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {remainingPlayers.map((player, idx) => (
                        <TableRow key={player.player_id} className="hover:bg-muted/20 transition-colors">
                            <TableCell className="text-center">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted/50 text-sm font-medium text-muted-foreground">
                                    {player.rank}
                                </span>
                            </TableCell>
                            <TableCell>
                                <Link href={`/player/${encodeURIComponent(player.name)}`} className="flex items-center gap-3 group">
                                    <Avatar className="h-9 w-9 border border-border/40">
                                        <AvatarFallback className="text-xs bg-secondary/50">
                                            {player.name.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium group-hover:text-primary transition-colors">
                                        {player.name}
                                    </span>
                                </Link>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                                <Badge variant="outline" className="font-mono text-[10px] uppercase">
                                    {player.rank_label.split('(')[1]?.replace(')', '') || 'PVT'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <span className="font-bold tabular-nums">{player.total_score.toLocaleString()}</span>
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground tabular-nums hidden md:table-cell">
                                {player.kills.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right tabular-nums hidden md:table-cell">
                                <span className={player.kdr >= 2.0 ? "text-green-500 font-medium" : "text-muted-foreground"}>
                                    {player.kdr.toFixed(2)}
                                </span>
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground tabular-nums hidden lg:table-cell">
                                {player.rounds.toLocaleString()}
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
                if (!res.ok) throw new Error(`Failed to fetch leaderboard`);
                const data: LeaderboardResponse = await res.json();
                if (data.ok) {
                    setLeaderboard(data.leaderboard);
                } else {
                    throw new Error("API returned an error");
                }
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
            {/* Top 3 Podium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {/* Second Place - Left on desktop */}
                <div className="order-2 md:order-1 md:mt-8">
                    {topThree[1] && <TopThreeCard player={topThree[1]} position={2} />}
                </div>
                {/* First Place - Center */}
                <div className="order-1 md:order-2">
                    {topThree[0] && <TopThreeCard player={topThree[0]} position={1} />}
                </div>
                {/* Third Place - Right on desktop */}
                <div className="order-3 md:mt-12">
                    {topThree[2] && <TopThreeCard player={topThree[2]} position={3} />}
                </div>
            </div>

            {/* Rest of leaderboard */}
            {leaderboard.length > 3 && <EnhancedLeaderboardTable players={leaderboard} />}
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
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-primary/10">
                            <Trophy className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Leaderboards</h1>
                            <p className="text-muted-foreground">
                                Top 100 players ranked by Rating Points (RP)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Info Card */}
                <Card className="border-border/60 bg-muted/20 lg:max-w-sm w-full">
                    <CardContent className="p-4 flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full text-primary shrink-0">
                            <Info className="h-4 w-4" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm mb-1">How RP Works</h3>
                            <p className="text-xs text-muted-foreground mb-2">
                                RP (0–2,000) measures skill across 6 components: Objectives, KDR, Kills/Min, Win Rate, Map Variety, and Score/Round. Coop rounds are excluded.
                            </p>
                            <Button variant="link" size="sm" className="h-auto p-0 text-xs gap-1" asChild>
                                <Link href="/rank-system">
                                    Full breakdown <ChevronRight className="h-3 w-3" />
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs value={activePeriod} onValueChange={handlePeriodChange} className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-md bg-muted/50">
                    {(Object.keys(PERIOD_INFO) as Period[]).map((period) => {
                        const info = PERIOD_INFO[period];
                        const Icon = info.icon;
                        return (
                            <TabsTrigger key={period} value={period} className="gap-2 data-[state=active]:bg-background">
                                <Icon className="h-4 w-4" />
                                <span className="hidden sm:inline">{info.label}</span>
                            </TabsTrigger>
                        );
                    })}
                </TabsList>

                <div className="mt-2 mb-6">
                    <p className="text-sm text-muted-foreground">
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
