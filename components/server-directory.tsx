"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ServerFlag } from "@/components/server-flag"; // Import


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
}

type SortKey = "name" | "map" | "players" | "status" | "activity";
type SortDirection = "asc" | "desc";

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

const ITEMS_PER_PAGE = 30; // Increased items per page

export function ServerDirectory({ initialServers }: { initialServers: Server[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "status",
    direction: "asc",
  });
  const [activityRanks, setActivityRanks] = useState<Record<number, { rank: number; activity_hours_7d: number }>>({});

  // Fetch Activity Rankings
  useEffect(() => {
    async function fetchRankings() {
      try {
        const res = await fetch("/api/v1/servers/rankings?limit=100");
        if (res.ok) {
          const data = await res.json();
          if (data.ok && data.rankings) {
            const map: Record<number, { rank: number; activity_hours_7d: number }> = {};
            data.rankings.forEach((r: any) => {
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

  const sortedServers = useMemo(() => {
    let sortableServers = [...initialServers];

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
  }, [initialServers, sortConfig, activityRanks]);

  // Pagination logic
  const totalPages = Math.ceil(sortedServers.length / ITEMS_PER_PAGE);
  const paginatedServers = sortedServers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

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

  const getStatusVariant = (status: Server["current_state"]) => {
    switch (status) {
      case "ACTIVE": return "success";
      case "OFFLINE": return "destructive";
      default: return "default";
    }
  };

  return (
    <Card className="border-border/60">
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => requestSort("status")} className="-ml-4">
                  Status {getSortIcon("status")}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => requestSort("activity")} className="-ml-4">
                  Server Rank {getSortIcon("activity")}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => requestSort("name")} className="-ml-4">
                  Server Name {getSortIcon("name")}
                </Button>
              </TableHead>
              <TableHead className="hidden md:table-cell">Address</TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => requestSort("map")} className="-ml-4">
                  Map {getSortIcon("map")}
                </Button>
              </TableHead>
              <TableHead className="hidden lg:table-cell">Gametype</TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => requestSort("players")} className="-ml-4">
                  Players {getSortIcon("players")}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedServers.map((server) => {
              const rankData = activityRanks[server.server_id];
              return (
                <TableRow key={server.server_id}>
                  <TableCell>
                    <Badge variant={getStatusVariant(server.current_state)}>
                      {server.current_state}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {rankData ? (
                      <div className="flex flex-col items-start leading-none gap-1">
                        <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                          #{rankData.rank}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">{rankData.activity_hours_7d}h</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <ServerFlag ip={server.ip} />
                      <Link
                        href={`/servers/${server.server_id}`}
                        className="hover:underline truncate max-w-[200px] md:max-w-[300px] block"
                        title={server.current_server_name || ""}
                      >
                        {server.current_server_name || "Unknown"}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-xs font-mono">
                    {server.ip}:{server.current_game_port}
                  </TableCell>
                  <TableCell className="truncate max-w-[150px]">{server.current_map || "N/A"}</TableCell>
                  <TableCell className="hidden lg:table-cell">{server.current_gametype || "N/A"}</TableCell>
                  <TableCell>
                    {server.current_player_count} /{" "}
                    {server.current_max_players || 64}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
      {totalPages > 1 && (
        <CardFooter className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}