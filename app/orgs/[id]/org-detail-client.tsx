"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { OrgRoster } from "@/components/org-roster"
import { OrgEditor } from "@/components/org-editor"
import { Loader2, AlertTriangle, Users, Trophy, Target, Skull, Star, Trash2, Globe, ExternalLink, Pencil, X } from "lucide-react"
import { useSession } from "next-auth/react"
import { deleteOrganization, removeMember, updateMemberRole, updateOrganization } from "@/app/actions/org-actions"
import { getIsAdmin } from "@/app/actions/admin-actions"
import { useToast } from "@/components/ui/toast-simple"
import Link from "next/link"
import { trackEvent } from "@/lib/analytics"

interface Org {
  org_id: number
  name: string
  tag?: string | null
  description?: string | null
  banner_url?: string | null
  discord_url?: string | null
  website_url?: string | null
  created_by: string
  creator_name?: string | null
  created_at: string
}

interface Member {
  user_id: string
  name: string
  image?: string | null
  role: string
  joined_at: string
}

interface OrgStats {
  total_players: number
  total_kills: number
  total_deaths: number
  total_score: number
  total_rounds: number
  org_kdr: number
}

interface DetectedPlayer {
  player_id: number
  name: string
  last_seen: string
  score: number
  kills: number
  deaths: number
  kdr: number | null
}

interface ClanSearchData {
  ok: boolean
  tag: string
  stats: {
    member_count: number
    total_score: number
    total_kills: number
    total_deaths: number
    kdr: number
  }
  roster: DetectedPlayer[]
}

export default function OrgDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orgId = Number(params.id)
  const { data: session } = useSession()
  const { toast } = useToast()

  const [org, setOrg] = useState<Org | null>(null)
  const [roster, setRoster] = useState<Member[]>([])
  const [stats, setStats] = useState<OrgStats | null>(null)
  const [detectedData, setDetectedData] = useState<ClanSearchData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  const currentUserId = session?.user?.id

  useEffect(() => {
    async function fetchOrg() {
      try {
        const [orgRes, statsRes] = await Promise.all([
          fetch(`/api/v1/orgs/${orgId}`),
          fetch(`/api/v1/orgs/${orgId}/stats`),
        ])

        if (orgRes.ok) {
          const orgData = await orgRes.json()
          if (orgData.ok) {
            setOrg(orgData.organization)
            setRoster(orgData.roster)
            trackEvent("org_view", { org_id: String(orgId) })

            const tag = orgData.organization.tag
            if (tag) {
              const cleanTag = tag.replace(/^\[|\]$/g, "")
              if (cleanTag.length >= 2) {
                try {
                  const clanRes = await fetch(`/api/v1/clans/search?tag=${encodeURIComponent(cleanTag)}`)
                  if (clanRes.ok) {
                    const clanData = await clanRes.json()
                    if (clanData.ok) setDetectedData(clanData)
                  }
                } catch {}
              }
            }
          } else {
            setError("Organization not found")
          }
        } else {
          setError("Failed to load organization")
        }

        if (statsRes.ok) {
          const statsData = await statsRes.json()
          if (statsData.ok) setStats(statsData.stats)
        }
      } catch {
        setError("Network error")
      } finally {
        setLoading(false)
      }
    }
    if (orgId) fetchOrg()
  }, [orgId])

  useEffect(() => {
    if (currentUserId) {
      getIsAdmin().then(setIsAdmin)
    }
  }, [currentUserId])

  const isLeader = roster.some(m => String(m.user_id) === currentUserId && m.role === "leader")
  const canEdit = isLeader || isAdmin

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this organization?")) return
    const res = await deleteOrganization(orgId)
    if (res.ok) {
      toast({ title: "Organization Deleted", variant: "success" })
      router.push("/orgs")
    } else {
      toast({ title: "Error", description: res.error, variant: "destructive" })
    }
  }

  async function handleEditSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setEditLoading(true)
    const formData = new FormData(e.currentTarget)
    const res = await updateOrganization(orgId, formData)
    if (res.ok) {
      toast({ title: "Organization Updated", variant: "success" })
      setEditing(false)
      setOrg({
        ...org!,
        name: (formData.get("name") as string)?.trim() || org!.name,
        tag: (formData.get("tag") as string)?.trim() || null,
        description: (formData.get("description") as string)?.trim() || null,
        banner_url: (formData.get("bannerUrl") as string)?.trim() || null,
        discord_url: (formData.get("discordUrl") as string)?.trim() || null,
        website_url: (formData.get("websiteUrl") as string)?.trim() || null,
      })
    } else {
      toast({ title: "Error", description: res.error, variant: "destructive" })
    }
    setEditLoading(false)
  }

  async function handleRemoveMember(userId: string) {
    const res = await removeMember(orgId, userId)
    if (res.ok) {
      setRoster(roster.filter(m => String(m.user_id) !== String(userId)))
      toast({ title: "Member removed", variant: "success" })
    }
  }

  async function handleChangeRole(userId: string, newRole: string) {
    const res = await updateMemberRole(orgId, userId, newRole)
    if (res.ok) {
      setRoster(roster.map(m => String(m.user_id) === String(userId) ? { ...m, role: newRole } : m))
      toast({ title: "Role updated", variant: "success" })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !org) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error || "Organization not found"}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      {org.banner_url && !editing && (
        <div className="h-48 rounded-xl overflow-hidden border border-border/60">
          <img src={org.banner_url} alt="" className="h-full w-full object-cover" />
        </div>
      )}

      {/* Edit mode */}
      {editing ? (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle as="h2" className="flex items-center justify-between">
              <span>Edit Organization</span>
              <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEditSubmit}>
              <OrgEditor
                initialName={org.name}
                initialTag={org.tag || ""}
                initialDescription={org.description || ""}
                initialBannerUrl={org.banner_url || ""}
                initialDiscordUrl={org.discord_url || ""}
                initialWebsiteUrl={org.website_url || ""}
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
            <div>
              <div className="flex items-center gap-3">
                {org.tag && <span className="text-lg font-bold text-primary">{org.tag}</span>}
                <h1 className="text-2xl font-bold tracking-tight">{org.name}</h1>
              </div>
              {org.description && (
                <p className="mt-2 text-sm text-muted-foreground max-w-2xl">{org.description}</p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span>Created {new Date(org.created_at).toLocaleDateString()}{org.creator_name && <> by {org.creator_name}</>}</span>
                {org.discord_url && (
                  <a href={org.discord_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors">
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 1-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.315-9.673-3.546-13.66a.07.07 0 0 0-.031-.03z" /></svg>
                    Discord
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {org.website_url && (
                  <a href={org.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors">
                    <Globe className="h-3.5 w-3.5" />
                    Website
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
            {canEdit && (
              <div className="flex gap-2">
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

      {/* Auto-detected stats from tag */}
      {detectedData && detectedData.stats && detectedData.stats.member_count > 0 && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <Card className="border-border/60 bg-card/40">
            <CardContent className="p-4 text-center">
              <Users className="h-4 w-4 text-primary mx-auto mb-1" />
              <div className="text-2xl font-bold tabular-nums">{detectedData.stats.member_count}</div>
              <div className="text-[10px] text-muted-foreground uppercase">Detected Players</div>
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-card/40">
            <CardContent className="p-4 text-center">
              <Star className="h-4 w-4 text-amber-500 mx-auto mb-1" />
              <div className="text-2xl font-bold tabular-nums">{(detectedData.stats.total_score ?? 0).toLocaleString()}</div>
              <div className="text-[10px] text-muted-foreground uppercase">Total Score</div>
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-card/40">
            <CardContent className="p-4 text-center">
              <Target className="h-4 w-4 text-red-500 mx-auto mb-1" />
              <div className="text-2xl font-bold tabular-nums">{(detectedData.stats.total_kills ?? 0).toLocaleString()}</div>
              <div className="text-[10px] text-muted-foreground uppercase">Total Kills</div>
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-card/40">
            <CardContent className="p-4 text-center">
              <Skull className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
              <div className="text-2xl font-bold tabular-nums">{(detectedData.stats.total_deaths ?? 0).toLocaleString()}</div>
              <div className="text-[10px] text-muted-foreground uppercase">Total Deaths</div>
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-card/40">
            <CardContent className="p-4 text-center">
              <Trophy className="h-4 w-4 text-emerald-500 mx-auto mb-1" />
              <div className="text-2xl font-bold tabular-nums">{detectedData.stats.kdr ?? "0.00"}</div>
              <div className="text-[10px] text-muted-foreground uppercase">Unit K/D</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Members (registered users) */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle as="h2" className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Members ({roster.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {roster.length > 0 ? (
            <OrgRoster
              roster={roster}
              isLeader={isLeader}
              currentUserId={currentUserId}
              onRemove={handleRemoveMember}
              onChangeRole={handleChangeRole}
            />
          ) : (
            <p className="text-sm text-muted-foreground">No registered members yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Auto-detected roster from tag search */}
      {detectedData && detectedData.roster && detectedData.roster.length > 0 && (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle as="h2" className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-muted-foreground" />
              Detected Players
              <span className="text-xs font-normal text-muted-foreground">
                (auto-detected from in-game tag &quot;{org.tag}&quot;)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Player</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Kills</TableHead>
                  <TableHead className="text-right">K/D</TableHead>
                  <TableHead className="text-right">Last Seen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detectedData.roster.map((player) => (
                  <TableRow key={player.player_id}>
                    <TableCell>
                      <Link href={`/player/${encodeURIComponent(player.name)}`} className="font-medium hover:underline text-primary">
                        {player.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{player.score.toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums">{player.kills.toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {player.kdr !== null && player.kdr !== undefined ? player.kdr.toFixed(2) : "N/A"}
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {new Date(player.last_seen).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
