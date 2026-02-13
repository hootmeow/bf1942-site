"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users } from "lucide-react"
import Link from "next/link"

const EVENT_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  tournament: { label: "Tournament", color: "bg-red-500/10 text-red-500 border-red-500/20" },
  themed_night: { label: "Themed Night", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  casual: { label: "Casual", color: "bg-green-500/10 text-green-500 border-green-500/20" },
  other: { label: "Event", color: "bg-secondary text-muted-foreground" },
}

interface ServerEvent {
  event_id: number
  title: string
  event_type: string
  event_date: string
  going_count: number
  recurrence_frequency?: string | null
}

interface ServerEventsProps {
  serverId: number
}

export function ServerEvents({ serverId }: ServerEventsProps) {
  const [events, setEvents] = useState<ServerEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(`/api/v1/events?server_id=${serverId}&limit=5`)
        if (res.ok) {
          const data = await res.json()
          if (data.ok) setEvents(data.events)
        }
      } catch {}
      setLoading(false)
    }
    fetchEvents()
  }, [serverId])

  if (loading || events.length === 0) return null

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle as="h2" className="flex items-center gap-2 text-base">
          <Calendar className="h-4 w-4 text-primary" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {events.map((ev) => {
          const typeInfo = EVENT_TYPE_LABELS[ev.event_type] || EVENT_TYPE_LABELS.other
          const date = new Date(ev.event_date)
          return (
            <Link
              key={ev.event_id}
              href={`/events/${ev.event_id}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-border/40 p-3 hover:bg-accent/50 transition-colors"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <Badge variant="outline" className={`${typeInfo.color} text-[10px] px-1.5 py-0`}>
                    {typeInfo.label}
                  </Badge>
                  {ev.recurrence_frequency && (
                    <span className="text-[10px] text-blue-500">Recurring</span>
                  )}
                </div>
                <p className="text-sm font-medium truncate">{ev.title}</p>
                <p className="text-[10px] text-muted-foreground">
                  {date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                  {" "}
                  {date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                <Users className="h-3 w-3" />
                {ev.going_count}
              </div>
            </Link>
          )
        })}
      </CardContent>
    </Card>
  )
}
