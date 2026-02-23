"use server"

import { auth } from "@/lib/auth"
import { pool } from "@/lib/db"
import { isUserAdmin } from "@/lib/admin-auth"
import { revalidatePath } from "next/cache"

async function checkAdmin() {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error("Unauthorized: Login required.")
    }
    const isAdmin = await isUserAdmin(session.user.id)
    if (!isAdmin) {
        throw new Error("Unauthorized: Admin access required.")
    }
    return session.user
}

export async function getBotReports(page: number = 1, status: string = "pending") {
    await checkAdmin()

    const pageSize = 20
    const offset = (page - 1) * pageSize
    const client = await pool.connect()

    try {
        const whereClause = status !== "all" ? "WHERE br.status = $1" : ""
        const params: any[] = status !== "all" ? [status] : []

        const limitIdx = status !== "all" ? "$2" : "$1"
        const offsetIdx = status !== "all" ? "$3" : "$2"
        params.push(pageSize, offset)

        const res = await client.query(`
            SELECT
                br.report_id::text,
                br.round_id::text,
                br.reason,
                br.detection_details,
                br.status,
                br.reviewed_at,
                br.created_at,
                r.map_name,
                r.gamemode,
                r.start_time,
                r.end_time,
                r.duration_seconds,
                COALESCE(s.current_server_name, 'Unknown') as server_name
            FROM bot_round_reports br
            JOIN rounds r ON br.round_id = r.round_id
            LEFT JOIN servers s ON r.server_id = s.server_id
            ${whereClause}
            ORDER BY br.created_at DESC
            LIMIT ${limitIdx} OFFSET ${offsetIdx}
        `, params)

        const countParams = status !== "all" ? [status] : []
        const countRes = await client.query(`
            SELECT COUNT(*) FROM bot_round_reports br ${whereClause}
        `, countParams)
        const total = parseInt(countRes.rows[0].count, 10)

        return {
            reports: res.rows,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        }
    } finally {
        client.release()
    }
}

export async function reviewBotReport(reportId: string, newStatus: "approved" | "dismissed") {
    const user = await checkAdmin()

    const client = await pool.connect()
    try {
        await client.query("BEGIN")

        const reportRes = await client.query(
            "SELECT report_id, round_id FROM bot_round_reports WHERE report_id = $1",
            [reportId]
        )
        if (reportRes.rows.length === 0) {
            throw new Error("Report not found")
        }

        const roundId = reportRes.rows[0].round_id

        await client.query(
            "UPDATE bot_round_reports SET status = $1, reviewed_by = $2, reviewed_at = NOW() WHERE report_id = $3",
            [newStatus, user.id, reportId]
        )

        if (newStatus === "approved") {
            await client.query(
                "UPDATE rounds SET is_ranked = FALSE WHERE round_id = $1",
                [roundId]
            )
        }

        await client.query("COMMIT")
        revalidatePath("/admin/bot-reports")
        return { success: true }
    } catch (e) {
        await client.query("ROLLBACK")
        throw e
    } finally {
        client.release()
    }
}
