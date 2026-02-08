"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { AlertTriangle, Loader2, Clock, Users, TrendingUp, Activity, Swords, ArrowLeftRight, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScoreboardPlayer } from "@/components/scoreboard-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, Trophy, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { RoundTimelineChart } from "@/components/charts";
import { RoundTopPerformers } from "@/components/round-top-performers";
import { BattleReplay } from "@/components/battle-replay";

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

interface TimelineDataPoint {
    timestamp: string;
    tickets1: number | null;
    tickets2: number | null;
    time_remain?: number | null;
}

interface KeyMoment {
    timestamp: string;
    event: string;
    tickets1: number;
    tickets2: number;
}

interface PlayerHighlights {
    top_5_scorers: { player_name: string; final_score: number; final_kills: number; final_deaths: number; team: number }[];
    biggest_streak: { player_name: string; streak: number } | null;
    closest_margin: number;
    lead_changes: number;
}

interface TimelineResponse {
    ok: boolean;
    ticket_timeline: TimelineDataPoint[];
    key_moments: KeyMoment[];
    player_scores?: Record<string, Array<{ timestamp: string; score: number; kills: number; deaths: number }>>;
    player_teams?: Record<string, number>;
    player_highlights?: PlayerHighlights;
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
    const [timeline, setTimeline] = useState<TimelineResponse | null>(null);
    const [timelineLoading, setTimelineLoading] = useState(true);

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

    // Fetch timeline data separately
    useEffect(() => {
        async function fetchTimeline() {
            if (!roundId) return;

            setTimelineLoading(true);
            try {
                const res = await fetch(`/api/v1/rounds/${roundId}/timeline`);
                if (res.ok) {
                    const jsonData: TimelineResponse = await res.json();
                    if (jsonData.ok) {
                        setTimeline(jsonData);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch timeline:", err);
            } finally {
                setTimelineLoading(false);
            }
        }
        fetchTimeline();
    }, [roundId]);

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
        const survivor = [...stats].sort((a, b) => (a.final_deaths || 0) - (b.final_deaths || 0))[0];

        return { mvp, deadliest, survivor };
    }, [data]);

    const narrative = useMemo(() => {
        if (!data) return "";
        const { round } = data;
        const winnerName = round.tickets1 > round.tickets2 ? "Axis" : "Allies";
        const loserName = winnerName === "Axis" ? "Allies" : "Axis";
        const ticketDiff = Math.abs(round.tickets1 - round.tickets2);

        // Use timeline highlight data for closeness if available
        const closestMargin = timeline?.player_highlights?.closest_margin;
        const leadChanges = timeline?.player_highlights?.lead_changes || 0;

        let intensity = "skirmish";
        if (ticketDiff < 10) intensity = "nail-biting finish";
        else if (ticketDiff < 50) intensity = "hard-fought battle";
        else intensity = "decisive victory";

        let extra = "";
        if (leadChanges > 0) {
            extra = ` The lead changed hands ${leadChanges} time${leadChanges > 1 ? "s" : ""} throughout the match.`;
        }

        return `The ${winnerName} secured a ${intensity} on ${round.map_name}, defeating the ${loserName} by ${ticketDiff} tickets. The battle lasted for ${Math.floor(round.duration_seconds / 60)} minutes.${extra}`;
    }, [data, timeline]);

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
    const ticketDiff = Math.abs(round.tickets1 - round.tickets2);
    const winnerLabel = winner === 1 ? "Axis Victory" : winner === 2 ? "Allied Victory" : "Draw";
    const closenessBadge = ticketDiff < 20 ? "NAIL-BITER" : ticketDiff < 50 ? "HARD-FOUGHT" : null;

    const playerHighlights = timeline?.player_highlights;

    return (
        <div className="space-y-6">
            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-xl border border-border/60">
                <div className={cn(
                    "relative p-6 md:p-8",
                    winner === 1
                        ? "bg-gradient-to-br from-red-950/60 via-background to-background"
                        : winner === 2
                            ? "bg-gradient-to-br from-blue-950/60 via-background to-background"
                            : "bg-gradient-to-br from-muted/40 via-background to-background"
                )}>
                    {/* Back button */}
                    <div className="absolute top-4 left-4">
                        <Button variant="outline" size="icon" asChild className="bg-background/50 backdrop-blur-sm">
                            <Link href="/stats/rounds">
                                <ChevronLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    <div className="text-center space-y-3 pt-4">
                        {/* Map name - large */}
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                            {round.map_name}
                        </h1>

                        {/* Server + gamemode */}
                        <p className="text-sm text-muted-foreground">
                            {round.current_server_name}
                            {round.gamemode && <span> &middot; {round.gamemode}</span>}
                        </p>

                        {/* Winner badge */}
                        <div className="flex items-center justify-center gap-3">
                            <div className={cn(
                                "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border",
                                winner === 1
                                    ? "bg-red-500/20 text-red-400 border-red-500/40"
                                    : winner === 2
                                        ? "bg-blue-500/20 text-blue-400 border-blue-500/40"
                                        : "bg-muted/30 text-muted-foreground border-border/60"
                            )}>
                                <Trophy className="h-4 w-4" />
                                {winnerLabel}
                            </div>

                            {closenessBadge && (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                                    <Zap className="h-3 w-3" />
                                    {closenessBadge}
                                </div>
                            )}
                        </div>

                        {/* Quick stats row */}
                        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground pt-2">
                            <div className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />
                                {formatDuration(round.duration_seconds)}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Users className="h-3.5 w-3.5" />
                                {data.player_stats.length} players
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Swords className="h-3.5 w-3.5" />
                                {ticketDiff} ticket margin
                            </div>
                        </div>

                        {/* Ticket scores */}
                        <div className="flex items-center justify-center gap-8 pt-2">
                            <div className="text-center">
                                <div className="text-xs text-red-400 font-medium uppercase tracking-wider">Axis</div>
                                <div className="text-2xl font-bold text-red-500">{round.tickets1}</div>
                            </div>
                            <div className="text-xs text-muted-foreground font-medium">VS</div>
                            <div className="text-center">
                                <div className="text-xs text-blue-400 font-medium uppercase tracking-wider">Allies</div>
                                <div className="text-2xl font-bold text-blue-500">{round.tickets2}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Battle Highlights & Narrative */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 border-border/60 bg-muted/10">
                    <CardHeader><CardTitle as="h3" className="text-lg">Battle Report</CardTitle></CardHeader>
                    <CardContent>
                        <p className="text-lg italic text-muted-foreground leading-relaxed">&ldquo;{narrative}&rdquo;</p>
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
                        {/* Enhanced highlights from timeline data */}
                        {playerHighlights && playerHighlights.lead_changes > 0 && (
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/10 text-purple-500 rounded-full"><ArrowLeftRight className="h-4 w-4" /></div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase">Lead Changes</p>
                                    <p className="font-bold">{playerHighlights.lead_changes} time{playerHighlights.lead_changes > 1 ? "s" : ""}</p>
                                </div>
                            </div>
                        )}
                        {playerHighlights && playerHighlights.closest_margin !== undefined && (
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-500/10 text-amber-500 rounded-full"><Zap className="h-4 w-4" /></div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase">Closest Margin</p>
                                    <p className="font-bold">{playerHighlights.closest_margin} tickets</p>
                                </div>
                            </div>
                        )}
                        {playerHighlights?.biggest_streak && (
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-500/10 text-orange-500 rounded-full"><TrendingUp className="h-4 w-4" /></div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase">Kill Streak</p>
                                    <Link href={`/player/${encodeURIComponent(playerHighlights.biggest_streak.player_name)}`} className="font-bold hover:underline">
                                        {playerHighlights.biggest_streak.player_name}
                                    </Link>
                                    <span className="text-xs ml-2 opacity-70">({playerHighlights.biggest_streak.streak} kills)</span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Top Performers */}
            <RoundTopPerformers playerStats={data.player_stats} />

            {/* Round Timeline Chart */}
            <Card className="border-border/60">
                <CardHeader>
                    <CardTitle as="h3" className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        Battle Timeline
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {timelineLoading ? (
                        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            Loading timeline...
                        </div>
                    ) : timeline && timeline.ticket_timeline && timeline.ticket_timeline.length > 0 ? (
                        <RoundTimelineChart
                            ticketTimeline={timeline.ticket_timeline}
                            keyMoments={timeline.key_moments}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                            No timeline data available for this round.
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Battle Replay — Interactive score chart + scrubber + scoreboards */}
            {timeline?.player_scores && Object.keys(timeline.player_scores).length > 0 && (
                <BattleReplay
                    playerScores={timeline.player_scores}
                    playerTeams={timeline.player_teams || {}}
                    playerStats={data.player_stats}
                    roundStartTime={round.start_time}
                    roundEndTime={round.end_time}
                />
            )}
        </div>
    );
}
