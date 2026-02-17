"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users, Star, Trophy, Loader2 } from "lucide-react";
import Link from "next/link";

interface ServerRecordsData {
  longest_round: { round_id: number; map_name: string; duration_seconds: number } | null;
  busiest_round: { round_id: number; map_name: string; player_count: number } | null;
  highest_score_round: { round_id: number; map_name: string; total_score: number } | null;
  server_mvp: { player_id: number; last_known_name: string; total_kills: number } | null;
}

export function ServerRecords({ slug }: { slug: string }) {
  const [records, setRecords] = useState<ServerRecordsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecords() {
      try {
        const res = await fetch(`/api/v1/servers/search/records?search=${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.ok) setRecords(data.records);
        }
      } catch (e) {
        console.error("Failed to fetch server records", e);
      } finally {
        setLoading(false);
      }
    }
    fetchRecords();
  }, [slug]);

  if (loading) {
    return (
      <Card className="border-border/60">
        <CardContent className="flex items-center justify-center p-8 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading records...
        </CardContent>
      </Card>
    );
  }

  if (!records) return null;

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle as="h2" className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          All-Time Records
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {/* Longest Round */}
        <div className="rounded-lg border border-border/60 bg-muted/30 p-4 space-y-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            Longest Round
          </div>
          {records.longest_round ? (
            <>
              <div className="text-xl font-bold tabular-nums">{formatDuration(records.longest_round.duration_seconds)}</div>
              <div className="text-xs text-muted-foreground">{records.longest_round.map_name}</div>
              <Link href={`/stats/rounds/${records.longest_round.round_id}`} className="text-xs text-primary hover:underline">
                View Round
              </Link>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">No data</div>
          )}
        </div>

        {/* Busiest Round */}
        <div className="rounded-lg border border-border/60 bg-muted/30 p-4 space-y-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            Busiest Round
          </div>
          {records.busiest_round ? (
            <>
              <div className="text-xl font-bold tabular-nums">{records.busiest_round.player_count} players</div>
              <div className="text-xs text-muted-foreground">{records.busiest_round.map_name}</div>
              <Link href={`/stats/rounds/${records.busiest_round.round_id}`} className="text-xs text-primary hover:underline">
                View Round
              </Link>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">No data</div>
          )}
        </div>

        {/* Highest Score */}
        <div className="rounded-lg border border-border/60 bg-muted/30 p-4 space-y-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Star className="h-3.5 w-3.5" />
            Highest Score
          </div>
          {records.highest_score_round ? (
            <>
              <div className="text-xl font-bold tabular-nums">{records.highest_score_round.total_score.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">{records.highest_score_round.map_name}</div>
              <Link href={`/stats/rounds/${records.highest_score_round.round_id}`} className="text-xs text-primary hover:underline">
                View Round
              </Link>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">No data</div>
          )}
        </div>

        {/* Server MVP */}
        <div className="rounded-lg border border-border/60 bg-muted/30 p-4 space-y-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Trophy className="h-3.5 w-3.5" />
            Server MVP
          </div>
          {records.server_mvp ? (
            <>
              <div className="text-xl font-bold tabular-nums">{records.server_mvp.total_kills.toLocaleString()} kills</div>
              <Link href={`/player/${encodeURIComponent(records.server_mvp.last_known_name)}`} className="text-xs text-primary hover:underline">
                {records.server_mvp.last_known_name}
              </Link>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">No data</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
