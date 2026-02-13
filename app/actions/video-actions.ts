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
                is_hidden, is_featured, detected_map, detected_tags
         FROM community_videos
         ${includeHidden ? "" : "WHERE (is_hidden IS NOT TRUE)"}
         ORDER BY upload_date DESC
         LIMIT 200`
    )
    return res.rows.map((r: Record<string, unknown>) => ({
        ...r,
        upload_date: r.upload_date ? (r.upload_date as Date).toISOString() : null,
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

export async function deleteVideo(videoId: string) {
    await checkAdmin()
    await pool.query("DELETE FROM community_videos WHERE video_id = $1", [videoId])
    revalidatePath("/admin/videos")
    revalidatePath("/community/highlights")
    return { ok: true }
}
