"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Activity, Users, BarChart, Loader2, AlertTriangle, ArrowRight, Server as ServerIcon, TrendingUp, Globe, Zap } from "lucide-react";
import { AnimatedCounter } from "@/components/animated-counter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayerActivityChart } from "@/components/charts";
import { cn } from "@/lib/utils";
import { GlobalMetrics, GlobalMetricsSchema, ServerListSchema } from "@/lib/schemas";
import { Server } from "@/components/server-directory";
import { ServerSummaryCard } from "@/components/server-summary-card";
import { LiveTicker } from "@/components/live-ticker";

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

        const metricsJson = await metricsRes.json();
        const parsed = GlobalMetricsSchema.safeParse(metricsJson);
        if (parsed.success) {
          setData(parsed.data);
        } else {
          console.error("Metrics validation error:", parsed.error);
        }

        // 2. Fetch Active Servers for Top 5 List
        const serversRes = await fetch("/api/v1/servers");
        if (serversRes.ok) {
          const serversJson = await serversRes.json();
          const serversParsed = ServerListSchema.safeParse(serversJson);
          if (serversParsed.success) {
            // Sort to mirror the /servers page logic:
            // 1. Status (Active -> Empty -> Offline)
            // 2. Player Count (High -> Low)
            const sorted = [...serversParsed.data.servers].sort((a, b) => {
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

  const activeServerCount = topServers.filter(s => s.current_state === "ACTIVE").length;

  return (
    <div className="space-y-8 pb-8">
      {/* --- Command Center Hero --- */}
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 px-6 py-12 shadow-2xl sm:px-12 sm:py-16">
        {/* Background Effects */}
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-green-500/10 blur-[120px]" />
        <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[100px]" />

        <div className="relative z-10">
          {/* Status Badge */}
          <div className="flex items-center gap-2 mb-6">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
            </span>
            <Badge variant="outline" className="border-green-500/30 bg-green-500/10 text-green-400 font-mono">
              SYSTEM ONLINE // MONITORING ACTIVE FRONTS
            </Badge>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
                <AnimatedCounter value={data.current_active_players} duration={1500} />
                <span className="ml-3 text-2xl font-normal text-slate-400 sm:text-3xl">Soldiers Deployed</span>
              </h1>
              <p className="max-w-[500px] text-lg text-slate-400">
                Live telemetry from {activeServerCount} active battlefields worldwide.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-5 py-4 card-hover">
                <div className="rounded-lg bg-blue-500/20 p-2.5 text-blue-400">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-slate-500">Total Players</p>
                  <p className="font-mono text-xl font-bold text-white">
                    <AnimatedCounter value={data.total_players_seen} duration={1200} />
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-5 py-4 card-hover">
                <div className="rounded-lg bg-amber-500/20 p-2.5 text-amber-400">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-slate-500">Rounds Logged</p>
                  <p className="font-mono text-xl font-bold text-white">
                    <AnimatedCounter value={data.total_rounds_processed} duration={1200} />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Top Active Servers Section --- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <ServerIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Top Active Servers</h2>
              <p className="text-sm text-muted-foreground">Live battlefields with the most action</p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="hidden sm:flex">
            <Link href="/servers">
              View All Servers <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Live Ticker */}
        <LiveTicker className="rounded-lg border border-border/60 bg-card/50" />

        {/* Server Grid */}
        {topServers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topServers.map(server => (
              <ServerSummaryCard key={server.server_id} server={server} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground border border-dashed border-border/60 rounded-xl bg-card/30">
            <ServerIcon className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No active fronts detected</p>
            <p className="text-sm mt-1">Check back soon for live battlefield intel.</p>
          </div>
        )}

        {/* Mobile View All Button */}
        <div className="flex sm:hidden">
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href="/servers">View All Servers</Link>
          </Button>
        </div>
      </div>

      {/* --- Activity Chart Section --- */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Player Activity</h2>
            <p className="text-sm text-muted-foreground">Global player count over time</p>
          </div>
        </div>

        <Card className="border-border/60 overflow-hidden">
          <CardContent className="p-6">
            <PlayerActivityChart
              data24h={data.global_concurrency_timeline_24h || data.global_concurrency_heatmap_24h}
              data7d={data.global_concurrency_timeline_7d || data.global_concurrency_heatmap_7d}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
