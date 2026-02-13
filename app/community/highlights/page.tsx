"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Play, Eye, Clock, Youtube, Filter } from "lucide-react"

interface CommunityVideo {
  video_id: string
  title: string
  thumbnail_url: string
  creator_name: string
  creator_id: string
  creator_avatar_url?: string | null
  upload_date: string
  external_views: number
  duration_seconds: number
  detected_map?: string | null
  detected_tags?: string[] | null
}

const TAG_COLORS: Record<string, string> = {
  montage: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  tutorial: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  funny: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  clutch: "bg-red-500/10 text-red-500 border-red-500/20",
  sniper: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  tank: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  planes: "bg-sky-500/10 text-sky-500 border-sky-500/20",
  nostalgia: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  livestream: "bg-red-600/10 text-red-600 border-red-600/20",
}

function formatDuration(seconds: number): string {
  if (seconds <= 0) return ""
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  return `${m}:${String(s).padStart(2, "0")}`
}

function formatViews(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`
  return String(views)
}

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return `${Math.floor(days / 30)} months ago`
}

const TIME_FILTERS = [
  { value: "7", label: "Last 7 Days" },
  { value: "30", label: "Last 30 Days" },
  { value: "all", label: "All Time" },
]

export default function HighlightsPage() {
  const [videos, setVideos] = useState<CommunityVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30")
  const [mapFilter, setMapFilter] = useState("")
  const [maps, setMaps] = useState<string[]>([])
  const [playingId, setPlayingId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchVideos() {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (timeRange !== "all") params.set("days", timeRange)
        if (mapFilter) params.set("map", mapFilter)
        const res = await fetch(`/api/v1/community/videos?${params}`)
        if (res.ok) {
          const data = await res.json()
          if (data.ok) {
            setVideos(data.videos)
            if (data.maps) setMaps(data.maps)
          }
        }
      } catch (e) {
        console.error("Failed to fetch videos:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchVideos()
  }, [timeRange, mapFilter])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-500/10">
            <Youtube className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Community Highlights</h1>
            <p className="text-sm text-muted-foreground">The best BF1942 content from the community</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1.5">
          {TIME_FILTERS.map((f) => (
            <Button
              key={f.value}
              variant={timeRange === f.value ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>
        {maps.length > 0 && (
          <select
            value={mapFilter}
            onChange={(e) => setMapFilter(e.target.value)}
            className="flex h-8 rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="">All Maps</option>
            {maps.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        )}
      </div>

      {/* Video Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-12">
          <Youtube className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-muted-foreground">No videos found</p>
          <p className="text-xs text-muted-foreground mt-1">Videos are synced automatically every 6 hours</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <Card key={video.video_id} className="border-border/60 bg-card/40 overflow-hidden">
              {/* Thumbnail / Player */}
              <div className="relative aspect-video bg-muted/30">
                {playingId === video.video_id ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${video.video_id}?autoplay=1`}
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                ) : (
                  <button
                    className="relative w-full h-full group"
                    onClick={() => setPlayingId(video.video_id)}
                  >
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                      <div className="rounded-full bg-red-600/90 p-3 group-hover:scale-110 transition-transform">
                        <Play className="h-6 w-6 text-white fill-white" />
                      </div>
                    </div>
                    {video.duration_seconds > 0 && (
                      <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                        {formatDuration(video.duration_seconds)}
                      </span>
                    )}
                  </button>
                )}
              </div>

              <CardContent className="p-3">
                <div className="flex gap-2">
                  {video.creator_avatar_url && (
                    <img
                      src={video.creator_avatar_url}
                      alt=""
                      className="h-8 w-8 rounded-full shrink-0 mt-0.5"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm line-clamp-2 leading-tight">{video.title}</h3>
                    <a
                      href={`/community/creator/${video.creator_id}`}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors mt-0.5 block"
                    >
                      {video.creator_name}
                    </a>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-0.5">
                        <Eye className="h-3 w-3" />
                        {formatViews(video.external_views)}
                      </span>
                      <span>{timeAgo(video.upload_date)}</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {((video.detected_tags && video.detected_tags.length > 0) || video.detected_map) && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {video.detected_map && (
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20">
                        {video.detected_map}
                      </Badge>
                    )}
                    {video.detected_tags?.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className={`text-[9px] px-1.5 py-0 ${TAG_COLORS[tag] || "bg-secondary text-muted-foreground"}`}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
