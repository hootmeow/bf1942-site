"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, HelpCircle, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { rsvpEvent } from "@/app/actions/event-actions"
import { trackEvent } from "@/lib/analytics"

interface RsvpButtonProps {
  eventId: number
  currentStatus?: string | null
  onStatusChange?: (newStatus: string) => void
}

const STATUSES = [
  { value: "going", label: "Going", icon: Check, activeClass: "bg-green-500/20 text-green-500 border-green-500/30" },
  { value: "maybe", label: "Maybe", icon: HelpCircle, activeClass: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30" },
  { value: "not_going", label: "Can't Go", icon: X, activeClass: "bg-red-500/20 text-red-500 border-red-500/30" },
]

export function RsvpButton({ eventId, currentStatus, onStatusChange }: RsvpButtonProps) {
  const [status, setStatus] = useState(currentStatus || null)
  const [loading, setLoading] = useState(false)

  async function handleRsvp(newStatus: string) {
    setLoading(true)
    try {
      const res = await rsvpEvent(eventId, newStatus)
      if (res.ok) {
        trackEvent("event_rsvp", { event_id: String(eventId), status: res.status! })
        setStatus(res.status === "not_going" ? null : res.status)
        onStatusChange?.(res.status!)
      }
    } catch {
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      {STATUSES.map((s) => {
        const Icon = s.icon
        const isActive = status === s.value
        return (
          <Button
            key={s.value}
            variant="outline"
            size="sm"
            disabled={loading}
            className={cn("gap-1.5", isActive && s.activeClass)}
            onClick={() => handleRsvp(isActive ? "not_going" : s.value)}
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Icon className="h-3.5 w-3.5" />}
            {s.label}
          </Button>
        )
      })}
    </div>
  )
}
