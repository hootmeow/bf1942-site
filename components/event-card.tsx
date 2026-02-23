"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Hash } from "lucide-react"
import Link from "next/link"
import { getNextOccurrence } from "@/lib/event-utils"

const EVENT_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  tournament: { label: "Tournament", color: "bg-red-500/10 text-red-500 border-red-500/20" },
  themed_night: { label: "Themed Night", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  casual: { label: "Casual", color: "bg-green-500/10 text-green-500 border-green-500/20" },
  training: { label: "Training", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  scrim: { label: "Scrim", color: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
  clan_battle: { label: "Clan Battle", color: "bg-red-600/10 text-red-600 border-red-600/20" },
  other: { label: "Event", color: "bg-secondary text-muted-foreground" },
}

function getEventTypeInfo(eventType: string): { label: string; color: string } {
  if (EVENT_TYPE_LABELS[eventType]) {
    return EVENT_TYPE_LABELS[eventType]
  }
  // Custom event type: capitalize and use default color
  const label = eventType
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
  return { label, color: "bg-blue-500/10 text-blue-500 border-blue-500/20" }
}

const RECURRENCE_SHORT: Record<string, string> = {
  weekly: "Weekly",
  biweekly: "Biweekly",
  monthly: "Monthly",
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
  recurrence_frequency?: string | null
  recurrence_end?: string | null
  tags?: string[] | null
  discord_link?: string | null
}

interface EventCardProps {
  event: EventSummary
}

export function EventCard({ event }: EventCardProps) {
  const typeInfo = getEventTypeInfo(event.event_type)
  const nextDate = getNextOccurrence(event)
  const isPast = nextDate < new Date()

  return (
    <Link href={`/events/${event.event_id}`}>
      <Card className={`border-border/60 bg-card/40 card-interactive overflow-hidden ${isPast ? "opacity-60" : ""}`}>
        {event.banner_url && (
          <div className="h-32 overflow-hidden bg-muted/30 relative">
            <img src={event.banner_url} alt="" className="h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
          </div>
        )}
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge variant="outline" className={typeInfo.color}>
                {typeInfo.label}
              </Badge>
              {event.recurrence_frequency && (
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px]">
                  {RECURRENCE_SHORT[event.recurrence_frequency] || "Recurring"}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              {event.going_count}
              {event.maybe_count > 0 && <span className="text-muted-foreground/60">+{event.maybe_count}</span>}
            </div>
          </div>

          <h3 className="font-semibold text-sm truncate">{event.title}</h3>
          {event.description && (
            <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 border-l-2 border-primary/20 pl-2">{event.description}</p>
          )}

          {event.tags && event.tags.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              {event.tags.slice(0, 3).map((tag, idx) => (
                <span key={idx} className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded">
                  <Hash className="h-2.5 w-2.5" />
                  {tag}
                </span>
              ))}
              {event.tags.length > 3 && (
                <span className="text-[10px] text-muted-foreground">+{event.tags.length - 3}</span>
              )}
            </div>
          )}

          <div className="mt-3 flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {event.recurrence_frequency ? "Next: " : ""}
              {nextDate.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
              {" "}
              {nextDate.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
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
