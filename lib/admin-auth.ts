import { pool } from "@/lib/db"

const ADMIN_IDS = [
    "152870700372197376", // USER PROVIDED ID
    process.env.ADMIN_DISCORD_IDS, // User uses plural in env
    process.env.ADMIN_DISCORD_ID
].flatMap(id => id ? id.split(',') : []).filter(Boolean)

export async function isUserAdmin(userId: string): Promise<boolean> {
    try {
        const client = await pool.connect()
        // Check if the user has a Discord account linked that matches the Admin list
        // Note: NextAuth Postgres adapter uses quoted camelCase for column names
        const res = await client.query(
            `SELECT "providerAccountId" 
             FROM accounts 
             WHERE "userId" = $1 AND provider = 'discord'`,
            [userId]
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
