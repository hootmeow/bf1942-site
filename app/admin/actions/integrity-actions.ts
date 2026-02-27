"use server"

import { auth } from "@/lib/auth"
import { isUserAdmin } from "@/lib/admin-auth"
import { pool } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

async function ensureAdmin() {
    const session = await auth()
    if (!session?.user?.email) redirect("/login")

    const isAdmin = await isUserAdmin(session.user.email)
    if (!isAdmin) redirect("/")
}

export async function getReviewQueue(status: string = 'pending', limit: number = 50) {
    await ensureAdmin()
    const client = await pool.connect()
    try {
        const result = await client.query(`
            SELECT
                rq.queue_id,
                rq.item_type,
                rq.item_id,
                rq.flag_reason,
                rq.flag_details,
                rq.risk_score,
                rq.status,
                rq.created_at,
                rq.reviewed_at,
                rq.action_taken,
                rq.admin_notes,
                CASE
                    WHEN rq.item_type = 'round' THEN (
                        SELECT json_build_object(
                            'round_id', r.round_id,
                            'map_name', r.map_name,
                            'server_name', COALESCE(s.current_server_name, 'Unknown'),
                            'start_time', r.start_time,
                            'is_ranked', r.is_ranked
                        )
                        FROM rounds r
                        LEFT JOIN servers s ON r.server_id = s.server_id
                        WHERE r.round_id = rq.item_id
                    )
                    WHEN rq.item_type = 'player' THEN (
                        SELECT json_build_object(
                            'player_id', p.player_id,
                            'canonical_name', p.canonical_name,
                            'last_known_name', p.last_known_name
                        )
                        FROM players p
                        WHERE p.player_id = rq.item_id
                    )
                    WHEN rq.item_type = 'server' THEN (
                        SELECT json_build_object(
                            'server_id', s.server_id,
                            'server_name', s.current_server_name,
                            'ip', s.ip::text
                        )
                        FROM servers s
                        WHERE s.server_id = rq.item_id
                    )
                END as item_details
            FROM review_queue rq
            WHERE ($1 = 'all' OR rq.status = $1)
            ORDER BY rq.risk_score DESC, rq.created_at DESC
            LIMIT $2
        `, [status, limit])

        return { ok: true, items: result.rows }
    } catch (e) {
        console.error("Failed to get review queue", e)
        return { ok: false, error: "Failed to load review queue" }
    } finally {
        client.release()
    }
}

export async function reviewQueueItem(
    queueId: string,
    action: 'approve' | 'unrank' | 'flag_player' | 'blacklist_server' | 'dismiss',
    notes?: string
) {
    await ensureAdmin()
    const client = await pool.connect()
    try {
        await client.query('BEGIN')

        // Get the queue item
        const item = await client.query(`
            SELECT item_type, item_id FROM review_queue WHERE queue_id = $1
        `, [queueId])

        if (item.rows.length === 0) {
            throw new Error("Queue item not found")
        }

        const { item_type, item_id } = item.rows[0]

        // Take action based on type
        let actionTaken: string = action
        let newStatus = 'dismissed'

        if (action === 'approve') {
            newStatus = 'approved'
            actionTaken = 'approve'
        } else if (action === 'unrank' && item_type === 'round') {
            await client.query(`UPDATE rounds SET is_ranked = FALSE, needs_review = FALSE WHERE round_id = $1`, [item_id])
            newStatus = 'actioned'
            actionTaken = 'unranked'
        } else if (action === 'flag_player' && item_type === 'player') {
            await client.query(`
                INSERT INTO player_flags (player_id, flag_type, severity, details)
                VALUES ($1, 'admin_flagged', 'high', $2)
            `, [item_id, JSON.stringify({ notes })])
            newStatus = 'actioned'
            actionTaken = 'player_flagged'
        } else if (action === 'blacklist_server' && item_type === 'server') {
            await client.query(`
                INSERT INTO server_trustlist (server_id, trust_level, reason, auto_unrank_rounds)
                VALUES ($1, 'blacklisted', $2, TRUE)
                ON CONFLICT (server_id) DO UPDATE SET
                    trust_level = 'blacklisted',
                    reason = $2,
                    auto_unrank_rounds = TRUE
            `, [item_id, notes || 'Admin blacklisted'])

            // Unrank all rounds from this server
            await client.query(`
                UPDATE rounds SET is_ranked = FALSE
                WHERE server_id = $1 AND is_ranked = TRUE
            `, [item_id])
            newStatus = 'actioned'
            actionTaken = 'server_blacklisted'
        } else if (action === 'dismiss') {
            newStatus = 'dismissed'
            actionTaken = 'dismissed'
        }

        // Update queue item
        await client.query(`
            UPDATE review_queue
            SET status = $1, action_taken = $2, admin_notes = $3, reviewed_at = NOW()
            WHERE queue_id = $4
        `, [newStatus, actionTaken, notes, queueId])

        await client.query('COMMIT')

        revalidatePath('/admin/integrity')
        revalidatePath('/admin/review-queue')

        return { ok: true, action: actionTaken }
    } catch (e) {
        await client.query('ROLLBACK')
        console.error("Failed to review queue item", e)
        return { ok: false, error: String(e) }
    } finally {
        client.release()
    }
}

export async function getIntegrityStats() {
    await ensureAdmin()
    const client = await pool.connect()
    try {
        // Get overall stats
        const stats = await client.query(`
            SELECT
                (SELECT COUNT(*) FROM review_queue WHERE status = 'pending') as pending_reviews,
                (SELECT COUNT(*) FROM review_queue WHERE status = 'pending' AND risk_score >= 70) as high_risk_items,
                (SELECT COUNT(*) FROM server_trustlist WHERE trust_level = 'blacklisted') as blacklisted_servers,
                (SELECT COUNT(*) FROM player_flags WHERE resolved = FALSE) as flagged_players,
                (SELECT COUNT(*) FROM rounds WHERE needs_review = TRUE) as rounds_needing_review
        `)

        // Get recent detection runs
        const recentRuns = await client.query(`
            SELECT detection_type, items_flagged, run_at, run_duration_ms
            FROM integrity_detection_runs
            ORDER BY run_at DESC
            LIMIT 10
        `)

        return {
            ok: true,
            stats: stats.rows[0],
            recentRuns: recentRuns.rows
        }
    } catch (e) {
        console.error("Failed to get integrity stats", e)
        return { ok: false, error: "Failed to load stats" }
    } finally {
        client.release()
    }
}

export async function bulkReviewAction(
    queueIds: string[],
    action: 'approve' | 'unrank' | 'dismiss'
) {
    await ensureAdmin()

    const results = []
    for (const queueId of queueIds) {
        const result = await reviewQueueItem(queueId, action)
        results.push({ queueId, ...result })
    }

    return { ok: true, results }
}
