"use client"

import { useEffect, useState, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Link from "next/link"
import {
  Loader2, Play, Eye, Youtube, ThumbsUp, MessageCircle,
  Star, Film, Smartphone, Users, TrendingUp, Trophy
} from "lucide-react"

// ── Shared interfaces ──────────────────────────────────────────────────────────

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

interface Creator {
  creator_id: string
  creator_name: string
  creator_avatar_url?: string | null
  video_count: number
  total_views: number
  latest_upload: string
}

type SortMode = "videos" | "views" | "recent"

// ── Shared helpers ─────────────────────────────────────────────────────────────

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
  if (days < 365) return `${Math.floor(days / 30)} months ago`
  return `${Math.floor(days / 365)} years ago`
}

function formatDuration(seconds: number): string {
  if (seconds <= 0) return ""
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  return `${m}:${String(s).padStart(2, "0")}`
}

// ── Constants ──────────────────────────────────────────────────────────────────

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

const TIME_FILTERS = [
  { value: "7", label: "7 Days" },
  { value: "30", label: "30 Days" },
  { value: "90", label: "90 Days" },
  { value: "all", label: "All Time" },
]

const TYPE_FILTERS = [
  { value: "all", label: "All", icon: Film },
  { value: "videos", label: "Videos", icon: Play },
  { value: "shorts", label: "Shorts", icon: Smartphone },
]

// ── VideoCard component ────────────────────────────────────────────────────────

function VideoCard({ video }: { video: CommunityVideo }) {
  return (
    <Card className="border-border/60 bg-card/40 overflow-hidden hover:border-border transition-colors">
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
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
          <div className="rounded-full bg-red-600/90 p-3 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
            <Play className="h-6 w-6 text-white fill-white" />
          </div>
        </div>
        {video.duration_seconds > 0 && (
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
            {formatDuration(video.duration_seconds)}
          </span>
        )}
        {video.is_short && (
          <span className="absolute top-2 left-2 bg-red-600/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
            <Smartphone className="h-2.5 w-2.5" />
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
        <div className="flex gap-2.5">
          <Link href={`/community/creator/${video.creator_id}`} className="shrink-0">
            {video.creator_avatar_url ? (
              <img
                src={video.creator_avatar_url}
                alt=""
                className="h-9 w-9 rounded-full mt-0.5 hover:ring-2 hover:ring-primary/50 transition-all"
              />
            ) : (
              <div className="h-9 w-9 rounded-full bg-muted/50 flex items-center justify-center mt-0.5">
                <Youtube className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </Link>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-sm line-clamp-2 leading-tight">{video.title}</h3>
            <Link
              href={`/community/creator/${video.creator_id}`}
              className="text-xs text-muted-foreground hover:text-primary transition-colors mt-0.5 block"
            >
              {video.creator_name}
            </Link>
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

// ── Videos Tab Content ─────────────────────────────────────────────────────────

function VideosTab() {
  const [videos, setVideos] = useState<CommunityVideo[]>([])
  const [featured, setFeatured] = useState<CommunityVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("all")
  const [contentType, setContentType] = useState("all")
  const [mapFilter, setMapFilter] = useState("")
  const [maps, setMaps] = useState<string[]>([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    async function fetchVideos() {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (timeRange !== "all") params.set("days", timeRange)
        if (mapFilter) params.set("map", mapFilter)
        if (contentType !== "all") params.set("content_type", contentType)
        params.set("limit", "60")
        const res = await fetch(`/api/v1/community/videos?${params}`)
        if (res.ok) {
          const data = await res.json()
          if (data.ok) {
            setVideos(data.videos)
            setFeatured(data.featured || [])
            if (data.maps) setMaps(data.maps)
            if (data.total) setTotal(data.total)
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
      {/* Stats row */}
      {!loading && total > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="border-border/60 bg-card/40">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <Film className="h-4 w-4 text-red-500" />
              </div>
              <div>
                <p className="text-lg font-bold tabular-nums">{total}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Videos</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-card/40">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Star className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <p className="text-lg font-bold tabular-nums">{featured.length}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Staff Picks</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-card/40">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-sky-500/10">
                <Smartphone className="h-4 w-4 text-sky-500" />
              </div>
              <div>
                <p className="text-lg font-bold tabular-nums">
                  {videos.filter(v => v.is_short).length}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Shorts</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-card/40">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-lg font-bold tabular-nums">{maps.length}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Maps Found</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Featured Section */}
      {featured.length > 0 && contentType === "all" && (
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
      <Card className="border-border/60 bg-card/40">
        <CardContent className="p-3">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex gap-1">
              {TYPE_FILTERS.map((f) => {
                const Icon = f.icon
                return (
                  <Button
                    key={f.value}
                    variant={contentType === f.value ? "default" : "ghost"}
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
                  variant={timeRange === f.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTimeRange(f.value)}
                >
                  {f.label}
                </Button>
              ))}
            </div>
            {maps.length > 0 && (
              <>
                <div className="h-4 w-px bg-border/60" />
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
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Video Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : videos.length === 0 ? (
        <Card className="border-border/60 bg-card/40">
          <CardContent className="text-center py-12">
            <Youtube className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <p className="mt-4 text-muted-foreground">No videos found</p>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting the filters or check back later</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {videos.map((video) => (
              <VideoCard key={video.video_id} video={video} />
            ))}
          </div>
          {videos.length >= 50 && (
            <p className="text-center text-xs text-muted-foreground">
              Showing top {videos.length} videos. Adjust filters to narrow results.
            </p>
          )}
        </>
      )}
    </div>
  )
}

// ── Creators Tab Content ───────────────────────────────────────────────────────

function CreatorsTab() {
  const [creators, setCreators] = useState<Creator[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<SortMode>("videos")

  useEffect(() => {
    async function fetchCreators() {
      setLoading(true)
      try {
        const res = await fetch(`/api/v1/community/creators?sort=${sort}`)
        if (res.ok) {
          const data = await res.json()
          if (data.ok) setCreators(data.creators)
        }
      } catch (e) {
        console.error("Failed to fetch creators:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchCreators()
  }, [sort])

  return (
    <div className="space-y-6">
      {/* Sort buttons */}
      <Card className="border-border/60 bg-card/40">
        <CardContent className="p-3">
          <div className="flex gap-1">
            <Button variant={sort === "videos" ? "default" : "ghost"} size="sm" className="gap-1.5" onClick={() => setSort("videos")}>
              <Film className="h-3.5 w-3.5" />
              Most Active
            </Button>
            <Button variant={sort === "views" ? "default" : "ghost"} size="sm" className="gap-1.5" onClick={() => setSort("views")}>
              <Eye className="h-3.5 w-3.5" />
              Most Viewed
            </Button>
            <Button variant={sort === "recent" ? "default" : "ghost"} size="sm" className="gap-1.5" onClick={() => setSort("recent")}>
              <TrendingUp className="h-3.5 w-3.5" />
              Rising Stars
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : creators.length === 0 ? (
        <Card className="border-border/60 bg-card/40">
          <CardContent className="text-center py-12">
            <Youtube className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <p className="mt-4 text-muted-foreground">No creators found yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {creators.map((creator, index) => (
            <Link key={creator.creator_id} href={`/community/creator/${creator.creator_id}`}>
              <Card className="border-border/60 bg-card/40 hover:border-border transition-colors">
                <CardContent className="p-4 flex items-center gap-4">
                  <span className={`text-lg font-bold w-8 text-center tabular-nums ${
                    index === 0 ? "text-amber-500" :
                    index === 1 ? "text-slate-400" :
                    index === 2 ? "text-amber-700" :
                    "text-muted-foreground/40"
                  }`}>
                    {index + 1}
                  </span>
                  {creator.creator_avatar_url ? (
                    <img src={creator.creator_avatar_url} alt="" className="h-11 w-11 rounded-full ring-1 ring-border" />
                  ) : (
                    <div className="h-11 w-11 rounded-full bg-muted/50 flex items-center justify-center ring-1 ring-border">
                      <Youtube className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{creator.creator_name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Last upload: {timeAgo(creator.latest_upload)}
                    </p>
                  </div>
                  <div className="flex items-center gap-6 text-sm shrink-0">
                    <div className="text-center">
                      <p className="font-bold tabular-nums">{creator.video_count}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Videos</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold tabular-nums">{formatCount(creator.total_views)}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Views</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main Combined Page ─────────────────────────────────────────────────────────

export default function HighlightsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialTab = searchParams.get("tab") === "creators" ? "creators" : "videos"

  const handleTabChange = useCallback((value: string) => {
    const url = value === "creators"
      ? "/community/highlights?tab=creators"
      : "/community/highlights"
    router.replace(url, { scroll: false })
  }, [router])

  return (
    <div className="space-y-6">
      {/* Shared Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-red-500/10">
          <Youtube className="h-5 w-5 text-red-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Community Highlights</h1>
          <p className="text-sm text-muted-foreground">
            The best BF1942 content and creators from the community
          </p>
        </div>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue={initialTab} onValueChange={handleTabChange} className="w-full">
        <TabsList>
          <TabsTrigger value="videos" className="gap-1.5">
            <Film className="h-3.5 w-3.5" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="creators" className="gap-1.5">
            <Users className="h-3.5 w-3.5" />
            Creators
          </TabsTrigger>
        </TabsList>
        <TabsContent value="videos" className="mt-6">
          <VideosTab />
        </TabsContent>
        <TabsContent value="creators" className="mt-6">
          <CreatorsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
