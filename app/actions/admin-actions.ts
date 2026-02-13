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
