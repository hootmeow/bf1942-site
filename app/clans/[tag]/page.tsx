import type { Metadata } from "next"
import ClanDetailClient from "./clan-detail-client"

export async function generateMetadata(
  props: { params: Promise<{ tag: string }> }
): Promise<Metadata> {
  const params = await props.params
  const tag = decodeURIComponent(params.tag)

  return {
    title: `[${tag}] — Unit Profile`,
    description: `View the roster, stats, and kill/death ratios for the [${tag}] unit in Battlefield 1942.`,
    openGraph: {
      title: `[${tag}] Unit Profile | BF1942`,
      description: `Roster and combat stats for the [${tag}] unit.`,
    },
  }
}

export default function ClanDetailPage() {
  return <ClanDetailClient />
}
