import type { Metadata } from "next"
import { Suspense } from "react"
import HighlightsClient from "./highlights-client"

export const metadata: Metadata = {
  title: "Community Highlights",
  description: "Watch the best Battlefield 1942 videos and discover top content creators from the BF1942 community.",
  openGraph: {
    title: "Community Highlights",
    description: "Watch the best Battlefield 1942 videos and discover top content creators from the BF1942 community.",
  },
}

export default function HighlightsPage() {
  return (
    <Suspense>
      <HighlightsClient />
    </Suspense>
  )
}
