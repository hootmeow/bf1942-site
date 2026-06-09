import { NextResponse } from "next/server"
import { pool } from "@/lib/db"
import { notifyNewPendingServer } from "@/lib/discord"

const CRON_SECRET = process.env.CRON_SECRET || ""

// Call this every 15 minutes. Notifies Discord for servers auto-discovered
// by the ingest engine in the last 20 minutes (5-min overlap prevents gaps).
// Schedule example (crontab):
//   */15 * * * * curl -s "https://www.bf1942.online/api/cron/notify-new-servers?token=<CRON_SECRET>"
export async function GET(request: Request) {
    if (!CRON_SECRET) {
        return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")
        || request.headers.get("x-cron-secret")
        || request.headers.get("authorization")?.replace("Bearer ", "")

    if (token !== CRON_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await pool.connect()
    try {
        // Find pending servers auto-added by the ingest engine in the last 20 minutes.
        // We use added_by to distinguish ingest engine entries (they use "ingest" or similar)
        // from admin-added ones (which already fired their notification in addWhitelistedServer).
        const res = await client.query(`
            SELECT
                ws.ip,
                ws.server_name,
                ws.added_by,
                ws.added_at,
                s.port,
                s.current_server_name,
                s.current_gametype,
                s.current_state::text AS current_state,
                s.current_player_count,
                s.current_max_players,
                s.current_map
            FROM whitelisted_servers ws
            LEFT JOIN LATERAL (
                SELECT
                    port,
                    current_server_name,
                    current_state,
                    current_gametype,
                    current_map,
                    current_player_count,
                    current_max_players
                FROM servers
                WHERE ip::text = ws.ip::text
                ORDER BY last_successful_poll DESC NULLS LAST
                LIMIT 1
            ) s ON true
            WHERE ws.is_active = FALSE
              AND ws.is_ignored = FALSE
              AND COALESCE(ws.is_blocked, FALSE) = FALSE
              AND ws.added_at > NOW() - INTERVAL '20 minutes'
            ORDER BY ws.added_at DESC
        `)

        const servers = res.rows
        let notified = 0

        for (const server of servers) {
            await notifyNewPendingServer({
                ip: server.ip,
                port: server.port,
                serverName: server.current_server_name || server.server_name,
                gametype: server.current_gametype,
                currentState: server.current_state,
                playerCount: server.current_player_count,
                maxPlayers: server.current_max_players,
                currentMap: server.current_map,
                addedBy: server.added_by,
                isAutoDiscovered: true,
            })
            notified++
        }

        return NextResponse.json({ ok: true, notified, timestamp: new Date().toISOString() })
    } catch (e) {
        console.error("[cron/notify-new-servers] error:", e)
        return NextResponse.json({ error: "Failed" }, { status: 500 })
    } finally {
        client.release()
    }
}
