"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/toast-simple"

interface WarStoryEditorProps {
  playerId: number
  onCreated: () => void
}

export function WarStoryEditor({ playerId, onCreated }: WarStoryEditorProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)

    const title = (form.get("title") as string)?.trim()
    if (!title) {
      toast({ title: "Error", description: "Title is required", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/v1/players/${playerId}/war-stories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: (form.get("description") as string)?.trim() || "",
          screenshotUrl: (form.get("screenshotUrl") as string)?.trim() || null,
          roundId: form.get("roundId") ? Number(form.get("roundId")) : null,
        }),
      })

      const data = await res.json()
      if (data.ok) {
        toast({ title: "War Story Created", variant: "success" })
        setOpen(false)
        onCreated()
      } else {
        toast({ title: "Error", description: data.detail || "Failed to create", variant: "destructive" })
      }
    } catch {
      toast({ title: "Error", description: "Network error", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add War Story
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New War Story</DialogTitle>
          <DialogDescription>
            Share a memorable moment from the battlefield.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="ws-title">Title</Label>
            <Input id="ws-title" name="title" placeholder="e.g. My best tank run on El Alamein" maxLength={100} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ws-desc">Description</Label>
            <Textarea id="ws-desc" name="description" placeholder="Tell the story..." maxLength={500} className="resize-none h-24" />
            <p className="text-[0.8rem] text-muted-foreground">Max 500 characters.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ws-screenshot">Screenshot URL</Label>
            <Input id="ws-screenshot" name="screenshotUrl" placeholder="https://i.imgur.com/..." type="url" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ws-round">Linked Round ID (optional)</Label>
            <Input id="ws-round" name="roundId" placeholder="e.g. 12345" type="number" />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
