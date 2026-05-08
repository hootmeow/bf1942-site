"use client";

import { useReducer, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Activity, AlertTriangle, ArrowRight, Server as ServerIcon, TrendingUp, TrendingDown, Map as MapIcon, Crosshair } from "lucide-react";
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

const PlayerActivityChart = dynamic(
  () => import("@/components/charts").then((mod) => ({ default: mod.PlayerActivityChart })),
  {
    loading: () => <LoadingState variant="skeleton" skeletonHeight="h-[300px]" />,
    ssr: false,
  }
);

const SERVER_STATUS_ORDER: Record<string, number> = {
  ACTIVE: 1,
  EMPTY: 2,
  OFFLINE: 3
};

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

// Deterministic pseudo-random pings for the radar — stable across renders
const RADAR_PINGS = [
  { x: 22, y: 34, delay: 0 },
  { x: 68, y: 18, delay: 0.6 },
  { x: 81, y: 62, delay: 1.2 },
  { x: 14, y: 71, delay: 1.8 },
  { x: 47, y: 52, delay: 2.4 },
  { x: 58, y: 82, delay: 0.3 },
  { x: 35, y: 14, delay: 1.5 },
  { x: 88, y: 38, delay: 2.1 },
];

function formatMapName(raw: string): string {
  return raw
    .split("/").pop()!
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
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

        if (!metricsRes.ok) throw new Error("Failed to fetch metrics");
        const metricsJson = await metricsRes.json();
        const parsed = GlobalMetricsSchema.safeParse(metricsJson);

        if (!parsed.success) {
          console.error("Metrics validation error:", parsed.error);
          throw new Error("Invalid metrics data");
        }

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

  // Derived chart stats — always called (hooks rule), null-safe
  const chartStats = useMemo(() => {
    if (!data) return null;
    const tl = data.global_concurrency_timeline_24h ?? [];
    if (tl.length === 0) return null;
    const totals = tl.map(t => t.total ?? 0);
    const peak = Math.max(...totals);
    const avg = Math.round(totals.reduce((a, b) => a + b, 0) / totals.length);
    return { peak, avg };
  }, [data]);

  if (loading) {
    return (
      <div className="space-y-8 pb-8">
        <Skeleton className="h-[360px] sm:h-[420px] w-full rounded-2xl sm:rounded-3xl" />
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
  const totalServerCount = allServers.length;
  const totalPlayerCapacity = allServers.reduce((sum, s) => sum + (s.current_max_players || 0), 0);

  const weekChange = data.active_players_7d_change_pct;
  const dayChange = data.active_players_24h_change_pct;

  // Top maps from popular_maps_7_days, normalized
  const topMaps = (data.popular_maps_7_days ?? [])
    .slice(0, 6)
    .map(m => ({
      name: formatMapName(m.map_name),
      rounds: m.rounds_played,
    }));
  const maxRounds = topMaps.length > 0 ? Math.max(...topMaps.map(m => m.rounds)) : 1;

  return (
    <div className="space-y-6 pb-8 sm:space-y-8">
      {/* ============================================================
           HERO — Command Center
         ============================================================ */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/60 bg-[#070912] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
        {/* Layered atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#0a0e1d] to-black pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_10%,rgba(34,197,94,0.10),transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_90%_100%,rgba(59,130,246,0.08),transparent_60%)] pointer-events-none" />

        {/* Topographic grid */}
        <div
          className="absolute inset-0 opacity-[0.18] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(74,222,128,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.06) 1px, transparent 1px)`,
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 100% 80% at 50% 50%, black 40%, transparent 95%)",
            WebkitMaskImage: "radial-gradient(ellipse 100% 80% at 50% 50%, black 40%, transparent 95%)",
          }}
        />

        {/* Drifting scanline */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent animate-scanline" />
        </div>

        {/* Pulsing pings, scattered like server geo-pings */}
        <div className="absolute inset-0 pointer-events-none">
          {RADAR_PINGS.map((p, i) => (
            <div
              key={i}
              className="absolute"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span
                  className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 animate-radar-ping"
                  style={{ animationDelay: `${p.delay}s` }}
                />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400/70 shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
              </span>
            </div>
          ))}
        </div>

        {/* HUD corner brackets */}
        <div className="absolute top-3 left-3 sm:top-5 sm:left-5 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-l-2 border-emerald-400/40 pointer-events-none" />
        <div className="absolute top-3 right-3 sm:top-5 sm:right-5 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-r-2 border-emerald-400/40 pointer-events-none" />
        <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-l-2 border-emerald-400/40 pointer-events-none" />
        <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-r-2 border-emerald-400/40 pointer-events-none" />

        <div className="relative z-10 px-5 py-8 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 lg:gap-12 items-center">
            {/* Left — primary readout */}
            <div className="min-w-0">
              {/* Tag row */}
              <div className="flex flex-wrap items-center gap-3 mb-7">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  <span className="text-[10px] font-mono tracking-[0.2em] font-semibold text-emerald-300 uppercase">
                    Live Feed
                  </span>
                </div>
                <span className="text-[10px] font-mono tracking-[0.18em] text-slate-500 uppercase animate-hud-flicker">
                  Channel · Global · BF1942
                </span>
              </div>

              {/* Massive count */}
              <div className="relative">
                <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-emerald-400/70 mb-3">
                  // Soldiers Deployed
                </p>
                <div className="flex items-baseline gap-4 flex-wrap">
                  <div className="text-7xl sm:text-8xl lg:text-[9rem] font-black tabular-nums leading-[0.85] tracking-tighter bg-gradient-to-b from-white via-white to-emerald-200/80 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(74,222,128,0.15)]">
                    <AnimatedCounter value={data.current_active_players} duration={1500} />
                  </div>
                  <div className="text-emerald-400/50 font-mono text-2xl sm:text-3xl pb-2 animate-hud-pulse">
                    ◢
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                  <span className="text-slate-300">
                    Across <span className="text-emerald-400 font-semibold tabular-nums">{activeServerCount}</span> active fronts
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400 font-mono text-xs tracking-wide">
                    {totalServerCount} servers tracked
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400 font-mono text-xs tracking-wide">
                    {totalPlayerCapacity.toLocaleString()} max capacity
                  </span>
                </div>
              </div>

              {/* Stat tiles */}
              <div className="mt-9 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl">
                <StatTile
                  label="Last 24h"
                  value={data.active_players_24h.toLocaleString()}
                  changePct={dayChange}
                  icon={<Activity className="h-3.5 w-3.5" />}
                  accent="blue"
                />
                <StatTile
                  label="Last 7 Days"
                  value={data.active_players_7d.toLocaleString()}
                  changePct={weekChange}
                  icon={<TrendingUp className="h-3.5 w-3.5" />}
                  accent="emerald"
                />
                <StatTile
                  label="Total Tracked"
                  value={data.total_players_seen.toLocaleString()}
                  icon={<Crosshair className="h-3.5 w-3.5" />}
                  accent="amber"
                  className="col-span-2 sm:col-span-1"
                />
              </div>
            </div>

            {/* Right — radar visual (hidden on small screens) */}
            <div className="hidden lg:flex items-center justify-center shrink-0">
              <div className="relative w-[280px] h-[280px] xl:w-[320px] xl:h-[320px]">
                {/* Concentric rings */}
                <div className="absolute inset-0 rounded-full border border-emerald-400/20" />
                <div className="absolute inset-[12%] rounded-full border border-emerald-400/15" />
                <div className="absolute inset-[28%] rounded-full border border-emerald-400/10" />
                <div className="absolute inset-[44%] rounded-full border border-emerald-400/10" />
                {/* Crosshair lines */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-emerald-400/15" />
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-emerald-400/15" />
                {/* Center dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(74,222,128,0.9)]" />
                </div>
                {/* Sweep arm */}
                <div className="absolute inset-0 animate-radar-sweep">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "conic-gradient(from 0deg, transparent 0deg, transparent 320deg, rgba(74,222,128,0.0) 330deg, rgba(74,222,128,0.45) 358deg, rgba(74,222,128,0.0) 360deg)",
                      maskImage: "radial-gradient(circle, black 60%, transparent 100%)",
                      WebkitMaskImage: "radial-gradient(circle, black 60%, transparent 100%)",
                    }}
                  />
                </div>
                {/* Active server markers — scaled to active count */}
                <ServerMarker x={62} y={28} delay="0s" />
                <ServerMarker x={28} y={48} delay="0.7s" />
                <ServerMarker x={72} y={66} delay="1.3s" />
                <ServerMarker x={50} y={78} delay="2.0s" />
                {/* Outer label */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-[9px] font-mono tracking-[0.3em] text-emerald-400/60 uppercase">
                  Sector Scan
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-mono tracking-[0.3em] text-emerald-400/40 uppercase">
                  {activeServerCount} contacts
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
           Top Active Servers (UNCHANGED behavior)
         ============================================================ */}
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

        <LiveTicker className="rounded-lg border border-border/60 bg-card/50" />

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

        <div className="flex sm:hidden">
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href="/servers">View All Servers</Link>
          </Button>
        </div>
      </div>

      {/* ============================================================
           Player Activity (improved)  +  Top Maps (replaces redundant Server Network)
         ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Player Activity — bigger, more cinematic */}
        <Card className="lg:col-span-2 border-border/60 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-emerald-500/[0.03] pointer-events-none" />
          <CardHeader className="pb-3 border-b border-border/40 relative">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="rounded-md bg-primary/10 p-1.5 text-primary ring-1 ring-primary/20">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    Player Activity
                    <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-mono tracking-widest uppercase text-emerald-400/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live
                    </span>
                  </CardTitle>
                  <CardDescription className="text-xs">Global concurrency over time</CardDescription>
                </div>
              </div>
              <Button asChild variant="ghost" size="sm" className="hidden sm:flex text-xs text-muted-foreground">
                <Link href="/game-health">
                  Full Report <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>

            {/* Stat strip */}
            {chartStats && (
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4">
                <ChartStatBadge label="Now" value={data.current_active_players.toLocaleString()} accent="emerald" />
                <ChartStatBadge label="24h Avg" value={chartStats.avg.toLocaleString()} accent="blue" />
                <ChartStatBadge label="24h Peak" value={chartStats.peak.toLocaleString()} accent="amber" />
              </div>
            )}
          </CardHeader>
          <CardContent className="p-3 sm:p-5 relative">
            <PlayerActivityChart
              data24h={data.global_concurrency_timeline_24h || data.global_concurrency_heatmap_24h}
              data7d={data.global_concurrency_timeline_7d || data.global_concurrency_heatmap_7d}
            />
          </CardContent>
        </Card>

        {/* Top Maps — replaces redundant Server Network */}
        <Card className="border-border/60 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.04] via-transparent to-transparent pointer-events-none" />
          <CardHeader className="pb-2 border-b border-border/40 relative">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="rounded-md bg-amber-500/10 p-1.5 text-amber-500 ring-1 ring-amber-500/20">
                <MapIcon className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg">Most Played Maps</CardTitle>
                <CardDescription className="text-xs">Past 7 days · by rounds played</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 relative">
            {topMaps.length > 0 ? (
              <ol className="space-y-2.5">
                {topMaps.map((m, idx) => {
                  const pct = (m.rounds / maxRounds) * 100;
                  const isTop = idx === 0;
                  return (
                    <li key={m.name + idx} className="group">
                      <Link href={`/wiki/maps`} className="block">
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              "shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-mono font-bold tabular-nums",
                              isTop
                                ? "bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/40"
                                : "bg-muted/40 text-muted-foreground"
                            )}
                          >
                            {idx + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline justify-between gap-2 mb-1">
                              <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                {m.name}
                              </p>
                              <span className="text-xs font-mono tabular-nums text-muted-foreground shrink-0">
                                {m.rounds.toLocaleString()}
                              </span>
                            </div>
                            <div className="h-1.5 rounded-full bg-border/40 overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full transition-all duration-700",
                                  isTop
                                    ? "bg-gradient-to-r from-amber-500 to-orange-400"
                                    : "bg-gradient-to-r from-primary/70 to-primary/40"
                                )}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground">
                <MapIcon className="h-8 w-8 mx-auto mb-2 opacity-40" />
                No map data yet.
              </div>
            )}

            <Button asChild variant="ghost" size="sm" className="w-full text-xs text-muted-foreground h-8 mt-4">
              <Link href="/wiki/maps">
                Browse map wiki <ArrowRight className="ml-1.5 h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <div className="flex lg:hidden">
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href="/game-health">30-Day Report</Link>
          </Button>
        </div>
      </div>

    </div>
  );
}

/* --------------------- Sub-components --------------------- */

const accentMap = {
  emerald: { text: "text-emerald-400", bg: "bg-emerald-500/10", ring: "ring-emerald-500/30", border: "border-emerald-500/20" },
  blue:    { text: "text-blue-400",    bg: "bg-blue-500/10",    ring: "ring-blue-500/30",    border: "border-blue-500/20" },
  amber:   { text: "text-amber-400",   bg: "bg-amber-500/10",   ring: "ring-amber-500/30",   border: "border-amber-500/20" },
} as const;

function StatTile({
  label,
  value,
  changePct,
  icon,
  accent,
  className,
}: {
  label: string;
  value: string;
  changePct?: number;
  icon: React.ReactNode;
  accent: keyof typeof accentMap;
  className?: string;
}) {
  const c = accentMap[accent];
  const positive = (changePct ?? 0) >= 0;
  return (
    <div className={cn(
      "relative rounded-lg border bg-white/[0.025] backdrop-blur p-3.5 overflow-hidden",
      "border-white/[0.08] hover:border-white/[0.14] transition-colors",
      className
    )}>
      <div className="flex items-center gap-1.5 mb-2">
        <div className={cn("rounded p-1", c.bg, c.text)}>{icon}</div>
        <p className="text-[10px] font-mono tracking-[0.18em] uppercase text-slate-400">{label}</p>
      </div>
      <p className="text-2xl sm:text-3xl font-black tabular-nums text-white leading-none">{value}</p>
      {typeof changePct === "number" && (
        <p className={cn("mt-2 text-[10px] font-mono font-semibold flex items-center gap-1",
          positive ? "text-emerald-400" : "text-red-400"
        )}>
          {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {positive ? "+" : ""}{changePct.toFixed(0)}%
          <span className="text-slate-500 font-normal ml-1">vs prior</span>
        </p>
      )}
    </div>
  );
}

function ChartStatBadge({ label, value, accent }: { label: string; value: string; accent: keyof typeof accentMap }) {
  const c = accentMap[accent];
  return (
    <div className={cn("rounded-lg border bg-card/40 px-3 py-2", c.border)}>
      <p className="text-[9px] font-mono tracking-widest uppercase text-muted-foreground">{label}</p>
      <p className={cn("text-lg sm:text-xl font-bold tabular-nums leading-tight", c.text)}>{value}</p>
    </div>
  );
}

function ServerMarker({ x, y, delay }: { x: number; y: number; delay: string }) {
  return (
    <div className="absolute" style={{ left: `${x}%`, top: `${y}%` }}>
      <span className="relative flex h-2 w-2 -translate-x-1 -translate-y-1">
        <span
          className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 animate-radar-ping"
          style={{ animationDelay: delay }}
        />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.9)]" />
      </span>
    </div>
  );
}
