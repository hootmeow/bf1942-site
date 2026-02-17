"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Trophy, Hash, Loader2, Crosshair, ChevronLeft, ChevronRight } from "lucide-react";
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

const ITEMS_PER_PAGE = 5;

export function ServerRegularsList({ serverId }: ServerRegularsListProps) {
  const [regulars, setRegulars] = useState<ServerRegular[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalUnique, setTotalUnique] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.ceil(regulars.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentRegulars = regulars.slice(startIndex, endIndex);
  const maxRounds = Math.max(...regulars.map(r => r.rounds_played));

  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle as="h2" className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Server Regulars
          <span className="text-sm font-normal text-muted-foreground ml-auto">
            {regulars.length} of {totalUnique.toLocaleString()} players
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1">
          {currentRegulars.map((player, index) => {
            const globalIndex = startIndex + index;
            const fillPercent = (player.rounds_played / maxRounds) * 100;
            const isTopThree = globalIndex < 3;

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
                  globalIndex === 0
                    ? "bg-amber-500/20 text-amber-500 ring-1 ring-amber-500/30"
                    : globalIndex === 1
                    ? "bg-slate-400/20 text-slate-400 ring-1 ring-slate-400/30"
                    : globalIndex === 2
                    ? "bg-orange-600/20 text-orange-600 ring-1 ring-orange-600/30"
                    : "bg-muted/50 text-muted-foreground"
                )}>
                  {isTopThree && <Trophy className="w-3 h-3 mr-0.5" />}
                  {globalIndex + 1}
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
                <div className="flex items-center gap-2 text-xs shrink-0">
                  {/* Rounds */}
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Hash className="h-3 w-3" />
                    <span className="font-mono">{player.rounds_played}</span>
                  </div>

                  {/* K/D */}
                  <div className="hidden sm:flex items-center gap-1 text-muted-foreground">
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
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>

      {/* Pagination */}
      {totalPages > 1 && (
        <CardFooter className="flex items-center justify-between border-t border-border/40 pt-4">
          <span className="text-xs text-muted-foreground">
            Showing {startIndex + 1}–{Math.min(endIndex, regulars.length)} of {regulars.length}
          </span>
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
        </CardFooter>
      )}
    </Card>
  );
}
