"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Activity, Users, BarChart, Loader2, AlertTriangle, ArrowRight, Server as ServerIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayerActivityChart } from "@/components/charts";
import { cn } from "@/lib/utils";
import { GlobalMetrics, GlobalMetricsSchema } from "@/lib/schemas";
import { Server } from "@/components/server-directory"; // Import Server type
import { ServerSummaryCard } from "@/components/server-summary-card";

interface MetricsApiResponse {
  ok: boolean;
  [key: string]: any;
}

interface ServerListResponse {
  ok: boolean;
  servers: Server[];
}

// Mirror the sort order from components/server-directory.tsx
const SERVER_STATUS_ORDER: Record<string, number> = {
  ACTIVE: 1,
  EMPTY: 2,
  OFFLINE: 3
};

export default function Page() {
  const [data, setData] = useState<GlobalMetrics | null>(null);
  const [topServers, setTopServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // 1. Fetch Global Metrics
        const metricsRes = await fetch("/api/v1/metrics/global");
        if (!metricsRes.ok) throw new Error("Failed to fetch metrics");

        const metricsJson: MetricsApiResponse = await metricsRes.json();
        if (metricsJson.ok) {
          const parsed = GlobalMetricsSchema.safeParse(metricsJson);
          if (parsed.success) {
            setData(parsed.data);
          } else {
            console.error("Validation Error:", parsed.error);
          }
        }

        // 2. Fetch Active Servers for Top 5 List
        const serversRes = await fetch("/api/v1/servers");
        if (serversRes.ok) {
          const serversJson: ServerListResponse = await serversRes.json();
          if (serversJson.ok) {
            // Sort to mirror the /servers page logic:
            // 1. Status (Active -> Empty -> Offline)
            // 2. Player Count (High -> Low)
            const sorted = serversJson.servers.sort((a, b) => {
              const statusA = SERVER_STATUS_ORDER[a.current_state] ?? 99;
              const statusB = SERVER_STATUS_ORDER[b.current_state] ?? 99;

              if (statusA !== statusB) {
                return statusA - statusB;
              }

              return b.current_player_count - a.current_player_count;
            });

            // Take the top 12
            setTopServers(sorted.slice(0, 12));
          }
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error || "Failed to load dashboard data."}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 py-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
          Welcome Back to the Battlefield
        </h1>
        <p className="text-lg text-muted-foreground">
          Here is your live, global battlefield report. All stats are updated in real-time.
        </p>
      </div>

      {/* --- Top Metrics Grid --- */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle as="h2" className="text-sm font-medium text-muted-foreground">Current Active Players</CardTitle>
              <div className="mt-2 text-2xl font-semibold text-foreground">{data.current_active_players}</div>
            </div>
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <Activity className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Live across all servers.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle as="h2" className="text-sm font-medium text-muted-foreground">Total Players Seen</CardTitle>
              <div className="mt-2 text-2xl font-semibold text-foreground">{data.total_players_seen}</div>
            </div>
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Total unique players recorded.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle as="h2" className="text-sm font-medium text-muted-foreground">Total Rounds Processed</CardTitle>
              <div className="mt-2 text-2xl font-semibold text-foreground">{data.total_rounds_processed}</div>
            </div>
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <BarChart className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Total rounds logged by the tracker.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* --- Compact Top Servers --- */}
      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle as="h2" className="flex items-center gap-2">
              <ServerIcon className="h-5 w-5 text-primary" />
              Top Active Servers
            </CardTitle>
            <CardDescription>Live leaderboard of the most populated battlefields.</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
            <Link href="/servers">
              View Full List <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 bg-transparent border-0">
          {topServers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topServers.map(server => (
                <ServerSummaryCard key={server.server_id} server={server as any} />
              ))}
              {/* Note: casting as any or updating interfaces if slight mismatch between Server and LiveServer types. 
                   Usually they should match if using same API response logic. */}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground border border-dashed rounded-lg bg-card/50">
              <ServerIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No active fronts detected.</p>
            </div>
          )}
        </CardContent>
        {/* Mobile-only view all button */}
        <div className="flex items-center justify-center p-4 sm:hidden border-t border-border/60">
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href="/servers">View Full Server List</Link>
          </Button>
        </div>
      </Card>

      {/* --- Charts Grid --- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle as="h2">Global Player Concurrency</CardTitle>
            <CardDescription>Average player count by hour (UTC).</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <PlayerActivityChart
              data24h={data.global_concurrency_heatmap_24h}
              data7d={data.global_concurrency_heatmap_7d}
            />
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle as="h2">Popular Maps (7 Days)</CardTitle>
            <CardDescription>Top 10 most played maps by round.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[308px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Map</TableHead>
                    <TableHead className="text-right">Rounds Played</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.popular_maps_7_days.map((map) => (
                    <TableRow key={map.map_name}>
                      <TableCell className="font-medium text-foreground">{map.map_name}</TableCell>
                      <TableCell className="text-right">{map.rounds_played}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}