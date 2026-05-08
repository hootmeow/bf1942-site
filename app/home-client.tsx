"use client";

import { useReducer, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Activity, AlertTriangle, ArrowRight, Server as ServerIcon, TrendingUp, TrendingDown, Clock } from "lucide-react";
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

  const chartStats = useMemo(() => {
    if (!data) return null;
    const tl = data.global_concurrency_timeline_24h ?? [];
    if (tl.length === 0) return null;
    const totals = tl.map(t => t.total ?? 0);
    const peak = Math.max(...totals);
    const avg = Math.round(totals.reduce((a, b) => a + b, 0) / totals.length);
    return { peak, avg };
  }, [data]);

  // Hourly activity buckets — derived from heatmap (length 24, indexed by hour-of-day)
  const hourlyActivity = useMemo(() => {
    if (!data) return null;
    const raw = data.global_concurrency_heatmap_24h ?? [];
    if (raw.length === 0) return null;
    // Normalize to length 24 in case the source is offset; we trust it's hour-keyed already
    const hours = Array.from({ length: 24 }, (_, h) => raw[h] ?? 0);
    const max = Math.max(...hours, 1);
    const peakHour = hours.indexOf(max);
    const currentHour = new Date().getHours();
    return { hours, max, peakHour, currentHour };
  }, [data]);

  if (loading) {
    return (
      <div className="space-y-8 pb-8">
        <Skeleton className="h-[340px] sm:h-[380px] w-full rounded-2xl" />
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

  return (
    <div className="space-y-6 pb-8 sm:space-y-8">
      {/* ============================================================
           HERO — "Frontline"  (muted military, no HUD cosplay)
         ============================================================ */}
      <section className="relative overflow-hidden rounded-2xl border border-border/60 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55)]">
        {/* Base — deep field gradient with subtle olive tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#10130d] via-[#13160f] to-[#0b0d09]" />
        {/* Warm rim light bottom-right */}
        <div className="absolute -right-32 -bottom-32 h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,rgba(202,138,4,0.18),transparent_60%)] pointer-events-none" />
        {/* Cool rim light top-left */}
        <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(120,140,98,0.12),transparent_60%)] pointer-events-none" />

        {/* Topographic contour lines — SVG */}
        <svg
          aria-hidden
          className="absolute inset-0 h-full w-full pointer-events-none"
          preserveAspectRatio="none"
          viewBox="0 0 1200 500"
        >
          <defs>
            <linearGradient id="topoFade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="rgba(180,170,120,0.0)" />
              <stop offset="0.4" stopColor="rgba(180,170,120,0.18)" />
              <stop offset="1" stopColor="rgba(180,170,120,0.0)" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
            const baseY = 80 + i * 48;
            const amp = 18 + (i % 3) * 6;
            const phase = i * 0.6;
            // Smooth hand-drawn-ish path
            const pts = Array.from({ length: 13 }, (_, k) => {
              const x = (k / 12) * 1200;
              const y = baseY + Math.sin(k * 0.7 + phase) * amp + Math.cos(k * 0.3 + phase) * (amp * 0.4);
              return `${k === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
            }).join(" ");
            return (
              <path
                key={i}
                d={pts}
                fill="none"
                stroke="url(#topoFade)"
                strokeWidth={i % 4 === 0 ? 1.4 : 0.7}
                opacity={0.5}
              />
            );
          })}
        </svg>

        {/* Diagonal stencil stripe — subtle, like painted insignia */}
        <div
          className="absolute right-0 top-0 bottom-0 w-1/3 opacity-[0.04] pointer-events-none mix-blend-screen"
          style={{
            backgroundImage: "repeating-linear-gradient(135deg, rgba(255,240,200,0.7) 0 2px, transparent 2px 14px)",
            maskImage: "linear-gradient(to left, black, transparent)",
            WebkitMaskImage: "linear-gradient(to left, black, transparent)",
          }}
        />

        {/* Drifting embers — atmosphere */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[15, 32, 48, 64, 78, 88].map((x, i) => (
            <span
              key={i}
              className="absolute bottom-0 h-1 w-1 rounded-full bg-amber-300/40 blur-[1px] animate-ember"
              style={{
                left: `${x}%`,
                animationDelay: `${i * 1.7}s`,
                animationDuration: `${10 + i}s`,
              }}
            />
          ))}
        </div>

        {/* Faint film grain via box-shadow stipple — using a layered radial */}
        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)",
            backgroundSize: "3px 3px, 7px 7px",
            backgroundPosition: "0 0, 1px 2px",
          }}
        />

        <div className="relative z-10 px-5 py-9 sm:px-10 sm:py-14 lg:px-14">
          {/* Tagline */}
          <div className="flex items-center gap-3 mb-7">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-400/50" />
            <span className="text-[10px] font-semibold tracking-[0.32em] uppercase text-amber-200/70">
              Battlefield 1942 · Online Now
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-amber-400/30 to-transparent" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-14 items-end">
            {/* Left — count + headline */}
            <div className="min-w-0">
              <div className="text-[5.5rem] sm:text-[7rem] lg:text-[9.5rem] font-black leading-[0.82] tracking-tight tabular-nums text-stone-100 [text-shadow:0_2px_24px_rgba(0,0,0,0.4)]">
                <AnimatedCounter value={data.current_active_players} duration={1500} />
              </div>
              <h1 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-stone-200">
                Players in combat <span className="text-amber-300/90">right now</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm sm:text-base text-stone-400/90 leading-relaxed">
                Live telemetry from{" "}
                <span className="font-semibold text-stone-200">{activeServerCount}</span>
                {" "}of{" "}
                <span className="font-semibold text-stone-200">{totalServerCount}</span>
                {" "}tracked servers worldwide. Updated continuously as battles unfold.
              </p>
            </div>

            {/* Right — dog-tag style stat plates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              <DogTag
                label="Last 24 Hours"
                value={data.active_players_24h.toLocaleString()}
                sub="unique players"
                changePct={data.active_players_24h_change_pct}
                changeLabel="vs yesterday"
              />
              <DogTag
                label="Last 7 Days"
                value={data.active_players_7d.toLocaleString()}
                sub="unique players"
                changePct={data.active_players_7d_change_pct}
                changeLabel="vs prior week"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
           Top Active Servers (UNCHANGED)
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
           Player Activity  +  Peak Hours
         ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="lg:col-span-2 border-border/60 overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/40">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="rounded-md bg-primary/10 p-1.5 text-primary ring-1 ring-primary/20">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-base sm:text-lg">Player Activity</CardTitle>
                  <CardDescription className="text-xs">Global concurrency over time</CardDescription>
                </div>
              </div>
              <Button asChild variant="ghost" size="sm" className="hidden sm:flex text-xs text-muted-foreground">
                <Link href="/game-health">
                  Full Report <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>

            {chartStats && (
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4">
                <ChartStatBadge label="Now" value={data.current_active_players.toLocaleString()} accent="emerald" />
                <ChartStatBadge label="24h Avg" value={chartStats.avg.toLocaleString()} accent="blue" />
                <ChartStatBadge label="24h Peak" value={chartStats.peak.toLocaleString()} accent="amber" />
              </div>
            )}
          </CardHeader>
          <CardContent className="p-3 sm:p-5">
            <PlayerActivityChart
              data24h={data.global_concurrency_timeline_24h || data.global_concurrency_heatmap_24h}
              data7d={data.global_concurrency_timeline_7d || data.global_concurrency_heatmap_7d}
            />
          </CardContent>
        </Card>

        {/* Peak Hours — distinct from the timeline chart, no overlap with active-server cards */}
        <Card className="border-border/60 overflow-hidden">
          <CardHeader className="pb-2 border-b border-border/40">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="rounded-md bg-amber-500/10 p-1.5 text-amber-500 ring-1 ring-amber-500/20">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg">Peak Hours</CardTitle>
                <CardDescription className="text-xs">When the servers fill up · your local time</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {hourlyActivity ? (
              <PeakHours data={hourlyActivity} />
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-40" />
                Hourly data unavailable.
              </div>
            )}
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

function DogTag({
  label,
  value,
  sub,
  changePct,
  changeLabel,
}: {
  label: string;
  value: string;
  sub?: string;
  changePct?: number;
  changeLabel?: string;
}) {
  const positive = (changePct ?? 0) >= 0;
  return (
    <div className="relative rounded-lg border border-stone-700/40 bg-gradient-to-br from-stone-900/80 to-stone-950/60 backdrop-blur-sm p-4 overflow-hidden">
      {/* Edge accent */}
      <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r bg-gradient-to-b from-amber-500/70 via-amber-600/30 to-transparent" />
      <div className="pl-2">
        <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-stone-400">{label}</p>
        <div className="mt-1.5 flex items-baseline gap-2 flex-wrap">
          <span className="text-3xl sm:text-4xl font-bold tabular-nums text-stone-100 leading-none">
            {value}
          </span>
          {sub && <span className="text-xs text-stone-500">{sub}</span>}
        </div>
        {typeof changePct === "number" && (
          <p className={cn(
            "mt-2.5 text-xs font-medium flex items-center gap-1.5",
            positive ? "text-emerald-400/90" : "text-red-400/90"
          )}>
            {positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            <span className="tabular-nums">{positive ? "+" : ""}{changePct.toFixed(0)}%</span>
            {changeLabel && <span className="text-stone-500 font-normal">{changeLabel}</span>}
          </p>
        )}
      </div>
    </div>
  );
}

const accentMap = {
  emerald: { text: "text-emerald-400", border: "border-emerald-500/20" },
  blue:    { text: "text-blue-400",    border: "border-blue-500/20" },
  amber:   { text: "text-amber-400",   border: "border-amber-500/20" },
} as const;

function ChartStatBadge({ label, value, accent }: { label: string; value: string; accent: keyof typeof accentMap }) {
  const c = accentMap[accent];
  return (
    <div className={cn("rounded-lg border bg-card/40 px-3 py-2", c.border)}>
      <p className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground">{label}</p>
      <p className={cn("text-lg sm:text-xl font-bold tabular-nums leading-tight", c.text)}>{value}</p>
    </div>
  );
}

function PeakHours({ data }: { data: { hours: number[]; max: number; peakHour: number; currentHour: number } }) {
  const { hours, max, peakHour, currentHour } = data;

  const formatHour = (h: number) => {
    const suffix = h >= 12 ? "p" : "a";
    const display = h % 12 === 0 ? 12 : h % 12;
    return `${display}${suffix}`;
  };

  return (
    <div className="space-y-3">
      {/* Peak callout */}
      <div className="flex items-baseline justify-between pb-2 border-b border-border/40">
        <div>
          <p className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground">Peak time</p>
          <p className="text-xl font-bold text-amber-400 leading-tight">
            {formatHour(peakHour)} – {formatHour((peakHour + 1) % 24)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground">Right now</p>
          <p className="text-xl font-bold text-emerald-400 tabular-nums leading-tight">
            {hours[currentHour].toLocaleString()}
          </p>
        </div>
      </div>

      {/* 24-hour bar grid */}
      <div className="flex items-end gap-[3px] h-[140px]">
        {hours.map((v, h) => {
          const pct = (v / max) * 100;
          const isCurrent = h === currentHour;
          const isPeak = h === peakHour;
          return (
            <div key={h} className="group relative flex-1 flex flex-col justify-end">
              <div
                className={cn(
                  "w-full rounded-sm transition-all",
                  isPeak
                    ? "bg-gradient-to-t from-amber-600 to-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.4)]"
                    : isCurrent
                    ? "bg-gradient-to-t from-emerald-600 to-emerald-400"
                    : "bg-stone-600/50 group-hover:bg-stone-500/70"
                )}
                style={{ height: `${Math.max(pct, 4)}%`, minHeight: "3px" }}
              />
              {/* Hover tooltip */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block z-10 pointer-events-none">
                <div className="bg-popover border border-border rounded px-1.5 py-0.5 text-[10px] font-mono whitespace-nowrap shadow">
                  <span className="text-foreground tabular-nums">{v.toLocaleString()}</span>
                  <span className="text-muted-foreground"> @ {formatHour(h)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hour axis labels — every 6h */}
      <div className="flex justify-between text-[10px] font-medium text-muted-foreground tabular-nums px-[1px]">
        <span>12a</span>
        <span>6a</span>
        <span>12p</span>
        <span>6p</span>
        <span>11p</span>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 pt-2 text-[10px] text-muted-foreground border-t border-border/40">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-amber-400" /> Peak hour
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-emerald-400" /> Current hour
        </span>
      </div>
    </div>
  );
}
