"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Trophy, Target, Crosshair, Hash, Loader2, Star, ChevronRight, Medal } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServerRank {
  server_id: number;
  server_name: string;
  rounds_played: number;
  total_kills: number;
  total_deaths: number;
  total_score: number;
  kdr: number | null;
  score_rank: number;
  kills_rank: number;
  kdr_rank: number;
  rounds_rank: number;
  total_players: number;
}

interface PlayerServerRanksProps {
  playerName: string;
}

function getRankBadgeStyle(rank: number) {
  if (rank === 1) return "bg-amber-500/20 text-amber-500 ring-1 ring-amber-500/30";
  if (rank === 2) return "bg-slate-400/20 text-slate-400 ring-1 ring-slate-400/30";
  if (rank === 3) return "bg-orange-500/20 text-orange-500 ring-1 ring-orange-500/30";
  if (rank <= 10) return "bg-primary/20 text-primary ring-1 ring-primary/30";
  return "bg-muted/50 text-muted-foreground";
}

function RankBadge({ rank, total, label }: { rank: number; total: number; label: string }) {
  const percentile = ((total - rank + 1) / total * 100).toFixed(0);
  const isTop10 = rank <= 10;
  const isTop3 = rank <= 3;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={cn(
        "flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold",
        getRankBadgeStyle(rank)
      )}>
        {isTop3 ? <Trophy className="w-3.5 h-3.5" /> : `#${rank}`}
      </div>
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
      {isTop10 && (
        <span className="text-[9px] text-primary font-medium">Top {percentile}%</span>
      )}
    </div>
  );
}

export function PlayerServerRanks({ playerName }: PlayerServerRanksProps) {
  const [serverRanks, setServerRanks] = useState<ServerRank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    async function fetchServerRanks() {
      try {
        const res = await fetch(`/api/v1/players/search/server_ranks?name=${encodeURIComponent(playerName)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.ok && data.server_ranks) {
            setServerRanks(data.server_ranks);
          } else {
            setError("No server data available");
          }
        } else {
          setError("Failed to load server ranks");
        }
      } catch (e) {
        console.error("Failed to fetch server ranks", e);
        setError("Failed to load server ranks");
      } finally {
        setLoading(false);
      }
    }

    if (playerName) {
      fetchServerRanks();
    }
  }, [playerName]);

  if (loading) {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle as="h3" className="flex items-center gap-2 text-lg">
            <Medal className="h-5 w-5 text-amber-500" />
            Server Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading rankings...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || serverRanks.length === 0) {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle as="h3" className="flex items-center gap-2 text-lg">
            <Medal className="h-5 w-5 text-amber-500" />
            Server Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-muted-foreground">
            {error || "No server rankings available (requires 3+ rounds on a server)."}
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayedServers = expanded ? serverRanks : serverRanks.slice(0, 3);

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle as="h3" className="flex items-center gap-2 text-lg">
            <Medal className="h-5 w-5 text-amber-500" />
            Server Rankings
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {serverRanks.length} server{serverRanks.length !== 1 ? 's' : ''}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {displayedServers.map((server) => (
          <div
            key={server.server_id}
            className="rounded-lg border border-border/40 bg-card/30 p-4 hover:bg-card/50 transition-colors"
          >
            {/* Server Name */}
            <div className="flex items-center justify-between mb-3">
              <Link
                href={`/servers/${server.server_id}`}
                className="font-medium text-foreground hover:text-primary hover:underline underline-offset-2 flex items-center gap-2"
              >
                <Server className="h-4 w-4 text-muted-foreground" />
                {server.server_name}
              </Link>
              <Link
                href={`/servers/${server.server_id}/rankings`}
                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
              >
                Full Rankings <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Rank Badges */}
            <div className="grid grid-cols-4 gap-3">
              <RankBadge rank={server.score_rank} total={server.total_players} label="Score" />
              <RankBadge rank={server.kills_rank} total={server.total_players} label="Kills" />
              <RankBadge rank={server.kdr_rank} total={server.total_players} label="K/D" />
              <RankBadge rank={server.rounds_rank} total={server.total_players} label="Rounds" />
            </div>

            {/* Stats Summary */}
            <div className="mt-3 pt-3 border-t border-border/30 grid grid-cols-4 gap-2 text-center">
              <div>
                <div className="text-sm font-semibold text-foreground tabular-nums">{server.total_score.toLocaleString()}</div>
                <div className="text-[10px] text-muted-foreground">Score</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground tabular-nums">{server.total_kills.toLocaleString()}</div>
                <div className="text-[10px] text-muted-foreground">Kills</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground tabular-nums">{server.kdr?.toFixed(2) || "—"}</div>
                <div className="text-[10px] text-muted-foreground">K/D</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground tabular-nums">{server.rounds_played}</div>
                <div className="text-[10px] text-muted-foreground">Rounds</div>
              </div>
            </div>
          </div>
        ))}

        {/* Show More/Less Button */}
        {serverRanks.length > 3 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1"
          >
            {expanded ? (
              <>Show Less</>
            ) : (
              <>Show {serverRanks.length - 3} More Server{serverRanks.length - 3 !== 1 ? 's' : ''}</>
            )}
          </button>
        )}
      </CardContent>
    </Card>
  );
}
