"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Map, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Trophy, Skull, Target, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface MapPerformanceStat {
    map_name: string;
    rounds_played: number;
    total_kills: number;
    total_deaths: number;
    kdr: number;
    avg_score: number;
    avg_kpm: number;
    wins: number;
    win_rate: number;
}

const ITEMS_PER_PAGE = 8;

type SortKey = "rounds_played" | "kdr" | "win_rate" | "avg_score" | "avg_kpm";
type SortDir = "asc" | "desc";

function getKdrColor(kdr: number): string {
    if (kdr >= 1.5) return "text-green-500";
    if (kdr < 0.8) return "text-red-500";
    return "text-foreground";
}

function MapPerformanceCard({ stat, isBest, isWorst }: { stat: MapPerformanceStat; isBest: boolean; isWorst: boolean }) {
    const kdrColor = getKdrColor(stat.kdr);

    return (
        <div className="group relative rounded-lg border border-border/60 bg-card/40 p-4 transition-all hover:bg-card/60 hover:border-border">
            {/* Badges */}
            {isBest && (
                <div className="absolute -top-2 -right-2 bg-green-500/20 text-green-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-500/30">
                    BEST MAP
                </div>
            )}
            {isWorst && (
                <div className="absolute -top-2 -right-2 bg-red-500/20 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/30">
                    WORST MAP
                </div>
            )}

            {/* Map Name & Rounds */}
            <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate" title={stat.map_name}>
                        {stat.map_name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Trophy className="h-3 w-3" />
                            {stat.rounds_played} rounds
                        </span>
                        <span className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            {stat.total_kills} kills
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-2 text-center">
                <TooltipProvider>
                    <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                            <div className="cursor-default">
                                <div className="text-[10px] text-muted-foreground uppercase mb-0.5">K/D</div>
                                <div className={cn("text-sm font-bold tabular-nums", kdrColor)}>
                                    {stat.kdr.toFixed(2)}
                                </div>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent><p>{stat.total_kills} kills / {stat.total_deaths} deaths</p></TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <div>
                    <div className="text-[10px] text-muted-foreground uppercase mb-0.5">Win %</div>
                    <div className="text-sm font-bold tabular-nums">{stat.win_rate.toFixed(1)}%</div>
                    {/* Win rate bar */}
                    <div className="h-1 w-full rounded-full bg-muted/30 mt-1 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${Math.min(stat.win_rate, 100)}%` }}
                        />
                    </div>
                </div>

                <div>
                    <div className="text-[10px] text-muted-foreground uppercase mb-0.5">Avg Score</div>
                    <div className="text-sm font-bold tabular-nums">{stat.avg_score.toFixed(0)}</div>
                </div>

                <div>
                    <div className="text-[10px] text-muted-foreground uppercase mb-0.5">KPM</div>
                    <div className="text-sm font-bold tabular-nums">{stat.avg_kpm.toFixed(2)}</div>
                </div>
            </div>
        </div>
    );
}

export function PlayerMapPerformance({ stats }: { stats: MapPerformanceStat[] }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortKey, setSortKey] = useState<SortKey>("rounds_played");
    const [sortDir, setSortDir] = useState<SortDir>("desc");

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDir(d => d === "desc" ? "asc" : "desc");
        } else {
            setSortKey(key);
            setSortDir("desc");
        }
        setCurrentPage(1);
    };

    const sortedStats = useMemo(() =>
        [...stats].sort((a, b) => {
            const mul = sortDir === "desc" ? 1 : -1;
            return (b[sortKey] - a[sortKey]) * mul;
        }),
        [stats, sortKey, sortDir]
    );

    // Determine best/worst maps (by KDR, among maps with enough rounds)
    const bestMap = useMemo(() => {
        if (sortedStats.length === 0) return null;
        const qualified = sortedStats.filter(s => s.rounds_played >= 3);
        if (qualified.length === 0) return null;
        return qualified.reduce((prev, curr) => curr.kdr > prev.kdr ? curr : prev).map_name;
    }, [sortedStats]);

    const worstMap = useMemo(() => {
        if (sortedStats.length < 2) return null;
        const qualified = sortedStats.filter(s => s.rounds_played >= 3);
        if (qualified.length < 2) return null;
        return qualified.reduce((prev, curr) => curr.kdr < prev.kdr ? curr : prev).map_name;
    }, [sortedStats]);

    const totalPages = Math.ceil(sortedStats.length / ITEMS_PER_PAGE);
    const paginatedStats = sortedStats.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleNext = () => setCurrentPage(p => Math.min(p + 1, totalPages));
    const handlePrev = () => setCurrentPage(p => Math.max(p - 1, 1));

    // Overall summary stats
    const overallStats = useMemo(() => {
        if (stats.length === 0) return null;
        const totalKills = stats.reduce((s, m) => s + m.total_kills, 0);
        const totalDeaths = stats.reduce((s, m) => s + m.total_deaths, 0);
        const totalRounds = stats.reduce((s, m) => s + m.rounds_played, 0);
        const totalWins = stats.reduce((s, m) => s + m.wins, 0);
        return {
            totalMaps: stats.length,
            avgKdr: totalDeaths > 0 ? (totalKills / totalDeaths) : 0,
            overallWinRate: totalRounds > 0 ? (totalWins / totalRounds * 100) : 0,
        };
    }, [stats]);

    const SortIcon = ({ column }: { column: SortKey }) => {
        if (sortKey !== column) return null;
        return sortDir === "desc"
            ? <ChevronDown className="h-3 w-3 inline ml-0.5" />
            : <ChevronUp className="h-3 w-3 inline ml-0.5" />;
    };

    return (
        <Card className="border-border/60">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <CardTitle as="h2" className="flex items-center gap-2">
                            <Map className="h-5 w-5 text-primary" />
                            Map Performance
                        </CardTitle>
                        <CardDescription>
                            Performance breakdown across {overallStats?.totalMaps || 0} maps
                        </CardDescription>
                    </div>
                    {overallStats && (
                        <div className="flex items-center gap-4 text-sm bg-muted/30 px-4 py-2 rounded-lg border border-border/40">
                            <div className="text-center">
                                <div className="text-xs text-muted-foreground">Avg K/D</div>
                                <div className={cn("font-bold", getKdrColor(overallStats.avgKdr))}>
                                    {overallStats.avgKdr.toFixed(2)}
                                </div>
                            </div>
                            <div className="h-8 w-px bg-border/60" />
                            <div className="text-center">
                                <div className="text-xs text-muted-foreground">Win Rate</div>
                                <div className="font-bold text-foreground">{overallStats.overallWinRate.toFixed(1)}%</div>
                            </div>
                            <div className="h-8 w-px bg-border/60" />
                            <div className="text-center">
                                <div className="text-xs text-muted-foreground">Maps</div>
                                <div className="font-bold text-foreground">{overallStats.totalMaps}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sort controls */}
                <div className="flex gap-1 mt-2 flex-wrap">
                    {([
                        ["rounds_played", "Rounds"],
                        ["kdr", "K/D"],
                        ["win_rate", "Win %"],
                        ["avg_score", "Score"],
                        ["avg_kpm", "KPM"],
                    ] as [SortKey, string][]).map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => handleSort(key)}
                            className={cn(
                                "px-2.5 py-1 text-xs font-medium rounded-md transition-all border",
                                sortKey === key
                                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                    : "text-muted-foreground hover:text-foreground border-border/40 bg-muted/20"
                            )}
                        >
                            {label}
                            <SortIcon column={key} />
                        </button>
                    ))}
                </div>
            </CardHeader>
            <CardContent>
                {sortedStats.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <Map className="h-12 w-12 mb-3 opacity-30" />
                        <p className="text-sm">No map performance data available yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {paginatedStats.map((stat) => (
                            <MapPerformanceCard
                                key={stat.map_name}
                                stat={stat}
                                isBest={stat.map_name === bestMap}
                                isWorst={stat.map_name === worstMap}
                            />
                        ))}
                    </div>
                )}
            </CardContent>
            {totalPages > 1 && (
                <CardFooter className="flex items-center justify-between border-t pt-4">
                    <span className="text-xs text-muted-foreground">
                        Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, sortedStats.length)} of {sortedStats.length} maps
                    </span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handlePrev} disabled={currentPage === 1}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleNext} disabled={currentPage === totalPages}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </CardFooter>
            )}
        </Card>
    );
}
