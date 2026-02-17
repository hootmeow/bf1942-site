"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Timer, Play, Calendar, TrendingUp, Loader2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface SessionStats {
  total_sessions: number;
  avg_session_minutes: number;
  longest_session_minutes: number;
  total_playtime_minutes: number;
  is_currently_playing: boolean;
}

interface CurrentSession {
  start: string;
  duration_minutes: number;
  server: string;
}

interface SessionApiResponse {
  ok: boolean;
  player_name: string;
  stats: SessionStats;
  current_session: CurrentSession | null;
  recent_sessions: Array<{
    start: string;
    end: string;
    duration_minutes: number;
    server: string;
  }>;
}

interface PlayerSessionStatsProps {
  playerName: string;
}

function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function PlayerSessionStats({ playerName }: PlayerSessionStatsProps) {
  const [data, setData] = useState<SessionApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSessionStats() {
      try {
        const res = await fetch(`/api/v1/players/search/sessions?name=${encodeURIComponent(playerName)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.ok) {
            setData(json);
          } else {
            setError("No session data available");
          }
        } else {
          setError("Failed to load session stats");
        }
      } catch (e) {
        console.error("Failed to fetch session stats", e);
        setError("Failed to load session stats");
      } finally {
        setLoading(false);
      }
    }

    if (playerName) {
      fetchSessionStats();
    }
  }, [playerName]);

  if (loading) {
    return (
      <Card className="border-border/60 h-full">
        <CardHeader>
          <CardTitle as="h3" className="flex items-center gap-2 text-lg">
            <Timer className="h-5 w-5 text-primary" />
            Session Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4 text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading sessions...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data || !data.stats) {
    return (
      <Card className="border-border/60 h-full">
        <CardHeader>
          <CardTitle as="h3" className="flex items-center gap-2 text-lg">
            <Timer className="h-5 w-5 text-primary" />
            Session Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-muted-foreground text-sm">
            {error || "No session data available."}
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats = data.stats;
  const currentSession = data.current_session;
  const recentSessions = data.recent_sessions || [];

  // Get last session date from recent sessions
  const lastSessionDate = recentSessions.length > 0 ? recentSessions[0].end : null;

  return (
    <Card className="border-border/60">
      <CardContent className="p-0">
        {/* Active Session Banner */}
        {stats.is_currently_playing && currentSession && (
          <div className="relative overflow-hidden border-b border-green-500/30 bg-green-500/10 px-6 py-3">
            <div className="absolute inset-0 bg-green-500/5 animate-pulse" />
            <div className="relative flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20 shrink-0">
                <Play className="h-4 w-4 text-green-500 fill-green-500" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-green-500">Currently Playing</div>
                <div className="text-xs text-green-400/80 truncate">
                  {currentSession.server || "Unknown Server"}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-lg font-bold text-green-500 tabular-nums">
                  {formatDuration(currentSession.duration_minutes)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Horizontal Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border/40">
          <div className="px-6 py-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
              <Calendar className="h-3 w-3" />
              <span className="text-[10px] uppercase tracking-wider font-medium">Sessions</span>
            </div>
            <div className="text-2xl font-bold text-foreground tabular-nums">
              {stats.total_sessions.toLocaleString()}
            </div>
          </div>
          <div className="px-6 py-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
              <Clock className="h-3 w-3" />
              <span className="text-[10px] uppercase tracking-wider font-medium">Avg Length</span>
            </div>
            <div className="text-2xl font-bold text-foreground tabular-nums">
              {formatDuration(stats.avg_session_minutes)}
            </div>
          </div>
          <div className="px-6 py-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
              <TrendingUp className="h-3 w-3" />
              <span className="text-[10px] uppercase tracking-wider font-medium">Longest</span>
            </div>
            <div className="text-2xl font-bold text-foreground tabular-nums">
              {formatDuration(stats.longest_session_minutes)}
            </div>
          </div>
          <div className="px-6 py-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
              <Zap className="h-3 w-3" />
              <span className="text-[10px] uppercase tracking-wider font-medium">Playtime</span>
            </div>
            <div className="text-2xl font-bold text-foreground tabular-nums">
              {formatDuration(stats.total_playtime_minutes)}
            </div>
          </div>
        </div>

        {/* Last Session Footer */}
        {lastSessionDate && (
          <div className="px-6 py-2 border-t border-border/40 bg-muted/10">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Last Session</span>
              <span className="font-mono">
                {new Date(lastSessionDate).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
