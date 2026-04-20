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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dna, Info } from "lucide-react";
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

// What each axis measures — shown in tooltip
const AXIS_DESCRIPTIONS: Record<string, string> = {
  Objective:
    "How much you contribute to game objectives (flags, bombs, tickets). Derived from your objective score relative to your peers.",
  "K/D Ratio":
    "Your kill-to-death ratio normalised against the ranked player pool. 50 = average, 100 = elite.",
  Lethality:
    "Kills per minute — how quickly you eliminate enemies in a round. Rewards aggressive, high-tempo play.",
  "Win Rate":
    "How often your team wins when you are playing. Measures team impact beyond personal stats.",
  Scoring:
    "Average score per round relative to other ranked players. Reflects overall round contribution.",
  Adaptability:
    "Your performance consistency across different maps and game contexts. High = you perform well everywhere.",
  Activity:
    "Total rounds played this period. Reaches 100 at 400+ ranked rounds — shows how active you are.",
  Roaming:
    "Number of distinct servers you have played on (max 100 at 25+ servers). High = you roam the network; low = you are loyal to a home server.",
};

// --- Archetypes ---
const ARCHETYPES: Array<{
  label: string;
  desc: string;
  color: string;
  match: (a: Record<string, number>) => boolean;
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
    desc: "Appears everywhere. Impossible to pin down. Roams the whole network.",
    color: "#8b5cf6",
    match: (a) => a["Roaming"] >= 65 && a["Adaptability"] >= 55,
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

export function PlayerDnaRadar({
  breakdown,
  lifetimeStats,
  playerName,
}: PlayerDnaRadarProps) {
  const rounds  = lifetimeStats.total_rounds_played ?? 0;
  const servers = lifetimeStats.unique_servers_played ?? lifetimeStats.unique_servers ?? 0;

  // Normalise each axis to 0–100
  // Roaming: 25 unique servers = 100. Most casuals are 1–5, regulars 5–15, nomads 25+.
  const axes: Record<string, number> = {
    Objective:    Math.round(clamp01(breakdown.obj_r)    * 100),
    "K/D Ratio":  Math.round(clamp01(breakdown.kdr_norm) * 100),
    Lethality:    Math.round(clamp01(breakdown.kpm_norm) * 100),
    "Win Rate":   Math.round(clamp01(breakdown.wr_norm)  * 100),
    Scoring:      Math.round(clamp01(breakdown.spr_norm) * 100),
    Adaptability: Math.round(clamp01(breakdown.mp_norm)  * 100),
    Activity:     Math.round(Math.min(rounds   / 400, 1) * 100),
    Roaming:      Math.round(Math.min(servers  / 25,  1) * 100),
  };

  const chartData = Object.entries(axes).map(([axis, value]) => ({ axis, value }));
  const archetype = ARCHETYPES.find((a) => a.match(axes)) ?? DEFAULT_ARCHETYPE;

  return (
    <Card className="border-border/60 bg-card/40 h-full">
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
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                  formatter={(v: number) => [`${v} / 100`, "Score"]}
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
              <div className="text-lg font-bold tracking-tight" style={{ color: archetype.color }}>
                {archetype.label}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{archetype.desc}</div>
            </div>

            {/* Axis bars with tooltips */}
            <TooltipProvider delayDuration={150}>
              <div className="space-y-2">
                {chartData.map(({ axis, value }) => (
                  <div key={axis} className="flex items-center gap-2">
                    {/* Label + info icon */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-24 flex items-center justify-end gap-1 shrink-0 cursor-help">
                          <span className="text-xs text-muted-foreground truncate">{axis}</span>
                          <Info className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        side="left"
                        className="max-w-[220px] text-xs leading-snug"
                      >
                        {AXIS_DESCRIPTIONS[axis] ?? axis}
                      </TooltipContent>
                    </Tooltip>

                    {/* Progress bar */}
                    <div className="flex-1 h-1.5 rounded-full bg-muted/30 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${value}%`, background: archetype.color, opacity: 0.75 }}
                      />
                    </div>

                    {/* Value */}
                    <div className="w-7 text-right text-[10px] font-mono text-muted-foreground tabular-nums">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
