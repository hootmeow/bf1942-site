"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, Trophy, Target, Ghost } from "lucide-react";

interface RecentRound {
    round_id: number;
    server_name: string;
    map_name: string;
    end_time: string;
    final_score: number;
    final_kills: number;
    final_deaths: number;
}

export function RecentRoundsList({ rounds }: { rounds: RecentRound[] }) {
    if (!rounds || rounds.length === 0) return null;

    // Limit to 5 for compact view
    const recentRounds = rounds.slice(0, 5);

    return (
        <Card className="border-border/60 h-full">
            <CardHeader>
                <CardTitle as="h3" className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Recent Rounds
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentRounds.map((round) => (
                        <div key={round.round_id} className="flex items-center justify-between group border-b border-border/40 pb-3 last:border-0 last:pb-0">
                            <div className="flex flex-col">
                                <span className="font-medium text-sm">{round.map_name}</span>
                                <span className="text-xs text-muted-foreground">{new Date(round.end_time).toLocaleDateString()}</span>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <div className="flex flex-col items-end">
                                    <span className="font-bold">{round.final_score} pts</span>
                                    <span className="text-[10px] text-muted-foreground flex gap-1">
                                        <span className="text-green-500">{round.final_kills} K</span> / <span className="text-red-500">{round.final_deaths} D</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
