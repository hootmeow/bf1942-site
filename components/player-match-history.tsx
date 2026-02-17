"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, History, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MatchRound {
  round_id: number;
  map_name: string;
  start_time: string;
  end_time: string;
  final_score: number;
  final_kills: number;
  final_deaths: number;
  kills_per_minute: number;
  team?: number;
  winner_team?: number;
  server_name?: string;
}

export function PlayerMatchHistory({ playerId }: { playerId: number }) {
  const [rounds, setRounds] = useState<MatchRound[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    if (!expanded) return;

    async function fetchRounds() {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/players/${playerId}/rounds?page=${page}&page_size=${pageSize}`);
        if (res.ok) {
          const data = await res.json();
          if (data.ok) {
            setRounds(data.rounds || []);
            setTotalPages(data.pagination?.total_pages || 0);
          }
        }
      } catch (e) {
        console.error("Failed to fetch match history", e);
      } finally {
        setLoading(false);
      }
    }

    fetchRounds();
  }, [playerId, page, expanded]);

  if (!expanded) {
    return (
      <Button variant="outline" className="w-full gap-2" onClick={() => setExpanded(true)}>
        <History className="h-4 w-4" />
        Show Full Match History
      </Button>
    );
  }

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle as="h2" className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Match History
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground tabular-nums">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading...
          </div>
        ) : (
          <div className="space-y-1">
            {/* Header */}
            <div className="grid grid-cols-[2rem_1fr_1fr_4rem_4rem_4rem_3.5rem] gap-2 px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              <div></div>
              <div>Map</div>
              <div>Server</div>
              <div className="text-right">Score</div>
              <div className="text-right">K/D</div>
              <div className="text-right">KPM</div>
              <div className="text-right">Date</div>
            </div>
            {rounds.map((round) => {
              const won = round.winner_team != null && round.team != null && round.winner_team !== 0 && round.team === round.winner_team;
              const lost = round.winner_team != null && round.team != null && round.winner_team !== 0 && round.team !== round.winner_team;
              const kd = round.final_deaths > 0 ? (round.final_kills / round.final_deaths).toFixed(1) : round.final_kills.toFixed(1);

              return (
                <Link
                  key={round.round_id}
                  href={`/stats/rounds/${round.round_id}`}
                  className="grid grid-cols-[2rem_1fr_1fr_4rem_4rem_4rem_3.5rem] gap-2 px-2 py-2 rounded-lg hover:bg-muted/30 transition-colors items-center group"
                >
                  {/* W/L badge */}
                  <div>
                    {won && <span className="inline-flex items-center justify-center h-5 w-5 rounded text-[10px] font-bold bg-green-500/20 text-green-500">W</span>}
                    {lost && <span className="inline-flex items-center justify-center h-5 w-5 rounded text-[10px] font-bold bg-red-500/20 text-red-400">L</span>}
                    {!won && !lost && <span className="inline-flex items-center justify-center h-5 w-5 rounded text-[10px] font-bold bg-muted/50 text-muted-foreground">—</span>}
                  </div>
                  <div className="text-sm font-medium truncate group-hover:text-primary transition-colors">{round.map_name}</div>
                  <div className="text-xs text-muted-foreground truncate">{round.server_name || "—"}</div>
                  <div className="text-sm text-right tabular-nums font-semibold">{round.final_score}</div>
                  <div className="text-sm text-right tabular-nums">
                    <span className="text-green-500">{round.final_kills}</span>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-red-400">{round.final_deaths}</span>
                  </div>
                  <div className="text-xs text-right tabular-nums text-muted-foreground">{round.kills_per_minute?.toFixed(2)}</div>
                  <div className="text-[10px] text-right text-muted-foreground">
                    {new Date(round.end_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                </Link>
              );
            })}
            {rounds.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">No rounds found.</div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
