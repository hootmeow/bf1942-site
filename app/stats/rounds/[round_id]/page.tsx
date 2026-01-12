"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { AlertTriangle, Loader2, Clock, Map, Users, Server } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScoreboardTable, ScoreboardPlayer } from "@/components/scoreboard-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, Trophy, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoundData {
    round_id: number;
    map_name: string;
    start_time: string;
    end_time: string;
    duration_seconds: number;
    current_server_name: string;
    tickets1: number;
    tickets2: number;
    ip: string;
    port: number;
    gamemode: string;
}

interface RoundDetailsResponse {
    ok: boolean;
    round: RoundData;
    player_stats: ScoreboardPlayer[];
}

function StatCard({ title, value, icon }: { title: string; value: string | number; icon: React.ElementType }) {
    const Icon = icon;
    return (
        <div className="rounded-lg border border-border/60 bg-card/40 p-4">
            <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <Icon className="h-4 w-4" />
                </div>
                <div>
                    <h3 className="text-xs font-medium text-muted-foreground">{title}</h3>
                    <p className="text-base font-semibold text-foreground">{value}</p>
                </div>
            </div>
        </div>
    );
}

export default function RoundDetailPage() {
    const params = useParams();
    const roundId = params.round_id as string;

    const [data, setData] = useState<RoundDetailsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchRoundDetails() {
            if (!roundId) return;

            setLoading(true);
            try {
                const res = await fetch(`/api/v1/rounds/${roundId}`);
                if (!res.ok) throw new Error("Failed to fetch round details");
                const jsonData: RoundDetailsResponse = await res.json();
                if (jsonData.ok) {
                    setData(jsonData);
                } else {
                    throw new Error("API returned not ok");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred");
            } finally {
                setLoading(false);
            }
        }
        fetchRoundDetails();
    }, [roundId]);

    const [team1, team2] = useMemo(() => {
        if (!data?.player_stats) return [[], []];
        // Sort by score descending
        const t1 = data.player_stats.filter((p) => p.team === 1).sort((a, b) => (b.final_score || 0) - (a.final_score || 0));
        const t2 = data.player_stats.filter((p) => p.team === 2).sort((a, b) => (b.final_score || 0) - (a.final_score || 0));
        return [t1, t2];
    }, [data]);

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    // --- Highlights Calculation ---
    const highlights = useMemo(() => {
        if (!data?.player_stats || data.player_stats.length === 0) return null;

        const stats = data.player_stats;
        const mvp = [...stats].sort((a, b) => (b.final_score || 0) - (a.final_score || 0))[0];
        const deadliest = [...stats].sort((a, b) => (b.final_kills || 0) - (a.final_kills || 0))[0];
        const survivor = [...stats].sort((a, b) => (a.final_deaths || 0) - (b.final_deaths || 0))[0]; // Least deaths

        return { mvp, deadliest, survivor };
    }, [data]);

    const narrative = useMemo(() => {
        if (!data) return "";
        const { round } = data;
        const winnerName = round.tickets1 > round.tickets2 ? "Axis" : "Allies";
        const loserName = winnerName === "Axis" ? "Allies" : "Axis";
        const ticketDiff = Math.abs(round.tickets1 - round.tickets2);

        let intensity = "skirmish";
        if (ticketDiff < 10) intensity = "nail-biting finish";
        else if (ticketDiff < 50) intensity = "hard-fought battle";
        else intensity = "decisive victory";

        return `The ${winnerName} secured a ${intensity} on ${round.map_name}, defeating the ${loserName} by ${ticketDiff} tickets. The battle lasted for ${Math.floor(round.duration_seconds / 60)} minutes.`;
    }, [data]);

    if (loading) {
        return (
            <div className="flex min-h-[200px] items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <p>Loading round details...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error || "Round not found"}</AlertDescription>
            </Alert>
        );
    }

    const { round } = data;
    const winner = round.tickets1 > round.tickets2 ? 1 : round.tickets2 > round.tickets1 ? 2 : 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/stats/rounds">
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                        Round #{round.round_id}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        Played on {new Date(round.start_time).toLocaleString()}
                    </p>
                </div>
            </div>

            <Card className="border-border/60">
                <CardHeader><CardTitle as="h2">Round Summary</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <StatCard title="Server" value={round.current_server_name} icon={Server} />
                    <StatCard title="Map" value={round.map_name} icon={Map} />
                    <StatCard title="Duration" value={formatDuration(round.duration_seconds)} icon={Clock} />
                    <StatCard title="Total Players" value={data.player_stats.length} icon={Users} />
                </CardContent>
            </Card>

            {/* Battle Highlights & Narrative */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 border-border/60 bg-muted/10">
                    <CardHeader><CardTitle as="h3" className="text-lg">Battle Report</CardTitle></CardHeader>
                    <CardContent>
                        <p className="text-lg italic text-muted-foreground leading-relaxed">"{narrative}"</p>
                    </CardContent>
                </Card>

                <Card className="border-border/60">
                    <CardHeader><CardTitle as="h3" className="text-lg">Match Highlights</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {highlights?.mvp && (
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-full"><Trophy className="h-4 w-4" /></div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase">MVP</p>
                                    <Link href={`/player/${encodeURIComponent(highlights.mvp.last_known_name || "")}`} className="font-bold hover:underline">
                                        {highlights.mvp.last_known_name}
                                    </Link>
                                    <span className="text-xs ml-2 opacity-70">({highlights.mvp.final_score} Score)</span>
                                </div>
                            </div>
                        )}
                        {highlights?.deadliest && (
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-500/10 text-red-500 rounded-full"><Target className="h-4 w-4" /></div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase">Most Dangerous</p>
                                    <Link href={`/player/${encodeURIComponent(highlights.deadliest.last_known_name || "")}`} className="font-bold hover:underline">
                                        {highlights.deadliest.last_known_name}
                                    </Link>
                                    <span className="text-xs ml-2 opacity-70">({highlights.deadliest.final_kills} Kills)</span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Axis Card */}
                <Card className={cn("border-border/60", winner === 1 && "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]")}>
                    <CardHeader className={cn("bg-red-950/20 border-b border-red-900/20", winner === 1 && "bg-red-900/30")}>
                        <div className="flex items-center justify-between">
                            <CardTitle as="h2" className="text-red-500 flex items-center gap-2">
                                Axis
                                {winner === 1 && <Trophy className="h-4 w-4" />}
                            </CardTitle>
                            <div className="text-2xl font-bold text-red-500">{round.tickets1} Tickets</div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6"><ScoreboardTable players={team1} /></CardContent>
                </Card>

                {/* Allies Card */}
                <Card className={cn("border-border/60", winner === 2 && "border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]")}>
                    <CardHeader className={cn("bg-blue-950/20 border-b border-blue-900/20", winner === 2 && "bg-blue-900/30")}>
                        <div className="flex items-center justify-between">
                            <CardTitle as="h2" className="text-blue-500 flex items-center gap-2">
                                Allies
                                {winner === 2 && <Trophy className="h-4 w-4" />}
                            </CardTitle>
                            <div className="text-2xl font-bold text-blue-500">{round.tickets2} Tickets</div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6"><ScoreboardTable players={team2} /></CardContent>
                </Card>
            </div>
        </div>
    );
}
