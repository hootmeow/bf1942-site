"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { Crosshair, Swords, Trophy, Clock, Users, Flag } from "lucide-react";
import type { ScoreboardPlayer } from "@/components/scoreboard-table";

interface ServerInfo {
  current_map?: string | null;
  current_gametype?: string | null;
  current_player_count: number;
  current_max_players: number;
  tickets1?: number | null;
  tickets2?: number | null;
  round_time_remain?: number | null;
}

interface TickerItem {
  id: string;
  icon: React.ElementType;
  text: string;
  color?: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function buildItems(server: ServerInfo, scoreboard: ScoreboardPlayer[]): TickerItem[] {
  const items: TickerItem[] = [];

  if (scoreboard.length === 0 && server.current_player_count === 0) return items;

  const sorted = [...scoreboard].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  const byKills = [...scoreboard].sort((a, b) => (b.kills ?? 0) - (a.kills ?? 0));
  const team1 = scoreboard.filter((p) => p.team === 1);
  const team2 = scoreboard.filter((p) => p.team === 2);

  // Map + mode + player count
  items.push({
    id: "map",
    icon: Flag,
    text: [
      server.current_map?.toUpperCase() ?? "UNKNOWN MAP",
      server.current_gametype?.toUpperCase(),
      `${scoreboard.length || server.current_player_count}/${server.current_max_players} SOLDIERS`,
    ]
      .filter(Boolean)
      .join("  ·  "),
  });

  // Ticket battle
  const t1 = server.tickets1 ?? null;
  const t2 = server.tickets2 ?? null;
  if (t1 != null && t2 != null) {
    const leading = t1 > t2 ? "AXIS HOLDS THE LINE" : t2 > t1 ? "ALLIES PRESSING FORWARD" : "DEADLOCKED";
    const gap = Math.abs(t1 - t2);
    items.push({
      id: "tickets",
      icon: Swords,
      text: `AXIS ${t1}  VS  ALLIES ${t2} TICKETS  ·  ${leading}${gap > 0 ? `  (GAP: ${gap})` : ""}`,
      color: t1 > t2 ? "#ef4444" : "#3b82f6",
    });
  }

  // Top scorer
  const top = sorted[0];
  if (top) {
    const name = top.player_name ?? top.last_known_name ?? "Unknown";
    const side = top.team === 1 ? "AXIS" : "ALLIES";
    items.push({
      id: "top-scorer",
      icon: Trophy,
      text: `TOP SCORER: ${name.toUpperCase()}  ·  ${top.score ?? 0} PTS  ·  ${top.kills ?? 0}K / ${top.deaths ?? 0}D  ·  [${side}]`,
      color: "#f59e0b",
    });
  }

  // 2nd and 3rd place
  if (sorted.length >= 2) {
    const second = sorted[1];
    const third = sorted[2];
    const n2 = second.player_name ?? second.last_known_name ?? "Unknown";
    const n3 = third ? (third.player_name ?? third.last_known_name ?? "Unknown") : null;
    const podium = n3
      ? `2ND: ${n2.toUpperCase()} ${second.score ?? 0}PTS  ///  3RD: ${n3.toUpperCase()} ${third!.score ?? 0}PTS`
      : `2ND: ${n2.toUpperCase()} ${second.score ?? 0}PTS`;
    items.push({ id: "podium", icon: Trophy, text: podium });
  }

  // Most lethal (if different from top scorer)
  const mostLethal = byKills[0];
  if (mostLethal && (mostLethal.player_name ?? mostLethal.last_known_name) !== (top?.player_name ?? top?.last_known_name)) {
    const name = mostLethal.player_name ?? mostLethal.last_known_name ?? "Unknown";
    items.push({
      id: "lethal",
      icon: Crosshair,
      text: `MOST LETHAL: ${name.toUpperCase()}  ·  ${mostLethal.kills ?? 0} KILLS`,
      color: "#ef4444",
    });
  }

  // Team size breakdown
  if (team1.length > 0 && team2.length > 0) {
    const diff = Math.abs(team1.length - team2.length);
    const balance = diff === 0 ? "BALANCED" : `+${diff} ${team1.length > team2.length ? "AXIS" : "ALLIES"}`;
    items.push({
      id: "teams",
      icon: Users,
      text: `${team1.length} AXIS  VS  ${team2.length} ALLIED  ·  ${balance}`,
    });
  }

  // Time remaining
  if (server.round_time_remain != null && server.round_time_remain > 0) {
    items.push({
      id: "time",
      icon: Clock,
      text: `TIME REMAINING: ${formatTime(server.round_time_remain)}`,
    });
  }

  return items;
}

export function ServerRoundTicker({
  serverInfo,
  scoreboard,
}: {
  serverInfo: ServerInfo;
  scoreboard: ScoreboardPlayer[];
}) {
  const items = useMemo(
    () => buildItems(serverInfo, scoreboard),
    [serverInfo, scoreboard]
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(30);

  useEffect(() => {
    if (scrollRef.current && items.length > 0) {
      const oneWidth = scrollRef.current.scrollWidth / 3;
      setDuration(Math.max(oneWidth / 150, 10));
    }
  }, [items]);

  const tripled = useMemo(() => [...items, ...items, ...items], [items]);

  if (items.length === 0) return null;

  return (
    <div className="w-full bg-black/50 border border-border/30 rounded-lg overflow-hidden flex items-center relative h-9">
      {/* Label */}
      <div className="absolute left-0 top-0 bottom-0 z-20 flex items-center px-3 bg-card/95 border-r border-primary/20 text-primary font-bold text-[10px] uppercase tracking-widest shrink-0 shadow-sm">
        Live Round
      </div>

      {/* Scrolling content */}
      <div className="overflow-hidden flex-1 pl-[92px]">
        <div
          ref={scrollRef}
          className="flex whitespace-nowrap items-center"
          style={{ animation: `marquee ${duration}s linear infinite` }}
        >
          {tripled.map((item, i) => (
            <span
              key={`${item.id}-${i}`}
              className="inline-flex items-center gap-1.5 text-[11px] font-mono px-5"
            >
              <item.icon
                className="w-3 h-3 shrink-0"
                style={{ color: item.color ?? "hsl(var(--primary))", opacity: 0.8 }}
              />
              <span
                className="uppercase tracking-wide"
                style={{
                  color: item.color
                    ? item.color + "cc"
                    : "hsl(var(--muted-foreground) / 0.85)",
                }}
              >
                {item.text}
              </span>
              <span className="text-primary/20 ml-3">///</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
