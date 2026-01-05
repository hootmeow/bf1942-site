"use client";

import { useState, useEffect, useMemo } from "react";
import { AlertTriangle, Loader2, Clock, Map, Users, Server } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ServerActivityChart, ServerMapsPieChart } from "@/components/charts";
import { ScoreboardTable, ScoreboardPlayer } from "@/components/scoreboard-table";
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

  useEffect(() => {
    async function fetchRecentRounds() {
      if (!server_info?.server_id) return;
      try {
        const res = await fetch(`/api/v1/servers/search/rounds?search=${server_info.server_id}&page_size=5`);
        if (res.ok) {
          const data = await res.json();
          if (data.ok) {
            setRecentRounds(data.rounds);
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
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {server_info.current_server_name || "Server Details"}
        </h1>
        <p className="mt-1 text-muted-foreground">Live scoreboard and information</p>
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

      {/* Charts Section */}
      {metrics && (
        <Card className="border-border/60">
          <CardHeader><CardTitle as="h2">24 Hour Activity</CardTitle></CardHeader>
          <CardContent>
            <ServerActivityChart playerData={metrics.player_count_24h} pingData={metrics.avg_ping_24h} />
          </CardContent>
        </Card>
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
      {metricsLoading && (
        <div className="flex items-center justify-center p-8 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading historical metrics...
        </div>
      )}
    </div>
  );
}