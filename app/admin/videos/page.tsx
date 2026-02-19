"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Loader2, Youtube, Eye, EyeOff, Star, StarOff, ExternalLink,
  Smartphone, Ban, ShieldOff, UserX, UserCheck, Shield
} from "lucide-react"
import {
  getAdminVideos, getFeaturedVideos, getBlockedVideos, getBlockedChannels,
  moderateVideo, blockVideo, unblockVideo,
  blockChannel, unblockChannel
} from "@/app/actions/video-actions"
import { useToast } from "@/components/ui/toast-simple"

interface VideoRow {
  video_id: string
  url: string
  title: string
  thumbnail_url: string
  creator_name: string
  creator_id: string
  upload_date: string
  external_views: number
  like_count?: number
  comment_count?: number
  is_hidden?: boolean
  is_featured?: boolean
  is_short?: boolean
  is_blocked?: boolean
  blocked_at?: string | null
  detected_map?: string | null
  detected_tags?: string[] | null
  featured_at?: string | null
}

interface BlockedChannel {
  channel_id: string
  channel_name: string
  blocked_at: string | null
  video_count: number
}

type Tab = "videos" | "featured" | "blocked" | "channels"

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

export default function AdminVideosPage() {
  const [tab, setTab] = useState<Tab>("videos")
  const [videos, setVideos] = useState<VideoRow[]>([])
  const [featuredVideos, setFeaturedVideos] = useState<VideoRow[]>([])
  const [blockedVideos, setBlockedVideos] = useState<VideoRow[]>([])
  const [blockedChannels, setBlockedChannels] = useState<BlockedChannel[]>([])
  const [loading, setLoading] = useState(true)
  const [showHidden, setShowHidden] = useState(true)
  const [acting, setActing] = useState<string | null>(null)
  const { toast } = useToast()

  async function fetchData() {
    setLoading(true)
    try {
      if (tab === "videos") {
        const data = await getAdminVideos(showHidden)
        setVideos(data as VideoRow[])
      } else if (tab === "featured") {
        const data = await getFeaturedVideos()
        setFeaturedVideos(data as VideoRow[])
      } else if (tab === "blocked") {
        const data = await getBlockedVideos()
        setBlockedVideos(data as VideoRow[])
      } else if (tab === "channels") {
        const data = await getBlockedChannels()
        setBlockedChannels(data as BlockedChannel[])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [tab, showHidden])

  async function handleModerate(videoId: string, action: "hide" | "unhide" | "feature" | "unfeature") {
    setActing(videoId)
    try {
      await moderateVideo(videoId, action)
      setVideos(prev => prev.map(v => {
        if (v.video_id !== videoId) return v
        if (action === "hide") return { ...v, is_hidden: true }
        if (action === "unhide") return { ...v, is_hidden: false }
        if (action === "feature") return { ...v, is_featured: true }
        if (action === "unfeature") return { ...v, is_featured: false }
        return v
      }))
      if (action === "unfeature") {
        setFeaturedVideos(prev => prev.filter(v => v.video_id !== videoId))
      }
      toast({ title: `Video ${action}d`, variant: "success" })
    } catch {
      toast({ title: "Error", description: "Action failed", variant: "destructive" })
    } finally {
      setActing(null)
    }
  }

  async function handleBlock(videoId: string) {
    if (!confirm("Block this video permanently? It won't come back on re-sync.")) return
    setActing(videoId)
    try {
      await blockVideo(videoId)
      setVideos(prev => prev.filter(v => v.video_id !== videoId))
      toast({ title: "Video blocked permanently", variant: "success" })
    } catch {
      toast({ title: "Error", description: "Block failed", variant: "destructive" })
    } finally {
      setActing(null)
    }
  }

  async function handleUnblock(videoId: string) {
    setActing(videoId)
    try {
      await unblockVideo(videoId)
      setBlockedVideos(prev => prev.filter(v => v.video_id !== videoId))
      toast({ title: "Video unblocked", variant: "success" })
    } catch {
      toast({ title: "Error", variant: "destructive" })
    } finally {
      setActing(null)
    }
  }

  async function handleBlockChannel(channelId: string, channelName: string) {
    if (!confirm(`Block all videos from "${channelName}"? This hides all their content and prevents re-sync.`)) return
    setActing(channelId)
    try {
      await blockChannel(channelId, channelName)
      setVideos(prev => prev.filter(v => v.creator_id !== channelId))
      toast({ title: `Channel "${channelName}" blocked`, variant: "success" })
    } catch {
      toast({ title: "Error", variant: "destructive" })
    } finally {
      setActing(null)
    }
  }

  async function handleUnblockChannel(channelId: string) {
    setActing(channelId)
    try {
      await unblockChannel(channelId)
      setBlockedChannels(prev => prev.filter(c => c.channel_id !== channelId))
      toast({ title: "Channel unblocked", variant: "success" })
    } catch {
      toast({ title: "Error", variant: "destructive" })
    } finally {
      setActing(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Youtube className="h-6 w-6 text-red-500" />
        <h1 className="text-2xl font-bold">Video Moderation</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button variant={tab === "videos" ? "default" : "outline"} size="sm" onClick={() => setTab("videos")}>
          <Youtube className="h-3.5 w-3.5 mr-1.5" />
          Videos
        </Button>
        <Button variant={tab === "featured" ? "default" : "outline"} size="sm" onClick={() => setTab("featured")}>
          <Star className="h-3.5 w-3.5 mr-1.5" />
          Featured
        </Button>
        <Button variant={tab === "blocked" ? "default" : "outline"} size="sm" onClick={() => setTab("blocked")}>
          <Ban className="h-3.5 w-3.5 mr-1.5" />
          Blocked Videos
        </Button>
        <Button variant={tab === "channels" ? "default" : "outline"} size="sm" onClick={() => setTab("channels")}>
          <UserX className="h-3.5 w-3.5 mr-1.5" />
          Blocked Channels
        </Button>
        {tab === "videos" && (
          <>
            <div className="h-4 w-px bg-border/60 self-center" />
            <Button variant="outline" size="sm" onClick={() => setShowHidden(!showHidden)}>
              {showHidden ? <EyeOff className="h-3.5 w-3.5 mr-1.5" /> : <Eye className="h-3.5 w-3.5 mr-1.5" />}
              {showHidden ? "Including Hidden" : "Visible Only"}
            </Button>
          </>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : tab === "videos" ? (
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {videos.length} videos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {videos.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No videos found</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Thumb</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {videos.map((v) => (
                    <TableRow key={v.video_id} className={v.is_hidden ? "opacity-50" : ""}>
                      <TableCell>
                        <img src={v.thumbnail_url} alt="" className="w-16 h-9 object-cover rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <a href={v.url} target="_blank" rel="noopener noreferrer"
                            className="text-sm font-medium hover:underline line-clamp-1 flex items-center gap-1">
                            {v.title}
                            <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
                          </a>
                          <div className="flex gap-1 mt-0.5">
                            {v.is_short && (
                              <Badge variant="outline" className="text-[9px] px-1 py-0 bg-red-500/10 text-red-500 border-red-500/20">
                                <Smartphone className="h-2.5 w-2.5 mr-0.5" />Short
                              </Badge>
                            )}
                            {v.detected_map && (
                              <Badge variant="outline" className="text-[9px] px-1 py-0">{v.detected_map}</Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-xs">{v.creator_name}</span>
                          <Button
                            variant="ghost" size="icon" className="h-5 w-5"
                            title={`Block channel: ${v.creator_name}`}
                            disabled={acting === v.creator_id}
                            onClick={() => handleBlockChannel(v.creator_id, v.creator_name)}
                          >
                            <UserX className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-mono">{formatCount(v.external_views)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(v.upload_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {v.is_hidden && <Badge variant="outline" className="text-[9px] bg-red-500/10 text-red-500 border-red-500/20">Hidden</Badge>}
                          {v.is_featured && <Badge variant="outline" className="text-[9px] bg-amber-500/10 text-amber-500 border-amber-500/20">Featured</Badge>}
                          {!v.is_hidden && !v.is_featured && <span className="text-xs text-muted-foreground">Visible</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-0.5">
                          <Button variant="ghost" size="icon" className="h-7 w-7"
                            title={v.is_featured ? "Unfeature" : "Feature"}
                            disabled={acting === v.video_id}
                            onClick={() => handleModerate(v.video_id, v.is_featured ? "unfeature" : "feature")}>
                            {v.is_featured ? <StarOff className="h-3.5 w-3.5 text-amber-500" /> : <Star className="h-3.5 w-3.5 text-muted-foreground" />}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7"
                            title={v.is_hidden ? "Unhide" : "Hide"}
                            disabled={acting === v.video_id}
                            onClick={() => handleModerate(v.video_id, v.is_hidden ? "unhide" : "hide")}>
                            {v.is_hidden ? <Eye className="h-3.5 w-3.5 text-green-500" /> : <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"
                            title="Block permanently"
                            disabled={acting === v.video_id}
                            onClick={() => handleBlock(v.video_id)}>
                            <Ban className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      ) : tab === "featured" ? (
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {featuredVideos.length} featured videos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {featuredVideos.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No featured videos</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Thumb</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {featuredVideos.map((v) => (
                    <TableRow key={v.video_id}>
                      <TableCell>
                        <img src={v.thumbnail_url} alt="" className="w-16 h-9 object-cover rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <a href={v.url} target="_blank" rel="noopener noreferrer"
                            className="text-sm font-medium hover:underline line-clamp-1 flex items-center gap-1">
                            {v.title}
                            <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
                          </a>
                          <div className="flex gap-1 mt-0.5">
                            {v.is_short && (
                              <Badge variant="outline" className="text-[9px] px-1 py-0 bg-red-500/10 text-red-500 border-red-500/20">
                                <Smartphone className="h-2.5 w-2.5 mr-0.5" />Short
                              </Badge>
                            )}
                            {v.detected_map && (
                              <Badge variant="outline" className="text-[9px] px-1 py-0">{v.detected_map}</Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">{v.creator_name}</TableCell>
                      <TableCell className="text-xs font-mono">{formatCount(v.external_views)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {v.featured_at ? new Date(v.featured_at).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <Button variant="outline" size="sm" className="h-7 gap-1 text-xs"
                            disabled={acting === v.video_id}
                            onClick={() => handleModerate(v.video_id, "unfeature")}>
                            <StarOff className="h-3 w-3 text-amber-500" /> Unfeature
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      ) : tab === "blocked" ? (
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {blockedVideos.length} blocked videos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {blockedVideos.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No blocked videos</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Thumb</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Blocked</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blockedVideos.map((v) => (
                    <TableRow key={v.video_id} className="opacity-60">
                      <TableCell>
                        <img src={v.thumbnail_url} alt="" className="w-16 h-9 object-cover rounded" />
                      </TableCell>
                      <TableCell>
                        <a href={v.url} target="_blank" rel="noopener noreferrer"
                          className="text-sm hover:underline line-clamp-1 flex items-center gap-1">
                          {v.title}
                          <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
                        </a>
                      </TableCell>
                      <TableCell className="text-xs">{v.creator_name}</TableCell>
                      <TableCell className="text-xs font-mono">{formatCount(v.external_views)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {v.blocked_at ? new Date(v.blocked_at).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <Button variant="outline" size="sm" className="h-7 gap-1 text-xs"
                            disabled={acting === v.video_id}
                            onClick={() => handleUnblock(v.video_id)}>
                            <ShieldOff className="h-3 w-3" /> Unblock
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {blockedChannels.length} blocked channels
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {blockedChannels.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No blocked channels</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Channel</TableHead>
                    <TableHead>Videos</TableHead>
                    <TableHead>Blocked</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blockedChannels.map((ch) => (
                    <TableRow key={ch.channel_id}>
                      <TableCell>
                        <div>
                          <span className="text-sm font-medium">{ch.channel_name}</span>
                          <a href={`https://www.youtube.com/channel/${ch.channel_id}`}
                            target="_blank" rel="noopener noreferrer"
                            className="text-[10px] text-muted-foreground ml-2 hover:underline">
                            YouTube
                            <ExternalLink className="h-2.5 w-2.5 inline ml-0.5" />
                          </a>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-mono">{ch.video_count}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {ch.blocked_at ? new Date(ch.blocked_at).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <Button variant="outline" size="sm" className="h-7 gap-1 text-xs"
                            disabled={acting === ch.channel_id}
                            onClick={() => handleUnblockChannel(ch.channel_id)}>
                            <UserCheck className="h-3 w-3" /> Unblock
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
