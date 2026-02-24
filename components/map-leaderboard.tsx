"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Loader2, Medal, Award } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MapLeaderboardPlayer {
    rank: number;
    player_id: number;
    name: string;
    rounds: number;
    kills: number;
    deaths: number;
    kdr: number;
    avg_score: number;
    map_score: number;
}

interface MapLeaderboardProps {
    mapName: string;
}

export function MapLeaderboard({ mapName }: MapLeaderboardProps) {
    const [players, setPlayers] = useState<MapLeaderboardPlayer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLeaderboard() {
            try {
                const res = await fetch(`/api/v1/leaderboard/map/${encodeURIComponent(mapName)}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.ok) {
                        setPlayers(data.leaderboard);
                    }
                }
            } catch (e) {
                console.error("Failed to fetch map leaderboard:", e);
            } finally {
                setLoading(false);
            }
        }
        fetchLeaderboard();
    }, [mapName]);

    if (loading) {
        return (
            <Card className="border-border/60 bg-card/40">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-amber-500" />
                        Top Players on this Map
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8 text-muted-foreground">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (players.length === 0) {
        return null; // Hide if no data
    }

    function getRankIcon(rank: number) {
        if (rank === 1) return <Trophy className="h-4 w-4 text-yellow-500" />;
        if (rank === 2) return <Medal className="h-4 w-4 text-slate-400" />;
        if (rank === 3) return <Award className="h-4 w-4 text-amber-600" />;
        return null;
    }

    return (
        <Card className="border-border/60 bg-card/40">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    Top Players on this Map
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                    Based on performance in ranked matches (min. 10 rounds)
                </p>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {players.map((player) => {
                        const icon = getRankIcon(player.rank);
                        return (
                            <Link
                                key={player.player_id}
                                href={`/player/${encodeURIComponent(player.name)}`}
                                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/40 hover:bg-muted/50 transition-colors group"
                            >
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted/50 text-muted-foreground font-mono text-sm shrink-0">
                                    {icon || `#${player.rank}`}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                        {player.name}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                        <span>{player.rounds} rounds</span>
                                        <span>•</span>
                                        <span>
                                            <span className="text-green-500">{player.kills}</span>
                                            {" / "}
                                            <span className="text-red-400">{player.deaths}</span>
                                        </span>
                                        <span>•</span>
                                        <span className={cn(
                                            player.kdr >= 2 ? "text-green-500" :
                                                player.kdr >= 1 ? "text-emerald-400" :
                                                    player.kdr >= 0.5 ? "text-yellow-500" : "text-red-400"
                                        )}>
                                            {player.kdr} K/D
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <div className="text-sm font-bold text-foreground">{player.map_score}</div>
                                    <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Score</div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
