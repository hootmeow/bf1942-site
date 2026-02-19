"use server"

import { auth } from "@/lib/auth"
import { pool } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { isUserAdmin } from "@/lib/admin-auth"

async function checkAdmin() {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error("Unauthorized: Login required.")
    }
    const isAdmin = await isUserAdmin(session.user.id)
    if (!isAdmin) {
        throw new Error("Unauthorized: Admin access required.")
    }
    return session.user
}

export async function getAdminVideos(includeHidden = true) {
    await checkAdmin()
    const res = await pool.query(
        `SELECT video_id, url, title, thumbnail_url, creator_name, creator_id,
                upload_date, external_views, duration_seconds,
                like_count, comment_count, is_short,
                is_hidden, is_featured, is_blocked, detected_map, detected_tags
         FROM community_videos
         WHERE (is_blocked IS NOT TRUE)
         ${includeHidden ? "" : "AND (is_hidden IS NOT TRUE)"}
         ORDER BY upload_date DESC
         LIMIT 200`
    )
    return res.rows.map((r: Record<string, unknown>) => ({
        ...r,
        upload_date: r.upload_date ? (r.upload_date as Date).toISOString() : null,
    }))
}

export async function getFeaturedVideos() {
    await checkAdmin()
    const res = await pool.query(
        `SELECT video_id, url, title, thumbnail_url, creator_name, creator_id,
                upload_date, external_views, duration_seconds,
                like_count, comment_count, is_short,
                is_hidden, is_featured, is_blocked, detected_map, detected_tags, featured_at
         FROM community_videos
         WHERE is_featured = TRUE AND (is_blocked IS NOT TRUE)
         ORDER BY featured_at DESC NULLS LAST`
    )
    return res.rows.map((r: Record<string, unknown>) => ({
        ...r,
        upload_date: r.upload_date ? (r.upload_date as Date).toISOString() : null,
        featured_at: r.featured_at ? (r.featured_at as Date).toISOString() : null,
    }))
}

export async function getBlockedVideos() {
    await checkAdmin()
    const res = await pool.query(
        `SELECT video_id, url, title, thumbnail_url, creator_name, creator_id,
                upload_date, external_views, blocked_at
         FROM community_videos
         WHERE is_blocked = TRUE
         ORDER BY blocked_at DESC
         LIMIT 200`
    )
    return res.rows.map((r: Record<string, unknown>) => ({
        ...r,
        upload_date: r.upload_date ? (r.upload_date as Date).toISOString() : null,
        blocked_at: r.blocked_at ? (r.blocked_at as Date).toISOString() : null,
    }))
}

export async function moderateVideo(videoId: string, action: "hide" | "unhide" | "feature" | "unfeature") {
    const user = await checkAdmin()

    if (action === "hide") {
        await pool.query(
            "UPDATE community_videos SET is_hidden = TRUE, hidden_by = $1, hidden_at = NOW() WHERE video_id = $2",
            [user.id, videoId]
        )
    } else if (action === "unhide") {
        await pool.query(
            "UPDATE community_videos SET is_hidden = FALSE, hidden_by = NULL, hidden_at = NULL WHERE video_id = $1",
            [videoId]
        )
    } else if (action === "feature") {
        await pool.query(
            "UPDATE community_videos SET is_featured = TRUE, featured_at = NOW() WHERE video_id = $1",
            [videoId]
        )
    } else if (action === "unfeature") {
        await pool.query(
            "UPDATE community_videos SET is_featured = FALSE, featured_at = NULL WHERE video_id = $1",
            [videoId]
        )
    }

    revalidatePath("/admin/videos")
    revalidatePath("/community/highlights")
    return { ok: true }
}

/** Permanently block a video — sync will skip it on future runs */
export async function blockVideo(videoId: string) {
    await checkAdmin()
    await pool.query(
        "UPDATE community_videos SET is_blocked = TRUE, is_hidden = TRUE, blocked_at = NOW() WHERE video_id = $1",
        [videoId]
    )
    revalidatePath("/admin/videos")
    revalidatePath("/community/highlights")
    return { ok: true }
}

/** Unblock a video — sync will update it again */
export async function unblockVideo(videoId: string) {
    await checkAdmin()
    await pool.query(
        "UPDATE community_videos SET is_blocked = FALSE, is_hidden = FALSE, blocked_at = NULL WHERE video_id = $1",
        [videoId]
    )
    revalidatePath("/admin/videos")
    revalidatePath("/community/highlights")
    return { ok: true }
}

/** Block an entire channel — hides all their videos and prevents re-sync */
export async function blockChannel(channelId: string, channelName: string) {
    const user = await checkAdmin()
    await pool.query(
        `INSERT INTO blocked_channels (channel_id, channel_name, blocked_by)
         VALUES ($1, $2, $3)
         ON CONFLICT (channel_id) DO NOTHING`,
        [channelId, channelName, user.id]
    )
    // Hide all existing videos from this channel
    await pool.query(
        "UPDATE community_videos SET is_hidden = TRUE, is_blocked = TRUE, blocked_at = NOW() WHERE creator_id = $1",
        [channelId]
    )
    revalidatePath("/admin/videos")
    revalidatePath("/community/highlights")
    revalidatePath("/community/creators")
    return { ok: true }
}

/** Unblock a channel — unhides their videos and allows re-sync */
export async function unblockChannel(channelId: string) {
    await checkAdmin()
    await pool.query("DELETE FROM blocked_channels WHERE channel_id = $1", [channelId])
    // Unblock their videos
    await pool.query(
        "UPDATE community_videos SET is_hidden = FALSE, is_blocked = FALSE, blocked_at = NULL WHERE creator_id = $1",
        [channelId]
    )
    revalidatePath("/admin/videos")
    revalidatePath("/community/highlights")
    revalidatePath("/community/creators")
    return { ok: true }
}

export async function getBlockedChannels() {
    await checkAdmin()
    const res = await pool.query(
        `SELECT bc.channel_id, bc.channel_name, bc.blocked_at,
                COUNT(cv.video_id) as video_count
         FROM blocked_channels bc
         LEFT JOIN community_videos cv ON cv.creator_id = bc.channel_id
         GROUP BY bc.channel_id, bc.channel_name, bc.blocked_at
         ORDER BY bc.blocked_at DESC`
    )
    return res.rows.map((r: Record<string, unknown>) => ({
        ...r,
        blocked_at: r.blocked_at ? (r.blocked_at as Date).toISOString() : null,
        video_count: Number(r.video_count),
    }))
}
