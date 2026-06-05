import type { Metadata } from "next"
import MapStatsClient from "./map-stats-client"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Map Statistics",
  description:
    "Global Battlefield 1942 map statistics — most played maps, Allied vs Axis win rates, and average round duration by map.",
}

interface MapTrendEntry {
  map_name: string
  total_rounds: number
  recent_7d: number
  prev_7d: number
  trend_pct: number
  avg_players?: number
}

interface MapWinRateEntry {
  map_name: string
  allied_wins: number
  axis_wins: number
  allied_pct: number
  axis_pct: number
  decisive_rounds: number
}

interface MapAvgDurationEntry {
  map_name: string
  avg_minutes: number
  total_rounds: number
}

export interface MapStatsData {
  map_trends: MapTrendEntry[]
  map_win_rates: MapWinRateEntry[]
  map_avg_duration: MapAvgDurationEntry[]
  popular_maps_7d: { map_name: string; rounds_played: number }[]
}

async function fetchMapStats(): Promise<MapStatsData | null> {
  const base = "http://127.0.0.1:3000"
  try {
    const [healthRes, metricsRes] = await Promise.all([
      fetch(`${base}/api/v1/metrics/global/health`, {
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      }),
      fetch(`${base}/api/v1/metrics/global`, {
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      }),
    ])

    const [health, metrics] = await Promise.all([
      healthRes.ok ? healthRes.json() : null,
      metricsRes.ok ? metricsRes.json() : null,
    ])

    if (!health?.ok) return null

    return {
      map_trends: health.map_trends_all ?? health.map_trends ?? [],
      map_win_rates: health.map_win_rates ?? [],
      map_avg_duration: health.map_avg_duration ?? [],
      popular_maps_7d: metrics?.popular_maps_7_days ?? [],
    }
  } catch (err) {
    console.error("[MapStats] fetch failed:", err)
    return null
  }
}

export default async function MapStatsPage() {
  const data = await fetchMapStats()
  return <MapStatsClient data={data} />
}
