"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingDown, ArrowLeftRight } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface BleedPoint {
  elapsed_s: number;
  tickets1: number;
  tickets2: number;
  bleed_rate_t1: number | null;
  bleed_rate_t2: number | null;
  leader: number;
  margin: number;
}

interface MomentumSummary {
  data_available: boolean;
  avg_bleed_rate_t1: number;
  avg_bleed_rate_t2: number;
  closest_margin: number | null;
  widest_margin: number | null;
  lead_changes: number;
  dominant_team: number;
  snapshot_count: number;
}

interface MomentumData {
  ok: boolean;
  map_name: string;
  server_name: string;
  winner_team: number | null;
  bleed_points: BleedPoint[];
  summary: MomentumSummary;
}

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  return `${m}m`;
}

// Custom tooltip
function MomentumTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: number;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const mins = Math.floor((label ?? 0) / 60);
  const secs = Math.round((label ?? 0) % 60);
  return (
    <div className="rounded-lg border border-border/60 bg-card/95 backdrop-blur-sm px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-muted-foreground mb-1">
        {mins}:{secs.toString().padStart(2, "0")} elapsed
      </p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <span className="font-bold">{p.value?.toFixed(1)}/min</span>
        </p>
      ))}
    </div>
  );
}

export function RoundMomentum({ roundId }: { roundId: string | number }) {
  const [data, setData] = useState<MomentumData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roundId) return;
    setLoading(true);
    fetch(`/api/v1/rounds/${roundId}/momentum`)
      .then((r) => r.json())
      .then((d: MomentumData) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load momentum data.");
        setLoading(false);
      });
  }, [roundId]);

  if (loading) {
    return (
      <Card className="border-border/60 bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Ticket Bleed Momentum
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center text-muted-foreground text-xs">
            Loading momentum data…
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data?.ok || !data.summary.data_available) {
    return null;
  }

  const { bleed_points, summary } = data;

  // Downsample if too many points (keep max 120 for readability)
  const step = Math.max(1, Math.floor(bleed_points.length / 120));
  const chartData = bleed_points
    .filter((_, i) => i % step === 0)
    .filter((p) => p.bleed_rate_t1 !== null && p.bleed_rate_t2 !== null)
    .map((p) => ({
      elapsed: p.elapsed_s,
      axis: +(p.bleed_rate_t1 ?? 0).toFixed(2),
      allied: +(p.bleed_rate_t2 ?? 0).toFixed(2),
    }));

  const dominantLabel =
    summary.dominant_team === 1
      ? "Axis had momentum"
      : summary.dominant_team === 2
      ? "Allied had momentum"
      : "Even match";

  return (
    <Card className="border-border/60 bg-card/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Ticket Bleed Rate
          </CardTitle>
          <span className="text-xs text-muted-foreground">{dominantLabel}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="axisGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="alliedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="elapsed"
                tickFormatter={formatElapsed}
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                unit="/m"
              />
              <Tooltip content={<MomentumTooltip />} />
              <Legend
                formatter={(value) => (
                  <span className="text-xs text-muted-foreground capitalize">{value}</span>
                )}
              />
              <Area
                type="monotone"
                dataKey="axis"
                name="Axis bleed"
                stroke="#f59e0b"
                strokeWidth={1.5}
                fill="url(#axisGrad)"
                dot={false}
                activeDot={{ r: 3 }}
              />
              <Area
                type="monotone"
                dataKey="allied"
                name="Allied bleed"
                stroke="#3b82f6"
                strokeWidth={1.5}
                fill="url(#alliedGrad)"
                dot={false}
                activeDot={{ r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Summary pills */}
        <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <TrendingDown className="h-3 w-3 text-amber-500" />
            Axis avg <span className="font-semibold text-amber-500 ml-1">{summary.avg_bleed_rate_t1}/min</span>
          </span>
          <span className="flex items-center gap-1">
            <TrendingDown className="h-3 w-3 text-blue-500" />
            Allied avg <span className="font-semibold text-blue-500 ml-1">{summary.avg_bleed_rate_t2}/min</span>
          </span>
          <span className="flex items-center gap-1">
            <ArrowLeftRight className="h-3 w-3" />
            {summary.lead_changes} lead change{summary.lead_changes !== 1 ? "s" : ""}
          </span>
          {summary.closest_margin !== null && (
            <span>Closest margin: <span className="font-semibold text-foreground">{summary.closest_margin} tickets</span></span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
