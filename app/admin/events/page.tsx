"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Trash2, Calendar } from "lucide-react"
import { deleteEvent } from "@/app/actions/event-actions"
import { useToast } from "@/components/ui/toast-simple"
import Link from "next/link"

interface EventRow {
  event_id: number
  title: string
  event_type: string
  event_date: string
  organizer_name?: string | null
  org_name?: string | null
  going_count: number
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventRow[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  async function fetchEvents() {
    try {
      const res = await fetch("/api/v1/events?limit=100")
      if (res.ok) {
        const data = await res.json()
        if (data.ok) setEvents(data.events)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEvents() }, [])

  async function handleDelete(eventId: number) {
    if (!confirm("Delete this event?")) return
    const res = await deleteEvent(eventId)
    if (res.ok) {
      setEvents(events.filter(e => e.event_id !== eventId))
      toast({ title: "Deleted", variant: "success" })
    } else {
      toast({ title: "Error", description: res.error, variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Calendar className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Events</h1>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : events.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No events</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Organizer</TableHead>
                  <TableHead>RSVPs</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((ev) => (
                  <TableRow key={ev.event_id}>
                    <TableCell className="font-mono text-xs">{ev.event_id}</TableCell>
                    <TableCell>
                      <Link href={`/events/${ev.event_id}`} className="hover:underline text-primary">
                        {ev.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{ev.event_type}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(ev.event_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-xs">
                      {ev.org_name || ev.organizer_name || "-"}
                    </TableCell>
                    <TableCell>{ev.going_count}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(ev.event_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
