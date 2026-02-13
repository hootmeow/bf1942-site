"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Play, Eye, Clock, Youtube, ThumbsUp, MessageCircle, Star, Film, Smartphone } from "lucide-react"

interface CommunityVideo {
  video_id: string
  url: string
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
  like_count?: number
  comment_count?: number
  is_short?: boolean
  is_featured?: boolean
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
  "Desert Combat": "bg-yellow-600/10 text-yellow-600 border-yellow-600/20",
  "Forgotten Hope": "bg-green-600/10 text-green-600 border-green-600/20",
  "Battlegroup42": "bg-stone-500/10 text-stone-500 border-stone-500/20",
}

function formatDuration(seconds: number): string {
  if (seconds <= 0) return ""
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  return `${m}:${String(s).padStart(2, "0")}`
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
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
  { value: "7", label: "7 Days" },
  { value: "30", label: "30 Days" },
  { value: "all", label: "All Time" },
]

const TYPE_FILTERS = [
  { value: "all", label: "All", icon: Film },
  { value: "videos", label: "Videos", icon: Play },
  { value: "shorts", label: "Shorts", icon: Smartphone },
]

function VideoCard({ video }: { video: CommunityVideo }) {
  return (
    <Card className="border-border/60 bg-card/40 overflow-hidden">
      <a
        href={video.url || `https://www.youtube.com/watch?v=${video.video_id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block aspect-video bg-muted/30 group"
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
        {video.is_short && (
          <span className="absolute top-2 left-2 bg-red-600/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            SHORT
          </span>
        )}
        {video.is_featured && (
          <span className="absolute top-2 right-2 flex items-center gap-0.5 bg-amber-500/90 text-black text-[10px] font-bold px-1.5 py-0.5 rounded">
            <Star className="h-3 w-3" fill="currentColor" />
            Featured
          </span>
        )}
      </a>

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
                {formatCount(video.external_views)}
              </span>
              {(video.like_count ?? 0) > 0 && (
                <span className="flex items-center gap-0.5">
                  <ThumbsUp className="h-3 w-3" />
                  {formatCount(video.like_count!)}
                </span>
              )}
              {(video.comment_count ?? 0) > 0 && (
                <span className="flex items-center gap-0.5">
                  <MessageCircle className="h-3 w-3" />
                  {formatCount(video.comment_count!)}
                </span>
              )}
              <span>{timeAgo(video.upload_date)}</span>
            </div>
          </div>
        </div>

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
  )
}

export default function HighlightsPage() {
  const [videos, setVideos] = useState<CommunityVideo[]>([])
  const [featured, setFeatured] = useState<CommunityVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30")
  const [contentType, setContentType] = useState("all")
  const [mapFilter, setMapFilter] = useState("")
  const [maps, setMaps] = useState<string[]>([])

  useEffect(() => {
    async function fetchVideos() {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (timeRange !== "all") params.set("days", timeRange)
        if (mapFilter) params.set("map", mapFilter)
        if (contentType !== "all") params.set("content_type", contentType)
        const res = await fetch(`/api/v1/community/videos?${params}`)
        if (res.ok) {
          const data = await res.json()
          if (data.ok) {
            setVideos(data.videos)
            setFeatured(data.featured || [])
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
  }, [timeRange, mapFilter, contentType])

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

      {/* Featured Section */}
      {featured.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500" fill="currentColor" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-500">Staff Picks</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((video) => (
              <VideoCard key={`featured-${video.video_id}`} video={video} />
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1">
          {TYPE_FILTERS.map((f) => {
            const Icon = f.icon
            return (
              <Button
                key={f.value}
                variant={contentType === f.value ? "default" : "outline"}
                size="sm"
                className="gap-1.5"
                onClick={() => setContentType(f.value)}
              >
                <Icon className="h-3.5 w-3.5" />
                {f.label}
              </Button>
            )
          })}
        </div>
        <div className="h-4 w-px bg-border/60" />
        <div className="flex gap-1">
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
            <VideoCard key={video.video_id} video={video} />
          ))}
        </div>
      )}
    </div>
  )
}
