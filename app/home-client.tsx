"use client";

import { useReducer, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Activity, AlertTriangle, ArrowRight, Server as ServerIcon, TrendingUp, TrendingDown } from "lucide-react";
import { AnimatedCounter } from "@/components/animated-counter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
        {/* Skeleton Hero */}
        <div className="py-8 sm:py-12">
          <Skeleton className="h-3 w-40 mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-0">
            <Skeleton className="h-24 sm:h-28 w-full" />
            <Skeleton className="h-20 sm:h-24 w-full" />
            <Skeleton className="h-20 sm:h-24 w-full" />
          </div>
        </div>

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
  const topActiveServers = allServers
    .filter(s => s.current_state === "ACTIVE" && s.current_player_count > 0)
    .slice(0, 3);

  return (
    <div className="space-y-6 pb-8 sm:space-y-8">
      {/* --- Hero --- */}
      <div className="relative pt-6 pb-8 sm:pt-8 sm:pb-10">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        {/* LIVE monitor label */}
        <div className="flex items-center gap-2.5 mb-8 sm:mb-10">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span className="text-[10px] font-mono font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Live Battlefield Monitor
          </span>
        </div>

        {/* Three stat columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3">
          {/* Right Now */}
          <div className="sm:pr-10 pb-7 sm:pb-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-3">Right Now</p>
            <div className="text-7xl sm:text-8xl font-black tabular-nums text-foreground leading-none tracking-tight">
              <AnimatedCounter value={data.current_active_players} duration={1500} />
            </div>
            <p className="text-lg sm:text-xl text-muted-foreground mt-3 font-light">Soldiers Deployed</p>
          </div>

          {/* This Week */}
          <div className="sm:px-10 sm:border-l sm:border-border/40 border-t border-border/40 sm:border-t-0 py-7 sm:py-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-3">This Week</p>
            <div className="text-5xl sm:text-6xl font-black tabular-nums text-foreground leading-none tracking-tight">
              {data.active_players_7d.toLocaleString()}
            </div>
            <div className={cn("flex items-center gap-1.5 mt-3 text-sm font-semibold",
              data.active_players_7d_change_pct >= 0 ? "text-emerald-500" : "text-red-400"
            )}>
              {data.active_players_7d_change_pct >= 0
                ? <TrendingUp className="h-4 w-4 shrink-0" />
                : <TrendingDown className="h-4 w-4 shrink-0" />}
              {data.active_players_7d_change_pct >= 0 ? "+" : ""}{data.active_players_7d_change_pct.toFixed(0)}% vs prior week
            </div>
          </div>

          {/* Last 24h */}
          <div className="sm:pl-10 sm:border-l sm:border-border/40 border-t border-border/40 sm:border-t-0 pt-7 sm:pt-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-3">Last 24 Hours</p>
            <div className="text-5xl sm:text-6xl font-black tabular-nums text-foreground leading-none tracking-tight">
              {data.active_players_24h.toLocaleString()}
            </div>
            <div className={cn("flex items-center gap-1.5 mt-3 text-sm font-semibold",
              data.active_players_24h_change_pct >= 0 ? "text-emerald-500" : "text-red-400"
            )}>
              {data.active_players_24h_change_pct >= 0
                ? <TrendingUp className="h-4 w-4 shrink-0" />
                : <TrendingDown className="h-4 w-4 shrink-0" />}
              {data.active_players_24h_change_pct >= 0 ? "+" : ""}{data.active_players_24h_change_pct.toFixed(0)}% vs yesterday
            </div>
          </div>
        </div>

        {/* Bottom separator */}
        <div className="mt-8 sm:mt-10 h-px bg-gradient-to-r from-border/70 via-border/30 to-transparent" />
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
          <CardContent className="p-4 space-y-4">
            {/* Proportional status bar — green / amber / red */}
            {totalServerCount > 0 && (
              <div>
                <div className="h-2.5 rounded-full overflow-hidden flex">
                  {activeServerCount > 0 && (
                    <div className="bg-green-500 transition-all" style={{ width: `${(activeServerCount / totalServerCount) * 100}%` }} />
                  )}
                  {emptyServerCount > 0 && (
                    <div className="bg-amber-500/60 transition-all" style={{ width: `${(emptyServerCount / totalServerCount) * 100}%` }} />
                  )}
                  {offlineServerCount > 0 && (
                    <div className="bg-red-500/50 transition-all" style={{ width: `${(offlineServerCount / totalServerCount) * 100}%` }} />
                  )}
                </div>
                <div className="flex justify-between mt-1.5 text-[10px] font-medium">
                  <span className="text-green-500">{activeServerCount} active</span>
                  <span className="text-amber-500/80">{emptyServerCount} empty</span>
                  <span className="text-red-400/70">{offlineServerCount} offline</span>
                </div>
              </div>
            )}

            {/* Three-count breakdown */}
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center py-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-2xl font-bold text-green-500 tabular-nums leading-none">{activeServerCount}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1.5">Active</p>
              </div>
              <div className="text-center py-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-2xl font-bold text-amber-500 tabular-nums leading-none">{emptyServerCount}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1.5">Empty</p>
              </div>
              <div className="text-center py-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-2xl font-bold text-red-500/70 tabular-nums leading-none">{offlineServerCount}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1.5">Offline</p>
              </div>
            </div>

            {/* Top 3 active servers */}
            {topActiveServers.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground pt-1">Active Now</p>
                {topActiveServers.map((server) => {
                  const fillPct = server.current_max_players > 0
                    ? Math.round((server.current_player_count / server.current_max_players) * 100)
                    : 0;
                  return (
                    <Link key={server.server_id} href={`/servers/${server.server_id}`} className="group block">
                      <div className="rounded-lg border border-border/50 bg-muted/10 hover:bg-muted/30 hover:border-primary/30 transition-all p-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors leading-snug truncate">
                            {server.current_server_name ?? "Unknown"}
                          </p>
                          <span className="text-xs font-bold tabular-nums text-foreground shrink-0">
                            {server.current_player_count}<span className="text-muted-foreground font-normal">/{server.current_max_players}</span>
                          </span>
                        </div>
                        <div className="h-1 rounded-full bg-border/40 overflow-hidden mb-2">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              fillPct >= 70 ? "bg-green-500" : fillPct >= 40 ? "bg-emerald-500/70" : "bg-primary/50"
                            )}
                            style={{ width: `${fillPct}%` }}
                          />
                        </div>
                        {server.current_map && (
                          <p className="text-[10px] text-muted-foreground/60 truncate">
                            {server.current_map.split("/").pop()?.replace(/_/g, " ")}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            <Button asChild variant="ghost" size="sm" className="w-full text-xs text-muted-foreground h-8 !mt-2">
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

    </div>
  );
}
