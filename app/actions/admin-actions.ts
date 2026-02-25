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

    // We already have the isUserAdmin helper which checks against the account table
    const isAdmin = await isUserAdmin(session.user.id)
    if (!isAdmin) {
        throw new Error("Unauthorized: Admin access required.")
    }
    return session.user
}

export async function getIsAdmin(): Promise<boolean> {
    const session = await auth()
    if (!session?.user?.id) return false
    return isUserAdmin(session.user.id)
}

export async function approveClaim(claimId: string) { // Changed to string (UUID)
    await checkAdmin()

    const client = await pool.connect()
    try {
        await client.query("BEGIN")

        // 1. Get the claim details (Using claim_id)
        const claimRes = await client.query(`SELECT user_id, player_id FROM claim_requests WHERE claim_id = $1`, [claimId])
        if (claimRes.rows.length === 0) throw new Error("Claim not found")
        const { user_id, player_id } = claimRes.rows[0]

        // 2. Link the user to the player profile
        await client.query(`UPDATE players SET linked_user_id = $1, is_verified = TRUE WHERE player_id = $2`, [user_id, player_id])

        // 3. Update claim status
        await client.query(`UPDATE claim_requests SET status = 'APPROVED', updated_at = NOW() WHERE claim_id = $1`, [claimId])

        // 4. Reject other pending claims for this player (Using claim_id)
        await client.query(`UPDATE claim_requests SET status = 'REJECTED', updated_at = NOW() WHERE player_id = $1 AND claim_id != $2 AND status = 'PENDING'`, [player_id, claimId])

        await client.query("COMMIT")
    } catch (e) {
        await client.query("ROLLBACK")
        throw e
    } finally {
        client.release()
    }

    revalidatePath("/admin/claims")
    // Revalidate the player page effectively? We don't have the player name here easily unless we fetch it.
    // Ideally we should revalidate the player page but we can leave it for now.
}

export async function denyClaim(claimId: string) { // Changed to string (UUID)
    await checkAdmin()

    await pool.query(`UPDATE claim_requests SET status = 'REJECTED', updated_at = NOW() WHERE claim_id = $1`, [claimId])
    revalidatePath("/admin/claims")
}

export async function approveServerClaim(claimId: string) {
    const user = await checkAdmin()

    const client = await pool.connect()
    try {
        await client.query("BEGIN")

        // 1. Get the claim details
        const claimRes = await client.query(`
            SELECT sc.user_id, sc.server_id, s.ip
            FROM server_claims sc
            JOIN servers s ON sc.server_id = s.server_id
            WHERE sc.claim_id = $1
        `, [claimId])
        if (claimRes.rows.length === 0) throw new Error("Server claim not found")
        const { server_id, ip } = claimRes.rows[0]

        // 2. Update claim status and record reviewer
        await client.query(
            `UPDATE server_claims SET status = 'APPROVED', reviewed_at = NOW(), reviewed_by_user_id = $1 WHERE claim_id = $2`,
            [user.id, claimId]
        )

        // 3. Reject other pending claims for this server
        await client.query(
            `UPDATE server_claims SET status = 'DENIED', reviewed_at = NOW(), reviewed_by_user_id = $1 WHERE server_id = $2 AND claim_id != $3 AND status = 'PENDING'`,
            [user.id, server_id, claimId]
        )

        await client.query("COMMIT")
    } catch (e) {
        await client.query("ROLLBACK")
        throw e
    } finally {
        client.release()
    }

    revalidatePath("/admin/server-claims")
    revalidatePath("/servers", "page") // Revalidate all server pages
}

export async function denyServerClaim(claimId: string) {
    const user = await checkAdmin()

    await pool.query(
        `UPDATE server_claims SET status = 'DENIED', reviewed_at = NOW(), reviewed_by_user_id = $1 WHERE claim_id = $2`,
        [user.id, claimId]
    )
    revalidatePath("/admin/server-claims")
}

// ── Challenge Admin Actions ──

export async function createChallenge(data: {
    title: string
    description?: string
    stat_type: string
    target_value: number
    period_type: string
    scope?: string
    icon?: string
    end_time: string
}) {
    await checkAdmin()

    const res = await pool.query(
        `INSERT INTO challenges
            (title, description, stat_type, target_value, scope, period_type,
             start_time, end_time, icon, calculation_mode)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, $8, 'incremental')
         RETURNING challenge_id`,
        [
            data.title,
            data.description || null,
            data.stat_type,
            data.target_value,
            data.scope || "community",
            data.period_type,
            data.end_time,
            data.icon || null,
        ]
    )
    revalidatePath("/admin/challenges")
    revalidatePath("/challenges")
    return { ok: true, challenge_id: res.rows[0].challenge_id }
}

export async function deleteChallenge(challengeId: number) {
    await checkAdmin()

    await pool.query(
        "UPDATE challenges SET is_active = FALSE WHERE challenge_id = $1",
        [challengeId]
    )
    revalidatePath("/admin/challenges")
    revalidatePath("/challenges")
    return { ok: true }
}
