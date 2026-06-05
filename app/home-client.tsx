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
    const hours = Array.from({ length: 24 }, (_, h) => raw[h] ?? 0);
    const max = Math.max(...hours, 1);
    const min = Math.min(...hours);
    const peakHour = hours.indexOf(max);
    const quietHour = hours.indexOf(min);
    const currentHour = new Date().getHours();
    const avg = Math.round(hours.reduce((a, b) => a + b, 0) / 24);

    // Best 3-hour rolling window
    let bestWindowStart = 0;
    let bestWindowSum = -Infinity;
    for (let i = 0; i < 24; i++) {
      const sum = hours[i] + hours[(i + 1) % 24] + hours[(i + 2) % 24];
      if (sum > bestWindowSum) {
        bestWindowSum = sum;
        bestWindowStart = i;
      }
    }
    const bestWindowAvg = Math.round(bestWindowSum / 3);

    return { hours, max, min, peakHour, quietHour, currentHour, avg, bestWindowStart, bestWindowAvg };
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
           HERO — "Frontline"  (military olive + gold accent)
         ============================================================ */}
      <section className="relative overflow-hidden rounded-2xl border border-[#1e2a14] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55)]"
        style={{ background: "linear-gradient(135deg, #0d1208 0%, #0a0f06 55%, #060a04 100%)" }}
      >
        {/* Glow orbs */}
        <div className="absolute -right-32 -bottom-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(107,140,58,0.12),transparent_65%)] pointer-events-none" />
        <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(217,119,6,0.06),transparent_65%)] pointer-events-none" />

        <div className="relative z-10 px-5 py-9 sm:px-10 sm:py-14 lg:px-14">
          {/* Tagline */}
          <div className="flex items-center gap-3 mb-7">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/40" />
            <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-primary/60">
              Battlefield 1942 · Online Now
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-primary/25 to-transparent" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-14 items-end">
            {/* Left — count + headline */}
            <div className="min-w-0">
              <div className="text-[5.5rem] sm:text-[7rem] lg:text-[9.5rem] font-black leading-[0.82] tracking-tight tabular-nums text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.4)]">
                <AnimatedCounter value={data.current_active_players} duration={1500} />
              </div>
              <h1 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-300">
                Players in combat <span className="text-primary">right now</span>
              </h1>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/[0.08] px-3 py-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  <span className="font-mono text-xs text-emerald-300/80 tabular-nums">
                    {activeServerCount} active
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1e2a14] bg-[#0a0f06]/60 px-3 py-1.5">
                  <ServerIcon className="h-3 w-3 text-slate-500" />
                  <span className="font-mono text-xs text-slate-400 tabular-nums">
                    {totalServerCount} tracked
                  </span>
                </span>
              </div>
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
        <Card className="lg:col-span-2 border-border/60 overflow-hidden relative">
          {/* Subtle ambient backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(101,163,13,0.07),transparent_60%)] pointer-events-none" />
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent pointer-events-none" />

          <CardHeader className="pb-3 border-b border-border/40 relative">
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
                <ChartStatBadge label="24h Avg" value={chartStats.avg.toLocaleString()} accent="stone" />
                <ChartStatBadge label="24h Peak" value={chartStats.peak.toLocaleString()} accent="olive" />
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

        {/* Peak Hours — distinct from the timeline chart, no overlap with active-server cards */}
        <Card className="border-border/60 overflow-hidden">
          <CardHeader className="pb-2 border-b border-border/40">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="rounded-md bg-primary/10 p-1.5 text-primary ring-1 ring-primary/20">
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
    <div className="relative rounded-lg border border-[#1e2a14] bg-[#070b05] p-4 overflow-hidden">
      <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r bg-gradient-to-b from-amber-400/70 via-amber-600/20 to-transparent" />
      <div className="pl-2">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted-foreground/50">{label}</p>
        <div className="mt-1.5 flex items-baseline gap-2 flex-wrap">
          <span className="text-3xl sm:text-4xl font-bold tabular-nums text-white leading-none">
            {value}
          </span>
          {sub && <span className="text-xs text-muted-foreground/50">{sub}</span>}
        </div>
        {typeof changePct === "number" && (
          <p className={cn(
            "mt-2.5 text-xs font-medium flex items-center gap-1.5",
            positive ? "text-emerald-400/90" : "text-red-400/90"
          )}>
            {positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            <span className="tabular-nums">{positive ? "+" : ""}{changePct.toFixed(0)}%</span>
            {changeLabel && <span className="text-muted-foreground/40 font-normal">{changeLabel}</span>}
          </p>
        )}
      </div>
    </div>
  );
}

const accentMap = {
  emerald: { text: "text-emerald-400", border: "border-emerald-500/20" },
  blue:    { text: "text-blue-400",    border: "border-blue-500/20" },
  olive:   { text: "text-amber-400",   border: "border-amber-500/20" },
  stone:   { text: "text-slate-300",   border: "border-[#1e2a14]" },
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

type HourlyData = {
  hours: number[];
  max: number;
  min: number;
  peakHour: number;
  quietHour: number;
  currentHour: number;
  avg: number;
  bestWindowStart: number;
  bestWindowAvg: number;
};

function PeakHours({ data }: { data: HourlyData }) {
  const { hours, max, peakHour, currentHour, avg, bestWindowStart, bestWindowAvg } = data;

  const formatHour = (h: number) => {
    const suffix = h >= 12 ? "p" : "a";
    const display = h % 12 === 0 ? 12 : h % 12;
    return `${display}${suffix}`;
  };

  // Color-encode bars by intensity: stone → olive → lime → gold at peak
  const getBarColor = (v: number) => {
    const t = max > 0 ? v / max : 0;
    if (t >= 0.85) return "from-amber-400 to-amber-300";
    if (t >= 0.65) return "from-primary to-amber-400";
    if (t >= 0.45) return "from-primary/80 to-primary";
    if (t >= 0.25) return "from-[#1e2a14] to-primary/60";
    return "from-[#1e2a14] to-[#2a3a1a]";
  };

  // Build smooth area path overlay (sparkline-style)
  const W = 100;
  const H = 100;
  const stepX = W / 23;
  const points = hours.map((v, i) => {
    const x = i * stepX;
    const y = H - (v / max) * H * 0.95;
    return [x, y] as const;
  });
  const linePath = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  const areaPath = `${linePath} L${W},${H} L0,${H} Z`;

  return (
    <div className="space-y-4">
      {/* Top stat row — Now vs Peak */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-2.5">
          <p className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Right Now
          </p>
          <p className="mt-0.5 text-lg font-bold tabular-nums text-emerald-400 leading-tight">
            {hours[currentHour].toLocaleString()}
          </p>
          <p className="text-[10px] text-muted-foreground tabular-nums">{formatHour(currentHour)} hour</p>
        </div>
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-2.5">
          <p className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground">Peak Hour</p>
          <p className="mt-0.5 text-lg font-bold tabular-nums text-yellow-400 leading-tight">
            {max.toLocaleString()}
          </p>
          <p className="text-[10px] text-muted-foreground tabular-nums">{formatHour(peakHour)}–{formatHour((peakHour + 1) % 24)}</p>
        </div>
      </div>

      {/* Chart — 24 bars + smooth area overlay */}
      <div className="relative">
        {/* Average reference line */}
        <div
          className="absolute inset-x-0 border-t border-dashed border-[#1e2a14] z-10 pointer-events-none"
          style={{ top: `${100 - (avg / max) * 95}%` }}
        >
          <span className="absolute -top-3 right-0 font-mono text-[9px] text-muted-foreground/40 tabular-nums bg-card/80 px-1 rounded">
            avg {avg}
          </span>
        </div>

        {/* Smooth area overlay (subtle) */}
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-[90px] w-full pointer-events-none"
        >
          <defs>
            <linearGradient id="peakAreaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="rgba(234,179,8,0.25)" />
              <stop offset="0.5" stopColor="rgba(101,163,13,0.12)" />
              <stop offset="1" stopColor="rgba(101,163,13,0)" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#peakAreaFill)" />
          <path d={linePath} fill="none" stroke="rgba(163,230,53,0.55)" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
        </svg>

        {/* Bars */}
        <div className="flex items-end gap-[2px] h-[90px] relative">
          {hours.map((v, h) => {
            const pct = (v / max) * 100;
            const isCurrent = h === currentHour;
            const isPeak = h === peakHour;
            const colorClasses = getBarColor(v);
            return (
              <div key={h} className="group relative flex-1 flex flex-col justify-end">
                <div
                  className={cn(
                    "w-full rounded-[2px] bg-gradient-to-t transition-all",
                    colorClasses,
                    isPeak && "shadow-[0_0_12px_rgba(234,179,8,0.7)] ring-1 ring-yellow-400/50",
                    isCurrent && !isPeak && "ring-1 ring-emerald-400/70 shadow-[0_0_8px_rgba(52,211,153,0.4)]"
                  )}
                  style={{ height: `${Math.max(pct, 6)}%`, minHeight: "4px" }}
                />
                {/* Tooltip */}
                <div className="absolute -top-9 left-1/2 -translate-x-1/2 hidden group-hover:block z-20 pointer-events-none">
                  <div className="bg-popover border border-border rounded px-2 py-1 text-[10px] font-mono whitespace-nowrap shadow-md">
                    <div className="text-foreground tabular-nums font-semibold">{v.toLocaleString()} players</div>
                    <div className="text-muted-foreground tabular-nums">{formatHour(h)}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hour axis labels */}
        <div className="flex justify-between text-[9px] font-medium text-muted-foreground tabular-nums mt-1.5 px-[1px]">
          <span>12a</span>
          <span>6a</span>
          <span>12p</span>
          <span>6p</span>
          <span>11p</span>
        </div>
      </div>

      {/* Best window — additional data point */}
      <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground">Best 3-hour Window</p>
            <p className="mt-0.5 text-base font-semibold text-foreground tabular-nums">
              {formatHour(bestWindowStart)} – {formatHour((bestWindowStart + 3) % 24)}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground">Avg</p>
            <p className="text-base font-semibold text-yellow-400 tabular-nums">
              {bestWindowAvg.toLocaleString()}
            </p>
          </div>
        </div>
        <p className="mt-1.5 text-[11px] text-muted-foreground leading-snug">
          Plan your sessions here to find the most populated servers.
        </p>
      </div>
    </div>
  );
}
