const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || ""
const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3"

// Hashtags/search terms to find BF1942 content
export const SEARCH_QUERIES = [
  "battlefield 1942 gameplay",
  "bf1942",
  "battlefield 1942",
  "desert combat bf1942",
  "forgotten hope bf1942",
  "battlegroup42",
]

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
  }
  contentDetails: {
    duration: string
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

export async function searchYouTubeVideos(query: string, maxResults = 25, publishedAfter?: string): Promise<YouTubeSearchItem[]> {
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

  const params = new URLSearchParams({
    part: "statistics,contentDetails",
    id: videoIds.join(","),
    key: YOUTUBE_API_KEY,
  })

  const res = await fetch(`${YOUTUBE_API_BASE}/videos?${params}`)
  if (!res.ok) {
    console.error(`YouTube video details failed: ${res.status}`)
    return []
  }

  const data = await res.json()
  return data.items || []
}

export async function getChannelAvatars(channelIds: string[]): Promise<Record<string, string>> {
  if (!YOUTUBE_API_KEY || channelIds.length === 0) return {}

  const unique = [...new Set(channelIds)]
  const params = new URLSearchParams({
    part: "snippet",
    id: unique.join(","),
    key: YOUTUBE_API_KEY,
  })

  const res = await fetch(`${YOUTUBE_API_BASE}/channels?${params}`)
  if (!res.ok) return {}

  const data = await res.json()
  const map: Record<string, string> = {}
  for (const ch of data.items || []) {
    map[ch.id] = ch.snippet?.thumbnails?.default?.url || ""
  }
  return map
}

export async function fetchAllBF1942Videos(publishedAfterDays = 30): Promise<YouTubeVideo[]> {
  const publishedAfter = new Date(Date.now() - publishedAfterDays * 24 * 60 * 60 * 1000).toISOString()

  const allItems: YouTubeSearchItem[] = []
  const seenIds = new Set<string>()

  // Search each query (costs ~6 quota units per search = ~6 searches)
  for (const query of SEARCH_QUERIES) {
    const items = await searchYouTubeVideos(query, 15, publishedAfter)
    for (const item of items) {
      if (!seenIds.has(item.id.videoId)) {
        seenIds.add(item.id.videoId)
        allItems.push(item)
      }
    }
  }

  if (allItems.length === 0) return []

  // Batch fetch video details (views, duration)
  const videoIds = allItems.map(i => i.id.videoId)
  const detailsMap = new Map<string, YouTubeVideoDetail>()

  // YouTube API allows max 50 IDs per request
  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50)
    const details = await getVideoDetails(batch)
    for (const d of details) {
      detailsMap.set(d.id, d)
    }
  }

  // Fetch channel avatars
  const channelIds = allItems.map(i => i.snippet.channelId)
  const avatars = await getChannelAvatars(channelIds)

  return allItems.map(item => {
    const detail = detailsMap.get(item.id.videoId)
    return {
      video_id: item.id.videoId,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail_url: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url || "",
      creator_name: item.snippet.channelTitle,
      creator_id: item.snippet.channelId,
      creator_avatar_url: avatars[item.snippet.channelId] || null,
      upload_date: item.snippet.publishedAt,
      external_views: parseInt(detail?.statistics?.viewCount || "0", 10),
      duration_seconds: detail ? parseDuration(detail.contentDetails.duration) : 0,
    }
  })
}
