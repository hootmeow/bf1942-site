"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Server,
  Swords,
  TrendingUp,
  TrendingDown,
  Activity,
  Gamepad2,
  Info,
  Map,
  UserPlus,
  Wifi,
} from "lucide-react";
import {
  ComposedChart,
  Area,
  Line,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { GlobalPeakTimes } from "@/components/global-peak-times";
import type { GlobalMetrics } from "@/lib/schemas";

interface PopulationEntry {
  day: string;
  unique_players: number;
  peak_concurrent: number;
}

interface ServerTrendEntry {
  day: string;
  active_servers: number;
}

interface RoundsTrendEntry {
  day: string;
  rounds_played: number;
}

interface GamemodeEntry {
  gamemode: string;
  rounds_played: number;
}

interface MapTrendEntry {
  map_name: string;
  total_rounds: number;
  recent_7d: number;
  prev_7d: number;
  trend_pct: number;
}

interface PlayerRetentionEntry {
  day: string;
  new_players: number;
  returning_players: number;
}

interface PingTrendEntry {
  day: string;
  avg_ping: number;
  median_ping: number;
  p95_ping: number;
}

interface HealthData {
  ok: boolean;
  population_trend: PopulationEntry[];
  server_trend: ServerTrendEntry[];
  rounds_trend: RoundsTrendEntry[];
  gamemode_breakdown: GamemodeEntry[];
  map_trends?: MapTrendEntry[];
  player_retention?: PlayerRetentionEntry[];
  ping_trends?: PingTrendEntry[];
}

interface GameHealthDashboardProps {
  healthData: HealthData;
  globalMetrics: GlobalMetrics | null;
}

// Game mode color mapping
const GAMEMODE_COLORS: Record<string, [string, string]> = {
  Conquest: ["#3b82f6", "#60a5fa"],
  CTF: ["#ec4899", "#f472b6"],
  "Co-Op": ["#06b6d4", "#22d3ee"],
  Coop: ["#06b6d4", "#22d3ee"],
  TDM: ["#ef4444", "#f87171"],
  ObjectiveMode: ["#f59e0b", "#fbbf24"],
  Unknown: ["#6b7280", "#9ca3af"],
};

const DEFAULT_COLORS: [string, string][] = [
  ["#8b5cf6", "#a78bfa"],
  ["#10b981", "#34d399"],
  ["#f59e0b", "#fbbf24"],
  ["#ef4444", "#f87171"],
  ["#06b6d4", "#22d3ee"],
];

function getGamemodeColor(
  gamemode: string,
  index: number
): [string, string] {
  return (
    GAMEMODE_COLORS[gamemode] ||
    DEFAULT_COLORS[index % DEFAULT_COLORS.length]
  );
}

function formatDay(day: string) {
  // Handle both "2026-02-01" and "2026-02-01T00:00:00" formats
  const dateStr = day.includes("T") ? day : day + "T00:00:00Z";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return day;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function GameHealthDashboard({
  healthData,
  globalMetrics,
}: GameHealthDashboardProps) {
  const {
    population_trend,
    server_trend,
    rounds_trend,
    gamemode_breakdown,
    map_trends = [],
    player_retention = [],
    ping_trends = [],
  } = healthData;

  // Compute summary stats
  const stats = useMemo(() => {
    const avg30d =
      population_trend.length > 0
        ? Math.round(
            population_trend.reduce((s, d) => s + d.unique_players, 0) /
              population_trend.length
          )
        : 0;

    const peakDay =
      population_trend.length > 0
        ? [...population_trend].sort(
            (a, b) => b.unique_players - a.unique_players
          )[0]
        : null;

    // Trend: compare last 7 days avg vs previous 7 days avg
    const last7 = population_trend.slice(-7);
    const prev7 = population_trend.slice(-14, -7);
    const last7Avg =
      last7.length > 0
        ? last7.reduce((s, d) => s + d.unique_players, 0) / last7.length
        : 0;
    const prev7Avg =
      prev7.length > 0
        ? prev7.reduce((s, d) => s + d.unique_players, 0) / prev7.length
        : 0;
    const trendPct =
      prev7Avg > 0
        ? Math.round(((last7Avg - prev7Avg) / prev7Avg) * 100)
        : 0;

    const serversToday =
      server_trend.length > 0
        ? server_trend[server_trend.length - 1].active_servers
        : 0;
    const serversYesterday =
      server_trend.length > 1
        ? server_trend[server_trend.length - 2].active_servers
        : 0;
    const serversPct =
      serversYesterday > 0
        ? Math.round(((serversToday - serversYesterday) / serversYesterday) * 100)
        : undefined;

    const roundsToday =
      rounds_trend.length > 0
        ? rounds_trend[rounds_trend.length - 1].rounds_played
        : 0;
    const roundsYesterday =
      rounds_trend.length > 1
        ? rounds_trend[rounds_trend.length - 2].rounds_played
        : 0;
    const roundsPct =
      roundsYesterday > 0
        ? Math.round(((roundsToday - roundsYesterday) / roundsYesterday) * 100)
        : undefined;

    return { avg30d, peakDay, trendPct, serversToday, roundsToday, serversPct, roundsPct };
  }, [population_trend, server_trend, rounds_trend]);

  // Player retention summary stats
  const retentionStats = useMemo(() => {
    if (player_retention.length === 0) return null;
    const totalNew = player_retention.reduce((s, d) => s + d.new_players, 0);
    const totalReturning = player_retention.reduce((s, d) => s + d.returning_players, 0);
    const avgReturnRate = totalReturning + totalNew > 0
      ? Math.round((totalReturning / (totalReturning + totalNew)) * 100)
      : 0;
    return { totalNew, avgReturnRate };
  }, [player_retention]);

  // Ping summary stats
  const pingStats = useMemo(() => {
    if (ping_trends.length === 0) return null;
    const latest = ping_trends[ping_trends.length - 1];
    const allMedians = ping_trends.map((d) => d.median_ping);
    const overall30dMedian = Math.round(
      allMedians.reduce((s, v) => s + v, 0) / allMedians.length
    );
    return { currentAvg: latest.avg_ping, median30d: overall30dMedian };
  }, [ping_trends]);

  const gamemodeTotal = gamemode_breakdown.reduce(
    (s, g) => s + g.rounds_played,
    0
  );
  const gamemodeMax = Math.max(
    ...gamemode_breakdown.map((g) => g.rounds_played),
    1
  );

  const mapTrendsMax = Math.max(...map_trends.map((m) => m.total_rounds), 1);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 px-6 py-10 shadow-2xl sm:px-12 sm:py-14">
        <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-green-500/10 blur-[120px]" />
        <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[100px]" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>
            <Badge
              variant="outline"
              className="border-green-500/30 bg-green-500/10 text-green-400 font-mono"
            >
              LIVE METRICS
            </Badge>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Game Health
          </h1>
          <p className="mt-2 max-w-[500px] text-lg text-slate-400">
            30-day population trends, server activity, and game mode analytics.
          </p>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Players Online Now"
          value={globalMetrics?.current_active_players ?? 0}
          icon={Users}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/20"
        />
        <MetricCard
          title="Unique Players (7d)"
          value={globalMetrics?.active_players_7d ?? 0}
          icon={TrendingUp}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/20"
          changePct={globalMetrics?.active_players_7d_change_pct}
        />
        <MetricCard
          title="Active Servers Today"
          value={stats.serversToday}
          icon={Server}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/20"
          changePct={stats.serversPct}
        />
        <MetricCard
          title="Rounds Today"
          value={stats.roundsToday}
          icon={Swords}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/20"
          changePct={stats.roundsPct}
        />
      </div>

      {/* Population Trend Chart */}
      <Card className="border-border/60 bg-card/40">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <CardTitle as="h2" className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Population Trend (30 Days)
            </CardTitle>
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center gap-1.5 rounded-lg border border-border/40 bg-muted/30 px-3 py-1.5">
                <span className="text-muted-foreground">30d Avg:</span>
                <span className="font-bold tabular-nums">
                  {stats.avg30d.toLocaleString()}
                </span>
              </div>
              {stats.peakDay && (
                <div className="flex items-center gap-1.5 rounded-lg border border-border/40 bg-muted/30 px-3 py-1.5">
                  <span className="text-muted-foreground">Peak:</span>
                  <span className="font-bold tabular-nums">
                    {stats.peakDay.unique_players.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    ({formatDay(stats.peakDay.day)})
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1.5 rounded-lg border border-border/40 bg-muted/30 px-3 py-1.5">
                <span className="text-muted-foreground">Trend:</span>
                {stats.trendPct >= 0 ? (
                  <span className="font-bold text-green-500 tabular-nums flex items-center gap-0.5">
                    <TrendingUp className="h-3.5 w-3.5" />+{stats.trendPct}%
                  </span>
                ) : (
                  <span className="font-bold text-red-500 tabular-nums flex items-center gap-0.5">
                    <TrendingDown className="h-3.5 w-3.5" />
                    {stats.trendPct}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] sm:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={population_trend}>
                <defs>
                  <linearGradient
                    id="uniquePlayersGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="day"
                  tickFormatter={formatDay}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  width={45}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "13px",
                  }}
                  labelFormatter={formatDay}
                />
                <Area
                  type="monotone"
                  dataKey="unique_players"
                  stroke="hsl(var(--primary))"
                  fill="url(#uniquePlayersGrad)"
                  strokeWidth={2}
                  name="Unique Players"
                />
                <Line
                  type="monotone"
                  dataKey="peak_concurrent"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  name="Peak Concurrent"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-primary" />
              Unique Daily Players
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Peak Concurrent
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NEW: New vs Returning Players */}
      {player_retention.length > 0 && (
        <Card className="border-border/60 bg-card/40">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle as="h2" className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-green-400" />
                New vs Returning Players (30 Days)
              </CardTitle>
              {retentionStats && (
                <div className="flex flex-wrap gap-3 text-sm">
                  <div className="flex items-center gap-1.5 rounded-lg border border-border/40 bg-muted/30 px-3 py-1.5">
                    <span className="text-muted-foreground">30d New Players:</span>
                    <span className="font-bold tabular-nums text-green-400">
                      {retentionStats.totalNew.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg border border-border/40 bg-muted/30 px-3 py-1.5">
                    <span className="text-muted-foreground">Avg Return Rate:</span>
                    <span className="font-bold tabular-nums text-blue-400">
                      {retentionStats.avgReturnRate}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] sm:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={player_retention}>
                  <defs>
                    <linearGradient id="returningGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="newPlayersGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="day"
                    tickFormatter={formatDay}
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    width={45}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "13px",
                    }}
                    labelFormatter={formatDay}
                  />
                  <Area
                    type="monotone"
                    dataKey="returning_players"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="url(#returningGrad)"
                    strokeWidth={2}
                    name="Returning Players"
                  />
                  <Area
                    type="monotone"
                    dataKey="new_players"
                    stackId="1"
                    stroke="#22c55e"
                    fill="url(#newPlayersGrad)"
                    strokeWidth={2}
                    name="New Players"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                Returning Players
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                New Players
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Server & Rounds Trend — 2-column grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Active Servers */}
        <Card className="border-border/60 bg-card/40">
          <CardHeader>
            <CardTitle as="h2" className="flex items-center gap-2">
              <Server className="h-5 w-5 text-amber-400" />
              Active Servers (30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={server_trend}>
                  <defs>
                    <linearGradient
                      id="serverGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#f59e0b"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="#f59e0b"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="day"
                    tickFormatter={formatDay}
                    tick={{
                      fontSize: 11,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{
                      fontSize: 11,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    width={35}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "13px",
                    }}
                    labelFormatter={formatDay}
                  />
                  <Area
                    type="monotone"
                    dataKey="active_servers"
                    stroke="#f59e0b"
                    fill="url(#serverGrad)"
                    strokeWidth={2}
                    name="Active Servers"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Rounds Played */}
        <Card className="border-border/60 bg-card/40">
          <CardHeader>
            <CardTitle as="h2" className="flex items-center gap-2">
              <Swords className="h-5 w-5 text-blue-400" />
              Rounds Played (30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={rounds_trend}>
                  <defs>
                    <linearGradient
                      id="roundsGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#3b82f6"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="#3b82f6"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="day"
                    tickFormatter={formatDay}
                    tick={{
                      fontSize: 11,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{
                      fontSize: 11,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    width={35}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "13px",
                    }}
                    labelFormatter={formatDay}
                  />
                  <Area
                    type="monotone"
                    dataKey="rounds_played"
                    stroke="#3b82f6"
                    fill="url(#roundsGrad)"
                    strokeWidth={2}
                    name="Rounds Played"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NEW: Map Popularity Trends */}
      {map_trends.length > 0 && (
        <Card className="border-border/60 bg-card/40">
          <CardHeader>
            <CardTitle as="h2" className="flex items-center gap-2">
              <Map className="h-5 w-5 text-cyan-400" />
              Map Popularity (30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {map_trends.map((item) => {
                const percent = (item.total_rounds / mapTrendsMax) * 100;
                return (
                  <div key={item.map_name} className="group">
                    <div className="flex items-center gap-3 mb-1.5">
                      <div className="w-2 h-2 rounded-full flex-shrink-0 bg-cyan-400" />
                      <span className="text-sm font-medium text-foreground truncate flex-1">
                        {item.map_name}
                      </span>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {item.total_rounds.toLocaleString()} rounds
                      </span>
                      {item.trend_pct > 5 ? (
                        <Badge variant="outline" className="border-green-500/30 bg-green-500/10 text-green-400 text-xs px-1.5 py-0">
                          <TrendingUp className="h-3 w-3 mr-0.5" />+{item.trend_pct}%
                        </Badge>
                      ) : item.trend_pct < -5 ? (
                        <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-red-400 text-xs px-1.5 py-0">
                          <TrendingDown className="h-3 w-3 mr-0.5" />{item.trend_pct}%
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-border/40 bg-muted/30 text-muted-foreground text-xs px-1.5 py-0">
                          {item.trend_pct > 0 ? "+" : ""}{item.trend_pct}%
                        </Badge>
                      )}
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted/30 overflow-hidden ml-5">
                      <div
                        className="h-full rounded-full transition-all duration-500 group-hover:opacity-80"
                        style={{
                          width: `${percent}%`,
                          background: "linear-gradient(90deg, #06b6d4, #22d3ee)",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Game Mode Breakdown */}
      <Card className="border-border/60 bg-card/40">
        <CardHeader>
          <CardTitle as="h2" className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5 text-pink-400" />
            Game Mode Breakdown (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2.5">
            {gamemode_breakdown.map((item, index) => {
              const percent = (item.rounds_played / gamemodeMax) * 100;
              const sharePct =
                gamemodeTotal > 0
                  ? ((item.rounds_played / gamemodeTotal) * 100).toFixed(0)
                  : "0";
              const colors = getGamemodeColor(item.gamemode, index);
              return (
                <div key={item.gamemode} className="group">
                  <div className="flex items-center gap-3 mb-1.5">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0 ring-2 ring-offset-1 ring-offset-background"
                      style={
                        {
                          background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
                          "--tw-ring-color": colors[0] + "30",
                        } as React.CSSProperties
                      }
                    />
                    <span className="text-sm font-medium text-foreground truncate flex-1">
                      {item.gamemode}
                    </span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {item.rounds_played.toLocaleString()} rounds
                    </span>
                    <span
                      className="text-xs font-bold tabular-nums w-10 text-right"
                      style={{ color: colors[0] }}
                    >
                      {sharePct}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted/30 overflow-hidden ml-5">
                    <div
                      className="h-full rounded-full transition-all duration-500 group-hover:opacity-80"
                      style={{
                        width: `${percent}%`,
                        background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
            {gamemode_breakdown.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No game mode data available.
              </p>
            )}
          </div>
          <div className="flex items-start gap-2 mt-4 rounded-lg border border-border/40 bg-muted/20 px-3 py-2.5 text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
            <span>Co-op rounds are not currently tracked by our site.</span>
          </div>
        </CardContent>
      </Card>

      {/* Network Quality / Ping Trends */}
      {ping_trends.length > 0 && (
        <Card className="border-border/60 bg-card/40">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle as="h2" className="flex items-center gap-2">
                <Wifi className="h-5 w-5 text-sky-400" />
                Network Quality (30 Days)
              </CardTitle>
              {pingStats && (
                <div className="flex flex-wrap gap-3 text-sm">
                  <div className="flex items-center gap-1.5 rounded-lg border border-border/40 bg-muted/30 px-3 py-1.5">
                    <span className="text-muted-foreground">Current Avg:</span>
                    <span className="font-bold tabular-nums text-amber-400">
                      {pingStats.currentAvg.toFixed(0)}ms
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg border border-border/40 bg-muted/30 px-3 py-1.5">
                    <span className="text-muted-foreground">30d Median:</span>
                    <span className="font-bold tabular-nums text-blue-400">
                      {pingStats.median30d}ms
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] sm:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={ping_trends}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="day"
                    tickFormatter={formatDay}
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    width={45}
                    unit="ms"
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "13px",
                    }}
                    labelFormatter={formatDay}
                    formatter={(value: number) => [`${value.toFixed(1)}ms`]}
                  />
                  <Line
                    type="monotone"
                    dataKey="median_ping"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    name="Median"
                  />
                  <Line
                    type="monotone"
                    dataKey="avg_ping"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={false}
                    name="Average"
                  />
                  <Line
                    type="monotone"
                    dataKey="p95_ping"
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="P95"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                Median Ping
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                Average Ping
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-0.5 w-4 border-t-2 border-dashed border-red-500" />
                P95 Ping
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Peak Times Heatmap */}
      {globalMetrics && (
        <GlobalPeakTimes
          heatmap7d={globalMetrics.global_concurrency_heatmap_7d}
          timeline7d={globalMetrics.global_concurrency_timeline_7d ?? undefined}
        />
      )}
    </div>
  );
}

// --- Stat Card Sub-component ---
function MetricCard({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBg,
  changePct,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  changePct?: number;
}) {
  return (
    <Card className="border-border/60 bg-card/40">
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`rounded-lg p-2.5 ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase text-muted-foreground truncate">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="font-mono text-2xl font-bold text-foreground tabular-nums">
              {value.toLocaleString()}
            </p>
            {changePct !== undefined && (
              <span
                className={`text-xs font-bold flex items-center gap-0.5 ${
                  changePct >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {changePct >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {changePct >= 0 ? "+" : ""}
                {Math.round(changePct)}%
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
