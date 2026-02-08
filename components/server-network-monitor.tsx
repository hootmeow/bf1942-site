"use client";

import { useState, useEffect, useMemo } from "react";
import { Activity, ChevronDown, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  Legend,
} from "recharts";

interface PingCurrent {
  monitor_location_id: string;
  timestamp: string;
  latency_ms: number;
  jitter_ms: number;
  packet_loss_percent: number;
  trace_route_hops: TraceHop[] | null;
}

interface TraceHop {
  hop: number;
  host: string;
  ip: string;
  avg_ms: number;
  loss_percent: number;
}

interface PingHistory {
  timestamp: string;
  monitor_location_id: string;
  latency_ms: number;
  jitter_ms: number;
  packet_loss_percent: number;
}

const LOCATION_LABELS: Record<string, string> = {
  us_east: "Virginia",
  us_west: "Oregon",
  eu_west: "London",
  eu_central: "Frankfurt",
  ap_southeast: "Sydney",
  ap_east: "Tokyo",
  Virginia: "Virginia",
  London: "London",
  Sydney: "Sydney",
};

const LOCATION_COLORS: string[] = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2, 280 65% 60%))",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
];

function getLocationLabel(id: string) {
  return LOCATION_LABELS[id] || id;
}

function latencyColor(ms: number) {
  if (ms < 50) return "text-green-400";
  if (ms < 100) return "text-yellow-400";
  return "text-red-400";
}

function latencyBgColor(ms: number) {
  if (ms < 50) return "bg-green-400/10 border-green-400/20";
  if (ms < 100) return "bg-yellow-400/10 border-yellow-400/20";
  return "bg-red-400/10 border-red-400/20";
}

export function ServerNetworkMonitor({ serverIp }: { serverIp: string }) {
  const [current, setCurrent] = useState<PingCurrent[]>([]);
  const [history, setHistory] = useState<PingHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [openTraces, setOpenTraces] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchNetwork() {
      try {
        const res = await fetch(`/api/v1/servers/search/network?search=${encodeURIComponent(serverIp)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.ok) {
            setCurrent(data.current || []);
            setHistory(data.history || []);
          }
        }
      } catch (e) {
        console.error("Failed to load network data", e);
      } finally {
        setLoading(false);
      }
    }
    fetchNetwork();
  }, [serverIp]);

  const locations = useMemo(() => current.map((c) => c.monitor_location_id), [current]);

  // Merge all locations into a single time-series for the chart
  const chartData = useMemo(() => {
    if (history.length === 0) return [];

    // Group by timestamp, create one row per unique time with a column per location
    const timeMap = new Map<string, Record<string, number | string>>();

    history.forEach((h) => {
      const time = new Date(h.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const key = h.timestamp; // use raw timestamp for ordering
      if (!timeMap.has(key)) {
        timeMap.set(key, { time, _ts: key });
      }
      const row = timeMap.get(key)!;
      row[`${h.monitor_location_id}_latency`] = h.latency_ms;
    });

    return Array.from(timeMap.values()).sort((a, b) =>
      String(a._ts).localeCompare(String(b._ts))
    );
  }, [history]);

  const toggleTrace = (loc: string) => {
    setOpenTraces((prev) => ({ ...prev, [loc]: !prev[loc] }));
  };

  if (loading) return null;

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle as="h2" className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5 text-primary" />
          Network Monitoring
        </CardTitle>
      </CardHeader>
      {current.length === 0 ? (
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Activity className="h-8 w-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">Network monitoring data is not available for this server.</p>
          </div>
        </CardContent>
      ) : (
      <CardContent className="space-y-3">
        {/* Stat tiles — one row per location */}
        {current.map((loc, i) => (
          <div key={loc.monitor_location_id}>
            <div className="flex items-center gap-2 mb-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: LOCATION_COLORS[i % LOCATION_COLORS.length] }}
              />
              <span className="text-xs font-medium text-muted-foreground">
                {getLocationLabel(loc.monitor_location_id)}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className={cn("rounded-lg border p-2 text-center", latencyBgColor(loc.latency_ms))}>
                <div className="text-[10px] font-medium text-muted-foreground">Latency</div>
                <div className={cn("text-lg font-bold", latencyColor(loc.latency_ms))}>
                  {loc.latency_ms.toFixed(0)}ms
                </div>
              </div>
              <div className="rounded-lg border border-border/60 bg-muted/30 p-2 text-center">
                <div className="text-[10px] font-medium text-muted-foreground">Jitter</div>
                <div className="text-lg font-bold text-foreground">
                  {loc.jitter_ms.toFixed(1)}ms
                </div>
              </div>
              <div className={cn(
                "rounded-lg border p-2 text-center",
                loc.packet_loss_percent > 0
                  ? "bg-red-400/10 border-red-400/20"
                  : "border-border/60 bg-muted/30"
              )}>
                <div className="text-[10px] font-medium text-muted-foreground">Pkt Loss</div>
                <div className={cn(
                  "text-lg font-bold",
                  loc.packet_loss_percent > 0 ? "text-red-400" : "text-foreground"
                )}>
                  {loc.packet_loss_percent.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Combined latency chart — all locations overlaid */}
        {chartData.length > 1 && (
          <div>
            <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground">
              <span>Latency over 6 hours</span>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.3} />
                <XAxis
                  dataKey="time"
                  stroke="hsl(var(--muted-foreground))"
                  tickLine={false}
                  axisLine={false}
                  fontSize={10}
                  interval="preserveStartEnd"
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  tickLine={false}
                  axisLine={false}
                  fontSize={10}
                  width={35}
                  unit="ms"
                />
                <ReTooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card)/0.95)",
                    borderRadius: 8,
                    border: "1px solid hsl(var(--border))",
                    backdropFilter: "blur(4px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600, marginBottom: 4 }}
                />
                {locations.length > 1 && (
                  <Legend
                    verticalAlign="top"
                    height={24}
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "10px" }}
                  />
                )}
                {locations.map((loc, i) => (
                  <Line
                    key={loc}
                    type="monotone"
                    dataKey={`${loc}_latency`}
                    stroke={LOCATION_COLORS[i % LOCATION_COLORS.length]}
                    strokeWidth={2}
                    dot={false}
                    name={getLocationLabel(loc)}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Traceroute — one collapsible per location */}
        {current.map((loc, i) => (
          loc.trace_route_hops && loc.trace_route_hops.length > 0 && (
            <div key={`trace-${loc.monitor_location_id}`}>
              <button
                onClick={() => toggleTrace(loc.monitor_location_id)}
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {openTraces[loc.monitor_location_id]
                  ? <ChevronDown className="h-3.5 w-3.5" />
                  : <ChevronRight className="h-3.5 w-3.5" />}
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: LOCATION_COLORS[i % LOCATION_COLORS.length] }}
                />
                Traceroute — {getLocationLabel(loc.monitor_location_id)}
              </button>
              {openTraces[loc.monitor_location_id] && (
                <div className="mt-1.5 rounded-lg border border-border/60 overflow-hidden max-h-48 overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/60 bg-muted/30">
                        <th className="text-left px-2 py-1.5 font-medium text-muted-foreground">#</th>
                        <th className="text-left px-2 py-1.5 font-medium text-muted-foreground">Host</th>
                        <th className="text-right px-2 py-1.5 font-medium text-muted-foreground">Avg</th>
                        <th className="text-right px-2 py-1.5 font-medium text-muted-foreground">Loss</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loc.trace_route_hops.map((hop) => (
                        <tr key={hop.hop} className="border-b border-border/40 last:border-0">
                          <td className="px-2 py-1 text-muted-foreground">{hop.hop}</td>
                          <td className="px-2 py-1 font-mono truncate max-w-[120px]" title={`${hop.host || "???"} (${hop.ip})`}>
                            {hop.host || hop.ip}
                          </td>
                          <td className={cn("px-2 py-1 text-right", latencyColor(hop.avg_ms))}>
                            {hop.avg_ms.toFixed(1)}ms
                          </td>
                          <td className={cn(
                            "px-2 py-1 text-right font-medium",
                            hop.loss_percent > 5 ? "text-red-400" : "text-muted-foreground"
                          )}>
                            {hop.loss_percent.toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )
        ))}
      </CardContent>
      )}
    </Card>
  );
}
