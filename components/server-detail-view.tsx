"use client";

import { useState, useEffect, useMemo } from "react";
import { AlertTriangle, Loader2, Clock, Map, Users, Server, Globe, MessageCircle } from "lucide-react";
import { SERVER_LINKS } from "@/lib/server-links";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ServerActivityChart, ServerMapsPieChart } from "@/components/charts";
import { ScoreboardTable, ScoreboardPlayer } from "@/components/scoreboard-table";
import { ServerPeakHeatmap } from "@/components/server-peak-heatmap";
import { MapBalanceTable, MapBalanceStat } from "@/components/map-balance-table";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ServerFlag } from "@/components/server-flag";
import { useServerGeo } from "@/hooks/use-server-geo";

// Types
interface ServerInfo {
  server_id: number;
  ip: string;
  port: number;
  current_server_name: string | null;
  current_map: string | null;
  current_player_count: number;
  current_max_players: number;
  current_game_port: number;
  round_time_remain: number;
  live_snapshot_timestamp: string;
  tickets1: number;
  tickets2: number;
  ip_address?: string; // Fallback if ip is missing?
}

interface ServerDetailsData {
  ok: boolean;
  server_info: ServerInfo;
  scoreboard: ScoreboardPlayer[];
}

function StatCard({ title, value, icon }: { title: string; value: string | number; icon: React.ElementType }) {
  const Icon = icon;
  return (
    <div className="rounded-lg border border-border/60 bg-card/40 p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-primary/10 p-2 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-xs font-medium text-muted-foreground">{title}</h3>
          <p className="text-base font-semibold text-foreground">{value}</p>
        </div>
      </div>
    </div>
  );
}

export function ServerDetailView({ initialData, slug }: { initialData: ServerDetailsData | null, slug: string }) {
  const [metrics, setMetrics] = useState<any>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [recentRounds, setRecentRounds] = useState<any[]>([]);
  const [recentRoundsLoading, setRecentRoundsLoading] = useState(true);

  const { server_info, scoreboard } = initialData || { server_info: {} as any, scoreboard: [] };
  const communityLinks = server_info?.server_id ? SERVER_LINKS[server_info.server_id] : null;

  const { data: geo } = useServerGeo(server_info?.ip);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch(`/api/v1/servers/search/metrics?search=${slug}`);
        if (response.ok) {
          const result = await response.json();
          setMetrics(result.metrics);
        }
      } catch (e) {
        console.error("Failed to load metrics", e);
      } finally {
        setMetricsLoading(false);
      }
    }
    fetchMetrics();
  }, [slug]);

  const [rankData, setRankData] = useState<{ rank: number; activity_hours_7d: number } | null>(null);

  useEffect(() => {
    async function fetchRank() {
      if (!server_info?.server_id) return;
      try {
        const res = await fetch("/api/v1/servers/rankings?limit=100");
        if (res.ok) {
          const data = await res.json();
          if (data.ok && data.rankings) {
            const found = data.rankings.find((r: any) => r.server_id === server_info.server_id);
            if (found) {
              setRankData({ rank: found.rank, activity_hours_7d: found.activity_hours_7d });
            }
          }
        }
      } catch (e) {
        console.error("Failed to fetch rank", e);
      }
    }
    fetchRank();
  }, [server_info?.server_id]);

  useEffect(() => {
    async function fetchRecentRounds() {
      if (!server_info?.server_id) return;
      try {
        const res = await fetch(`/api/v1/servers/search/rounds?search=${server_info.server_id}&page_size=5`);
        if (res.ok) {
          const data = await res.json();
          if (data.ok) {
            setRecentRounds(data.rounds || []);
          }
        }
      } catch (e) {
        console.error("Failed to fetch recent rounds", e);
      } finally {
        setRecentRoundsLoading(false);
      }
    }
    fetchRecentRounds();
  }, [server_info?.server_id]);

  const [mapBalance, setMapBalance] = useState<MapBalanceStat[]>([]);
  useEffect(() => {
    async function fetchMapBalance() {
      if (!server_info?.server_id) return;
      try {
        const res = await fetch(`/api/v1/servers/search/balance?search=${server_info.server_id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.ok && data.map_balance_stats) {
            setMapBalance(data.map_balance_stats);
          }
        }
      } catch (e) {
        console.error("Failed to fetch map balance", e);
      }
    }
    fetchMapBalance();
  }, [server_info?.server_id]);


  const roundTime = useMemo(() => {
    if (!server_info.round_time_remain) return "N/A";
    const minutes = Math.floor(server_info.round_time_remain / 60);
    const seconds = server_info.round_time_remain % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, [server_info]);

  const [team1, team2] = useMemo(() => {
    if (!scoreboard) return [[], []];
    const t1 = scoreboard.filter((p) => p.team === 1).sort((a, b) => (b.score || 0) - (a.score || 0));
    const t2 = scoreboard.filter((p) => p.team === 2).sort((a, b) => (b.score || 0) - (a.score || 0));
    return [t1, t2];
  }, [scoreboard]);

  const winner = (server_info.tickets1 || 0) > (server_info.tickets2 || 0) ? 1 : (server_info.tickets2 || 0) > (server_info.tickets1 || 0) ? 2 : 0;

  if (!initialData) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Server not found or API unavailable.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground flex items-center gap-3">
          <ServerFlag ip={server_info.ip} className="h-6 w-auto shadow-md" />
          {server_info.current_server_name || "Server Details"}
        </h1>

        {/* Updated Subheader with Location Info */}
        <div className="mt-1 flex items-center gap-2 text-muted-foreground">
          {geo ? (
            <>
              <span className="font-medium text-foreground">{geo.city}, {geo.region}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{geo.timezone.current_time.split('T')[1].split('-')[0].split('+')[0]} ({geo.timezone.abbr})</span>
              </div>
            </>
          ) : (
            <span>Live scoreboard and information</span>
          )}
          {/* Community Links */}
          {communityLinks && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1 ml-1">
                {communityLinks.website && (
                  <a
                    href={communityLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    title="Visit Website"
                  >
                    <Globe className="h-4 w-4" />
                  </a>
                )}
                {communityLinks.discord && (
                  <a
                    href={communityLinks.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-md hover:bg-[#5865F2]/10 text-muted-foreground hover:text-[#5865F2] transition-colors"
                    title="Join Discord"
                  >
                    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                      <title>Discord</title>
                      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.5382-9.6739-3.5479-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
                    </svg>
                  </a>
                )}
              </div>
            </>
          )}

          {/* New Rank Badge */}
          {rankData && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-amber-400 font-mono font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                <span className="text-xs">GLOBAL RANK</span>
                <span>#{rankData.rank}</span>
                <span className="text-xs font-normal text-muted-foreground ml-1 hidden sm:inline">({rankData.activity_hours_7d}h activity)</span>
              </span>
            </>
          )}
        </div>
      </div>

      <Card className="border-border/60">
        <CardHeader><CardTitle as="h2">Server Details</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard title="Address" value={`${server_info.ip}:${server_info.current_game_port}`} icon={Server} />
          <StatCard title="Players" value={`${server_info.current_player_count} / ${server_info.current_max_players}`} icon={Users} />
          <StatCard title="Current Map" value={server_info.current_map || "N/A"} icon={Map} />
          <StatCard title="Time Remaining" value={roundTime} icon={Clock} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className={cn("border-border/60", winner === 1 && "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]")}>
          <CardHeader className={cn("bg-red-950/20 border-b border-red-900/20", winner === 1 && "bg-red-900/30")}>
            <div className="flex items-center justify-between">
              <CardTitle as="h2" className="text-red-500 flex items-center gap-2">
                Axis
              </CardTitle>
              <div className="text-2xl font-bold text-red-500">{server_info.tickets1 ?? 'N/A'} Tickets</div>
            </div>
          </CardHeader>
          <CardContent className="pt-6"><ScoreboardTable players={team1} /></CardContent>
        </Card>
        <Card className={cn("border-border/60", winner === 2 && "border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]")}>
          <CardHeader className={cn("bg-blue-950/20 border-b border-blue-900/20", winner === 2 && "bg-blue-900/30")}>
            <div className="flex items-center justify-between">
              <CardTitle as="h2" className="text-blue-500 flex items-center gap-2">
                Allies
              </CardTitle>
              <div className="text-2xl font-bold text-blue-500">{server_info.tickets2 ?? 'N/A'} Tickets</div>
            </div>
          </CardHeader>
          <CardContent className="pt-6"><ScoreboardTable players={team2} /></CardContent>
        </Card>
      </div>

      {metrics && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-border/60 lg:col-span-2">
            <CardHeader><CardTitle as="h2">24 Hour Activity</CardTitle></CardHeader>
            <CardContent>
              <ServerActivityChart playerData={metrics.player_count_24h} pingData={metrics.avg_ping_24h} />
            </CardContent>
          </Card>
          <div className="lg:col-span-1">
            <ServerPeakHeatmap data={metrics.player_count_24h} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {metrics && (
          <Card className="border-border/60 lg:col-span-1">
            <CardHeader><CardTitle as="h2">Map Rotation</CardTitle></CardHeader>
            <CardContent>
              <ServerMapsPieChart mapData={metrics.popular_maps_24h} />
            </CardContent>
          </Card>
        )}

        <Card className={cn("border-border/60", metrics ? "lg:col-span-2" : "lg:col-span-3")}>
          <CardHeader><CardTitle as="h2">Recent Rounds</CardTitle></CardHeader>
          <CardContent>
            {recentRoundsLoading ? (
              <div className="flex items-center justify-center p-8 text-muted-foreground">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading rounds...
              </div>
            ) : recentRounds.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Map</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Duration</TableHead>
                    <TableHead className="text-right">Players</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentRounds.map((round) => (
                    <TableRow key={round.round_id}>
                      <TableCell className="font-medium">{round.map_name}</TableCell>
                      <TableCell>{new Date(round.start_time).toLocaleString()}</TableCell>
                      <TableCell className="text-right">{Math.floor(round.duration_seconds / 60)}m {round.duration_seconds % 60}s</TableCell>
                      <TableCell className="text-right">{round.player_count}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/stats/rounds/${round.round_id}`} className="text-primary hover:underline">
                          View
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-4 text-center text-muted-foreground">No recent rounds found.</div>
            )}
          </CardContent>
        </Card>
      </div>

      {mapBalance.length > 0 && (
        <div className="mt-6">
          <MapBalanceTable stats={mapBalance} />
        </div>
      )}

      {metricsLoading && (
        <div className="flex items-center justify-center p-8 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading historical metrics...
        </div>
      )}
    </div>
  );
}