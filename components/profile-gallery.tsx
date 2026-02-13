"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ImageIcon } from "lucide-react"

interface ProfileGalleryProps {
  urls: string[]
}

export function ProfileGallery({ urls }: ProfileGalleryProps) {
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)

  if (!urls || urls.length === 0) return null

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {urls.map((url, i) => (
          <button
            key={i}
            onClick={() => setLightboxUrl(url)}
            className="group relative aspect-video overflow-hidden rounded-lg border border-border/60 bg-muted/30 transition-all hover:border-primary/30 hover:shadow-lg"
          >
            <img
              src={url}
              alt={`Gallery image ${i + 1}`}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = "none"
                target.parentElement!.classList.add("flex", "items-center", "justify-center")
                const icon = document.createElement("div")
                icon.innerHTML = "Image unavailable"
                icon.className = "text-xs text-muted-foreground"
                target.parentElement!.appendChild(icon)
              }}
            />
          </button>
        ))}
      </div>

      <Dialog open={!!lightboxUrl} onOpenChange={() => setLightboxUrl(null)}>
        <DialogContent className="max-w-4xl p-1 bg-black/90 border-border/30">
          {lightboxUrl && (
            <img
              src={lightboxUrl}
              alt="Gallery image"
              className="w-full h-auto max-h-[80vh] object-contain rounded"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
