"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, Loader2, User, Search, ChevronLeft, ChevronRight, Clock, Map, Users, Server, Filter, Calendar, Swords, X, ArrowRightLeft, XCircle, Scale } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PlayerSearchAutocomplete, PlayerSearchResult } from "@/components/player-search-autocomplete";
import { ComparisonView } from "@/components/comparison-view";

// --- Player Search Types ---
interface PlayerSearchApiResult {
    player_id: number | string;
    last_known_name: string;
}

interface PlayerSearchApiResponse {
    ok: boolean;
    players: PlayerSearchApiResult[];
}

// --- Rounds Types ---
interface Round {
    round_id: number;
    map_name: string;
    start_time: string;
    end_time: string;
    duration_seconds: number;
    player_count: number;
    gamemode?: string;
    winner_team?: number;
    server_id?: number;
    current_server_name?: string;
}

interface RoundsResponse {
    ok: boolean;
    pagination: {
        page: number;
        page_size: number;
        total_rounds: number;
        total_pages: number;
    };
    rounds: Round[];
}

// --- Helpers ---
function formatDuration(seconds: number) {
    if (!seconds || seconds <= 0) return "\u2014";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
}

function getWinnerBadge(winnerTeam: number | undefined) {
    if (winnerTeam === 1) return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30 text-xs">Axis</Badge>;
    if (winnerTeam === 2) return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30 text-xs">Allies</Badge>;
    return null;
}

// --- Player Search Tab ---
function PlayerSearchTab() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams.get("q") || "";
    const [searchInput, setSearchInput] = useState(query);
    const [results, setResults] = useState<PlayerSearchApiResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        if (!query) {
            setResults([]);
            setHasSearched(false);
            return;
        }

        async function fetchPlayers() {
            setLoading(true);
            setError(null);
            setHasSearched(true);
            try {
                const response = await fetch(`/api/v1/players/search?name=${encodeURIComponent(query)}`);
                if (!response.ok) throw new Error("Failed to fetch players");
                const data: PlayerSearchApiResponse = await response.json();
                if (data.ok) {
                    setResults(data.players);
                } else {
                    setResults([]);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred");
            } finally {
                setLoading(false);
            }
        }

        fetchPlayers();
    }, [query]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchInput.trim()) {
            router.push(`/search?tab=players&q=${encodeURIComponent(searchInput.trim())}`);
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search for a player by name..."
                        className="pl-9"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                </div>
                <Button type="submit">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                </Button>
            </form>

            {loading && (
                <div className="flex min-h-[200px] items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <p>Searching for "{query}"...</p>
                </div>
            )}

            {error && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {!loading && !error && hasSearched && results.length === 0 && (
                <Alert>
                    <User className="h-4 w-4" />
                    <AlertTitle>No Results</AlertTitle>
                    <AlertDescription>No players found matching "{query}".</AlertDescription>
                </Alert>
            )}

            {!loading && results.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{results.length} player(s) found</p>
                    <div className="flex flex-col gap-2">
                        {results.map((player) => (
                            <Link
                                key={player.player_id}
                                href={`/player/${encodeURIComponent(player.last_known_name)}`}
                                className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/40 p-4 transition-colors hover:bg-accent"
                            >
                                <div className="rounded-full bg-primary/10 p-2 text-primary">
                                    <User className="h-4 w-4" />
                                </div>
                                <span className="font-medium text-foreground">{player.last_known_name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {!loading && !hasSearched && (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <User className="h-12 w-12 mb-4 opacity-30" />
                    <p className="text-sm">Enter a player name above to search.</p>
                </div>
            )}
        </div>
    );
}

// --- Rounds Tab ---
function RoundCard({ round }: { round: Round }) {
    const router = useRouter();

    return (
        <div
            onClick={() => router.push(`/stats/rounds/${round.round_id}`)}
            className="group cursor-pointer rounded-xl border border-border/60 bg-card/40 p-4 transition-all hover:border-primary/40 hover:bg-card/60 hover:shadow-lg"
        >
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <Map className="h-4 w-4 text-primary shrink-0" />
                        <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                            {round.map_name || "Unknown Map"}
                        </h3>
                    </div>
                    {round.current_server_name && (
                        <p className="text-xs text-muted-foreground truncate flex items-center gap-1.5">
                            <Server className="h-3 w-3" />
                            {round.current_server_name}
                        </p>
                    )}
                </div>
                {getWinnerBadge(round.winner_team)}
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>{round.player_count || 0}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatDuration(round.duration_seconds)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(round.end_time).toLocaleDateString()}</span>
                </div>
            </div>

            {round.gamemode && (
                <div className="mt-2 pt-2 border-t border-border/40">
                    <Badge variant="secondary" className="text-xs">
                        {round.gamemode}
                    </Badge>
                </div>
            )}
        </div>
    );
}

function RoundsTab() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [rounds, setRounds] = useState<Round[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalRounds, setTotalRounds] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const page = parseInt(searchParams.get("page") || "1");
    const serverQuery = searchParams.get("server") || "";
    const mapFilter = searchParams.get("map") || "";
    const daysFilter = searchParams.get("days") || "7";
    const minPlayersFilter = searchParams.get("min_players") || "";

    const [serverInput, setServerInput] = useState(serverQuery);
    const [mapInput, setMapInput] = useState(mapFilter);

    const updateFilters = useCallback((newParams: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", "rounds");

        Object.entries(newParams).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });

        if (!('page' in newParams)) {
            params.set("page", "1");
        }

        router.push(`/search?${params.toString()}`);
    }, [searchParams, router]);

    useEffect(() => {
        async function fetchRounds() {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams();
                queryParams.set("page", page.toString());
                queryParams.set("page_size", "12");
                queryParams.set("days", daysFilter);

                if (serverQuery) queryParams.set("server_name", serverQuery);
                if (mapFilter) queryParams.set("map_name", mapFilter);
                if (minPlayersFilter) queryParams.set("min_players", minPlayersFilter);

                const res = await fetch(`/api/v1/rounds/browse?${queryParams.toString()}`);
                if (res.ok) {
                    const data: RoundsResponse = await res.json();
                    if (data.ok) {
                        setRounds(data.rounds);
                        setTotalRounds(data.pagination.total_rounds);
                        setTotalPages(data.pagination.total_pages);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch rounds", err);
            } finally {
                setLoading(false);
            }
        }

        fetchRounds();
    }, [page, serverQuery, mapFilter, daysFilter, minPlayersFilter]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateFilters({ server: serverInput, map: mapInput });
    };

    const clearFilters = () => {
        setServerInput("");
        setMapInput("");
        router.push("/search?tab=rounds");
    };

    const hasActiveFilters = serverQuery || mapFilter || minPlayersFilter || daysFilter !== "7";

    return (
        <div className="space-y-6">
            <Card className="border-border/60">
                <CardContent className="p-4">
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Server className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search by server name..."
                                    className="pl-9"
                                    value={serverInput}
                                    onChange={(e) => setServerInput(e.target.value)}
                                />
                            </div>
                            <div className="relative flex-1 sm:max-w-[200px]">
                                <Map className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Filter by map..."
                                    className="pl-9"
                                    value={mapInput}
                                    onChange={(e) => setMapInput(e.target.value)}
                                />
                            </div>
                            <Button type="submit">
                                <Search className="h-4 w-4 mr-2" />
                                Search
                            </Button>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Filter className="h-4 w-4" />
                                <span>Filters:</span>
                            </div>

                            <select
                                value={daysFilter}
                                onChange={(e) => updateFilters({ days: e.target.value })}
                                className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                <option value="1">Last 24 hours</option>
                                <option value="7">Last 7 days</option>
                                <option value="30">Last 30 days</option>
                                <option value="90">Last 90 days</option>
                            </select>

                            <select
                                value={minPlayersFilter}
                                onChange={(e) => updateFilters({ min_players: e.target.value })}
                                className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                <option value="">Any players</option>
                                <option value="5">5+ players</option>
                                <option value="10">10+ players</option>
                                <option value="20">20+ players</option>
                                <option value="32">32+ players</option>
                            </select>

                            {hasActiveFilters && (
                                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                                    <X className="h-4 w-4 mr-1" />
                                    Clear
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>

            {!loading && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                        {totalRounds.toLocaleString()} rounds found
                        {serverQuery && <span className="ml-1">for "{serverQuery}"</span>}
                        {mapFilter && <span className="ml-1">on "{mapFilter}"</span>}
                    </span>
                </div>
            )}

            {loading ? (
                <div className="flex min-h-[300px] items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <p>Loading rounds...</p>
                </div>
            ) : rounds.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {rounds.map((round) => (
                            <RoundCard key={round.round_id} round={round} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-4 py-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateFilters({ page: String(page - 1) })}
                                disabled={page <= 1}
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page {page} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateFilters({ page: String(page + 1) })}
                                disabled={page >= totalPages}
                            >
                                Next
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <Swords className="h-16 w-16 mb-4 opacity-30" />
                    <p className="font-medium text-lg">No rounds found</p>
                    <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                    {hasActiveFilters && (
                        <Button variant="outline" size="sm" onClick={clearFilters} className="mt-4">
                            Clear all filters
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}

// --- Compare Tab ---
function CompareTab() {
    const [player1, setPlayer1] = useState<PlayerSearchResult | null>(null);
    const [player2, setPlayer2] = useState<PlayerSearchResult | null>(null);

    return (
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <p className="text-muted-foreground">
                    Select two soldiers to compare their combat records side-by-side.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-start">
                <Card className="border-border/60 bg-card/40">
                    <CardContent className="p-6 space-y-4">
                        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-center">
                            Soldier A
                        </div>
                        {player1 ? (
                            <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-300">
                                <div className="text-xl font-bold text-primary">{player1.last_known_name}</div>
                                <Button variant="outline" size="sm" onClick={() => setPlayer1(null)} className="h-8 gap-2">
                                    <XCircle className="h-3.5 w-3.5" /> Change
                                </Button>
                            </div>
                        ) : (
                            <PlayerSearchAutocomplete
                                onSelect={setPlayer1}
                                placeholder="Find soldier..."
                                excludePlayerId={player2?.player_id}
                            />
                        )}
                    </CardContent>
                </Card>

                <div className="flex items-center justify-center py-2 md:py-12">
                    <div className="bg-muted text-muted-foreground font-black text-xl italic px-3 py-1 rounded-md">
                        VS
                    </div>
                </div>

                <Card className="border-border/60 bg-card/40">
                    <CardContent className="p-6 space-y-4">
                        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-center">
                            Soldier B
                        </div>
                        {player2 ? (
                            <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-300">
                                <div className="text-xl font-bold text-red-500">{player2.last_known_name}</div>
                                <Button variant="outline" size="sm" onClick={() => setPlayer2(null)} className="h-8 gap-2">
                                    <XCircle className="h-3.5 w-3.5" /> Change
                                </Button>
                            </div>
                        ) : (
                            <PlayerSearchAutocomplete
                                onSelect={setPlayer2}
                                placeholder="Find opponent..."
                                excludePlayerId={player1?.player_id}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>

            {player1 && player2 ? (
                <div className="mt-8">
                    <ComparisonView player1={player1} player2={player2} />
                </div>
            ) : (
                <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border/50">
                    <Scale className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Select both soldiers above to generate comparison.</p>
                </div>
            )}
        </div>
    );
}

// --- Main Page ---
function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const activeTab = searchParams.get("tab") || "players";

    const handleTabChange = (value: string) => {
        const params = new URLSearchParams();
        params.set("tab", value);
        router.push(`/search?${params.toString()}`);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Search & Browse</h1>
                <p className="mt-1 text-muted-foreground">Find players, browse rounds, and compare stats.</p>
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-md">
                    <TabsTrigger value="players" className="gap-2">
                        <User className="h-4 w-4" />
                        <span className="hidden sm:inline">Players</span>
                    </TabsTrigger>
                    <TabsTrigger value="rounds" className="gap-2">
                        <Swords className="h-4 w-4" />
                        <span className="hidden sm:inline">Rounds</span>
                    </TabsTrigger>
                    <TabsTrigger value="compare" className="gap-2">
                        <ArrowRightLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Compare</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="players" className="mt-6">
                    <PlayerSearchTab />
                </TabsContent>

                <TabsContent value="rounds" className="mt-6">
                    <RoundsTab />
                </TabsContent>

                <TabsContent value="compare" className="mt-6">
                    <CompareTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default function SearchClient() {
    return (
        <Suspense fallback={
            <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
