"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { AlertTriangle, Loader2, Clock, Users, Activity, Swords, Zap, ShieldOff, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScoreboardPlayer } from "@/components/scoreboard-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ChevronLeft, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { RoundTimelineChart } from "@/components/charts";
import { useBattleReplayState } from "@/components/battle-replay";
import { RoundMomentum } from "@/components/round-momentum";
import { RoundReportCard, type ReportCardData } from "@/components/round-report-card";

const BattleReplayCard = dynamic(
  () => import("@/components/battle-replay").then(m => ({ default: m.BattleReplayCard })),
  { ssr: false }
);
const BattleReplayScoreboards = dynamic(
  () => import("@/components/battle-replay").then(m => ({ default: m.BattleReplayScoreboards })),
  { ssr: false }
);

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
    is_ranked?: boolean;
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

export default function RoundDetailClient() {
    const params = useParams();
    const searchParams = useSearchParams();
    const roundId = params.round_id as string;

    // Report card state — fetch both player lookup + card data in one shot
    const [cardPlayerName, setCardPlayerName] = useState(searchParams.get("player") ?? "");
    const [cardData, setCardData] = useState<ReportCardData | null>(null);
    const [cardLookupLoading, setCardLookupLoading] = useState(false);
    const [cardLookupError, setCardLookupError] = useState<string | null>(null);

    useEffect(() => {
        const urlPlayer = searchParams.get("player");
        if (urlPlayer?.trim()) fetchReportCard(urlPlayer.trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function fetchReportCard(name: string) {
        if (!name.trim()) return;
        setCardLookupLoading(true);
        setCardLookupError(null);
        setCardData(null);
        try {
            // Step 1: resolve player_id
            const profileRes = await fetch(`/api/v1/players/search/profile?name=${encodeURIComponent(name.trim())}`);
            const profileData = await profileRes.json();
            if (!profileData.ok || !profileData.player_info?.player_id) {
                setCardLookupError("Player not found. Check your in-game name spelling.");
                return;
            }
            const playerId = profileData.player_info.player_id;

            // Step 2: fetch card for this player + round
            const cardRes = await fetch(`/api/v1/players/${playerId}/rounds/${roundId}/card`);
            const card = await cardRes.json();
            if (!card.ok) {
                setCardLookupError(`${name} wasn't found in this round's records.`);
                return;
            }
            setCardData(card);
            setCardPlayerName(name.trim());
        } catch {
            setCardLookupError("Something went wrong. Please try again.");
        } finally {
            setCardLookupLoading(false);
        }
    }

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

                            <Link href="/rank-system#ranked-unranked">
                                {round.is_ranked === false ? (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/40 hover:bg-orange-500/30 transition-colors cursor-pointer">
                                        <ShieldOff className="h-3 w-3" />
                                        UNRANKED
                                    </div>
                                ) : (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/40 hover:bg-green-500/30 transition-colors cursor-pointer">
                                        <Activity className="h-3 w-3" />
                                        RANKED
                                    </div>
                                )}
                            </Link>
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

                        {/* Dominance Score Meter */}
                        {round.tickets1 != null && round.tickets2 != null && (round.tickets1 + round.tickets2) > 0 && (() => {
                            const winT = Math.max(round.tickets1, round.tickets2);
                            const loseT = Math.min(round.tickets1, round.tickets2);
                            const total = winT + loseT;
                            const score = Math.round((winT / total) * 100);
                            const label = score >= 98 ? "Shutout" : score >= 90 ? "Dominant" : score >= 75 ? "Decisive" : score >= 60 ? "Close" : "Razor-Thin";
                            const color = score >= 90 ? "bg-red-500" : score >= 75 ? "bg-amber-500" : score >= 60 ? "bg-yellow-500" : "bg-green-500";
                            return (
                                <div className="max-w-xs mx-auto space-y-1 pt-2">
                                    <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-wider">
                                        <span>Dominance</span>
                                        <span className="font-semibold text-foreground">{label} ({score}%)</span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${score}%` }} />
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Narrative */}
                        {narrative && (
                            <p className="text-sm italic text-muted-foreground/80 leading-relaxed max-w-2xl mx-auto pt-2">
                                &ldquo;{narrative}&rdquo;
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Highlights Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {highlights?.mvp && (
                    <div className="rounded-lg border border-border/60 bg-card/40 px-3 py-2.5">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">MVP</p>
                        <Link href={`/player/${encodeURIComponent(highlights.mvp.last_known_name || "")}`} className="text-sm font-semibold text-foreground hover:underline truncate block">
                            {highlights.mvp.last_known_name}
                        </Link>
                        <span className="text-xs text-muted-foreground">{highlights.mvp.final_score} pts</span>
                    </div>
                )}
                {highlights?.deadliest && (
                    <div className="rounded-lg border border-border/60 bg-card/40 px-3 py-2.5">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Top Fragger</p>
                        <Link href={`/player/${encodeURIComponent(highlights.deadliest.last_known_name || "")}`} className="text-sm font-semibold text-foreground hover:underline truncate block">
                            {highlights.deadliest.last_known_name}
                        </Link>
                        <span className="text-xs text-muted-foreground">{highlights.deadliest.final_kills} kills</span>
                    </div>
                )}
                {playerHighlights?.biggest_streak && (
                    <div className="rounded-lg border border-border/60 bg-card/40 px-3 py-2.5">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Kill Streak</p>
                        <Link href={`/player/${encodeURIComponent(playerHighlights.biggest_streak.player_name)}`} className="text-sm font-semibold text-foreground hover:underline truncate block">
                            {playerHighlights.biggest_streak.player_name}
                        </Link>
                        <span className="text-xs text-muted-foreground">{playerHighlights.biggest_streak.streak} streak</span>
                    </div>
                )}
                {playerHighlights && playerHighlights.lead_changes > 0 && (
                    <div className="rounded-lg border border-border/60 bg-card/40 px-3 py-2.5">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Lead Changes</p>
                        <p className="text-sm font-semibold text-foreground">{playerHighlights.lead_changes}</p>
                        <span className="text-xs text-muted-foreground">time{playerHighlights.lead_changes > 1 ? "s" : ""}</span>
                    </div>
                )}
                {playerHighlights && playerHighlights.closest_margin !== undefined && (
                    <div className="rounded-lg border border-border/60 bg-card/40 px-3 py-2.5">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Closest Margin</p>
                        <p className="text-sm font-semibold text-foreground">{playerHighlights.closest_margin}</p>
                        <span className="text-xs text-muted-foreground">tickets</span>
                    </div>
                )}
                <div className="rounded-lg border border-border/60 bg-card/40 px-3 py-2.5">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Players</p>
                    <p className="text-sm font-semibold text-foreground">{data.player_stats.length}</p>
                    <span className="text-xs text-muted-foreground">{formatDuration(round.duration_seconds)}</span>
                </div>
            </div>

            {/* Ticket Decay Rate Analysis */}
            <TicketDecayAnalysis timeline={timeline} round={round} />

            {/* Ticket Bleed Momentum */}
            <RoundMomentum roundId={roundId} />

            {/* Battle Timeline + Battle Replay + Scoreboards */}
            <BattleSection
                timeline={timeline}
                timelineLoading={timelineLoading}
                playerStats={data.player_stats}
                round={round}
            />

            {/* Per-player Report Card */}
            <Card className="border-border/60 bg-card/50">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Search className="h-4 w-4 text-primary" />
                        Your Performance Card
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Enter your in-game name to see your rank, badges, and share your result.
                    </p>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={(e) => { e.preventDefault(); fetchReportCard(cardPlayerName); }}
                        className="flex gap-2 mb-4"
                    >
                        <Input
                            value={cardPlayerName}
                            onChange={(e) => setCardPlayerName(e.target.value)}
                            placeholder="Your in-game name…"
                            className="h-8 text-sm"
                        />
                        <Button type="submit" size="sm" disabled={cardLookupLoading || !cardPlayerName.trim()}>
                            {cardLookupLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Look up"}
                        </Button>
                    </form>
                    {cardLookupError && (
                        <p className="text-xs text-red-500 mb-3">{cardLookupError}</p>
                    )}
                    {cardData && (
                        <RoundReportCard data={cardData} roundId={roundId} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function TicketDecayAnalysis({ timeline, round }: {
    timeline: TimelineResponse | null;
    round: RoundData;
}) {
    const points = timeline?.ticket_timeline;
    if (!points || points.length < 4) return null;

    // Sample every Nth point to get ~10 windows for decay rate calc
    const step = Math.max(1, Math.floor(points.length / 10));
    const sampled = points.filter((_, i) => i % step === 0);

    // Compute tickets-per-minute decay rate for each team across windows
    const windows: { label: string; t1Rate: number; t2Rate: number }[] = [];
    for (let i = 1; i < sampled.length; i++) {
        const prev = sampled[i - 1];
        const curr = sampled[i];
        const dtMs = new Date(curr.timestamp).getTime() - new Date(prev.timestamp).getTime();
        if (dtMs <= 0) continue;
        const dtMin = dtMs / 60000;
        const t1Rate = prev.tickets1 != null && curr.tickets1 != null ? (prev.tickets1 - curr.tickets1) / dtMin : 0;
        const t2Rate = prev.tickets2 != null && curr.tickets2 != null ? (prev.tickets2 - curr.tickets2) / dtMin : 0;
        const pct = Math.round((i / sampled.length) * 100);
        windows.push({ label: `${pct}%`, t1Rate: Math.max(0, t1Rate), t2Rate: Math.max(0, t2Rate) });
    }

    if (windows.length === 0) return null;

    const avgT1 = windows.reduce((s, w) => s + w.t1Rate, 0) / windows.length;
    const avgT2 = windows.reduce((s, w) => s + w.t2Rate, 0) / windows.length;
    const maxRate = Math.max(...windows.flatMap(w => [w.t1Rate, w.t2Rate]), 1);

    const t1Label = "Axis";
    const t2Label = "Allies";

    return (
        <Card className="border-border/60">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    Ticket Bleed Rate
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex gap-6 text-xs text-muted-foreground mb-1">
                    <span><span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1" />{t1Label} avg {avgT1.toFixed(1)} tix/min</span>
                    <span><span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1" />{t2Label} avg {avgT2.toFixed(1)} tix/min</span>
                </div>
                <div className="space-y-1">
                    {windows.map((w, i) => (
                        <div key={i} className="grid grid-cols-[40px_1fr_1fr] gap-1 items-center text-[10px] text-muted-foreground">
                            <span className="text-right pr-1">{w.label}</span>
                            <div className="flex items-center gap-0.5">
                                <div
                                    className="h-2 rounded-sm bg-red-500/70 transition-all"
                                    style={{ width: `${(w.t1Rate / maxRate) * 100}%`, minWidth: w.t1Rate > 0 ? "2px" : "0" }}
                                />
                                <span className="shrink-0">{w.t1Rate.toFixed(1)}</span>
                            </div>
                            <div className="flex items-center gap-0.5">
                                <div
                                    className="h-2 rounded-sm bg-blue-500/70 transition-all"
                                    style={{ width: `${(w.t2Rate / maxRate) * 100}%`, minWidth: w.t2Rate > 0 ? "2px" : "0" }}
                                />
                                <span className="shrink-0">{w.t2Rate.toFixed(1)}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-[10px] text-muted-foreground/60">Tickets lost per minute across equal time windows. Spikes indicate intense firefights or flag captures.</p>
            </CardContent>
        </Card>
    );
}

function BattleSection({ timeline, timelineLoading, playerStats, round }: {
    timeline: TimelineResponse | null;
    timelineLoading: boolean;
    playerStats: ScoreboardPlayer[];
    round: RoundData;
}) {
    const hasReplayData = timeline?.player_scores && Object.keys(timeline.player_scores).length > 0;

    const replayState = useBattleReplayState({
        playerScores: timeline?.player_scores || {},
        playerTeams: timeline?.player_teams || {},
        playerStats,
        roundStartTime: round.start_time,
        roundEndTime: round.end_time,
    });

    return (
        <div className="space-y-6">
            {/* Side-by-side: Timeline + Replay card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

                {hasReplayData && <BattleReplayCard state={replayState} />}
            </div>

            {/* Full-width scoreboards below */}
            {hasReplayData && <BattleReplayScoreboards state={replayState} />}
        </div>
    );
}
