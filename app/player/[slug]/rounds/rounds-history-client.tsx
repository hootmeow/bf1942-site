"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertTriangle, ArrowLeft, Server, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface RoundHistoryItem {
    round_id: number;
    server_name: string;
    map_name: string;
    start_time: string;
    end_time: string;
    final_score: number;
    final_kills: number;
    final_deaths: number;
    kills_per_minute: number;
    team: number;
    winner_team: number;
}

interface Pagination {
    page: number;
    page_size: number;
    total_rounds: number;
    total_pages: number;
}

export default function RoundsHistoryClient() {
    const params = useParams();
    const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;
    const playerName = slug ? decodeURIComponent(slug) : undefined;

    const [playerId, setPlayerId] = useState<number | null>(null);
    const [rounds, setRounds] = useState<RoundHistoryItem[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // First fetch: resolve player name → player_id
    useEffect(() => {
        if (!playerName) {
            setError("Invalid player name in URL.");
            setLoading(false);
            return;
        }

        async function resolvePlayer() {
            try {
                const res = await fetch(`/api/v1/players/search/profile?name=${encodeURIComponent(playerName!)}`);
                if (!res.ok) throw new Error("Failed to find player");
                const data = await res.json();
                if (data.ok && data.player_info?.player_id) {
                    setPlayerId(data.player_info.player_id);
                } else {
                    throw new Error("Player not found");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred");
                setLoading(false);
            }
        }

        resolvePlayer();
    }, [playerName]);

    // Second fetch: paginated rounds
    const fetchRounds = useCallback(async () => {
        if (!playerId) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/v1/players/${playerId}/rounds?page=${page}&page_size=20`);
            if (!res.ok) throw new Error("Failed to fetch rounds");
            const data = await res.json();
            if (data.ok) {
                setRounds(data.rounds || []);
                setPagination(data.pagination || null);
            } else {
                throw new Error("API error");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        } finally {
            setLoading(false);
        }
    }, [playerId, page]);

    useEffect(() => {
        fetchRounds();
    }, [fetchRounds]);

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    const getResultBadge = (round: RoundHistoryItem) => {
        if (round.winner_team === 0 || round.team == null) return null;
        const won = round.team === round.winner_team;
        return (
            <span className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded",
                won ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-400"
            )}>
                {won ? "W" : "L"}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href={`/player/${encodeURIComponent(playerName || "")}`}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                        Round History
                    </h1>
                    <p className="text-muted-foreground">
                        All battles for {playerName}
                        {pagination && <span className="ml-1">({pagination.total_rounds} rounds)</span>}
                    </p>
                </div>
            </div>

            <Card className="border-border/60">
                <CardHeader>
                    <CardTitle>Battle Log</CardTitle>
                    <CardDescription>Complete round history with stats.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12 text-muted-foreground">
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading rounds...
                        </div>
                    ) : rounds.length > 0 ? (
                        <>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[40px]"></TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Map / Server</TableHead>
                                            <TableHead className="text-center">Score</TableHead>
                                            <TableHead className="text-center">K / D</TableHead>
                                            <TableHead className="text-center">KPM</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {rounds.map((round) => {
                                            const kd = round.final_deaths > 0
                                                ? (round.final_kills / round.final_deaths).toFixed(1)
                                                : round.final_kills.toFixed(1);

                                            return (
                                                <TableRow key={round.round_id} className="group">
                                                    <TableCell>{getResultBadge(round)}</TableCell>
                                                    <TableCell className="whitespace-nowrap">
                                                        <div className="font-medium text-sm">
                                                            {new Date(round.end_time).toLocaleDateString()}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {new Date(round.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-medium text-sm">{round.map_name}</div>
                                                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                                            <Server className="h-3 w-3" />
                                                            {round.server_name}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center font-bold tabular-nums">{round.final_score.toLocaleString()}</TableCell>
                                                    <TableCell className="text-center">
                                                        <span className="text-green-500 font-semibold tabular-nums">{round.final_kills}</span>
                                                        <span className="text-muted-foreground mx-1">/</span>
                                                        <span className="text-red-400 font-semibold tabular-nums">{round.final_deaths}</span>
                                                        <span className="text-xs text-muted-foreground ml-1.5">({kd})</span>
                                                    </TableCell>
                                                    <TableCell className="text-center tabular-nums text-sm">
                                                        {round.kills_per_minute?.toFixed(1) ?? "—"}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm" asChild>
                                                            <Link href={`/stats/rounds/${round.round_id}`}>
                                                                View
                                                            </Link>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {pagination && pagination.total_pages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={page <= 1}
                                        onClick={() => setPage(page - 1)}
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                                    </Button>
                                    <span className="text-sm text-muted-foreground">
                                        Page {page} of {pagination.total_pages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={page >= pagination.total_pages}
                                        onClick={() => setPage(page + 1)}
                                    >
                                        Next <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                            <p>No round history found.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
