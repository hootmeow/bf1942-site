import type { Metadata } from "next"
import EventDetailClient from "./event-detail-client"

const EVENT_TYPE_LABELS: Record<string, string> = {
  tournament: "Tournament",
  themed_night: "Themed Night",
  casual: "Casual Game Night",
  other: "Event",
}

export async function generateMetadata(
  props: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const params = await props.params
  const eventId = params.id

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bf1942.online"
    const res = await fetch(`${baseUrl}/api/v1/events/${eventId}`, {
      next: { revalidate: 600 },
    })
    if (res.ok) {
      const data = await res.json()
      if (data.ok && data.event) {
        const event = data.event
        const date = new Date(event.event_date).toLocaleDateString("en-US", {
          weekday: "long", month: "long", day: "numeric", year: "numeric",
        })
        const typeLabel = EVENT_TYPE_LABELS[event.event_type] || "Event"
        const typeLine = `A ${typeLabel} on ${date}.`
        const desc = event.description?.slice(0, 150) || "Join this Battlefield 1942 community event."
        return {
          title: event.title,
          description: `${typeLine} ${desc}`,
          openGraph: {
            title: `${event.title} | BF1942 Event`,
            description: `${typeLine}\n\n${desc}`,
            ...(event.banner_url ? { images: [{ url: event.banner_url }] } : {}),
          },
        }
      }
    }
  } catch {
    // Fall through to default
  }

  return {
    title: "Event Details",
    description: "View details and RSVP for this Battlefield 1942 community event.",
  }
}

export default function EventDetailPage() {
  return <EventDetailClient />
}
