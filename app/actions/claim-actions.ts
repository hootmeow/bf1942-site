"use server"

import { auth } from "@/lib/auth"
import { pool } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function submitClaimRequest(playerId: number, playerName: string) {
    const session = await auth()

    if (!session?.user?.id) {
        return { ok: false, error: "You must be logged in to claim a profile." }
    }

    const userId = session.user.id

    const client = await pool.connect()
    try {
        await client.query('BEGIN')

        // Atomic check-and-insert: the WHERE NOT EXISTS prevents duplicate pending/approved
        // claims even under concurrent submissions (no separate SELECT needed).
        const res = await client.query(
            `INSERT INTO claim_requests (user_id, player_id, discord_username, status)
             SELECT $1, $2, $3, 'PENDING'
             WHERE NOT EXISTS (
                 SELECT 1 FROM claim_requests
                 WHERE player_id = $2 AND status IN ('PENDING', 'APPROVED')
             )
             RETURNING claim_id`,
            [userId, playerId, session.user.name || "Unknown"]
        )

        await client.query('COMMIT')

        if (res.rowCount === 0) {
            // Something already exists — check whose it is for a useful message
            const existing = await client.query(
                `SELECT user_id FROM claim_requests WHERE player_id = $1 AND status IN ('PENDING', 'APPROVED') LIMIT 1`,
                [playerId]
            )
            if (existing.rows[0]?.user_id === userId) {
                return { ok: false, error: "You have already submitted a claim for this player." }
            }
            return { ok: false, error: "This profile has already been claimed or has a pending request." }
        }

        revalidatePath(`/player/${encodeURIComponent(playerName)}`)
        return { ok: true, message: "Claim request submitted! An admin will verify it shortly." }

    } catch (e: any) {
        await client.query('ROLLBACK').catch(() => {})
        console.error("Claim Error:", e)
        return { ok: false, error: "An unexpected error occurred." }
    } finally {
        client.release()
    }
}

export async function submitServerClaimRequest(serverId: number, serverName: string) {
    const session = await auth()

    if (!session?.user?.id) {
        return { ok: false, error: "You must be logged in to claim a server." }
    }

    const userId = session.user.id

    const client = await pool.connect()
    try {
        await client.query('BEGIN')

        const res = await client.query(
            `INSERT INTO server_claims (user_id, server_id, discord_username, status)
             SELECT $1, $2, $3, 'PENDING'
             WHERE NOT EXISTS (
                 SELECT 1 FROM server_claims
                 WHERE server_id = $2 AND status IN ('PENDING', 'APPROVED')
             )
             RETURNING claim_id`,
            [userId, serverId, session.user.name || "Unknown"]
        )

        await client.query('COMMIT')

        if (res.rowCount === 0) {
            const existing = await client.query(
                `SELECT user_id FROM server_claims WHERE server_id = $1 AND status IN ('PENDING', 'APPROVED') LIMIT 1`,
                [serverId]
            )
            if (existing.rows[0]?.user_id === userId) {
                return { ok: false, error: "You have already submitted a claim for this server." }
            }
            return { ok: false, error: "This server has already been claimed or has a pending request." }
        }

        revalidatePath(`/servers/${encodeURIComponent(serverName)}`)
        return { ok: true, message: "Server claim request submitted! An admin will verify it shortly." }

    } catch (e: any) {
        await client.query('ROLLBACK').catch(() => {})
        console.error("Server Claim Error:", e)
        return { ok: false, error: "An unexpected error occurred." }
    } finally {
        client.release()
    }
}
