"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Server, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

    // Limit to 5 for compact view
    const recentRounds = rounds.slice(0, 5);

    return (
        <Card className="border-border/60 h-full flex flex-col">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle as="h3" className="flex items-center gap-2 text-lg">
                        <Clock className="h-5 w-5 text-primary" />
                        Recent Rounds
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="h-8 text-xs gap-1" asChild>
                        <Link href={`/player/${encodeURIComponent(playerName)}/rounds`}>
                            View All <ArrowRight className="h-3 w-3" />
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1">
                <div className="space-y-1">
                    {recentRounds.map((round) => (
                        <Link
                            key={round.round_id}
                            href={`/stats/rounds/${round.round_id}`}
                            className="flex items-center justify-between group border-b border-border/40 pb-3 last:border-0 last:pb-0 pt-3 first:pt-0"
                        >
                            <div className="flex flex-col">
                                <span className="font-medium text-sm text-foreground group-hover:underline decoration-muted-foreground/50 underline-offset-4">
                                    {round.map_name}
                                </span>
                                <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                    <Clock className="w-3 h-3 opacity-70" /> {new Date(round.end_time).toLocaleDateString()}
                                    <span className="opacity-50">&middot;</span>
                                    <span className="truncate max-w-[150px]">{round.server_name}</span>
                                </span>
                            </div>

                            <div className="flex items-center gap-3 text-sm shrink-0">
                                <div className="flex flex-col items-end">
                                    <span className="font-bold">{round.final_score} pts</span>
                                    <span className="text-[10px] text-muted-foreground flex gap-1">
                                        <span className="text-green-500">{round.final_kills} K</span> / <span className="text-red-500">{round.final_deaths} D</span>
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
