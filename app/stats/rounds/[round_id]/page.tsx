import type { Metadata } from "next"
import RoundDetailClient from "./round-detail-client"

export async function generateMetadata(
  props: { params: Promise<{ round_id: string }> }
): Promise<Metadata> {
  const params = await props.params
  const roundId = params.round_id

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bf1942.online"
    const res = await fetch(`${baseUrl}/api/v1/rounds/${roundId}`, {
      next: { revalidate: 600 },
    })
    if (res.ok) {
      const data = await res.json()
      if (data.ok && data.round) {
        const round = data.round
        const winner = round.tickets1 > round.tickets2 ? "Axis" : "Allies"
        const duration = Math.floor(round.duration_seconds / 60)
        return {
          title: `${round.map_name} — Round #${roundId}`,
          description: `${winner} victory on ${round.map_name} (${round.current_server_name}). ${duration} min battle with ${data.player_stats?.length || 0} players.`,
          openGraph: {
            title: `${round.map_name} — Round #${roundId} | BF1942`,
            description: `${winner} victory on ${round.map_name}. ${duration} minute battle.`,
          },
        }
      }
    }
  } catch {
    // Fall through to default
  }

  return {
    title: `Round #${roundId}`,
    description: "View the battle report for this Battlefield 1942 round.",
  }
}

export default function RoundDetailPage() {
  return <RoundDetailClient />
}
