import { pool } from "@/lib/db"

const ADMIN_IDS = [
    "152870700372197376", // USER PROVIDED ID
    process.env.ADMIN_DISCORD_IDS, // User uses plural in env
    process.env.ADMIN_DISCORD_ID
].flatMap(id => id ? id.split(',') : []).filter(Boolean)

const VIEWER_IDS = [
    process.env.VIEWER_DISCORD_IDS,
    process.env.VIEWER_DISCORD_ID,
].flatMap(id => id ? id.split(',') : []).filter(Boolean)

export async function isUserAdmin(userId: string): Promise<boolean> {
    try {
        const discordId = await getDiscordId(userId)
        return discordId !== null && ADMIN_IDS.includes(discordId)
    } catch (e) {
        console.error("Admin Check Error:", e)
        return false
    }
}

async function getDiscordId(userId: string): Promise<string | null> {
    const client = await pool.connect()
    try {
        let actualUserId = userId
        if (userId.includes('@')) {
            const userRes = await client.query(`SELECT id FROM users WHERE email = $1`, [userId])
            if (userRes.rows.length === 0) return null
            actualUserId = userRes.rows[0].id
        }
        const res = await client.query(
            `SELECT "providerAccountId" FROM accounts WHERE "userId" = $1 AND provider = 'discord'`,
            [actualUserId]
        )
        return res.rows[0]?.providerAccountId ?? null
    } finally {
        client.release()
    }
}

export async function isUserViewer(userId: string): Promise<boolean> {
    try {
        const discordId = await getDiscordId(userId)
        if (!discordId) return false
        return VIEWER_IDS.includes(discordId) || ADMIN_IDS.includes(discordId)
    } catch (e) {
        console.error("Viewer Check Error:", e)
        return false
    }
}
