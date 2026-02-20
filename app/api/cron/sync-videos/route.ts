import { NextResponse } from "next/server"
import { pool } from "@/lib/db"
import { fetchAllBF1942Videos } from "@/lib/youtube-api"
import { parseVideoTags } from "@/lib/video-parser"

const CRON_SECRET = process.env.CRON_SECRET || ""

export const maxDuration = 120 // allow up to 2 minutes for large syncs

export async function GET(request: Request) {
    if (!CRON_SECRET) {
        console.error("CRON_SECRET is not configured")
        return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const tokenFromQuery = searchParams.get("token")
    const tokenFromHeader = request.headers.get("x-cron-secret")
    const bearer = request.headers.get("authorization")
    const tokenFromBearer = bearer?.startsWith("Bearer ") ? bearer.slice(7) : null
    const token = tokenFromQuery || tokenFromHeader || tokenFromBearer

    if (token !== CRON_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // days=0 means fetch ALL (no date filter) — useful for initial seed
    // default 90 days for regular cron syncs
    const days = parseInt(searchParams.get("days") || "90", 10)

    try {
        const videos = await fetchAllBF1942Videos(days)
        let inserted = 0
        let updated = 0
        let skipped = 0

        const client = await pool.connect()
        try {
            // Load blocked video IDs so we skip them
            const blockedRes = await client.query(
                "SELECT video_id FROM community_videos WHERE is_blocked = TRUE"
            )
            const blockedVideoIds = new Set(blockedRes.rows.map((r: { video_id: string }) => r.video_id))

            // Load blocked channel IDs so we skip all their videos
            const blockedChRes = await client.query(
                "SELECT channel_id FROM blocked_channels"
            )
            const blockedChannelIds = new Set(blockedChRes.rows.map((r: { channel_id: string }) => r.channel_id))

            for (const video of videos) {
                // Skip blocked videos and blocked channels
                if (blockedVideoIds.has(video.video_id) || blockedChannelIds.has(video.creator_id)) {
                    skipped++
                    continue
                }

                const { detected_map, detected_tags } = parseVideoTags(video.title, video.description)

                const res = await client.query(
                    `INSERT INTO community_videos
                        (video_id, source, url, title, thumbnail_url, creator_name, creator_id, creator_avatar_url,
                         upload_date, external_views, duration_seconds, description, detected_map, detected_tags,
                         like_count, comment_count, is_short)
                     VALUES ($1, 'youtube', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
                     ON CONFLICT (video_id) DO UPDATE SET
                        external_views = EXCLUDED.external_views,
                        like_count = EXCLUDED.like_count,
                        comment_count = EXCLUDED.comment_count,
                        title = EXCLUDED.title,
                        thumbnail_url = EXCLUDED.thumbnail_url,
                        creator_avatar_url = EXCLUDED.creator_avatar_url,
                        detected_map = EXCLUDED.detected_map,
                        detected_tags = EXCLUDED.detected_tags,
                        is_short = EXCLUDED.is_short
                     WHERE community_videos.is_blocked IS NOT TRUE
                     RETURNING (xmax = 0) AS is_insert`,
                    [
                        video.video_id,
                        video.url,
                        video.title,
                        video.thumbnail_url,
                        video.creator_name,
                        video.creator_id,
                        video.creator_avatar_url,
                        video.upload_date,
                        video.external_views,
                        video.duration_seconds,
                        video.description?.slice(0, 2000) || null,
                        detected_map,
                        detected_tags.length > 0 ? detected_tags : null,
                        video.like_count,
                        video.comment_count,
                        video.is_short,
                    ]
                )

                if (res.rows.length === 0) {
                    skipped++ // blocked video that slipped through
                } else if (res.rows[0]?.is_insert) {
                    inserted++
                } else {
                    updated++
                }
            }
        } finally {
            client.release()
        }

        return NextResponse.json({
            ok: true,
            total_fetched: videos.length,
            inserted,
            updated,
            skipped,
            timestamp: new Date().toISOString(),
        })
    } catch (e) {
        console.error("Video sync error:", e)
        return NextResponse.json({ error: "Sync failed" }, { status: 500 })
    }
}
