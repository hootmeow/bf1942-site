"use client";

import { useReducer, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Activity, Users, AlertTriangle, ArrowRight, Server as ServerIcon, TrendingUp, Shield, MessageCircle } from "lucide-react";
import { AnimatedCounter } from "@/components/animated-counter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GlobalMetrics, GlobalMetricsSchema, ServerListSchema } from "@/lib/schemas";
import { Server } from "@/components/server-directory";
import { ServerSummaryCard } from "@/components/server-summary-card";
import { LiveTicker } from "@/components/live-ticker";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingState } from "@/components/ui/loading-state";

// Lazy load heavy chart component
const PlayerActivityChart = dynamic(
  () => import("@/components/charts").then((mod) => ({ default: mod.PlayerActivityChart })),
  {
    loading: () => <LoadingState variant="skeleton" skeletonHeight="h-[300px]" />,
    ssr: false,
  }
);

// Mirror the sort order from components/server-directory.tsx
const SERVER_STATUS_ORDER: Record<string, number> = {
  ACTIVE: 1,
  EMPTY: 2,
  OFFLINE: 3
};

// State management with useReducer
type HomeState = {
  data: GlobalMetrics | null;
  topServers: Server[];
  allServers: Server[];
  loading: boolean;
  error: string | null;
};

type HomeAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: { data: GlobalMetrics; topServers: Server[]; allServers: Server[] } }
  | { type: "FETCH_ERROR"; payload: string };

function homeReducer(state: HomeState, action: HomeAction): HomeState {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        data: action.payload.data,
        topServers: action.payload.topServers,
        allServers: action.payload.allServers,
        error: null,
      };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export default function HomeClient() {
  const [state, dispatch] = useReducer(homeReducer, {
    data: null,
    topServers: [],
    allServers: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchDashboardData() {
      dispatch({ type: "FETCH_START" });

      try {
        const [metricsRes, serversRes] = await Promise.all([
          fetch("/api/v1/metrics/global"),
          fetch("/api/v1/servers"),
        ]);

        // 1. Process Global Metrics
        if (!metricsRes.ok) throw new Error("Failed to fetch metrics");
        const metricsJson = await metricsRes.json();
        const parsed = GlobalMetricsSchema.safeParse(metricsJson);

        if (!parsed.success) {
          console.error("Metrics validation error:", parsed.error);
          throw new Error("Invalid metrics data");
        }

        // 2. Process Active Servers for Top 12 List
        let topServers: Server[] = [];
        let allServers: Server[] = [];
        if (serversRes.ok) {
          const serversJson = await serversRes.json();
          const serversParsed = ServerListSchema.safeParse(serversJson);
          if (serversParsed.success) {
            const sorted = [...serversParsed.data.servers].sort((a, b) => {
              const statusA = SERVER_STATUS_ORDER[a.current_state] ?? 99;
              const statusB = SERVER_STATUS_ORDER[b.current_state] ?? 99;
              if (statusA !== statusB) return statusA - statusB;
              return b.current_player_count - a.current_player_count;
            });
            allServers = sorted;
            topServers = sorted.slice(0, 12);
          }
        }

        dispatch({
          type: "FETCH_SUCCESS",
          payload: { data: parsed.data, topServers, allServers },
        });
      } catch (err) {
        dispatch({
          type: "FETCH_ERROR",
          payload: err instanceof Error ? err.message : "An unknown error occurred",
        });
      }
    }

    fetchDashboardData();
  }, []);

  const { data, topServers, allServers, loading, error } = state;

  if (loading) {
    return (
      <div className="space-y-8 pb-8">
        {/* Skeleton Hero Banner */}
        <Skeleton className="h-[280px] rounded-3xl sm:h-[240px]" />

        {/* Skeleton Server Cards */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[120px] rounded-xl" />
            ))}
          </div>
        </div>

        {/* Skeleton Chart Area */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-52" />
            </div>
          </div>
          <Skeleton className="h-[300px] rounded-xl" />
        </div>
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

  const activeServerCount = allServers.filter(s => s.current_state === "ACTIVE").length;
  const emptyServerCount = allServers.filter(s => s.current_state === "EMPTY").length;
  const offlineServerCount = allServers.filter(s => s.current_state === "OFFLINE").length;
  const totalServerCount = allServers.length;
  const mostActiveServer = allServers.find(s => s.current_state === "ACTIVE" && s.current_player_count > 0);

  return (
    <div className="space-y-6 pb-8 sm:space-y-8">
      {/* --- Hero --- */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/60 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 shadow-2xl">
        {/* Background glows */}
        <div className="absolute -right-24 -top-24 h-[360px] w-[360px] rounded-full bg-green-500/[0.07] blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-[300px] w-[300px] rounded-full bg-blue-500/[0.07] blur-[90px] pointer-events-none" />
        {/* Subtle grid texture */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        <div className="relative z-10 px-5 py-8 sm:px-10 sm:py-12">
          {/* LIVE badge */}
          <div className="flex items-center gap-2.5 mb-7 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <Badge variant="outline" className="border-green-500/30 bg-green-500/10 text-green-400 font-mono text-[10px]">
              SYSTEM ONLINE // MONITORING ACTIVE FRONTS
            </Badge>
          </div>

          {/* Split layout */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
            {/* Left: main counter */}
            <div className="lg:flex-1 animate-fade-in-up stagger-1">
              <div className="text-6xl sm:text-7xl lg:text-8xl font-black tabular-nums text-white tracking-tight leading-none">
                <AnimatedCounter value={data.current_active_players} duration={1500} />
              </div>
              <p className="text-xl sm:text-2xl font-light text-slate-300 mt-2">Soldiers Deployed</p>
              <p className="text-sm text-slate-500 mt-2 max-w-sm">
                Live battlefield telemetry from {activeServerCount} active server{activeServerCount !== 1 ? "s" : ""} worldwide.
              </p>
            </div>

            {/* Right: 2×2 metric cards */}
            <div className="grid grid-cols-2 gap-3 lg:w-[420px] shrink-0 animate-fade-in-up stagger-2">
              {/* This Week */}
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">This Week</p>
                  <div className="rounded-md bg-emerald-500/20 p-1 text-emerald-400">
                    <TrendingUp className="h-3 w-3" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold tabular-nums text-white mt-1">
                  {data.active_players_7d.toLocaleString()}
                </p>
                <p className={cn("text-[11px] font-semibold", data.active_players_7d_change_pct >= 0 ? "text-emerald-400" : "text-red-400")}>
                  {data.active_players_7d_change_pct >= 0 ? "↑" : "↓"} {Math.abs(data.active_players_7d_change_pct).toFixed(0)}% vs prior week
                </p>
              </div>

              {/* Last 24h */}
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Last 24h</p>
                  <div className="rounded-md bg-blue-500/20 p-1 text-blue-400">
                    <Activity className="h-3 w-3" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold tabular-nums text-white mt-1">
                  {data.active_players_24h.toLocaleString()}
                </p>
                <p className={cn("text-[11px] font-semibold", data.active_players_24h_change_pct >= 0 ? "text-emerald-400" : "text-red-400")}>
                  {data.active_players_24h_change_pct >= 0 ? "↑" : "↓"} {Math.abs(data.active_players_24h_change_pct).toFixed(0)}% vs yesterday
                </p>
              </div>

              {/* Servers Online */}
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Servers Online</p>
                  <div className="rounded-md bg-amber-500/20 p-1 text-amber-400">
                    <ServerIcon className="h-3 w-3" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold tabular-nums text-white mt-1">{activeServerCount}</p>
                <p className="text-[11px] text-slate-500">
                  {emptyServerCount} empty · {offlineServerCount} offline
                </p>
              </div>

              {/* Rounds Logged */}
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Rounds Logged</p>
                  <div className="rounded-md bg-violet-500/20 p-1 text-violet-400">
                    <Shield className="h-3 w-3" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold tabular-nums text-white mt-1">
                  <AnimatedCounter value={data.total_rounds_processed} duration={1200} />
                </p>
                <p className="text-[11px] text-slate-500">all-time battle records</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Top Active Servers Section --- */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="rounded-md sm:rounded-lg bg-primary/10 p-1.5 sm:p-2 text-primary">
              <ServerIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground">Top Active Servers</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">Live battlefields with the most action</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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

      {/* --- Activity + Top Maps Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Chart — 2/3 width on large screens */}
        <Card className="lg:col-span-2 border-border/60 overflow-hidden">
          <CardHeader className="pb-2 border-b border-border/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="rounded-md bg-primary/10 p-1.5 text-primary">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-base sm:text-lg">Player Activity</CardTitle>
                  <CardDescription className="text-xs">Global player count over time</CardDescription>
                </div>
              </div>
              <Button asChild variant="ghost" size="sm" className="hidden sm:flex text-xs text-muted-foreground">
                <Link href="/game-health">
                  Full Report <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-5">
            <PlayerActivityChart
              data24h={data.global_concurrency_timeline_24h || data.global_concurrency_heatmap_24h}
              data7d={data.global_concurrency_timeline_7d || data.global_concurrency_heatmap_7d}
            />
          </CardContent>
        </Card>

        {/* Server Network — 1/3 width */}
        <Card className="border-border/60 overflow-hidden">
          <CardHeader className="pb-2 border-b border-border/40">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="rounded-md bg-primary/10 p-1.5 text-primary">
                <ServerIcon className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg">Server Network</CardTitle>
                <CardDescription className="text-xs">Current operational status</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {/* Proportional status bar */}
            {totalServerCount > 0 && (
              <div className="mb-5">
                <div className="h-2 rounded-full overflow-hidden flex gap-0.5">
                  {activeServerCount > 0 && (
                    <div className="bg-green-500 rounded-l-full" style={{ width: `${(activeServerCount / totalServerCount) * 100}%` }} />
                  )}
                  {emptyServerCount > 0 && (
                    <div className="bg-muted-foreground/25" style={{ width: `${(emptyServerCount / totalServerCount) * 100}%` }} />
                  )}
                  {offlineServerCount > 0 && (
                    <div className="bg-red-500/40 rounded-r-full" style={{ width: `${(offlineServerCount / totalServerCount) * 100}%` }} />
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5">{totalServerCount} total servers tracked</p>
              </div>
            )}

            {/* Three-count breakdown */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              <div className="text-center py-2.5 px-1 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-2xl font-bold text-green-500 tabular-nums">{activeServerCount}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Active</p>
              </div>
              <div className="text-center py-2.5 px-1 rounded-lg bg-muted/30 border border-border/50">
                <p className="text-2xl font-bold text-foreground tabular-nums">{emptyServerCount}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Empty</p>
              </div>
              <div className="text-center py-2.5 px-1 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-2xl font-bold text-red-500/70 tabular-nums">{offlineServerCount}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Offline</p>
              </div>
            </div>

            {/* Busiest server spotlight */}
            {mostActiveServer && (
              <div className="rounded-lg border border-border/50 bg-muted/20 p-3 mb-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Busiest Server</p>
                <Link href={`/servers/${mostActiveServer.server_id}`} className="group block">
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                    {mostActiveServer.current_server_name ?? "Unknown"}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="relative flex h-1.5 w-1.5 shrink-0">
                      <span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative rounded-full h-1.5 w-1.5 bg-green-500" />
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {mostActiveServer.current_player_count} / {mostActiveServer.current_max_players} players
                      {mostActiveServer.current_map && (
                        <span className="text-muted-foreground/60"> · {mostActiveServer.current_map.split("/").pop()?.replace(/_/g, " ")}</span>
                      )}
                    </p>
                  </div>
                </Link>
              </div>
            )}

            <Button asChild variant="ghost" size="sm" className="w-full text-xs text-muted-foreground h-8">
              <Link href="/servers">
                Browse all servers <ArrowRight className="ml-1.5 h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Mobile Full Report button */}
        <div className="flex lg:hidden">
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href="/game-health">30-Day Report</Link>
          </Button>
        </div>
      </div>

      {/* --- Community Bar --- */}
      <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card/30 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary shrink-0">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Join the Community</p>
            <p className="text-xs text-muted-foreground">Find clans, Discord servers, and organised events keeping BF1942 alive.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button asChild variant="outline" size="sm">
            <Link href="/community" className="flex items-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5" />
              Communities
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/orgs" className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              Clans &amp; Orgs
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
