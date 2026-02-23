"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Loader2,
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Search,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
} from "lucide-react";
import Link from "next/link";

interface Round {
    round_id: number;
    map_name: string;
    start_time: string;
    end_time: string;
    duration_seconds: number;
    player_count: number;
    is_ranked: boolean;
    gamemode: string;
}

interface Pagination {
    page: number;
    page_size: number;
    total_rounds: number;
    total_pages: number;
}

type SortField = "end_time" | "duration_seconds" | "player_count" | "map_name";
type SortDir = "asc" | "desc";

export default function ServerRoundsPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [serverName, setServerName] = useState<string>("");
    const [serverId, setServerId] = useState<number | null>(null);
    const [allRounds, setAllRounds] = useState<Round[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeSearch, setActiveSearch] = useState("");
    const [sortField, setSortField] = useState<SortField>("end_time");
    const [sortDir, setSortDir] = useState<SortDir>("desc");
    const pageSize = 25;

    // Resolve server
    useEffect(() => {
        async function resolve() {
            try {
                const res = await fetch(`/api/v1/servers/search?search=${slug}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.ok && data.server_info) {
                        setServerId(data.server_info.server_id);
                        setServerName(data.server_info.current_server_name || slug);
                    }
                }
            } catch (e) {
                console.error("Failed to resolve server", e);
            }
        }
        resolve();
    }, [slug]);

    // Fetch rounds
    const fetchRounds = useCallback(async () => {
        if (!serverId) return;
        setLoading(true);
        try {
            const res = await fetch(
                `/api/v1/servers/search/rounds?search=${serverId}&page=${page}&page_size=${pageSize}`
            );
            if (res.ok) {
                const data = await res.json();
                if (data.ok) {
                    setAllRounds(data.rounds || []);
                    setPagination(data.pagination || null);
                }
            }
        } catch (e) {
            console.error("Failed to fetch rounds", e);
        } finally {
            setLoading(false);
        }
    }, [serverId, page]);

    useEffect(() => {
        fetchRounds();
    }, [fetchRounds]);

    // Client-side filter and sort
    const filtered = allRounds
        .filter((r) => {
            if (!activeSearch) return true;
            const q = activeSearch.toLowerCase();
            return (
                r.map_name.toLowerCase().includes(q) ||
                r.gamemode?.toLowerCase().includes(q) ||
                String(r.round_id).includes(q)
            );
        })
        .sort((a, b) => {
            const dir = sortDir === "asc" ? 1 : -1;
            if (sortField === "map_name") {
                return dir * a.map_name.localeCompare(b.map_name);
            }
            if (sortField === "end_time") {
                return dir * (new Date(a.end_time).getTime() - new Date(b.end_time).getTime());
            }
            const aVal = (a as any)[sortField] ?? 0;
            const bVal = (b as any)[sortField] ?? 0;
            return dir * (aVal - bVal);
        });

    function handleSort(field: SortField) {
        if (sortField === field) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDir(field === "map_name" ? "asc" : "desc");
        }
    }

    function SortIcon({ field }: { field: SortField }) {
        if (sortField !== field) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-40" />;
        return sortDir === "asc"
            ? <ArrowUp className="h-3 w-3 ml-1" />
            : <ArrowDown className="h-3 w-3 ml-1" />;
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        setActiveSearch(searchQuery);
    }

    return (
        <div className="container py-6 md:py-10 space-y-6 max-w-6xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href={`/servers/${slug}`}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Round History</h1>
                    <p className="text-muted-foreground">
                        {serverName}
                        {pagination && (
                            <span className="ml-1">— {pagination.total_rounds.toLocaleString()} total rounds</span>
                        )}
                    </p>
                </div>
            </div>

            <Card className="border-border/60">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <CardTitle>All Rounds</CardTitle>
                        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full sm:w-auto">
                            <Input
                                placeholder="Filter by map, mode, or ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-[250px]"
                            />
                            <Button type="submit" size="icon" variant="outline">
                                <Search className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12 text-muted-foreground">
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading rounds...
                        </div>
                    ) : filtered.length > 0 ? (
                        <>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[80px]">ID</TableHead>
                                            <TableHead>
                                                <button onClick={() => handleSort("map_name")} className="flex items-center hover:text-foreground transition-colors">
                                                    Map <SortIcon field="map_name" />
                                                </button>
                                            </TableHead>
                                            <TableHead>Mode</TableHead>
                                            <TableHead>
                                                <button onClick={() => handleSort("end_time")} className="flex items-center hover:text-foreground transition-colors">
                                                    Date <SortIcon field="end_time" />
                                                </button>
                                            </TableHead>
                                            <TableHead className="text-right">
                                                <button onClick={() => handleSort("duration_seconds")} className="flex items-center justify-end hover:text-foreground transition-colors w-full">
                                                    Duration <SortIcon field="duration_seconds" />
                                                </button>
                                            </TableHead>
                                            <TableHead className="text-right">
                                                <button onClick={() => handleSort("player_count")} className="flex items-center justify-end hover:text-foreground transition-colors w-full">
                                                    Players <SortIcon field="player_count" />
                                                </button>
                                            </TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filtered.map((round) => (
                                            <TableRow key={round.round_id}>
                                                <TableCell className="font-mono text-xs text-muted-foreground">{round.round_id}</TableCell>
                                                <TableCell className="font-medium">{round.map_name}</TableCell>
                                                <TableCell className="text-sm text-muted-foreground">{round.gamemode || "—"}</TableCell>
                                                <TableCell className="whitespace-nowrap">
                                                    <div className="text-sm">{new Date(round.end_time).toLocaleDateString()}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {new Date(round.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {round.duration_seconds
                                                        ? `${Math.floor(round.duration_seconds / 60)}m ${round.duration_seconds % 60}s`
                                                        : "—"}
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">{round.player_count}</TableCell>
                                                <TableCell>
                                                    {round.is_ranked === false ? (
                                                        <Link href="/rank-system#ranked-unranked">
                                                            <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20 hover:bg-orange-500/20 transition-colors cursor-pointer">UNRANKED</span>
                                                        </Link>
                                                    ) : (
                                                        <Link href="/rank-system#ranked-unranked">
                                                            <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20 hover:bg-green-500/20 transition-colors cursor-pointer">RANKED</span>
                                                        </Link>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/stats/rounds/${round.round_id}`}>View</Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {pagination && pagination.total_pages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-4">
                                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                                        <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                                    </Button>
                                    <span className="text-sm text-muted-foreground">
                                        Page {page} of {pagination.total_pages}
                                    </span>
                                    <Button variant="outline" size="sm" disabled={page >= pagination.total_pages} onClick={() => setPage(page + 1)}>
                                        Next <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="p-8 text-center text-muted-foreground">
                            {activeSearch ? "No rounds match your filter." : "No rounds found."}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
