"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RsvpButton } from "@/components/rsvp-button"
import { EventEditor } from "@/components/event-editor"
import { Loader2, AlertTriangle, Calendar, Clock, User, Users, Trash2, Pencil, X, Server, Globe, CalendarClock, Hash, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { deleteEvent, updateEvent } from "@/app/actions/event-actions"
import { getNextOccurrence } from "@/lib/event-utils"
import { getIsAdmin } from "@/app/actions/admin-actions"
import { useToast } from "@/components/ui/toast-simple"
import { trackEvent } from "@/lib/analytics"

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

interface EventDetail {
  event_id: number
  title: string
  description?: string | null
  event_type: string
  event_date: string
  end_date?: string | null
  banner_url?: string | null
  organizer_user_id: string
  organizer_name?: string | null
  organizer_image?: string | null
  org_name?: string | null
  org_tag?: string | null
  organizer_org_id?: number | null
  recurrence_frequency?: string | null
  recurrence_end?: string | null
  server_id?: number | null
  server_name?: string | null
  server_name_manual?: string | null
  timezone?: string | null
  tags?: string[] | null
  discord_link?: string | null
}

interface Rsvp {
  user_id: string
  name: string
  image?: string | null
  status: string
  responded_at: string
}

function toLocalDatetimeValue(iso: string) {
  const d = new Date(iso)
  const offset = d.getTimezoneOffset()
  const local = new Date(d.getTime() - offset * 60000)
  return local.toISOString().slice(0, 16)
}

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = Number(params.id)
  const { data: session } = useSession()
  const { toast } = useToast()

  const [event, setEvent] = useState<EventDetail | null>(null)
  const [rsvps, setRsvps] = useState<Rsvp[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  const currentUserId = session?.user?.id

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/v1/events/${eventId}`)
        if (res.ok) {
          const data = await res.json()
          if (data.ok) {
            setEvent(data.event)
            setRsvps(data.rsvps)
            trackEvent("event_view", { event_id: String(eventId) })
          } else {
            setError("Event not found")
          }
        } else {
          setError("Failed to load event")
        }
      } catch {
        setError("Network error")
      } finally {
        setLoading(false)
      }
    }
    if (eventId) fetchEvent()
  }, [eventId])

  useEffect(() => {
    if (currentUserId) {
      getIsAdmin().then(setIsAdmin)
    }
  }, [currentUserId])

  const isOrganizer = event && String(event.organizer_user_id) === currentUserId
  const canEdit = isOrganizer || isAdmin
  const myRsvp = rsvps.find(r => String(r.user_id) === currentUserId)
  const goingList = rsvps.filter(r => r.status === "going")
  const maybeList = rsvps.filter(r => r.status === "maybe")

  async function handleDelete() {
    if (!confirm("Delete this event?")) return
    const res = await deleteEvent(eventId)
    if (res.ok) {
      toast({ title: "Event Deleted", variant: "success" })
      router.push("/events")
    } else {
      toast({ title: "Error", description: res.error, variant: "destructive" })
    }
  }

  async function handleEditSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setEditLoading(true)
    const formData = new FormData(e.currentTarget)
    const res = await updateEvent(eventId, formData)
    if (res.ok) {
      toast({ title: "Event Updated", variant: "success" })
      setEditing(false)
      const tagsStr = (formData.get("tags") as string)?.trim()
      const tags = tagsStr ? tagsStr.split(",").map(t => t.trim()).filter(Boolean) : null
      setEvent({
        ...event!,
        title: (formData.get("title") as string)?.trim() || event!.title,
        description: (formData.get("description") as string)?.trim() || null,
        event_type: (formData.get("eventType") as string) || event!.event_type,
        event_date: (formData.get("eventDate") as string) || event!.event_date,
        end_date: (formData.get("endDate") as string) || null,
        banner_url: (formData.get("bannerUrl") as string)?.trim() || null,
        recurrence_frequency: (formData.get("recurrenceFrequency") as string) || null,
        recurrence_end: (formData.get("recurrenceEnd") as string) || null,
        server_id: formData.get("serverId") ? Number(formData.get("serverId")) : null,
        server_name_manual: (formData.get("serverNameManual") as string)?.trim() || null,
        timezone: (formData.get("timezone") as string) || null,
        tags,
        discord_link: (formData.get("discordLink") as string)?.trim() || null,
      })
    } else {
      toast({ title: "Error", description: res.error, variant: "destructive" })
    }
    setEditLoading(false)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading event details...</p>
      </div>
    )
  }

  if (error || !event) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error || "Event not found"}</AlertDescription>
      </Alert>
    )
  }

  const typeInfo = getEventTypeInfo(event.event_type)
  const date = new Date(event.event_date)
  const nextDate = getNextOccurrence(event)
  const isPast = nextDate < new Date()

  const RECURRENCE_LABELS: Record<string, string> = {
    weekly: "Weekly",
    biweekly: "Every 2 Weeks",
    monthly: "Monthly",
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Banner */}
      {event.banner_url && !editing && (
        <div className="rounded-xl overflow-hidden border border-border/60 bg-muted/30">
          <img src={event.banner_url} alt="" className="w-full max-h-80 object-contain" />
        </div>
      )}

      {/* Edit mode */}
      {editing ? (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle as="h2" className="flex items-center justify-between">
              <span>Edit Event</span>
              <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEditSubmit}>
              <EventEditor
                initialTitle={event.title}
                initialDescription={event.description || ""}
                initialEventType={event.event_type}
                initialEventDate={event.event_date ? toLocalDatetimeValue(event.event_date) : ""}
                initialEndDate={event.end_date ? toLocalDatetimeValue(event.end_date) : ""}
                initialBannerUrl={event.banner_url || ""}
                initialRecurrenceFrequency={event.recurrence_frequency || ""}
                initialRecurrenceEnd={event.recurrence_end ? toLocalDatetimeValue(event.recurrence_end).slice(0, 10) : ""}
                initialServerId={event.server_id ? String(event.server_id) : ""}
                initialServerNameManual={event.server_name_manual || ""}
                initialTimezone={event.timezone || ""}
                initialTags={event.tags || []}
                initialDiscordLink={event.discord_link || ""}
                loading={editLoading}
                submitLabel="Save Changes"
              />
            </form>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={typeInfo.color}>{typeInfo.label}</Badge>
                {isPast && <Badge variant="secondary">Past Event</Badge>}
                {event.recurrence_frequency && (
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                    {RECURRENCE_LABELS[event.recurrence_frequency] || event.recurrence_frequency}
                  </Badge>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{event.title}</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  A {typeInfo.label} on{" "}
                  {event.timezone
                    ? date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: event.timezone })
                    : date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
              {event.tags && event.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {event.tags.map((tag, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 text-xs bg-muted/50 text-muted-foreground px-2 py-1 rounded-md border border-border/40">
                      <Hash className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {event.description && (
                <blockquote className="border-l-2 border-primary/30 pl-4 text-sm text-muted-foreground whitespace-pre-wrap">
                  {event.description}
                </blockquote>
              )}
              {event.discord_link && (
                <a
                  href={event.discord_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  Join on Discord
                </a>
              )}
            </div>
            {canEdit && (
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="sm" className="gap-2" onClick={() => setEditing(true)}>
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" className="gap-2" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Details card */}
      <Card className="border-border/60">
        <CardContent className="p-4 space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span>
                {event.timezone
                  ? date.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: event.timezone })
                  : date.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                {" at "}
                {event.timezone
                  ? date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", timeZone: event.timezone, timeZoneName: "short" })
                  : date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground ml-6">
              <Globe className="h-3 w-3" />
              <span>
                {date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", timeZone: "UTC" })} UTC
                {event.timezone && event.timezone !== "UTC" && (
                  <> &middot; {date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })} your time</>
                )}
              </span>
            </div>
          </div>
          {event.end_date && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Ends: {new Date(event.end_date).toLocaleString()}</span>
            </div>
          )}
          {event.recurrence_frequency && (
            <>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Repeats {RECURRENCE_LABELS[event.recurrence_frequency]?.toLowerCase() || event.recurrence_frequency}
                  {event.recurrence_end && <> until {new Date(event.recurrence_end).toLocaleDateString()}</>}
                </span>
              </div>
              {!isPast && nextDate.getTime() !== date.getTime() && (
                <div className="flex items-center gap-2 text-sm">
                  <CalendarClock className="h-4 w-4 text-primary" />
                  <span>
                    Next occurrence:{" "}
                    {nextDate.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    {" at "}
                    {nextDate.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              )}
            </>
          )}
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>
              Organized by{" "}
              {event.org_tag && <span className="font-bold text-primary">{event.org_tag} </span>}
              {event.org_name || event.organizer_name || "Unknown"}
            </span>
          </div>
          {(event.server_name || event.server_name_manual) && (
            <div className="flex items-center gap-2 text-sm">
              <Server className="h-4 w-4 text-muted-foreground" />
              <span>
                Server:{" "}
                {event.server_name ? (
                  <Link href={`/servers/${event.server_id}`} className="text-primary hover:underline">
                    {event.server_name}
                  </Link>
                ) : (
                  event.server_name_manual
                )}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* RSVP */}
      {currentUserId && !isPast && (
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle as="h2" className="text-base">Your RSVP</CardTitle>
          </CardHeader>
          <CardContent>
            <RsvpButton eventId={eventId} currentStatus={myRsvp?.status} />
          </CardContent>
        </Card>
      )}

      {/* Attendees */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle as="h2" className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Attendees ({goingList.length}{maybeList.length > 0 ? ` + ${maybeList.length} maybe` : ""})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {goingList.length === 0 && maybeList.length === 0 ? (
            <p className="text-sm text-muted-foreground">No RSVPs yet. Be the first!</p>
          ) : (
            <div className="space-y-4">
              {goingList.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-green-500 uppercase mb-2">Going ({goingList.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {goingList.map((r) => (
                      <div key={r.user_id} className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-1.5">
                        <Avatar className="h-6 w-6">
                          {r.image && <AvatarImage src={r.image} />}
                          <AvatarFallback className="text-[10px]">{r.name?.[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{r.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {maybeList.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-yellow-500 uppercase mb-2">Maybe ({maybeList.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {maybeList.map((r) => (
                      <div key={r.user_id} className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-1.5 opacity-70">
                        <Avatar className="h-6 w-6">
                          {r.image && <AvatarImage src={r.image} />}
                          <AvatarFallback className="text-[10px]">{r.name?.[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{r.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
