"use client"

import { useEffect, useState, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Link from "next/link"
import {
  Loader2, Play, Eye, Youtube, ThumbsUp, MessageCircle,
  Star, Film, Smartphone, Users, TrendingUp, Crown, Medal, Award
} from "lucide-react"
import { cn } from "@/lib/utils"

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

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0)   return "Today"
  if (days === 1)   return "Yesterday"
  if (days < 7)    return `${days}d ago`
  if (days < 30)   return `${Math.floor(days / 7)}w ago`
  if (days < 365)  return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
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
  montage:         "bg-purple-500/15 text-purple-400 border-purple-500/25",
  tutorial:        "bg-blue-500/15 text-blue-400 border-blue-500/25",
  funny:           "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
  clutch:          "bg-red-500/15 text-red-400 border-red-500/25",
  sniper:          "bg-orange-500/15 text-orange-400 border-orange-500/25",
  tank:            "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  planes:          "bg-sky-500/15 text-sky-400 border-sky-500/25",
  nostalgia:       "bg-amber-500/15 text-amber-400 border-amber-500/25",
  livestream:      "bg-red-600/15 text-red-400 border-red-600/25",
  "Desert Combat": "bg-yellow-600/15 text-yellow-500 border-yellow-600/25",
  "Forgotten Hope":"bg-green-600/15 text-green-400 border-green-600/25",
  "Battlegroup42": "bg-stone-500/15 text-stone-400 border-stone-500/25",
}

const TIME_FILTERS  = [
  { value: "7",   label: "7D"  },
  { value: "30",  label: "30D" },
  { value: "90",  label: "90D" },
  { value: "all", label: "All" },
]

const TYPE_FILTERS = [
  { value: "all",    label: "All",    icon: Film       },
  { value: "videos", label: "Videos", icon: Play       },
  { value: "shorts", label: "Shorts", icon: Smartphone },
]

// ── VideoCard ──────────────────────────────────────────────────────────────────

function VideoCard({ video, featured = false }: { video: CommunityVideo; featured?: boolean }) {
  return (
    <div className={cn(
      "group relative flex flex-col overflow-hidden rounded-xl border bg-[#070b05] transition-all duration-300",
      "hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/50",
      featured ? "border-amber-500/30 hover:border-amber-500/50" : "border-[#1e2a14] hover:border-[#2d3d1e]"
    )}>
      {/* Thumbnail — fills the top */}
      <a
        href={video.url || `https://www.youtube.com/watch?v=${video.video_id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block aspect-video overflow-hidden"
      >
        <img
          src={video.thumbnail_url}
          alt={video.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Dark overlay with play button */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-all duration-300">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/20 bg-black/60 opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-75 transition-all duration-300 backdrop-blur-sm">
            <Play className="h-5 w-5 text-white fill-white ml-0.5" />
          </div>
        </div>

        {/* Duration badge */}
        {video.duration_seconds > 0 && (
          <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[10px] text-white backdrop-blur-sm">
            {formatDuration(video.duration_seconds)}
          </span>
        )}

        {/* Shorts badge */}
        {video.is_short && (
          <span className="absolute top-2 left-2 flex items-center gap-0.5 rounded bg-red-600/90 px-1.5 py-0.5 font-mono text-[9px] font-bold text-white backdrop-blur-sm">
            <Smartphone className="h-2.5 w-2.5" />SHORT
          </span>
        )}

        {/* Featured badge */}
        {video.is_featured && (
          <span className="absolute top-2 right-2 flex items-center gap-0.5 rounded border border-amber-400/40 bg-amber-500/80 px-1.5 py-0.5 font-mono text-[9px] font-bold text-black backdrop-blur-sm">
            <Star className="h-2.5 w-2.5" fill="currentColor" />STAFF PICK
          </span>
        )}

        {/* Creator avatar — overlaps the thumbnail/card boundary */}
        <div className="absolute -bottom-4 left-3 z-10">
          <Link href={`/community/creator/${video.creator_id}`} onClick={e => e.stopPropagation()}>
            {video.creator_avatar_url ? (
              <img
                src={video.creator_avatar_url}
                alt=""
                className="h-9 w-9 rounded-full border-2 border-[#070b05] object-cover shadow-lg transition-transform group-hover:scale-110"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#070b05] bg-[#1e2a14] shadow-lg">
                <Youtube className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </Link>
        </div>
      </a>

      {/* Info — padded to accommodate the overlapping avatar */}
      <div className="flex flex-1 flex-col px-3 pt-6 pb-3 gap-2">
        <div className="flex items-start gap-2">
          {/* Spacer for avatar column */}
          <div className="w-9 shrink-0" />
          <div className="flex-1 min-w-0">
            <Link
              href={`/community/creator/${video.creator_id}`}
              className="block font-mono text-[10px] text-primary/70 hover:text-primary transition-colors truncate"
            >
              {video.creator_name}
            </Link>
          </div>
        </div>

        <h3 className="text-sm font-semibold leading-snug line-clamp-2 text-foreground group-hover:text-amber-400/90 transition-colors duration-200">
          {video.title}
        </h3>

        {/* Stats row */}
        <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground/60">
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />{formatCount(video.external_views)}
          </span>
          {(video.like_count ?? 0) > 0 && (
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />{formatCount(video.like_count!)}
            </span>
          )}
          {(video.comment_count ?? 0) > 0 && (
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />{formatCount(video.comment_count!)}
            </span>
          )}
          <span className="ml-auto">{timeAgo(video.upload_date)}</span>
        </div>

        {/* Tags */}
        {((video.detected_tags && video.detected_tags.length > 0) || video.detected_map) && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {video.detected_map && (
              <span className="rounded border bg-primary/10 border-primary/20 px-1.5 py-0.5 font-mono text-[9px] text-primary">
                {video.detected_map}
              </span>
            )}
            {video.detected_tags?.map((tag) => (
              <span
                key={tag}
                className={cn("rounded border px-1.5 py-0.5 font-mono text-[9px]", TAG_COLORS[tag] ?? "bg-[#0a0f06] text-muted-foreground/60 border-[#1e2a14]")}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── FilterBar ──────────────────────────────────────────────────────────────────

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-all duration-150",
        active
          ? "border-primary/50 bg-primary/15 text-primary shadow-sm shadow-primary/10"
          : "border-[#1e2a14] bg-[#070b05] text-muted-foreground/60 hover:border-[#2a3a1a] hover:text-muted-foreground"
      )}
    >
      {children}
    </button>
  )
}

// ── Videos Tab ─────────────────────────────────────────────────────────────────

function VideosTab() {
  const [videos,      setVideos]      = useState<CommunityVideo[]>([])
  const [featured,    setFeatured]    = useState<CommunityVideo[]>([])
  const [loading,     setLoading]     = useState(true)
  const [timeRange,   setTimeRange]   = useState("all")
  const [contentType, setContentType] = useState("all")
  const [mapFilter,   setMapFilter]   = useState("")
  const [maps,        setMaps]        = useState<string[]>([])
  const [total,       setTotal]       = useState(0)

  useEffect(() => {
    async function fetchVideos() {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (timeRange !== "all") params.set("days", timeRange)
        if (mapFilter)           params.set("map", mapFilter)
        if (contentType !== "all") params.set("content_type", contentType)
        params.set("limit", "60")
        const res = await fetch(`/api/v1/community/videos?${params}`)
        if (res.ok) {
          const data = await res.json()
          if (data.ok) {
            setVideos(data.videos)
            setFeatured(data.featured || [])
            if (data.maps)  setMaps(data.maps)
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
    <div className="space-y-8">
      {/* Stats bar */}
      {!loading && total > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Film,       color: "text-red-400",     bg: "bg-red-500/10",    border: "border-red-500/20",    label: "Videos",     value: total },
            { icon: Star,       color: "text-amber-400",   bg: "bg-amber-500/10",  border: "border-amber-500/20",  label: "Staff Picks",value: featured.length },
            { icon: Smartphone, color: "text-sky-400",     bg: "bg-sky-500/10",    border: "border-sky-500/20",    label: "Shorts",     value: videos.filter(v => v.is_short).length },
            { icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10",border: "border-emerald-500/20",label: "Maps Tagged", value: maps.length },
          ].map(({ icon: Icon, color, bg, border, label, value }) => (
            <div key={label} className={cn("flex items-center gap-3 rounded-xl border p-4", bg, border)}>
              <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", bg, "border", border)}>
                <Icon className={cn("h-4 w-4", color)} />
              </div>
              <div>
                <p className={cn("text-lg font-black tabular-nums leading-none", color)}>{value}</p>
                <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground/60">{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Featured */}
      {featured.length > 0 && contentType === "all" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Star className="h-4 w-4 text-amber-400" fill="currentColor" />
            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-amber-400">Staff Picks</span>
            <div className="flex-1 h-px bg-gradient-to-r from-amber-500/30 to-transparent" />
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((video) => (
              <VideoCard key={`featured-${video.video_id}`} video={video} featured />
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#1e2a14] bg-[#070b05] p-3">
        <div className="flex gap-1.5">
          {TYPE_FILTERS.map((f) => {
            const Icon = f.icon
            return (
              <FilterChip key={f.value} active={contentType === f.value} onClick={() => setContentType(f.value)}>
                <Icon className="h-3 w-3" />{f.label}
              </FilterChip>
            )
          })}
        </div>
        <div className="h-4 w-px bg-[#1e2a14] mx-1" />
        <div className="flex gap-1.5">
          {TIME_FILTERS.map((f) => (
            <FilterChip key={f.value} active={timeRange === f.value} onClick={() => setTimeRange(f.value)}>
              {f.label}
            </FilterChip>
          ))}
        </div>
        {maps.length > 0 && (
          <>
            <div className="h-4 w-px bg-[#1e2a14] mx-1" />
            <select
              value={mapFilter}
              onChange={(e) => setMapFilter(e.target.value)}
              className="h-8 rounded-lg border border-[#1e2a14] bg-[#0a0f06] px-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground focus:outline-none focus:border-primary/40 focus:text-foreground transition-colors"
            >
              <option value="">All Maps</option>
              {maps.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </>
        )}
      </div>

      {/* Video grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">Loading Intel…</span>
          </div>
        </div>
      ) : videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#1e2a14] py-20 text-center">
          <Youtube className="h-12 w-12 text-muted-foreground/20 mb-4" />
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground/40">No Videos Found</p>
          <p className="mt-1 text-xs text-muted-foreground/50">Adjust the filters or check back later</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {videos.map((video) => (
              <VideoCard key={video.video_id} video={video} />
            ))}
          </div>
          {videos.length >= 50 && (
            <p className="text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40">
              Showing top {videos.length} — adjust filters to narrow results
            </p>
          )}
        </>
      )}
    </div>
  )
}

// ── Creators Tab ───────────────────────────────────────────────────────────────

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="h-5 w-5 text-amber-400" fill="currentColor" />
  if (rank === 2) return <Medal className="h-5 w-5 text-slate-300" fill="currentColor" />
  if (rank === 3) return <Award className="h-5 w-5 text-amber-600" fill="currentColor" />
  return <span className="font-mono text-sm font-bold text-muted-foreground/40 w-5 text-center tabular-nums">{rank}</span>
}

function CreatorsTab() {
  const [creators, setCreators] = useState<Creator[]>([])
  const [loading,  setLoading]  = useState(true)
  const [sort,     setSort]     = useState<SortMode>("videos")

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
      {/* Sort controls */}
      <div className="flex items-center gap-2 rounded-xl border border-[#1e2a14] bg-[#070b05] p-3">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/40 mr-2">Rank by</span>
        {[
          { value: "videos" as SortMode, label: "Most Active",  icon: Film       },
          { value: "views"  as SortMode, label: "Most Viewed",  icon: Eye        },
          { value: "recent" as SortMode, label: "Rising Stars", icon: TrendingUp },
        ].map(({ value, label, icon: Icon }) => (
          <FilterChip key={value} active={sort === value} onClick={() => setSort(value)}>
            <Icon className="h-3 w-3" />{label}
          </FilterChip>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">Assembling Roster…</span>
          </div>
        </div>
      ) : creators.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#1e2a14] py-20 text-center">
          <Users className="h-12 w-12 text-muted-foreground/20 mb-4" />
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground/40">No Creators Found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {creators.map((creator, index) => {
            const rank = index + 1
            const isTop3 = rank <= 3
            return (
              <Link key={creator.creator_id} href={`/community/creator/${creator.creator_id}`}>
                <div className={cn(
                  "group flex items-center gap-4 rounded-xl border p-4 transition-all duration-200",
                  "hover:-translate-y-px hover:shadow-lg hover:shadow-black/30",
                  rank === 1 && "border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50",
                  rank === 2 && "border-slate-400/20 bg-slate-400/3 hover:border-slate-400/35",
                  rank === 3 && "border-amber-700/25 bg-amber-700/3 hover:border-amber-700/40",
                  !isTop3   && "border-[#1e2a14] bg-[#070b05] hover:border-[#2a3a1a]",
                )}>
                  {/* Rank badge */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center">
                    <RankIcon rank={rank} />
                  </div>

                  {/* Avatar */}
                  {creator.creator_avatar_url ? (
                    <img
                      src={creator.creator_avatar_url}
                      alt=""
                      className={cn(
                        "h-11 w-11 shrink-0 rounded-full object-cover",
                        rank === 1 && "ring-2 ring-amber-400/50 shadow-[0_0_12px_rgba(251,191,36,0.2)]",
                        rank === 2 && "ring-2 ring-slate-400/40",
                        rank === 3 && "ring-2 ring-amber-700/40",
                        !isTop3   && "ring-1 ring-[#1e2a14]"
                      )}
                    />
                  ) : (
                    <div className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-full ring-1",
                      isTop3 ? "bg-[#0d1208] ring-[#2a3a1a]" : "bg-[#0a0f06] ring-[#1e2a14]"
                    )}>
                      <Youtube className="h-5 w-5 text-muted-foreground/50" />
                    </div>
                  )}

                  {/* Name + last upload */}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-semibold text-sm truncate transition-colors",
                      isTop3 ? "text-foreground group-hover:text-amber-400" : "text-foreground/80 group-hover:text-foreground"
                    )}>
                      {creator.creator_name}
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground/50 mt-0.5">
                      {timeAgo(creator.latest_upload)}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-center">
                      <p className={cn("font-mono font-bold text-sm tabular-nums leading-none", isTop3 ? "text-foreground" : "text-muted-foreground/80")}>
                        {creator.video_count}
                      </p>
                      <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground/40 mt-0.5">Videos</p>
                    </div>
                    <div className="text-center">
                      <p className={cn("font-mono font-bold text-sm tabular-nums leading-none", isTop3 ? "text-foreground" : "text-muted-foreground/80")}>
                        {formatCount(creator.total_views)}
                      </p>
                      <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground/40 mt-0.5">Views</p>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function HighlightsPage() {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const initialTab   = searchParams.get("tab") === "creators" ? "creators" : "videos"

  const handleTabChange = useCallback((value: string) => {
    router.replace(
      value === "creators" ? "/community/highlights?tab=creators" : "/community/highlights",
      { scroll: false }
    )
  }, [router])

  return (
    <div className="space-y-8 pb-8">
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl border border-[#1e2a14] shadow-2xl"
        style={{ background: "linear-gradient(135deg, #0d1208 0%, #0a0f06 50%, #060a04 100%)" }}
      >
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(#6b8c3a 1px, transparent 1px), linear-gradient(90deg, #6b8c3a 1px, transparent 1px)",
            backgroundSize: "32px 32px"
          }}
        />
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-red-500/5 blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-primary/5 blur-[60px] pointer-events-none" />

        <div className="relative z-10 px-8 py-12 sm:px-12 sm:py-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-red-400 mb-4">
            <Youtube className="h-3 w-3" />
            Community Intel
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Community<br />
            <span className="text-primary">Highlights</span>
          </h1>
          <p className="mt-3 max-w-md text-sm text-slate-400 leading-relaxed">
            The best BF1942 footage, montages, and creators the community has to offer.
          </p>
        </div>
      </div>

      {/* ── TABBED CONTENT ────────────────────────────────────────────── */}
      <Tabs defaultValue={initialTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="border border-[#1e2a14] bg-[#070b05] p-1 h-auto gap-1">
          <TabsTrigger
            value="videos"
            className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-lg px-4 py-2"
          >
            <Film className="h-3.5 w-3.5" />
            Videos
          </TabsTrigger>
          <TabsTrigger
            value="creators"
            className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-lg px-4 py-2"
          >
            <Users className="h-3.5 w-3.5" />
            Creators
          </TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="mt-8">
          <VideosTab />
        </TabsContent>
        <TabsContent value="creators" className="mt-8">
          <CreatorsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
