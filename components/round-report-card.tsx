"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trophy, Target, Swords, Star, Zap, Flame, Shield, Share2, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast-simple";

export interface ReportCardData {
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
  stats: { score: number; kills: number; deaths: number; kdr: number; kpm: number; avg_ping: number };
  ranks: { score_rank: number; score_percentile: number; kills_rank: number; kd_rank: number; team_score_rank: number; team_size: number };
  badges: { id: string; label: string; icon: string }[];
}

const BADGE_ICONS: Record<string, React.ElementType> = {
  trophy: Trophy, target: Target, swords: Swords,
  star: Star, zap: Zap, flame: Flame, shield: Shield,
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

export function RoundReportCard({ data, roundId }: { data: ReportCardData; roundId: string | number }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleShare = () => {
    const url = `${window.location.origin}/stats/rounds/${roundId}?player=${encodeURIComponent(data.player_name)}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast({ title: "Link copied!", description: "Share this link so others can see your card.", variant: "success" });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const { stats, ranks, badges, won, team, winner_team } = data;
  const teamLabel = team === 1 ? "Axis" : team === 2 ? "Allied" : "—";

  return (
    <Card className={cn("border-2", won ? "border-emerald-500/40" : winner_team ? "border-red-500/20" : "border-border/60")}>
      <CardContent className="pt-4 space-y-3">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className={cn("h-4 w-4", won ? "text-yellow-500" : "text-muted-foreground")} />
            <span className="text-sm font-semibold">{data.player_name}</span>
          </div>
          <span className={cn(
            "text-xs font-bold px-2 py-0.5 rounded-full border",
            won ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
              : winner_team ? "bg-red-500/15 text-red-500 border-red-500/30"
              : "bg-muted/20 text-muted-foreground border-border/40"
          )}>
            {won ? "VICTORY" : winner_team ? "DEFEAT" : "DRAW"} · {teamLabel}
          </span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { label: "Score", value: stats.score },
            { label: "Kills", value: stats.kills },
            { label: "Deaths", value: stats.deaths },
            { label: "K/D", value: stats.kdr.toFixed(2) },
          ].map(({ label, value }) => (
            <div key={label} className="rounded border border-border/40 bg-muted/10 py-2">
              <p className="text-sm font-bold leading-tight">{value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Rank row */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex flex-col items-center rounded border border-border/40 bg-muted/10 py-1.5">
            <span className="font-semibold">{ordinal(ranks.score_rank)} / {data.total_players}</span>
            <span className="text-[10px] text-muted-foreground">Score rank</span>
          </div>
          <div className="flex flex-col items-center rounded border border-border/40 bg-muted/10 py-1.5">
            <span className="font-semibold text-primary">{ranks.score_percentile}%</span>
            <span className="text-[10px] text-muted-foreground">Percentile</span>
          </div>
          <div className="flex flex-col items-center rounded border border-border/40 bg-muted/10 py-1.5">
            <span className="font-semibold">{ordinal(ranks.team_score_rank)} / {ranks.team_size}</span>
            <span className="text-[10px] text-muted-foreground">Team rank</span>
          </div>
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {badges.map((badge) => {
              const Icon = BADGE_ICONS[badge.icon] ?? Zap;
              return (
                <span key={badge.id} className={cn(
                  "inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wide",
                  BADGE_COLORS[badge.id] ?? "bg-muted/20 text-muted-foreground border-border/40"
                )}>
                  <Icon className="h-2.5 w-2.5" />
                  {badge.label}
                </span>
              );
            })}
          </div>
        )}

        {/* Share */}
        <Button variant="outline" size="sm" className="w-full gap-2 text-xs h-7" onClick={handleShare}>
          {copied ? <><Check className="h-3 w-3" />Copied!</> : <><Share2 className="h-3 w-3" />Share this result</>}
        </Button>
      </CardContent>
    </Card>
  );
}
