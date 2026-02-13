import type { Metadata } from "next"
import OrgsClient from "./orgs-client"

export const metadata: Metadata = {
  title: "Organizations",
  description: "Find and join Battlefield 1942 organizations, clans, and teams. Browse active groups in the BF1942 community.",
  openGraph: {
    title: "Organizations | BF1942 Command Center",
    description: "Find and join Battlefield 1942 organizations, clans, and teams in the BF1942 community.",
  },
}

export default function OrgsPage() {
  return <OrgsClient />
}
