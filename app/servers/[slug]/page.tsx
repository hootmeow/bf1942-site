"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { AlertTriangle, Loader2, Clock, Map, Users, Server } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// Import new charts
import { ServerActivityChart, ServerMapsPieChart } from "@/components/charts";

// --- API Types ---

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

interface ServerDetailsApiResponse {
  ok: boolean;
  server_info: ServerInfo;
  scoreboard: ScoreboardPlayer[];
}

// --- NEW Metrics API Types ---
interface PlayerCountData {
  hour: string;
  avg_players: number;
  max_players: number;
}
interface AvgPingData {
  hour: string;
  avg_ping: number;
}
interface PopularMapData {
  map_name: string;
  rounds_played: number;
}
interface TopPlayerData {
  player_name: string;
  total_kills: number;
  total_deaths: number;
  kdr: number;
  avg_ping: number;
}

interface MetricsApiResponse {
  ok: boolean;
  server_id: number;
  metrics: {
    player_count_24h: PlayerCountData[];
    avg_ping_24h: AvgPingData[];
    popular_maps_24h: PopularMapData[];
    top_players_24h: TopPlayerData[];
  };
}


// --- Helper Functions ---

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
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
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
          // Using index in the key as player names might not be unique
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

// --- NEW Top Players Table ---
function TopPlayersTable({ players }: { players: TopPlayerData[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Player</TableHead>
          <TableHead className="text-right">Kills</TableHead>
          <TableHead className="text-right">Deaths</TableHead>
          <TableHead className="text-right">KDR</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player) => (
          <TableRow key={player.player_name}>
            <TableCell className="font-medium text-foreground">{player.player_name}</TableCell>
            <TableCell className="text-right">{player.total_kills}</TableCell>
            <TableCell className="text-right">{player.total_deaths}</TableCell>
            <TableCell className="text-right">{player.kdr.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}


// --- Main Page Component ---

export default function ServerDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;

  // State for server details (scoreboard)
  const [details, setDetails] = useState<ServerDetailsApiResponse | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(true);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  // NEW state for server metrics (charts)
  const [metrics, setMetrics] = useState<MetricsApiResponse['metrics'] | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  // Fetch server details (scoreboard)
  useEffect(() => {
    if (!slug) return;
    async function fetchServerDetails() {
      try {
        const response = await fetch(`/api/v1/servers/search?search=${slug}`);
        if (!response.ok) throw new Error(`Failed to fetch server data: ${response.statusText}`);
        const result: ServerDetailsApiResponse = await response.json();
        if (!result.ok) throw new Error("API returned an error");
        setDetails(result);
      } catch (err) {
        setDetailsError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setDetailsLoading(false);
      }
    }
    fetchServerDetails();
  }, [slug]);

  // NEW: Fetch server metrics (charts)
  useEffect(() => {
    if (!slug) return;
    async function fetchServerMetrics() {
      try {
        const response = await fetch(`/api/v1/servers/search/metrics?search=${slug}`);
        if (!response.ok) throw new Error(`Failed to fetch server metrics: ${response.statusText}`);
        const result: MetricsApiResponse = await response.json();
        if (!result.ok) throw new Error("Metrics API returned an error");
        setMetrics(result.metrics);
      } catch (err) {
        setMetricsError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setMetricsLoading(false);
      }
    }
    fetchServerMetrics();
  }, [slug]);


  // Format time from seconds to MM:SS
  const roundTime = useMemo(() => {
    if (!details?.server_info.round_time_remain) return "N/A";
    const minutes = Math.floor(details.server_info.round_time_remain / 60);
    const seconds = details.server_info.round_time_remain % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, [details]);

  // Split scoreboard into two teams and sort by score
  const [team1, team2] = useMemo(() => {
    if (!details?.scoreboard) return [[], []];
    const t1 = details.scoreboard.filter((p) => p.team === 1).sort((a, b) => b.score - a.score);
    const t2 = details.scoreboard.filter((p) => p.team === 2).sort((a, b) => b.score - a.score);
    return [t1, t2];
  }, [details]);


  // --- Render Logic ---

  if (detailsLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <p>Loading server details...</p>
      </div>
    );
  }

  if (detailsError || !details) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load server details. {detailsError}
        </AlertDescription>
      </Alert>
    );
  }

  const { server_info } = details;

  return (
    <div className="space-y-6">
      {/* 1. Server Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {server_info.current_server_name || "Server Details"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Live scoreboard and server information
        </p>
      </div>

      {/* 2. Server Details Card */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Server Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard title="Address" value={`${server_info.ip}:${server_info.current_game_port}`} icon={Server} />
          <StatCard title="Players" value={`${server_info.current_player_count} / ${server_info.current_max_players}`} icon={Users} />
          <StatCard title="Current Map" value={server_info.current_map || "N/A"} icon={Map} />
          <StatCard title="Time Remaining" value={roundTime} icon={Clock} />
        </CardContent>
      </Card>

      {/* 3. Scoreboard Grid (Current Player Stats) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Team 1 (Axis) - Tickets: {server_info.tickets1 ?? 'N/A'}</CardTitle>
          </CardHeader>
          <CardContent>
            <ScoreboardTable players={team1} />
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Team 2 (Allies) - Tickets: {server_info.tickets2 ?? 'N/A'}</CardTitle>
          </CardHeader>
          <CardContent>
            <ScoreboardTable players={team2} />
          </CardContent>
        </Card>
      </div>

      {/* 4. Metrics Section (24h Stats) */}
      {metricsLoading ? (
        <div className="flex items-center justify-center gap-2 rounded-lg border border-border/60 bg-card p-6 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p>Loading server metrics...</p>
        </div>
      ) : metricsError ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Metrics</AlertTitle>
          <AlertDescription>{metricsError}</AlertDescription>
        </Alert>
      ) : metrics && (
        <div className="space-y-6"> {/* Added a space-y-6 wrapper */}
          {/* 24h Activity Chart */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>24 Hour Player & Ping Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ServerActivityChart
                playerData={metrics.player_count_24h}
                pingData={metrics.avg_ping_24h}
              />
            </CardContent>
          </Card>
          
          {/* Bottom Grid for Top Players & Maps */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Top Players Table */}
            <Card className="border-border/60 lg:col-span-2">
              <CardHeader>
                <CardTitle>Top Players (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                <TopPlayersTable players={metrics.top_players_24h} />
              </CardContent>
            </Card>
            
            {/* Popular Maps Pie Chart */}
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle>Popular Maps (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                <ServerMapsPieChart mapData={metrics.popular_maps_24h} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      
    </div>
  );
}