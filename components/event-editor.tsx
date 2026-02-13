"use client"

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
  loading?: boolean
  submitLabel?: string
}

const EVENT_TYPES = [
  { value: "tournament", label: "Tournament" },
  { value: "themed_night", label: "Themed Night" },
  { value: "casual", label: "Casual" },
  { value: "other", label: "Other" },
]

export function EventEditor({
  initialTitle = "",
  initialDescription = "",
  initialEventType = "casual",
  initialEventDate = "",
  initialEndDate = "",
  initialBannerUrl = "",
  loading,
  submitLabel = "Create Event",
}: EventEditorProps) {
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
