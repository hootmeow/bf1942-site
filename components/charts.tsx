"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area, Label, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LabelList } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- Mock Data (unchanged) ---
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

// --- Helper: Process Data ---
const processChartData = (data: number[]) => {
  if (!data) return [];
  const isDaily = data.length <= 7;
  return data.map((value, index) => ({
    label: isDaily ? `Day ${index + 1}` : `${index.toString().padStart(2, '0')}:00`,
    activity: value,
  }));
};

/**
 * UPDATED: ActivityAreaChart
 * Now uses an AreaChart with a gradient fill.
 * Accepts 'color' and 'gradientId' to visually distinguish between tabs.
 */
function ActivityAreaChart({
  data,
  color = "hsl(var(--primary))",
  gradientId
}: {
  data: number[];
  color?: string;
  gradientId: string;
}) {
  const chartData = processChartData(data);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis
          dataKey="label"
          stroke="hsl(var(--muted-foreground))"
          tickLine={false}
          axisLine={false}
          fontSize={12}
          minTickGap={30} // Prevents labels from crowding
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          tickLine={false}
          axisLine={false}
          fontSize={12}
          width={30}
        />
        <ReTooltip
          cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '4 4' }}
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            borderRadius: 8,
            border: "1px solid hsl(var(--border))",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}
          labelFormatter={(label) => label.includes(':') ? `Time: ${label} UTC` : label}
        />
        <Area
          type="monotone"
          dataKey="activity"
          name="Active Players"
          stroke={color}
          fillOpacity={1}
          fill={`url(#${gradientId})`}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/**
 * Main chart component with 24h/7d toggle
 * Now passes distinct colors to the Area Charts.
 */
export function PlayerActivityChart({ data24h, data7d }: { data24h: number[]; data7d: number[] }) {
  return (
    <Tabs defaultValue="24h">
      <div className="flex items-center justify-between pb-4">
        {/* We can move the list to the right or keep it full width, usually full width looks cleaner in dashboard cards */}
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="24h">Last 24 Hours</TabsTrigger>
          <TabsTrigger value="7d">Last 7 Days</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="24h" className="mt-0">
        <ActivityAreaChart
          data={data24h}
          key="chart-24h"
          gradientId="gradient-24h"
          color="hsl(var(--primary))" // Default Theme Color (usually Purple/Black)
        />
      </TabsContent>

      <TabsContent value="7d" className="mt-0">
        <ActivityAreaChart
          data={data7d}
          key="chart-7d"
          gradientId="gradient-7d"
          color="hsl(var(--chart-2))" // Secondary Chart Color (usually Teal/Blue)
        />
      </TabsContent>
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
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
        <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
        <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
        <ReTooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
        <Legend verticalAlign="top" height={36} />
        <Line yAxisId="left" type="monotone" dataKey="avg_players" name="Avg Players" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
        <Line yAxisId="left" type="monotone" dataKey="max_players" name="Max Players" stroke="hsl(var(--primary))" strokeWidth={1} strokeDasharray="5 5" dot={false} />
        <Line yAxisId="right" type="monotone" dataKey="avg_ping" name="Avg Ping (ms)" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ServerMapsPieChart({ mapData }: { mapData: any[] }) {
  const chartColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={mapData}
          dataKey="rounds_played"
          nameKey="map_name"
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={90}
          paddingAngle={5}
        >
          {mapData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
          ))}
        </Pie>
        <Legend verticalAlign="bottom" height={36} iconType="circle" />
        <ReTooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
      </PieChart>
    </ResponsiveContainer>
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
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
        <defs>
          <linearGradient id="colorMaps" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
        <XAxis type="number" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} hide />
        <YAxis
          dataKey="map_name"
          type="category"
          stroke="hsl(var(--foreground))"
          width={120}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 13, fontWeight: 500 }}
        />
        <ReTooltip
          cursor={{ fill: "hsl(var(--accent)/0.2)" }}
          contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: 8, border: "1px solid hsl(var(--border))" }}
        />
        <Bar
          dataKey="map_play_count"
          name="Rounds Played"
          fill="url(#colorMaps)"
          radius={[0, 4, 4, 0]}
          barSize={20}
          background={{ fill: 'hsl(var(--muted)/0.3)', radius: 4 }}
        >
          <LabelList dataKey="map_play_count" position="right" fill="hsl(var(--foreground))" fontSize={12} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PlayerTopServersChart({ data }: { data: { current_server_name: string; server_play_count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="colorServers" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
            <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
        <XAxis type="number" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} hide />
        <YAxis
          dataKey="current_server_name"
          type="category"
          stroke="hsl(var(--foreground))"
          width={180}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fontWeight: 500 }}
        />
        <ReTooltip
          cursor={{ fill: "hsl(var(--accent)/0.2)" }}
          contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: 8, border: "1px solid hsl(var(--border))" }}
        />
        <Bar
          dataKey="server_play_count"
          name="Rounds Played"
          fill="url(#colorServers)"
          radius={[0, 4, 4, 0]}
          barSize={20}
          background={{ fill: 'hsl(var(--muted)/0.3)', radius: 4 }}
        >
          <LabelList dataKey="server_play_count" position="right" fill="hsl(var(--foreground))" fontSize={12} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PlayerTeamPreferenceChart({ data }: { data: { name: string; value: number }[] }) {
  const teamColors = ["hsl(var(--destructive))", "hsl(var(--chart-1))"];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={60}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={teamColors[index % teamColors.length]} />
          ))}
        </Pie>
        <ReTooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: 8, border: "1px solid hsl(var(--border))" }} />
        <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
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