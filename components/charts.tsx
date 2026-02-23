"use client";

import React, { useState } from "react";
import { ResponsiveContainer, XAxis, YAxis, Tooltip as ReTooltip, CartesianGrid, AreaChart, Area, Legend, ComposedChart, Label, BarChart, Bar } from "recharts";
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
  color = "hsl(var(--primary))",
  gradientId
}: {
  data: any[];
  period: "24h" | "7d";
  color?: string;
  gradientId: string;
}) {
  const { chartData, stats, isHourly7d } = processChartDataSimple(data, period);

  return (
    <div className="space-y-4">
      {/* Stats summary bar */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-muted-foreground">Peak</span>
          <span className="font-bold text-foreground tabular-nums">{stats.max}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary/60" />
          <span className="text-muted-foreground">Avg</span>
          <span className="font-bold text-foreground tabular-nums">{stats.avg}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-muted-foreground/40" />
          <span className="text-muted-foreground">Low</span>
          <span className="font-bold text-foreground tabular-nums">{stats.min}</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.5} />
              <stop offset="50%" stopColor={color} stopOpacity={0.15} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
            <linearGradient id={`${gradientId}-stroke`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={color} stopOpacity={0.6} />
              <stop offset="50%" stopColor={color} stopOpacity={1} />
              <stop offset="100%" stopColor={color} stopOpacity={0.6} />
            </linearGradient>
            <filter id={`${gradientId}-glow`}>
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.15} />

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

          <Area
            type="monotone"
            dataKey="total"
            name="Total Players"
            stroke={`url(#${gradientId}-stroke)`}
            fill={`url(#${gradientId})`}
            fillOpacity={1}
            strokeWidth={2.5}
            dot={false}
            activeDot={{
              r: 5,
              stroke: color,
              strokeWidth: 2,
              fill: "hsl(var(--background))",
              filter: `url(#${gradientId}-glow)`
            }}
          />

        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Main chart component with 24h/7d toggle
 * Defaulted to "7d"
 * Tabs moved to bottom and made smaller
 */
export const PlayerActivityChart = React.memo(function PlayerActivityChart({ data24h, data7d }: { data24h: any[]; data7d: any[] }) {
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
});

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

export const ServerActivityChart = React.memo(function ServerActivityChart({ playerData, pingData }: { playerData: any[], pingData: any[] }) {
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
});

export const ServerMapsPieChart = React.memo(function ServerMapsPieChart({ mapData }: { mapData: any[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const gradientColors = [
    ["#8b5cf6", "#c084fc"], // Purple
    ["#06b6d4", "#67e8f9"], // Cyan
    ["#f59e0b", "#fcd34d"], // Amber
    ["#ec4899", "#f9a8d4"], // Pink
    ["#10b981", "#6ee7b7"], // Emerald
    ["#6366f1", "#a5b4fc"], // Indigo
    ["#ef4444", "#fca5a5"], // Red
    ["#14b8a6", "#5eead4"], // Teal
  ];

  const total = mapData.reduce((sum: number, item: any) => sum + item.rounds_played, 0);

  const activeEntry = activeIndex !== null ? mapData[activeIndex] : null;
  const activePercent = activeEntry ? ((activeEntry.rounds_played / total) * 100).toFixed(0) : null;

  const CustomLegend = () => (
    <div className="space-y-2 mt-2">
      {mapData.map((entry: any, index: number) => {
        const percent = total > 0 ? ((entry.rounds_played / total) * 100) : 0;
        const colors = gradientColors[index % gradientColors.length];
        const isActive = activeIndex === index;
        return (
          <div
            key={entry.map_name}
            className="group cursor-pointer"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div className="flex items-center gap-3 text-sm mb-1">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all duration-200"
                style={{
                  background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
                  boxShadow: isActive ? `0 0 8px ${colors[0]}80` : "none",
                  transform: isActive ? "scale(1.3)" : "scale(1)",
                }}
              />
              <span className={`flex-1 truncate font-medium transition-colors duration-200 ${isActive ? "text-foreground" : "text-muted-foreground"}`} title={entry.map_name}>
                {entry.map_name}
              </span>
              <span className="text-muted-foreground font-mono text-xs tabular-nums">
                {entry.rounds_played}
              </span>
              <span className="font-bold w-12 text-right tabular-nums transition-colors duration-200" style={{ color: isActive ? colors[1] : colors[0] }}>
                {percent.toFixed(0)}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted/20 overflow-hidden ml-5">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${percent}%`,
                  background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})`,
                  boxShadow: isActive ? `0 0 10px ${colors[0]}60` : "none",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-1">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <defs>
            {mapData.map((_: any, index: number) => {
              const colors = gradientColors[index % gradientColors.length];
              return (
                <linearGradient key={`gradient-${index}`} id={`mapGradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={colors[0]} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={colors[1]} stopOpacity={1} />
                </linearGradient>
              );
            })}
            <filter id="pieGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="pieGlowActive" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
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
            innerRadius={55}
            outerRadius={activeIndex !== null ? 90 : 85}
            paddingAngle={3}
            strokeWidth={0}
            animationBegin={0}
            animationDuration={1000}
            animationEasing="ease-out"
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {mapData.map((_: any, index: number) => {
              const isActive = activeIndex === index;
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#mapGradient-${index})`}
                  style={{
                    filter: isActive ? "url(#pieGlowActive)" : "url(#pieGlow)",
                    cursor: "pointer",
                    opacity: activeIndex !== null && !isActive ? 0.5 : 1,
                    transition: "opacity 0.25s ease, filter 0.25s ease",
                  }}
                />
              );
            })}
          </Pie>
          {/* Center label */}
          <text x="50%" y="46%" textAnchor="middle" dominantBaseline="central" className="fill-foreground text-2xl font-bold" style={{ fontSize: activeEntry ? 20 : 22, transition: "all 0.2s" }}>
            {activeEntry ? `${activePercent}%` : total}
          </text>
          <text x="50%" y="58%" textAnchor="middle" dominantBaseline="central" className="fill-muted-foreground" style={{ fontSize: 11 }}>
            {activeEntry ? activeEntry.map_name : "rounds"}
          </text>
          <ReTooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card)/0.95)",
              borderRadius: 12,
              border: "1px solid hsl(var(--border))",
              boxShadow: "0 12px 32px rgba(0,0,0,0.3)",
              backdropFilter: "blur(12px)",
              padding: "10px 14px",
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
});

// --- Player-Specific Chart ---
export const PlayerPlaytimeChart = React.memo(function PlayerPlaytimeChart({ data }: { data: number[] }) {
  const chartData = data.map((value, index) => ({
    hour: `${index.toString().padStart(2, '0')}:00`,
    activity: value,
  }));

  const maxActivity = Math.max(...data);
  const peakHour = data.indexOf(maxActivity);

  return (
    <div className="space-y-3">
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorActivityPlayer" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.6} />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
            <filter id="glowActivity" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.3} />
          <XAxis
            dataKey="hour"
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={false}
            fontSize={10}
            interval={5}
            tickMargin={8}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={false}
            fontSize={10}
            allowDecimals={false}
            width={28}
            tickMargin={4}
          />
          <ReTooltip
            cursor={{ stroke: "#8b5cf6", strokeWidth: 1, strokeDasharray: '4 4' }}
            contentStyle={{
              backgroundColor: "hsl(var(--card)/0.95)",
              borderRadius: 10,
              border: "1px solid hsl(var(--border))",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              backdropFilter: "blur(8px)"
            }}
            labelFormatter={(label) => `${label} UTC`}
            formatter={(value: number) => [`${value} rounds`, "Activity"]}
          />
          <Area
            type="monotone"
            dataKey="activity"
            name="Rounds"
            stroke="#8b5cf6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorActivityPlayer)"
            style={{ filter: "url(#glowActivity)" }}
          />
        </AreaChart>
      </ResponsiveContainer>
      {/* Peak hour indicator */}
      <div className="flex items-center justify-between px-2 py-2 rounded-lg bg-muted/30 border border-border/40">
        <span className="text-xs text-muted-foreground">Peak Activity</span>
        <span className="text-sm font-semibold text-primary">
          {peakHour.toString().padStart(2, '0')}:00 UTC
          <span className="text-muted-foreground font-normal ml-2">({maxActivity} rounds)</span>
        </span>
      </div>
    </div>
  );
});

// --- New Player Profile Charts ---

export const PlayerTopMapsChart = React.memo(function PlayerTopMapsChart({ data }: { data: { map_name: string; map_play_count: number }[] }) {
  const maxValue = Math.max(...data.map(d => d.map_play_count), 1);
  const total = data.reduce((sum, d) => sum + d.map_play_count, 0);

  // Gradient colors for each map
  const mapColors = [
    ["#8b5cf6", "#a78bfa"], // Purple
    ["#06b6d4", "#22d3ee"], // Cyan
    ["#f59e0b", "#fbbf24"], // Amber
    ["#ec4899", "#f472b6"], // Pink
    ["#10b981", "#34d399"], // Emerald
  ];

  return (
    <div className="space-y-2.5">
      {data.slice(0, 5).map((item, index) => {
        const percent = (item.map_play_count / maxValue) * 100;
        const sharePercent = total > 0 ? ((item.map_play_count / total) * 100).toFixed(0) : 0;
        const colors = mapColors[index % mapColors.length];
        return (
          <div key={item.map_name} className="group">
            <div className="flex items-center gap-3 mb-1.5">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0 ring-2 ring-offset-1 ring-offset-background"
                style={{
                  background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
                  "--tw-ring-color": colors[0] + "30"
                } as React.CSSProperties}
              />
              <span className="text-sm font-medium text-foreground truncate flex-1" title={item.map_name}>
                {item.map_name}
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {item.map_play_count}
              </span>
              <span className="text-xs font-bold tabular-nums w-10 text-right" style={{ color: colors[0] }}>
                {sharePercent}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted/30 overflow-hidden ml-5">
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
});

export const PlayerTopServersChart = React.memo(function PlayerTopServersChart({ data }: { data: { current_server_name: string; server_play_count: number }[] }) {
  const maxValue = Math.max(...data.map(d => d.server_play_count), 1);
  const total = data.reduce((sum, d) => sum + d.server_play_count, 0);

  // Gradient colors for servers (different palette)
  const serverColors = [
    ["#06b6d4", "#22d3ee"], // Cyan
    ["#3b82f6", "#60a5fa"], // Blue
    ["#8b5cf6", "#a78bfa"], // Purple
    ["#14b8a6", "#2dd4bf"], // Teal
    ["#6366f1", "#818cf8"], // Indigo
  ];

  return (
    <div className="space-y-2.5">
      {data.slice(0, 5).map((item, index) => {
        const percent = (item.server_play_count / maxValue) * 100;
        const sharePercent = total > 0 ? ((item.server_play_count / total) * 100).toFixed(0) : 0;
        const colors = serverColors[index % serverColors.length];
        return (
          <div key={item.current_server_name} className="group">
            <div className="flex items-center gap-3 mb-1.5">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0 ring-2 ring-offset-1 ring-offset-background"
                style={{
                  background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
                  "--tw-ring-color": colors[0] + "30"
                } as React.CSSProperties}
              />
              <span className="text-sm font-medium text-foreground truncate flex-1" title={item.current_server_name}>
                {item.current_server_name}
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {item.server_play_count}
              </span>
              <span className="text-xs font-bold tabular-nums w-10 text-right" style={{ color: colors[0] }}>
                {sharePercent}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted/30 overflow-hidden ml-5">
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
});

export const PlayerTeamPreferenceChart = React.memo(function PlayerTeamPreferenceChart({ data }: { data: { name: string; value: number }[] }) {
  // Gradient color pairs for Axis (red) and Allied (blue)
  const teamGradients = [
    ["#dc2626", "#ef4444", "#fca5a5"], // Red gradient for Axis
    ["#2563eb", "#3b82f6", "#93c5fd"], // Blue gradient for Allied
  ];
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Determine dominant team
  const dominant = data[0]?.value >= data[1]?.value ? 0 : 1;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <ResponsiveContainer width={160} height={160}>
          <PieChart>
            <defs>
              {data.map((_, index) => (
                <linearGradient key={`teamGrad-${index}`} id={`teamGradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={teamGradients[index][0]} />
                  <stop offset="100%" stopColor={teamGradients[index][1]} />
                </linearGradient>
              ))}
              <filter id="teamGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#teamGradient-${index})`}
                  style={{ filter: "url(#teamGlow)", cursor: "pointer" }}
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
                return [`${value} rounds (${percent}%)`, name];
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: teamGradients[dominant][0] }}>
              {total > 0 ? ((data[dominant].value / total) * 100).toFixed(0) : 0}%
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {data[dominant]?.name}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="w-full space-y-2">
        {data.map((entry, index) => {
          const percent = total > 0 ? ((entry.value / total) * 100) : 0;
          const colors = teamGradients[index];
          return (
            <div key={entry.name} className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}
                  />
                  <span className="text-sm font-medium text-foreground">{entry.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground tabular-nums">{entry.value} rounds</span>
                  <span className="text-sm font-bold tabular-nums w-12 text-right" style={{ color: colors[0] }}>
                    {percent.toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted/30 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
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
    </div>
  );
});

export const PlayerActivityLast7DaysChart = React.memo(function PlayerActivityLast7DaysChart({ data }: { data: { date: string; rounds: number }[] }) {
  const totalRounds = data.reduce((sum, d) => sum + d.rounds, 0);
  const avgRounds = data.length > 0 ? Math.round(totalRounds / data.length) : 0;
  const maxRounds = Math.max(...data.map(d => d.rounds));
  const peakDay = data.find(d => d.rounds === maxRounds);

  return (
    <div className="space-y-3">
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorActivity7dNew" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
              <stop offset="50%" stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <filter id="glow7d" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.3} />
          <XAxis
            dataKey="date"
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { weekday: 'short' })}
            fontSize={10}
            tickMargin={8}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={false}
            fontSize={10}
            width={28}
            tickMargin={4}
            allowDecimals={false}
          />
          <ReTooltip
            cursor={{ stroke: "#10b981", strokeWidth: 1, strokeDasharray: '4 4' }}
            contentStyle={{
              backgroundColor: "hsl(var(--card)/0.95)",
              borderRadius: 10,
              border: "1px solid hsl(var(--border))",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              backdropFilter: "blur(8px)"
            }}
            labelFormatter={(label) => new Date(label).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            formatter={(value: number) => [`${value} rounds`, "Activity"]}
          />
          <Area
            type="monotone"
            dataKey="rounds"
            name="Rounds"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorActivity7dNew)"
            style={{ filter: "url(#glow7d)" }}
            dot={{ r: 3, fill: "#10b981", strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center px-2 py-1.5 rounded-lg bg-muted/30 border border-border/40">
          <div className="text-lg font-bold text-emerald-500 tabular-nums">{totalRounds}</div>
          <div className="text-[10px] text-muted-foreground uppercase">Total</div>
        </div>
        <div className="text-center px-2 py-1.5 rounded-lg bg-muted/30 border border-border/40">
          <div className="text-lg font-bold text-foreground tabular-nums">{avgRounds}</div>
          <div className="text-[10px] text-muted-foreground uppercase">Avg/Day</div>
        </div>
        <div className="text-center px-2 py-1.5 rounded-lg bg-muted/30 border border-border/40">
          <div className="text-lg font-bold text-foreground tabular-nums">{maxRounds}</div>
          <div className="text-[10px] text-muted-foreground uppercase">Peak</div>
        </div>
      </div>
    </div>
  );
});


// --- PLAYER TIMESERIES CHART ---
interface TimeseriesPoint {
  period: string;
  kdr: number | null;
  kpm: number | null;
  avg_ping: number | null;
  rounds_played: number;
  total_score: number;
}

export const PlayerTimeseriesChart = React.memo(function PlayerTimeseriesChart({
  data,
  timespan,
  onTimespanChange
}: {
  data: TimeseriesPoint[];
  timespan: string;
  onTimespanChange: (t: string) => void;
}) {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">No timeseries data available.</div>;
  }

  const formatDate = (val: string) => {
    const d = new Date(val);
    if (timespan === 'day') return d.toLocaleTimeString([], { hour: 'numeric', hour12: true });
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-1">
        {['day', 'week', 'month'].map(t => (
          <button
            key={t}
            onClick={() => onTimespanChange(t)}
            className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
              timespan === t
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            }`}
          >
            {t === 'day' ? 'Day' : t === 'week' ? 'Week' : 'Month'}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorKdr" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.3} />
          <XAxis
            dataKey="period"
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={false}
            tickFormatter={formatDate}
            fontSize={10}
            tickMargin={8}
          />
          <YAxis
            yAxisId="left"
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={false}
            fontSize={10}
            width={32}
            domain={[0, 'auto']}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={false}
            fontSize={10}
            width={32}
            domain={[0, 'auto']}
          />
          <ReTooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card)/0.95)",
              borderRadius: 10,
              border: "1px solid hsl(var(--border))",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              backdropFilter: "blur(8px)"
            }}
            labelFormatter={formatDate}
            formatter={(value: number, name: string) => {
              if (name === 'kdr') return [value?.toFixed(2) ?? '—', 'KDR'];
              if (name === 'kpm') return [value?.toFixed(2) ?? '—', 'KPM'];
              return [value, name];
            }}
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="kdr"
            name="kdr"
            stroke="#8b5cf6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorKdr)"
            dot={{ r: 2, fill: "#8b5cf6", strokeWidth: 0 }}
            activeDot={{ r: 4, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 2 }}
            connectNulls
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="kpm"
            name="kpm"
            stroke="#f59e0b"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            activeDot={{ r: 4, fill: "#f59e0b", stroke: "#fff", strokeWidth: 2 }}
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
});

// --- ROUND TIMELINE CHART ---
interface TicketDataPoint {
  timestamp: string;
  tickets1: number | null;
  tickets2: number | null;
  time_remain?: number | null;
}

interface KeyMoment {
  timestamp: string;
  event: string;
  tickets1: number;
  tickets2: number;
}

interface RoundTimelineChartProps {
  ticketTimeline: TicketDataPoint[];
  keyMoments?: KeyMoment[];
}

export function RoundTimelineChart({ ticketTimeline, keyMoments = [] }: RoundTimelineChartProps) {
  if (!ticketTimeline || ticketTimeline.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No timeline data available for this round.
      </div>
    );
  }

  // Process data for chart
  const chartData = ticketTimeline.map((point, index) => {
    const timestamp = new Date(point.timestamp);
    const minutes = index; // Use index as relative time

    return {
      time: minutes,
      label: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      axis: point.tickets1 ?? 0,
      allies: point.tickets2 ?? 0,
      delta: (point.tickets1 ?? 0) - (point.tickets2 ?? 0)
    };
  });

  // Calculate stats
  const startAxis = chartData[0]?.axis ?? 0;
  const startAllies = chartData[0]?.allies ?? 0;
  const endAxis = chartData[chartData.length - 1]?.axis ?? 0;
  const endAllies = chartData[chartData.length - 1]?.allies ?? 0;

  const axisLost = startAxis - endAxis;
  const alliesLost = startAllies - endAllies;
  const winner = endAxis > endAllies ? "Axis" : endAllies > endAxis ? "Allies" : "Draw";
  const ticketDiff = Math.abs(endAxis - endAllies);

  return (
    <div className="space-y-4">
      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="axisGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="alliesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
          <XAxis
            dataKey="time"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: "hsl(var(--border))" }}
            interval="preserveStartEnd"
            tickFormatter={(value) => {
              const point = chartData[value];
              return point?.label || '';
            }}
          />
          <YAxis
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: "hsl(var(--border))" }}
            domain={['dataMin - 10', 'dataMax + 10']}
          />
          <ReTooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px"
            }}
            labelFormatter={(value) => {
              const point = chartData[value as number];
              return point?.label || '';
            }}
            formatter={(value: number, name: string) => {
              const displayName = name === 'axis' ? 'Axis' : 'Allies';
              const color = name === 'axis' ? '#ef4444' : '#3b82f6';
              return [<span style={{ color }}>{value} tickets</span>, displayName];
            }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value) => (
              <span style={{ color: value === 'axis' ? '#ef4444' : '#3b82f6', fontWeight: 500 }}>
                {value === 'axis' ? 'Axis' : 'Allies'}
              </span>
            )}
          />
          <Area
            type="monotone"
            dataKey="axis"
            stroke="#ef4444"
            strokeWidth={2}
            fill="url(#axisGradient)"
            dot={false}
            activeDot={{ r: 4, fill: "#ef4444", stroke: "#fff", strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="allies"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#alliesGradient)"
            dot={false}
            activeDot={{ r: 4, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="text-center p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <div className="text-xs text-red-400 uppercase mb-1">Axis Tickets Lost</div>
          <div className="text-xl font-bold text-red-500 tabular-nums">{axisLost}</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="text-xs text-blue-400 uppercase mb-1">Allies Tickets Lost</div>
          <div className="text-xl font-bold text-blue-500 tabular-nums">{alliesLost}</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-muted/30 border border-border/40">
          <div className="text-xs text-muted-foreground uppercase mb-1">Final Margin</div>
          <div className="text-xl font-bold text-foreground tabular-nums">{ticketDiff}</div>
        </div>
        <div className={`text-center p-3 rounded-lg border ${winner === 'Axis' ? 'bg-red-500/10 border-red-500/20' : winner === 'Allies' ? 'bg-blue-500/10 border-blue-500/20' : 'bg-muted/30 border-border/40'}`}>
          <div className="text-xs text-muted-foreground uppercase mb-1">Winner</div>
          <div className={`text-xl font-bold tabular-nums ${winner === 'Axis' ? 'text-red-500' : winner === 'Allies' ? 'text-blue-500' : 'text-muted-foreground'}`}>
            {winner}
          </div>
        </div>
      </div>

      {/* Key Moments */}
      {keyMoments && keyMoments.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Key Moments</h4>
          <div className="space-y-2">
            {keyMoments.slice(0, 5).map((moment, index) => (
              <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/20 border border-border/40 text-sm">
                <div className="text-xs text-muted-foreground font-mono">
                  {new Date(moment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex-1 text-foreground">{moment.event}</div>
                <div className="text-xs">
                  <span className="text-red-500">{moment.tickets1}</span>
                  <span className="text-muted-foreground mx-1">vs</span>
                  <span className="text-blue-500">{moment.tickets2}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}