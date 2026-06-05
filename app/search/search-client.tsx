"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, Loader2, User, Search, ChevronLeft, ChevronRight, Clock, Map, Users, Server, Filter, Calendar, Swords, X, ArrowRightLeft, XCircle, Scale, ChevronDown, ChevronUp, Shield, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PlayerSearchAutocomplete, PlayerSearchResult } from "@/components/player-search-autocomplete";
import { ComparisonView } from "@/components/comparison-view";
import { trackEvent } from "@/lib/analytics";

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
                    trackEvent("search_player", { query, result_count: data.players.length });
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
                <Card className="border-border/60 bg-card/40">
                    <CardContent className="py-12 flex flex-col items-center text-center">
                        <div className="rounded-full bg-muted/50 p-4 mb-4">
                            <User className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No Players Found</h3>
                        <p className="text-sm text-muted-foreground max-w-sm">
                            No players match "{query}". Try adjusting your search or check the spelling.
                        </p>
                    </CardContent>
                </Card>
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

const SELECT_CLS = "h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

const KNOWN_MAPS = [
    "Wake Island", "Guadalcanal", "Iwo Jima", "Coral Sea",
    "Stalingrad", "Kursk", "Kharkov", "Berlin",
    "El Alamein", "Gazala", "Tobruk", "Operation Battleaxe",
    "Omaha Beach", "Battle of the Bulge", "Market Garden",
    "Bocage", "Caen", "Invasion of the Philippines",
    "Battle of Midway", "Siege of Tobruk",
    "Liberation of Caen", "Fall of Tobruk",
];

const DURATION_OPTIONS = [
    { value: "", label: "Any" },
    { value: "5", label: "5 min" },
    { value: "10", label: "10 min" },
    { value: "15", label: "15 min" },
    { value: "20", label: "20 min" },
    { value: "30", label: "30 min" },
    { value: "45", label: "45 min" },
    { value: "60", label: "1 hour" },
];

function RoundsTab() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [rounds, setRounds] = useState<Round[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalRounds, setTotalRounds] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Read all filters from URL
    const page           = parseInt(searchParams.get("page") || "1");
    const serverQuery    = searchParams.get("server") || "";
    const mapFilter      = searchParams.get("map") || "";
    const daysFilter     = searchParams.get("days") || "7";
    const minPlayers     = searchParams.get("min_players") || "";
    const maxPlayers     = searchParams.get("max_players") || "";
    const dateFrom       = searchParams.get("date_from") || "";
    const dateTo         = searchParams.get("date_to") || "";
    const minDuration    = searchParams.get("min_duration") || "";
    const maxDuration    = searchParams.get("max_duration") || "";
    const winnerTeam     = searchParams.get("winner_team") || "";
    const gamemodeFilter = searchParams.get("gamemode") || "";

    // Local form state (committed to URL on Search)
    const [serverInput, setServerInput] = useState(serverQuery);
    const [mapInput, setMapInput]       = useState(mapFilter);

    // Show advanced panel if any advanced filter is active
    useEffect(() => {
        if (dateFrom || dateTo || minDuration || maxDuration || maxPlayers || winnerTeam || gamemodeFilter) {
            setShowAdvanced(true);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const updateFilters = useCallback((newParams: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", "rounds");
        Object.entries(newParams).forEach(([key, value]) => {
            if (value) params.set(key, value);
            else params.delete(key);
        });
        if (!("page" in newParams)) params.set("page", "1");
        router.push(`/search?${params.toString()}`);
    }, [searchParams, router]);

    useEffect(() => {
        async function fetchRounds() {
            setLoading(true);
            try {
                const q = new URLSearchParams();
                q.set("page", page.toString());
                q.set("page_size", "12");

                // Date range takes precedence over days shortcut
                if (dateFrom || dateTo) {
                    if (dateFrom) q.set("date_from", dateFrom);
                    if (dateTo)   q.set("date_to",   dateTo);
                } else {
                    q.set("days", daysFilter);
                }

                if (serverQuery)    q.set("server_name",   serverQuery);
                if (mapFilter)      q.set("map_name",      mapFilter);
                if (minPlayers)     q.set("min_players",   minPlayers);
                if (maxPlayers)     q.set("max_players",   maxPlayers);
                if (winnerTeam)     q.set("winner_team",   winnerTeam);
                if (gamemodeFilter) q.set("gamemode",      gamemodeFilter);
                // Duration is in minutes in UI; API expects seconds
                if (minDuration)    q.set("min_duration",  String(parseInt(minDuration) * 60));
                if (maxDuration)    q.set("max_duration",  String(parseInt(maxDuration) * 60));

                const res = await fetch(`/api/v1/rounds/browse?${q.toString()}`);
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
    }, [page, serverQuery, mapFilter, daysFilter, minPlayers, maxPlayers, dateFrom, dateTo, minDuration, maxDuration, winnerTeam, gamemodeFilter]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateFilters({ server: serverInput, map: mapInput });
    };

    const clearFilters = () => {
        setServerInput("");
        setMapInput("");
        router.push("/search?tab=rounds");
    };

    const hasAdvancedFilters = dateFrom || dateTo || minDuration || maxDuration || maxPlayers || winnerTeam || gamemodeFilter;
    const hasActiveFilters   = serverQuery || mapFilter || minPlayers || daysFilter !== "7" || hasAdvancedFilters;

    // Active filter pills for quick visual summary
    const filterPills: { label: string; key: string }[] = [
        ...(serverQuery    ? [{ label: `Server: ${serverQuery}`,    key: "server"      }] : []),
        ...(mapFilter      ? [{ label: `Map: ${mapFilter}`,         key: "map"         }] : []),
        ...(winnerTeam     ? [{ label: winnerTeam === "1" ? "Winner: Axis" : winnerTeam === "2" ? "Winner: Allies" : "Winner: Draw", key: "winner_team" }] : []),
        ...(gamemodeFilter ? [{ label: `Mode: ${gamemodeFilter}`,   key: "gamemode"    }] : []),
        ...(minPlayers     ? [{ label: `${minPlayers}+ players`,    key: "min_players" }] : []),
        ...(maxPlayers     ? [{ label: `≤${maxPlayers} players`,    key: "max_players" }] : []),
        ...(minDuration    ? [{ label: `≥${minDuration}m duration`, key: "min_duration"}] : []),
        ...(maxDuration    ? [{ label: `≤${maxDuration}m duration`, key: "max_duration"}] : []),
        ...(dateFrom       ? [{ label: `From: ${dateFrom}`,         key: "date_from"   }] : []),
        ...(dateTo         ? [{ label: `To: ${dateTo}`,             key: "date_to"     }] : []),
    ];

    return (
        <div className="space-y-6">
            <Card className="border-border/60">
                <CardContent className="p-4 space-y-4">
                    {/* Primary search row */}
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
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
                        <div className="relative flex-1 sm:max-w-[220px]">
                            <Map className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Filter by map..."
                                className="pl-9"
                                value={mapInput}
                                onChange={(e) => setMapInput(e.target.value)}
                                list="map-suggestions"
                            />
                            <datalist id="map-suggestions">
                                {KNOWN_MAPS.map(m => <option key={m} value={m} />)}
                            </datalist>
                        </div>
                        <Button type="submit" className="shrink-0">
                            <Search className="h-4 w-4 mr-2" />
                            Search
                        </Button>
                    </form>

                    {/* Quick filters row */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground shrink-0">
                            <Filter className="h-3.5 w-3.5" />
                            <span>Quick:</span>
                        </div>

                        {/* Days shortcut — hidden when date range is active */}
                        {!dateFrom && !dateTo && (
                            <select
                                value={daysFilter}
                                onChange={(e) => updateFilters({ days: e.target.value })}
                                className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                <option value="1">Last 24 hours</option>
                                <option value="7">Last 7 days</option>
                                <option value="30">Last 30 days</option>
                                <option value="90">Last 90 days</option>
                                <option value="365">Last year</option>
                                <option value="9999">All time</option>
                            </select>
                        )}
                        {(dateFrom || dateTo) && (
                            <span className="inline-flex items-center gap-1.5 text-xs bg-primary/10 text-primary border border-primary/20 rounded-md px-2.5 h-9">
                                <Calendar className="h-3 w-3" />
                                Custom date range
                                <button type="button" onClick={() => updateFilters({ date_from: "", date_to: "", days: "7" })} className="ml-1 hover:text-destructive">
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        )}

                        <select
                            value={minPlayers}
                            onChange={(e) => updateFilters({ min_players: e.target.value })}
                            className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            <option value="">Any players</option>
                            <option value="5">5+ players</option>
                            <option value="10">10+ players</option>
                            <option value="20">20+ players</option>
                            <option value="32">32+ players</option>
                            <option value="48">48+ players</option>
                        </select>

                        <button
                            type="button"
                            onClick={() => setShowAdvanced(v => !v)}
                            className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-md border text-sm transition-colors ${showAdvanced || hasAdvancedFilters ? "border-primary/40 bg-primary/10 text-primary" : "border-input bg-background text-muted-foreground hover:text-foreground"}`}
                        >
                            <Filter className="h-3.5 w-3.5" />
                            Advanced
                            {hasAdvancedFilters && <span className="bg-primary text-primary-foreground rounded-full h-4 w-4 text-[10px] flex items-center justify-center font-bold">{filterPills.filter(p => ["winner_team","gamemode","max_players","min_duration","max_duration","date_from","date_to"].includes(p.key)).length}</span>}
                            {showAdvanced ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        </button>

                        {hasActiveFilters && (
                            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground h-9">
                                <X className="h-4 w-4 mr-1" />
                                Clear all
                            </Button>
                        )}
                    </div>

                    {/* Advanced filters panel */}
                    {showAdvanced && (
                        <div className="border-t border-border/60 pt-4 space-y-4">
                            {/* Date range */}
                            <div className="space-y-1.5">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5" />
                                    Date Range
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-xs text-muted-foreground">From</label>
                                        <Input
                                            type="date"
                                            value={dateFrom}
                                            max={dateTo || undefined}
                                            onChange={(e) => updateFilters({ date_from: e.target.value, days: "" })}
                                            className="h-9 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-muted-foreground">To</label>
                                        <Input
                                            type="date"
                                            value={dateTo}
                                            min={dateFrom || undefined}
                                            onChange={(e) => updateFilters({ date_to: e.target.value, days: "" })}
                                            className="h-9 text-sm"
                                        />
                                    </div>
                                </div>
                                {/* Quick date shortcuts */}
                                <div className="flex flex-wrap gap-1.5 pt-0.5">
                                    {[
                                        { label: "Today", from: new Date().toISOString().slice(0,10), to: new Date().toISOString().slice(0,10) },
                                        { label: "This week", from: new Date(Date.now()-6*86400000).toISOString().slice(0,10), to: new Date().toISOString().slice(0,10) },
                                        { label: "This month", from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0,10), to: new Date().toISOString().slice(0,10) },
                                        { label: "Last month", from: new Date(new Date().getFullYear(), new Date().getMonth()-1, 1).toISOString().slice(0,10), to: new Date(new Date().getFullYear(), new Date().getMonth(), 0).toISOString().slice(0,10) },
                                    ].map(preset => (
                                        <button
                                            key={preset.label}
                                            type="button"
                                            onClick={() => updateFilters({ date_from: preset.from, date_to: preset.to, days: "" })}
                                            className="text-xs px-2 py-1 rounded border border-border/60 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {preset.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Duration + Players */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock className="h-3 w-3" /> Min duration
                                    </label>
                                    <select
                                        value={minDuration}
                                        onChange={(e) => updateFilters({ min_duration: e.target.value })}
                                        className={SELECT_CLS}
                                    >
                                        {DURATION_OPTIONS.map(o => (
                                            <option key={o.value} value={o.value} disabled={maxDuration ? parseInt(o.value || "0") >= parseInt(maxDuration) : false}>
                                                {o.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock className="h-3 w-3" /> Max duration
                                    </label>
                                    <select
                                        value={maxDuration}
                                        onChange={(e) => updateFilters({ max_duration: e.target.value })}
                                        className={SELECT_CLS}
                                    >
                                        {DURATION_OPTIONS.map(o => (
                                            <option key={o.value} value={o.value} disabled={minDuration ? parseInt(o.value || "999") <= parseInt(minDuration) : false}>
                                                {o.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Users className="h-3 w-3" /> Max players
                                    </label>
                                    <select
                                        value={maxPlayers}
                                        onChange={(e) => updateFilters({ max_players: e.target.value })}
                                        className={SELECT_CLS}
                                    >
                                        <option value="">Any</option>
                                        <option value="10">≤ 10</option>
                                        <option value="20">≤ 20</option>
                                        <option value="32">≤ 32</option>
                                        <option value="48">≤ 48</option>
                                        <option value="64">≤ 64</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Users className="h-3 w-3" /> Min players
                                    </label>
                                    <select
                                        value={minPlayers}
                                        onChange={(e) => updateFilters({ min_players: e.target.value })}
                                        className={SELECT_CLS}
                                    >
                                        <option value="">Any</option>
                                        <option value="5">5+</option>
                                        <option value="10">10+</option>
                                        <option value="20">20+</option>
                                        <option value="32">32+</option>
                                        <option value="48">48+</option>
                                    </select>
                                </div>
                            </div>

                            {/* Winner + Gamemode */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Trophy className="h-3 w-3" /> Winner
                                    </label>
                                    <select
                                        value={winnerTeam}
                                        onChange={(e) => updateFilters({ winner_team: e.target.value })}
                                        className={SELECT_CLS}
                                    >
                                        <option value="">Any outcome</option>
                                        <option value="1">Axis win</option>
                                        <option value="2">Allies win</option>
                                        <option value="0">Draw</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Shield className="h-3 w-3" /> Game mode
                                    </label>
                                    <select
                                        value={gamemodeFilter}
                                        onChange={(e) => updateFilters({ gamemode: e.target.value })}
                                        className={SELECT_CLS}
                                    >
                                        <option value="">Any mode</option>
                                        <option value="conquest">Conquest</option>
                                        <option value="ctf">Capture the Flag</option>
                                        <option value="tdm">Team Deathmatch</option>
                                        <option value="coop">Co-op</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Active filter pills */}
            {filterPills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {filterPills.map(pill => (
                        <span key={pill.key} className="inline-flex items-center gap-1.5 text-xs bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-1">
                            {pill.label}
                            <button type="button" onClick={() => updateFilters({ [pill.key]: "" })} className="hover:text-destructive">
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {!loading && (
                <div className="text-sm text-muted-foreground">
                    {totalRounds.toLocaleString()} round{totalRounds !== 1 ? "s" : ""} found
                    {serverQuery && <span className="ml-1">on "{serverQuery}"</span>}
                    {mapFilter && <span className="ml-1">· map "{mapFilter}"</span>}
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
                            <Button variant="outline" size="sm" onClick={() => updateFilters({ page: String(page - 1) })} disabled={page <= 1}>
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page {page} of {totalPages}
                            </span>
                            <Button variant="outline" size="sm" onClick={() => updateFilters({ page: String(page + 1) })} disabled={page >= totalPages}>
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
                    <p className="text-sm mt-1">Try adjusting your filters.</p>
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

    useEffect(() => {
        if (player1 && player2) {
            trackEvent("search_compare", { player1: player1.last_known_name, player2: player2.last_known_name });
        }
    }, [player1, player2]);

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
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-[#0d1208] via-[#0a0f06] to-[#060a04] p-6 sm:p-8 shadow-2xl">
                {/* Amber rim light */}
                <div className="pointer-events-none absolute -top-12 right-0 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(101,163,13,0.18),transparent_65%)]" />
                {/* Soft white glow */}
                <div className="pointer-events-none absolute -bottom-12 left-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.04),transparent_65%)]" />
                {/* Film grain */}
                <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "3px 3px" }} />

                <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-in-up">
                        <div className="rounded-xl bg-lime-500/20 p-3">
                            <Search className="h-8 w-8 text-lime-400" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                                    Search & Browse
                                </h1>
                                <Badge className="bg-lime-500/20 text-lime-400 border-lime-500/30 text-xs">
                                    Explore
                                </Badge>
                            </div>
                            <p className="text-sm text-zinc-400 mt-1">
                                Find players, browse round history, and compare stats side-by-side
                            </p>
                        </div>
                    </div>
                </div>
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
