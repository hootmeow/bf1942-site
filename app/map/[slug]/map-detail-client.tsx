"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServerDirectory, Server } from "@/components/server-directory";
import { Map, Loader2, Swords, Shield, TrendingDown, Zap, Clock, BarChart2, Trophy, Radio } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface VictoryMarginStats {
  map_name: string;
  total_rounds: number;
  allied_wins: number;
  axis_wins: number;
  allied_win_rate: number;
  axis_win_rate: number;
  avg_margin: number;
  closest_margin: number;
  widest_margin: number;
  nail_biter_count: number;
  nail_biter_rate: number;
  blowout_count: number;
  blowout_rate: number;
  avg_duration_seconds: number;
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  return `${m}m`;
}

function WinRateBar({ alliedRate, axisRate }: { alliedRate: number; axisRate: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span className="text-blue-400 font-medium">Allies {alliedRate}%</span>
        <span className="text-red-400 font-medium">Axis {axisRate}%</span>
      </div>
      <div className="flex h-3 rounded-full overflow-hidden bg-muted/40">
        <div
          className="bg-blue-500 transition-all duration-700"
          style={{ width: `${alliedRate}%` }}
        />
        <div
          className="bg-red-500 transition-all duration-700"
          style={{ width: `${axisRate}%` }}
        />
      </div>
    </div>
  );
}

export default function MapDetailClient() {
  const params = useParams();
  const mapName = typeof params.slug === "string" ? decodeURIComponent(params.slug) : "";

  const [servers, setServers] = useState<Server[]>([]);
  const [loadingServers, setLoadingServers] = useState(true);
  const [marginStats, setMarginStats] = useState<VictoryMarginStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!mapName) return;

    async function fetchServers() {
      try {
        const res = await fetch("/api/v1/servers");
        if (res.ok) {
          const data = await res.json();
          if (data.ok && Array.isArray(data.servers)) {
            setServers(
              data.servers.filter(
                (s: Server) =>
                  s.current_map?.toLowerCase() === mapName.toLowerCase() &&
                  s.current_state === "ACTIVE"
              )
            );
          }
        }
      } catch {
        // ignore
      } finally {
        setLoadingServers(false);
      }
    }

    async function fetchMarginStats() {
      try {
        const res = await fetch(
          `/api/v1/maps/search/victory-margin?map_name=${encodeURIComponent(mapName)}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.ok && data.stats?.length > 0) {
            // Pick exact match first, fallback to first result
            const exact = data.stats.find(
              (s: VictoryMarginStats) => s.map_name.toLowerCase() === mapName.toLowerCase()
            );
            setMarginStats(exact ?? data.stats[0]);
          }
        }
      } catch {
        // ignore
      } finally {
        setLoadingStats(false);
      }
    }

    fetchServers();
    fetchMarginStats();
  }, [mapName]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero */}
      <div
        className="relative overflow-hidden rounded-2xl border border-[#1e2a14] shadow-2xl"
        style={{ background: "linear-gradient(135deg, #0d1208 0%, #0a0f06 50%, #060a04 100%)" }}
      >
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-sky-500/6 blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary/6 blur-[70px] pointer-events-none" />

        <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-sky-400 mb-4">
                <Radio className="h-2.5 w-2.5 animate-pulse" />
                Map Intel
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                {mapName}
              </h1>
              <p className="mt-3 text-slate-400 max-w-md text-sm leading-relaxed">
                Historical battle statistics and active server intelligence.
              </p>
            </div>
            <div className="flex items-center gap-6 font-mono">
              <div className="text-center">
                <p className="text-2xl font-black text-sky-400 tabular-nums">{servers.length}</p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">Active Servers</p>
              </div>
              {marginStats && (
                <div className="text-center">
                  <p className="text-2xl font-black text-primary tabular-nums">{marginStats.total_rounds.toLocaleString()}</p>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">Rounds Played</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Victory Margin Stats */}
      {loadingStats ? (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading map statistics...
        </div>
      ) : marginStats ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-primary" />
            Historical Battle Stats
            <span className="text-sm font-normal text-muted-foreground ml-1">
              ({marginStats.total_rounds.toLocaleString()} ranked rounds)
            </span>
          </h2>

          {/* Win rate bar */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <Trophy className="h-4 w-4" /> Faction Win Rate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <WinRateBar alliedRate={marginStats.allied_win_rate} axisRate={marginStats.axis_win_rate} />
              <div className="grid grid-cols-2 gap-4 pt-1 text-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">{marginStats.allied_wins.toLocaleString()}</p>
                  <p className="text-muted-foreground text-xs">Allied Wins</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-400">{marginStats.axis_wins.toLocaleString()}</p>
                  <p className="text-muted-foreground text-xs">Axis Wins</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4-stat grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="border-border/60">
              <CardContent className="p-4 text-center">
                <Swords className="h-5 w-5 mx-auto mb-1 text-amber-400" />
                <p className="text-2xl font-bold">{marginStats.avg_margin}</p>
                <p className="text-xs text-muted-foreground">Avg Ticket Margin</p>
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardContent className="p-4 text-center">
                <Zap className="h-5 w-5 mx-auto mb-1 text-green-400" />
                <p className="text-2xl font-bold">{marginStats.nail_biter_rate}%</p>
                <p className="text-xs text-muted-foreground">
                  Nail-Biters
                  <span className="block text-[10px] opacity-60">≤50 ticket margin</span>
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardContent className="p-4 text-center">
                <TrendingDown className="h-5 w-5 mx-auto mb-1 text-red-400" />
                <p className="text-2xl font-bold">{marginStats.blowout_rate}%</p>
                <p className="text-xs text-muted-foreground">
                  Blowouts
                  <span className="block text-[10px] opacity-60">≥300 ticket margin</span>
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardContent className="p-4 text-center">
                <Clock className="h-5 w-5 mx-auto mb-1 text-blue-400" />
                <p className="text-2xl font-bold">{formatDuration(marginStats.avg_duration_seconds)}</p>
                <p className="text-xs text-muted-foreground">Avg Duration</p>
              </CardContent>
            </Card>
          </div>

          {/* Record margins */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="border-border/60 bg-muted/10">
              <CardContent className="p-4 flex items-center gap-3">
                <Shield className="h-5 w-5 text-green-400 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Closest Round</p>
                  <p className="font-semibold">{marginStats.closest_margin} ticket margin</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60 bg-muted/10">
              <CardContent className="p-4 flex items-center gap-3">
                <Swords className="h-5 w-5 text-red-400 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Biggest Blowout</p>
                  <p className="font-semibold">{marginStats.widest_margin} ticket margin</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="border-border/60 bg-muted/20">
          <CardContent className="p-6 text-center text-sm text-muted-foreground">
            No historical stats yet for {mapName}. Check back after more rounds have been played.
          </CardContent>
        </Card>
      )}

      {/* Active Servers List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Active Matches</h2>
        {loadingServers ? (
          <div className="flex items-center justify-center p-12 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Scanning servers...
          </div>
        ) : servers.length > 0 ? (
          <ServerDirectory initialServers={servers} />
        ) : (
          <Alert>
            <AlertTitle>No Active Battles</AlertTitle>
            <AlertDescription>
              There are currently no servers running {mapName}. Check back later!
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
