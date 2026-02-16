"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Wifi, Loader2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface DistributionBucket {
  bucket: string;
  count: number;
  label: string;
}

interface ConnectionQualityData {
  ok: boolean;
  server_avg_ping: number | null;
  server_median_ping: number | null;
  server_p95_ping: number | null;
  total_players_sampled: number;
  distribution: DistributionBucket[];
}

const BUCKET_STYLES = [
  { label: "Excellent", range: "<50ms", color: "bg-green-500", text: "text-green-500", dot: "bg-green-500" },
  { label: "Good", range: "50-100ms", color: "bg-yellow-500", text: "text-yellow-500", dot: "bg-yellow-500" },
  { label: "Fair", range: "100-150ms", color: "bg-orange-500", text: "text-orange-500", dot: "bg-orange-500" },
  { label: "Poor", range: "150ms+", color: "bg-red-500", text: "text-red-500", dot: "bg-red-500" },
];

function getPingColor(ping: number | null) {
  if (ping == null) return "text-muted-foreground";
  if (ping < 50) return "text-green-500";
  if (ping < 100) return "text-yellow-500";
  if (ping < 150) return "text-orange-500";
  return "text-red-500";
}

interface ServerConnectionQualityProps {
  serverId: number;
}

export function ServerConnectionQuality({ serverId }: ServerConnectionQualityProps) {
  const [data, setData] = useState<ConnectionQualityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/v1/servers/search/connection-quality?search=${serverId}`);
        if (res.ok) {
          const json = await res.json();
          if (json.ok) setData(json);
        }
      } catch (e) {
        console.error("Failed to fetch connection quality", e);
      } finally {
        setLoading(false);
      }
    }

    if (serverId) fetchData();
  }, [serverId]);

  const titleRow = (
    <CardHeader>
      <CardTitle as="h2" className="flex items-center gap-2">
        <Wifi className="h-5 w-5 text-blue-500" />
        Connection Quality
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[220px]">
              <p className="text-xs">Ping distribution across all players who have played on this server, based on round averages.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardTitle>
    </CardHeader>
  );

  if (loading) {
    return (
      <Card className="border-border/60">
        {titleRow}
        <CardContent>
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.total_players_sampled === 0) {
    return (
      <Card className="border-border/60">
        {titleRow}
        <CardContent>
          <div className="p-4 text-center text-muted-foreground text-sm">No ping data available.</div>
        </CardContent>
      </Card>
    );
  }

  const totalSamples = data.distribution.reduce((sum, b) => sum + b.count, 0);
  const goodOrBetter = data.distribution.slice(0, 2).reduce((sum, b) => sum + b.count, 0);
  const goodPct = totalSamples > 0 ? Math.round((goodOrBetter / totalSamples) * 100) : 0;

  return (
    <Card className="border-border/60">
      {titleRow}
      <CardContent className="space-y-4">
        {/* Stat numbers */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className={cn("text-2xl font-bold tabular-nums", getPingColor(data.server_avg_ping))}>
              {data.server_avg_ping != null ? `${data.server_avg_ping}` : "—"}
            </div>
            <div className="text-xs text-muted-foreground">Avg (ms)</div>
          </div>
          <div>
            <div className={cn("text-2xl font-bold tabular-nums", getPingColor(data.server_median_ping))}>
              {data.server_median_ping != null ? `${data.server_median_ping}` : "—"}
            </div>
            <div className="text-xs text-muted-foreground">Median (ms)</div>
          </div>
          <div>
            <div className={cn("text-2xl font-bold tabular-nums", getPingColor(data.server_p95_ping))}>
              {data.server_p95_ping != null ? `${data.server_p95_ping}` : "—"}
            </div>
            <div className="text-xs text-muted-foreground">P95 (ms)</div>
          </div>
        </div>

        {/* Distribution breakdown */}
        {totalSamples > 0 && (
          <div className="space-y-3">
            {/* Stacked bar */}
            <div className="flex h-3 rounded-full overflow-hidden">
              {data.distribution.map((bucket, i) => {
                const pct = (bucket.count / totalSamples) * 100;
                if (pct === 0) return null;
                return (
                  <div
                    key={bucket.label}
                    className={cn(BUCKET_STYLES[i].color, "transition-all")}
                    style={{ width: `${pct}%` }}
                  />
                );
              })}
            </div>

            {/* Breakdown rows */}
            <div className="space-y-1.5">
              {data.distribution.map((bucket, i) => {
                const pct = totalSamples > 0 ? ((bucket.count / totalSamples) * 100) : 0;
                return (
                  <div key={bucket.label} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", BUCKET_STYLES[i].dot)} />
                      <span className="text-muted-foreground">{bucket.label}</span>
                      <span className="text-muted-foreground/60">{BUCKET_STYLES[i].range}</span>
                    </div>
                    <div className="flex items-center gap-2 tabular-nums">
                      <span className={BUCKET_STYLES[i].text}>{pct.toFixed(0)}%</span>
                      <span className="text-muted-foreground/60 w-12 text-right">{bucket.count.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-[10px] text-muted-foreground text-center pt-1 border-t border-border/30">
              {goodPct}% of {data.total_players_sampled.toLocaleString()} players have good or better connections
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
