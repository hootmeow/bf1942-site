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
  unique_servers: number;
  unique_servers_played?: number;
}

interface PlayerDnaRadarProps {
  breakdown: SkillRating["breakdown"];
  lifetimeStats: LifetimeStatsSlice;
  playerName: string;
}

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

// Each axis gets its own accent color for the bar
const AXIS_COLORS: Record<string, string> = {
  Objective:    "#f59e0b",
  "K/D Ratio":  "#ef4444",
  Lethality:    "#f97316",
  "Win Rate":   "#10b981",
  Scoring:      "#3b82f6",
  Adaptability: "#8b5cf6",
  Activity:     "#06b6d4",
  Roaming:      "#ec4899",
};

const ARCHETYPES: Array<{
  label: string;
  desc: string;
  color: string;
  icon: string;
  match: (a: Record<string, number>) => boolean;
}> = [
  {
    label: "The Warlord",
    desc: "Lethal, relentless, and hard to kill. Built for raw combat.",
    color: "#ef4444",
    icon: "⚔️",
    match: (a) => a["Lethality"] >= 65 && a["K/D Ratio"] >= 65,
  },
  {
    label: "The Tactician",
    desc: "Plays for the objective, wins rounds, and carries teams.",
    color: "#3b82f6",
    icon: "🎯",
    match: (a) => a["Objective"] >= 65 && a["Win Rate"] >= 60,
  },
  {
    label: "The Ghost",
    desc: "Appears everywhere. Impossible to pin down. Roams the whole network.",
    color: "#8b5cf6",
    icon: "👻",
    match: (a) => a["Roaming"] >= 65 && a["Adaptability"] >= 55,
  },
  {
    label: "The Veteran",
    desc: "Always online, always reliable. The backbone of the server.",
    color: "#10b981",
    icon: "🎖️",
    match: (a) => a["Activity"] >= 65 && a["Scoring"] >= 55,
  },
  {
    label: "The Reaper",
    desc: "Extraordinarily lethal but plays fast and loose with their own life.",
    color: "#f97316",
    icon: "💀",
    match: (a) => a["Lethality"] >= 70 && a["K/D Ratio"] < 50,
  },
  {
    label: "The Survivor",
    desc: "Hard to kill. Low risk, patient, and consistent.",
    color: "#06b6d4",
    icon: "🛡️",
    match: (a) => a["K/D Ratio"] >= 65 && a["Lethality"] < 55,
  },
];

const DEFAULT_ARCHETYPE = {
  label: "The Soldier",
  desc: "Well-rounded and dependable. A jack of all trades.",
  color: "#6b7280",
  icon: "🪖",
};

function clamp01(v: number | undefined): number {
  if (v == null || isNaN(v)) return 0;
  return Math.max(0, Math.min(1, v));
}

// Tier label for a score 0–100
function scoreTier(v: number): { label: string; color: string } {
  if (v >= 80) return { label: "Elite",    color: "#f59e0b" };
  if (v >= 60) return { label: "Strong",   color: "#10b981" };
  if (v >= 40) return { label: "Average",  color: "#6b7280" };
  if (v >= 20) return { label: "Below Avg",color: "#f97316" };
  return               { label: "Weak",    color: "#ef4444" };
}

export function PlayerDnaRadar({
  breakdown,
  lifetimeStats,
  playerName,
}: PlayerDnaRadarProps) {
  const rounds  = lifetimeStats.total_rounds_played ?? 0;
  const servers = lifetimeStats.unique_servers_played ?? lifetimeStats.unique_servers ?? 0;

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

  // Overall score = weighted average
  const overallScore = Math.round(
    Object.values(axes).reduce((s, v) => s + v, 0) / Object.values(axes).length
  );

  // Top 3 strengths
  const strengths = Object.entries(axes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([k]) => k);

  const gradId = `dna-grad-${archetype.color.replace("#", "")}`;

  return (
    <Card className="border-border/60 bg-card/40 h-full overflow-hidden">
      {/* Header with gradient accent */}
      <div
        className="px-6 py-4 border-b border-border/40"
        style={{ background: `linear-gradient(135deg, ${archetype.color}18 0%, transparent 60%)` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="p-1.5 rounded-lg"
              style={{ background: archetype.color + "25" }}
            >
              <Dna className="h-4 w-4" style={{ color: archetype.color }} />
            </div>
            <div>
              <div className="font-semibold text-sm tracking-tight">Combat DNA</div>
              <div className="text-[10px] text-muted-foreground">{playerName}</div>
            </div>
          </div>

          {/* Overall score ring */}
          <div className="relative flex items-center justify-center" style={{ width: 52, height: 52 }}>
            <svg width="52" height="52" className="absolute inset-0">
              <defs>
                <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={archetype.color} />
                  <stop offset="100%" stopColor={archetype.color + "80"} />
                </linearGradient>
              </defs>
              <circle cx="26" cy="26" r="22" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" opacity={0.3} />
              <circle
                cx="26" cy="26" r="22"
                fill="none"
                stroke={`url(#${gradId})`}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${(overallScore / 100) * 138.2} 138.2`}
                transform="rotate(-90 26 26)"
              />
            </svg>
            <div className="relative text-center">
              <div className="text-base font-black tabular-nums leading-none" style={{ color: archetype.color }}>
                {overallScore}
              </div>
              <div className="text-[8px] text-muted-foreground leading-none mt-0.5">DNA</div>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Radar chart */}
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData} margin={{ top: 8, right: 28, bottom: 8, left: 28 }}>
                <defs>
                  <radialGradient id="radar-fill" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor={archetype.color} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={archetype.color} stopOpacity={0.05} />
                  </radialGradient>
                </defs>
                <PolarGrid stroke="hsl(var(--border))" strokeOpacity={0.3} />
                <PolarAngleAxis
                  dataKey="axis"
                  tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: 11,
                  }}
                  formatter={(v: number) => [
                    <span key="v" style={{ color: archetype.color }}>{v} / 100</span>,
                    "Score",
                  ]}
                />
                <Radar
                  dataKey="value"
                  name={playerName}
                  stroke={archetype.color}
                  fill="url(#radar-fill)"
                  fillOpacity={1}
                  strokeWidth={2}
                  dot={{ r: 3, fill: archetype.color, strokeWidth: 0 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Right panel */}
          <div className="flex flex-col gap-3">
            {/* Archetype badge */}
            <div
              className="rounded-xl border p-3 relative overflow-hidden"
              style={{
                borderColor: archetype.color + "35",
                background: `linear-gradient(135deg, ${archetype.color}12, transparent)`,
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{archetype.icon}</span>
                <div>
                  <div className="text-sm font-bold tracking-tight" style={{ color: archetype.color }}>
                    {archetype.label}
                  </div>
                  <div className="text-[10px] text-muted-foreground leading-snug mt-0.5">{archetype.desc}</div>
                </div>
              </div>
              {/* Top strengths */}
              <div className="flex gap-1 mt-2 flex-wrap">
                {strengths.map((s) => (
                  <span
                    key={s}
                    className="text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-widest"
                    style={{ background: (AXIS_COLORS[s] ?? archetype.color) + "20", color: AXIS_COLORS[s] ?? archetype.color }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Axis bars */}
            <TooltipProvider delayDuration={150}>
              <div className="space-y-1.5">
                {chartData.map(({ axis, value }) => {
                  const axisColor = AXIS_COLORS[axis] ?? archetype.color;
                  const tier = scoreTier(value);
                  return (
                    <div key={axis} className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="w-20 flex items-center justify-end gap-1 shrink-0 cursor-help">
                            <span className="text-[10px] text-muted-foreground truncate">{axis}</span>
                            <Info className="h-2.5 w-2.5 text-muted-foreground/40 shrink-0" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-[220px] text-xs leading-snug">
                          {AXIS_DESCRIPTIONS[axis] ?? axis}
                        </TooltipContent>
                      </Tooltip>

                      {/* Bar track */}
                      <div className="flex-1 h-2 rounded-full bg-muted/20 overflow-hidden relative">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${value}%`,
                            background: `linear-gradient(90deg, ${axisColor}cc, ${axisColor})`,
                          }}
                        />
                      </div>

                      {/* Value + tier */}
                      <div className="flex items-center gap-1 w-16 justify-end">
                        <span
                          className="text-[9px] font-semibold uppercase tracking-wide leading-none"
                          style={{ color: tier.color }}
                        >
                          {tier.label}
                        </span>
                        <span className="text-[10px] font-mono tabular-nums text-muted-foreground w-5 text-right">
                          {value}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
