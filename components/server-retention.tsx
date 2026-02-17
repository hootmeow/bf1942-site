"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UserCheck, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface RetentionData {
  ok: boolean;
  total_unique_players: number;
  players_last_30d: number;
  returning_players_30d: number;
  return_rate_pct: number;
}

export function ServerRetention({ serverId }: { serverId: number }) {
  const [data, setData] = useState<RetentionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRetention() {
      try {
        const res = await fetch(`/api/v1/servers/search/retention?search=${serverId}`);
        if (res.ok) {
          const result = await res.json();
          if (result.ok) setData(result);
        }
      } catch (e) {
        console.error("Failed to load retention", e);
      } finally {
        setLoading(false);
      }
    }
    fetchRetention();
  }, [serverId]);

  if (loading) {
    return (
      <Card className="border-border/60">
        <CardHeader><CardTitle as="h2" className="flex items-center gap-2"><UserCheck className="h-5 w-5 text-primary" />Player Retention</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="border-border/60">
        <CardHeader><CardTitle as="h2" className="flex items-center gap-2"><UserCheck className="h-5 w-5 text-primary" />Player Retention</CardTitle></CardHeader>
        <CardContent>
          <div className="p-4 text-center text-muted-foreground">No retention data available.</div>
        </CardContent>
      </Card>
    );
  }

  const rate = data.return_rate_pct;
  const rateColor = rate >= 70 ? "text-green-500" : rate >= 40 ? "text-yellow-500" : "text-red-500";
  const rateBg = rate >= 70 ? "bg-green-500/10" : rate >= 40 ? "bg-yellow-500/10" : "bg-red-500/10";

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle as="h2" className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-primary" />
          Player Retention
          <span className="ml-auto" title="Percentage of players in the last 30 days who had previously played on this server">
            <Info className="h-4 w-4 text-muted-foreground" />
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-4 mb-4">
          <div className={cn("rounded-xl px-4 py-3 text-center", rateBg)}>
            <div className={cn("text-3xl font-bold tabular-nums", rateColor)}>
              {rate}%
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">Return Rate</div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Unique Players</span>
              <span className="font-mono font-medium">{data.total_unique_players.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Active (30d)</span>
              <span className="font-mono font-medium">{data.players_last_30d.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Returning (30d)</span>
              <span className="font-mono font-medium">{data.returning_players_30d.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
