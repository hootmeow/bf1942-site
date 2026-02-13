"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { EventCard, type EventSummary } from "@/components/event-card"
import { EventCalendar } from "@/components/event-calendar"
import { Loader2, Plus, Calendar } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"

const EVENT_TYPES = [
  { value: "", label: "All Types" },
  { value: "tournament", label: "Tournament" },
  { value: "themed_night", label: "Themed Night" },
  { value: "casual", label: "Casual" },
  { value: "other", label: "Other" },
]

export default function EventsPage() {
  const [events, setEvents] = useState<EventSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const { data: session } = useSession()

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true)
      try {
        const params = new URLSearchParams({ page: String(page), limit: "50" })
        if (typeFilter) params.set("event_type", typeFilter)
        const res = await fetch(`/api/v1/events?${params}`)
        if (res.ok) {
          const data = await res.json()
          if (data.ok) {
            setEvents(data.events)
            setTotal(data.total)
          }
        }
      } catch (e) {
        console.error("Failed to fetch events:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [typeFilter, page])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Events</h1>
            <p className="text-sm text-muted-foreground">Tournaments, game nights, and community events</p>
          </div>
        </div>
        {session?.user && (
          <Link href="/events/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </Link>
        )}
      </div>

      {/* Calendar view */}
      <EventCalendar events={events} />

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {EVENT_TYPES.map((t) => (
          <Button
            key={t.value}
            variant={typeFilter === t.value ? "default" : "outline"}
            size="sm"
            onClick={() => { setTypeFilter(t.value); setPage(1) }}
          >
            {t.label}
          </Button>
        ))}
      </div>

      {/* Event list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-muted-foreground">No events found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.event_id} event={event} />
            ))}
          </div>

          {total > 50 && (
            <div className="flex justify-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              <span className="flex items-center text-sm text-muted-foreground px-3">
                Page {page}
              </span>
              <Button variant="outline" size="sm" disabled={events.length < 50} onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
