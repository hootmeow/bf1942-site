"use client";

import { useState, useEffect, useMemo, type ReactNode } from "react";
import { useParams } from "next/navigation";
import { AlertTriangle, Loader2, Clock, Calendar, Users, Activity, Swords, Zap, ShieldOff, Server, Globe, MapPin, Gamepad2, Shield } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScoreboardPlayer } from "@/components/scoreboard-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { RoundTimelineChart } from "@/components/charts";
import { useBattleReplayState } from "@/components/battle-replay";
import { RoundMomentum } from "@/components/round-momentum";

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

    const formatDateTime = (iso: string) => {
        const d = new Date(iso);
        if (isNaN(d.getTime())) return null;
        return d.toLocaleString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
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

    // Bleed rate computed from timeline — must be before any early return (Rules of Hooks)
    const bleedRates = useMemo(() => {
        const pts = timeline?.ticket_timeline;
        if (!pts || pts.length < 4) return null;
        const first = pts[0], last = pts[pts.length - 1];
        const dtMin = (new Date(last.timestamp).getTime() - new Date(first.timestamp).getTime()) / 60000;
        if (dtMin <= 0) return null;
        const t1 = first.tickets1 != null && last.tickets1 != null ? ((first.tickets1 - last.tickets1) / dtMin).toFixed(1) : null;
        const t2 = first.tickets2 != null && last.tickets2 != null ? ((first.tickets2 - last.tickets2) / dtMin).toFixed(1) : null;
        return t1 && t2 ? { t1, t2 } : null;
    }, [timeline]);

    // Dominance score — uses data?.round to handle pre-load null safely
    const dominance = useMemo(() => {
        const t1 = data?.round.tickets1;
        const t2 = data?.round.tickets2;
        if (t1 == null || t2 == null) return null;
        const total = t1 + t2;
        if (total === 0) return null;
        const winT = Math.max(t1, t2);
        const score = Math.round((winT / total) * 100);
        const label = score >= 98 ? "Shutout" : score >= 90 ? "Dominant" : score >= 75 ? "Decisive" : score >= 60 ? "Close" : "Razor-Thin";
        const barColor = score >= 90 ? "bg-red-500" : score >= 75 ? "bg-amber-500" : score >= 60 ? "bg-yellow-400" : "bg-emerald-500";
        return { score, label, barColor };
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
    const ticketDiff = Math.abs(round.tickets1 - round.tickets2);
    const winnerLabel = winner === 1 ? "Axis Victory" : winner === 2 ? "Allied Victory" : "Draw";
    const closenessBadge = ticketDiff < 20 ? "NAIL-BITER" : ticketDiff < 50 ? "HARD-FOUGHT" : null;

    const playerHighlights = timeline?.player_highlights;

    const winnerAccent = winner === 1 ? "border-red-700/50" : winner === 2 ? "border-blue-700/50" : "border-border/40";
    const winnerGlow   = winner === 1 ? "from-red-950/70 via-zinc-950 to-zinc-950" : winner === 2 ? "from-blue-950/70 via-zinc-950 to-zinc-950" : "from-zinc-900 to-zinc-950";

    return (
        <div className="space-y-4">

            {/* ── HERO BANNER ─────────────────────────────────────────── */}
            <div className={cn("relative overflow-hidden border rounded-none sm:rounded-lg", winnerAccent)}
                 style={{ backgroundImage: "radial-gradient(circle at 50% 0%, var(--tw-gradient-from), var(--tw-gradient-to))" }}
            >
                {/* Crosshatch tactical grid overlay */}
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                     style={{ backgroundImage: "repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 32px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 32px)" }} />

                <div className={cn("relative bg-gradient-to-b p-4 md:p-6", winnerGlow)}>

                    {/* Top bar: back + round id + ranked badge */}
                    <div className="flex items-center justify-between mb-4">
                        <Button variant="ghost" size="sm" asChild className="gap-1.5 text-muted-foreground hover:text-foreground h-7 px-2">
                            <Link href="/stats/rounds">
                                <ChevronLeft className="h-3.5 w-3.5" />
                                <span className="text-xs font-mono uppercase tracking-widest">Rounds</span>
                            </Link>
                        </Button>
                        <div className="flex items-center gap-2">
                            {closenessBadge && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold font-mono tracking-widest bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                    <Zap className="h-2.5 w-2.5" />{closenessBadge}
                                </span>
                            )}
                            <Link href="/rank-system#ranked-unranked">
                                {round.is_ranked === false ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono tracking-widest bg-orange-500/10 text-orange-400 border border-orange-500/25 hover:bg-orange-500/20 transition-colors">
                                        <ShieldOff className="h-2.5 w-2.5" /> UNRANKED
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/20 transition-colors">
                                        <Activity className="h-2.5 w-2.5" /> RANKED
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>

                    {/* Map name + server */}
                    <div className="text-center mb-4">
                        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground mb-1">
                            {round.current_server_name}{round.gamemode ? ` · ${round.gamemode}` : ""}
                        </p>
                        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-foreground leading-none">
                            {round.map_name}
                        </h1>
                    </div>

                    {/* Ticket scoreboard — the centrepiece. Two self-contained
                        boxes with a real gap; a floating VS chip bridges them so
                        each winner frame stays a complete, unbroken border. */}
                    <div className="relative flex items-stretch justify-center gap-3 mb-4 max-w-sm mx-auto">
                        {/* Axis */}
                        <div className={cn(
                            "relative flex-1 flex flex-col items-center justify-center py-3.5 px-6 border overflow-hidden transition-colors",
                            winner === 1
                                ? "border-red-500/70 bg-red-950/30 shadow-[0_0_24px_-6px_rgba(239,68,68,0.55)]"
                                : "border-border/40 bg-zinc-900/30"
                        )}>
                            {winner === 1 && <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent" />}
                            <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-red-400/70 mb-1">Axis</p>
                            <p className={cn("text-4xl font-black font-mono tabular-nums leading-none", winner === 1 ? "text-red-400" : "text-red-300/35")}>
                                {round.tickets1 ?? "—"}
                            </p>
                            <p className={cn(
                                "text-[8px] font-mono uppercase tracking-widest mt-1.5 flex items-center gap-0.5 transition-opacity",
                                winner === 1 ? "text-red-500/80 opacity-100" : "opacity-0"
                            )}><Trophy className="h-2 w-2" /> VICTOR</p>
                        </div>

                        {/* Allies */}
                        <div className={cn(
                            "relative flex-1 flex flex-col items-center justify-center py-3.5 px-6 border overflow-hidden transition-colors",
                            winner === 2
                                ? "border-blue-500/70 bg-blue-950/30 shadow-[0_0_24px_-6px_rgba(59,130,246,0.55)]"
                                : "border-border/40 bg-zinc-900/30"
                        )}>
                            {winner === 2 && <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />}
                            <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-blue-400/70 mb-1">Allies</p>
                            <p className={cn("text-4xl font-black font-mono tabular-nums leading-none", winner === 2 ? "text-blue-400" : "text-blue-300/35")}>
                                {round.tickets2 ?? "—"}
                            </p>
                            <p className={cn(
                                "text-[8px] font-mono uppercase tracking-widest mt-1.5 flex items-center gap-0.5 transition-opacity",
                                winner === 2 ? "text-blue-500/80 opacity-100" : "opacity-0"
                            )}><Trophy className="h-2 w-2" /> VICTOR</p>
                        </div>

                        {/* Floating VS chip */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-zinc-950 shadow-[0_0_0_4px_rgba(9,9,11,1)]">
                            <span className="text-[9px] font-mono font-bold tracking-wider text-muted-foreground/70">VS</span>
                        </div>
                    </div>

                    {/* Dominance bar */}
                    {dominance && (
                        <div className="max-w-sm mx-auto mb-4 space-y-1">
                            <div className="flex justify-between text-[9px] font-mono uppercase tracking-widest text-muted-foreground/60">
                                <span>Dominance</span>
                                <span className="text-foreground/80">{dominance.label} · {dominance.score}%</span>
                            </div>
                            <div className="h-1 bg-zinc-800 overflow-hidden">
                                <div className={cn("h-full transition-all duration-1000", dominance.barColor)} style={{ width: `${dominance.score}%` }} />
                            </div>
                        </div>
                    )}

                    {/* Quick meta row */}
                    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[11px] font-mono text-muted-foreground/60 mb-4">
                        {formatDateTime(round.start_time) && (
                            <>
                                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDateTime(round.start_time)}</span>
                                <span className="text-border/60">|</span>
                            </>
                        )}
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatDuration(round.duration_seconds)}</span>
                        <span className="text-border/60">|</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{data.player_stats.length} combatants</span>
                        <span className="text-border/60">|</span>
                        <span className="flex items-center gap-1"><Swords className="h-3 w-3" />{ticketDiff} tkt margin</span>
                    </div>

                    {/* Narrative */}
                    {narrative && (
                        <p className="text-center text-xs text-muted-foreground/50 italic leading-relaxed max-w-xl mx-auto border-t border-border/20 pt-4 font-mono">
                            {narrative}
                        </p>
                    )}
                </div>
            </div>

            {/* ── INTEL STRIP — all 7 cells, single row, scroll on mobile ── */}
            <div className="flex border border-border/40 overflow-x-auto rounded-none sm:rounded-md bg-zinc-950/60">
                {highlights?.mvp && (
                    <IntelCell label="MVP" sub={`${highlights.mvp.final_score} pts`} accent="text-amber-400">
                        <Link href={`/player/${encodeURIComponent(highlights.mvp.last_known_name || "")}`} className="hover:text-amber-400 transition-colors truncate block">
                            {highlights.mvp.last_known_name}
                        </Link>
                    </IntelCell>
                )}
                {highlights?.deadliest && (
                    <IntelCell label="Top Fragger" sub={`${highlights.deadliest.final_kills} kills`} accent="text-red-400">
                        <Link href={`/player/${encodeURIComponent(highlights.deadliest.last_known_name || "")}`} className="hover:text-red-400 transition-colors truncate block">
                            {highlights.deadliest.last_known_name}
                        </Link>
                    </IntelCell>
                )}
                {playerHighlights?.biggest_streak && (
                    <IntelCell label="Kill Streak" sub={`${playerHighlights.biggest_streak.streak} streak`} accent="text-orange-400">
                        <Link href={`/player/${encodeURIComponent(playerHighlights.biggest_streak.player_name)}`} className="hover:text-orange-400 transition-colors truncate block">
                            {playerHighlights.biggest_streak.player_name}
                        </Link>
                    </IntelCell>
                )}
                {playerHighlights && playerHighlights.lead_changes > 0 && (
                    <IntelCell label="Lead Changes" sub="swings" accent="text-purple-400">
                        <span className="font-mono text-base font-bold text-foreground">{playerHighlights.lead_changes}</span>
                    </IntelCell>
                )}
                {playerHighlights?.closest_margin !== undefined && (
                    <IntelCell label="Closest" sub="ticket margin" accent="text-emerald-400">
                        <span className="font-mono text-base font-bold text-foreground">{playerHighlights.closest_margin}</span>
                    </IntelCell>
                )}
                <IntelCell label="Combatants" sub={formatDuration(round.duration_seconds)} accent="text-sky-400">
                    <span className="font-mono text-base font-bold text-foreground">{data.player_stats.length}</span>
                </IntelCell>
                {bleedRates && (
                    <IntelCell label="Tkt Bleed/min" sub="ax · al" accent="text-zinc-400" last>
                        <span className="font-mono text-sm font-bold text-red-400">{bleedRates.t1}</span>
                        <span className="font-mono text-xs text-muted-foreground mx-1">·</span>
                        <span className="font-mono text-sm font-bold text-blue-400">{bleedRates.t2}</span>
                    </IntelCell>
                )}
            </div>

            {/* ── BATTLE SECTION ───────────────────────────────────────── */}
            <BattleSection
                roundId={roundId}
                timeline={timeline}
                timelineLoading={timelineLoading}
                playerStats={data.player_stats}
                round={round}
            />
        </div>
    );
}

// Shared intel cell for the highlights strip
function IntelCell({ label, sub, accent, children, last }: {
    label: string; sub: string; accent?: string; children: ReactNode; last?: boolean;
}) {
    return (
        <div className={cn(
            "flex-1 min-w-[90px] flex flex-col justify-between px-3 py-2.5 shrink-0",
            !last && "border-r border-border/30"
        )}>
            <p className="text-[8px] font-mono uppercase tracking-[0.2em] text-muted-foreground/60 mb-1 whitespace-nowrap">{label}</p>
            <div className={cn("text-sm font-semibold text-foreground truncate", accent)}>{children}</div>
            <p className="text-[9px] font-mono text-muted-foreground/40 mt-0.5 whitespace-nowrap">{sub}</p>
        </div>
    );
}

function BattleSection({ roundId, timeline, timelineLoading, playerStats, round }: {
    roundId: string;
    timeline: TimelineResponse | null;
    timelineLoading: boolean;
    playerStats: ScoreboardPlayer[];
    round: RoundData;
}) {
    const hasReplayData = timeline?.player_scores && Object.keys(timeline.player_scores).length > 0;
    const hasTimeline = !!(timeline && timeline.ticket_timeline && timeline.ticket_timeline.length > 0);

    const replayState = useBattleReplayState({
        playerScores: timeline?.player_scores || {},
        playerTeams: timeline?.player_teams || {},
        playerStats,
        roundStartTime: round.start_time,
        roundEndTime: round.end_time,
    });

    return (
        <div className="space-y-4">
            {/* Section heading */}
            <div className="flex items-center gap-3 px-1">
                <Activity className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">Battle Analysis</span>
                <div className="flex-1 h-px bg-gradient-to-r from-border/50 to-transparent" />
            </div>

            {/* Two telemetry charts side by side — tactical panels.
                RoundMomentum renders its own flex-1 panel (or null); if it's null
                the timeline panel fills the row on its own. */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch">
                <div className="flex-1 min-w-0 flex flex-col border border-border/40 rounded-none sm:rounded-md bg-zinc-950/60 overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30 bg-zinc-900/40">
                        <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Battle Timeline</span>
                    </div>
                    <div className="p-4 flex-1">
                        {timelineLoading ? (
                            <div className="flex items-center justify-center h-[300px] text-muted-foreground text-xs font-mono">
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                Loading timeline…
                            </div>
                        ) : hasTimeline ? (
                            <RoundTimelineChart
                                ticketTimeline={timeline!.ticket_timeline}
                                keyMoments={timeline!.key_moments}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-[200px] text-muted-foreground text-xs font-mono">
                                No timeline data available for this round.
                            </div>
                        )}
                    </div>
                </div>

                <RoundMomentum roundId={roundId} />
            </div>

            {/* Scoreboards — surfaced right under the charts */}
            {hasReplayData && <BattleReplayScoreboards state={replayState} />}

            {/* Replay scrubber paired with a Server Intel panel so the chart
                no longer spans the full width on its own. */}
            {hasReplayData && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
                    <div className="lg:col-span-2 min-w-0">
                        <BattleReplayCard state={replayState} />
                    </div>
                    <RoundInfoPanel round={round} combatants={playerStats.length} />
                </div>
            )}
        </div>
    );
}

// Server / round metadata panel — fills the space beside the replay chart
function RoundInfoPanel({ round, combatants }: { round: RoundData; combatants: number }) {
    const fmtDateTime = (iso: string) => {
        const d = new Date(iso);
        return isNaN(d.getTime())
            ? "—"
            : d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    };
    const fmtDuration = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;
    const ranked = round.is_ranked !== false;

    const rows: { icon: ReactNode; label: string; value: ReactNode }[] = [
        { icon: <Server className="h-3.5 w-3.5" />, label: "Server", value: round.current_server_name || "—" },
        { icon: <Globe className="h-3.5 w-3.5" />, label: "Address", value: round.ip ? `${round.ip}:${round.port}` : "—" },
        { icon: <Gamepad2 className="h-3.5 w-3.5" />, label: "Mode", value: round.gamemode || "—" },
        { icon: <MapPin className="h-3.5 w-3.5" />, label: "Map", value: round.map_name || "—" },
        {
            icon: ranked ? <Shield className="h-3.5 w-3.5" /> : <ShieldOff className="h-3.5 w-3.5" />,
            label: "Status",
            value: <span className={ranked ? "text-emerald-400" : "text-orange-400"}>{ranked ? "Ranked" : "Unranked"}</span>,
        },
        { icon: <Calendar className="h-3.5 w-3.5" />, label: "Started", value: fmtDateTime(round.start_time) },
        { icon: <Calendar className="h-3.5 w-3.5" />, label: "Ended", value: fmtDateTime(round.end_time) },
        { icon: <Clock className="h-3.5 w-3.5" />, label: "Duration", value: fmtDuration(round.duration_seconds) },
        { icon: <Users className="h-3.5 w-3.5" />, label: "Combatants", value: combatants },
    ];

    return (
        <div className="flex flex-col border border-border/40 rounded-none sm:rounded-md bg-zinc-950/60 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30 bg-zinc-900/40">
                <Server className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Server Intel</span>
            </div>
            <div className="flex-1 divide-y divide-border/20">
                {rows.map((r) => (
                    <div key={r.label} className="flex items-center justify-between gap-3 px-4 py-2.5">
                        <span className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-muted-foreground/70">
                            {r.icon}
                            {r.label}
                        </span>
                        <span className="text-xs font-mono text-foreground/90 text-right truncate max-w-[55%]">{r.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
