"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ScoreboardPlayer } from "@/components/scoreboard-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Trophy, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
  ReferenceLine,
} from "recharts";

// Color palette — enough for many players
const COLORS = [
  "#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7",
  "#ec4899", "#06b6d4", "#f97316", "#6366f1", "#14b8a6",
  "#e11d48", "#0ea5e9", "#84cc16", "#d946ef", "#fb923c",
  "#8b5cf6", "#10b981", "#f43f5e", "#0284c7", "#facc15",
];

interface BattleReplayProps {
  playerScores: Record<string, Array<{ timestamp: string; score: number; kills: number; deaths: number }>>;
  playerTeams: Record<string, number>;
  playerStats: ScoreboardPlayer[];
  roundStartTime: string;
  roundEndTime: string;
}

function getKDRatio(kills: number, deaths: number): { ratio: string; color: string } {
  if (deaths === 0) {
    return { ratio: kills > 0 ? `${kills}.00` : "0.00", color: kills > 0 ? "text-green-500" : "text-muted-foreground" };
  }
  const kd = kills / deaths;
  let color = "text-muted-foreground";
  if (kd >= 2) color = "text-green-500";
  else if (kd >= 1) color = "text-emerald-400";
  else if (kd >= 0.5) color = "text-yellow-500";
  else color = "text-red-400";
  return { ratio: kd.toFixed(2), color };
}

export function BattleReplay({
  playerScores,
  playerTeams,
  playerStats,
  roundStartTime,
  roundEndTime,
}: BattleReplayProps) {
  // Build sorted unique timestamps
  const allTimestamps = useMemo(() => {
    const tsSet = new Set<string>();
    for (const snapshots of Object.values(playerScores)) {
      for (const s of snapshots) {
        tsSet.add(s.timestamp);
      }
    }
    return [...tsSet].sort();
  }, [playerScores]);

  // All player names sorted by final score descending
  const allPlayerNames = useMemo(() => {
    return Object.keys(playerScores).sort((a, b) => {
      const aSnaps = playerScores[a];
      const bSnaps = playerScores[b];
      const aFinal = aSnaps.length > 0 ? aSnaps[aSnaps.length - 1].score : 0;
      const bFinal = bSnaps.length > 0 ? bSnaps[bSnaps.length - 1].score : 0;
      return bFinal - aFinal;
    });
  }, [playerScores]);

  // Default: top 5 selected
  const [selectedPlayers, setSelectedPlayers] = useState<Set<string>>(() => {
    return new Set(allPlayerNames.slice(0, 5));
  });

  const [scrubberIndex, setScrubberIndex] = useState(allTimestamps.length - 1);
  const [isPlaying, setIsPlaying] = useState(false);
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentTimestamp = allTimestamps[scrubberIndex] || allTimestamps[allTimestamps.length - 1];
  const isAtEnd = scrubberIndex >= allTimestamps.length - 1;

  // Auto-play
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setScrubberIndex((prev) => {
          if (prev >= allTimestamps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 200);
    }
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isPlaying, allTimestamps.length]);

  // Assign a stable color index to each player (by their sort rank)
  const playerColorIndex = useMemo(() => {
    const map: Record<string, number> = {};
    allPlayerNames.forEach((name, i) => {
      map[name] = i;
    });
    return map;
  }, [allPlayerNames]);

  // Currently visible player names (for chart)
  const visibleNames = useMemo(() => {
    return allPlayerNames.filter((n) => selectedPlayers.has(n));
  }, [allPlayerNames, selectedPlayers]);

  // ---- CHART DATA: exact same pattern as the working RoundPlayerTimelineChart ----
  // Uses player names directly as keys, carry-forward scores, numeric time index
  const chartData = useMemo(() => {
    const names = visibleNames;
    if (names.length === 0 || allTimestamps.length === 0) return [];

    return allTimestamps.map((ts, index) => {
      const point: Record<string, any> = {  // eslint-disable-line @typescript-eslint/no-explicit-any
        time: index,
        label: (() => {
          try { return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }
          catch { return String(index); }
        })(),
      };
      names.forEach((name) => {
        const playerData = playerScores[name];
        // Find closest score at or before this timestamp (carry-forward)
        const match = [...playerData].reverse().find((d) => d.timestamp <= ts);
        point[name] = match ? match.score : 0;
      });
      return point;
    });
  }, [allTimestamps, visibleNames, playerScores]);

  // Stats at scrubber time
  const statsAtTime = useMemo(() => {
    if (isAtEnd) return null;
    const result: Record<string, { score: number; kills: number; deaths: number }> = {};
    const targetTs = currentTimestamp;
    for (const name of Object.keys(playerScores)) {
      const snapshots = playerScores[name];
      let best = { score: 0, kills: 0, deaths: 0 };
      for (const s of snapshots) {
        if (s.timestamp <= targetTs) best = s;
        else break;
      }
      result[name] = best;
    }
    return result;
  }, [currentTimestamp, isAtEnd, playerScores]);

  const togglePlayer = useCallback((name: string) => {
    setSelectedPlayers((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  // Team split for scoreboards
  const teamPlayers = useMemo(() => {
    const axis: ScoreboardPlayer[] = [];
    const allies: ScoreboardPlayer[] = [];
    for (const p of playerStats) {
      if (p.team === 1) axis.push(p);
      else if (p.team === 2) allies.push(p);
    }
    axis.sort((a, b) => (b.final_score ?? b.score ?? 0) - (a.final_score ?? a.score ?? 0));
    allies.sort((a, b) => (b.final_score ?? b.score ?? 0) - (a.final_score ?? a.score ?? 0));
    return { axis, allies };
  }, [playerStats]);

  const winner = useMemo(() => {
    const axisTotal = teamPlayers.axis.reduce((s, p) => s + (p.final_score ?? p.score ?? 0), 0);
    const alliesTotal = teamPlayers.allies.reduce((s, p) => s + (p.final_score ?? p.score ?? 0), 0);
    return axisTotal > alliesTotal ? 1 : alliesTotal > axisTotal ? 2 : 0;
  }, [teamPlayers]);

  const formatTimestamp = (ts: string) => {
    try { return new Date(ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }); }
    catch { return ts; }
  };

  return (
    <div className="space-y-4">
      {/* Score Progression Chart */}
      <Card className="border-border/60">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <CardTitle as="h3" className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Battle Replay
            </CardTitle>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{selectedPlayers.size} player{selectedPlayers.size !== 1 ? "s" : ""} shown</span>
              <button
                className="text-primary hover:underline"
                onClick={() => setSelectedPlayers(new Set(allPlayerNames.slice(0, 5)))}
              >
                Top 5
              </button>
              <button
                className="text-primary hover:underline"
                onClick={() => setSelectedPlayers(new Set(allPlayerNames))}
              >
                All
              </button>
              <button
                className="text-primary hover:underline"
                onClick={() => setSelectedPlayers(new Set())}
              >
                None
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* ---- Chart: copied structure from working RoundPlayerTimelineChart ---- */}
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis
                dataKey="time"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: "hsl(var(--border))" }}
                interval="preserveStartEnd"
                tickFormatter={(value) => {
                  const point = chartData[value];
                  return point?.label || "";
                }}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <ReTooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelFormatter={(value) => {
                  const point = chartData[value as number];
                  return point?.label || "";
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              {visibleNames.map((name) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stroke={COLORS[playerColorIndex[name] % COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
              {!isAtEnd && (
                <ReferenceLine
                  x={scrubberIndex}
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              )}
            </LineChart>
          </ResponsiveContainer>

          {/* Time Scrubber */}
          <div className="mt-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  if (isPlaying) {
                    setIsPlaying(false);
                  } else {
                    if (scrubberIndex >= allTimestamps.length - 1) setScrubberIndex(0);
                    setIsPlaying(true);
                  }
                }}
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              </Button>
              <input
                type="range"
                min={0}
                max={allTimestamps.length - 1}
                value={scrubberIndex}
                onChange={(e) => {
                  setScrubberIndex(Number(e.target.value));
                  setIsPlaying(false);
                }}
                className="flex-1 h-2 rounded-full appearance-none cursor-pointer bg-muted/50
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
              />
              <span className="text-xs text-muted-foreground font-mono min-w-[70px] text-right">
                {formatTimestamp(currentTimestamp)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Scoreboards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TeamScoreboard
          title="Axis"
          team={1}
          players={teamPlayers.axis}
          isWinner={winner === 1}
          selectedPlayers={selectedPlayers}
          onTogglePlayer={togglePlayer}
          playerColorIndex={playerColorIndex}
          statsAtTime={statsAtTime}
        />
        <TeamScoreboard
          title="Allies"
          team={2}
          players={teamPlayers.allies}
          isWinner={winner === 2}
          selectedPlayers={selectedPlayers}
          onTogglePlayer={togglePlayer}
          playerColorIndex={playerColorIndex}
          statsAtTime={statsAtTime}
        />
      </div>
    </div>
  );
}

function TeamScoreboard({
  title,
  team,
  players,
  isWinner,
  selectedPlayers,
  onTogglePlayer,
  playerColorIndex,
  statsAtTime,
}: {
  title: string;
  team: 1 | 2;
  players: ScoreboardPlayer[];
  isWinner: boolean;
  selectedPlayers: Set<string>;
  onTogglePlayer: (name: string) => void;
  playerColorIndex: Record<string, number>;
  statsAtTime: Record<string, { score: number; kills: number; deaths: number }> | null;
}) {
  const isAxis = team === 1;

  const sortedPlayers = useMemo(() => {
    if (!statsAtTime) return players;
    return [...players].sort((a, b) => {
      const aName = a.last_known_name || a.player_name || "";
      const bName = b.last_known_name || b.player_name || "";
      return (statsAtTime[bName]?.score ?? 0) - (statsAtTime[aName]?.score ?? 0);
    });
  }, [players, statsAtTime]);

  const totals = useMemo(() => {
    return sortedPlayers.reduce(
      (acc, player) => {
        const name = player.last_known_name || player.player_name || "";
        if (statsAtTime?.[name]) {
          acc.score += statsAtTime[name].score;
          acc.kills += statsAtTime[name].kills;
          acc.deaths += statsAtTime[name].deaths;
        } else {
          acc.score += player.final_score ?? player.score ?? 0;
          acc.kills += player.final_kills ?? player.kills ?? 0;
          acc.deaths += player.final_deaths ?? player.deaths ?? 0;
        }
        return acc;
      },
      { score: 0, kills: 0, deaths: 0 }
    );
  }, [sortedPlayers, statsAtTime]);

  const teamKD = getKDRatio(totals.kills, totals.deaths);
  if (players.length === 0) return null;

  return (
    <Card className={cn(
      "border-border/60",
      isWinner && (isAxis
        ? "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]"
        : "border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]")
    )}>
      <CardHeader className={cn(
        "border-b",
        isAxis ? "bg-red-950/20 border-red-900/20" : "bg-blue-950/20 border-blue-900/20",
        isWinner && (isAxis ? "bg-red-900/30" : "bg-blue-900/30")
      )}>
        <div className="flex items-center justify-between">
          <CardTitle as="h2" className={cn("flex items-center gap-2", isAxis ? "text-red-500" : "text-blue-500")}>
            {title}
            {isWinner && <Trophy className="h-4 w-4" />}
          </CardTitle>
          {statsAtTime && <span className="text-xs text-muted-foreground font-mono">At scrubber time</span>}
        </div>
      </CardHeader>
      <CardContent className="pt-4 px-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10 pl-4">#</TableHead>
              <TableHead>Player</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead className="text-right">K</TableHead>
              <TableHead className="text-right">D</TableHead>
              <TableHead className="text-right">K/D</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPlayers.map((player, index) => {
              const name = player.last_known_name || player.player_name || "Unknown";
              const isSelected = selectedPlayers.has(name);
              const colorIdx = playerColorIndex[name] ?? index;

              let score: number, kills: number, deaths: number;
              if (statsAtTime?.[name]) {
                score = statsAtTime[name].score;
                kills = statsAtTime[name].kills;
                deaths = statsAtTime[name].deaths;
              } else {
                score = player.final_score ?? player.score ?? 0;
                kills = player.final_kills ?? player.kills ?? 0;
                deaths = player.final_deaths ?? player.deaths ?? 0;
              }
              const kd = getKDRatio(kills, deaths);

              return (
                <TableRow
                  key={`${name}-${index}`}
                  className={cn(
                    "cursor-pointer transition-colors",
                    isSelected ? "bg-primary/10 hover:bg-primary/15" : "hover:bg-muted/30 opacity-60"
                  )}
                  onClick={() => onTogglePlayer(name)}
                >
                  <TableCell className="py-2 pl-4">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0 transition-opacity", isSelected ? "opacity-100" : "opacity-30")}
                        style={{ backgroundColor: COLORS[colorIdx % COLORS.length] }}
                      />
                      <span className="text-xs text-muted-foreground font-mono">{index + 1}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-foreground py-2">
                    {name !== "Unknown" ? (
                      <Link
                        href={`/player/${encodeURIComponent(name)}`}
                        className="hover:text-primary hover:underline underline-offset-2 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {name}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">{name}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-semibold py-2">{score}</TableCell>
                  <TableCell className="text-right text-green-400 py-2">{kills}</TableCell>
                  <TableCell className="text-right text-red-400 py-2">{deaths}</TableCell>
                  <TableCell className={cn("text-right font-mono text-sm py-2", kd.color)}>{kd.ratio}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableCell className="pl-4"></TableCell>
              <TableCell className="font-semibold text-foreground">Team Total</TableCell>
              <TableCell className="text-right font-bold text-foreground">{totals.score}</TableCell>
              <TableCell className="text-right font-semibold text-green-400">{totals.kills}</TableCell>
              <TableCell className="text-right font-semibold text-red-400">{totals.deaths}</TableCell>
              <TableCell className={cn("text-right font-mono font-semibold", teamKD.color)}>{teamKD.ratio}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}
