"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Crown, Medal, Award } from "lucide-react";

// Define a flexible interface that covers both live server players and historical round players
export interface ScoreboardPlayer {
    // Common fields
    score: number; // or final_score
    kills: number; // or final_kills
    deaths: number; // or final_deaths
    team: 1 | 2;

    // Live server specific
    player_name?: string;
    ping?: number; // or avg_ping

    // Historical round specific
    player_id?: number;
    last_known_name?: string;
    final_score?: number;
    final_kills?: number;
    final_deaths?: number;
    avg_ping?: number;
}

function getPingColor(ping: number): { text: string; bg: string } {
    if (ping <= 80) return { text: "text-green-500", bg: "bg-green-500" };
    if (ping <= 120) return { text: "text-yellow-500", bg: "bg-yellow-500" };
    if (ping <= 160) return { text: "text-orange-500", bg: "bg-orange-500" };
    return { text: "text-red-500", bg: "bg-red-500" };
}

function getKDRatio(kills: number, deaths: number): { ratio: string; color: string } {
    if (deaths === 0) {
        return { ratio: kills > 0 ? `${kills}.00` : "0.00", color: kills > 0 ? "text-green-500" : "text-muted-foreground" };
    }
    const kd = kills / deaths;
    let color = "text-muted-foreground";
    if (kd >= 2) color = "text-green-500";
    else if (kd >= 1) color = "text-emerald-400";
    else if (kd >= 0.5) color = "text-yellow-500";
    else color = "text-red-400";
    return { ratio: kd.toFixed(2), color };
}

function RankBadge({ rank }: { rank: number }) {
    if (rank === 1) {
        return (
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-yellow-500/20 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.3)] ring-1 ring-yellow-500/30">
                <Crown className="w-3.5 h-3.5" />
            </div>
        );
    }
    if (rank === 2) {
        return (
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-300/15 text-slate-300 shadow-[0_0_8px_rgba(203,213,225,0.2)] ring-1 ring-slate-400/20">
                <Medal className="w-3.5 h-3.5" />
            </div>
        );
    }
    if (rank === 3) {
        return (
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-600/15 text-amber-500 shadow-[0_0_8px_rgba(217,119,6,0.2)] ring-1 ring-amber-600/20">
                <Award className="w-3.5 h-3.5" />
            </div>
        );
    }
    return (
        <div className="flex items-center justify-center w-6 h-6 text-xs text-muted-foreground font-mono">
            {rank}
        </div>
    );
}

interface ScoreboardTableProps {
    players: ScoreboardPlayer[];
    topThreeNames?: string[]; // Names of top 3 players overall (across all teams)
}

export function ScoreboardTable({ players, topThreeNames = [] }: ScoreboardTableProps) {
    const totals = players.reduce(
        (acc, player) => {
            const score = player.final_score ?? player.score ?? 0;
            const kills = player.final_kills ?? player.kills ?? 0;
            const deaths = player.final_deaths ?? player.deaths ?? 0;

            acc.score += score;
            acc.kills += kills;
            acc.deaths += deaths;
            return acc;
        },
        { score: 0, kills: 0, deaths: 0 }
    );

    const teamKD = getKDRatio(totals.kills, totals.deaths);

    if (players.length === 0) {
        return (
            <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                No players on this team
            </div>
        );
    }

    const maxScore = Math.max(...players.map(p => p.final_score ?? p.score ?? 0), 1);

    return (
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-border/40">
                    <TableHead className="w-10">#</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead className="text-right">K</TableHead>
                    <TableHead className="text-right">D</TableHead>
                    <TableHead className="text-right">K/D</TableHead>
                    <TableHead className="text-right w-20">Ping</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {players.map((player, index) => {
                    const name = player.last_known_name || player.player_name || "Unknown";
                    const score = player.final_score ?? player.score ?? 0;
                    const kills = player.final_kills ?? player.kills ?? 0;
                    const deaths = player.final_deaths ?? player.deaths ?? 0;
                    const ping = player.avg_ping ?? player.ping ?? 0;
                    const kd = getKDRatio(kills, deaths);
                    const pingColor = getPingColor(ping);
                    const scorePercent = (score / maxScore) * 100;

                    // Check if this player is in the overall top 3
                    const overallRank = topThreeNames.indexOf(name) + 1; // 1, 2, 3 or 0 if not found
                    const teamRank = index + 1;
                    const team = player.team;

                    return (
                        <TableRow
                            key={`${name}-${index}`}
                            className={cn(
                                "transition-all duration-200 hover:bg-muted/20 relative group",
                                overallRank === 1 && "bg-yellow-500/[0.06] hover:bg-yellow-500/[0.1]",
                                overallRank === 2 && "bg-slate-300/[0.04] hover:bg-slate-300/[0.08]",
                                overallRank === 3 && "bg-amber-600/[0.04] hover:bg-amber-600/[0.08]"
                            )}
                        >
                            <TableCell className="py-2.5">
                                {overallRank > 0 ? (
                                    <RankBadge rank={overallRank} />
                                ) : (
                                    <div className="flex items-center justify-center w-6 h-6 text-xs text-muted-foreground/60 font-mono">
                                        {teamRank}
                                    </div>
                                )}
                            </TableCell>
                            <TableCell className="font-medium text-foreground py-2.5">
                                {name && name !== "Unknown" ? (
                                    <Link
                                        href={`/player/${encodeURIComponent(name)}`}
                                        className="hover:text-primary hover:underline underline-offset-2 transition-colors"
                                    >
                                        {name}
                                    </Link>
                                ) : (
                                    <span className="text-muted-foreground">{name}</span>
                                )}
                            </TableCell>
                            <TableCell className="text-right py-2.5 relative">
                                {/* Score bar background */}
                                <div
                                    className="absolute inset-y-1 right-0 rounded-l opacity-[0.07] transition-all duration-500"
                                    style={{
                                        width: `${scorePercent}%`,
                                        background: team === 1
                                            ? "linear-gradient(90deg, transparent, #ef4444)"
                                            : "linear-gradient(90deg, transparent, #3b82f6)",
                                    }}
                                />
                                <span className="relative font-bold tabular-nums">{score}</span>
                            </TableCell>
                            <TableCell className="text-right text-green-400 font-semibold tabular-nums py-2.5">{kills}</TableCell>
                            <TableCell className="text-right text-red-400 font-semibold tabular-nums py-2.5">{deaths}</TableCell>
                            <TableCell className={cn("text-right font-mono text-sm tabular-nums py-2.5", kd.color)}>
                                {kd.ratio}
                            </TableCell>
                            <TableCell className="text-right py-2.5">
                                <div className="flex items-center justify-end gap-2">
                                    <div className={cn("w-1.5 h-1.5 rounded-full", pingColor.bg)} style={{
                                        boxShadow: `0 0 4px currentColor`,
                                    }} />
                                    <span className={cn("font-mono text-sm tabular-nums", pingColor.text)}>{ping}</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
            <TableFooter>
                <TableRow className="bg-muted/20 hover:bg-muted/20 border-t border-border/40">
                    <TableCell></TableCell>
                    <TableCell className="font-semibold text-foreground">Team Total</TableCell>
                    <TableCell className="text-right font-bold text-foreground tabular-nums">{totals.score}</TableCell>
                    <TableCell className="text-right font-semibold text-green-400 tabular-nums">{totals.kills}</TableCell>
                    <TableCell className="text-right font-semibold text-red-400 tabular-nums">{totals.deaths}</TableCell>
                    <TableCell className={cn("text-right font-mono font-semibold tabular-nums", teamKD.color)}>
                        {teamKD.ratio}
                    </TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
}
