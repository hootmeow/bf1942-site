"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dna } from "lucide-react";
import type { SkillRating } from "@/components/skill-rating-card";

interface LifetimeStatsSlice {
  total_rounds_played: number;
  unique_maps: number;
  unique_maps_played?: number;
  unique_servers: number;
  unique_servers_played?: number;
  win_rate?: number;
}

interface PlayerDnaRadarProps {
  breakdown: SkillRating["breakdown"];
  lifetimeStats: LifetimeStatsSlice;
  playerName: string;
}

// --- Archetype definitions ---
const ARCHETYPES: Array<{
  label: string;
  desc: string;
  color: string;
  match: (axes: Record<string, number>) => boolean;
}> = [
  {
    label: "The Warlord",
    desc: "Lethal, relentless, and hard to kill. Built for raw combat.",
    color: "#ef4444",
    match: (a) => a["Lethality"] >= 65 && a["K/D Ratio"] >= 65,
  },
  {
    label: "The Tactician",
    desc: "Plays for the objective, wins rounds, and carries teams.",
    color: "#3b82f6",
    match: (a) => a["Objective"] >= 65 && a["Win Rate"] >= 60,
  },
  {
    label: "The Ghost",
    desc: "Appears everywhere. Impossible to pin down. Masters every map.",
    color: "#8b5cf6",
    match: (a) => a["Versatility"] >= 65 && a["Adaptability"] >= 60,
  },
  {
    label: "The Veteran",
    desc: "Always online, always reliable. The backbone of the server.",
    color: "#10b981",
    match: (a) => a["Activity"] >= 65 && a["Scoring"] >= 55,
  },
  {
    label: "The Reaper",
    desc: "Extraordinarily lethal but plays fast and loose with their own life.",
    color: "#f97316",
    match: (a) => a["Lethality"] >= 70 && a["K/D Ratio"] < 50,
  },
  {
    label: "The Survivor",
    desc: "Hard to kill. Low risk, patient, and consistent.",
    color: "#06b6d4",
    match: (a) => a["K/D Ratio"] >= 65 && a["Lethality"] < 55,
  },
];

const DEFAULT_ARCHETYPE = {
  label: "The Soldier",
  desc: "Well-rounded and dependable. A jack of all trades.",
  color: "#6b7280",
};

function clamp01(v: number | undefined): number {
  if (v == null || isNaN(v)) return 0;
  return Math.max(0, Math.min(1, v));
}

export function PlayerDnaRadar({ breakdown, lifetimeStats, playerName }: PlayerDnaRadarProps) {
  const rounds = lifetimeStats.total_rounds_played ?? 0;
  const maps = lifetimeStats.unique_maps_played ?? lifetimeStats.unique_maps ?? 0;

  // Normalise each axis to 0–100
  const axes: Record<string, number> = {
    Objective:    Math.round(clamp01(breakdown.obj_r)    * 100),
    "K/D Ratio":  Math.round(clamp01(breakdown.kdr_norm) * 100),
    Lethality:    Math.round(clamp01(breakdown.kpm_norm) * 100),
    "Win Rate":   Math.round(clamp01(breakdown.wr_norm)  * 100),
    Scoring:      Math.round(clamp01(breakdown.spr_norm) * 100),
    Adaptability: Math.round(clamp01(breakdown.mp_norm)  * 100),
    Activity:     Math.round(Math.min(rounds / 400, 1)   * 100),
    Versatility:  Math.round(Math.min(maps   / 16,  1)   * 100),
  };

  const chartData = Object.entries(axes).map(([axis, value]) => ({ axis, value }));

  const archetype =
    ARCHETYPES.find((a) => a.match(axes)) ?? DEFAULT_ARCHETYPE;

  return (
    <Card className="border-border/60 bg-card/40">
      <CardHeader>
        <CardTitle as="h2" className="flex items-center gap-2">
          <Dna className="h-5 w-5 text-violet-400" />
          Combat DNA — {playerName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Radar chart */}
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke="hsl(var(--border))" strokeOpacity={0.4} />
                <PolarAngleAxis
                  dataKey="axis"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                  formatter={(v: number) => [`${v}/100`, "Score"]}
                />
                <Radar
                  dataKey="value"
                  name={playerName}
                  stroke={archetype.color}
                  fill={archetype.color}
                  fillOpacity={0.18}
                  strokeWidth={2}
                  dot={{ r: 3, fill: archetype.color, strokeWidth: 0 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Archetype + axis breakdown */}
          <div className="flex flex-col justify-center gap-4">
            {/* Archetype badge */}
            <div
              className="rounded-xl border p-4"
              style={{
                borderColor: archetype.color + "40",
                background: archetype.color + "0d",
              }}
            >
              <div
                className="text-lg font-bold tracking-tight"
                style={{ color: archetype.color }}
              >
                {archetype.label}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{archetype.desc}</div>
            </div>

            {/* Axis bars */}
            <div className="space-y-2">
              {chartData.map(({ axis, value }) => (
                <div key={axis} className="flex items-center gap-2">
                  <div className="w-24 text-xs text-muted-foreground shrink-0 text-right">{axis}</div>
                  <div className="flex-1 h-1.5 rounded-full bg-muted/30 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${value}%`,
                        background: archetype.color,
                        opacity: 0.75,
                      }}
                    />
                  </div>
                  <div className="w-7 text-right text-[10px] font-mono text-muted-foreground tabular-nums">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
