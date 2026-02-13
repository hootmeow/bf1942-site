"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface OrgEditorProps {
  initialName?: string
  initialTag?: string
  initialDescription?: string
  initialBannerUrl?: string
  initialDiscordUrl?: string
  initialWebsiteUrl?: string
  loading?: boolean
  submitLabel?: string
}

export function OrgEditor({
  initialName = "",
  initialTag = "",
  initialDescription = "",
  initialBannerUrl = "",
  initialDiscordUrl = "",
  initialWebsiteUrl = "",
  loading,
  submitLabel = "Create Organization",
}: OrgEditorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="org-name">Organization Name</Label>
        <Input id="org-name" name="name" defaultValue={initialName} placeholder="e.g. Alpha Bravo Company" maxLength={100} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="org-tag">Tag</Label>
        <Input id="org-tag" name="tag" defaultValue={initialTag} placeholder="e.g. [ABC]" maxLength={10} />
        <p className="text-[0.8rem] text-muted-foreground">Short tag for your org. Max 10 chars.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="org-desc">Description</Label>
        <Textarea id="org-desc" name="description" defaultValue={initialDescription} placeholder="Tell others about your organization..." className="resize-none h-24" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="org-discord">Discord Invite URL</Label>
        <Input id="org-discord" name="discordUrl" defaultValue={initialDiscordUrl} placeholder="https://discord.gg/..." type="url" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="org-website">Website URL</Label>
        <Input id="org-website" name="websiteUrl" defaultValue={initialWebsiteUrl} placeholder="https://..." type="url" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="org-banner">Banner Image URL</Label>
        <Input id="org-banner" name="bannerUrl" defaultValue={initialBannerUrl} placeholder="https://..." type="url" />
      </div>
      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
    </div>
  )
}
