"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface EventEditorProps {
  initialTitle?: string
  initialDescription?: string
  initialEventType?: string
  initialEventDate?: string
  initialEndDate?: string
  initialBannerUrl?: string
  initialRecurrenceFrequency?: string
  initialRecurrenceEnd?: string
  initialServerId?: string
  initialServerNameManual?: string
  initialTimezone?: string
  loading?: boolean
  submitLabel?: string
}

const EVENT_TYPES = [
  { value: "tournament", label: "Tournament" },
  { value: "themed_night", label: "Themed Night" },
  { value: "casual", label: "Casual" },
  { value: "other", label: "Other" },
]

const RECURRENCE_OPTIONS = [
  { value: "", label: "None (One-time)" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Every 2 Weeks" },
  { value: "monthly", label: "Monthly" },
]

const TIMEZONES = [
  { value: "", label: "Local Time (browser)" },
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "US Eastern" },
  { value: "America/Chicago", label: "US Central" },
  { value: "America/Denver", label: "US Mountain" },
  { value: "America/Los_Angeles", label: "US Pacific" },
  { value: "Europe/London", label: "UK / GMT" },
  { value: "Europe/Berlin", label: "Central Europe" },
  { value: "Europe/Helsinki", label: "Eastern Europe" },
  { value: "Asia/Tokyo", label: "Japan" },
  { value: "Australia/Sydney", label: "Australia Eastern" },
]

interface ServerOption {
  server_id: number
  name: string
}

export function EventEditor({
  initialTitle = "",
  initialDescription = "",
  initialEventType = "casual",
  initialEventDate = "",
  initialEndDate = "",
  initialBannerUrl = "",
  initialRecurrenceFrequency = "",
  initialRecurrenceEnd = "",
  initialServerId = "",
  initialServerNameManual = "",
  initialTimezone = "",
  loading,
  submitLabel = "Create Event",
}: EventEditorProps) {
  const [servers, setServers] = useState<ServerOption[]>([])
  const [serverMode, setServerMode] = useState<"none" | "select" | "manual">(
    initialServerNameManual ? "manual" : initialServerId ? "select" : "none"
  )

  useEffect(() => {
    async function fetchServers() {
      try {
        const res = await fetch("/api/v1/servers?has_rounds=true")
        if (res.ok) {
          const data = await res.json()
          if (data.ok && data.servers) {
            setServers(data.servers.map((s: any) => ({
              server_id: s.server_id,
              name: s.current_server_name || `Server ${s.server_id}`,
            })))
          }
        }
      } catch {}
    }
    fetchServers()
  }, [])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="ev-title">Event Title</Label>
        <Input id="ev-title" name="title" defaultValue={initialTitle} placeholder="e.g. Friday Night Battles" maxLength={200} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ev-type">Event Type</Label>
        <select
          id="ev-type"
          name="eventType"
          defaultValue={initialEventType}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          {EVENT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ev-date">Start Date & Time</Label>
          <Input id="ev-date" name="eventDate" type="datetime-local" defaultValue={initialEventDate} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ev-end">End Date & Time (optional)</Label>
          <Input id="ev-end" name="endDate" type="datetime-local" defaultValue={initialEndDate} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="ev-tz">Timezone</Label>
        <select
          id="ev-tz"
          name="timezone"
          defaultValue={initialTimezone}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz.value} value={tz.value}>{tz.label}</option>
          ))}
        </select>
        <p className="text-[0.8rem] text-muted-foreground">UTC time will always be shown alongside the selected timezone.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ev-recurrence">Repeats</Label>
          <select
            id="ev-recurrence"
            name="recurrenceFrequency"
            defaultValue={initialRecurrenceFrequency}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            {RECURRENCE_OPTIONS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="ev-recurrence-end">Repeat Until (optional)</Label>
          <Input id="ev-recurrence-end" name="recurrenceEnd" type="date" defaultValue={initialRecurrenceEnd} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Server (optional)</Label>
        <div className="flex gap-2">
          <button type="button" onClick={() => setServerMode("none")}
            className={`px-3 py-1.5 text-xs rounded-md border ${serverMode === "none" ? "bg-primary text-primary-foreground border-primary" : "border-input bg-background"}`}>
            None
          </button>
          <button type="button" onClick={() => setServerMode("select")}
            className={`px-3 py-1.5 text-xs rounded-md border ${serverMode === "select" ? "bg-primary text-primary-foreground border-primary" : "border-input bg-background"}`}>
            Select from list
          </button>
          <button type="button" onClick={() => setServerMode("manual")}
            className={`px-3 py-1.5 text-xs rounded-md border ${serverMode === "manual" ? "bg-primary text-primary-foreground border-primary" : "border-input bg-background"}`}>
            Enter manually
          </button>
        </div>
        {serverMode === "select" && (
          <select
            id="ev-server"
            name="serverId"
            defaultValue={initialServerId}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="">Choose a server...</option>
            {servers.map((s) => (
              <option key={s.server_id} value={s.server_id}>{s.name}</option>
            ))}
          </select>
        )}
        {serverMode === "manual" && (
          <Input name="serverNameManual" defaultValue={initialServerNameManual} placeholder="e.g. My Custom Server" maxLength={200} />
        )}
        {serverMode === "none" && (
          <>
            <input type="hidden" name="serverId" value="" />
            <input type="hidden" name="serverNameManual" value="" />
          </>
        )}
        <p className="text-[0.8rem] text-muted-foreground">Tag a tracked server or enter a server name manually.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="ev-desc">Description</Label>
        <Textarea id="ev-desc" name="description" defaultValue={initialDescription} placeholder="What's this event about?" className="resize-none h-24" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ev-banner">Banner Image URL</Label>
        <Input id="ev-banner" name="bannerUrl" defaultValue={initialBannerUrl} placeholder="https://..." type="url" />
      </div>
      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
    </div>
  )
}
