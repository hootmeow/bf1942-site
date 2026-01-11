"use client";

import { useEffect, useState } from "react";
import { PlayerSearchResult } from "./player-search-autocomplete";
import { Loader2, TrendingUp, TrendingDown, Minus, Trophy, Skull, Crosshair, Target, Clock, Zap, BarChart, Server, Map, Hash, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ComparisonViewProps {
    player1: PlayerSearchResult;
    player2: PlayerSearchResult;
}

interface PlayerProfile {
    player_id: number;
    name: string;
    // Stats
    total_score: number;
    total_kills: number;
    total_deaths: number;
    total_rounds: number;
    kd_ratio: number;
    win_rate: number;
    score_per_min: number;
    kpm: number;
    avg_score_round: number;
    avg_kills_round: number;
    avg_deaths_round: number;
    playtime_seconds: number;
    unique_servers: number;
    unique_maps: number;
    accuracy?: number; // Not in API yet?
}

interface ComparisonData {
    p1: PlayerProfile | null;
    p2: PlayerProfile | null;
    loading: boolean;
}

export function ComparisonView({ player1, player2 }: ComparisonViewProps) {
    const [data, setData] = useState<ComparisonData>({ p1: null, p2: null, loading: true });

    useEffect(() => {
        let mounted = true;
        async function fetchData() {
            setData(prev => ({ ...prev, loading: true }));
            try {
                // Parallel fetch with proper encoding
                const [res1, res2] = await Promise.all([
                    fetch(`/api/v1/players/search/profile?name=${encodeURIComponent(player1.last_known_name)}`),
                    fetch(`/api/v1/players/search/profile?name=${encodeURIComponent(player2.last_known_name)}`)
                ]);

                const data1 = await res1.json();
                const data2 = await res2.json();

                if (mounted) {
                    // Helper to map API response to PlayerProfile
                    const mapProfile = (apiData: any): PlayerProfile | null => {
                        if (!apiData?.ok || !apiData.lifetime_stats) return null;
                        const stats = apiData.lifetime_stats;
                        return {
                            player_id: apiData.player_info?.id || 0,
                            name: apiData.player_info?.last_known_name || "Unknown",
                            total_score: stats.total_score || 0,
                            total_kills: stats.total_kills || 0,
                            total_deaths: stats.total_deaths || 0,
                            total_rounds: stats.total_rounds_played || 0,
                            kd_ratio: stats.overall_kdr || 0,
                            win_rate: stats.win_rate || 0,
                            score_per_min: stats.score_per_minute || 0,
                            kpm: stats.overall_kpm || 0,
                            avg_score_round: stats.average_score_per_round || 0,
                            avg_kills_round: stats.kills_per_round || 0,
                            avg_deaths_round: stats.deaths_per_round || 0,
                            playtime_seconds: stats.total_playtime_seconds || 0,
                            unique_servers: stats.unique_servers || stats.unique_servers_played || 0,
                            unique_maps: stats.unique_maps || stats.unique_maps_played || 0,
                        };
                    };

                    setData({
                        p1: mapProfile(data1),
                        p2: mapProfile(data2),
                        loading: false
                    });
                }
            } catch (e) {
                console.error("Comparison fetch error", e);
                if (mounted) setData(prev => ({ ...prev, loading: false }));
            }
        }
        fetchData();
        return () => { mounted = false; };
    }, [player1, player2]);

    if (data.loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p>Analyzing combat records...</p>
            </div>
        );
    }

    if (!data.p1 || !data.p2) {
        return (
            <div className="p-8 text-center text-muted-foreground">
                <p>Failed to load player data. Please try again.</p>
            </div>
        );
    }

    // --- Helper for Stat Row ---
    const StatRow = ({ label, icon: Icon, value1, value2, format = (v: number) => v.toLocaleString(), invert = false, highlightDiff = true }: any) => {
        const num1 = Number(value1) || 0;
        const num2 = Number(value2) || 0;

        let win1 = false;
        let win2 = false;

        if (highlightDiff && num1 !== num2) {
            if (invert) {
                win1 = num1 < num2;
                win2 = num2 < num1;
            } else {
                win1 = num1 > num2;
                win2 = num2 > num1;
            }
        }

        return (
            <div className="grid grid-cols-3 gap-4 py-4 border-b border-border/50 last:border-0 items-center">

                {/* Player 1 Value */}
                <div className={cn("text-right font-mono font-medium text-lg", win1 ? "text-green-500" : "text-muted-foreground")}>
                    {format(num1)}
                    {win1 && <TrendingUp className="inline ml-2 h-4 w-4" />}
                </div>

                {/* Label */}
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="p-2 bg-muted/20 rounded-full mb-1">
                        <Icon className="h-4 w-4 text-primary opacity-70" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
                </div>

                {/* Player 2 Value */}
                <div className={cn("text-left font-mono font-medium text-lg", win2 ? "text-green-500" : "text-muted-foreground")}>
                    {win2 && <TrendingUp className="inline mr-2 h-4 w-4" />}
                    {format(num2)}
                </div>
            </div>
        );
    };

    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        return `${h}h`;
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Headers */}
            <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded-lg bg-card/50 border-border/60">
                    <h2 className="text-2xl font-bold truncate">{data.p1.name}</h2>
                    <Link href={`/player/${data.p1.name}`} passHref>
                        <Button variant="link" size="sm">View Profile</Button>
                    </Link>
                </div>
                <div className="text-center p-4 border rounded-lg bg-card/50 border-border/60">
                    <h2 className="text-2xl font-bold truncate">{data.p2.name}</h2>
                    <Link href={`/player/${data.p2.name}`} passHref>
                        <Button variant="link" size="sm">View Profile</Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-center">Combat Efficiency</CardTitle>
                </CardHeader>
                <CardContent className="px-6">
                    <StatRow label="K/D Ratio" icon={Crosshair} value1={data.p1.kd_ratio} value2={data.p2.kd_ratio} format={(v: number) => v.toFixed(2)} />
                    <StatRow label="Kills Per Min" icon={Zap} value1={data.p1.kpm} value2={data.p2.kpm} format={(v: number) => v.toFixed(2)} />
                    <StatRow label="Score Per Min" icon={BarChart} value1={data.p1.score_per_min} value2={data.p2.score_per_min} format={(v: number) => v.toFixed(2)} />
                    <StatRow label="Win Rate" icon={Trophy} value1={data.p1.win_rate} value2={data.p2.win_rate} format={(v: number) => `${v}%`} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-center">Per Round Averages</CardTitle>
                </CardHeader>
                <CardContent className="px-6">
                    <StatRow label="Avg Score" icon={Activity} value1={data.p1.avg_score_round} value2={data.p2.avg_score_round} format={(v: number) => v.toFixed(0)} />
                    <StatRow label="Avg Kills" icon={Target} value1={data.p1.avg_kills_round} value2={data.p2.avg_kills_round} format={(v: number) => v.toFixed(1)} />
                    <StatRow label="Avg Deaths" icon={Skull} value1={data.p1.avg_deaths_round} value2={data.p2.avg_deaths_round} format={(v: number) => v.toFixed(1)} invert={true} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-center">Lifetime Totals</CardTitle>
                </CardHeader>
                <CardContent className="px-6">
                    <StatRow label="Playtime" icon={Clock} value1={data.p1.playtime_seconds} value2={data.p2.playtime_seconds} format={formatDuration} />
                    <StatRow label="Total Score" icon={Trophy} value1={data.p1.total_score} value2={data.p2.total_score} />
                    <StatRow label="Total Kills" icon={Target} value1={data.p1.total_kills} value2={data.p2.total_kills} />
                    <StatRow label="Total Deaths" icon={Skull} value1={data.p1.total_deaths} value2={data.p2.total_deaths} invert={true} />
                    <StatRow label="Rounds Played" icon={Hash} value1={data.p1.total_rounds} value2={data.p2.total_rounds} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-center">Exploration</CardTitle>
                </CardHeader>
                <CardContent className="px-6">
                    <StatRow label="Unique Servers" icon={Server} value1={data.p1.unique_servers} value2={data.p2.unique_servers} />
                    <StatRow label="Unique Maps" icon={Map} value1={data.p1.unique_maps} value2={data.p2.unique_maps} />
                </CardContent>
            </Card>
        </div>
    );
}
