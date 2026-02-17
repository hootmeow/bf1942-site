"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Server, ArrowRight, Target, Skull, Trophy } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RecentRound {
    round_id: number;
    server_name: string;
    map_name: string;
    end_time: string;
    final_score: number;
    final_kills: number;
    final_deaths: number;
    team?: number;
    winner_team?: number;
}

export function RecentRoundsList({ rounds, playerName }: { rounds: RecentRound[], playerName: string }) {
    if (!rounds || rounds.length === 0) return null;

    const recentRounds = rounds.slice(0, 5);

    // Calculate performance indicators
    const getPerformanceColor = (kills: number, deaths: number) => {
        const kd = deaths > 0 ? kills / deaths : kills;
        if (kd >= 2) return "text-green-500";
        if (kd >= 1) return "text-foreground";
        return "text-red-400";
    };

    return (
        <Card className="border-border/60 h-full flex flex-col">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle as="h3" className="flex items-center gap-2 text-lg">
                        <div className="p-1.5 rounded-lg bg-primary/10">
                            <Clock className="h-4 w-4 text-primary" />
                        </div>
                        Recent Rounds
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground" asChild>
                        <Link href={`/player/${encodeURIComponent(playerName)}/rounds`}>
                            View All <ArrowRight className="h-3 w-3" />
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 pt-0">
                <div className="space-y-2">
                    {recentRounds.map((round, index) => {
                        const kd = round.final_deaths > 0 ? (round.final_kills / round.final_deaths).toFixed(1) : round.final_kills.toFixed(1);
                        const perfColor = getPerformanceColor(round.final_kills, round.final_deaths);

                        return (
                            <Link
                                key={round.round_id}
                                href={`/stats/rounds/${round.round_id}`}
                                className={cn(
                                    "group flex items-center gap-2 rounded-lg border border-border/40 bg-card/30 p-3 transition-all",
                                    "hover:border-primary/30 hover:bg-card/50"
                                )}
                            >
                                {/* Win/Loss indicator */}
                                {round.winner_team != null && round.team != null && round.winner_team !== 0 ? (
                                    <div className={cn(
                                        "h-6 w-6 rounded flex items-center justify-center text-[10px] font-bold shrink-0",
                                        round.team === round.winner_team
                                            ? "bg-green-500/20 text-green-500"
                                            : "bg-red-500/20 text-red-400"
                                    )}>
                                        {round.team === round.winner_team ? "W" : "L"}
                                    </div>
                                ) : (
                                    <div className="h-2 w-2 rounded-full bg-primary/60 shrink-0" />
                                )}

                                {/* Round info */}
                                <div className="flex-1 min-w-0 space-y-1">
                                    <div className="font-medium text-sm text-foreground group-hover:text-primary truncate">
                                        {round.map_name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {new Date(round.end_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </div>
                                    <div className="text-xs text-muted-foreground truncate">
                                        {round.server_name}
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex flex-col items-end gap-1 shrink-0">
                                    <div className="flex items-center gap-1">
                                        <Trophy className="h-3 w-3 text-amber-500" />
                                        <span className="font-bold text-sm tabular-nums">{round.final_score}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="text-green-500 tabular-nums">{round.final_kills}K</span>
                                        <span className="text-muted-foreground">/</span>
                                        <span className="text-red-400 tabular-nums">{round.final_deaths}D</span>
                                        <span className={cn("font-semibold tabular-nums", perfColor)}>
                                            ({kd})
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
                <Link href={`/player/${encodeURIComponent(playerName)}/rounds`} className="block mt-4">
                    <Button variant="outline" size="sm" className="w-full gap-1" asChild>
                        <span>View All Rounds <ArrowRight className="h-3 w-3" /></span>
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}
