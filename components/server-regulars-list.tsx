"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Trophy, Hash, Loader2, Crosshair } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlayerFlag } from "@/components/player-flag";

interface ServerRegular {
  player_id: number;
  last_known_name: string;
  iso_country_code: string | null;
  rounds_played: number;
  total_kills: number;
  total_deaths: number;
  total_score: number;
  kdr: number | null;
  last_seen: string;
}

interface ServerRegularsListProps {
  serverId: number;
}

export function ServerRegularsList({ serverId }: ServerRegularsListProps) {
  const [regulars, setRegulars] = useState<ServerRegular[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalUnique, setTotalUnique] = useState<number>(0);

  useEffect(() => {
    async function fetchRegulars() {
      try {
        const res = await fetch(`/api/v1/servers/search/regulars?search=${serverId}&limit=20`);
        if (res.ok) {
          const data = await res.json();
          if (data.ok && data.regulars) {
            setRegulars(data.regulars);
            setTotalUnique(data.total_unique_players || 0);
          }
        } else {
          setError("Failed to load regulars");
        }
      } catch (e) {
        console.error("Failed to fetch server regulars", e);
        setError("Failed to load regulars");
      } finally {
        setLoading(false);
      }
    }

    if (serverId) {
      fetchRegulars();
    }
  }, [serverId]);

  if (loading) {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle as="h2" className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Server Regulars
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading regulars...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || regulars.length === 0) {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle as="h2" className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Server Regulars
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-muted-foreground">
            {error || "No regular players found for this server."}
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxRounds = Math.max(...regulars.map(r => r.rounds_played));

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle as="h2" className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Server Regulars
          <span className="text-sm font-normal text-muted-foreground ml-auto">
            Top {regulars.length} of {totalUnique.toLocaleString()} players
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1">
          {regulars.map((player, index) => {
            const fillPercent = (player.rounds_played / maxRounds) * 100;
            const isTopThree = index < 3;

            return (
              <div
                key={player.player_id}
                className={cn(
                  "relative flex items-center gap-3 p-2.5 rounded-lg transition-colors hover:bg-muted/40",
                  isTopThree && "bg-primary/5"
                )}
              >
                {/* Rank Badge */}
                <div className={cn(
                  "flex items-center justify-center w-7 h-7 rounded-md text-xs font-bold shrink-0",
                  index === 0
                    ? "bg-amber-500/20 text-amber-500 ring-1 ring-amber-500/30"
                    : index === 1
                    ? "bg-slate-400/20 text-slate-400 ring-1 ring-slate-400/30"
                    : index === 2
                    ? "bg-orange-600/20 text-orange-600 ring-1 ring-orange-600/30"
                    : "bg-muted/50 text-muted-foreground"
                )}>
                  {isTopThree && <Trophy className="w-3 h-3 mr-0.5" />}
                  {index + 1}
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
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs shrink-0">
                  {/* Rounds */}
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Hash className="h-3 w-3" />
                    <span className="font-mono">{player.rounds_played}</span>
                    <span className="hidden sm:inline">rounds</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-16 hidden md:block">
                    <div className="h-1.5 w-full rounded-full bg-muted/50 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          isTopThree
                            ? "bg-gradient-to-r from-primary to-primary/60"
                            : "bg-primary/40"
                        )}
                        style={{ width: `${fillPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* K/D */}
                  <div className="flex items-center gap-1 text-muted-foreground w-14 justify-end">
                    <Crosshair className="h-3 w-3" />
                    <span className={cn(
                      "font-mono",
                      player.kdr && player.kdr >= 2 ? "text-green-500" :
                      player.kdr && player.kdr >= 1 ? "text-foreground" :
                      "text-red-400"
                    )}>
                      {player.kdr?.toFixed(2) || "—"}
                    </span>
                  </div>

                  {/* Score */}
                  <div className="text-muted-foreground font-mono w-16 text-right hidden lg:block">
                    {player.total_score.toLocaleString()}
                    <span className="text-[10px] ml-0.5">pts</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
