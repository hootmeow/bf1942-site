"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayerSearch } from "@/components/player-search";
import { AlertTriangle, Loader2, Skull, Trophy, Target, Star } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// --- API Types ---
interface HallOfFame {
  best_kdr_lifetime_min_100_kills: {
    player_id: number;
    last_known_name: string;
    kdr: number;
  };
  most_kills_lifetime: {
    player_id: number;
    last_known_name: string;
    total_kills: number;
  };
  best_single_round_kills: {
    round_id: number;
    map_name: string;
    last_known_name: string;
    final_kills: number;
  };
}

interface HallOfShame {
  most_deaths_single_round: {
    round_id: number;
    map_name: string;
    last_known_name: string;
    final_deaths: number;
  };
  most_deaths_lifetime: {
    player_id: number;
    last_known_name: string;
    total_deaths: number;
  };
  worst_kdr_lifetime_min_100_deaths: {
    player_id: number;
    last_known_name: string;
    total_kills: number;
    total_deaths: number;
    kdr: number;
  };
}

interface RecordsApiResponse {
  ok: boolean;
  hall_of_fame: HallOfFame;
  hall_of_shame: HallOfShame;
}

// --- Helper Component ---

/**
 * Reusable stat card for Hall of Fame/Shame
 * FIXED: 'description' prop now accepts React.ReactNode
 */
function RecordStatCard({
  title,
  value,
  description,
  icon,
  variant = "default",
}: {
  title: string;
  value: string | number;
  description: React.ReactNode; // Can be a string or <Link>
  icon: React.ElementType;
  variant?: "default" | "destructive";
}) {
  const Icon = icon;
  const colorClass = variant === "destructive" ? "destructive" : "primary";

  return (
    <div className="rounded-lg border border-border/60 bg-card/40 p-4">
      <div className="flex items-center gap-3">
        <div className={`rounded-full bg-${colorClass}/10 p-2 text-${colorClass}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <p className="text-xl font-bold text-foreground">{value}</p>
        </div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

// --- Main Page Component ---

export default function StatsPage() {
  const [records, setRecords] = useState<RecordsApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/v1/metrics/global/records`);
        if (!res.ok) throw new Error("Failed to fetch global records");
        const data: RecordsApiResponse = await res.json();
        if (data.ok) setRecords(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Player Statistics</h1>
      </div>

      {/* Player Search Bar - Centered and "Giant" */}
      <div className="mx-auto w-full max-w-2xl py-4">
        <PlayerSearch
          containerClassName="max-w-none" // Remove max-w-sm
          inputClassName="h-14 text-lg" // Make input giant
        />
      </div>

      {/* Loading / Error State */}
      {loading && (
        <div className="flex min-h-[200px] items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p>Loading global records...</p>
        </div>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Records Section */}
      {records && (
        <div className="space-y-6">
          {/* Hall of Fame */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Hall of Fame</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <RecordStatCard
                title="Most Kills (Single Round)"
                value={records.hall_of_fame.best_single_round_kills.final_kills}
                description={
                  <>
                    <Link href={`/player/${encodeURIComponent(records.hall_of_fame.best_single_round_kills.last_known_name)}`} className="font-medium text-primary hover:underline">
                      {records.hall_of_fame.best_single_round_kills.last_known_name}
                    </Link>
                    {` on ${records.hall_of_fame.best_single_round_kills.map_name}`}
                  </>
                }
                icon={Star}
              />
              <RecordStatCard
                title="Most Kills (Lifetime)"
                value={records.hall_of_fame.most_kills_lifetime.total_kills}
                description={
                  <Link href={`/player/${encodeURIComponent(records.hall_of_fame.most_kills_lifetime.last_known_name)}`} className="font-medium text-primary hover:underline">
                    {records.hall_of_fame.most_kills_lifetime.last_known_name}
                  </Link>
                }
                icon={Target}
              />
              <RecordStatCard
                title="Best KDR (Lifetime)"
                value={records.hall_of_fame.best_kdr_lifetime_min_100_kills.kdr.toFixed(2)}
                description={
                  <Link href={`/player/${encodeURIComponent(records.hall_of_fame.best_kdr_lifetime_min_100_kills.last_known_name)}`} className="font-medium text-primary hover:underline">
                    {records.hall_of_fame.best_kdr_lifetime_min_100_kills.last_known_name}
                  </Link>
                }
                icon={Trophy}
              />
            </CardContent>
          </Card>

          {/* Hall of Shame */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Hall of Shame</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <RecordStatCard
                title="Most Deaths (Single Round)"
                value={records.hall_of_shame.most_deaths_single_round.final_deaths}
                description={
                  <>
                    <Link href={`/player/${encodeURIComponent(records.hall_of_shame.most_deaths_single_round.last_known_name)}`} className="font-medium text-destructive hover:underline">
                      {records.hall_of_shame.most_deaths_single_round.last_known_name}
                    </Link>
                    {` on ${records.hall_of_shame.most_deaths_single_round.map_name}`}
                  </>
                }
                icon={Skull}
                variant="destructive"
              />
              <RecordStatCard
                title="Most Deaths (Lifetime)"
                value={records.hall_of_shame.most_deaths_lifetime.total_deaths}
                description={
                  <Link href={`/player/${encodeURIComponent(records.hall_of_shame.most_deaths_lifetime.last_known_name)}`} className="font-medium text-destructive hover:underline">
                    {records.hall_of_shame.most_deaths_lifetime.last_known_name}
                  </Link>
                }
                icon={Skull}
                variant="destructive"
              />
              <RecordStatCard
                title="Worst KDR (Lifetime)"
                value={records.hall_of_shame.worst_kdr_lifetime_min_100_deaths.kdr.toFixed(2)}
                description={
                  <Link href={`/player/${encodeURIComponent(records.hall_of_shame.worst_kdr_lifetime_min_100_deaths.last_known_name)}`} className="font-medium text-destructive hover:underline">
                    {records.hall_of_shame.worst_kdr_lifetime_min_100_deaths.last_known_name} ({records.hall_of_shame.worst_kdr_lifetime_min_100_deaths.total_kills} / {records.hall_of_shame.worst_kdr_lifetime_min_100_deaths.total_deaths})
                  </Link>
                }
                icon={Trophy}
                variant="destructive"
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}