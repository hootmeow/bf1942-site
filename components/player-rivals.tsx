"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Swords, TrendingUp, TrendingDown, Minus, ChevronLeft, ChevronRight } from "lucide-react";
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
  my_overall_kd: number;
  nemeses: RivalEntry[];
  allies: AllyEntry[];
}

const PAGE_SIZE = 5;

function KdDelta({ delta }: { delta: number }) {
  if (Math.abs(delta) < 0.05) return <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><Minus className="h-2.5 w-2.5" />avg</span>;
  if (delta > 0) return <span className="text-[10px] text-emerald-500 flex items-center gap-0.5"><TrendingUp className="h-2.5 w-2.5" />+{delta.toFixed(2)}</span>;
  return <span className="text-[10px] text-red-500 flex items-center gap-0.5"><TrendingDown className="h-2.5 w-2.5" />{delta.toFixed(2)}</span>;
}

function PageControls({ page, total, pageSize, onPage }: { page: number; total: number; pageSize: number; onPage: (p: number) => void }) {
  const pages = Math.ceil(total / pageSize);
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-between pt-1">
      <span className="text-[10px] text-muted-foreground">{page * pageSize + 1}–{Math.min((page + 1) * pageSize, total)} of {total}</span>
      <div className="flex gap-1">
        <button onClick={() => onPage(page - 1)} disabled={page === 0} className="h-5 w-5 rounded border border-border/50 flex items-center justify-center disabled:opacity-30 hover:bg-muted/40 transition-colors">
          <ChevronLeft className="h-3 w-3" />
        </button>
        <button onClick={() => onPage(page + 1)} disabled={page >= pages - 1} className="h-5 w-5 rounded border border-border/50 flex items-center justify-center disabled:opacity-30 hover:bg-muted/40 transition-colors">
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

export function PlayerRivals({ playerId }: { playerId: number }) {
  const [data, setData] = useState<RivalsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"nemeses" | "allies">("nemeses");
  const [nemesisPage, setNemesisPage] = useState(0);
  const [allyPage, setAllyPage] = useState(0);

  useEffect(() => {
    if (!playerId) return;
    fetch(`/api/v1/players/${playerId}/rivals`)
      .then((r) => r.json())
      .then((d: RivalsData) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [playerId]);

  if (loading) {
    return (
      <Card className="border-border/60 bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs flex items-center gap-2"><Swords className="h-3.5 w-3.5 text-primary" />Rivals &amp; Allies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">{[...Array(5)].map((_, i) => <div key={i} className="h-7 rounded bg-muted/30 animate-pulse" />)}</div>
        </CardContent>
      </Card>
    );
  }

  if (!data?.ok || (!data.nemeses.length && !data.allies.length)) return null;

  const nemesisSlice = data.nemeses.slice(nemesisPage * PAGE_SIZE, (nemesisPage + 1) * PAGE_SIZE);
  const allySlice = data.allies.slice(allyPage * PAGE_SIZE, (allyPage + 1) * PAGE_SIZE);

  return (
    <Card className="border-border/60 bg-card/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs flex items-center gap-2">
            <Swords className="h-3.5 w-3.5 text-primary" />
            Rivals &amp; Allies
          </CardTitle>
          <div className="flex rounded border border-border/50 overflow-hidden text-[10px]">
            {(["nemeses", "allies"] as const).map((t, i) => (
              <button key={t} onClick={() => setTab(t)} className={cn(
                "px-2.5 py-0.5 capitalize transition-colors",
                i > 0 && "border-l border-border/50",
                tab === t ? "bg-primary/15 text-primary font-medium" : "text-muted-foreground hover:bg-muted/40"
              )}>{t}</button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {tab === "nemeses" ? (
          <>
            {nemesisSlice.length === 0
              ? <p className="text-[10px] text-muted-foreground text-center py-3">Not enough shared rounds yet.</p>
              : <div className="space-y-1">
                  {nemesisSlice.map((n, i) => (
                    <div key={n.player_id} className="flex items-center gap-2 rounded px-2 py-1 hover:bg-muted/20 transition-colors">
                      <span className="text-[10px] text-muted-foreground w-3 shrink-0">{nemesisPage * PAGE_SIZE + i + 1}</span>
                      <PlayerFlag isoCode={n.iso_country_code} className="h-3" />
                      <Link href={`/player/${encodeURIComponent(n.name)}`} className="text-xs font-medium hover:text-primary truncate flex-1">{n.name}</Link>
                      <span className="text-[10px] text-muted-foreground shrink-0">{n.rounds_opposed}r</span>
                      <div className="text-right shrink-0 min-w-[40px]">
                        <p className="text-xs font-semibold leading-tight">{n.my_kd_vs_them.toFixed(2)}</p>
                        <KdDelta delta={n.kd_delta_vs_overall} />
                      </div>
                    </div>
                  ))}
                </div>
            }
            <PageControls page={nemesisPage} total={data.nemeses.length} pageSize={PAGE_SIZE} onPage={setNemesisPage} />
          </>
        ) : (
          <>
            {allySlice.length === 0
              ? <p className="text-[10px] text-muted-foreground text-center py-3">Not enough shared rounds yet.</p>
              : <div className="space-y-1">
                  {allySlice.map((a, i) => (
                    <div key={a.player_id} className="flex items-center gap-2 rounded px-2 py-1 hover:bg-muted/20 transition-colors">
                      <span className="text-[10px] text-muted-foreground w-3 shrink-0">{allyPage * PAGE_SIZE + i + 1}</span>
                      <PlayerFlag isoCode={a.iso_country_code} className="h-3" />
                      <Link href={`/player/${encodeURIComponent(a.name)}`} className="text-xs font-medium hover:text-primary truncate flex-1">{a.name}</Link>
                      <span className="text-[10px] text-muted-foreground shrink-0">{a.rounds_together}r</span>
                      <div className="text-right shrink-0 min-w-[40px]">
                        <p className="text-xs font-semibold leading-tight">{a.combined_avg_kd.toFixed(2)}</p>
                        <p className="text-[10px] text-muted-foreground">comb K/D</p>
                      </div>
                    </div>
                  ))}
                </div>
            }
            <PageControls page={allyPage} total={data.allies.length} pageSize={PAGE_SIZE} onPage={setAllyPage} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
