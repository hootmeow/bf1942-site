const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || ""
const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3"

// Search terms to find BF1942 content via YouTube search
export const SEARCH_QUERIES = [
  "battlefield 1942 gameplay",
  "bf1942",
  "battlefield 1942",
  "desert combat bf1942",
  "forgotten hope bf1942",
  "battlegroup42",
  "bf1942 shorts",
  "battlefield 1942 montage",
  "bf1942 multiplayer",
]

// Tracked channels — we fetch ALL uploads from these, not just search results.
// Set via YOUTUBE_TRACKED_CHANNELS env var as comma-separated channel IDs,
// or falls back to this default list.
function getTrackedChannels(): string[] {
  const envChannels = process.env.YOUTUBE_TRACKED_CHANNELS || ""
  if (envChannels.trim()) {
    return envChannels.split(",").map(s => s.trim()).filter(Boolean)
  }
  return []
}

export interface YouTubeVideo {
  video_id: string
  url: string
  title: string
  description: string
  thumbnail_url: string
  creator_name: string
  creator_id: string
  creator_avatar_url: string | null
  upload_date: string
  external_views: number
  duration_seconds: number
  like_count: number
  comment_count: number
  is_short: boolean
}

interface YouTubeSearchItem {
  id: { videoId: string }
  snippet: {
    title: string
    description: string
    channelId: string
    channelTitle: string
    publishedAt: string
    thumbnails: {
      high?: { url: string }
      medium?: { url: string }
      default?: { url: string }
    }
  }
}

interface YouTubeVideoDetail {
  id: string
  statistics: {
    viewCount?: string
    likeCount?: string
    commentCount?: string
  }
  contentDetails: {
    duration: string
  }
}

interface PlaylistItem {
  snippet: {
    resourceId: { videoId: string }
    title: string
    description: string
    channelId: string
    channelTitle: string
    publishedAt: string
    thumbnails: {
      high?: { url: string }
      medium?: { url: string }
      default?: { url: string }
    }
  }
}

function parseDuration(iso8601: string): number {
  const match = iso8601.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0
  const hours = parseInt(match[1] || "0", 10)
  const minutes = parseInt(match[2] || "0", 10)
  const seconds = parseInt(match[3] || "0", 10)
  return hours * 3600 + minutes * 60 + seconds
}

export async function searchYouTubeVideos(query: string, maxResults = 50, publishedAfter?: string): Promise<YouTubeSearchItem[]> {
  if (!YOUTUBE_API_KEY) {
    console.error("YOUTUBE_API_KEY not set")
    return []
  }

  const params = new URLSearchParams({
    part: "snippet",
    q: query,
    type: "video",
    maxResults: String(maxResults),
    order: "date",
    key: YOUTUBE_API_KEY,
  })

  if (publishedAfter) {
    params.set("publishedAfter", publishedAfter)
  }

  const res = await fetch(`${YOUTUBE_API_BASE}/search?${params}`)
  if (!res.ok) {
    console.error(`YouTube search failed: ${res.status} ${await res.text()}`)
    return []
  }

  const data = await res.json()
  return data.items || []
}

export async function getVideoDetails(videoIds: string[]): Promise<YouTubeVideoDetail[]> {
  if (!YOUTUBE_API_KEY || videoIds.length === 0) return []

  const all: YouTubeVideoDetail[] = []
  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50)
    const params = new URLSearchParams({
      part: "statistics,contentDetails",
      id: batch.join(","),
      key: YOUTUBE_API_KEY,
    })

    const res = await fetch(`${YOUTUBE_API_BASE}/videos?${params}`)
    if (!res.ok) {
      console.error(`YouTube video details failed: ${res.status}`)
      continue
    }

    const data = await res.json()
    all.push(...(data.items || []))
  }
  return all
}

export async function getChannelAvatars(channelIds: string[]): Promise<Record<string, string>> {
  if (!YOUTUBE_API_KEY || channelIds.length === 0) return {}

  const unique = [...new Set(channelIds)]
  const map: Record<string, string> = {}
  for (let i = 0; i < unique.length; i += 50) {
    const batch = unique.slice(i, i + 50)
    const params = new URLSearchParams({
      part: "snippet",
      id: batch.join(","),
      key: YOUTUBE_API_KEY,
    })

    const res = await fetch(`${YOUTUBE_API_BASE}/channels?${params}`)
    if (!res.ok) continue

    const data = await res.json()
    for (const ch of data.items || []) {
      map[ch.id] = ch.snippet?.thumbnails?.default?.url || ""
    }
  }
  return map
}

/**
 * Fetch ALL uploads from a specific channel using the uploads playlist.
 * The uploads playlist ID is the channel ID with "UC" replaced by "UU".
 * Paginates through all pages up to maxPages (to avoid runaway API usage).
 */
async function fetchChannelUploads(channelId: string, maxPages = 10, publishedAfter?: string): Promise<YouTubeSearchItem[]> {
  if (!YOUTUBE_API_KEY) return []

  // Convert channel ID to uploads playlist ID
  const uploadsPlaylistId = channelId.replace(/^UC/, "UU")
  const items: YouTubeSearchItem[] = []
  let nextPageToken: string | undefined
  let page = 0
  const cutoffDate = publishedAfter ? new Date(publishedAfter).getTime() : 0

  while (page < maxPages) {
    const params = new URLSearchParams({
      part: "snippet",
      playlistId: uploadsPlaylistId,
      maxResults: "50",
      key: YOUTUBE_API_KEY,
    })
    if (nextPageToken) {
      params.set("pageToken", nextPageToken)
    }

    const res = await fetch(`${YOUTUBE_API_BASE}/playlistItems?${params}`)
    if (!res.ok) {
      console.error(`YouTube playlistItems failed for ${channelId}: ${res.status}`)
      break
    }

    const data = await res.json()
    const pageItems: PlaylistItem[] = data.items || []

    let hitCutoff = false
    for (const item of pageItems) {
      // If we have a cutoff date, skip videos older than it
      if (cutoffDate && new Date(item.snippet.publishedAt).getTime() < cutoffDate) {
        hitCutoff = true
        break
      }

      items.push({
        id: { videoId: item.snippet.resourceId.videoId },
        snippet: {
          title: item.snippet.title,
          description: item.snippet.description,
          channelId: item.snippet.channelId,
          channelTitle: item.snippet.channelTitle,
          publishedAt: item.snippet.publishedAt,
          thumbnails: item.snippet.thumbnails,
        },
      })
    }

    if (hitCutoff) break
    nextPageToken = data.nextPageToken
    if (!nextPageToken) break
    page++
  }

  console.log(`Fetched ${items.length} uploads from channel ${channelId}`)
  return items
}

export async function fetchAllBF1942Videos(publishedAfterDays = 30): Promise<YouTubeVideo[]> {
  const publishedAfter = publishedAfterDays > 0
    ? new Date(Date.now() - publishedAfterDays * 24 * 60 * 60 * 1000).toISOString()
    : undefined

  const allItems: YouTubeSearchItem[] = []
  const seenIds = new Set<string>()

  function addItems(items: YouTubeSearchItem[]) {
    for (const item of items) {
      if (!seenIds.has(item.id.videoId)) {
        seenIds.add(item.id.videoId)
        allItems.push(item)
      }
    }
  }

  // 1. Search-based discovery (finds new channels & content)
  for (const query of SEARCH_QUERIES) {
    const items = await searchYouTubeVideos(query, 50, publishedAfter)
    addItems(items)
  }

  // 2. Tracked channels — fetch ALL their uploads (much more thorough)
  const trackedChannels = getTrackedChannels()
  for (const channelId of trackedChannels) {
    // For tracked channels, allow more pages for initial seed (no date limit)
    // or filter by publishedAfter for incremental syncs
    const items = await fetchChannelUploads(channelId, 20, publishedAfter)
    addItems(items)
  }

  console.log(`Total unique videos found: ${allItems.length} (search + ${trackedChannels.length} tracked channels)`)

  if (allItems.length === 0) return []

  // Batch fetch video details (views, duration, likes, comments)
  const videoIds = allItems.map(i => i.id.videoId)
  const detailsMap = new Map<string, YouTubeVideoDetail>()
  const details = await getVideoDetails(videoIds)
  for (const d of details) {
    detailsMap.set(d.id, d)
  }

  // Fetch channel avatars
  const channelIds = allItems.map(i => i.snippet.channelId)
  const avatars = await getChannelAvatars(channelIds)

  return allItems.map(item => {
    const detail = detailsMap.get(item.id.videoId)
    const durationSec = detail ? parseDuration(detail.contentDetails.duration) : 0
    const titleLower = item.snippet.title.toLowerCase()
    const descLower = item.snippet.description.toLowerCase()
    const isShort = (durationSec > 0 && durationSec <= 60)
      || titleLower.includes("#shorts")
      || descLower.includes("#shorts")

    return {
      video_id: item.id.videoId,
      url: isShort
        ? `https://www.youtube.com/shorts/${item.id.videoId}`
        : `https://www.youtube.com/watch?v=${item.id.videoId}`,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail_url: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url || "",
      creator_name: item.snippet.channelTitle,
      creator_id: item.snippet.channelId,
      creator_avatar_url: avatars[item.snippet.channelId] || null,
      upload_date: item.snippet.publishedAt,
      external_views: parseInt(detail?.statistics?.viewCount || "0", 10),
      duration_seconds: durationSec,
      like_count: parseInt(detail?.statistics?.likeCount || "0", 10),
      comment_count: parseInt(detail?.statistics?.commentCount || "0", 10),
      is_short: isShort,
    }
  })
}
