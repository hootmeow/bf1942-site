"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";

// --- Existing Global Charts ---

const barData = Array.from({ length: 24 }).map((_, index) => ({
  hour: `${index}:00`,
  players: Math.floor(150 + Math.sin(index / 3) * 40 + (index % 5) * 10),
}));
// ... (rest of existing chart data)
const popularMapsData = [
  { map: "Wake Island", plays: 420 },
  { map: "Stalingrad", plays: 380 },
  { map: "El Alamein", plays: 350 },
  { map: "Market Garden", plays: 300 },
  { map: "Guadalcanal", plays: 270 },
];

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--secondary))"];

export function PlayerActivityChart() {
  // ... (existing function)
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={barData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
        <YAxis stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
        <ReTooltip cursor={{ fill: "hsl(var(--accent)/0.3)" }} contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
        <Bar dataKey="players" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ServerUptimeChart() {
  // ... (existing function)
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
  // ... (existing function)
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
  // ... (existing function)
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
  // ... (existing function)
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


// --- NEW Server-Specific Charts ---

/**
 * Merges player count and ping data, formats hour for X-axis
 */
const processMetricsData = (playerData: any[], pingData: any[]) => {
  const pingMap = new Map(pingData.map(p => [p.hour, p.avg_ping]));
  
  return playerData.map(p => ({
    ...p,
    avg_ping: pingMap.get(p.hour) || 0,
    // Format "2025-11-06T22:00:00" to "22:00"
    hour: new Date(p.hour).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    avg_players: Math.round(p.avg_players), // Round for cleaner tooltip
    avg_ping: Math.round(pingMap.get(p.hour) || 0), // Round for cleaner tooltip
  }));
};

/**
 * New chart for 24h Player Activity & Avg Ping
 */
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

/**
 * New Pie Chart for Popular Maps
 */
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