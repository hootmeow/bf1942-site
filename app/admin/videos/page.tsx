"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Trash2, Youtube, Eye, EyeOff, Star, StarOff, ExternalLink, Smartphone } from "lucide-react"
import { getAdminVideos, moderateVideo, deleteVideo } from "@/app/actions/video-actions"
import { useToast } from "@/components/ui/toast-simple"

interface VideoRow {
  video_id: string
  url: string
  title: string
  thumbnail_url: string
  creator_name: string
  upload_date: string
  external_views: number
  like_count?: number
  comment_count?: number
  is_hidden?: boolean
  is_featured?: boolean
  is_short?: boolean
  detected_map?: string | null
  detected_tags?: string[] | null
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showHidden, setShowHidden] = useState(true)
  const [acting, setActing] = useState<string | null>(null)
  const { toast } = useToast()

  async function fetchVideos() {
    setLoading(true)
    try {
      const data = await getAdminVideos(showHidden)
      setVideos(data as VideoRow[])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchVideos() }, [showHidden])

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
      toast({ title: `Video ${action}d`, variant: "success" })
    } catch {
      toast({ title: "Error", description: "Action failed", variant: "destructive" })
    } finally {
      setActing(null)
    }
  }

  async function handleDelete(videoId: string) {
    if (!confirm("Permanently delete this video from the database?")) return
    setActing(videoId)
    try {
      await deleteVideo(videoId)
      setVideos(prev => prev.filter(v => v.video_id !== videoId))
      toast({ title: "Deleted", variant: "success" })
    } catch {
      toast({ title: "Error", description: "Delete failed", variant: "destructive" })
    } finally {
      setActing(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Youtube className="h-6 w-6 text-red-500" />
          <h1 className="text-2xl font-bold">Video Moderation</h1>
          <Badge variant="outline" className="text-xs">{videos.length} videos</Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowHidden(!showHidden)}
        >
          {showHidden ? <EyeOff className="h-4 w-4 mr-1.5" /> : <Eye className="h-4 w-4 mr-1.5" />}
          {showHidden ? "Including Hidden" : "Visible Only"}
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : videos.length === 0 ? (
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
                      <img
                        src={v.thumbnail_url}
                        alt=""
                        className="w-16 h-9 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <a
                          href={v.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium hover:underline line-clamp-1 flex items-center gap-1"
                        >
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
                          {v.detected_tags?.map(t => (
                            <Badge key={t} variant="outline" className="text-[9px] px-1 py-0">{t}</Badge>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{v.creator_name}</TableCell>
                    <TableCell className="text-xs font-mono">{formatCount(v.external_views)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(v.upload_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {v.is_hidden && (
                          <Badge variant="outline" className="text-[9px] bg-red-500/10 text-red-500 border-red-500/20">Hidden</Badge>
                        )}
                        {v.is_featured && (
                          <Badge variant="outline" className="text-[9px] bg-amber-500/10 text-amber-500 border-amber-500/20">Featured</Badge>
                        )}
                        {!v.is_hidden && !v.is_featured && (
                          <span className="text-xs text-muted-foreground">Visible</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          title={v.is_featured ? "Remove from featured" : "Feature this video"}
                          disabled={acting === v.video_id}
                          onClick={() => handleModerate(v.video_id, v.is_featured ? "unfeature" : "feature")}
                        >
                          {v.is_featured
                            ? <StarOff className="h-3.5 w-3.5 text-amber-500" />
                            : <Star className="h-3.5 w-3.5 text-muted-foreground" />
                          }
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          title={v.is_hidden ? "Unhide video" : "Hide video"}
                          disabled={acting === v.video_id}
                          onClick={() => handleModerate(v.video_id, v.is_hidden ? "unhide" : "hide")}
                        >
                          {v.is_hidden
                            ? <Eye className="h-3.5 w-3.5 text-green-500" />
                            : <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                          }
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          title="Delete video permanently"
                          disabled={acting === v.video_id}
                          onClick={() => handleDelete(v.video_id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
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
    </div>
  )
}
