import type { Metadata } from "next"
import StatsClient from "./stats-client"

export const metadata: Metadata = {
  title: "Player Statistics",
  description:
    "Search for Battlefield 1942 players, view Hall of Fame records, and explore all-time stats and leaderboards.",
  openGraph: {
    title: "Player Statistics",
  },
}

export default function StatsPage() {
  return <StatsClient />
}
