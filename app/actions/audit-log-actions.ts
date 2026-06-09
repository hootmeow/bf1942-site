"use server"

import { auth } from "@/lib/auth"
import { pool } from "@/lib/db"
import { isUserAdmin } from "@/lib/admin-auth"

let tableReady = false

async function ensureTable() {
    if (tableReady) return
    await pool.query(`
        CREATE TABLE IF NOT EXISTS admin_audit_log (
            log_id BIGSERIAL PRIMARY KEY,
            admin_user_id TEXT NOT NULL,
            action_type TEXT NOT NULL,
            target_type TEXT,
            target_id TEXT,
            details JSONB,
            created_at TIMESTAMPTZ DEFAULT NOW()
        )
    `)
    await pool.query(`
        CREATE INDEX IF NOT EXISTS admin_audit_log_created_idx ON admin_audit_log (created_at DESC)
    `)
    tableReady = true
}

export async function logAdminAction(
    adminUserId: string,
    actionType: string,
    targetType?: string,
    targetId?: string,
    details?: Record<string, unknown>
) {
    try {
        await ensureTable()
        await pool.query(
            `INSERT INTO admin_audit_log (admin_user_id, action_type, target_type, target_id, details)
             VALUES ($1, $2, $3, $4, $5)`,
            [adminUserId, actionType, targetType ?? null, targetId ?? null, details ? JSON.stringify(details) : null]
        )
    } catch {
        // Audit log failures are non-fatal
    }
}

export async function getAuditLog(limit = 100, offset = 0) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")
    const isAdmin = await isUserAdmin(session.user.id)
    if (!isAdmin) throw new Error("Admin access required")

    try {
        await ensureTable()
        const [rows, countRes] = await Promise.all([
            pool.query(`
                SELECT
                    aal.log_id,
                    aal.admin_user_id,
                    COALESCE(u.name, u.email, aal.admin_user_id) AS admin_display_name,
                    aal.action_type,
                    aal.target_type,
                    aal.target_id,
                    aal.details,
                    aal.created_at
                FROM admin_audit_log aal
                LEFT JOIN users u ON u.id::text = aal.admin_user_id
                ORDER BY aal.created_at DESC
                LIMIT $1 OFFSET $2
            `, [limit, offset]),
            pool.query(`SELECT COUNT(*) FROM admin_audit_log`),
        ])
        return {
            ok: true,
            entries: rows.rows,
            total: parseInt(countRes.rows[0].count, 10),
        }
    } catch (e) {
        return { ok: false, entries: [], total: 0, error: String(e) }
    }
}
