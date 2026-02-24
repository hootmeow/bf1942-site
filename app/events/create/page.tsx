"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { EventEditor } from "@/components/event-editor"
import { createEvent } from "@/app/actions/event-actions"
import { useToast } from "@/components/ui/toast-simple"
import { Calendar, Loader2, LogIn } from "lucide-react"
import { useSession, signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { trackEvent } from "@/lib/analytics"

export default function CreateEventPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (status === "loading") {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Calendar className="h-12 w-12 text-muted-foreground/50" />
        <p className="text-muted-foreground">You must be logged in to create an event.</p>
        <Button onClick={() => { trackEvent("auth_login", { method: "discord" }); signIn("discord") }} className="gap-2">
          <LogIn className="h-4 w-4" />
          Sign in with Discord
        </Button>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await createEvent(formData)

    if (result.ok) {
      trackEvent("event_create", { event_type: (formData.get("eventType") as string) || "" })
      toast({ title: "Event Created", variant: "success" })
      router.push(`/events/${result.eventId}`)
    } else {
      setError(result.error || "Failed to create")
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Event</h1>
          <p className="text-sm text-muted-foreground">Plan a tournament, game night, or community event</p>
        </div>
      </div>

      <Card className="border-border/60">
        <CardContent className="pt-6">
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <EventEditor loading={loading} />
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
