import type { Metadata } from "next"
import { Suspense } from "react"
import MapsListClient from "./maps-list-client"

export const metadata: Metadata = {
  title: "Map Guides",
  description:
    "Detailed guides for all Battlefield 1942 maps. Browse by theater of war, map type, and more.",
  openGraph: {
    title: "Map Guides",
  },
}

export default function MapsListPage() {
  return (
    <Suspense>
      <MapsListClient />
    </Suspense>
  )
}
