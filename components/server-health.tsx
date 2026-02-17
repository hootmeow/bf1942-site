"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Loader2, Activity, Info, Wifi } from "lucide-react";
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

interface UptimeData {
  ok: boolean;
  uptime_7d_pct: number;
  uptime_30d_pct: number;
  populated_7d_pct: number;
  populated_30d_pct: number;
  first_seen: string | null;
  last_seen: string | null;
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

function getUptimeColor(value: number) {
  if (value >= 90) return "text-green-500";
  if (value >= 60) return "text-yellow-500";
  return "text-red-500";
}

function getUptimeBarColor(value: number) {
  if (value >= 90) return "bg-green-500";
  if (value >= 60) return "bg-yellow-500";
  return "bg-red-500";
}

export function ServerHealth({ serverId }: { serverId: number }) {
  const [connData, setConnData] = useState<ConnectionQualityData | null>(null);
  const [uptimeData, setUptimeData] = useState<UptimeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let finished = 0;
    const checkDone = () => { if (++finished >= 2) setLoading(false); };

    fetch(`/api/v1/servers/search/connection-quality?search=${serverId}`)
      .then(r => r.ok ? r.json() : null)
      .then(json => { if (json?.ok) setConnData(json); })
      .catch(() => {})
      .finally(checkDone);

    fetch(`/api/v1/servers/search/uptime?search=${serverId}`)
      .then(r => r.ok ? r.json() : null)
      .then(json => { if (json?.ok) setUptimeData(json); })
      .catch(() => {})
      .finally(checkDone);
  }, [serverId]);

  const title = (
    <CardHeader className="pb-3">
      <CardTitle as="h2" className="flex items-center gap-2">
        <Activity className="h-5 w-5 text-primary" />
        Server Health
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help ml-auto" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[240px]">
              <p className="text-xs">Connection quality from player ping data. Uptime = server responding to queries. Populated = at least 1 player online.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardTitle>
    </CardHeader>
  );

  if (loading) {
    return (
      <Card className="border-border/60">
        {title}
        <CardContent>
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasConn = connData && connData.total_players_sampled > 0;
  const hasUptime = uptimeData != null;

  if (!hasConn && !hasUptime) {
    return (
      <Card className="border-border/60">
        {title}
        <CardContent>
          <div className="p-4 text-center text-muted-foreground text-sm">No health data available.</div>
        </CardContent>
      </Card>
    );
  }

  const totalSamples = hasConn ? connData.distribution.reduce((sum, b) => sum + b.count, 0) : 0;

  return (
    <Card className="border-border/60">
      {title}
      <CardContent className="pt-0 space-y-5">
        {/* Connection Quality Section */}
        {hasConn && (
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <Wifi className="h-3.5 w-3.5" />
              Connection Quality
            </div>

            {/* Ping stats row */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-muted/30 p-2">
                <div className={cn("text-xl font-bold tabular-nums", getPingColor(connData.server_avg_ping))}>
                  {connData.server_avg_ping != null ? connData.server_avg_ping : "—"}
                </div>
                <div className="text-[10px] text-muted-foreground">Avg ms</div>
              </div>
              <div className="rounded-lg bg-muted/30 p-2">
                <div className={cn("text-xl font-bold tabular-nums", getPingColor(connData.server_median_ping))}>
                  {connData.server_median_ping != null ? connData.server_median_ping : "—"}
                </div>
                <div className="text-[10px] text-muted-foreground">Median ms</div>
              </div>
              <div className="rounded-lg bg-muted/30 p-2">
                <div className={cn("text-xl font-bold tabular-nums", getPingColor(connData.server_p95_ping))}>
                  {connData.server_p95_ping != null ? connData.server_p95_ping : "—"}
                </div>
                <div className="text-[10px] text-muted-foreground">P95 ms</div>
              </div>
            </div>

            {/* Stacked bar + breakdown */}
            {totalSamples > 0 && (
              <>
                <div className="flex h-2.5 rounded-full overflow-hidden">
                  {connData.distribution.map((bucket, i) => {
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
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {connData.distribution.map((bucket, i) => {
                    const pct = ((bucket.count / totalSamples) * 100);
                    return (
                      <div key={bucket.label} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <div className={cn("w-2 h-2 rounded-full", BUCKET_STYLES[i].dot)} />
                          <span className="text-muted-foreground">{bucket.label}</span>
                        </div>
                        <span className={cn("tabular-nums font-mono", BUCKET_STYLES[i].text)}>{pct.toFixed(0)}%</span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* Divider if both sections present */}
        {hasConn && hasUptime && <div className="border-t border-border/40" />}

        {/* Uptime Section */}
        {hasUptime && (
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <Activity className="h-3.5 w-3.5" />
              Uptime & Population
            </div>

            {/* 2x2 grid of uptime stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Uptime 7d", value: uptimeData.uptime_7d_pct },
                { label: "Uptime 30d", value: uptimeData.uptime_30d_pct },
                { label: "Populated 7d", value: uptimeData.populated_7d_pct },
                { label: "Populated 30d", value: uptimeData.populated_30d_pct },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className={cn("font-mono font-medium tabular-nums", getUptimeColor(item.value))}>{item.value}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted/50 overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all", getUptimeBarColor(item.value))} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {uptimeData.first_seen && (
              <div className="text-[10px] text-muted-foreground text-center pt-1 border-t border-border/30">
                Tracking since {new Date(uptimeData.first_seen).toLocaleDateString()}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
