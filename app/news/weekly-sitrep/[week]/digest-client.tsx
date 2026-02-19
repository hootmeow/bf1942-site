"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
  Swords,
  Users,
  Map,
  TrendingUp,
  TrendingDown,
  Trophy,
  Target,
  Hash,
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
  top_maps: { map_name: string; round_count: number }[];
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
      className={`ml-2 inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium ${
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
    <div className="mx-auto max-w-4xl space-y-6">
      <Button asChild variant="outline">
        <Link href="/news">&larr; Back to all news</Link>
      </Button>

      <Card className="border-border/60">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Badge
              variant="outline"
              className="bg-purple-500/10 text-purple-400 border-purple-500/30"
            >
              Weekly Sitrep
            </Badge>
            <span className="text-sm text-muted-foreground">
              {digest.period_start} &mdash; {digest.period_end}
            </span>
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            Weekly Sitrep #{digest.week_number}
          </CardTitle>
          <CardDescription>
            Automated intelligence report covering all battlefield activity for
            the week.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Battlefield Summary */}
      <Card className="border-border/60 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-500/10 via-transparent to-transparent border-b border-border/40">
          <CardTitle as="h2" className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-500/20">
              <Swords className="h-4 w-4 text-purple-500" />
            </div>
            Battlefield Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4 p-4">
          <div className="text-center p-4 rounded-lg border bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
            <div className="text-3xl font-bold tabular-nums text-blue-400">
              {d.summary.total_rounds}
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
              Rounds Played
            </div>
            <ChangeBadge value={d.summary.rounds_change} />
          </div>
          <div className="text-center p-4 rounded-lg border bg-gradient-to-br from-red-500/10 to-transparent border-red-500/20">
            <div className="text-3xl font-bold tabular-nums text-red-400">
              {d.summary.total_kills.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
              Total Kills
            </div>
            <ChangeBadge value={d.summary.kills_change} />
          </div>
          <div className="text-center p-4 rounded-lg border bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
            <div className="text-3xl font-bold tabular-nums text-green-400">
              {d.summary.unique_players}
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
              Active Soldiers
            </div>
            <ChangeBadge value={d.summary.players_change} />
          </div>
        </CardContent>
      </Card>

      {/* Top Soldiers */}
      {d.top_players.length > 0 && (
        <Card className="border-border/60 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-amber-500/10 via-transparent to-transparent border-b border-border/40">
            <CardTitle as="h2" className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/20">
                <Trophy className="h-4 w-4 text-amber-500" />
              </div>
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

      {/* Popular Maps */}
      {d.top_maps.length > 0 && (
        <Card className="border-border/60 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent border-b border-border/40">
            <CardTitle as="h2" className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/20">
                <Map className="h-4 w-4 text-cyan-500" />
              </div>
              Popular Maps
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {d.top_maps.map((m, i) => (
              <div key={m.map_name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground w-6">
                    {i + 1}.
                  </span>
                  <span className="font-medium">{m.map_name}</span>
                </div>
                <span className="text-sm tabular-nums text-muted-foreground">
                  {m.round_count} rounds
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Rising & Falling */}
      {(rising.length > 0 || falling.length > 0) && (
        <div className="grid gap-6 md:grid-cols-2">
          {rising.length > 0 && (
            <Card className="border-border/60">
              <CardHeader className="pb-3">
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
              <CardHeader className="pb-3">
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
          <CardHeader className="bg-gradient-to-r from-orange-500/10 via-transparent to-transparent border-b border-border/40">
            <CardTitle as="h2" className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-orange-500/20">
                <Target className="h-4 w-4 text-orange-500" />
              </div>
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
    </div>
  );
}
