"use client";

import { ResponsiveContainer, XAxis, YAxis, Tooltip as ReTooltip, CartesianGrid, AreaChart, Area, Legend, ComposedChart, Label } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, LineChart, Line } from "recharts";

// --- Mock / Static Data (unchanged) ---
const uptimeData = Array.from({ length: 7 }).map((_, index) => ({
  day: `Day ${index + 1}`,
  uptime: 92 + Math.round(Math.sin(index) * 3 + index),
}));
const communityData = [
  { name: "Discord", value: 45 },
  { name: "Forums", value: 30 },
  { name: "Reddit", value: 25 },
];
const playerStatsData = [
  { label: "Mon", active: 320 },
  { label: "Tue", active: 290 },
  { label: "Wed", active: 340 },
  { label: "Thu", active: 360 },
  { label: "Fri", active: 410 },
  { label: "Sat", active: 480 },
  { label: "Sun", active: 450 },
];
const popularMapsData = [
  { map: "Wake Island", plays: 420 },
  { map: "Stalingrad", plays: 380 },
  { map: "El Alamein", plays: 350 },
  { map: "Market Garden", plays: 300 },
  { map: "Guadalcanal", plays: 270 },
];
const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--secondary))"];

// --- Helper: Process Data for Visibility ---
const processChartDataSimple = (data: any[], period: "24h" | "7d") => {
  if (!data || data.length === 0) return { chartData: [], stats: { min: 0, max: 0, avg: 0 }, isHourly7d: false };

  // Detect interval type for formatting
  const isHourly7d = period === "7d" && data.length > 24;

  const processedData = data.map((item, index) => {
    let label = "";
    let total = 0;
    let originalTimestamp = null;

    // Handle both Object (enriched) and Number (simple) input
    if (typeof item === 'object' && item !== null && 'total' in item) {
      total = item.total || 0;
      originalTimestamp = item.timestamp; // keep raw if available
    } else if (typeof item === 'number') {
      total = item;
    }

    // LABEL LOGIC
    if (originalTimestamp) {
      // We have a real timestamp from backend
      const d = new Date(originalTimestamp);
      if (period === '24h') {
        label = d.toLocaleTimeString([], { hour: 'numeric', hour12: true });
      } else if (isHourly7d) {
        label = d.toISOString(); // Formatter handles display
      } else {
        label = d.toLocaleDateString([], { weekday: 'short' });
      }
    } else {
      // Fallback: Index based
      if (period === '24h') {
        // If manual 24h array (0..23)
        label = `${index}:00`;
      } else {
        // 7d simple array
        label = `Day ${index + 1}`;
      }
    }

    return {
      label,
      total: total,
      value: total // alias for simple chart
    };
  });

  const values = processedData.map(d => d.total);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const sum = values.reduce((a, b) => a + b, 0);
  const avg = Math.round(sum / values.length) || 0;

  return { chartData: processedData, stats: { min, max, avg }, isHourly7d };
};

/**
 * SIMPLIFIED ActivityAreaChart
 * Renders a single robust area for "Total Players".
 * No stacking, no ping, no complexity. Guaranteed visibility.
 */
function ActivityAreaChart({
  data,
  period,
  color = "hsl(var(--primary))", // Purple
  gradientId
}: {
  data: any[];
  period: "24h" | "7d";
  color?: string;
  gradientId: string;
}) {
  const { chartData, stats, isHourly7d } = processChartDataSimple(data, period);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.6} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.2} />

        <XAxis
          dataKey="label"
          stroke="hsl(var(--muted-foreground))"
          tickLine={false}
          axisLine={false}
          fontSize={11}
          minTickGap={30}
          tickMargin={10}
          interval={isHourly7d ? 23 : 'preserveStartEnd'}
          tickFormatter={(val) => {
            if (isHourly7d) {
              const d = new Date(val);
              return d.toLocaleDateString([], { weekday: 'short' });
            }
            return val;
          }}
        />

        {/* Increased width to 45 to prevent truncation of 3-digit numbers */}
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          tickLine={false}
          axisLine={false}
          fontSize={11}
          width={45}
          tickMargin={10}
          domain={[0, 'auto']}
        />

        <ReTooltip
          cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1, strokeDasharray: '4 4' }}
          contentStyle={{
            backgroundColor: "hsl(var(--card)/0.95)",
            borderRadius: 8,
            border: "1px solid hsl(var(--border))",
            backdropFilter: "blur(4px)"
          }}
          labelStyle={{ color: "hsl(var(--muted-foreground))", marginBottom: "0.5rem", fontSize: "12px" }}
          itemStyle={{ fontSize: "12px", padding: "1px 0" }}
          labelFormatter={(label) => {
            if (isHourly7d) {
              const d = new Date(label);
              return d.toLocaleString([], { weekday: 'short', hour: 'numeric', hour12: true });
            }
            return label;
          }}
        />

        <Legend
          verticalAlign="top"
          height={36}
          iconType="circle"
          wrapperStyle={{ paddingBottom: "10px", fontSize: "12px", opacity: 0.8 }}
        />

        {/* SINGLE ROBUST AREA */}
        <Area
          type="monotone"
          dataKey="total"
          name="Total Players"
          stroke={color}
          fill={`url(#${gradientId})`}
          fillOpacity={0.6}
          strokeWidth={2}
        />

      </AreaChart>
    </ResponsiveContainer>
  );
}

/**
 * Main chart component with 24h/7d toggle
 * Defaulted to "7d"
 * Tabs moved to bottom and made smaller
 */
export function PlayerActivityChart({ data24h, data7d }: { data24h: any[]; data7d: any[] }) {
  return (
    <Tabs defaultValue="7d" className="flex flex-col">
      <div className="order-1">
        <TabsContent value="24h" className="mt-0">
          <ActivityAreaChart
            data={data24h}
            period="24h"
            key="chart-24h"
            gradientId="gradient-24h"
            color="hsl(var(--primary))"
          />
        </TabsContent>

        <TabsContent value="7d" className="mt-0">
          <ActivityAreaChart
            data={data7d}
            period="7d"
            key="chart-7d"
            gradientId="gradient-7d"
            color="hsl(var(--chart-2))"
          />
        </TabsContent>
      </div>

      <div className="order-2 flex justify-center pt-4">
        <TabsList className="h-8">
          <TabsTrigger value="24h" className="text-xs h-7 px-4">Avg Day (24h)</TabsTrigger>
          <TabsTrigger value="7d" className="text-xs h-7 px-4">Last 7 Days</TabsTrigger>
        </TabsList>
      </div>
    </Tabs>
  );
}

// --- Other charts (unchanged) ---

export function ServerUptimeChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={uptimeData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
        <YAxis stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} domain={[90, 105]} />
        <ReTooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
        <Line type="monotone" dataKey="uptime" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function CommunityActivityChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={communityData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={6}>
          {communityData.map((entry, index) => (
            <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend verticalAlign="bottom" height={36} iconType="circle" />
        <ReTooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function PlayerStatsBarChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={playerStatsData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
        <YAxis stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
        <ReTooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
        <Bar dataKey="active" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PopularMapsChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={popularMapsData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis type="number" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
        <YAxis dataKey="map" type="category" stroke="hsl(var(--muted-foreground))" width={120} tickLine={false} axisLine={false} />
        <ReTooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
        <Bar dataKey="plays" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// --- Server-Specific Charts ---
const processMetricsData = (playerData: any[], pingData: any[]) => {
  const pingMap = new Map(pingData.map(p => [p.hour, p.avg_ping]));

  return playerData.map(p => ({
    ...p,
    hour: new Date(p.hour).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    avg_players: Math.round(p.avg_players),
    avg_ping: Math.round(pingMap.get(p.hour) || 0),
  }));
};

export function ServerActivityChart({ playerData, pingData }: { playerData: any[], pingData: any[] }) {
  const chartData = processMetricsData(playerData, pingData);
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="playerGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.3} />
        <XAxis
          dataKey="hour"
          stroke="hsl(var(--muted-foreground))"
          tickLine={false}
          axisLine={false}
          fontSize={11}
          tickMargin={8}
          interval="preserveStartEnd"
        />
        <YAxis
          yAxisId="left"
          stroke="hsl(var(--muted-foreground))"
          tickLine={false}
          axisLine={false}
          fontSize={11}
          width={35}
          tickMargin={8}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="hsl(var(--muted-foreground))"
          tickLine={false}
          axisLine={false}
          fontSize={11}
          width={35}
          tickMargin={8}
          tickFormatter={(value) => `${value}ms`}
        />
        <ReTooltip
          cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1, strokeDasharray: '4 4' }}
          contentStyle={{
            backgroundColor: "hsl(var(--card)/0.95)",
            borderRadius: 8,
            border: "1px solid hsl(var(--border))",
            backdropFilter: "blur(4px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
          }}
          labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600, marginBottom: 4 }}
        />
        <Legend
          verticalAlign="top"
          height={40}
          iconType="circle"
          wrapperStyle={{ paddingBottom: "8px", fontSize: "12px" }}
        />
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="avg_players"
          name="Avg Players"
          stroke="hsl(var(--primary))"
          fill="url(#playerGradient)"
          strokeWidth={2}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="max_players"
          name="Max Players"
          stroke="hsl(var(--primary))"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          dot={false}
          opacity={0.6}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="avg_ping"
          name="Avg Ping"
          stroke="hsl(var(--chart-2))"
          strokeWidth={2}
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export function ServerMapsPieChart({ mapData }: { mapData: any[] }) {
  // Vibrant gradient color pairs [start, end]
  const gradientColors = [
    ["#8b5cf6", "#a78bfa"], // Purple
    ["#06b6d4", "#22d3ee"], // Cyan
    ["#f59e0b", "#fbbf24"], // Amber
    ["#ec4899", "#f472b6"], // Pink
    ["#10b981", "#34d399"], // Emerald
    ["#6366f1", "#818cf8"], // Indigo
    ["#ef4444", "#f87171"], // Red
  ];

  // Calculate total for percentages
  const total = mapData.reduce((sum, item) => sum + item.rounds_played, 0);

  // Custom legend with percentages and progress bars
  const CustomLegend = () => (
    <div className="space-y-2.5 mt-3">
      {mapData.map((entry, index) => {
        const percent = total > 0 ? ((entry.rounds_played / total) * 100) : 0;
        const colors = gradientColors[index % gradientColors.length];
        return (
          <div key={entry.map_name} className="group">
            <div className="flex items-center gap-3 text-sm mb-1">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0 ring-2 ring-offset-1 ring-offset-background"
                style={{
                  background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
                  ringColor: colors[0] + "40"
                }}
              />
              <span className="flex-1 truncate text-foreground font-medium" title={entry.map_name}>
                {entry.map_name}
              </span>
              <span className="text-muted-foreground font-mono text-xs tabular-nums">
                {entry.rounds_played}
              </span>
              <span className="font-bold w-12 text-right tabular-nums" style={{ color: colors[0] }}>
                {percent.toFixed(0)}%
              </span>
            </div>
            <div className="h-1 w-full rounded-full bg-muted/30 overflow-hidden ml-5">
              <div
                className="h-full rounded-full transition-all duration-500 group-hover:opacity-80"
                style={{
                  width: `${percent}%`,
                  background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})`
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-2">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <defs>
            {mapData.map((_, index) => {
              const colors = gradientColors[index % gradientColors.length];
              return (
                <linearGradient key={`gradient-${index}`} id={`mapGradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={colors[0]} />
                  <stop offset="100%" stopColor={colors[1]} />
                </linearGradient>
              );
            })}
            {/* Glow filter */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <Pie
            data={mapData}
            dataKey="rounds_played"
            nameKey="map_name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            strokeWidth={0}
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {mapData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`url(#mapGradient-${index})`}
                style={{
                  filter: "url(#glow)",
                  cursor: "pointer",
                  transition: "transform 0.2s ease"
                }}
              />
            ))}
          </Pie>
          <ReTooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card)/0.95)",
              borderRadius: 10,
              border: "1px solid hsl(var(--border))",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              backdropFilter: "blur(8px)"
            }}
            formatter={(value: number, name: string) => {
              const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
              return [
                <span key="value" className="font-bold text-base">{value} rounds <span className="text-muted-foreground font-normal">({percent}%)</span></span>,
                <span key="name" className="text-foreground font-medium">{name}</span>
              ];
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <CustomLegend />
    </div>
  );
}

// --- Player-Specific Chart ---
export function PlayerPlaytimeChart({ data }: { data: number[] }) {
  const chartData = data.map((value, index) => ({
    hour: `${index.toString().padStart(2, '0')}:00`,
    activity: value,
  }));
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis
          dataKey="hour"
          stroke="hsl(var(--muted-foreground))"
          tickLine={false}
          axisLine={false}
          fontSize={12}
          interval={3}
        >
          <Label value="Hour (UTC)" offset={-5} position="insideBottom" fill="hsl(var(--muted-foreground))" fontSize={12} />
        </XAxis>
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          tickLine={false}
          axisLine={false}
          fontSize={12}
          allowDecimals={false}
          width={30}
        />
        <ReTooltip
          cursor={{ fill: "hsl(var(--accent)/0.3)" }}
          contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: 12, border: "1px solid hsl(var(--border))" }}
          labelFormatter={(label) => `Hour: ${label} (UTC)`}
        />
        <Area
          type="monotone"
          dataKey="activity"
          name="Rounds Played"
          stroke="hsl(var(--primary))"
          fillOpacity={1}
          fill="url(#colorActivity)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// --- New Player Profile Charts ---

export function PlayerTopMapsChart({ data }: { data: { map_name: string; map_play_count: number }[] }) {
  const maxValue = Math.max(...data.map(d => d.map_play_count), 1);

  return (
    <div className="space-y-3">
      {data.map((item, index) => {
        const percent = (item.map_play_count / maxValue) * 100;
        return (
          <div key={item.map_name} className="group">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-foreground truncate flex-1 mr-4" title={item.map_name}>
                {item.map_name}
              </span>
              <span className="text-sm font-semibold text-primary">
                {item.map_play_count}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted/40 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary transition-all group-hover:from-primary group-hover:to-primary/90"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function PlayerTopServersChart({ data }: { data: { current_server_name: string; server_play_count: number }[] }) {
  const maxValue = Math.max(...data.map(d => d.server_play_count), 1);

  return (
    <div className="space-y-3">
      {data.map((item, index) => {
        const percent = (item.server_play_count / maxValue) * 100;
        return (
          <div key={item.current_server_name} className="group">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-foreground truncate flex-1 mr-4" title={item.current_server_name}>
                {item.current_server_name}
              </span>
              <span className="text-sm font-semibold text-[hsl(var(--chart-2))]">
                {item.server_play_count}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted/40 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[hsl(var(--chart-2)/0.8)] to-[hsl(var(--chart-2))] transition-all group-hover:opacity-90"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function PlayerTeamPreferenceChart({ data }: { data: { name: string; value: number }[] }) {
  const teamColors = ["#ef4444", "#3b82f6"]; // Red for Axis, Blue for Allied
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex items-center gap-6">
      <ResponsiveContainer width={140} height={140}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={35}
            outerRadius={55}
            paddingAngle={4}
            dataKey="value"
            strokeWidth={2}
            stroke="hsl(var(--background))"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={teamColors[index % teamColors.length]} />
            ))}
          </Pie>
          <ReTooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              borderRadius: 8,
              border: "1px solid hsl(var(--border))",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex-1 space-y-3">
        {data.map((entry, index) => {
          const percent = total > 0 ? ((entry.value / total) * 100).toFixed(0) : 0;
          return (
            <div key={entry.name} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: teamColors[index % teamColors.length] }}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{entry.name}</span>
                  <span className="text-sm font-bold" style={{ color: teamColors[index % teamColors.length] }}>
                    {percent}%
                  </span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-muted/50 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: teamColors[index % teamColors.length]
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PlayerActivityLast7DaysChart({ data }: { data: { date: string; rounds: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorActivity7d" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis
          dataKey="date"
          stroke="hsl(var(--muted-foreground))"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { weekday: 'short' })}
          fontSize={12}
        />
        <YAxis stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} fontSize={12} width={30} />
        <ReTooltip
          cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1, strokeDasharray: '4 4' }}
          contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: 8, border: "1px solid hsl(var(--border))" }}
          labelFormatter={(label) => new Date(label).toLocaleDateString()}
        />
        <Area
          type="monotone"
          dataKey="rounds"
          name="Rounds Played"
          stroke="hsl(var(--primary))"
          fillOpacity={1}
          fill="url(#colorActivity7d)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}