"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Youtube, Trophy, Eye, Film, TrendingUp } from "lucide-react"
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

  function formatViews(views: number): string {
    if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`
    if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`
    return String(views)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-500/10">
            <Trophy className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Content Creators</h1>
            <p className="text-sm text-muted-foreground">Top BF1942 community content creators</p>
          </div>
        </div>
      </div>

      {/* Sort buttons */}
      <div className="flex gap-1.5">
        <Button variant={sort === "videos" ? "default" : "outline"} size="sm" className="gap-1.5" onClick={() => setSort("videos")}>
          <Film className="h-3.5 w-3.5" />
          Most Active
        </Button>
        <Button variant={sort === "views" ? "default" : "outline"} size="sm" className="gap-1.5" onClick={() => setSort("views")}>
          <Eye className="h-3.5 w-3.5" />
          Most Viewed
        </Button>
        <Button variant={sort === "recent" ? "default" : "outline"} size="sm" className="gap-1.5" onClick={() => setSort("recent")}>
          <TrendingUp className="h-3.5 w-3.5" />
          Rising Stars
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : creators.length === 0 ? (
        <div className="text-center py-12">
          <Youtube className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-muted-foreground">No creators found yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {creators.map((creator, index) => (
            <Link key={creator.creator_id} href={`/community/creator/${creator.creator_id}`}>
              <Card className="border-border/60 bg-card/40 card-interactive">
                <CardContent className="p-4 flex items-center gap-4">
                  <span className="text-lg font-bold text-muted-foreground/50 w-8 text-center tabular-nums">
                    {index + 1}
                  </span>
                  {creator.creator_avatar_url ? (
                    <img src={creator.creator_avatar_url} alt="" className="h-10 w-10 rounded-full" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center">
                      <Youtube className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{creator.creator_name}</p>
                    <p className="text-xs text-muted-foreground">
                      Last upload: {new Date(creator.latest_upload).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-6 text-sm shrink-0">
                    <div className="text-center">
                      <p className="font-bold tabular-nums">{creator.video_count}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">Videos</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold tabular-nums">{formatViews(creator.total_views)}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">Views</p>
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
