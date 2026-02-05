"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Medal, Trophy, Target, Crosshair, Hash, Loader2, Star, ChevronLeft, ChevronRight,
  Search, Server, ArrowLeft, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PlayerFlag } from "@/components/player-flag";

interface RankedPlayer {
  player_id: number;
  last_known_name: string;
  iso_country_code: string | null;
  rounds_played: number;
  total_kills: number;
  total_deaths: number;
  total_score: number;
  kdr: number | null;
  rank: number;
  last_seen: string;
}

type StatType = "score" | "kills" | "kdr" | "rounds";

interface ServerRankingsViewProps {
  serverId: number;
  serverName: string;
  slug: string;
}

const STAT_CONFIG = {
  score: {
    label: "Score",
    icon: Star,
    getValue: (p: RankedPlayer) => p.total_score.toLocaleString(),
    getSubValue: (p: RankedPlayer) => `${p.rounds_played} rounds`,
  },
  kills: {
    label: "Kills",
    icon: Target,
    getValue: (p: RankedPlayer) => p.total_kills.toLocaleString(),
    getSubValue: (p: RankedPlayer) => `${p.total_deaths.toLocaleString()} deaths`,
  },
  kdr: {
    label: "K/D Ratio",
    icon: Crosshair,
    getValue: (p: RankedPlayer) => p.kdr?.toFixed(2) || "—",
    getSubValue: (p: RankedPlayer) => `${p.total_kills}K / ${p.total_deaths}D`,
  },
  rounds: {
    label: "Rounds",
    icon: Hash,
    getValue: (p: RankedPlayer) => p.rounds_played.toString(),
    getSubValue: (p: RankedPlayer) => `${p.total_score.toLocaleString()} pts`,
  },
};

const PAGE_SIZE = 25;

export function ServerRankingsView({ serverId, serverName, slug }: ServerRankingsViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [stat, setStat] = useState<StatType>((searchParams.get("stat") as StatType) || "score");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));
  const [playerSearch, setPlayerSearch] = useState(searchParams.get("player") || "");
  const [searchInput, setSearchInput] = useState(searchParams.get("player") || "");

  const [rankings, setRankings] = useState<RankedPlayer[]>([]);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update URL params
  const updateUrl = useCallback((newStat: StatType, newPage: number, newPlayer: string) => {
    const params = new URLSearchParams();
    if (newStat !== "score") params.set("stat", newStat);
    if (newPage > 1) params.set("page", newPage.toString());
    if (newPlayer) params.set("player", newPlayer);

    const queryString = params.toString();
    router.push(`/servers/${slug}/rankings${queryString ? `?${queryString}` : ""}`, { scroll: false });
  }, [router, slug]);

  // Fetch rankings
  useEffect(() => {
    async function fetchRankings() {
      setLoading(true);
      setError(null);
      try {
        let url = `/api/v1/servers/search/rankings?search=${serverId}&stat=${stat}&page=${page}&page_size=${PAGE_SIZE}`;
        if (playerSearch) {
          url += `&player_search=${encodeURIComponent(playerSearch)}`;
        }

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.ok) {
            setRankings(data.rankings);
            setTotalPlayers(data.total_players);
            setTotalPages(data.total_pages);
          } else {
            setError("Failed to load rankings");
          }
        } else {
          setError("Failed to load rankings");
        }
      } catch (e) {
        console.error("Failed to fetch rankings", e);
        setError("Failed to load rankings");
      } finally {
        setLoading(false);
      }
    }

    fetchRankings();
  }, [serverId, stat, page, playerSearch]);

  const handleStatChange = (newStat: StatType) => {
    setStat(newStat);
    setPage(1);
    updateUrl(newStat, 1, playerSearch);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateUrl(stat, newPage, playerSearch);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPlayerSearch(searchInput);
    setPage(1);
    updateUrl(stat, 1, searchInput);
  };

  const clearSearch = () => {
    setSearchInput("");
    setPlayerSearch("");
    setPage(1);
    updateUrl(stat, 1, "");
  };

  const config = STAT_CONFIG[stat];
  const StatIcon = config.icon;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href={`/servers/${slug}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Server
          </Link>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Medal className="h-8 w-8 text-amber-500" />
            Player Rankings
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Server className="h-4 w-4" />
            {serverName}
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search player..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 pr-9"
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>
      </div>

      {/* Stats Tabs */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle as="h2" className="text-lg">
              {playerSearch ? (
                <span>
                  Search results for &quot;{playerSearch}&quot;
                  <span className="text-muted-foreground font-normal ml-2">
                    ({totalPlayers} player{totalPlayers !== 1 ? 's' : ''})
                  </span>
                </span>
              ) : (
                <span>
                  Top Players by {config.label}
                  <span className="text-muted-foreground font-normal ml-2">
                    ({totalPlayers.toLocaleString()} total)
                  </span>
                </span>
              )}
            </CardTitle>
            <Tabs value={stat} onValueChange={(v) => handleStatChange(v as StatType)}>
              <TabsList className="h-9">
                <TabsTrigger value="score" className="text-xs gap-1.5 px-3">
                  <Star className="h-3.5 w-3.5" /> Score
                </TabsTrigger>
                <TabsTrigger value="kills" className="text-xs gap-1.5 px-3">
                  <Target className="h-3.5 w-3.5" /> Kills
                </TabsTrigger>
                <TabsTrigger value="kdr" className="text-xs gap-1.5 px-3">
                  <Crosshair className="h-3.5 w-3.5" /> K/D
                </TabsTrigger>
                <TabsTrigger value="rounds" className="text-xs gap-1.5 px-3">
                  <Hash className="h-3.5 w-3.5" /> Rounds
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {loading ? (
            <div className="flex items-center justify-center p-12 text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading rankings...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-muted-foreground">{error}</div>
          ) : rankings.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {playerSearch ? `No players found matching "${playerSearch}"` : "No rankings available."}
            </div>
          ) : (
            <div className="space-y-1">
              {/* Header Row */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs text-muted-foreground uppercase tracking-wider border-b border-border/40">
                <div className="col-span-1">Rank</div>
                <div className="col-span-4">Player</div>
                <div className="col-span-2 text-right">{config.label}</div>
                <div className="col-span-1 text-right">Kills</div>
                <div className="col-span-1 text-right">Deaths</div>
                <div className="col-span-1 text-right">K/D</div>
                <div className="col-span-1 text-right">Score</div>
                <div className="col-span-1 text-right">Rounds</div>
              </div>

              {/* Player Rows */}
              {rankings.map((player) => {
                const isTopThree = player.rank <= 3;
                const isTop10 = player.rank <= 10;

                return (
                  <div
                    key={player.player_id}
                    className={cn(
                      "grid grid-cols-12 gap-4 items-center px-4 py-3 rounded-lg transition-colors hover:bg-muted/40",
                      isTopThree && "bg-amber-500/5",
                      isTop10 && !isTopThree && "bg-primary/5"
                    )}
                  >
                    {/* Rank */}
                    <div className="col-span-2 md:col-span-1">
                      <div className={cn(
                        "flex items-center justify-center w-9 h-9 rounded-lg text-sm font-bold",
                        player.rank === 1
                          ? "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/30"
                          : player.rank === 2
                          ? "bg-gradient-to-br from-slate-300 to-slate-500 text-white shadow-lg shadow-slate-400/30"
                          : player.rank === 3
                          ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-500/30"
                          : isTop10
                          ? "bg-primary/20 text-primary ring-1 ring-primary/30"
                          : "bg-muted/50 text-muted-foreground"
                      )}>
                        {isTopThree ? <Trophy className="w-4 h-4" /> : player.rank}
                      </div>
                    </div>

                    {/* Player Name */}
                    <div className="col-span-10 md:col-span-4 flex items-center gap-2">
                      {player.iso_country_code && (
                        <PlayerFlag isoCode={player.iso_country_code} className="h-4 shrink-0" />
                      )}
                      <Link
                        href={`/player/${encodeURIComponent(player.last_known_name)}`}
                        className="font-medium text-foreground hover:text-primary hover:underline underline-offset-2 truncate"
                      >
                        {player.last_known_name}
                      </Link>
                      {isTopThree && (
                        <span className="text-[10px] text-amber-500 font-semibold">#{player.rank}</span>
                      )}
                    </div>

                    {/* Primary Stat (Mobile shows this prominently) */}
                    <div className="col-span-6 md:col-span-2 md:text-right">
                      <div className={cn(
                        "font-bold tabular-nums text-lg md:text-base",
                        isTopThree ? "text-amber-500" : "text-foreground"
                      )}>
                        {config.getValue(player)}
                      </div>
                      <div className="text-[10px] text-muted-foreground md:hidden">
                        {config.label}
                      </div>
                    </div>

                    {/* Secondary Stats (Hidden on mobile) */}
                    <div className="hidden md:block col-span-1 text-right text-sm tabular-nums text-green-500">
                      {player.total_kills.toLocaleString()}
                    </div>
                    <div className="hidden md:block col-span-1 text-right text-sm tabular-nums text-red-400">
                      {player.total_deaths.toLocaleString()}
                    </div>
                    <div className="hidden md:block col-span-1 text-right text-sm tabular-nums">
                      <span className={cn(
                        player.kdr && player.kdr >= 2 ? "text-green-500" :
                        player.kdr && player.kdr >= 1 ? "text-foreground" :
                        "text-red-400"
                      )}>
                        {player.kdr?.toFixed(2) || "—"}
                      </span>
                    </div>
                    <div className="hidden md:block col-span-1 text-right text-sm tabular-nums text-muted-foreground">
                      {player.total_score.toLocaleString()}
                    </div>
                    <div className="hidden md:block col-span-1 text-right text-sm tabular-nums text-muted-foreground">
                      {player.rounds_played}
                    </div>

                    {/* Mobile secondary stats */}
                    <div className="col-span-6 md:hidden text-right text-xs text-muted-foreground">
                      <span className="text-green-500">{player.total_kills}K</span>
                      {" / "}
                      <span className="text-red-400">{player.total_deaths}D</span>
                      {" • "}
                      <span>{player.kdr?.toFixed(2) || "—"} K/D</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border/40 pt-4 mt-4">
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
