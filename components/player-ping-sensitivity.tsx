"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PingBucket {
  avg_kd: number;
  avg_ping: number;
  round_count: number;
}

interface PingSensitivityData {
  ok: boolean;
  data_available: boolean;
  reason?: string;
  rounds_analysed?: number;
  correlation?: number;
  label?: string;
  description?: string;
  color?: string;
  ping_buckets?: { low: PingBucket | null; mid: PingBucket | null; high: PingBucket | null };
  avg_ping_overall?: number;
}

const COLOR_MAP: Record<string, { bar: string; text: string; border: string; bg: string }> = {
  emerald: { bar: "bg-emerald-500", text: "text-emerald-500", border: "border-emerald-500/30", bg: "bg-emerald-500/10" },
  amber:   { bar: "bg-amber-500",   text: "text-amber-500",   border: "border-amber-500/30",   bg: "bg-amber-500/10"   },
  red:     { bar: "bg-red-500",     text: "text-red-500",     border: "border-red-500/30",     bg: "bg-red-500/10"     },
  muted:   { bar: "bg-muted-foreground", text: "text-muted-foreground", border: "border-border/40", bg: "bg-muted/10" },
};

function CorrelationGauge({ value }: { value: number }) {
  // Map -1..1 → 0..100% bar width, centred at 50%
  const pct = Math.round((value + 1) / 2 * 100);
  const isNegative = value < 0;
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="space-y-1 cursor-default">
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>−1 (hurts)</span>
              <span className="font-semibold text-foreground">{value > 0 ? "+" : ""}{value.toFixed(3)}</span>
              <span>+1 (helps)</span>
            </div>
            <div className="relative h-2 rounded-full bg-muted/40 overflow-hidden">
              {/* Centre marker */}
              <div className="absolute inset-y-0 left-1/2 w-px bg-border/60" />
              {/* Fill from centre to score */}
              <div
                className={cn("absolute inset-y-0 transition-all duration-700", isNegative ? "bg-red-500" : "bg-emerald-500")}
                style={
                  isNegative
                    ? { left: `${pct}%`, right: "50%" }
                    : { left: "50%", right: `${100 - pct}%` }
                }
              />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs max-w-56">
          Pearson r between avg_ping and K/D ratio across {" "}recent rounds. Near 0 = unaffected. Negative = higher ping lowers K/D.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function PlayerPingSensitivity({ playerId }: { playerId: number }) {
  const [data, setData] = useState<PingSensitivityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!playerId) return;
    fetch(`/api/v1/players/${playerId}/ping-sensitivity`)
      .then((r) => r.json())
      .then((d: PingSensitivityData) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [playerId]);

  if (loading || !data?.ok || !data.data_available) return null;

  const colors = COLOR_MAP[data.color ?? "muted"];
  const { ping_buckets } = data;

  const buckets = [
    { key: "low",  label: "Low ping",  range: "< 80ms",    entry: ping_buckets?.low  },
    { key: "mid",  label: "Mid ping",  range: "80–150ms",  entry: ping_buckets?.mid  },
    { key: "high", label: "High ping", range: "> 150ms",   entry: ping_buckets?.high },
  ] as const;

  return (
    <Card className="border-border/60 bg-card/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs flex items-center gap-2">
            <Wifi className="h-3.5 w-3.5 text-primary" />
            Ping Sensitivity
          </CardTitle>
          <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", colors.text, colors.border, colors.bg)}>
            {data.label}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <p className="text-[10px] text-muted-foreground">{data.description}</p>

        {data.correlation !== undefined && (
          <CorrelationGauge value={data.correlation} />
        )}

        {/* Ping bucket breakdown */}
        <div className="grid grid-cols-3 gap-1.5">
          {buckets.map(({ key, label, range, entry }) => (
            <div key={key} className="rounded border border-border/40 bg-muted/10 px-2 py-1.5 text-center">
              <p className={cn("text-sm font-bold", entry ? "text-foreground" : "text-muted-foreground/40")}>
                {entry ? entry.avg_kd.toFixed(2) : "—"}
              </p>
              <p className="text-[10px] text-muted-foreground leading-tight">{label}</p>
              <p className="text-[10px] text-muted-foreground/60">{range}</p>
              {entry && (
                <p className="text-[10px] text-muted-foreground/50 mt-0.5">{entry.round_count}r</p>
              )}
            </div>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground/60 text-right">
          Based on {data.rounds_analysed} rounds · avg {data.avg_ping_overall}ms
        </p>
      </CardContent>
    </Card>
  );
}
