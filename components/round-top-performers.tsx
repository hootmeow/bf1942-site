"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface TopScorer {
    player_name: string;
    final_score: number;
    final_kills: number;
    final_deaths: number;
    team: number;
}

interface RoundTopPerformersProps {
    playerStats: {
        last_known_name?: string;
        final_score?: number;
        final_kills?: number;
        final_deaths?: number;
        team?: number;
    }[];
}

export function RoundTopPerformers({ playerStats }: RoundTopPerformersProps) {
    if (!playerStats || playerStats.length === 0) return null;

    const top5 = [...playerStats]
        .sort((a, b) => (b.final_score || 0) - (a.final_score || 0))
        .slice(0, 5);

    const maxScore = Math.max(...top5.map(p => p.final_score || 0), 1);

    const teamColors: Record<number, { bar: string; border: string; text: string }> = {
        1: { bar: "bg-red-500/80", border: "border-red-500/40", text: "text-red-400" },
        2: { bar: "bg-blue-500/80", border: "border-blue-500/40", text: "text-blue-400" },
    };

    const rankColors = [
        "text-yellow-500",  // 1st
        "text-gray-400",    // 2nd
        "text-amber-600",   // 3rd
        "text-muted-foreground",
        "text-muted-foreground",
    ];

    return (
        <Card className="border-border/60">
            <CardHeader>
                <CardTitle as="h3" className="flex items-center gap-2 text-lg">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Top Performers
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {top5.map((player, index) => {
                    const score = player.final_score || 0;
                    const kills = player.final_kills || 0;
                    const deaths = player.final_deaths || 0;
                    const kd = deaths > 0 ? (kills / deaths).toFixed(2) : kills.toFixed(2);
                    const percent = (score / maxScore) * 100;
                    const team = player.team || 0;
                    const colors = teamColors[team] || { bar: "bg-primary/60", border: "border-border/60", text: "text-muted-foreground" };

                    return (
                        <div key={player.last_known_name || index} className="group">
                            {/* Player info row */}
                            <div className="flex items-center gap-3 mb-1.5">
                                <span className={cn("text-sm font-bold w-5 text-right tabular-nums", rankColors[index])}>
                                    #{index + 1}
                                </span>
                                <Link
                                    href={`/player/${encodeURIComponent(player.last_known_name || "")}`}
                                    className="text-sm font-medium text-foreground hover:underline truncate flex-1"
                                >
                                    {player.last_known_name}
                                </Link>
                                <span className={cn("text-xs font-medium", colors.text)}>
                                    {team === 1 ? "Axis" : team === 2 ? "Allies" : ""}
                                </span>
                                <span className="text-xs text-muted-foreground tabular-nums">
                                    {kills}/{deaths} ({kd} K/D)
                                </span>
                                <span className="text-sm font-bold tabular-nums w-12 text-right">
                                    {score}
                                </span>
                            </div>

                            {/* Score bar */}
                            <div className={cn("h-2 w-full rounded-full bg-muted/30 overflow-hidden ml-8")}>
                                <div
                                    className={cn("h-full rounded-full transition-all duration-500 group-hover:opacity-80", colors.bar)}
                                    style={{ width: `${percent}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
