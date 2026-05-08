"use client";

import { useReducer, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Activity, Users, AlertTriangle, ArrowRight, Server as ServerIcon, TrendingUp, TrendingDown, Shield, MessageCircle, Map as MapIcon, Clock } from "lucide-react";
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
  loading: boolean;
  error: string | null;
};

type HomeAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: { data: GlobalMetrics; topServers: Server[] } }
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
            topServers = sorted.slice(0, 12);
          }
        }

        dispatch({
          type: "FETCH_SUCCESS",
          payload: { data: parsed.data, topServers },
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

  const { data, topServers, loading, error } = state;

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

  const activeServerCount = topServers.filter(s => s.current_state === "ACTIVE").length;

  const heatmap = data.global_concurrency_heatmap_7d;
  const peakHourIndex = heatmap.length
    ? heatmap.reduce((maxIdx, val, idx, arr) => (val > arr[maxIdx] ? idx : maxIdx), 0)
    : -1;
  const peakHour = peakHourIndex >= 0 ? `${String(peakHourIndex).padStart(2, "0")}:00 UTC` : "—";

  const topMapRaw = data.popular_maps_7_days[0]?.map_name ?? "";
  const topMap = topMapRaw
    ? topMapRaw.split("/").pop()!.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
    : "—";

  const topMaps = data.popular_maps_7_days.slice(0, 7).map(m => ({
    name: m.map_name.split("/").pop()!.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
    rounds: m.rounds_played,
  }));
  const maxMapRounds = topMaps[0]?.rounds ?? 1;

  return (
    <div className="space-y-6 pb-8 sm:space-y-8">
      {/* --- Command Center Hero --- */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/60 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 px-4 py-8 shadow-2xl sm:px-12 sm:py-16">
        {/* Background Effects */}
        <div className="absolute -right-20 -top-20 h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] rounded-full bg-green-500/10 blur-[80px] sm:blur-[120px]" />
        <div className="absolute -bottom-20 -left-20 h-[250px] w-[250px] sm:h-[400px] sm:w-[400px] rounded-full bg-blue-500/10 blur-[70px] sm:blur-[100px]" />

        <div className="relative z-10">
          {/* Status Badge */}
          <div className="flex items-center gap-2 mb-4 sm:mb-6 animate-fade-in-up">
            <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-green-500"></span>
            </span>
            <Badge variant="outline" className="border-green-500/30 bg-green-500/10 text-green-400 font-mono text-[10px] sm:text-xs">
              <span className="hidden sm:inline">SYSTEM ONLINE // MONITORING ACTIVE FRONTS</span>
              <span className="sm:hidden">SYSTEM ONLINE</span>
            </Badge>
          </div>

          <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-7xl animate-fade-in-up stagger-1">
                <AnimatedCounter value={data.current_active_players} duration={1500} />
                <span className="block sm:inline sm:ml-3 mt-1 sm:mt-0 text-base sm:text-2xl lg:text-3xl font-normal text-slate-400">Soldiers Deployed</span>
              </h1>
              <p className="max-w-[500px] text-sm sm:text-lg text-slate-400 animate-fade-in-up stagger-2">
                Live telemetry from {activeServerCount} active battlefields worldwide.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-4 animate-fade-in-up stagger-3">
              <div className="flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-3 py-3 sm:px-5 sm:py-4 card-hover">
                <div className="rounded-md sm:rounded-lg bg-blue-500/20 p-1.5 sm:p-2.5 text-blue-400">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs font-medium uppercase text-slate-500">Total Players</p>
                  <p className="font-mono text-base sm:text-xl font-bold text-white">
                    <AnimatedCounter value={data.total_players_seen} duration={1200} />
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-3 py-3 sm:px-5 sm:py-4 card-hover">
                <div className="rounded-md sm:rounded-lg bg-amber-500/20 p-1.5 sm:p-2.5 text-amber-400">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs font-medium uppercase text-slate-500">Rounds Logged</p>
                  <p className="font-mono text-base sm:text-xl font-bold text-white">
                    <AnimatedCounter value={data.total_rounds_processed} duration={1200} />
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Chips */}
          <div className="mt-5 sm:mt-6 flex flex-wrap gap-2 sm:gap-3 animate-fade-in-up stagger-4">
            {([
              { label: "Active Servers", value: String(activeServerCount), Icon: ServerIcon },
              { label: "7-Day Players", value: data.active_players_7d.toLocaleString(), Icon: Users, change: data.active_players_7d_change_pct },
              { label: "Top Map", value: topMap, Icon: MapIcon },
              { label: "Peak Hour (UTC)", value: peakHour, Icon: Clock },
            ] as const).map(({ label, value, Icon, change }: any) => (
              <div key={label} className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm px-3 py-2.5">
                <Icon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider leading-none">{label}</p>
                  <p className="text-sm font-semibold text-white leading-tight mt-0.5 truncate">{value}</p>
                </div>
                {change !== undefined && (
                  <span className={cn("text-[10px] font-semibold ml-0.5 shrink-0", change >= 0 ? "text-green-400" : "text-red-400")}>
                    {change >= 0 ? "+" : ""}{change.toFixed(0)}%
                  </span>
                )}
              </div>
            ))}
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

        {/* Top Maps — 1/3 width */}
        <Card className="border-border/60 overflow-hidden">
          <CardHeader className="pb-2 border-b border-border/40">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="rounded-md bg-amber-500/10 p-1.5 text-amber-500">
                <MapIcon className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg">Top Maps</CardTitle>
                <CardDescription className="text-xs">Most played this week</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-4">
            <div className="space-y-3">
              {topMaps.map((map, i) => (
                <div key={map.name} className="group">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={cn(
                        "text-[10px] font-bold tabular-nums w-4 shrink-0",
                        i === 0 ? "text-amber-500" : i === 1 ? "text-slate-400" : i === 2 ? "text-amber-700" : "text-muted-foreground/50"
                      )}>#{i + 1}</span>
                      <span className="text-xs font-medium text-foreground truncate">{map.name}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground tabular-nums shrink-0 ml-2">{map.rounds.toLocaleString()}r</span>
                  </div>
                  <div className="h-1 rounded-full bg-border/40 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700",
                        i === 0 ? "bg-amber-500/70" : "bg-primary/50"
                      )}
                      style={{ width: `${Math.round((map.rounds / maxMapRounds) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-border/40">
              <Button asChild variant="ghost" size="sm" className="w-full text-xs text-muted-foreground h-8">
                <Link href="/game-health">
                  View full activity report <ArrowRight className="ml-1.5 h-3 w-3" />
                </Link>
              </Button>
            </div>
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
