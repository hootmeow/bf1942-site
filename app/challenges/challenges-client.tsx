"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, Clock, Trophy, Users, Server, Loader2, Star, Hash, Skull, AlertTriangle, Zap, Shuffle, UserCheck, Map, Shield, Scale, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString();
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

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const isCompleted = challenge.is_completed;
  const progress = Math.min(challenge.progress_percent || 0, 100);
  const StatIcon = STAT_ICONS[challenge.stat_type] || Target;
  const timeInfo = getTimeRemaining(challenge.end_time);

  return (
    <Card
      className={cn(
        "transition-all hover:shadow-lg",
        isCompleted
          ? "border-green-500/30 bg-green-500/5"
          : "border-border/60 hover:border-primary/30"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "p-3 rounded-xl",
                isCompleted ? "bg-green-500/20 text-green-500" : "bg-primary/10 text-primary"
              )}
            >
              <StatIcon className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-lg">{challenge.title}</CardTitle>
              {challenge.description && (
                <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>
              )}
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "shrink-0",
              challenge.scope === "community"
                ? "border-blue-500/30 text-blue-400 bg-blue-500/10"
                : "border-amber-500/30 text-amber-400 bg-amber-500/10"
            )}
          >
            {challenge.scope === "community" ? (
              <>
                <Users className="h-3 w-3 mr-1" /> Community
              </>
            ) : (
              <>
                <Server className="h-3 w-3 mr-1" /> {challenge.server_name || "Server"}
              </>
            )}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground tabular-nums">
              {formatNumber(challenge.current_value)} / {formatNumber(challenge.target_value)}{" "}
              <span className="capitalize">{challenge.stat_type}</span>
            </span>
            <span
              className={cn("font-mono font-bold text-lg", isCompleted ? "text-green-500" : "text-foreground")}
            >
              {progress.toFixed(1)}%
            </span>
          </div>
          <Progress
            value={progress}
            className={cn("h-3", isCompleted && "[&>div]:bg-green-500")}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-4 w-4" />
            {isCompleted ? (
              <span className="text-green-500 font-medium flex items-center gap-1">
                <Trophy className="h-4 w-4" /> Challenge Completed!
              </span>
            ) : (
              <span className={cn(timeInfo.urgent && "text-amber-500 font-medium")}>
                {timeInfo.text}
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground capitalize">
            {challenge.period_type} Challenge
          </span>
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Target className="h-8 w-8 text-primary" />
          Global Challenges
        </h1>
        <p className="text-muted-foreground mt-2">
          Work together with the community to complete these challenges. Progress updates after each round.
        </p>
      </div>

      {/* Active Challenges */}
      {activeChallenges.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
            </span>
            Active Challenges
            <span className="text-sm font-normal text-muted-foreground">({activeChallenges.length})</span>
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeChallenges.map((challenge) => (
              <ChallengeCard key={challenge.challenge_id} challenge={challenge} />
            ))}
          </div>
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Target className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold">No Active Challenges</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Check back soon for new community challenges!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Completed Challenges */}
      {completedChallenges.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-green-500" />
            Completed Challenges
            <span className="text-sm font-normal text-muted-foreground">({completedChallenges.length})</span>
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedChallenges.map((challenge) => (
              <ChallengeCard key={challenge.challenge_id} challenge={challenge} />
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
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {history.map((h) => {
              const HistIcon = STAT_ICONS[h.stat_type] || Target;
              const progress = Math.min(h.progress_percent || 0, 100);
              return (
                <Card key={h.history_id} className="border-border/40 bg-muted/20">
                  <CardContent className="pt-4 pb-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <HistIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{h.title}</span>
                      {h.is_completed && (
                        <Trophy className="h-3.5 w-3.5 text-green-500 ml-auto" />
                      )}
                    </div>
                    <Progress value={progress} className={cn("h-2", h.is_completed && "[&>div]:bg-green-500")} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatNumber(h.final_value)} / {formatNumber(h.target_value)}</span>
                      <span>
                        {new Date(h.start_time).toLocaleDateString()} — {new Date(h.end_time).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
