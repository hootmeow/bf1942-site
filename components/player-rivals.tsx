"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Swords, Users, TrendingUp, TrendingDown, Minus } from "lucide-react";
import Link from "next/link";
import { PlayerFlag } from "@/components/player-flag";
import { cn } from "@/lib/utils";

interface RivalEntry {
  player_id: number;
  name: string;
  iso_country_code?: string | null;
  rounds_opposed: number;
  their_avg_kills: number;
  their_avg_deaths: number;
  their_avg_score: number;
  my_kd_vs_them: number;
  kd_delta_vs_overall: number;
}

interface AllyEntry {
  player_id: number;
  name: string;
  iso_country_code?: string | null;
  rounds_together: number;
  their_avg_kills: number;
  their_avg_score: number;
  combined_avg_kd: number;
}

interface RivalsData {
  ok: boolean;
  player_id: number;
  my_overall_kd: number;
  nemeses: RivalEntry[];
  allies: AllyEntry[];
}

function KdDeltaBadge({ delta }: { delta: number }) {
  if (Math.abs(delta) < 0.05) {
    return (
      <span className="flex items-center gap-0.5 text-muted-foreground">
        <Minus className="h-3 w-3" />
        <span>avg</span>
      </span>
    );
  }
  if (delta > 0) {
    return (
      <span className="flex items-center gap-0.5 text-emerald-500">
        <TrendingUp className="h-3 w-3" />
        <span>+{delta.toFixed(2)}</span>
      </span>
    );
  }
  return (
    <span className="flex items-center gap-0.5 text-red-500">
      <TrendingDown className="h-3 w-3" />
      <span>{delta.toFixed(2)}</span>
    </span>
  );
}

export function PlayerRivals({ playerId }: { playerId: number }) {
  const [data, setData] = useState<RivalsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"nemeses" | "allies">("nemeses");

  useEffect(() => {
    if (!playerId) return;
    fetch(`/api/v1/players/${playerId}/rivals`)
      .then((r) => r.json())
      .then((d: RivalsData) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [playerId]);

  if (loading) {
    return (
      <Card className="border-border/60 bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Swords className="h-4 w-4 text-primary" />
            Rivals & Allies
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

  if (!data?.ok || (!data.nemeses.length && !data.allies.length)) return null;

  return (
    <Card className="border-border/60 bg-card/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Swords className="h-4 w-4 text-primary" />
            Rivals &amp; Allies
          </CardTitle>
          <div className="flex rounded-md border border-border/50 overflow-hidden text-xs">
            <button
              onClick={() => setTab("nemeses")}
              className={cn(
                "px-3 py-1 transition-colors",
                tab === "nemeses"
                  ? "bg-primary/15 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted/40"
              )}
            >
              Nemeses
            </button>
            <button
              onClick={() => setTab("allies")}
              className={cn(
                "px-3 py-1 transition-colors border-l border-border/50",
                tab === "allies"
                  ? "bg-primary/15 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted/40"
              )}
            >
              Allies
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {tab === "nemeses" ? (
          <div className="space-y-2">
            {data.nemeses.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">Not enough shared rounds yet.</p>
            ) : (
              <>
                <p className="text-xs text-muted-foreground mb-3">
                  Players you've faced most on the opposing team. Your K/D vs them compared to your overall ({data.my_overall_kd.toFixed(2)}).
                </p>
                {data.nemeses.map((n, i) => (
                  <div
                    key={n.player_id}
                    className="flex items-center gap-3 rounded-lg border border-border/40 bg-muted/10 px-3 py-2 hover:border-border/60 hover:bg-muted/20 transition-colors"
                  >
                    <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                    <PlayerFlag isoCode={n.iso_country_code} className="h-4" />
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/player/${encodeURIComponent(n.name)}`}
                        className="text-xs font-medium hover:text-primary transition-colors truncate block"
                      >
                        {n.name}
                      </Link>
                      <p className="text-[10px] text-muted-foreground">
                        {n.rounds_opposed} rounds faced · their avg {n.their_avg_kills.toFixed(1)}k/{n.their_avg_deaths.toFixed(1)}d
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-semibold">{n.my_kd_vs_them.toFixed(2)} K/D</p>
                      <KdDeltaBadge delta={n.kd_delta_vs_overall} />
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {data.allies.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">Not enough shared rounds yet.</p>
            ) : (
              <>
                <p className="text-xs text-muted-foreground mb-3">
                  Players you've fought alongside most. Combined K/D when on the same team.
                </p>
                {data.allies.map((a, i) => (
                  <div
                    key={a.player_id}
                    className="flex items-center gap-3 rounded-lg border border-border/40 bg-muted/10 px-3 py-2 hover:border-border/60 hover:bg-muted/20 transition-colors"
                  >
                    <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                    <PlayerFlag isoCode={a.iso_country_code} className="h-4" />
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/player/${encodeURIComponent(a.name)}`}
                        className="text-xs font-medium hover:text-primary transition-colors truncate block"
                      >
                        {a.name}
                      </Link>
                      <p className="text-[10px] text-muted-foreground">
                        {a.rounds_together} rounds together · their avg {a.their_avg_kills.toFixed(1)} kills
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-semibold">{a.combined_avg_kd.toFixed(2)}</p>
                      <p className="text-[10px] text-muted-foreground">combined K/D</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
