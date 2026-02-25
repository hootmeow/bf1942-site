"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Target, Clock, Trophy, Users, Server, Loader2, Star, Hash, Skull,
  AlertTriangle, Zap, Shuffle, UserCheck, Map, Shield, Scale, History,
  Flame, CalendarDays, Swords,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AnimatedCounter } from "@/components/animated-counter";

interface Challenge {
  challenge_id: number;
  title: string;
  description: string | null;
  stat_type: string;
  target_value: number;
  current_value: number;
  progress_percent: number;
  scope: "community" | "server";
  server_id: number | null;
  server_name: string | null;
  period_type: string;
  start_time: string;
  end_time: string;
  is_completed: boolean;
  completed_at: string | null;
  icon: string | null;
}

interface HistoryEntry {
  history_id: number;
  title: string;
  stat_type: string;
  target_value: number;
  final_value: number;
  progress_percent: number;
  period_type: string;
  start_time: string;
  end_time: string;
  is_completed: boolean;
  icon: string | null;
}

const STAT_ICONS: Record<string, React.ElementType> = {
  kills: Target,
  score: Star,
  rounds: Hash,
  deaths: Skull,
  player_count: Users,
  full_house_rounds: Users,
  ace_rounds: Zap,
  playtime: Clock,
  unique_server_players: Shuffle,
  active_players: UserCheck,
  unique_maps: Map,
  playtime_hours: Clock,
  community_kdr: Shield,
  close_rounds: Scale,
};

// Color themes per stat type for visual variety
const STAT_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  kills: { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/30", glow: "shadow-red-500/20" },
  score: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30", glow: "shadow-amber-500/20" },
  rounds: { bg: "bg-blue-500/15", text: "text-blue-400", border: "border-blue-500/30", glow: "shadow-blue-500/20" },
  deaths: { bg: "bg-purple-500/15", text: "text-purple-400", border: "border-purple-500/30", glow: "shadow-purple-500/20" },
  full_house_rounds: { bg: "bg-cyan-500/15", text: "text-cyan-400", border: "border-cyan-500/30", glow: "shadow-cyan-500/20" },
  ace_rounds: { bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/30", glow: "shadow-orange-500/20" },
  playtime: { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30", glow: "shadow-emerald-500/20" },
  unique_server_players: { bg: "bg-pink-500/15", text: "text-pink-400", border: "border-pink-500/30", glow: "shadow-pink-500/20" },
  active_players: { bg: "bg-teal-500/15", text: "text-teal-400", border: "border-teal-500/30", glow: "shadow-teal-500/20" },
  unique_maps: { bg: "bg-indigo-500/15", text: "text-indigo-400", border: "border-indigo-500/30", glow: "shadow-indigo-500/20" },
  playtime_hours: { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30", glow: "shadow-emerald-500/20" },
  community_kdr: { bg: "bg-sky-500/15", text: "text-sky-400", border: "border-sky-500/30", glow: "shadow-sky-500/20" },
  close_rounds: { bg: "bg-violet-500/15", text: "text-violet-400", border: "border-violet-500/30", glow: "shadow-violet-500/20" },
  player_count: { bg: "bg-cyan-500/15", text: "text-cyan-400", border: "border-cyan-500/30", glow: "shadow-cyan-500/20" },
};

const DEFAULT_COLOR = { bg: "bg-primary/15", text: "text-primary", border: "border-primary/30", glow: "shadow-primary/20" };

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString();
}

function formatStatLabel(stat_type: string): string {
  return stat_type.replace(/_/g, " ");
}

function getTimeRemaining(endTime: string): { text: string; urgent: boolean } {
  const end = new Date(endTime);
  const now = new Date();
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return { text: "Ended", urgent: false };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return { text: `${days}d ${hours}h remaining`, urgent: false };
  if (hours > 0) return { text: `${hours}h ${minutes}m remaining`, urgent: hours < 6 };
  return { text: `${minutes}m remaining`, urgent: true };
}

function ChallengeCard({ challenge, index }: { challenge: Challenge; index: number }) {
  const isCompleted = challenge.is_completed;
  const progress = Math.min(challenge.progress_percent || 0, 100);
  const StatIcon = STAT_ICONS[challenge.stat_type] || Target;
  const colors = STAT_COLORS[challenge.stat_type] || DEFAULT_COLOR;
  const timeInfo = getTimeRemaining(challenge.end_time);

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 card-interactive animate-fade-in-up",
        isCompleted
          ? "border-green-500/30 bg-green-500/5"
          : cn("border-border/60 hover:border-primary/30", colors.border.replace("border-", "hover:border-")),
        index === 0 && "stagger-1",
        index === 1 && "stagger-2",
        index === 2 && "stagger-3",
      )}
    >
      {/* Subtle gradient overlay at top */}
      <div className={cn(
        "absolute inset-x-0 top-0 h-1 rounded-t-lg",
        isCompleted ? "bg-green-500" : "bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      )} />

      <CardHeader className="pb-3 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "p-3 rounded-xl transition-all duration-300",
                isCompleted
                  ? "bg-green-500/20 text-green-500 shadow-lg shadow-green-500/10"
                  : cn(colors.bg, colors.text, "shadow-lg", colors.glow)
              )}
            >
              <StatIcon className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-lg leading-tight">{challenge.title}</CardTitle>
              {challenge.description && (
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{challenge.description}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <Badge
              variant="outline"
              className={cn(
                "text-[10px]",
                challenge.period_type === "weekly"
                  ? "border-blue-500/30 text-blue-400 bg-blue-500/10"
                  : "border-purple-500/30 text-purple-400 bg-purple-500/10"
              )}
            >
              {challenge.period_type === "weekly" ? (
                <><Flame className="h-3 w-3 mr-1" /> Weekly</>
              ) : (
                <><CalendarDays className="h-3 w-3 mr-1" /> Monthly</>
              )}
            </Badge>
            {challenge.scope === "server" && (
              <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-400 bg-amber-500/10">
                <Server className="h-3 w-3 mr-1" /> {challenge.server_name || "Server"}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress section */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-2xl font-mono font-bold tabular-nums">
                {formatNumber(challenge.current_value)}
              </span>
              <span className="text-sm text-muted-foreground ml-1">
                / {formatNumber(challenge.target_value)}
              </span>
            </div>
            <span
              className={cn(
                "font-mono font-bold text-xl tabular-nums",
                isCompleted ? "text-green-500" : progress >= 75 ? "text-amber-400" : "text-foreground"
              )}
            >
              {progress.toFixed(1)}%
            </span>
          </div>
          <div className="relative">
            <Progress
              value={progress}
              className={cn(
                "h-3 rounded-full",
                isCompleted && "[&>div]:bg-green-500",
                !isCompleted && `[&>div]:bg-gradient-to-r [&>div]:from-primary/80 [&>div]:to-primary`
              )}
            />
            {/* Progress glow effect for high-progress challenges */}
            {!isCompleted && progress >= 50 && (
              <div
                className="absolute top-0 h-3 rounded-full bg-primary/20 blur-sm pointer-events-none"
                style={{ width: `${progress}%` }}
              />
            )}
          </div>
          <p className="text-xs text-muted-foreground capitalize">{formatStatLabel(challenge.stat_type)}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm pt-1 border-t border-border/40">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {isCompleted ? (
              <span className="text-green-500 font-medium flex items-center gap-1">
                <Trophy className="h-3.5 w-3.5" /> Completed!
              </span>
            ) : (
              <span className={cn("text-xs", timeInfo.urgent && "text-amber-500 font-medium")}>
                {timeInfo.text}
              </span>
            )}
          </div>
          {challenge.scope === "community" && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              Community
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ChallengesClient() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [chalRes, histRes] = await Promise.all([
          fetch("/api/v1/challenges"),
          fetch("/api/v1/challenges/history?limit=10"),
        ]);
        if (chalRes.ok) {
          const data = await chalRes.json();
          if (data.ok) {
            setChallenges(data.challenges || []);
          } else {
            setError("Failed to load challenges");
          }
        } else {
          setError("Failed to load challenges");
        }
        if (histRes.ok) {
          const data = await histRes.json();
          if (data.ok) setHistory(data.history || []);
        }
      } catch (e) {
        console.error("Failed to fetch challenges", e);
        setError("Failed to load challenges");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const activeChallenges = challenges.filter((c) => !c.is_completed);
  const completedChallenges = challenges.filter((c) => c.is_completed);
  const weeklyChallenges = activeChallenges.filter((c) => c.period_type === "weekly");
  const monthlyChallenges = activeChallenges.filter((c) => c.period_type === "monthly");

  // Compute summary stats
  const totalProgress = activeChallenges.length > 0
    ? Math.round(activeChallenges.reduce((sum, c) => sum + Math.min(c.progress_percent || 0, 100), 0) / activeChallenges.length)
    : 0;
  const totalCompleted = completedChallenges.length + history.filter(h => h.is_completed).length;

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <p>Loading challenges...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl">
        {/* Background blur orbs */}
        <div className="pointer-events-none absolute -top-12 right-0 h-48 w-48 rounded-full bg-primary/10 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-12 left-0 h-40 w-40 rounded-full bg-blue-500/10 blur-[70px]" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 animate-fade-in-up">
            <div className="rounded-xl bg-primary/20 p-3">
              <Swords className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Global Challenges
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Work together to complete community objectives. Progress updates after each round.
              </p>
            </div>
          </div>

          {/* Summary Stats */}
          {activeChallenges.length > 0 && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up stagger-1">
              <div className="flex items-center gap-2 sm:gap-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-3 py-3 sm:px-4 card-hover">
                <div className="rounded-lg bg-blue-500/20 p-2 text-blue-400">
                  <Target className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-slate-500">Active</p>
                  <p className="font-mono text-lg sm:text-xl font-bold text-white">
                    <AnimatedCounter value={activeChallenges.length} duration={800} />
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-3 py-3 sm:px-4 card-hover">
                <div className="rounded-lg bg-green-500/20 p-2 text-green-400">
                  <Trophy className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-slate-500">Completed</p>
                  <p className="font-mono text-lg sm:text-xl font-bold text-white">
                    <AnimatedCounter value={totalCompleted} duration={800} />
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-3 py-3 sm:px-4 card-hover">
                <div className="rounded-lg bg-amber-500/20 p-2 text-amber-400">
                  <Flame className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-slate-500">Avg Progress</p>
                  <p className="font-mono text-lg sm:text-xl font-bold text-white">
                    <AnimatedCounter value={totalProgress} duration={1000} suffix="%" />
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-3 py-3 sm:px-4 card-hover">
                <div className="rounded-lg bg-purple-500/20 p-2 text-purple-400">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-slate-500">This Week</p>
                  <p className="font-mono text-lg sm:text-xl font-bold text-white">
                    <AnimatedCounter value={weeklyChallenges.length} duration={800} />
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Challenges */}
      {weeklyChallenges.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-500"></span>
            </span>
            <Flame className="h-5 w-5 text-blue-400" />
            Weekly Challenges
            <span className="text-sm font-normal text-muted-foreground">({weeklyChallenges.length})</span>
          </h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {weeklyChallenges.map((challenge, i) => (
              <ChallengeCard key={challenge.challenge_id} challenge={challenge} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Monthly Challenges */}
      {monthlyChallenges.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-purple-500"></span>
            </span>
            <CalendarDays className="h-5 w-5 text-purple-400" />
            Monthly Challenges
            <span className="text-sm font-normal text-muted-foreground">({monthlyChallenges.length})</span>
          </h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {monthlyChallenges.map((challenge, i) => (
              <ChallengeCard key={challenge.challenge_id} challenge={challenge} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state (only if no active at all) */}
      {activeChallenges.length === 0 && (
        <Card className="border-dashed border-border/60">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-2xl bg-muted/30 p-6 mb-4">
              <Target className="h-12 w-12 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold">No Active Challenges</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              New challenges rotate every Monday (weekly) and the 1st of each month (monthly). Check back soon!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Completed Challenges */}
      {completedChallenges.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-green-500" />
            Recently Completed
            <span className="text-sm font-normal text-muted-foreground">({completedChallenges.length})</span>
          </h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {completedChallenges.map((challenge, i) => (
              <ChallengeCard key={challenge.challenge_id} challenge={challenge} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Challenge History */}
      {history.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <History className="h-5 w-5 text-muted-foreground" />
            Past Challenges
          </h2>
          <Card className="border-border/60 bg-card/40">
            <CardContent className="p-0">
              <div className="divide-y divide-border/40">
                {history.map((h) => {
                  const HistIcon = STAT_ICONS[h.stat_type] || Target;
                  const colors = STAT_COLORS[h.stat_type] || DEFAULT_COLOR;
                  const progress = Math.min(h.progress_percent || 0, 100);
                  return (
                    <div key={h.history_id} className="flex items-center gap-4 px-4 py-3 sm:px-6">
                      <div className={cn("p-2 rounded-lg shrink-0", colors.bg, colors.text)}>
                        <HistIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate">{h.title}</span>
                          {h.is_completed && <Trophy className="h-3.5 w-3.5 text-green-500 shrink-0" />}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <Progress
                            value={progress}
                            className={cn("h-1.5 flex-1 max-w-[200px]", h.is_completed && "[&>div]:bg-green-500")}
                          />
                          <span className="text-xs text-muted-foreground tabular-nums font-mono">{progress.toFixed(0)}%</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0 hidden sm:block">
                        <p className="text-xs font-mono tabular-nums">
                          {formatNumber(h.final_value)} / {formatNumber(h.target_value)}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {new Date(h.start_time).toLocaleDateString()} — {new Date(h.end_time).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant={h.is_completed ? "default" : "secondary"}
                        className={cn(
                          "text-[10px] shrink-0 hidden sm:inline-flex",
                          h.is_completed && "bg-green-500/20 text-green-400 border-green-500/30"
                        )}
                      >
                        {h.is_completed ? "Completed" : "Expired"}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
