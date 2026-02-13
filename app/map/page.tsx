import type { Metadata } from "next"
import MapClient from "./map-client"

export const metadata: Metadata = {
  title: "Global Conflict Map",
  description:
    "Live world map of all active Battlefield 1942 servers. See where battles are happening in real-time.",
  openGraph: {
    title: "Global Conflict Map | BF1942 Command Center",
  },
}

export default function MapPage() {
  return <MapClient />
}
