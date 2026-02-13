"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Loader2, Youtube, Eye, Film, ExternalLink, Play,
  ThumbsUp, MessageCircle, Smartphone, ArrowLeft
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

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

interface CreatorProfile {
  creator_id: string
  creator_name: string
  creator_avatar_url?: string | null
  video_count: number
  total_views: number
}

interface CreatorVideo {
  video_id: string
  url: string
  title: string
  thumbnail_url: string
  upload_date: string
  external_views: number
  duration_seconds: number
  like_count?: number
  comment_count?: number
  is_short?: boolean
  detected_map?: string | null
  detected_tags?: string[] | null
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
  if (days < 365) return `${Math.floor(days / 30)} months ago`
  return `${Math.floor(days / 365)} years ago`
}

export default function CreatorProfilePage() {
  const params = useParams()
  const channelId = params.channelId as string

  const [creator, setCreator] = useState<CreatorProfile | null>(null)
  const [videos, setVideos] = useState<CreatorVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCreator() {
      try {
        const res = await fetch(`/api/v1/community/creator/${channelId}`)
        if (res.ok) {
          const data = await res.json()
          if (data.ok) {
            setCreator(data.creator)
            setVideos(data.videos)
          } else {
            setError("Creator not found")
          }
        } else {
          setError("Failed to load creator")
        }
      } catch {
        setError("Network error")
      } finally {
        setLoading(false)
      }
    }
    if (channelId) fetchCreator()
  }, [channelId])

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  }

  if (error || !creator) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error || "Creator not found"}</AlertDescription>
      </Alert>
    )
  }

  const shortCount = videos.filter(v => v.is_short).length
  const videoCount = videos.length - shortCount

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back link */}
      <Link href="/community/creators" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Creators
      </Link>

      {/* Creator Header */}
      <Card className="border-border/60 bg-card/40">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {creator.creator_avatar_url ? (
              <img src={creator.creator_avatar_url} alt="" className="h-20 w-20 rounded-full ring-2 ring-border" />
            ) : (
              <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center ring-2 ring-border">
                <Youtube className="h-10 w-10 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight">{creator.creator_name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Film className="h-4 w-4" />
                  <span className="font-semibold text-foreground">{creator.video_count}</span> videos
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span className="font-semibold text-foreground">{formatViews(creator.total_views)}</span> total views
                </div>
                {shortCount > 0 && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Smartphone className="h-4 w-4" />
                    <span className="font-semibold text-foreground">{shortCount}</span> shorts
                  </div>
                )}
              </div>
            </div>
            <a
              href={`https://www.youtube.com/channel/${creator.creator_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors shrink-0"
            >
              <Youtube className="h-4 w-4" />
              YouTube Channel
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Videos */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <Card key={video.video_id} className="border-border/60 bg-card/40 overflow-hidden hover:border-border transition-colors">
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
            </a>
            <CardContent className="p-3">
              <h3 className="font-semibold text-sm line-clamp-2 leading-tight">{video.title}</h3>
              <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-0.5">
                  <Eye className="h-3 w-3" />
                  {formatViews(video.external_views)}
                </span>
                {(video.like_count ?? 0) > 0 && (
                  <span className="flex items-center gap-0.5">
                    <ThumbsUp className="h-3 w-3" />
                    {formatViews(video.like_count!)}
                  </span>
                )}
                {(video.comment_count ?? 0) > 0 && (
                  <span className="flex items-center gap-0.5">
                    <MessageCircle className="h-3 w-3" />
                    {formatViews(video.comment_count!)}
                  </span>
                )}
                <span>{timeAgo(video.upload_date)}</span>
              </div>
              {((video.detected_tags && video.detected_tags.length > 0) || video.detected_map) && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {video.detected_map && (
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20">
                      {video.detected_map}
                    </Badge>
                  )}
                  {video.detected_tags?.map((tag) => (
                    <Badge key={tag} variant="outline"
                      className={`text-[9px] px-1.5 py-0 ${TAG_COLORS[tag] || "bg-secondary text-muted-foreground"}`}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
