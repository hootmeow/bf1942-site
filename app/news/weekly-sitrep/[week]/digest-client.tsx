"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Loader2,
  Users,
  Map,
  TrendingUp,
  TrendingDown,
  Trophy,
  Target,
  Server,
  Clock,
  Zap,
  Star,
  ArrowLeft,
  Radio,
} from "lucide-react";

interface DigestData {
  summary: {
    total_rounds: number;
    total_kills: number;
    unique_players: number;
    rounds_change: number | null;
    kills_change: number | null;
    players_change: number | null;
  };
  top_players: {
    canonical_name: string;
    kills: number;
    deaths: number;
    score: number;
    kdr: number;
  }[];
  top_maps: { map_name: string; round_count: number; unique_players: number }[];
  top_servers: {
    server_name: string;
    round_count: number;
    unique_players: number;
    total_hours: number;
  }[];
  map_trends: {
    map_name: string;
    this_cnt: number;
    last_cnt: number;
    trend_pct: number | null;
  }[];
  gamemodes: { gamemode: string; round_count: number }[];
  biggest_round: {
    round_id: number;
    map_name: string;
    player_count: number;
    start_time: string;
    end_time: string;
    gamemode: string;
  } | null;
  notables: {
    top_kill_round?: {
      player: string;
      kills: number;
      map: string;
      round_id: number;
    };
    best_kdr_round?: {
      player: string;
      kills: number;
      deaths: number;
      kdr: number;
      map: string;
      round_id: number;
    };
    longest_round?: {
      round_id: number;
      map: string;
      duration_minutes: number;
      player_count: number;
    };
    most_active_player?: {
      player: string;
      rounds_played: number;
    };
  };
}

interface Digest {
  digest_id: number;
  week_number: number;
  period_start: string;
  period_end: string;
  digest_data: DigestData;
  created_at: string;
}

function ChangeBadge({ value }: { value: number | null }) {
  if (value === null || value === undefined) return null;
  const isPositive = value >= 0;
  return (
    <span
      className={`ml-1 inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium ${
        isPositive
          ? "bg-green-500/10 text-green-400"
          : "bg-red-500/10 text-red-400"
      }`}
    >
      {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {isPositive ? "+" : ""}
      {value}%
    </span>
  );
}

function formatDateRange(start: string, end: string) {
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  return `${fmt(start)} – ${fmt(end)}`;
}

export default function DigestClient() {
  const params = useParams();
  const week = params.week as string;
  const [digest, setDigest] = useState<Digest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!week) return;
    async function fetchDigest() {
      try {
        const res = await fetch(`/api/v1/news/digests/${week}`);
        const data = await res.json();
        if (data.ok) {
          setDigest(data.digest);
        } else {
          setError(data.error || "Digest not found");
        }
      } catch {
        setError("Failed to load digest");
      } finally {
        setLoading(false);
      }
    }
    fetchDigest();
  }, [week]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !digest) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <Button asChild variant="outline">
          <Link href="/news">&larr; Back to all news</Link>
        </Button>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Digest Not Found</AlertTitle>
          <AlertDescription>{error || "This weekly sitrep could not be found."}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const d = digest.digest_data;
  const notables = d.notables || {};

  // Split map trends into rising and falling
  const rising = d.map_trends
    .filter((m) => m.trend_pct !== null && m.trend_pct > 0)
    .sort((a, b) => (b.trend_pct ?? 0) - (a.trend_pct ?? 0))
    .slice(0, 3);
  const falling = d.map_trends
    .filter((m) => m.trend_pct !== null && m.trend_pct < 0)
    .sort((a, b) => (a.trend_pct ?? 0) - (b.trend_pct ?? 0))
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-8">
      {/* Back nav */}
      <Link
        href="/news"
        className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3 w-3" />
        All Dispatches
      </Link>

      {/* Hero */}
      <div
        className="relative overflow-hidden rounded-2xl border border-[#1e2a14] shadow-2xl"
        style={{ background: "linear-gradient(135deg, #0d1208 0%, #0a0f06 50%, #060a04 100%)" }}
      >
        <div className="absolute inset-x-0 top-0 h-[3px] bg-teal-500" />
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-teal-500/6 blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary/6 blur-[70px] pointer-events-none" />

        <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-teal-400 mb-4">
                <Radio className="h-2.5 w-2.5 animate-pulse" />
                Weekly Sitrep · Week {digest.week_number}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-snug">
                {formatDateRange(digest.period_start, digest.period_end)}
              </h1>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed max-w-2xl">
                {d.summary.unique_players} soldiers clashed across {d.summary.total_rounds} rounds,
                tallying {d.summary.total_kills.toLocaleString()} confirmed kills.
                {d.summary.players_change !== null && d.summary.players_change > 0
                  ? ` Activity up ${d.summary.players_change}% from last week.`
                  : d.summary.players_change !== null && d.summary.players_change < 0
                  ? ` Activity dipped ${Math.abs(d.summary.players_change)}% from last week.`
                  : ""}
              </p>
            </div>
            <div className="flex items-center gap-6 font-mono shrink-0">
              <div className="text-center">
                <p className="text-2xl font-black text-teal-400 tabular-nums">{d.summary.total_rounds}</p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">Rounds</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-red-400 tabular-nums">{d.summary.total_kills.toLocaleString()}</p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">Kills</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-primary tabular-nums">{d.summary.unique_players}</p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">Soldiers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notable Records */}
      {Object.keys(notables).length > 0 && (
        <Card className="border-border/60 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-yellow-500/10 via-transparent to-transparent border-b border-border/40 py-3">
            <CardTitle as="h2" className="flex items-center gap-2 text-base">
              <Zap className="h-4 w-4 text-yellow-500" />
              This Week&apos;s Records
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 grid gap-3 sm:grid-cols-2">
            {notables.top_kill_round && (
              <div className="flex items-start gap-3 p-3 rounded-lg border border-border/40 bg-muted/20">
                <div className="p-1.5 rounded-md bg-red-500/10 mt-0.5">
                  <Target className="h-3.5 w-3.5 text-red-500" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Most Kills in a Round</div>
                  <div className="font-semibold mt-0.5">
                    <Link href={`/player/${encodeURIComponent(notables.top_kill_round.player)}`} className="text-primary hover:underline">
                      {notables.top_kill_round.player}
                    </Link>
                    {" "}&mdash; {notables.top_kill_round.kills} kills
                  </div>
                  <div className="text-xs text-muted-foreground">
                    on {notables.top_kill_round.map}{" "}
                    <Link href={`/stats/rounds/${notables.top_kill_round.round_id}`} className="text-primary/70 hover:underline">(view round)</Link>
                  </div>
                </div>
              </div>
            )}
            {notables.best_kdr_round && (
              <div className="flex items-start gap-3 p-3 rounded-lg border border-border/40 bg-muted/20">
                <div className="p-1.5 rounded-md bg-purple-500/10 mt-0.5">
                  <Star className="h-3.5 w-3.5 text-purple-500" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Best Single-Round KDR</div>
                  <div className="font-semibold mt-0.5">
                    <Link href={`/player/${encodeURIComponent(notables.best_kdr_round.player)}`} className="text-primary hover:underline">
                      {notables.best_kdr_round.player}
                    </Link>
                    {" "}&mdash; {notables.best_kdr_round.kdr} KDR ({notables.best_kdr_round.kills}/{notables.best_kdr_round.deaths})
                  </div>
                  <div className="text-xs text-muted-foreground">
                    on {notables.best_kdr_round.map}{" "}
                    <Link href={`/stats/rounds/${notables.best_kdr_round.round_id}`} className="text-primary/70 hover:underline">(view round)</Link>
                  </div>
                </div>
              </div>
            )}
            {notables.longest_round && (
              <div className="flex items-start gap-3 p-3 rounded-lg border border-border/40 bg-muted/20">
                <div className="p-1.5 rounded-md bg-blue-500/10 mt-0.5">
                  <Clock className="h-3.5 w-3.5 text-blue-500" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Longest Round</div>
                  <div className="font-semibold mt-0.5">{notables.longest_round.duration_minutes} minutes</div>
                  <div className="text-xs text-muted-foreground">
                    {notables.longest_round.map} &middot; {notables.longest_round.player_count} players{" "}
                    <Link href={`/stats/rounds/${notables.longest_round.round_id}`} className="text-primary/70 hover:underline">(view round)</Link>
                  </div>
                </div>
              </div>
            )}
            {notables.most_active_player && (
              <div className="flex items-start gap-3 p-3 rounded-lg border border-border/40 bg-muted/20">
                <div className="p-1.5 rounded-md bg-green-500/10 mt-0.5">
                  <Users className="h-3.5 w-3.5 text-green-500" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Most Active Soldier</div>
                  <div className="font-semibold mt-0.5">
                    <Link href={`/player/${encodeURIComponent(notables.most_active_player.player)}`} className="text-primary hover:underline">
                      {notables.most_active_player.player}
                    </Link>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {notables.most_active_player.rounds_played} rounds played
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Top Soldiers */}
      {d.top_players.length > 0 && (
        <Card className="border-border/60 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-amber-500/10 via-transparent to-transparent border-b border-border/40 py-3">
            <CardTitle as="h2" className="flex items-center gap-2 text-base">
              <Trophy className="h-4 w-4 text-amber-500" />
              Top Soldiers
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead className="text-right">Kills</TableHead>
                  <TableHead className="text-right">KDR</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {d.top_players.map((p, i) => (
                  <TableRow key={p.canonical_name}>
                    <TableCell className="font-medium text-muted-foreground">
                      {i + 1}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/player/${encodeURIComponent(p.canonical_name)}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {p.canonical_name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {p.kills.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {p.kdr.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {p.score.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Popular Maps & Top Servers side by side */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Popular Maps */}
        {d.top_maps.length > 0 && (
          <Card className="border-border/60 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent border-b border-border/40 py-3">
              <CardTitle as="h2" className="flex items-center gap-2 text-base">
                <Map className="h-4 w-4 text-cyan-500" />
                Popular Maps
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5">
              {d.top_maps.map((m, i) => (
                <div key={m.map_name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-medium text-muted-foreground w-5 text-right">
                      {i + 1}.
                    </span>
                    <span className="font-medium text-sm">{m.map_name}</span>
                  </div>
                  <div className="text-xs tabular-nums text-muted-foreground">
                    {m.round_count} rounds &middot; {m.unique_players} players
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Top Servers */}
        {d.top_servers && d.top_servers.length > 0 && (
          <Card className="border-border/60 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent border-b border-border/40 py-3">
              <CardTitle as="h2" className="flex items-center gap-2 text-base">
                <Server className="h-4 w-4 text-emerald-500" />
                Top Servers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5">
              {d.top_servers.map((s, i) => (
                <div key={s.server_name} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-sm font-medium text-muted-foreground w-5 text-right shrink-0">
                      {i + 1}.
                    </span>
                    <span className="font-medium text-sm truncate">{s.server_name}</span>
                  </div>
                  <div className="text-xs tabular-nums text-muted-foreground whitespace-nowrap">
                    {s.unique_players} players &middot; {s.total_hours}h
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Rising & Falling */}
      {(rising.length > 0 || falling.length > 0) && (
        <div className="grid gap-6 md:grid-cols-2">
          {rising.length > 0 && (
            <Card className="border-border/60">
              <CardHeader className="pb-3 py-3">
                <CardTitle as="h2" className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Rising Maps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {rising.map((m) => (
                  <div key={m.map_name} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{m.map_name}</span>
                    <span className="text-xs font-medium text-green-400">
                      +{m.trend_pct}%
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {falling.length > 0 && (
            <Card className="border-border/60">
              <CardHeader className="pb-3 py-3">
                <CardTitle as="h2" className="text-base flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  Falling Maps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {falling.map((m) => (
                  <div key={m.map_name} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{m.map_name}</span>
                    <span className="text-xs font-medium text-red-400">
                      {m.trend_pct}%
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Biggest Battle */}
      {d.biggest_round && (
        <Card className="border-border/60 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-500/10 via-transparent to-transparent border-b border-border/40 py-3">
            <CardTitle as="h2" className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-orange-500" />
              Biggest Battle
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold">{d.biggest_round.map_name}</div>
                <div className="text-sm text-muted-foreground">
                  {d.biggest_round.player_count} players &middot;{" "}
                  {d.biggest_round.gamemode || "Conquest"}
                </div>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href={`/stats/rounds/${d.biggest_round.round_id}`}>
                  View Round
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer nav */}
      <Link
        href="/news"
        className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to News
      </Link>
    </div>
  );
}
