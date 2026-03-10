"use server"

import { auth } from "@/lib/auth"
import { isUserAdmin } from "@/lib/admin-auth"
import { pool } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Zod schema for input validation
const AddServerSchema = z.object({
    ip: z.string(), // We'll rely on basic string validation for now to avoid complexity
    name: z.string().min(1, "Server name is required").max(100),
})

export type WhitelistedServer = {
    ip: string
    server_name: string | null
    added_by: string | null
    added_at: Date
    is_active: boolean
    is_ignored: boolean
    admin_notes: string | null
    owner_contact: string | null
    // Live server data
    live_server_name: string | null
    port: number | null
    current_state: 'ACTIVE' | 'EMPTY' | 'OFFLINE' | 'UNKNOWN' | null
    current_gametype: string | null
    last_seen: Date | null
    current_player_count: number | null
    current_max_players: number | null
    current_map: string | null
    is_online: boolean
    total_rounds: number | null
}

async function verifyAdmin() {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const isAdmin = await isUserAdmin(session.user.id)
    if (!isAdmin) throw new Error("Forbidden")
    return session.user
}

export async function getWhitelistedServers(): Promise<WhitelistedServer[]> {
    await verifyAdmin()

    const client = await pool.connect()
    try {
        const res = await client.query(`
            SELECT
                ws.ip,
                ws.server_name,
                ws.added_by,
                ws.added_at,
                ws.is_active,
                ws.is_ignored,
                ws.admin_notes,
                ws.owner_contact,
                s.current_server_name AS live_server_name,
                s.port,
                s.current_state,
                s.current_gametype,
                s.last_successful_poll AS last_seen,
                s.current_player_count,
                s.current_max_players,
                s.current_map,
                CASE
                    WHEN s.last_successful_poll > NOW() - INTERVAL '10 minutes' THEN true
                    ELSE false
                END AS is_online,
                (SELECT COUNT(*) FROM rounds r WHERE r.server_id = s.server_id) AS total_rounds
            FROM whitelisted_servers ws
            LEFT JOIN LATERAL (
                SELECT
                    server_id,
                    port,
                    current_server_name,
                    current_state::text AS current_state,
                    current_gametype,
                    current_map,
                    current_player_count,
                    current_max_players,
                    last_successful_poll
                FROM servers
                WHERE ip::text = ws.ip::text
                ORDER BY last_successful_poll DESC NULLS LAST
                LIMIT 1
            ) s ON true
            ORDER BY ws.added_at DESC
        `)
        return res.rows
    } finally {
        client.release()
    }
}

export async function addWhitelistedServer(formData: FormData) {
    const user = await verifyAdmin()

    const rawData = {
        ip: formData.get("ip"),
        name: formData.get("name"),
    }

    const result = AddServerSchema.safeParse(rawData)

    if (!result.success) {
        return { error: "Invalid Input" }
    }

    const { ip, name } = result.data

    const client = await pool.connect()
    try {
        await client.query(
            `INSERT INTO whitelisted_servers (ip, server_name, added_by) 
             VALUES ($1, $2, $3)
             ON CONFLICT (ip) DO UPDATE SET 
                server_name = EXCLUDED.server_name,
                is_active = TRUE,
                is_ignored = FALSE`,
            [ip, name, user.name || "Admin"]
        )
        revalidatePath("/admin/whitelist")
        return { success: true }
    } catch (e: any) {
        console.error("Failed to add server:", e)
        return { error: "Database error: " + e.message }
    } finally {
        client.release()
    }
}

export async function updateServerDetails(ip: string, serverName: string, notes: string, contact: string) {
    await verifyAdmin()

    const client = await pool.connect()
    try {
        await client.query(
            "UPDATE whitelisted_servers SET server_name = $2, admin_notes = $3, owner_contact = $4 WHERE ip = $1",
            [ip, serverName || null, notes, contact]
        )
        revalidatePath("/admin/whitelist")
        return { success: true }
    } catch (e: any) {
        return { error: "Failed to update details" }
    } finally {
        client.release()
    }
}

export async function removeWhitelistedServer(ip: string) {
    await verifyAdmin()

    const client = await pool.connect()
    try {
        // Soft delete by setting is_ignored = TRUE
        await client.query("UPDATE whitelisted_servers SET is_ignored = TRUE, is_active = FALSE WHERE ip = $1", [ip])
        revalidatePath("/admin/whitelist")
        return { success: true }
    } catch (e: any) {
        return { error: "Failed to remove server" }
    } finally {
        client.release()
    }
}

export async function unignoreServer(ip: string) {
    await verifyAdmin()

    const client = await pool.connect()
    try {
        await client.query("UPDATE whitelisted_servers SET is_ignored = FALSE WHERE ip = $1", [ip])
        revalidatePath("/admin/whitelist")
        return { success: true }
    } catch (e: any) {
        return { error: "Failed to unignore server" }
    } finally {
        client.release()
    }
}

export async function toggleServerStatus(ip: string, isActive: boolean) {
    await verifyAdmin()

    const client = await pool.connect()
    try {
        await client.query(
            "UPDATE whitelisted_servers SET is_active = $2 WHERE ip = $1",
            [ip, isActive]
        )
        revalidatePath("/admin/whitelist")
        return { success: true }
    } catch (e: any) {
        return { error: "Failed to update status" }
    } finally {
        client.release()
    }
}
