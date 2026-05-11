"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface VelocityPeriod {
  kd: number;
  kpm: number;
  avg_score: number;
  rounds: number;
}

interface VelocityChange {
  kd_pct: number | null;
  kpm_pct: number | null;
  score_pct: number | null;
}

export interface VelocityData {
  ok: boolean;
  data_available: boolean;
  reason?: string;
  trend?: "Rising" | "Stable" | "Declining";
  color?: string;
  current?: VelocityPeriod;
  previous?: VelocityPeriod;
  change?: VelocityChange;
  current_round_count?: number;
  previous_round_count?: number;
}

const TREND_CONFIG = {
  Rising:    { icon: TrendingUp,   textClass: "text-emerald-500", bgClass: "bg-emerald-500/10", borderClass: "border-emerald-500/30" },
  Stable:    { icon: Minus,        textClass: "text-amber-500",   bgClass: "bg-amber-500/10",   borderClass: "border-amber-500/30"   },
  Declining: { icon: TrendingDown, textClass: "text-red-500",     bgClass: "bg-red-500/10",     borderClass: "border-red-500/30"     },
};

function PctBadge({ value }: { value: number | null }) {
  if (value === null) return <span className="text-muted-foreground/40">—</span>;
  const pos = value > 0;
  return (
    <span className={cn("font-semibold", pos ? "text-emerald-500" : value < 0 ? "text-red-500" : "text-muted-foreground")}>
      {pos ? "+" : ""}{value.toFixed(1)}%
    </span>
  );
}

/** Small inline badge — rendered next to the KD number in the hero row */
export function VelocityBadge({ data }: { data: VelocityData }) {
  if (!data.data_available || !data.trend || !data.change) return null;
  const cfg = TREND_CONFIG[data.trend];
  const Icon = cfg.icon;
  const kd = data.change.kd_pct;
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded border", cfg.textClass, cfg.bgClass, cfg.borderClass)}>
      <Icon className="h-2.5 w-2.5" />
      {kd !== null ? `${kd > 0 ? "+" : ""}${kd.toFixed(1)}%` : data.trend}
    </span>
  );
}

/** Full card — shown in the profile body */
export function PlayerVelocityCard({ playerId }: { playerId: number }) {
  const [data, setData] = useState<VelocityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!playerId) return;
    fetch(`/api/v1/players/${playerId}/velocity`)
      .then((r) => r.json())
      .then((d: VelocityData) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [playerId]);

  if (loading || !data?.ok || !data.data_available) return null;

  const { trend, current, previous, change } = data;
  const cfg = TREND_CONFIG[trend!];
  const Icon = cfg.icon;

  const rows = [
    { label: "K/D Ratio",   cur: current!.kd.toFixed(3),        prev: previous!.kd.toFixed(3),        pct: change!.kd_pct    },
    { label: "KPM",         cur: current!.kpm.toFixed(3),        prev: previous!.kpm.toFixed(3),        pct: change!.kpm_pct   },
    { label: "Avg Score",   cur: Math.round(current!.avg_score), prev: Math.round(previous!.avg_score), pct: change!.score_pct },
  ] as const;

  return (
    <Card className="border-border/60 bg-card/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-primary" />
            30-Day Velocity
          </CardTitle>
          <span className={cn("inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border", cfg.textClass, cfg.bgClass, cfg.borderClass)}>
            <Icon className="h-2.5 w-2.5" />
            {trend}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-1.5">
        <p className="text-[10px] text-muted-foreground mb-2">
          Current 30 days ({current!.rounds}r) vs previous 30 days ({previous!.rounds}r).
        </p>
        {rows.map(({ label, cur, prev, pct }) => (
          <div key={label} className="flex items-center gap-2 rounded px-2 py-1 hover:bg-muted/20 transition-colors">
            <span className="text-[10px] text-muted-foreground w-16 shrink-0">{label}</span>
            <span className="text-[10px] text-muted-foreground/60 flex-1">{prev} → <span className="text-foreground font-medium">{cur}</span></span>
            <PctBadge value={pct ?? null} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
