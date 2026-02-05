"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, Clock, Trophy, Users, Server, Loader2, Star, Hash, Skull } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface ChallengesCardProps {
  serverId?: number;
  className?: string;
}

const STAT_ICONS: Record<string, React.ElementType> = {
  kills: Target,
  score: Star,
  rounds: Hash,
  deaths: Skull,
};

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString();
}

function getTimeRemaining(endTime: string): string {
  const end = new Date(endTime);
  const now = new Date();
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return "Ended";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h remaining`;
  if (hours > 0) return `${hours}h ${minutes}m remaining`;
  return `${minutes}m remaining`;
}

function ChallengeItem({ challenge }: { challenge: Challenge }) {
  const isCompleted = challenge.is_completed;
  const progress = Math.min(challenge.progress_percent || 0, 100);
  const StatIcon = STAT_ICONS[challenge.stat_type] || Target;

  return (
    <div
      className={cn(
        "p-4 rounded-lg border transition-all",
        isCompleted
          ? "border-green-500/30 bg-green-500/5"
          : "border-border/60 bg-card/40 hover:bg-card/60"
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "p-2 rounded-lg",
              isCompleted ? "bg-green-500/20 text-green-500" : "bg-primary/10 text-primary"
            )}
          >
            <StatIcon className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">{challenge.title}</h4>
            {challenge.description && (
              <p className="text-xs text-muted-foreground mt-0.5">{challenge.description}</p>
            )}
          </div>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] shrink-0",
            challenge.scope === "community"
              ? "border-blue-500/30 text-blue-400"
              : "border-amber-500/30 text-amber-400"
          )}
        >
          {challenge.scope === "community" ? (
            <>
              <Users className="h-3 w-3 mr-1" /> Community
            </>
          ) : (
            <>
              <Server className="h-3 w-3 mr-1" /> Server
            </>
          )}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground tabular-nums">
            {formatNumber(challenge.current_value)} / {formatNumber(challenge.target_value)}{" "}
            {challenge.stat_type}
          </span>
          <span
            className={cn("font-mono font-bold", isCompleted ? "text-green-500" : "text-foreground")}
          >
            {progress.toFixed(1)}%
          </span>
        </div>
        <Progress
          value={progress}
          className={cn("h-2", isCompleted && "[&>div]:bg-green-500")}
        />

        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          {isCompleted ? (
            <span className="text-green-500 font-medium flex items-center gap-1">
              <Trophy className="h-3 w-3" /> Completed!
            </span>
          ) : (
            <span>{getTimeRemaining(challenge.end_time)}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export function ChallengesCard({ serverId, className }: ChallengesCardProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChallenges() {
      try {
        const url = serverId
          ? `/api/v1/challenges/server/${serverId}`
          : "/api/v1/challenges?scope=community";
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.ok) {
            setChallenges(data.challenges || []);
          } else {
            setError("Failed to load challenges");
          }
        } else {
          setError("Failed to load challenges");
        }
      } catch (e) {
        console.error("Failed to fetch challenges", e);
        setError("Failed to load challenges");
      } finally {
        setLoading(false);
      }
    }
    fetchChallenges();
  }, [serverId]);

  if (loading) {
    return (
      <Card className={cn("border-border/60", className)}>
        <CardHeader>
          <CardTitle as="h2" className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-primary" />
            Active Challenges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading challenges...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || challenges.length === 0) {
    return null; // Don't show card if no challenges
  }

  return (
    <Card className={cn("border-border/60", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle as="h2" className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-primary" />
            Active Challenges
          </CardTitle>
          <span className="text-xs text-muted-foreground">
            {challenges.length} active
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {challenges.map((challenge) => (
          <ChallengeItem key={challenge.challenge_id} challenge={challenge} />
        ))}
      </CardContent>
    </Card>
  );
}
