"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Destination {
  server_id: number;
  server_name: string | null;
  current_state: string;
  player_count: number;
  percentage: number;
}

interface MigrationData {
  ok: boolean;
  total_migrated: number;
  total_unique_players_in_period: number;
  destinations: Destination[];
  lookback_days: number;
  window_hours: number;
}

const STATE_DOT: Record<string, string> = {
  ACTIVE: "bg-emerald-500",
  EMPTY: "bg-yellow-500",
  OFFLINE: "bg-red-500",
};

export function ServerMigration({ serverId }: { serverId: number }) {
  const [data, setData] = useState<MigrationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!serverId) return;
    fetch(`/api/v1/servers/${serverId}/migration`)
      .then((r) => r.json())
      .then((d: MigrationData) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [serverId]);

  if (loading) {
    return (
      <Card className="border-border/60 bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs flex items-center gap-2"><Navigation className="h-3.5 w-3.5 text-primary" />Where Players Go Next</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">{[...Array(5)].map((_, i) => <div key={i} className="h-6 rounded bg-muted/30 animate-pulse" />)}</div>
        </CardContent>
      </Card>
    );
  }

  if (!data?.ok || !data.destinations.length) return null;

  const migrationRate = data.total_unique_players_in_period > 0
    ? Math.round(data.total_migrated / data.total_unique_players_in_period * 100)
    : 0;

  return (
    <Card className="border-border/60 bg-card/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs flex items-center gap-2">
            <Navigation className="h-3.5 w-3.5 text-primary" />
            Where Players Go Next
          </CardTitle>
          <span className="text-[10px] text-muted-foreground">{migrationRate}% move within {data.window_hours}h · {data.lookback_days}d window</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1">
          {data.destinations.map((dest, i) => (
            <div key={dest.server_id} className="flex items-center gap-2 rounded px-2 py-1 hover:bg-muted/20 transition-colors">
              <span className="text-[10px] text-muted-foreground w-3 shrink-0">{i + 1}</span>
              <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", STATE_DOT[dest.current_state] ?? "bg-muted-foreground")} title={dest.current_state} />
              <Link href={`/servers/${dest.server_id}`} className="text-xs font-medium hover:text-primary truncate flex-1">
                {dest.server_name ?? `Server #${dest.server_id}`}
              </Link>
              <div className="hidden sm:flex w-16 h-1 rounded-full bg-muted/40 overflow-hidden shrink-0">
                <div className="h-full rounded-full bg-primary/50" style={{ width: `${Math.min(100, dest.percentage)}%` }} />
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0 w-14 text-right">
                {dest.player_count} <span className="opacity-60">({dest.percentage}%)</span>
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
