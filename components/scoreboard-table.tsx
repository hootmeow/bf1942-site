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
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-500">
                <Crown className="w-3.5 h-3.5" />
            </div>
        );
    }
    if (rank === 2) {
        return (
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-300/20 text-slate-300">
                <Medal className="w-3.5 h-3.5" />
            </div>
        );
    }
    if (rank === 3) {
        return (
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-600/20 text-amber-600">
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

    return (
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent">
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

                    // Check if this player is in the overall top 3
                    const overallRank = topThreeNames.indexOf(name) + 1; // 1, 2, 3 or 0 if not found
                    const teamRank = index + 1;

                    return (
                        <TableRow
                            key={`${name}-${index}`}
                            className={cn(
                                "transition-colors",
                                overallRank === 1 && "bg-yellow-500/5",
                                overallRank === 2 && "bg-slate-300/5",
                                overallRank === 3 && "bg-amber-600/5"
                            )}
                        >
                            <TableCell className="py-2">
                                {overallRank > 0 ? (
                                    <RankBadge rank={overallRank} />
                                ) : (
                                    <div className="flex items-center justify-center w-6 h-6 text-xs text-muted-foreground font-mono">
                                        {teamRank}
                                    </div>
                                )}
                            </TableCell>
                            <TableCell className="font-medium text-foreground py-2">
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
                            <TableCell className="text-right font-semibold py-2">{score}</TableCell>
                            <TableCell className="text-right text-green-400 py-2">{kills}</TableCell>
                            <TableCell className="text-right text-red-400 py-2">{deaths}</TableCell>
                            <TableCell className={cn("text-right font-mono text-sm py-2", kd.color)}>
                                {kd.ratio}
                            </TableCell>
                            <TableCell className="text-right py-2">
                                <div className="flex items-center justify-end gap-2">
                                    <div className={cn("w-1.5 h-1.5 rounded-full", pingColor.bg)} />
                                    <span className={cn("font-mono text-sm", pingColor.text)}>{ping}</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
            <TableFooter>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableCell></TableCell>
                    <TableCell className="font-semibold text-foreground">Team Total</TableCell>
                    <TableCell className="text-right font-bold text-foreground">{totals.score}</TableCell>
                    <TableCell className="text-right font-semibold text-green-400">{totals.kills}</TableCell>
                    <TableCell className="text-right font-semibold text-red-400">{totals.deaths}</TableCell>
                    <TableCell className={cn("text-right font-mono font-semibold", teamKD.color)}>
                        {teamKD.ratio}
                    </TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
}
