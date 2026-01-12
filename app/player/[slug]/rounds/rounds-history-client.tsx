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
import { Loader2, AlertTriangle, ArrowLeft, Trophy, Target, Ghost, Server, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface FullRoundHistoryItem {
    round_id: number;
    server_name: string;
    map_name: string;
    end_time: string;
    final_score: number;
    final_kills: number;
    final_deaths: number;
    winning_team: number; // 0=Draw, 1=Axis, 2=Allied
    player_team: number;
}

// Re-using the profile response structure since we'll likely fetch the main profile 
// (or a dedicated history endpoint if one exists, but profile has recent_rounds).
// Note: The main profile API limits recent_rounds. Ideally we need a paginated endpoint. 
// For now, I'll use the profile endpoint but keep in mind we might might need to
// ask the backend for a full history endpoint later.
// actually, let's check if there is a specific endpoint for rounds history.
// Based on file exploration, there isn't one yet. 
// I will implement this using the profile endpoint for now, but assume it might be limited.
// Wait, the user asked for "full recent round history". 
// If the API only returns limited rounds, I can only show those.
// I will fetch `/api/v1/players/search/profile` for now.

interface PlayerProfileApiResponse {
    ok: boolean;
    player_info: { last_known_name: string };
    recent_rounds: FullRoundHistoryItem[] | null;
}

export default function RoundsHistoryClient() {
    const params = useParams();
    const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;
    const playerName = slug ? decodeURIComponent(slug) : undefined;

    const [rounds, setRounds] = useState<FullRoundHistoryItem[] | null>(null);
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
                // TODO: Swap this with a dedicated full-history endpoint if/when available.
                // Currently using profile endpoint which may be limited.
                const response = await fetch(`/api/v1/players/search/profile?name=${playerName}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch history data: ${response.statusText}`);
                }
                const data: PlayerProfileApiResponse = await response.json();
                if (data.ok) {
                    setRounds(data.recent_rounds);
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
                <p>Loading round history...</p>
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
                        Round History
                    </h1>
                    <p className="text-muted-foreground">
                        Recent battles for {playerName}
                    </p>
                </div>
            </div>

            <Card className="border-border/60">
                <CardHeader>
                    <CardTitle>Battle Log</CardTitle>
                    <CardDescription>Detailed record of recent engagements.</CardDescription>
                </CardHeader>
                <CardContent>
                    {rounds && rounds.length > 0 ? (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date / Time</TableHead>
                                        <TableHead>Server / Map</TableHead>
                                        <TableHead className="text-center">Score</TableHead>
                                        <TableHead className="text-center">K / D</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rounds.map((round) => (
                                        <TableRow key={round.round_id} className="group">
                                            <TableCell className="whitespace-nowrap">
                                                <div className="font-medium">
                                                    {new Date(round.end_time).toLocaleDateString()}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {new Date(round.end_time).toLocaleTimeString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 font-medium">
                                                    {round.map_name}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                                                    <Server className="h-3 w-3" />
                                                    {round.server_name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="font-bold flex items-center justify-center gap-1">
                                                    {round.final_score.toLocaleString()}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-3 text-sm">
                                                    <span className="text-green-500 font-semibold">{round.final_kills} K</span>
                                                    <span className="text-muted-foreground">/</span>
                                                    <span className="text-red-500 font-semibold">{round.final_deaths} D</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/stats/rounds/${round.round_id}`}>
                                                        View Report
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
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
