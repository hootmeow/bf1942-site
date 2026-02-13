import type { Metadata } from "next"
import EventDetailClient from "./event-detail-client"

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
          month: "long", day: "numeric", year: "numeric",
        })
        return {
          title: event.title,
          description: `${event.event_type} on ${date}. ${event.description?.slice(0, 150) || "Join this Battlefield 1942 community event."}`,
          openGraph: {
            title: `${event.title} | BF1942 Event`,
            description: `${event.event_type} on ${date}. ${event.description?.slice(0, 150) || ""}`,
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
