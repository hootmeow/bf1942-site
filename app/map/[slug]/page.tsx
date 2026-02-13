import type { Metadata } from "next"
import MapDetailClient from "./map-detail-client"

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const params = await props.params
  const mapName = decodeURIComponent(params.slug)

  return {
    title: `${mapName} — Map Details`,
    description: `View active servers playing ${mapName} and map statistics for Battlefield 1942.`,
    openGraph: {
      title: `${mapName} | BF1942 Map`,
      description: `Active servers and stats for ${mapName} in Battlefield 1942.`,
    },
  }
}

export default function MapDetailPage() {
  return <MapDetailClient />
}
