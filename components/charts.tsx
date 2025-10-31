"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";

const barData = Array.from({ length: 24 }).map((_, index) => ({
  hour: `${index}:00`,
  players: Math.floor(150 + Math.sin(index / 3) * 40 + (index % 5) * 10),
}));

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

export function PlayerActivityChart() {
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
