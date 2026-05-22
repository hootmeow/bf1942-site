"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ArrowUp, ArrowDown, Trophy, Users, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ServerFlag } from "@/components/server-flag";
import { cn } from "@/lib/utils";


// --- Types ---
export interface Server {
  server_id: number;
  ip: string;
  query_port: number;
  current_game_port: number;
  current_state: "ACTIVE" | "EMPTY" | "OFFLINE";
  current_server_name: string | null;
  current_map: string | null;
  current_player_count: number;
  current_max_players: number;
  current_gametype: string | null;
  last_successful_poll: string | null;
  history?: number[];
}

interface ServerRanking {
  server_id: number;
  rank: number;
  activity_hours_7d: number;
}

type SortKey = "name" | "map" | "players" | "status" | "activity";
type SortDirection = "asc" | "desc";

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

const ITEMS_PER_PAGE = 30; // Increased items per page

function getPlayerTier(count: number) {
  if (count === 0) return {
    label: "empty", barClass: "bg-transparent", countClass: "text-foreground", pulse: false,
  };
  if (count >= 40) return {
    label: "packed", barClass: "bg-gradient-to-r from-lime-500 via-yellow-400 to-amber-300", countClass: "text-yellow-400 font-semibold", pulse: true,
  };
  if (count >= 20) return {
    label: "active", barClass: "bg-gradient-to-r from-lime-700 to-lime-400", countClass: "text-lime-400 font-semibold", pulse: true,
  };
  if (count >= 5) return {
    label: "warming", barClass: "bg-gradient-to-r from-primary/50 to-primary/70", countClass: "text-foreground font-semibold", pulse: false,
  };
  return {
    label: "low", barClass: "bg-primary/25", countClass: "text-foreground font-semibold", pulse: false,
  };
}

type StatusFilter = "ALL" | "ACTIVE" | "EMPTY" | "OFFLINE";

export function ServerDirectory({ initialServers }: { initialServers: Server[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "status",
    direction: "asc",
  });
  const [activityRanks, setActivityRanks] = useState<Record<number, { rank: number; activity_hours_7d: number }>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [gametypeFilter, setGametypeFilter] = useState<string>("ALL");

  // Fetch Activity Rankings
  useEffect(() => {
    async function fetchRankings() {
      try {
        const res = await fetch("/api/v1/servers/rankings?limit=100");
        if (res.ok) {
          const data = await res.json();
          if (data.ok && data.rankings) {
            const map: Record<number, { rank: number; activity_hours_7d: number }> = {};
            data.rankings.forEach((r: ServerRanking) => {
              map[r.server_id] = { rank: r.rank, activity_hours_7d: r.activity_hours_7d };
            });
            setActivityRanks(map);
          }
        }
      } catch (e) {
        console.error("Failed to fetch server rankings", e);
      }
    }
    fetchRankings();
  }, []);

  const uniqueGametypes = useMemo(() =>
    [...new Set(initialServers.map(s => s.current_gametype).filter(Boolean) as string[])].sort()
  , [initialServers]);

  const sortedServers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let sortableServers = initialServers.filter(s => {
      if (statusFilter !== "ALL" && s.current_state !== statusFilter) return false;
      if (gametypeFilter !== "ALL" && s.current_gametype !== gametypeFilter) return false;
      if (!q) return true;
      return (
        (s.current_server_name || "").toLowerCase().includes(q) ||
        (s.current_map || "").toLowerCase().includes(q) ||
        s.ip.includes(q)
      );
    });

    // Default sort logic if 'status' is selected
    const sortOrder = { ACTIVE: 1, EMPTY: 2, OFFLINE: 3 };

    if (sortConfig.key === "status") {
      sortableServers.sort((a, b) => {
        if (sortOrder[a.current_state] !== sortOrder[b.current_state]) {
          return sortConfig.direction === "asc"
            ? sortOrder[a.current_state] - sortOrder[b.current_state]
            : sortOrder[b.current_state] - sortOrder[a.current_state];
        }
        // Secondary sort by player count
        return b.current_player_count - a.current_player_count;
      });
      return sortableServers;
    }

    // Other columns
    sortableServers.sort((a, b) => {
      let aValue: string | number = 0;
      let bValue: string | number = 0;

      switch (sortConfig.key) {
        case "name":
          aValue = a.current_server_name || "";
          bValue = b.current_server_name || "";
          break;
        case "map":
          aValue = a.current_map || "";
          bValue = b.current_map || "";
          break;
        case "players":
          aValue = a.current_player_count;
          bValue = b.current_player_count;
          break;
        case "activity":
          // Sort by rank (lower is better) or hours (higher is better)
          // If no rank, treat as infinity (bottom)
          const rankA = activityRanks[a.server_id]?.rank ?? 9999;
          const rankB = activityRanks[b.server_id]?.rank ?? 9999;
          if (rankA < rankB) return sortConfig.direction === "asc" ? -1 : 1;
          if (rankA > rankB) return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sortableServers;
  }, [initialServers, sortConfig, activityRanks, searchQuery, statusFilter, gametypeFilter]);

  // Pagination logic
  const totalPages = Math.ceil(sortedServers.length / ITEMS_PER_PAGE);
  const paginatedServers = sortedServers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: StatusFilter) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleGametypeFilter = (gametype: string) => {
    setGametypeFilter(gametype);
    setCurrentPage(1);
  };

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    if (key === "status") {
      // Reset to default preferred sort for status
      setSortConfig({ key: "status", direction: "asc" });
    } else {
      setSortConfig({ key, direction });
    }
    setCurrentPage(1);
  };

  const getSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  const getStatusStyles = (status: Server["current_state"]) => {
    switch (status) {
      case "ACTIVE":
        return {
          variant: "success" as const,
          className: "bg-green-500/10 text-green-500 border-green-500/30 shadow-green-500/20 shadow-sm"
        };
      case "OFFLINE":
        return {
          variant: "destructive" as const,
          className: "bg-red-500/10 text-red-400 border-red-500/30"
        };
      default:
        return {
          variant: "default" as const,
          className: "bg-muted/50 text-muted-foreground border-border"
        };
    }
  };

  // Calculate summary stats
  const stats = useMemo(() => {
    const active = initialServers.filter(s => s.current_state === "ACTIVE").length;
    const totalPlayers = initialServers.reduce((sum, s) => sum + s.current_player_count, 0);
    return { active, totalPlayers, total: initialServers.length };
  }, [initialServers]);

  const STATUS_FILTERS: { label: string; value: StatusFilter; dot?: string }[] = [
    { label: "All", value: "ALL" },
    { label: "Active", value: "ACTIVE", dot: "bg-green-500" },
    { label: "Empty", value: "EMPTY", dot: "bg-muted-foreground" },
    { label: "Offline", value: "OFFLINE", dot: "bg-red-500" },
  ];

  const isFiltered = searchQuery.trim() !== "" || statusFilter !== "ALL" || gametypeFilter !== "ALL";
  const resultCount = sortedServers.length;

  return (
    <Card className="border-border/60 overflow-hidden">
      {/* Search + Filter Header */}
      <CardHeader className="border-b border-border/40 bg-muted/20 py-4 space-y-3">
        {/* Top row: stat summary */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {stats.totalPlayers} players on {stats.active} active servers
          </CardTitle>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-muted-foreground">{stats.active} Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-muted-foreground" />
              <span className="text-muted-foreground">{stats.total - stats.active} Inactive</span>
            </div>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by server name, map, or IP…"
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
            className="pl-9 pr-9 bg-background/60 border-border/60 focus-visible:ring-primary/40 h-9 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Status filter chips + result count */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            {STATUS_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => handleStatusFilter(f.value)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border transition-all duration-150",
                  statusFilter === f.value
                    ? "bg-primary/15 text-primary border-primary/40"
                    : "bg-transparent text-muted-foreground border-border/50 hover:border-border hover:text-foreground"
                )}
              >
                {f.dot && <span className={cn("w-1.5 h-1.5 rounded-full", f.dot)} />}
                {f.label}
              </button>
            ))}
          </div>
          {isFiltered && (
            <span className="text-xs text-muted-foreground tabular-nums">
              {resultCount === 0 ? "No results" : `${resultCount} of ${stats.total} servers`}
            </span>
          )}
        </div>

        {/* Gametype filter chips */}
        {uniqueGametypes.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-muted-foreground mr-1">Mode:</span>
            <button
              onClick={() => handleGametypeFilter("ALL")}
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border transition-all duration-150",
                gametypeFilter === "ALL"
                  ? "bg-primary/15 text-primary border-primary/40"
                  : "bg-transparent text-muted-foreground border-border/50 hover:border-border hover:text-foreground"
              )}
            >
              All
            </button>
            {uniqueGametypes.map(gt => (
              <button
                key={gt}
                onClick={() => handleGametypeFilter(gt)}
                className={cn(
                  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border uppercase tracking-wide transition-all duration-150",
                  gametypeFilter === gt
                    ? "bg-primary/15 text-primary border-primary/40"
                    : "bg-transparent text-muted-foreground border-border/50 hover:border-border hover:text-foreground"
                )}
              >
                {gt}
              </button>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/40">
                <TableHead className="w-[60px] sm:w-[100px]">
                  <Button variant="ghost" size="sm" onClick={() => requestSort("status")} className="-ml-3 hover:bg-transparent hover:text-primary text-xs sm:text-sm">
                    <span className="hidden sm:inline">Status</span>
                    <span className="sm:hidden">St.</span>
                    {getSortIcon("status")}
                  </Button>
                </TableHead>
                <TableHead className="w-[50px] sm:w-[90px]">
                  <Button variant="ghost" size="sm" onClick={() => requestSort("activity")} className="-ml-3 hover:bg-transparent hover:text-primary text-xs sm:text-sm">
                    <span className="hidden sm:inline">Rank</span>
                    <span className="sm:hidden">#</span>
                    {getSortIcon("activity")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => requestSort("name")} className="-ml-3 hover:bg-transparent hover:text-primary text-xs sm:text-sm">
                    <span className="hidden sm:inline">Server Name</span>
                    <span className="sm:hidden">Server</span>
                    {getSortIcon("name")}
                  </Button>
                </TableHead>
                <TableHead className="hidden md:table-cell w-[160px]">Address</TableHead>
                <TableHead className="w-[80px] sm:w-auto">
                  <Button variant="ghost" size="sm" onClick={() => requestSort("map")} className="-ml-3 hover:bg-transparent hover:text-primary text-xs sm:text-sm">
                    Map {getSortIcon("map")}
                  </Button>
                </TableHead>
                <TableHead className="hidden lg:table-cell w-[100px]">Gametype</TableHead>
                <TableHead className="w-[80px] sm:w-[130px]">
                  <Button variant="ghost" size="sm" onClick={() => requestSort("players")} className="-ml-3 hover:bg-transparent hover:text-primary text-xs sm:text-sm">
                    <span className="hidden sm:inline">Players</span>
                    <span className="sm:hidden">Plrs</span>
                    {getSortIcon("players")}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
          <TableBody>
            {paginatedServers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-16 text-center">
                  <Search className="h-8 w-8 mx-auto mb-3 text-muted-foreground/40" />
                  <p className="text-sm font-medium text-muted-foreground">No servers match your search</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Try a different name, map, IP, or filter</p>
                  <button
                    onClick={() => { handleSearch(""); handleStatusFilter("ALL"); handleGametypeFilter("ALL"); }}
                    className="mt-3 text-xs text-primary hover:underline"
                  >
                    Clear filters
                  </button>
                </TableCell>
              </TableRow>
            )}
            {paginatedServers.map((server, index) => {
              const rankData = activityRanks[server.server_id];
              const statusStyles = getStatusStyles(server.current_state);
              const fillPercent = (server.current_player_count / (server.current_max_players || 64)) * 100;
              const tier = getPlayerTier(server.current_player_count);

              return (
                <TableRow
                  key={server.server_id}
                  className={cn(
                    "transition-colors border-b border-border/30",
                    server.current_state === "ACTIVE" && "bg-green-500/[0.02]",
                    "hover:bg-muted/40"
                  )}
                >
                  <TableCell className="py-2 sm:py-3 px-1 sm:px-3">
                    <Badge
                      variant={statusStyles.variant}
                      className={cn("text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide px-1 sm:px-2", statusStyles.className)}
                    >
                      <span className="hidden sm:inline">{server.current_state}</span>
                      <span className="sm:hidden">{server.current_state.slice(0, 3)}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2 sm:py-3 px-1 sm:px-3">
                    {rankData ? (
                      <div className="flex items-center gap-1 sm:gap-2">
                        <div className={cn(
                          "flex items-center justify-center w-5 h-5 sm:w-7 sm:h-7 rounded-md text-[10px] sm:text-xs font-bold",
                          rankData.rank <= 3
                            ? "bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-500/30"
                            : rankData.rank <= 10
                            ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                            : "bg-muted/50 text-muted-foreground"
                        )}>
                          {rankData.rank <= 3 && <Trophy className="w-2 h-2 sm:w-3 sm:h-3 mr-0 sm:mr-0.5" />}
                          <span className="hidden sm:inline">{rankData.rank}</span>
                          <span className="sm:hidden">{rankData.rank}</span>
                        </div>
                        <span className="text-[9px] sm:text-[10px] text-muted-foreground hidden md:inline">{rankData.activity_hours_7d}h</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground/50 text-xs pl-1 sm:pl-2">—</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-foreground py-2 sm:py-3 px-1 sm:px-3">
                    <div className="flex items-center gap-1 sm:gap-2.5">
                      <ServerFlag ip={server.ip} className="flex-shrink-0 w-4 h-3 sm:w-auto sm:h-auto" />
                      <Link
                        href={`/servers/${server.server_id}`}
                        className="hover:text-primary hover:underline underline-offset-2 truncate max-w-[80px] sm:max-w-[200px] md:max-w-[300px] block transition-colors text-xs sm:text-sm"
                        title={server.current_server_name || ""}
                      >
                        {server.current_server_name || "Unknown"}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-xs font-mono py-2 sm:py-3 px-1 sm:px-3">
                    {server.ip}:{server.current_game_port}
                  </TableCell>
                  <TableCell className="truncate max-w-[60px] sm:max-w-[150px] py-2 sm:py-3 text-muted-foreground text-xs sm:text-sm px-1 sm:px-3">
                    {server.current_map || "N/A"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell py-2 sm:py-3 text-muted-foreground uppercase text-xs px-1 sm:px-3">
                    {server.current_gametype || "N/A"}
                  </TableCell>
                  <TableCell className="py-2 sm:py-3 px-1 sm:px-3">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="flex-1 min-w-[50px] sm:min-w-[60px]">
                        <div className="flex items-center justify-between text-[10px] sm:text-xs mb-1">
                          <span className={cn("tabular-nums", tier.countClass)}>
                            {server.current_player_count}
                          </span>
                          <span className="text-muted-foreground">/{server.current_max_players || 64}</span>
                        </div>
                        <div className="relative">
                          <div className={cn(
                            "w-full bg-muted/50 rounded-full overflow-hidden transition-all duration-300",
                            tier.pulse ? "h-1.5 sm:h-2" : "h-1 sm:h-1.5"
                          )}>
                            <div
                              className={cn("h-full rounded-full transition-all duration-500", tier.barClass)}
                              style={{ width: `${fillPercent}%` }}
                            />
                          </div>
                          {tier.pulse && fillPercent > 0 && (
                            <div
                              className={cn(
                                "absolute top-1/2 -translate-y-1/2 h-3 sm:h-4 rounded-full blur-md animate-pulse",
                                tier.label === "packed" ? "bg-yellow-400/35" : "bg-lime-500/30"
                              )}
                              style={{ width: `${fillPercent}%` }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
          </Table>
        </div>
      </CardContent>

      {totalPages > 1 && (
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 border-t border-border/40 bg-muted/10 py-3 sm:py-4">
          <span className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, sortedServers.length)} of {sortedServers.length}{isFiltered ? ` matched` : ""} servers
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="text-xs sm:text-sm"
            >
              Next
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}