"use client"

import { useEffect, useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { EventCard, type EventSummary } from "@/components/event-card"
import { EventCalendar, expandRecurringEvents } from "@/components/event-calendar"
import { Plus, Calendar, X } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Skeleton } from "@/components/ui/skeleton"

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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
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

  // Filter events to the selected calendar date
  const filteredEvents = useMemo(() => {
    if (!selectedDate) return events
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth()
    const day = selectedDate.getDate()
    const expanded = expandRecurringEvents(events, year, month)
    const matchingIds = new Set(
      expanded.filter((e) => e.day === day).map((e) => e.event.event_id)
    )
    return events.filter((e) => matchingIds.has(e.event_id))
  }, [events, selectedDate])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Events</h1>
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
      <EventCalendar events={events} onDateClick={(date) => setSelectedDate(date)} />

      {/* Date filter indicator */}
      {selectedDate && (
        <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm">
          <Calendar className="h-4 w-4 text-primary" />
          <span>
            Showing events for{" "}
            <strong>{selectedDate.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</strong>
          </span>
          <Button variant="ghost" size="icon" className="h-5 w-5 ml-auto" onClick={() => setSelectedDate(null)}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[180px] rounded-xl" />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="border border-dashed border-border/60 rounded-xl bg-card/30 py-12 text-center">
          <Calendar className="mx-auto h-10 w-10 opacity-40" />
          <p className="mt-3 font-medium text-muted-foreground">No events found</p>
          <p className="text-sm mt-1 text-muted-foreground">
            {selectedDate ? "Try clearing the date filter or selecting a different date." : "Check back soon for upcoming events."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
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
