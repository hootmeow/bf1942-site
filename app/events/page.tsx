import type { Metadata } from "next"
import EventsClient from "./events-client"

export const metadata: Metadata = {
  title: "Events",
  description: "Browse upcoming Battlefield 1942 community events — tournaments, themed nights, training sessions, and more.",
  openGraph: {
    title: "Events",
    description: "Browse upcoming Battlefield 1942 community events — tournaments, themed nights, training sessions, and more.",
  },
}

export default function EventsPage() {
  return <EventsClient />
}
