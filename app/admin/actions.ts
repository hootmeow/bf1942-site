'use server'

import { auth } from "@/lib/auth"
import { isUserAdmin } from "@/lib/admin-auth"
import { pool } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function ensureAdmin() {
    const session = await auth()
    if (!session?.user?.id) {
        redirect("/")
    }
    const isAdmin = await isUserAdmin(session.user.id)
    if (!isAdmin) {
        redirect("/")
    }
    return session.user
}

export async function getAdminRounds(page: number = 1, pageSize: number = 50, search?: string) {
    await ensureAdmin()

    const offset = (page - 1) * pageSize
    const client = await pool.connect()
    try {
        let whereClause = ""
        const params: any[] = []
        if (search) {
            params.push(`%${search}%`)
            whereClause = `
                WHERE r.map_name ILIKE $1 
                OR r.round_id::text ILIKE $1
                OR s.current_server_name ILIKE $1
                OR EXISTS (
                    SELECT 1 
                    FROM round_player_stats rps 
                    JOIN players p ON rps.player_id = p.player_id
                    WHERE rps.round_id = r.round_id 
                    AND (p.last_known_name ILIKE $1 OR p.canonical_name ILIKE $1)
                )
            `
        }

        params.push(pageSize) // $2 (or $1 if no search)
        params.push(offset)   // $3 (or $2 if no search)

        let limitIndex = search ? "$2" : "$1"
        let offsetIndex = search ? "$3" : "$2"

        const roundsRes = await client.query(`
            SELECT 
                r.round_id::text, 
                r.server_id::text, 
                r.map_name, 
                r.start_time, 
                r.end_time, 
                r.duration_seconds, 
                r.winner_team, 
                r.gamemode,
                r.is_ranked,
                COALESCE(s.current_server_name, 'Unknown Server') as server_name
            FROM rounds r
            LEFT JOIN servers s ON r.server_id = s.server_id
            ${whereClause}
            ORDER BY r.start_time DESC
            LIMIT ${limitIndex} OFFSET ${offsetIndex}
        `, params)

        const countQuery = `
            SELECT COUNT(*) 
            FROM rounds r 
            LEFT JOIN servers s ON r.server_id = s.server_id
            ${whereClause}
        `
        const countParams = search ? [`%${search}%`] : []
        const countRes = await client.query(countQuery, countParams)
        const totalCount = parseInt(countRes.rows[0].count, 10)

        return {
            rounds: roundsRes.rows,
            totalCount,
            page,
            pageSize,
            totalPages: Math.ceil(totalCount / pageSize)
        }
    } finally {
        client.release()
    }
}

export async function deleteRound(roundId: string) {
    await ensureAdmin()

    if (!/^\d+$/.test(roundId)) {
        console.error(`[Admin] Invalid round ID for deletion: ${roundId}`)
        return { success: false, error: "Invalid round ID" }
    }

    const client = await pool.connect()
    try {
        await client.query('BEGIN')

        const statsRes = await client.query('DELETE FROM round_player_stats WHERE round_id = $1', [roundId])
        console.log(`[Admin] Deleted ${statsRes.rowCount} player stats rows for round ${roundId}`)

        const roundRes = await client.query('DELETE FROM rounds WHERE round_id = $1', [roundId])
        console.log(`[Admin] Deleted ${roundRes.rowCount} round rows for round ${roundId}`)

        if ((roundRes.rowCount ?? 0) === 0) {
            await client.query('ROLLBACK')
            return { success: false, error: "Round not found or already deleted" }
        }

        await client.query('COMMIT')
        revalidatePath('/admin/rounds')
        return { success: true, deletedCallback: true }
    } catch (e) {
        await client.query('ROLLBACK')
        console.error("Failed to delete round", e)
        return { success: false, error: "Failed to delete round" }
    } finally {
        client.release()
    }
}

export async function getRoundDetails(roundId: string) {
    await ensureAdmin()
    const client = await pool.connect()
    try {
        const roundRes = await client.query(`
            SELECT 
                r.round_id::text, 
                r.server_id::text, 
                r.map_name, 
                r.start_time, 
                r.end_time, 
                r.duration_seconds, 
                r.winner_team, 
                r.gamemode,
                COALESCE(s.current_server_name, 'Unknown Server') as server_name
            FROM rounds r 
            LEFT JOIN servers s ON r.server_id = s.server_id
            WHERE r.round_id = $1
        `, [roundId])

        if (roundRes.rows.length === 0) return null
        return roundRes.rows[0]
    } finally {
        client.release()
    }
}

export async function getRoundPlayers(roundId: string) {
    await ensureAdmin()
    const client = await pool.connect()
    try {
        const statsRes = await client.query(`
            SELECT 
                rps.final_score as score,
                rps.final_kills as kills,
                rps.final_deaths as deaths,
                rps.team,
                COALESCE(p.last_known_name, p.canonical_name, 'Unknown') as player_name
            FROM round_player_stats rps
            LEFT JOIN players p ON rps.player_id = p.player_id
            WHERE rps.round_id = $1
            ORDER BY rps.final_score DESC
        `, [roundId])
        return statsRes.rows
    } catch (e) {
        console.error("Failed to fetch round players", e)
        return []
    } finally {
        client.release()
    }
}

export async function getVerifiedPlayers() {
    await ensureAdmin()
    const client = await pool.connect()
    try {
        const res = await client.query(`
            SELECT 
                player_id::text, 
                canonical_name, 
                last_known_name, 
                is_verified, 
                last_seen,
                linked_user_id
            FROM players 
            WHERE is_verified = true 
            ORDER BY canonical_name ASC
        `)
        return res.rows
    } finally {
        client.release()
    }
}

export async function searchPlayers(query: string) {
    await ensureAdmin()
    if (!query || query.length < 2) return []

    const client = await pool.connect()
    try {
        const res = await client.query(`
            SELECT 
                player_id::text, 
                canonical_name, 
                last_known_name, 
                is_verified
            FROM players 
            WHERE canonical_name ILIKE $1 OR last_known_name ILIKE $1
            LIMIT 10
        `, [`%${query}%`])
        return res.rows
    } finally {
        client.release()
    }
}

export async function toggleVerification(playerId: string, isVerified: boolean) {
    await ensureAdmin()
    const client = await pool.connect()
    try {
        await client.query(`
            UPDATE players 
            SET is_verified = $1 
            WHERE player_id = $2
        `, [isVerified, playerId])

        revalidatePath('/admin/players/verified')
        return { success: true }
    } catch (e) {
        console.error("Failed to toggle verification", e)
        return { success: false, error: "Failed to update player" }
    } finally {
        client.release()
    }
}

export async function deleteDigest(weekNumber: number) {
    await ensureAdmin()
    const client = await pool.connect()
    try {
        const result = await client.query(
            'DELETE FROM weekly_digests WHERE week_number = $1',
            [weekNumber]
        )
        revalidatePath('/admin/digests')
        revalidatePath('/news')
        return { ok: true, deleted: (result.rowCount ?? 0) > 0 }
    } catch (e) {
        console.error("Failed to delete digest", e)
        return { ok: false, error: "Failed to delete digest" }
    } finally {
        client.release()
    }
}
