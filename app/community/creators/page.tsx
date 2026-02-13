"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Youtube, Trophy, Eye, Film, TrendingUp, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Creator {
  creator_id: string
  creator_name: string
  creator_avatar_url?: string | null
  video_count: number
  total_views: number
  latest_upload: string
}

type SortMode = "videos" | "views" | "recent"

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
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

export default function CreatorsPage() {
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
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-500/10">
            <Trophy className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Content Creators</h1>
            <p className="text-sm text-muted-foreground">
              Top BF1942 community content creators
              {creators.length > 0 && <span className="ml-1 text-muted-foreground/60">({creators.length} creators)</span>}
            </p>
          </div>
        </div>
        <Link href="/community/highlights">
          <Button variant="outline" size="sm" className="gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Highlights
          </Button>
        </Link>
      </div>

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
                      <p className="font-bold tabular-nums">{formatViews(creator.total_views)}</p>
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
