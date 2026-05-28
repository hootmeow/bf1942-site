"use client"

import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { addInterval } from "@/lib/event-utils"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"

// ── Types ──────────────────────────────────────────────────────────────────────

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

// ── Constants ──────────────────────────────────────────────────────────────────

const EVENT_TYPE_BAR: Record<string, string> = {
  tournament:   "bg-red-500",
  themed_night: "bg-purple-500",
  casual:       "bg-emerald-500",
  training:     "bg-yellow-500",
  scrim:        "bg-orange-500",
  clan_battle:  "bg-rose-400",
  other:        "bg-slate-500",
}

const EVENT_TYPE_LABEL: Record<string, string> = {
  tournament:   "Tournament",
  themed_night: "Themed Night",
  casual:       "Casual",
  training:     "Training",
  scrim:        "Scrim",
  clan_battle:  "Clan Battle",
  other:        "Event",
}

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

// ── expandRecurringEvents (exported — used by events-client) ───────────────────

export function expandRecurringEvents(
  events: CalendarEvent[],
  year: number,
  month: number
): { day: number; event: CalendarEvent }[] {
  const monthStart = new Date(year, month, 1)
  const monthEnd   = new Date(year, month + 1, 0, 23, 59, 59)
  const results: { day: number; event: CalendarEvent }[] = []

  for (const ev of events) {
    const eventDate = new Date(ev.event_date)

    if (!ev.recurrence_frequency) {
      if (eventDate.getFullYear() === year && eventDate.getMonth() === month) {
        results.push({ day: eventDate.getDate(), event: ev })
      }
      continue
    }

    const recEnd  = ev.recurrence_end
      ? new Date(ev.recurrence_end + "T23:59:59")
      : new Date(year, month + 1, 0, 23, 59, 59)
    const limit   = recEnd < monthEnd ? recEnd : monthEnd
    let current   = new Date(eventDate)

    while (current < monthStart) {
      current = addInterval(current, ev.recurrence_frequency)
    }

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

// ── EventCalendar ──────────────────────────────────────────────────────────────

export function EventCalendar({ events, onDateClick }: EventCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })

  const year       = currentMonth.getFullYear()
  const month      = currentMonth.getMonth()
  const firstDay   = new Date(year, month, 1).getDay()
  const daysInMonth= new Date(year, month + 1, 0).getDate()
  const today      = new Date()

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1))

  const eventsByDay = useMemo(() => {
    const result: Record<number, CalendarEvent[]> = {}
    const expanded = expandRecurringEvents(events, year, month)
    for (const { day, event } of expanded) {
      if (!result[day]) result[day] = []
      result[day].push(event)
    }
    return result
  }, [events, year, month])

  // Build cells: nulls for leading empty slots, then 1..daysInMonth
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  // Pad to complete the last row
  while (cells.length % 7 !== 0) cells.push(null)

  const monthLabel = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" }).toUpperCase()

  return (
    <TooltipProvider delayDuration={150}>
      <div className="overflow-hidden rounded-xl border border-[#1e2a14] bg-[#060a04]">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b border-[#1e2a14]"
          style={{ background: "linear-gradient(135deg, #0d1208 0%, #0a0f06 100%)" }}
        >
          <button
            onClick={prevMonth}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1e2a14] bg-[#0a0f06] text-muted-foreground hover:border-amber-500/30 hover:text-amber-400 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="text-center">
            <span className="font-mono text-sm font-bold tracking-[0.2em] text-foreground">
              {monthLabel}
            </span>
            <div className="flex items-center justify-center gap-4 mt-1">
              {Object.entries(EVENT_TYPE_BAR).slice(0, 4).map(([type, bar]) => (
                <span key={type} className="flex items-center gap-1 font-mono text-[8px] text-muted-foreground/50 uppercase tracking-wider">
                  <span className={cn("h-1.5 w-3 rounded-full", bar)} />
                  {EVENT_TYPE_LABEL[type]?.split(" ")[0]}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={nextMonth}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1e2a14] bg-[#0a0f06] text-muted-foreground hover:border-amber-500/30 hover:text-amber-400 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* ── Weekday headers ──────────────────────────────────────────── */}
        <div className="grid grid-cols-7 border-b border-[#1e2a14]">
          {WEEKDAYS.map((d, i) => (
            <div
              key={d}
              className={cn(
                "py-2.5 text-center font-mono text-[9px] font-bold tracking-[0.18em] uppercase",
                i === 0 || i === 6
                  ? "text-muted-foreground/35"
                  : "text-muted-foreground/55"
              )}
            >
              {d}
            </div>
          ))}
        </div>

        {/* ── Day grid ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            const isToday = day !== null
              && today.getFullYear() === year
              && today.getMonth()    === month
              && today.getDate()     === day
            const isWeekend  = i % 7 === 0 || i % 7 === 6
            const dayEvents  = day ? eventsByDay[day] ?? [] : []
            const hasEvents  = dayEvents.length > 0

            return (
              <button
                key={i}
                type="button"
                disabled={day === null}
                onClick={() => day && onDateClick?.(new Date(year, month, day))}
                className={cn(
                  "relative flex flex-col min-h-[64px] p-1.5 border-r border-b border-[#141a0e] text-left transition-all duration-150",
                  "last:border-r-0",
                  day === null   && "bg-[#040604] cursor-default",
                  day !== null   && !isToday && "hover:bg-[#0d1208] cursor-pointer",
                  isWeekend      && day !== null && !isToday && "bg-[#070a05]",
                  isToday        && "bg-amber-500/8 cursor-pointer",
                  hasEvents      && !isToday && "hover:bg-[#0f160a]"
                )}
              >
                {day !== null && (
                  <>
                    {/* Day number */}
                    <span className={cn(
                      "inline-flex h-5 w-5 items-center justify-center rounded font-mono text-xs font-bold tabular-nums transition-colors",
                      isToday
                        ? "bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                        : hasEvents
                          ? "text-foreground"
                          : isWeekend
                            ? "text-muted-foreground/40"
                            : "text-muted-foreground/60"
                    )}>
                      {day}
                    </span>

                    {/* Event bars */}
                    {hasEvents && (
                      <div className="mt-auto flex flex-col gap-0.5 w-full">
                        {dayEvents.slice(0, 3).map((ev, idx) => {
                          const barColor = EVENT_TYPE_BAR[ev.event_type] ?? EVENT_TYPE_BAR.other
                          const label    = EVENT_TYPE_LABEL[ev.event_type] ?? "Event"
                          const evDate   = new Date(ev.event_date)
                          return (
                            <Tooltip key={`${ev.event_id}-${idx}`}>
                              <TooltipTrigger asChild>
                                <div className={cn(
                                  "h-1 w-full rounded-full opacity-80 hover:opacity-100 transition-opacity",
                                  barColor
                                )} />
                              </TooltipTrigger>
                              <TooltipContent
                                side="top"
                                className="bg-[#0d1208] border-[#1e2a14] text-foreground space-y-1 max-w-[200px]"
                              >
                                <p className="font-semibold text-xs truncate">{ev.title}</p>
                                <div className="flex items-center gap-2">
                                  <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", barColor)} />
                                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
                                  <span className="font-mono text-[10px] text-muted-foreground/60">
                                    {evDate.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                                  </span>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          )
                        })}
                        {dayEvents.length > 3 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="font-mono text-[8px] text-muted-foreground/40 leading-none pl-0.5">
                                +{dayEvents.length - 3} more
                              </span>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="bg-[#0d1208] border-[#1e2a14] space-y-0.5"
                            >
                              {dayEvents.slice(3).map((ev, idx) => (
                                <p key={`${ev.event_id}-overflow-${idx}`} className="text-[10px] truncate text-foreground">
                                  {ev.title}
                                </p>
                              ))}
                            </TooltipContent>
                          </Tooltip>
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
    </TooltipProvider>
  )
}
