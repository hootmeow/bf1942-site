"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Medal, Trophy, Target, Crosshair, Hash, Loader2, ChevronLeft, ChevronRight, Star, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlayerFlag } from "@/components/player-flag";

interface LeaderboardPlayer {
  player_id: number;
  last_known_name: string;
  iso_country_code: string | null;
  rounds_played: number;
  total_kills: number;
  total_deaths: number;
  total_score: number;
  kdr: number | null;
  rank: number;
  last_seen: string;
  avg_ping: number | null;
  min_ping: number | null;
  max_ping: number | null;
}

type StatType = "score" | "kills" | "kdr" | "rounds" | "ping";

interface ServerLeaderboardProps {
  serverId: number;
  slug?: string;
}

const STAT_CONFIG = {
  score: {
    label: "Score",
    icon: Star,
    getValue: (p: LeaderboardPlayer) => p.total_score.toLocaleString(),
    getSubValue: (p: LeaderboardPlayer) => `${p.rounds_played} rounds`,
  },
  kills: {
    label: "Kills",
    icon: Target,
    getValue: (p: LeaderboardPlayer) => p.total_kills.toLocaleString(),
    getSubValue: (p: LeaderboardPlayer) => `${p.total_deaths.toLocaleString()} deaths`,
  },
  kdr: {
    label: "K/D",
    icon: Crosshair,
    getValue: (p: LeaderboardPlayer) => p.kdr?.toFixed(2) || "—",
    getSubValue: (p: LeaderboardPlayer) => `${p.total_kills}K / ${p.total_deaths}D`,
  },
  rounds: {
    label: "Rounds",
    icon: Hash,
    getValue: (p: LeaderboardPlayer) => p.rounds_played.toString(),
    getSubValue: (p: LeaderboardPlayer) => `${p.total_score.toLocaleString()} pts`,
  },
  ping: {
    label: "Ping",
    icon: Wifi,
    getValue: (p: LeaderboardPlayer) => p.avg_ping != null ? `${Math.round(p.avg_ping)}ms` : "—",
    getSubValue: (p: LeaderboardPlayer) => p.min_ping != null && p.max_ping != null ? `${p.min_ping}–${p.max_ping}ms range` : "",
  },
};

const ITEMS_PER_PAGE = 5;

export function ServerLeaderboard({ serverId, slug }: ServerLeaderboardProps) {
  const [stat, setStat] = useState<StatType>("score");
  const [leaderboard, setLeaderboard] = useState<LeaderboardPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/v1/servers/search/leaderboard?search=${serverId}&stat=${stat}&limit=20`);
        if (res.ok) {
          const data = await res.json();
          if (data.ok && data.leaderboard) {
            setLeaderboard(data.leaderboard);
          } else {
            setError("Failed to load leaderboard");
          }
        } else {
          setError("Failed to load leaderboard");
        }
      } catch (e) {
        console.error("Failed to fetch server leaderboard", e);
        setError("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    }

    if (serverId) {
      fetchLeaderboard();
    }
  }, [serverId, stat]);

  // Reset page when stat changes
  useEffect(() => {
    setCurrentPage(1);
  }, [stat]);

  const config = STAT_CONFIG[stat];
  const StatIcon = config.icon;

  const totalPages = Math.ceil(leaderboard.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPlayers = leaderboard.slice(startIndex, endIndex);

  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle as="h2" className="flex items-center gap-2">
            <Medal className="h-5 w-5 text-amber-500" />
            Server Leaderboard
          </CardTitle>
          <Tabs value={stat} onValueChange={(v) => setStat(v as StatType)} className="w-auto">
            <TabsList className="h-8">
              <TabsTrigger value="score" className="text-xs h-7 px-3 gap-1">
                <Star className="h-3 w-3" /> Score
              </TabsTrigger>
              <TabsTrigger value="kills" className="text-xs h-7 px-3 gap-1">
                <Target className="h-3 w-3" /> Kills
              </TabsTrigger>
              <TabsTrigger value="kdr" className="text-xs h-7 px-3 gap-1">
                <Crosshair className="h-3 w-3" /> K/D
              </TabsTrigger>
              <TabsTrigger value="rounds" className="text-xs h-7 px-3 gap-1">
                <Hash className="h-3 w-3" /> Rounds
              </TabsTrigger>
              <TabsTrigger value="ping" className="text-xs h-7 px-3 gap-1">
                <Wifi className="h-3 w-3" /> Ping
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {loading ? (
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading leaderboard...
          </div>
        ) : error || leaderboard.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            {error || "No players found for this server."}
          </div>
        ) : (
          <div className="space-y-1">
            {currentPlayers.map((player) => {
              const isTopThree = player.rank <= 3;

              return (
                <div
                  key={player.player_id}
                  className={cn(
                    "relative flex items-center gap-3 p-2.5 rounded-lg transition-colors hover:bg-muted/40",
                    isTopThree && "bg-amber-500/5"
                  )}
                >
                  {/* Rank Badge */}
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold shrink-0",
                    player.rank === 1
                      ? "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/30"
                      : player.rank === 2
                      ? "bg-gradient-to-br from-slate-300 to-slate-500 text-white shadow-lg shadow-slate-400/30"
                      : player.rank === 3
                      ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-500/30"
                      : "bg-muted/50 text-muted-foreground"
                  )}>
                    {isTopThree ? (
                      <Trophy className="w-4 h-4" />
                    ) : (
                      player.rank
                    )}
                  </div>

                  {/* Player Info */}
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {player.iso_country_code && (
                      <PlayerFlag isoCode={player.iso_country_code} className="h-3.5 shrink-0" />
                    )}
                    <Link
                      href={`/player/${encodeURIComponent(player.last_known_name)}`}
                      className={cn(
                        "font-medium truncate hover:text-primary hover:underline underline-offset-2 transition-colors",
                        isTopThree ? "text-foreground" : "text-foreground/80"
                      )}
                    >
                      {player.last_known_name}
                    </Link>
                    {isTopThree && (
                      <span className="text-[10px] text-amber-500 font-semibold uppercase tracking-wider hidden sm:inline">
                        #{player.rank}
                      </span>
                    )}
                  </div>

                  {/* Stat Value */}
                  <div className="flex flex-col items-end shrink-0">
                    <div className={cn(
                      "flex items-center gap-1.5 font-bold tabular-nums",
                      stat === "ping" && player.avg_ping != null
                        ? player.avg_ping < 50 ? "text-green-500"
                          : player.avg_ping < 100 ? "text-yellow-500"
                          : player.avg_ping < 150 ? "text-orange-500"
                          : "text-red-500"
                        : isTopThree ? "text-amber-500" : "text-foreground"
                    )}>
                      <StatIcon className="h-3.5 w-3.5 opacity-60" />
                      {config.getValue(player)}
                    </div>
                    <div className="text-[10px] text-muted-foreground tabular-nums">
                      {config.getSubValue(player)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      {/* Pagination & View All Link */}
      {!loading && !error && leaderboard.length > 0 && (
        <CardFooter className="flex items-center justify-between border-t border-border/40 pt-4">
          {totalPages > 1 ? (
            <>
              <span className="text-xs text-muted-foreground">
                Showing {startIndex + 1}–{Math.min(endIndex, leaderboard.length)} of {leaderboard.length}
              </span>
              <div className="flex items-center gap-3">
                {slug && (
                  <Link
                    href={`/servers/${slug}/rankings`}
                    className="text-xs text-primary hover:underline underline-offset-2"
                  >
                    View All Rankings →
                  </Link>
                )}
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="h-7 w-7 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center px-2 text-xs text-muted-foreground">
                    {currentPage} / {totalPages}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="h-7 w-7 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : slug ? (
            <Link
              href={`/servers/${slug}/rankings`}
              className="w-full text-center text-xs text-primary hover:underline underline-offset-2"
            >
              View All Rankings →
            </Link>
          ) : null}
        </CardFooter>
      )}
    </Card>
  );
}
