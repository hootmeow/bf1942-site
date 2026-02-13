import type { Metadata } from "next"
import CreatorClient from "./creator-client"

export async function generateMetadata(
  props: { params: Promise<{ channelId: string }> }
): Promise<Metadata> {
  const params = await props.params
  const channelId = params.channelId

  // Fetch creator name for the metadata
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bf1942.online"
    const res = await fetch(`${baseUrl}/api/v1/community/creator/${channelId}`, {
      next: { revalidate: 3600 },
    })
    if (res.ok) {
      const data = await res.json()
      if (data.ok && data.creator) {
        const name = data.creator.creator_name
        const videoCount = data.creator.video_count
        return {
          title: `${name} - BF1942 Creator`,
          description: `Watch ${videoCount} Battlefield 1942 videos from ${name}. View their channel stats and latest uploads.`,
          openGraph: {
            title: `${name} | BF1942 Creator`,
            description: `Watch ${videoCount} Battlefield 1942 videos from ${name}.`,
          },
        }
      }
    }
  } catch {
    // Fall through to default
  }

  return {
    title: "Creator Profile",
    description: "View this Battlefield 1942 content creator's videos and channel stats.",
  }
}

export default function CreatorPage() {
  return <CreatorClient />
}
