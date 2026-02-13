import { NextResponse } from "next/server"
import { pool } from "@/lib/db"
import { fetchAllBF1942Videos } from "@/lib/youtube-api"
import { parseVideoTags } from "@/lib/video-parser"

const CRON_SECRET = process.env.CRON_SECRET || ""

export const maxDuration = 120 // allow up to 2 minutes for large syncs

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")
    if (CRON_SECRET && token !== CRON_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // days=0 means fetch ALL (no date filter) — useful for initial seed
    // days=30 (default) for regular cron syncs
    const days = parseInt(searchParams.get("days") || "90", 10)

    try {
        const videos = await fetchAllBF1942Videos(days)
        let inserted = 0
        let updated = 0

        const client = await pool.connect()
        try {
            for (const video of videos) {
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

                if (res.rows[0]?.is_insert) {
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
            timestamp: new Date().toISOString(),
        })
    } catch (e) {
        console.error("Video sync error:", e)
        return NextResponse.json({ error: "Sync failed" }, { status: 500 })
    }
}
