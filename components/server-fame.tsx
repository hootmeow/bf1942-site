"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Skull, Loader2 } from "lucide-react";
import Link from "next/link";

interface FameRecord {
  player_id?: number;
  last_known_name?: string;
  kdr?: number;
  total_kills?: number;
  total_deaths?: number;
  final_kills?: number;
  final_deaths?: number;
  round_id?: number;
  map_name?: string;
}

interface ServerFameData {
  hall_of_fame: {
    best_kdr: FameRecord | null;
    most_kills: FameRecord | null;
    best_round_kills: FameRecord | null;
  };
  hall_of_shame: {
    most_deaths_round: FameRecord | null;
    most_deaths_lifetime: FameRecord | null;
    worst_kdr: FameRecord | null;
  };
}

function RecordRow({ label, record, stat }: { label: string; record: FameRecord | null; stat: string }) {
  if (!record || !record.last_known_name) return null;

  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/20">
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <Link
          href={`/player/${encodeURIComponent(record.last_known_name)}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          {record.last_known_name}
        </Link>
      </div>
      <div className="text-sm font-bold tabular-nums">{stat}</div>
    </div>
  );
}

export function ServerFame({ slug }: { slug: string }) {
  const [fame, setFame] = useState<ServerFameData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFame() {
      try {
        const res = await fetch(`/api/v1/servers/search/fame?search=${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.ok) setFame({ hall_of_fame: data.hall_of_fame, hall_of_shame: data.hall_of_shame });
        }
      } catch (e) {
        console.error("Failed to fetch server fame", e);
      } finally {
        setLoading(false);
      }
    }
    fetchFame();
  }, [slug]);

  if (loading) {
    return (
      <Card className="border-border/60">
        <CardContent className="flex items-center justify-center p-8 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading hall of fame...
        </CardContent>
      </Card>
    );
  }

  if (!fame) return null;

  const { hall_of_fame, hall_of_shame } = fame;
  const hasAnyFame = hall_of_fame.best_kdr || hall_of_fame.most_kills || hall_of_fame.best_round_kills;
  const hasAnyShame = hall_of_shame.most_deaths_round || hall_of_shame.most_deaths_lifetime || hall_of_shame.worst_kdr;

  if (!hasAnyFame && !hasAnyShame) return null;

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle as="h2" className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          Hall of Fame & Shame
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Hall of Fame */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-500">
            <Trophy className="h-4 w-4" />
            Hall of Fame
          </div>
          <div className="space-y-1.5">
            <RecordRow
              label="Best KDR"
              record={hall_of_fame.best_kdr}
              stat={hall_of_fame.best_kdr?.kdr?.toFixed(3) ?? "—"}
            />
            <RecordRow
              label="Most Kills"
              record={hall_of_fame.most_kills}
              stat={hall_of_fame.most_kills?.total_kills?.toLocaleString() ?? "—"}
            />
            <RecordRow
              label="Best Round Kills"
              record={hall_of_fame.best_round_kills}
              stat={`${hall_of_fame.best_round_kills?.final_kills ?? "—"} kills`}
            />
          </div>
        </div>

        {/* Hall of Shame */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-red-500">
            <Skull className="h-4 w-4" />
            Hall of Shame
          </div>
          <div className="space-y-1.5">
            <RecordRow
              label="Most Deaths (Round)"
              record={hall_of_shame.most_deaths_round}
              stat={`${hall_of_shame.most_deaths_round?.final_deaths ?? "—"} deaths`}
            />
            <RecordRow
              label="Most Deaths (Lifetime)"
              record={hall_of_shame.most_deaths_lifetime}
              stat={hall_of_shame.most_deaths_lifetime?.total_deaths?.toLocaleString() ?? "—"}
            />
            <RecordRow
              label="Worst KDR"
              record={hall_of_shame.worst_kdr}
              stat={hall_of_shame.worst_kdr?.kdr?.toFixed(3) ?? "—"}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
