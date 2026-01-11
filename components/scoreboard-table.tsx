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

function getPingColorClass(ping: number): string {
    if (ping <= 80) return "text-green-500";
    if (ping <= 120) return "text-yellow-500";
    if (ping <= 160) return "text-orange-500";
    return "text-red-500";
}

export function ScoreboardTable({ players }: { players: ScoreboardPlayer[] }) {
    const totals = players.reduce(
        (acc, player) => {
            // Handle both naming conventions
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

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Player</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead className="text-right">Kills</TableHead>
                    <TableHead className="text-right">Deaths</TableHead>
                    <TableHead className="text-right">Ping</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {players.map((player, index) => {
                    // Determine display values based on available fields
                    const name = player.last_known_name || player.player_name || "Unknown";
                    const score = player.final_score ?? player.score ?? 0;
                    const kills = player.final_kills ?? player.kills ?? 0;
                    const deaths = player.final_deaths ?? player.deaths ?? 0;
                    const ping = player.avg_ping ?? player.ping ?? 0;
                    const playerId = player.player_id;

                    return (
                        <TableRow key={`${name}-${index}`}>
                            <TableCell className="font-medium text-foreground">
                                {name && name !== "Unknown" ? (
                                    <Link href={`/player/${encodeURIComponent(name)}`} className="hover:underline">
                                        {name}
                                    </Link>
                                ) : (
                                    name
                                )}
                            </TableCell>
                            <TableCell className="text-right">{score}</TableCell>
                            <TableCell className="text-right">{kills}</TableCell>
                            <TableCell className="text-right">{deaths}</TableCell>
                            <TableCell className={cn("text-right font-medium", getPingColorClass(ping))}>
                                {ping}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell className="font-semibold text-foreground">Team Totals</TableCell>
                    <TableCell className="text-right font-semibold text-foreground">{totals.score}</TableCell>
                    <TableCell className="text-right font-semibold text-foreground">{totals.kills}</TableCell>
                    <TableCell className="text-right font-semibold text-foreground">{totals.deaths}</TableCell>
                    <TableCell className="text-right"></TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
}
