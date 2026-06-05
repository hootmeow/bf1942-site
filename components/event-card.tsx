"use client"

import { useState } from "react"
import { Users, Hash, Repeat } from "lucide-react"
import Link from "next/link"
import { getNextOccurrence } from "@/lib/event-utils"
import { formatLocalTime } from "@/lib/datetime-utils"
import { cn } from "@/lib/utils"

// ── Type config ────────────────────────────────────────────────────────────────

const EVENT_TYPE_CONFIG: Record<string, {
  label: string
  color: string
  border: string
  bg: string
  bar: string
}> = {
  tournament:  { label: "TOURNAMENT",   color: "text-red-400",    border: "border-red-500/40",    bg: "bg-red-500/10",    bar: "bg-red-500" },
  themed_night:{ label: "THEMED NIGHT", color: "text-purple-400", border: "border-purple-500/40", bg: "bg-purple-500/10", bar: "bg-purple-500" },
  casual:      { label: "CASUAL",       color: "text-emerald-400",border: "border-emerald-500/40",bg: "bg-emerald-500/10",bar: "bg-emerald-500" },
  training:    { label: "TRAINING",     color: "text-yellow-400", border: "border-yellow-500/40", bg: "bg-yellow-500/10", bar: "bg-yellow-500" },
  scrim:       { label: "SCRIM",        color: "text-orange-400", border: "border-orange-500/40", bg: "bg-orange-500/10", bar: "bg-orange-500" },
  clan_battle: { label: "CLAN BATTLE",  color: "text-rose-300",   border: "border-rose-400/40",   bg: "bg-rose-400/10",   bar: "bg-rose-400" },
  other:       { label: "EVENT",        color: "text-slate-400",  border: "border-slate-500/30",  bg: "bg-slate-500/10",  bar: "bg-slate-500" },
}

function getEventTypeInfo(eventType: string) {
  if (EVENT_TYPE_CONFIG[eventType]) return EVENT_TYPE_CONFIG[eventType]
  const label = eventType.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ").toUpperCase()
  return { label, color: "text-blue-400", border: "border-blue-500/40", bg: "bg-blue-500/10", bar: "bg-blue-500" }
}

const RECURRENCE_SHORT: Record<string, string> = {
  weekly: "WEEKLY", biweekly: "BIWEEKLY", monthly: "MONTHLY",
}

function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,3}\s+/gm, "")        // headings
    .replace(/\*\*(.+?)\*\*/g, "$1")    // bold
    .replace(/\*(.+?)\*/g, "$1")        // italic
    .replace(/`(.+?)`/g, "$1")          // inline code
    .replace(/\[(.+?)\]\(.+?\)/g, "$1") // links
    .replace(/^[-*]\s+/gm, "")          // unordered list markers
    .replace(/^\d+\.\s+/gm, "")         // ordered list markers
    .replace(/^>\s*/gm, "")             // blockquotes
    .replace(/```[\s\S]*?```/g, "")     // fenced code blocks
    .replace(/\n+/g, " ")               // collapse newlines
    .trim()
}

// ── Types ──────────────────────────────────────────────────────────────────────

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

// ── EventCard ──────────────────────────────────────────────────────────────────

export function EventCard({ event }: { event: EventSummary }) {
  const typeInfo    = getEventTypeInfo(event.event_type)
  const nextDate    = getNextOccurrence(event)
  const isPast      = nextDate < new Date()
  const msUntil     = nextDate.getTime() - Date.now()
  const daysUntil   = Math.ceil(msUntil / 86_400_000)
  const isToday     = !isPast && daysUntil <= 0
  const isUrgent    = !isPast && daysUntil <= 3 && !isToday
  const [bannerErr, setBannerErr] = useState(false)

  const dayNum  = nextDate.toLocaleDateString("en-GB", { day: "2-digit" })
  const monthYr = nextDate.toLocaleDateString("en-GB", { month: "short", year: "numeric" }).toUpperCase()
  const timeStr = formatLocalTime(nextDate.toISOString(), { hour: "numeric", minute: "2-digit" })

  return (
    <Link href={`/events/${event.event_id}`} className="group block h-full">
      <article className={cn(
        "relative flex flex-col h-full overflow-hidden rounded-xl border bg-[#070b05]",
        "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/40",
        isToday   ? "border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
        : isUrgent? "border-amber-500/30 hover:border-amber-500/50"
        : isPast  ? "border-[#1e2a14] opacity-55"
        :           "border-[#1e2a14] hover:border-[#2d3d1e]"
      )}>

        {/* Type-colored top bar */}
        <div className={cn("h-[3px] w-full shrink-0", typeInfo.bar)} />

        {/* Banner / header area */}
        {event.banner_url && !bannerErr ? (
          <div className="relative h-40 shrink-0 overflow-hidden">
            <img
              src={event.banner_url}
              alt={event.title}
              loading="lazy"
              onError={() => setBannerErr(true)}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b05] via-[#070b05]/50 to-transparent" />
            {/* Type badge on image */}
            <div className="absolute top-2.5 left-2.5">
              <TypeBadge typeInfo={typeInfo} />
            </div>
            {event.recurrence_frequency && (
              <div className="absolute top-2.5 right-2.5">
                <RecurringBadge freq={event.recurrence_frequency} />
              </div>
            )}
          </div>
        ) : (
          /* No-banner fallback with crosshatch texture */
          <div className="relative h-28 shrink-0 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, #060a04 0%, #0a0f06 100%)`,
              backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.012) 8px, rgba(255,255,255,0.012) 9px)"
            }}
          >
            {/* Large faded type label as background text */}
            <div className={cn("absolute inset-0 flex items-center justify-center pointer-events-none select-none")}>
              <span className={cn("font-mono text-5xl font-black opacity-[0.06] tracking-widest", typeInfo.color)}>
                {typeInfo.label.split(" ")[0]}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#070b05] to-transparent" />
            <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
              <TypeBadge typeInfo={typeInfo} />
              {event.recurrence_frequency && <RecurringBadge freq={event.recurrence_frequency} />}
            </div>
          </div>
        )}

        {/* Body */}
        <div className="flex flex-1 flex-col p-4 gap-3">

          {/* Urgency strip */}
          {(isToday || isUrgent) && (
            <div className="flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/8 px-3 py-1.5">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
              </span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-amber-400">
                {isToday ? "OPS ACTIVE — TODAY" : `DEPLOYING IN ${daysUntil} DAY${daysUntil !== 1 ? "S" : ""}`}
              </span>
            </div>
          )}

          {/* Title */}
          <h3 className="font-bold text-sm text-foreground leading-snug line-clamp-2 group-hover:text-amber-400 transition-colors duration-200">
            {event.title}
          </h3>

          {/* Description */}
          {event.description && (
            <p className="text-xs text-muted-foreground/70 line-clamp-2 leading-relaxed border-l border-[#2a3a1a] pl-2.5">
              {stripMarkdown(event.description)}
            </p>
          )}

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {event.tags.slice(0, 3).map((tag, i) => (
                <span key={i} className="inline-flex items-center gap-0.5 font-mono text-[9px] text-muted-foreground/60 bg-[#0d1208] border border-[#1e2a14] px-1.5 py-0.5 rounded">
                  <Hash className="h-2 w-2" />{tag}
                </span>
              ))}
              {event.tags.length > 3 && (
                <span className="font-mono text-[9px] text-muted-foreground/40">+{event.tags.length - 3}</span>
              )}
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Footer */}
          <div className="flex items-end justify-between gap-2 border-t border-[#1e2a14] pt-3">
            {/* Date/time stamp */}
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-xl font-black text-amber-500/90 leading-none tabular-nums">{dayNum}</span>
                <span className="font-mono text-[10px] font-bold text-amber-500/60 uppercase tracking-wider">{monthYr}</span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground/50 tracking-wider">{timeStr}</span>
            </div>

            {/* Attendee count + organizer */}
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1 font-mono text-xs text-muted-foreground/70">
                <Users className="h-3 w-3" />
                <span className="font-bold">{event.going_count}</span>
                {event.maybe_count > 0 && <span className="text-muted-foreground/40 text-[10px]">+{event.maybe_count}</span>}
              </div>
              {(event.org_name || event.organizer_name) && (
                <span className="font-mono text-[9px] text-muted-foreground/40 max-w-[100px] truncate">
                  {event.org_tag ? `[${event.org_tag}] ` : ""}{event.org_name || event.organizer_name}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bottom hover shimmer */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </article>
    </Link>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function TypeBadge({ typeInfo }: { typeInfo: ReturnType<typeof getEventTypeInfo> }) {
  return (
    <span className={cn(
      "font-mono text-[9px] font-bold uppercase tracking-[0.15em] px-2 py-1 rounded border backdrop-blur-sm",
      typeInfo.color, typeInfo.border, typeInfo.bg
    )}>
      {typeInfo.label}
    </span>
  )
}

function RecurringBadge({ freq }: { freq: string }) {
  return (
    <span className="inline-flex items-center gap-1 font-mono text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded border border-blue-500/30 bg-blue-500/10 text-blue-400 backdrop-blur-sm">
      <Repeat className="h-2.5 w-2.5" />
      {RECURRENCE_SHORT[freq] ?? "RECURRING"}
    </span>
  )
}
