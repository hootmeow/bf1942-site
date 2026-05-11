"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Target,
  Swords,
  Star,
  Zap,
  Flame,
  Shield,
  Share2,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast-simple";

interface CardStats {
  score: number;
  kills: number;
  deaths: number;
  kdr: number;
  kpm: number;
  avg_ping: number;
}

interface CardRanks {
  score_rank: number;
  score_percentile: number;
  kills_rank: number;
  kd_rank: number;
  team_score_rank: number;
  team_size: number;
}

interface Badge {
  id: string;
  label: string;
  icon: string;
}

interface ReportCardData {
  ok: boolean;
  player_id: number;
  player_name: string;
  round_id: number;
  map_name: string;
  gamemode: string | null;
  server_name: string | null;
  start_time: string;
  duration_seconds: number;
  total_players: number;
  team: number;
  won: boolean;
  winner_team: number | null;
  stats: CardStats;
  ranks: CardRanks;
  badges: Badge[];
}

const BADGE_ICONS: Record<string, React.ElementType> = {
  trophy: Trophy,
  target: Target,
  swords: Swords,
  star: Star,
  zap: Zap,
  flame: Flame,
  shield: Shield,
};

const BADGE_COLORS: Record<string, string> = {
  top_scorer: "bg-yellow-500/15 text-yellow-500 border-yellow-500/30",
  most_kills: "bg-red-500/15 text-red-500 border-red-500/30",
  best_kd: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  team_mvp: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  top_10pct: "bg-purple-500/15 text-purple-500 border-purple-500/30",
  dominant: "bg-orange-500/15 text-orange-500 border-orange-500/30",
  strong_kd: "bg-teal-500/15 text-teal-500 border-teal-500/30",
};

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function RoundReportCard({
  playerId,
  roundId,
  playerName,
}: {
  playerId: number;
  roundId: string | number;
  playerName?: string;
}) {
  const [data, setData] = useState<ReportCardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!playerId || !roundId) return;
    setLoading(true);
    fetch(`/api/v1/players/${playerId}/rounds/${roundId}/card`)
      .then((r) => r.json())
      .then((d: ReportCardData) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [playerId, roundId]);

  const handleShare = () => {
    const url = `${window.location.origin}/stats/rounds/${roundId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast({ title: "Link copied!", description: "Round link copied to clipboard.", variant: "success" });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) {
    return (
      <Card className="border-border/60 bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" />
            Your Performance Card
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-center justify-center text-muted-foreground text-xs">
            Loading report card…
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data?.ok) return null;

  const { stats, ranks, badges, won, team } = data;
  const teamLabel = team === 1 ? "Axis" : team === 2 ? "Allied" : "Unknown";

  return (
    <Card
      className={cn(
        "border-2 bg-card/50 transition-colors",
        won ? "border-emerald-500/40" : "border-red-500/20"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Trophy className={cn("h-4 w-4", won ? "text-yellow-500" : "text-muted-foreground")} />
            {data.player_name}&apos;s Match Card
          </CardTitle>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-xs font-semibold px-2 py-0.5 rounded-full border",
                won
                  ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
                  : "bg-red-500/15 text-red-500 border-red-500/30"
              )}
            >
              {won ? "VICTORY" : data.winner_team ? "DEFEAT" : "DRAW"} · {teamLabel}
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {data.map_name} · {data.server_name} · {formatDuration(data.duration_seconds)}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center rounded-lg border border-border/40 bg-muted/10 py-3">
            <p className="text-2xl font-bold">{stats.score}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">Score</p>
          </div>
          <div className="text-center rounded-lg border border-border/40 bg-muted/10 py-3">
            <p className="text-2xl font-bold">
              {stats.kills}<span className="text-base text-muted-foreground">/{stats.deaths}</span>
            </p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">K/D</p>
          </div>
          <div className="text-center rounded-lg border border-border/40 bg-muted/10 py-3">
            <p className="text-2xl font-bold">{stats.kdr.toFixed(2)}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">K/D Ratio</p>
          </div>
        </div>

        {/* Ranks */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between rounded border border-border/40 bg-muted/10 px-3 py-1.5">
            <span className="text-muted-foreground">Score rank</span>
            <span className="font-semibold">
              {ordinal(ranks.score_rank)}{" "}
              <span className="text-muted-foreground font-normal">/ {data.total_players}</span>
            </span>
          </div>
          <div className="flex justify-between rounded border border-border/40 bg-muted/10 px-3 py-1.5">
            <span className="text-muted-foreground">Percentile</span>
            <span className="font-semibold text-primary">{ranks.score_percentile}%</span>
          </div>
          <div className="flex justify-between rounded border border-border/40 bg-muted/10 px-3 py-1.5">
            <span className="text-muted-foreground">Kill rank</span>
            <span className="font-semibold">{ordinal(ranks.kills_rank)}</span>
          </div>
          <div className="flex justify-between rounded border border-border/40 bg-muted/10 px-3 py-1.5">
            <span className="text-muted-foreground">Team rank</span>
            <span className="font-semibold">
              {ordinal(ranks.team_score_rank)}{" "}
              <span className="text-muted-foreground font-normal">/ {ranks.team_size}</span>
            </span>
          </div>
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {badges.map((badge) => {
              const Icon = BADGE_ICONS[badge.icon] ?? Zap;
              return (
                <span
                  key={badge.id}
                  className={cn(
                    "inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wide",
                    BADGE_COLORS[badge.id] ?? "bg-muted/20 text-muted-foreground border-border/40"
                  )}
                >
                  <Icon className="h-2.5 w-2.5" />
                  {badge.label}
                </span>
              );
            })}
          </div>
        )}

        {/* Share button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2 text-xs"
          onClick={handleShare}
        >
          {copied ? (
            <><Check className="h-3 w-3" /> Copied!</>
          ) : (
            <><Share2 className="h-3 w-3" /> Share this round</>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
