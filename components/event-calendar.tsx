"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface CalendarEvent {
  event_id: number
  title: string
  event_date: string
  event_type: string
  recurrence_frequency?: string | null
  recurrence_end?: string | null
}

interface EventCalendarProps {
  events: CalendarEvent[]
  onDateClick?: (date: Date) => void
}

const EVENT_TYPE_DOT: Record<string, string> = {
  tournament: "bg-red-500",
  themed_night: "bg-purple-500",
  casual: "bg-green-500",
  other: "bg-muted-foreground",
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function addInterval(date: Date, frequency: string): Date {
  const d = new Date(date)
  if (frequency === "weekly") d.setDate(d.getDate() + 7)
  else if (frequency === "biweekly") d.setDate(d.getDate() + 14)
  else if (frequency === "monthly") d.setMonth(d.getMonth() + 1)
  return d
}

function expandRecurringEvents(events: CalendarEvent[], year: number, month: number): { day: number; event: CalendarEvent }[] {
  const monthStart = new Date(year, month, 1)
  const monthEnd = new Date(year, month + 1, 0, 23, 59, 59)
  const results: { day: number; event: CalendarEvent }[] = []

  for (const ev of events) {
    const eventDate = new Date(ev.event_date)

    if (!ev.recurrence_frequency) {
      // Non-recurring: just check if it falls in this month
      if (eventDate.getFullYear() === year && eventDate.getMonth() === month) {
        results.push({ day: eventDate.getDate(), event: ev })
      }
      continue
    }

    // Recurring: generate occurrences within this month
    const recEnd = ev.recurrence_end ? new Date(ev.recurrence_end + "T23:59:59") : new Date(year, month + 1, 0, 23, 59, 59)
    const limit = recEnd < monthEnd ? recEnd : monthEnd
    let current = new Date(eventDate)

    // Fast-forward to near the start of this month
    while (current < monthStart) {
      current = addInterval(current, ev.recurrence_frequency)
    }

    // Generate occurrences within the month
    let safety = 0
    while (current <= limit && safety < 50) {
      if (current >= monthStart && current <= monthEnd) {
        results.push({ day: current.getDate(), event: ev })
      }
      current = addInterval(current, ev.recurrence_frequency)
      safety++
    }
  }

  return results
}

export function EventCalendar({ events, onDateClick }: EventCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1))

  // Expand recurring events into day occurrences
  const eventsByDay = useMemo(() => {
    const result: Record<number, CalendarEvent[]> = {}
    const expanded = expandRecurringEvents(events, year, month)
    for (const { day, event } of expanded) {
      if (!result[day]) result[day] = []
      result[day].push(event)
    }
    return result
  }, [events, year, month])

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="rounded-xl border border-border/60 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border/40">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-semibold text-sm">
          {currentMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
        </span>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 text-center border-b border-border/40">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-2 text-[10px] font-medium text-muted-foreground uppercase">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          const isToday = day !== null && today.getFullYear() === year && today.getMonth() === month && today.getDate() === day
          const dayEvents = day ? eventsByDay[day] || [] : []

          return (
            <button
              key={i}
              type="button"
              disabled={day === null}
              onClick={() => day && onDateClick?.(new Date(year, month, day))}
              className={cn(
                "relative min-h-[60px] p-1.5 border-r border-b border-border/20 text-left transition-colors",
                day === null && "bg-muted/10 cursor-default",
                day !== null && "hover:bg-accent/50 cursor-pointer",
                isToday && "bg-primary/5"
              )}
            >
              {day !== null && (
                <>
                  <span className={cn(
                    "text-xs tabular-nums",
                    isToday && "font-bold text-primary"
                  )}>
                    {day}
                  </span>
                  {dayEvents.length > 0 && (
                    <div className="flex flex-wrap gap-0.5 mt-0.5">
                      {dayEvents.slice(0, 3).map((ev, idx) => (
                        <div
                          key={`${ev.event_id}-${idx}`}
                          className={cn("h-1.5 w-1.5 rounded-full", EVENT_TYPE_DOT[ev.event_type] || EVENT_TYPE_DOT.other)}
                          title={ev.title}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="text-[8px] text-muted-foreground">+{dayEvents.length - 3}</span>
                      )}
                    </div>
                  )}
                </>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
