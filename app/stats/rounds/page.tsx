"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Search, AlertTriangle, ChevronLeft, ChevronRight, Trophy, Clock } from "lucide-react";

interface Round {
    round_id: number;
    map_name: string;
    start_time: string;
    end_time: string;
    duration_seconds: number;
    player_count: number;
}

interface ServerInfo {
    server_id: number;
    current_server_name: string;
}

interface RoundsResponse {
    ok: boolean;
    server_info?: ServerInfo;
    pagination: {
        page: number;
        page_size: number;
        total_rounds: number;
        total_pages: number;
    };
    rounds: Round[];
}

interface GlobalRound {
    round_id: number;
    map_name: string;
    end_time: string;
    current_server_name: string;
}

interface ScoreDelta {
    server_ip: string;
    server_port: number;
    map_name: string;
    timestamp: string;
    tickets1: number;
    tickets2: number;
    delta: number;
}

interface GlobalMetricsResponse {
    ok: boolean;
    last_5_rounds: GlobalRound[];
    largest_score_delta_24h: ScoreDelta[];
}

function RoundsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [data, setData] = useState<RoundsResponse | null>(null);
    const [loading, setLoading] = useState(false); // Don't load search results initially if no search
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

    const [globalMetrics, setGlobalMetrics] = useState<GlobalMetricsResponse | null>(null);
    const [globalMetricsLoading, setGlobalMetricsLoading] = useState(true);

    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";

    // Fetch Global Metrics
    useEffect(() => {
        async function fetchGlobalMetrics() {
            try {
                const res = await fetch("/api/v1/metrics/global/rounds");
                if (res.ok) {
                    const json = await res.json();
                    if (json.ok) {
                        setGlobalMetrics(json);
                    }
                }
            } catch (e) {
                console.error("Failed to fetch global metrics", e);
            } finally {
                setGlobalMetricsLoading(false);
            }
        }
        fetchGlobalMetrics();
    }, []);

    // Fetch Search Results
    useEffect(() => {
        async function fetchRounds() {
            if (!search) {
                setData(null);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const queryParams = new URLSearchParams();
                queryParams.set("search", search);
                queryParams.set("page", page.toString());
                queryParams.set("page_size", "10");

                const res = await fetch(`/api/v1/servers/search/rounds?${queryParams.toString()}`);
                if (!res.ok) throw new Error("Failed to fetch rounds");
                const jsonData: RoundsResponse = await res.json();
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
        fetchRounds();
    }, [page, search]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        if (searchTerm) {
            params.set("search", searchTerm);
        } else {
            params.delete("search");
        }
        params.set("page", "1"); // Reset to page 1 on new search
        router.push(`/stats/rounds?${params.toString()}`);
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage.toString());
        router.push(`/stats/rounds?${params.toString()}`);
    };

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">Rounds History</h1>
                <p className="mt-1 text-muted-foreground">Browse and search past game rounds.</p>
            </div>

            {/* Search Bar */}
            <Card className="border-border/60">
                <CardContent className="pt-6">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search by Server Name..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button type="submit">Search</Button>
                    </form>
                </CardContent>
            </Card>

            {/* Global Metrics / Recent Rounds */}
            {!search && (
                <div className="space-y-6">
                    {globalMetricsLoading ? (
                        <div className="flex items-center justify-center p-8 text-muted-foreground">
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading recent activity...
                        </div>
                    ) : globalMetrics ? (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Recent Rounds */}
                            <Card className="border-border/60">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-primary" />
                                        Recently Completed Rounds
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {globalMetrics.last_5_rounds.map((round) => (
                                            <Link
                                                key={round.round_id}
                                                href={`/stats/rounds/${round.round_id}`}
                                                className="block rounded-lg border border-border/40 bg-card/50 p-3 transition-colors hover:bg-accent/50"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium text-foreground">{round.map_name}</span>
                                                    <span className="text-xs text-muted-foreground">{new Date(round.end_time).toLocaleTimeString()}</span>
                                                </div>
                                                <div className="mt-1 text-sm text-muted-foreground truncate">
                                                    {round.current_server_name}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Largest Score Deltas */}
                            <Card className="border-border/60">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Trophy className="h-5 w-5 text-yellow-500" />
                                        Biggest Wins (24h)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {globalMetrics.largest_score_delta_24h.slice(0, 5).map((delta, i) => (
                                            <div key={i} className="rounded-lg border border-border/40 bg-card/50 p-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium text-foreground">{delta.map_name}</span>
                                                    <span className="text-sm font-bold text-green-500">+{delta.delta} Tickets</span>
                                                </div>
                                                <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
                                                    <span>{delta.tickets1} vs {delta.tickets2}</span>
                                                    <span className="text-xs">{new Date(delta.timestamp).toLocaleTimeString()}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : null}
                </div>
            )}

            {/* Search Results */}
            {loading ? (
                <div className="flex min-h-[200px] items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <p>Loading rounds...</p>
                </div>
            ) : error ? (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            ) : data ? (
                <div className="space-y-4">
                    {data.server_info && (
                        <div className="rounded-md bg-primary/10 p-4 text-primary">
                            Showing rounds for server: <span className="font-semibold">{data.server_info.current_server_name}</span>
                        </div>
                    )}

                    <div className="rounded-md border border-border/60">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Map</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead className="text-right">Players</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.rounds.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            No rounds found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data.rounds.map((round) => (
                                        <TableRow
                                            key={round.round_id}
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() => router.push(`/stats/rounds/${round.round_id}`)}
                                        >
                                            <TableCell className="font-medium">{round.map_name}</TableCell>
                                            <TableCell>{new Date(round.start_time).toLocaleString()}</TableCell>
                                            <TableCell>{formatDuration(round.duration_seconds)}</TableCell>
                                            <TableCell className="text-right">{round.player_count}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" asChild onClick={(e) => e.stopPropagation()}>
                                                    <Link href={`/stats/rounds/${round.round_id}`}>View Details</Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {data.pagination.total_pages > 1 && (
                        <div className="flex items-center justify-center gap-2 py-4">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page <= 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page {page} of {data.pagination.total_pages}
                            </span>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page >= data.pagination.total_pages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
}

export default function RoundsPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        }>
            <RoundsContent />
        </Suspense>
    );
}
