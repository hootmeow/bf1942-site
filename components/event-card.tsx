"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, MapPin } from "lucide-react"
import Link from "next/link"

const EVENT_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  tournament: { label: "Tournament", color: "bg-red-500/10 text-red-500 border-red-500/20" },
  themed_night: { label: "Themed Night", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  training: { label: "Training", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  casual: { label: "Casual", color: "bg-green-500/10 text-green-500 border-green-500/20" },
  other: { label: "Event", color: "bg-secondary text-muted-foreground" },
}

export interface EventSummary {
  event_id: number
  title: string
  description?: string | null
  event_type: string
  event_date: string
  end_date?: string | null
  banner_url?: string | null
  organizer_name?: string | null
  org_name?: string | null
  org_tag?: string | null
  going_count: number
  maybe_count: number
}

interface EventCardProps {
  event: EventSummary
}

export function EventCard({ event }: EventCardProps) {
  const typeInfo = EVENT_TYPE_LABELS[event.event_type] || EVENT_TYPE_LABELS.other
  const date = new Date(event.event_date)
  const isPast = date < new Date()

  return (
    <Link href={`/events/${event.event_id}`}>
      <Card className={`border-border/60 bg-card/40 card-interactive overflow-hidden ${isPast ? "opacity-60" : ""}`}>
        {event.banner_url && (
          <div className="h-32 overflow-hidden bg-muted/30">
            <img src={event.banner_url} alt="" className="h-full w-full object-cover" loading="lazy" />
          </div>
        )}
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <Badge variant="outline" className={typeInfo.color}>
              {typeInfo.label}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              {event.going_count}
              {event.maybe_count > 0 && <span className="text-muted-foreground/60">+{event.maybe_count}</span>}
            </div>
          </div>

          <h3 className="font-semibold text-sm truncate">{event.title}</h3>
          {event.description && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{event.description}</p>
          )}

          <div className="mt-3 flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
              {" "}
              {date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
            </span>
            {(event.org_name || event.organizer_name) && (
              <span>
                by {event.org_tag ? `${event.org_tag} ` : ""}{event.org_name || event.organizer_name}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
