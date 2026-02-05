"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Scale, ChevronLeft, ChevronRight, Trophy, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface MapBalanceStat {
    map_name: string;
    total_rounds: number;
    axis_win_rate: number;
    allied_win_rate: number;
    average_duration: number;
}

const ITEMS_PER_PAGE = 8;

function getBalanceLabel(axisRate: number, alliedRate: number): { label: string; color: string } {
    const diff = Math.abs(axisRate - alliedRate);
    if (diff <= 0.1) return { label: "Balanced", color: "text-green-500" };
    if (diff <= 0.25) return { label: axisRate > alliedRate ? "Axis Favored" : "Allied Favored", color: "text-yellow-500" };
    return { label: axisRate > alliedRate ? "Axis Dominant" : "Allied Dominant", color: "text-orange-500" };
}

function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    return `${mins}m`;
}

interface MapBalanceCardProps {
    stat: MapBalanceStat;
    rank: number;
}

function MapBalanceCard({ stat, rank }: MapBalanceCardProps) {
    const axisPercent = Math.round(stat.axis_win_rate * 100);
    const alliedPercent = Math.round(stat.allied_win_rate * 100);
    const balance = getBalanceLabel(stat.axis_win_rate, stat.allied_win_rate);

    return (
        <div className="group relative rounded-lg border border-border/60 bg-card/40 p-4 transition-all hover:bg-card/60 hover:border-border">
            {/* Map Name & Stats Row */}
            <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate" title={stat.map_name}>
                        {stat.map_name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Trophy className="h-3 w-3" />
                            {stat.total_rounds} rounds
                        </span>
                        {stat.average_duration > 0 && (
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDuration(stat.average_duration)} avg
                            </span>
                        )}
                    </div>
                </div>
                <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full bg-muted/50", balance.color)}>
                    {balance.label}
                </span>
            </div>

            {/* Balance Bar */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                    <TooltipProvider>
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                                <span className="font-bold text-red-500 cursor-default">{axisPercent}%</span>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <p>Axis Win Rate</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">vs</span>
                    <TooltipProvider>
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                                <span className="font-bold text-blue-500 cursor-default">{alliedPercent}%</span>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <p>Allied Win Rate</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                {/* Visual Bar */}
                <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted/30">
                    {/* Axis side (left) */}
                    <div
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-600 to-red-500 transition-all"
                        style={{ width: `${axisPercent}%` }}
                    />
                    {/* Allied side (right) */}
                    <div
                        className="absolute right-0 top-0 h-full bg-gradient-to-l from-blue-600 to-blue-500 transition-all"
                        style={{ width: `${alliedPercent}%` }}
                    />
                    {/* Center line indicator */}
                    <div className="absolute left-1/2 top-0 h-full w-0.5 bg-background/80 -translate-x-1/2" />
                </div>

                {/* Labels */}
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="text-red-400">AXIS</span>
                    <span className="text-blue-400">ALLIES</span>
                </div>
            </div>
        </div>
    );
}

export function MapBalanceTable({ stats }: { stats: MapBalanceStat[] }) {
    const [currentPage, setCurrentPage] = useState(1);

    const sortedStats = useMemo(() =>
        [...stats].sort((a, b) => b.total_rounds - a.total_rounds),
        [stats]
    );

    const totalPages = Math.ceil(sortedStats.length / ITEMS_PER_PAGE);
    const paginatedStats = sortedStats.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleNext = () => setCurrentPage(p => Math.min(p + 1, totalPages));
    const handlePrev = () => setCurrentPage(p => Math.max(p - 1, 1));

    // Calculate overall stats
    const overallStats = useMemo(() => {
        if (sortedStats.length === 0) return null;
        const totalRounds = sortedStats.reduce((sum, s) => sum + s.total_rounds, 0);
        const weightedAxis = sortedStats.reduce((sum, s) => sum + s.axis_win_rate * s.total_rounds, 0) / totalRounds;
        const weightedAllied = sortedStats.reduce((sum, s) => sum + s.allied_win_rate * s.total_rounds, 0) / totalRounds;
        return {
            totalMaps: sortedStats.length,
            totalRounds,
            axisOverall: Math.round(weightedAxis * 100),
            alliedOverall: Math.round(weightedAllied * 100),
        };
    }, [sortedStats]);

    return (
        <Card className="border-border/60">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <CardTitle as="h2" className="flex items-center gap-2">
                            <Scale className="h-5 w-5 text-primary" />
                            Map Balance Stats
                        </CardTitle>
                        <CardDescription>
                            Win rates for Axis vs Allies across {overallStats?.totalMaps || 0} maps
                        </CardDescription>
                    </div>
                    {overallStats && (
                        <div className="flex items-center gap-4 text-sm bg-muted/30 px-4 py-2 rounded-lg border border-border/40">
                            <div className="text-center">
                                <div className="text-xs text-muted-foreground">Overall</div>
                                <div className="flex items-center gap-2 font-bold">
                                    <span className="text-red-500">{overallStats.axisOverall}%</span>
                                    <span className="text-muted-foreground">/</span>
                                    <span className="text-blue-500">{overallStats.alliedOverall}%</span>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-border/60" />
                            <div className="text-center">
                                <div className="text-xs text-muted-foreground">Rounds</div>
                                <div className="font-bold text-foreground">{overallStats.totalRounds.toLocaleString()}</div>
                            </div>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {sortedStats.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <Scale className="h-12 w-12 mb-3 opacity-30" />
                        <p className="text-sm">No map balance data available yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {paginatedStats.map((stat, index) => (
                            <MapBalanceCard
                                key={stat.map_name}
                                stat={stat}
                                rank={(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
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
