"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link"; // Import Link
import { AlertTriangle, Loader2, ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define the shape of a server from the API
interface Server {
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

// Define the shape of the API response
interface ApiResponse {
  ok: boolean;
  servers: Server[];
}

type SortKey = "name" | "map" | "players" | "status";
type SortDirection = "asc" | "desc";

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

const ITEMS_PER_PAGE = 15;


export default function ServersPage() {
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "status", direction: "asc" });

  useEffect(() => {
    async function fetchServers() {
      try {
        const response = await fetch(`/api/v1/servers`);
        if (!response.ok) {
          throw new Error(`Failed to fetch servers: ${response.statusText}`);
        }
        const data: ApiResponse = await response.json();
        setServers(data.servers);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchServers();
  }, []);

  const sortedServers = useMemo(() => {
    let sortableServers = [...servers];
    
    // Default sort: Status > Players (desc)
    const sortOrder = { 'ACTIVE': 1, 'EMPTY': 2, 'OFFLINE': 3 };
    sortableServers.sort((a, b) => {
        if (sortOrder[a.current_state] !== sortOrder[b.current_state]) {
            return sortOrder[a.current_state] - sortOrder[b.current_state];
        }
        return b.current_player_count - a.current_player_count;
    });

    // Apply user-selected sort (if not default)
    if (sortConfig.key !== "status") {
      sortableServers.sort((a, b) => {
        let aValue: string | number = 0;
        let bValue: string | number = 0;

        // Handle nulls and assign values for comparison
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
        }

        // Comparison logic
        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableServers;
  }, [servers, sortConfig]);


  // Pagination logic
  const totalPages = Math.ceil(sortedServers.length / ITEMS_PER_PAGE);
  const paginatedServers = sortedServers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // Sort request handler
  const requestSort = (key: SortKey) => {
    let direction: SortDirection = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    // Reset to default sort if clicking "status"
    if (key === "status") {
        setSortConfig({ key: "status", direction: "asc" });
    } else {
        setSortConfig({ key, direction });
    }
    setCurrentPage(1); // Reset to first page on new sort
  };

  // Helper to get sort icon
  const getSortIcon = (key: SortKey) => { // <-- FIXED: Removed stray 'D'
    if (sortConfig.key !== key) return null;
    if (sortConfig.direction === "asc") return <ArrowUp className="ml-2 h-4 w-4" />;
    return <ArrowDown className="ml-2 h-4 w-4" />;
  };

  const getStatusVariant = (status: Server["current_state"]) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "OFFLINE":
        return "destructive";
      case "EMPTY":
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Server Directory</h1>
      </div>
      <Card className="border-border/60">
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <p>Loading live server data...</p>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load server data. {error}
              </AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button variant="ghost" size="sm" onClick={() => requestSort("status")} className="-ml-4">
                      Status
                      {getSortIcon("status")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" onClick={() => requestSort("name")} className="-ml-4">
                      Server Name
                      {getSortIcon("name")}
                    </Button>
                  </TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" onClick={() => requestSort("map")} className="-ml-4">
                      Map
                      {getSortIcon("map")}
                    </Button>
                  </TableHead>
                  <TableHead>Gametype</TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" onClick={() => requestSort("players")} className="-ml-4">
                      Players
                      {getSortIcon("players")}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[80px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedServers.map((server) => (
                  <TableRow key={server.server_id}>
                    <TableCell>
                      <Badge variant={getStatusVariant(server.current_state)}>
                        {server.current_state}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      <Link
                        href={`/servers/${server.server_id}`}
                        className="hover:underline"
                      >
                        {server.current_server_name || "Unknown"}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {server.ip}:{server.current_game_port}
                    </TableCell>
                    <TableCell>{server.current_map || "N/A"}</TableCell>
                    <TableCell>{server.current_gametype || "N/A"}</TableCell>
                    <TableCell>
                      {server.current_player_count} / {server.current_max_players || 64}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" disabled={server.current_state !== "ACTIVE"}>
                        Join
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        {!loading && !error && totalPages > 1 && (
          <CardFooter className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 1}>
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
                Next
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}