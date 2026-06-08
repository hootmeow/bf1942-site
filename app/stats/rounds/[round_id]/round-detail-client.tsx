"use client";

import { useState, useEffect, useMemo, type ReactNode } from "react";
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

                <div className={cn("relative bg-gradient-to-b p-5 md:p-8", winnerGlow)}>

                    {/* Top bar: back + round id + ranked badge */}
                    <div className="flex items-center justify-between mb-6">
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
                    <div className="text-center mb-6">
                        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground mb-1">
                            {round.current_server_name}{round.gamemode ? ` · ${round.gamemode}` : ""}
                        </p>
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground leading-none">
                            {round.map_name}
                        </h1>
                    </div>

                    {/* Ticket scoreboard — the centrepiece */}
                    <div className="flex items-stretch justify-center gap-0 mb-5 max-w-sm mx-auto">
                        {/* Axis */}
                        <div className={cn(
                            "flex-1 flex flex-col items-center justify-center py-4 px-6 border-t border-b border-l",
                            winner === 1 ? "border-red-600/60 bg-red-950/40" : "border-red-900/20 bg-red-950/10"
                        )}>
                            <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-red-400/70 mb-1">Axis</p>
                            <p className={cn("text-5xl font-black font-mono tabular-nums leading-none", winner === 1 ? "text-red-400" : "text-red-700/60")}>
                                {round.tickets1 ?? "—"}
                            </p>
                            {winner === 1 && <p className="text-[8px] font-mono text-red-500/70 uppercase tracking-widest mt-1.5 flex items-center gap-0.5"><Trophy className="h-2 w-2" /> VICTOR</p>}
                        </div>

                        {/* Separator */}
                        <div className="flex items-center justify-center w-10 bg-zinc-900/60 border-t border-b border-border/20">
                            <span className="text-[10px] font-mono text-muted-foreground/50 tracking-widest rotate-0">VS</span>
                        </div>

                        {/* Allies */}
                        <div className={cn(
                            "flex-1 flex flex-col items-center justify-center py-4 px-6 border-t border-b border-r",
                            winner === 2 ? "border-blue-600/60 bg-blue-950/40" : "border-blue-900/20 bg-blue-950/10"
                        )}>
                            <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-blue-400/70 mb-1">Allies</p>
                            <p className={cn("text-5xl font-black font-mono tabular-nums leading-none", winner === 2 ? "text-blue-400" : "text-blue-700/60")}>
                                {round.tickets2 ?? "—"}
                            </p>
                            {winner === 2 && <p className="text-[8px] font-mono text-blue-500/70 uppercase tracking-widest mt-1.5 flex items-center gap-0.5"><Trophy className="h-2 w-2" /> VICTOR</p>}
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
                    <div className="flex items-center justify-center gap-5 text-[11px] font-mono text-muted-foreground/60 mb-4">
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

            {/* ── MOMENTUM ─────────────────────────────────────────────── */}
            <RoundMomentum roundId={roundId} />

            {/* ── BATTLE SECTION ───────────────────────────────────────── */}
            <BattleSection
                timeline={timeline}
                timelineLoading={timelineLoading}
                playerStats={data.player_stats}
                round={round}
            />

            {/* ── FIELD REPORT CARD ────────────────────────────────────── */}
            <div className="border border-border/40 rounded-none sm:rounded-md bg-zinc-950/60 overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30 bg-zinc-900/40">
                    <Search className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Field Report — Personal Record</span>
                </div>
                <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-3 font-mono">Enter your in-game name to retrieve your battle record and performance badges.</p>
                    <form
                        onSubmit={(e) => { e.preventDefault(); fetchReportCard(cardPlayerName); }}
                        className="flex gap-2 mb-4"
                    >
                        <Input
                            value={cardPlayerName}
                            onChange={(e) => setCardPlayerName(e.target.value)}
                            placeholder="Callsign…"
                            className="h-8 text-sm font-mono rounded-none border-border/40"
                        />
                        <Button type="submit" size="sm" disabled={cardLookupLoading || !cardPlayerName.trim()} className="rounded-none font-mono text-xs tracking-widest">
                            {cardLookupLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "RETRIEVE"}
                        </Button>
                    </form>
                    {cardLookupError && <p className="text-xs text-red-500 mb-3 font-mono">{cardLookupError}</p>}
                    {cardData && <RoundReportCard data={cardData} roundId={roundId} />}
                </div>
            </div>
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
