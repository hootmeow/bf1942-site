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
import { LiveTicker } from "@/components/live-ticker";

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
      {/* --- Command Center Hero --- */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/80 via-card/50 to-background p-6 shadow-sm sm:p-10">
        {/* Ambient Glow */}
        <div className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[100px]" />

        <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
              </span>
              <span className="font-mono text-sm font-medium tracking-wider text-green-500">
                SYSTEM ONLINE // MONITORING ACTIVE FRONTS
              </span>
            </div>

            <div className="space-y-1">
              <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-7xl">
                {data.current_active_players}
                <span className="ml-2 text-2xl font-light text-muted-foreground sm:text-3xl">Soldiers Deployed</span>
              </h1>
              <p className="max-w-[600px] text-lg text-muted-foreground">
                Live telemetry from {topServers.length} active battlefields worldwide.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-4 rounded-xl border border-border/40 bg-background/40 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">Total Players</p>
                <p className="font-mono text-xl font-bold">{data.total_players_seen.toLocaleString()}</p>
              </div>
            </div>
            <div className="h-10 w-px bg-border/60 hidden sm:block"></div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">Rounds Logged</p>
                <p className="font-mono text-xl font-bold">{data.total_rounds_processed.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Compact Top Servers --- */}
      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle as="h2" className="flex items-center gap-2">
              <ServerIcon className="h-5 w-5 text-primary" />
              Top Active Servers
            </CardTitle>
          </div>
          <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
            <Link href="/servers">
              View Full List <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>

        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0 bg-transparent border-0">
          {/* Integrated Live Ticker */}
          <LiveTicker className="mb-2 rounded-md border border-white/5 bg-black/20" />
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
      <div className="grid grid-cols-1 gap-6">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle as="h2">Player Activity History</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <PlayerActivityChart
              data24h={data.global_concurrency_heatmap_24h}
              data7d={data.global_concurrency_timeline_7d || data.global_concurrency_heatmap_7d}
            />
          </CardContent>
        </Card>
      </div>
    </div >
  );
}