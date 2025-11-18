"use client";

import { useState, useEffect, useMemo } from "react";
import { AlertTriangle, Loader2, Clock, Map, Users, Server } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { ServerActivityChart, ServerMapsPieChart } from "@/components/charts";

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

interface ScoreboardPlayer {
  player_name: string;
  score: number;
  kills: number;
  deaths: number;
  ping: number;
  team: 1 | 2;
}

interface ServerDetailsData {
  ok: boolean;
  server_info: ServerInfo;
  scoreboard: ScoreboardPlayer[];
}

// Helpers
function getPingColorClass(ping: number): string {
  if (ping <= 80) return "text-green-500";
  if (ping <= 120) return "text-yellow-500";
  if (ping <= 160) return "text-orange-500";
  return "text-red-500";
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

function ScoreboardTable({ players }: { players: ScoreboardPlayer[] }) {
  const totals = players.reduce(
    (acc, player) => {
      acc.score += player.score;
      acc.kills += player.kills;
      acc.deaths += player.deaths;
      return acc;
    },
    { score: 0, kills: 0, deaths: 0 }
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Player</TableHead>
          <TableHead className="text-right">Score</TableHead>
          <TableHead className="text-right">Kills</TableHead>
          <TableHead className="text-right">Deaths</TableHead>
          <TableHead className="text-right">Ping</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player, index) => (
          <TableRow key={`${player.player_name}-${index}`}>
            <TableCell className="font-medium text-foreground">{player.player_name}</TableCell>
            <TableCell className="text-right">{player.score}</TableCell>
            <TableCell className="text-right">{player.kills}</TableCell>
            <TableCell className="text-right">{player.deaths}</TableCell>
            <TableCell className={cn("text-right font-medium", getPingColorClass(player.ping))}>
              {player.ping}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="font-semibold text-foreground">Team Totals</TableCell>
          <TableCell className="text-right font-semibold text-foreground">{totals.score}</TableCell>
          <TableCell className="text-right font-semibold text-foreground">{totals.kills}</TableCell>
          <TableCell className="text-right font-semibold text-foreground">{totals.deaths}</TableCell>
          <TableCell className="text-right"></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

export function ServerDetailView({ initialData, slug }: { initialData: ServerDetailsData | null, slug: string }) {
  const [metrics, setMetrics] = useState<any>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);

  const { server_info, scoreboard } = initialData || { server_info: {} as any, scoreboard: [] };

  useEffect(() => {
    async function fetchMetrics() {
      try {
        // FIX: Use ID-based metrics endpoint
        const response = await fetch(`/api/v1/servers/${slug}/metrics`);
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

  const roundTime = useMemo(() => {
    if (!server_info.round_time_remain) return "N/A";
    const minutes = Math.floor(server_info.round_time_remain / 60);
    const seconds = server_info.round_time_remain % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, [server_info]);

  const [team1, team2] = useMemo(() => {
    if (!scoreboard) return [[], []];
    const t1 = scoreboard.filter((p) => p.team === 1).sort((a, b) => b.score - a.score);
    const t2 = scoreboard.filter((p) => p.team === 2).sort((a, b) => b.score - a.score);
    return [t1, t2];
  }, [scoreboard]);

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
        <Card className="border-border/60">
          <CardHeader><CardTitle as="h2">Axis (Tickets: {server_info.tickets1 ?? 'N/A'})</CardTitle></CardHeader>
          <CardContent><ScoreboardTable players={team1} /></CardContent>
        </Card>
        <Card className="border-border/60">
          <CardHeader><CardTitle as="h2">Allies (Tickets: {server_info.tickets2 ?? 'N/A'})</CardTitle></CardHeader>
          <CardContent><ScoreboardTable players={team2} /></CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      {metrics && (
        <div className="space-y-6">
          <Card className="border-border/60">
            <CardHeader><CardTitle as="h2">24 Hour Activity</CardTitle></CardHeader>
            <CardContent>
              <ServerActivityChart playerData={metrics.player_count_24h} pingData={metrics.avg_ping_24h} />
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-border/60 lg:col-span-1">
              <CardHeader><CardTitle as="h2">Map Rotation</CardTitle></CardHeader>
              <CardContent>
                <ServerMapsPieChart mapData={metrics.popular_maps_24h} />
              </CardContent>
            </Card>
          </div>
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