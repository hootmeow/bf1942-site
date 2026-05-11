"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Navigation } from "lucide-react";
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
  server_id: number;
  server_name: string | null;
  total_unique_players_in_period: number;
  total_migrated: number;
  destinations: Destination[];
  lookback_days: number;
  window_hours: number;
}

function StateIndicator({ state }: { state: string }) {
  const colors: Record<string, string> = {
    ACTIVE: "bg-emerald-500",
    EMPTY: "bg-yellow-500",
    OFFLINE: "bg-red-500",
    UNKNOWN: "bg-muted-foreground",
  };
  return (
    <span
      className={cn("inline-block w-1.5 h-1.5 rounded-full shrink-0 mt-0.5", colors[state] ?? "bg-muted-foreground")}
      title={state}
    />
  );
}

export function ServerMigration({ serverId, slug }: { serverId: number; slug: string }) {
  const [data, setData] = useState<MigrationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!serverId) return;
    fetch(`/api/v1/servers/${serverId}/migration`)
      .then((r) => r.json())
      .then((d: MigrationData) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [serverId]);

  if (loading) {
    return (
      <Card className="border-border/60 bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Navigation className="h-4 w-4 text-primary" />
            Player Migration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 rounded bg-muted/30 animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data?.ok || !data.destinations.length) return null;

  const migrationRate =
    data.total_unique_players_in_period > 0
      ? Math.round((data.total_migrated / data.total_unique_players_in_period) * 100)
      : 0;

  return (
    <Card className="border-border/60 bg-card/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Navigation className="h-4 w-4 text-primary" />
            Where Players Go Next
          </CardTitle>
          <span className="text-xs text-muted-foreground">Last {data.lookback_days}d</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {migrationRate}% of players ({data.total_migrated}) joined another server within {data.window_hours}h of leaving here.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.destinations.map((dest, i) => (
            <div
              key={dest.server_id}
              className="group flex items-center gap-3 rounded-lg border border-border/40 bg-muted/10 px-3 py-2 hover:border-border/60 hover:bg-muted/20 transition-colors"
            >
              <span className="text-xs font-bold text-muted-foreground w-4 shrink-0">{i + 1}</span>
              <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
              <StateIndicator state={dest.current_state} />
              <div className="flex-1 min-w-0">
                <Link
                  href={`/servers/${dest.server_id}`}
                  className="text-xs font-medium hover:text-primary transition-colors truncate block"
                >
                  {dest.server_name ?? `Server #${dest.server_id}`}
                </Link>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {/* Percentage bar */}
                <div className="hidden sm:flex w-20 h-1.5 rounded-full bg-muted/40 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary/60 transition-all duration-500"
                    style={{ width: `${Math.min(100, dest.percentage)}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-foreground w-12 text-right">
                  {dest.player_count} <span className="text-muted-foreground font-normal">({dest.percentage}%)</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
