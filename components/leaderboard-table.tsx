"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy } from "lucide-react";

export interface LeaderboardItem {
    rank: number;
    player_id: number;
    name: string;
    total_score: number;
    rank_label: string;
    kills: number;
    kdr: number;
    rounds: number;
}

export function LeaderboardTable({ players }: { players: LeaderboardItem[] }) {
    return (
        <div className="rounded-md border border-border/60 overflow-hidden">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead className="w-[80px] text-center">Rank</TableHead>
                        <TableHead>Player</TableHead>
                        <TableHead>Rank Title</TableHead>
                        <TableHead className="text-right">RP</TableHead>
                        <TableHead className="text-right">Kills</TableHead>
                        <TableHead className="text-right">K/D</TableHead>
                        <TableHead className="text-right">Rounds</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {players.map((player) => (
                        <TableRow key={player.player_id} className="hover:bg-muted/20">
                            <TableCell className="text-center font-medium">
                                {player.rank === 1 && <Trophy className="h-4 w-4 text-yellow-500 mx-auto" />}
                                {player.rank === 2 && <Trophy className="h-4 w-4 text-gray-400 mx-auto" />}
                                {player.rank === 3 && <Trophy className="h-4 w-4 text-amber-700 mx-auto" />}
                                {player.rank > 3 && <span className="text-muted-foreground">#{player.rank}</span>}
                            </TableCell>
                            <TableCell>
                                <Link href={`/player/${player.name}`} className="flex items-center gap-3 group">
                                    <Avatar className="h-8 w-8 border border-border/40">
                                        <AvatarFallback className="text-xs bg-secondary">
                                            {player.name.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium group-hover:text-primary transition-colors">
                                        {player.name}
                                    </span>
                                </Link>
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="font-mono text-[10px] uppercase">
                                    {player.rank_label.split('(')[1]?.replace(')', '') || 'PVT'}
                                </Badge>
                                <span className="ml-2 text-xs text-muted-foreground hidden sm:inline-block">
                                    {player.rank_label.split('(')[0]}
                                </span>
                            </TableCell>
                            <TableCell className="text-right font-bold tabular-nums">
                                {player.total_score.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground tabular-nums">
                                {player.kills.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right tabular-nums">
                                <span className={player.kdr >= 2.0 ? "text-green-500 font-medium" : ""}>
                                    {player.kdr.toFixed(2)}
                                </span>
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground tabular-nums">
                                {player.rounds.toLocaleString()}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
