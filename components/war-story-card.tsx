"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Trash2, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export interface WarStory {
  story_id: number
  title: string
  description?: string | null
  screenshot_url?: string | null
  round_id?: number | null
  is_featured: boolean
  created_at: string
  round_map?: string | null
  round_date?: string | null
}

interface WarStoryCardProps {
  story: WarStory
  isOwner?: boolean
  onDelete?: (storyId: number) => void
  onToggleFeatured?: (storyId: number) => void
}

export function WarStoryCard({ story, isOwner, onDelete, onToggleFeatured }: WarStoryCardProps) {
  return (
    <Card className={cn(
      "border-border/60 overflow-hidden transition-all",
      story.is_featured && "ring-1 ring-amber-500/30 border-amber-500/20"
    )}>
      {story.screenshot_url && (
        <div className="relative aspect-video overflow-hidden bg-muted/30">
          <img
            src={story.screenshot_url}
            alt={story.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          {story.is_featured && (
            <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-amber-500/90 px-2 py-0.5 text-[10px] font-bold text-black">
              <Star className="h-3 w-3" fill="currentColor" />
              Featured
            </div>
          )}
        </div>
      )}
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {!story.screenshot_url && story.is_featured && (
                <Star className="h-4 w-4 text-amber-500 shrink-0" fill="currentColor" />
              )}
              <h4 className="font-semibold text-sm truncate">{story.title}</h4>
            </div>
            {story.description && (
              <p className="mt-1 text-xs text-muted-foreground line-clamp-3">{story.description}</p>
            )}
            <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
              <span>{new Date(story.created_at).toLocaleDateString()}</span>
              {story.round_id && story.round_map && (
                <Link
                  href={`/rounds/${story.round_id}`}
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  {story.round_map}
                </Link>
              )}
            </div>
          </div>

          {isOwner && (
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => onToggleFeatured?.(story.story_id)}
                title={story.is_featured ? "Unfeature" : "Set as featured"}
              >
                <Star className={cn("h-3.5 w-3.5", story.is_featured ? "text-amber-500 fill-amber-500" : "text-muted-foreground")} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={() => onDelete?.(story.story_id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
