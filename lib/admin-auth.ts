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
        const client = await pool.connect()

        // Handle case where userId might be email instead of UUID
        // First try to find user by email if userId looks like an email
        let actualUserId = userId
        if (userId.includes('@')) {
            const userRes = await client.query(
                `SELECT id FROM users WHERE email = $1`,
                [userId]
            )
            if (userRes.rows.length === 0) {
                client.release()
                return false
            }
            actualUserId = userRes.rows[0].id
        }

        // Check if the user has a Discord account linked that matches the Admin list
        // Note: NextAuth Postgres adapter uses quoted camelCase for column names
        const res = await client.query(
            `SELECT "providerAccountId"
             FROM accounts
             WHERE "userId" = $1 AND provider = 'discord'`,
            [actualUserId]
        )
        client.release()

        if (res.rows.length === 0) return false

        const discordId = res.rows[0].providerAccountId
        return ADMIN_IDS.includes(discordId)
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
