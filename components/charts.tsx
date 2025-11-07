"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area, Label } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Import Tabs

// --- Mock Data for other charts (kept for stats page) ---
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


// --- Global PlayerActivityChart (Used on Homepage) ---
const processHeatmapData = (data: number[]) => {
  if (!data) return []; // Guard against undefined data
  return data.map((value, index) => ({
    hour: `${index.toString().padStart(2, '0')}:00`,
    activity: value,
  }));
};

/**
 * A single, reusable line chart component
 */
function ActivityLineChart({ data }: { data: number[] }) {
  const chartData = processHeatmapData(data);
  return (
    // --- Height set to 220px to be more compact ---
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} fontSize={12} />
        <YAxis stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} fontSize={12} />
        <ReTooltip
          cursor={{ fill: "hsl(var(--accent)/0.3)" }}
          contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: 12, border: "1px solid hsl(var(--border))" }}
          labelFormatter={(label) => `Hour: ${label} (UTC)`}
        />
        <Line type="monotone" dataKey="activity" name="Avg. Players" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

/**
 * Main chart component with 24h/7d toggle
 */
export function PlayerActivityChart({ data24h, data7d }: { data24h: number[]; data7d: number[] }) {
  return (
    <Tabs defaultValue="24h">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="24h">Last 24 Hours</TabsTrigger>
        <TabsTrigger value="7d">Last 7 Days</TabsTrigger>
      </TabsList>
      <TabsContent value="24h" className="pt-4">
        <ActivityLineChart data={data24h} />
      </TabsContent>
      <TabsContent value="7d" className="pt-4">
        <ActivityLineChart data={data7d} />
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
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="hour"
          stroke="hsl(var(--muted-foreground))"
          tickLine={false}
          axisLine={false}
          fontSize={12}
          interval={3}
        >
          <Label value="Hour of Day (UTC)" offset={-5} position="insideBottom" fill="hsl(var(--muted-foreground))" fontSize={12} />
        </XAxis>
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          tickLine={false}
          axisLine={false}
          fontSize={12}
          allowDecimals={false}
        >
          <Label value="Rounds Played" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} fill="hsl(var(--muted-foreground))" fontSize={12} />
        </YAxis>
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