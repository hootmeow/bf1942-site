"use server"

import { auth } from "@/lib/auth"
import { pool } from "@/lib/db"
import { isUserAdmin } from "@/lib/admin-auth"
import { revalidatePath } from "next/cache"

async function checkAdmin() {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")
    const isAdmin = await isUserAdmin(session.user.id)
    if (!isAdmin) throw new Error("Admin access required")
    return session.user
}

export async function getWatchlistPlayers() {
    await checkAdmin()
    const res = await pool.query(`
        SELECT
            pf.flag_id,
            pf.player_id,
            pf.flag_type,
            pf.severity,
            pf.details,
            pf.created_at,
            pf.resolved,
            COALESCE(p.canonical_name, p.last_known_name) as player_name
        FROM player_flags pf
        JOIN players p ON pf.player_id = p.player_id
        WHERE pf.resolved = FALSE
        ORDER BY
            CASE pf.severity
                WHEN 'critical' THEN 1
                WHEN 'high' THEN 2
                WHEN 'medium' THEN 3
                ELSE 4
            END,
            pf.created_at DESC
    `)
    return { ok: true, flags: res.rows }
}

export async function addPlayerToWatchlist(data: {
    player_id: number
    reason: string
    severity: string
    notes?: string
}) {
    const user = await checkAdmin()

    await pool.query(`
        INSERT INTO player_flags (player_id, flag_type, severity, details)
        VALUES ($1, 'watchlist', $2, $3)
    `, [
        data.player_id,
        data.severity || "medium",
        JSON.stringify({ reason: data.reason, notes: data.notes || null, added_by: user.id }),
    ])

    revalidatePath("/admin/players/watchlist")
    return { ok: true }
}

export async function resolvePlayerFlag(flagId: number) {
    await checkAdmin()

    await pool.query(
        `UPDATE player_flags SET resolved = TRUE WHERE flag_id = $1`,
        [flagId]
    )

    revalidatePath("/admin/players/watchlist")
    return { ok: true }
}

export async function searchPlayers(query: string) {
    await checkAdmin()
    if (!query || query.length < 2) return { ok: true, players: [] }

    const res = await pool.query(`
        SELECT player_id, COALESCE(canonical_name, last_known_name) as name
        FROM players
        WHERE last_known_name ILIKE $1 OR canonical_name ILIKE $1
        ORDER BY last_known_name
        LIMIT 10
    `, [`%${query}%`])

    return { ok: true, players: res.rows }
}
