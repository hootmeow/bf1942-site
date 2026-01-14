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

    try {
        const client = await pool.connect()

        // 1. Check if already claimed/pending by ANYONE
        const checkRes = await client.query(
            `SELECT status, user_id FROM claim_requests WHERE player_id = $1 AND status IN ('PENDING', 'APPROVED')`,
            [playerId]
        )

        if (checkRes.rows.length > 0) {
            const existing = checkRes.rows[0]
            if (existing.user_id === userId) {
                return { ok: false, error: "You have already submitted a claim for this player." }
            }
            return { ok: false, error: "This profile has already been claimed or has a pending request." }
        }

        // 2. Insert Request
        await client.query(
            `INSERT INTO claim_requests (user_id, player_id, discord_username, status)
       VALUES ($1, $2, $3, 'PENDING')`,
            [userId, playerId, session.user.name || "Unknown"]
        )

        client.release()
        revalidatePath(`/player/${encodeURIComponent(playerName)}`)

        return { ok: true, message: "Claim request submitted! An admin will verify it shortly." }

    } catch (e: any) {
        console.error("Claim Error:", e)
        return { ok: false, error: "Database error: " + e.message }
    }
}
