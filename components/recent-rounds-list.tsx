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
                                    "group flex items-center gap-3 rounded-lg border border-border/40 bg-card/30 p-3 transition-all",
                                    "hover:border-primary/30 hover:bg-card/50"
                                )}
                            >
                                {/* Map indicator */}
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50 shrink-0 text-xs font-bold text-muted-foreground">
                                    {round.map_name.slice(0, 2).toUpperCase()}
                                </div>

                                {/* Round info */}
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm text-foreground group-hover:text-primary truncate">
                                        {round.map_name}
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                                        <span>{new Date(round.end_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                        <span className="opacity-40">•</span>
                                        <span className="truncate">{round.server_name}</span>
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
            </CardContent>
        </Card>
    );
}
