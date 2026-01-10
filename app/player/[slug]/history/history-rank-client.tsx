"use client";

import { useEffect, useState } from "react";
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
import { Loader2, AlertTriangle, ArrowLeft, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface RankHistoryItem {
    timestamp: string;
    map_name: string;
    server_name: string;
    round_stats: {
        kills: number;
        deaths: number;
        score: number;
    };
    total_score_after: number;
    points_earned: number;
    rank_label_after: string;
}

interface RankHistoryResponse {
    ok: boolean;
    player: string;
    history: RankHistoryItem[];
}

export default function HistoryRankClient() {
    const params = useParams();
    const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;
    const playerName = slug ? decodeURIComponent(slug) : undefined;

    const [history, setHistory] = useState<RankHistoryItem[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!playerName) {
            setError("Invalid player name in URL.");
            setLoading(false);
            return;
        }

        async function fetchHistory() {
            try {
                const response = await fetch(`/api/v1/players/search/history_rank?name=${playerName}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch history data: ${response.statusText}`);
                }
                const data: RankHistoryResponse = await response.json();
                if (data.ok) {
                    setHistory(data.history);
                } else {
                    throw new Error("API returned an error");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred");
            } finally {
                setLoading(false);
            }
        }

        fetchHistory();
    }, [playerName]);

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <p>Loading rank history...</p>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href={`/player/${playerName}`}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                        Rank History
                    </h1>
                    <p className="text-muted-foreground">
                        Progression log for {playerName}
                    </p>
                </div>
            </div>

            <Card className="border-border/60">
                <CardHeader>
                    <CardTitle>History Log</CardTitle>
                    <CardDescription>Detailed record of rank changes and round performance.</CardDescription>
                </CardHeader>
                <CardContent>
                    {history && history.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Server / Map</TableHead>
                                    <TableHead className="text-center">Rank (After)</TableHead>
                                    <TableHead className="text-center">Round Stats</TableHead>
                                    <TableHead className="text-right">Points Earned</TableHead>
                                    <TableHead className="text-right">Total Score</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {history.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="whitespace-nowrap font-medium">
                                            {new Date(item.timestamp).toLocaleDateString()}
                                            <span className="block text-xs text-muted-foreground">
                                                {new Date(item.timestamp).toLocaleTimeString()}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{item.map_name}</div>
                                            <div className="text-xs text-muted-foreground">{item.server_name}</div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="secondary" className="font-mono text-xs">
                                                {item.rank_label_after.split('(')[1]?.replace(')', '') || item.rank_label_after}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center text-xs">
                                            <div>K: {item.round_stats.kills}</div>
                                            <div>D: {item.round_stats.deaths}</div>
                                            <div>S: {item.round_stats.score}</div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <span className={`flex items-center justify-end gap-1 font-bold ${item.points_earned > 0 ? "text-green-500" :
                                                    item.points_earned < 0 ? "text-red-500" : "text-muted-foreground"
                                                }`}>
                                                {item.points_earned > 0 ? <TrendingUp className="h-3 w-3" /> :
                                                    item.points_earned < 0 ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                                                {item.points_earned > 0 ? "+" : ""}{item.points_earned}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-muted-foreground">
                                            {item.total_score_after.toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                            <p>No rank history found.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
