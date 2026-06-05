"use client"

import { useEffect, useState, useMemo, useReducer } from "react"
import { EventCard, type EventSummary } from "@/components/event-card"
import { EventCalendar, expandRecurringEvents } from "@/components/event-calendar"
import { Plus, Calendar, X, Trophy, Shield, Swords, BookOpen, Crosshair, Users, Sparkles, Target } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

// ── Filter config ──────────────────────────────────────────────────────────────

const EVENT_TYPES = [
  { value: "",             label: "All Ops",     icon: Target,    color: "text-amber-400",   border: "border-amber-500/30",   bg: "bg-amber-500/10"   },
  { value: "tournament",   label: "Tournament",  icon: Trophy,    color: "text-red-400",     border: "border-red-500/30",     bg: "bg-red-500/10"     },
  { value: "themed_night", label: "Themed Night",icon: Sparkles,  color: "text-purple-400",  border: "border-purple-500/30",  bg: "bg-purple-500/10"  },
  { value: "casual",       label: "Casual",      icon: Users,     color: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10" },
  { value: "training",     label: "Training",    icon: BookOpen,  color: "text-yellow-400",  border: "border-yellow-500/30",  bg: "bg-yellow-500/10"  },
  { value: "scrim",        label: "Scrim",       icon: Crosshair, color: "text-orange-400",  border: "border-orange-500/30",  bg: "bg-orange-500/10"  },
  { value: "clan_battle",  label: "Clan Battle", icon: Swords,    color: "text-rose-400",    border: "border-rose-500/30",    bg: "bg-rose-500/10"    },
  { value: "other",        label: "Other",       icon: Shield,    color: "text-slate-400",   border: "border-slate-500/30",   bg: "bg-slate-500/10"   },
]

// ── State management ───────────────────────────────────────────────────────────

type EventsState = { events: EventSummary[]; loading: boolean; total: number }
type EventsAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: { events: EventSummary[]; total: number } }
  | { type: "FETCH_ERROR" }

function eventsReducer(state: EventsState, action: EventsAction): EventsState {
  switch (action.type) {
    case "FETCH_START":   return { ...state, loading: true }
    case "FETCH_SUCCESS": return { ...state, loading: false, ...action.payload }
    case "FETCH_ERROR":   return { ...state, loading: false }
    default:              return state
  }
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function EventsPage() {
  const [state, dispatch] = useReducer(eventsReducer, { events: [], loading: true, total: 0 })
  const [typeFilter, setTypeFilter]     = useState("")
  const [page, setPage]                 = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const { data: session } = useSession()

  useEffect(() => {
    async function fetchEvents() {
      dispatch({ type: "FETCH_START" })
      try {
        const params = new URLSearchParams({ page: String(page), limit: "50" })
        if (typeFilter) params.set("event_type", typeFilter)
        const res = await fetch(`/api/v1/events?${params}`)
        if (res.ok) {
          const data = await res.json()
          if (data.ok) dispatch({ type: "FETCH_SUCCESS", payload: { events: data.events, total: data.total } })
          else dispatch({ type: "FETCH_ERROR" })
        } else {
          dispatch({ type: "FETCH_ERROR" })
        }
      } catch (e) {
        console.error("Failed to fetch events:", e)
        dispatch({ type: "FETCH_ERROR" })
      }
    }
    fetchEvents()
  }, [typeFilter, page])

  const { events, loading, total } = state

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

  const activeCount  = events.filter(e => new Date(e.event_date) >= new Date()).length
  const selectedType = EVENT_TYPES.find(t => t.value === typeFilter) ?? EVENT_TYPES[0]

  return (
    <div className="space-y-8 pb-8">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl border border-[#1e2a14] shadow-2xl"
        style={{ background: "linear-gradient(135deg, #0d1208 0%, #0a0f06 50%, #060a04 100%)" }}
      >
        {/* Glow */}
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-500/6 blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary/6 blur-[70px] pointer-events-none" />

        <div className="relative z-10 px-8 py-12 sm:px-12 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400 mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                Operations Board
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                Community<br />
                <span className="text-primary">Events</span>
              </h1>
              <p className="mt-3 text-slate-400 max-w-md text-sm leading-relaxed">
                Tournaments, game nights, scrims, and training ops — all in one place.
              </p>
            </div>

            {/* Stats + CTA */}
            <div className="flex flex-col items-start sm:items-end gap-4">
              <div className="flex items-center gap-6 font-mono">
                <div className="text-center">
                  <p className="text-2xl font-black text-amber-400 tabular-nums">{activeCount}</p>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">Upcoming</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-primary tabular-nums">{total}</p>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">Total</p>
                </div>
              </div>
              {session?.user && (
                <Link href="/events/create">
                  <button className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/15 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-primary transition-all hover:bg-primary/25 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/10">
                    <Plus className="h-4 w-4" />
                    Create Event
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── CALENDAR ──────────────────────────────────────────────────── */}
      <EventCalendar events={events} onDateClick={(date) => setSelectedDate(date)} />

      {/* ── DATE FILTER BANNER ────────────────────────────────────────── */}
      {selectedDate && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/8 px-4 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/15">
            <Calendar className="h-4 w-4 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-amber-500/70">Date Filter Active</p>
            <p className="text-sm font-semibold text-foreground">
              {selectedDate.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>
          <button
            onClick={() => setSelectedDate(null)}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-400/70 hover:text-amber-400 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ── TYPE FILTER CHIPS ─────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {EVENT_TYPES.map((t) => {
          const Icon    = t.icon
          const active  = typeFilter === t.value
          return (
            <button
              key={t.value}
              onClick={() => { setTypeFilter(t.value); setPage(1) }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition-all duration-150",
                active
                  ? cn("shadow-sm", t.color, t.border, t.bg)
                  : "border-[#1e2a14] bg-[#070b05] text-muted-foreground/60 hover:border-[#2a3a1a] hover:text-muted-foreground"
              )}
            >
              <Icon className={cn("h-3 w-3", active ? t.color : "text-muted-foreground/50")} />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* ── EVENT GRID ────────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[280px] rounded-xl bg-[#0a0f06]" />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#1e2a14] bg-[#060a04] py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#1e2a14] bg-[#0a0f06] mb-5">
            <Calendar className="h-7 w-7 text-muted-foreground/30" />
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground/40 mb-2">No Operations Found</p>
          <p className="text-sm text-muted-foreground/60 max-w-xs">
            {selectedDate
              ? "No events on this date. Clear the date filter or select another day."
              : "No events match the current filter. Check back soon or create one."}
          </p>
          {session?.user && !selectedDate && (
            <Link href="/events/create">
              <button className="mt-6 flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary/20 transition-colors">
                <Plus className="h-3.5 w-3.5" />
                Create Event
              </button>
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Result count */}
          {(typeFilter || selectedDate) && (
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
              {filteredEvents.length} operation{filteredEvents.length !== 1 ? "s" : ""} found
              {selectedType.value !== "" ? ` · ${selectedType.label}` : ""}
            </p>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredEvents.map((event) => (
              <EventCard key={event.event_id} event={event} />
            ))}
          </div>

          {total > 50 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="rounded-lg border border-[#1e2a14] bg-[#070b05] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:border-[#2a3a1a] hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              <span className="font-mono text-xs text-muted-foreground/60 tabular-nums">
                {page} / {Math.ceil(total / 50)}
              </span>
              <button
                disabled={events.length < 50}
                onClick={() => setPage(page + 1)}
                className="rounded-lg border border-[#1e2a14] bg-[#070b05] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:border-[#2a3a1a] hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
