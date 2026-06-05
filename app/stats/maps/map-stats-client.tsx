"use client"

import Link from "next/link"
import { Map, TrendingUp, TrendingDown, Minus, Clock, Swords, Shield, AlertTriangle } from "lucide-react"
import type { MapStatsData } from "./page"

function TrendIcon({ pct }: { pct: number }) {
  if (pct > 5) return <TrendingUp className="h-3 w-3 text-emerald-400" />
  if (pct < -5) return <TrendingDown className="h-3 w-3 text-red-400" />
  return <Minus className="h-3 w-3 text-muted-foreground/40" />
}

function FactionBar({ alliedPct, axisWins, alliedWins }: { alliedPct: number; axisWins: number; alliedWins: number }) {
  const axisPct = 100 - alliedPct
  return (
    <div className="flex items-center gap-2 w-full">
      <span className="font-mono text-[9px] text-blue-400 w-7 text-right tabular-nums">{alliedPct.toFixed(0)}%</span>
      <div className="flex-1 h-2 rounded-full overflow-hidden flex bg-[#0a0f06]">
        <div
          className="h-full rounded-l-full transition-all duration-500 bg-blue-500/70"
          style={{ width: `${alliedPct}%` }}
        />
        <div
          className="h-full rounded-r-full transition-all duration-500 bg-red-500/60"
          style={{ width: `${axisPct}%` }}
        />
      </div>
      <span className="font-mono text-[9px] text-red-400 w-7 tabular-nums">{axisPct.toFixed(0)}%</span>
    </div>
  )
}

export default function MapStatsClient({ data }: { data: MapStatsData | null }) {
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-red-500/20 bg-red-500/5 py-20 text-center">
        <AlertTriangle className="h-10 w-10 text-red-400 mb-4" />
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-red-400 mb-2">Data Unavailable</p>
        <p className="text-sm text-muted-foreground/60">Could not load map statistics. Please try again later.</p>
      </div>
    )
  }

  const { map_trends, map_win_rates, map_avg_duration } = data

  const trendMax = Math.max(...map_trends.map((m) => m.recent_7d), 1)
  const durationMax = Math.max(...map_avg_duration.map((m) => m.avg_minutes), 1)

  return (
    <div className="space-y-8 pb-8">

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl border border-[#1e2a14] shadow-2xl"
        style={{ background: "linear-gradient(135deg, #0d1208 0%, #0a0f06 50%, #060a04 100%)" }}
      >
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-500/6 blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary/6 blur-[70px] pointer-events-none" />

        <div className="relative z-10 px-8 py-12 sm:px-12 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400 mb-4">
                <Map className="h-2.5 w-2.5" />
                Map Intelligence
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                Map<br />
                <span className="text-primary">Statistics</span>
              </h1>
              <p className="mt-3 text-slate-400 max-w-md text-sm leading-relaxed">
                Global play counts, Allied vs Axis win rates, and average battle duration for every Battlefield 1942 map.
              </p>
            </div>
            <div className="flex items-center gap-8 font-mono shrink-0">
              <div className="text-center">
                <p className="text-2xl font-black text-primary tabular-nums">{map_trends.length}</p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">Maps Tracked</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-amber-400 tabular-nums">
                  {map_trends.reduce((s, m) => s + m.recent_7d, 0).toLocaleString()}
                </p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">Rounds / 7d</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Most Played Maps ───────────────────────────────────────── */}
      {map_trends.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Swords className="h-4 w-4 text-primary" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Most Played — Last 7 Days</span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#1e2a14] to-transparent" />
          </div>
          <div className="rounded-xl border border-[#1e2a14] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1e2a14] bg-[#070b05]">
                  <th className="px-4 py-3 text-left font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground/50 w-8">#</th>
                  <th className="px-4 py-3 text-left font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground/50">Map</th>
                  <th className="px-4 py-3 text-left font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground/50 hidden sm:table-cell">Activity</th>
                  <th className="px-4 py-3 text-right font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground/50">Rounds</th>
                  <th className="px-4 py-3 text-right font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground/50 hidden md:table-cell">Trend</th>
                </tr>
              </thead>
              <tbody>
                {map_trends.slice(0, 20).map((m, i) => {
                  const barW = Math.round((m.recent_7d / trendMax) * 100)
                  return (
                    <tr
                      key={m.map_name}
                      className={`border-b border-[#1e2a14] transition-colors hover:bg-[#0a0f06] ${i % 2 === 0 ? "bg-[#070b05]" : "bg-[#060a04]"}`}
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-[10px] text-muted-foreground/40 tabular-nums">{i + 1}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/map/${encodeURIComponent(m.map_name)}`}
                          className="font-semibold text-white hover:text-primary transition-colors text-sm"
                        >
                          {m.map_name}
                        </Link>
                        {m.avg_players != null && (
                          <p className="font-mono text-[9px] text-muted-foreground/40 mt-0.5">
                            avg {m.avg_players.toFixed(1)} players/round
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-[120px] h-1.5 rounded-full bg-[#0a0f06] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary/50 transition-all duration-500"
                              style={{ width: `${barW}%` }}
                            />
                          </div>
                          <span className="font-mono text-[9px] text-muted-foreground/40 tabular-nums w-8">{barW}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-mono text-xs font-bold text-white tabular-nums">{m.recent_7d.toLocaleString()}</span>
                        <p className="font-mono text-[9px] text-muted-foreground/40">of {m.total_rounds.toLocaleString()} total</p>
                      </td>
                      <td className="px-4 py-3 text-right hidden md:table-cell">
                        <div className="flex items-center justify-end gap-1.5">
                          <TrendIcon pct={m.trend_pct} />
                          <span className={`font-mono text-[10px] tabular-nums ${m.trend_pct > 5 ? "text-emerald-400" : m.trend_pct < -5 ? "text-red-400" : "text-muted-foreground/40"}`}>
                            {m.trend_pct > 0 ? "+" : ""}{m.trend_pct.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Faction Win Rates ──────────────────────────────────────── */}
      {map_win_rates.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Allied vs Axis Win Rates</span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#1e2a14] to-transparent" />
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mb-3 px-1">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-5 rounded-sm bg-blue-500/70" />
              <span className="font-mono text-[9px] text-blue-400 uppercase tracking-wider">Allied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-5 rounded-sm bg-red-500/60" />
              <span className="font-mono text-[9px] text-red-400 uppercase tracking-wider">Axis</span>
            </div>
          </div>

          <div className="rounded-xl border border-[#1e2a14] overflow-hidden">
            <div className="divide-y divide-[#1e2a14]">
              {map_win_rates
                .sort((a, b) => (b.allied_wins + b.axis_wins) - (a.allied_wins + a.axis_wins))
                .map((m, i) => (
                  <div
                    key={m.map_name}
                    className={`px-4 py-3 flex items-center gap-4 hover:bg-[#0a0f06] transition-colors ${i % 2 === 0 ? "bg-[#070b05]" : "bg-[#060a04]"}`}
                  >
                    <Link
                      href={`/map/${encodeURIComponent(m.map_name)}`}
                      className="w-36 shrink-0 font-semibold text-xs text-white hover:text-primary transition-colors truncate"
                      title={m.map_name}
                    >
                      {m.map_name}
                    </Link>
                    <div className="flex-1 min-w-0">
                      <FactionBar alliedPct={m.allied_pct} alliedWins={m.allied_wins} axisWins={m.axis_wins} />
                    </div>
                    <span className="font-mono text-[9px] text-muted-foreground/40 shrink-0 tabular-nums hidden sm:block">
                      {(m.allied_wins + m.axis_wins).toLocaleString()} rounds
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Average Round Duration ─────────────────────────────────── */}
      {map_avg_duration.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-primary" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Average Battle Duration</span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#1e2a14] to-transparent" />
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {map_avg_duration
              .sort((a, b) => b.avg_minutes - a.avg_minutes)
              .map((m) => {
                const barW = Math.round((m.avg_minutes / durationMax) * 100)
                const mins = Math.floor(m.avg_minutes)
                const secs = Math.round((m.avg_minutes - mins) * 60)
                return (
                  <div
                    key={m.map_name}
                    className="rounded-lg border border-[#1e2a14] bg-[#070b05] p-3 hover:border-[#2a3a1a] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Link
                        href={`/map/${encodeURIComponent(m.map_name)}`}
                        className="font-semibold text-xs text-white hover:text-primary transition-colors truncate max-w-[70%]"
                        title={m.map_name}
                      >
                        {m.map_name}
                      </Link>
                      <span className="font-mono text-xs font-black text-amber-400 tabular-nums shrink-0">
                        {mins}:{secs.toString().padStart(2, "0")}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#0a0f06] overflow-hidden mb-1.5">
                      <div
                        className="h-full rounded-full bg-amber-500/40 transition-all duration-500"
                        style={{ width: `${barW}%` }}
                      />
                    </div>
                    <p className="font-mono text-[9px] text-muted-foreground/40">
                      {m.total_rounds.toLocaleString()} rounds recorded
                    </p>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {map_trends.length === 0 && map_win_rates.length === 0 && map_avg_duration.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#1e2a14] bg-[#060a04] py-20 text-center">
          <Map className="h-10 w-10 text-muted-foreground/20 mb-4" />
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground/40">No Data Available</p>
          <p className="text-sm text-muted-foreground/50 mt-2">Map statistics will appear here as rounds are tracked.</p>
        </div>
      )}
    </div>
  )
}
