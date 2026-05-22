"use server"

// NOTE: requires DB migration before first use:
//   ALTER TABLE events ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT FALSE;
//   ALTER TABLE organizations ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT FALSE;

import { auth } from "@/lib/auth"
import { pool } from "@/lib/db"
import { isUserAdmin } from "@/lib/admin-auth"
import { revalidatePath } from "next/cache"
import { logAdminAction } from "./audit-log-actions"

async function checkAdmin() {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")
    const isAdmin = await isUserAdmin(session.user.id)
    if (!isAdmin) throw new Error("Admin access required")
    return session.user
}

export async function setEventVisibility(eventId: number, isHidden: boolean) {
    const user = await checkAdmin()

    await pool.query(
        `UPDATE events SET is_hidden = $1, updated_at = NOW() WHERE event_id = $2`,
        [isHidden, eventId]
    )

    await logAdminAction(user.id ?? "", isHidden ? "hide_event" : "unhide_event", "event", String(eventId))
    revalidatePath("/admin/events")
    revalidatePath("/events")
    return { ok: true }
}

export async function setOrgVisibility(orgId: number, isHidden: boolean) {
    const user = await checkAdmin()

    await pool.query(
        `UPDATE organizations SET is_hidden = $1, updated_at = NOW() WHERE org_id = $2`,
        [isHidden, orgId]
    )

    await logAdminAction(user.id ?? "", isHidden ? "hide_org" : "unhide_org", "organization", String(orgId))
    revalidatePath("/admin/orgs")
    revalidatePath("/orgs")
    return { ok: true }
}

export async function getAdminEvents() {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")
    const isAdmin = await isUserAdmin(session.user.id)
    if (!isAdmin) throw new Error("Admin access required")

    const res = await pool.query(`
        SELECT
            e.event_id,
            e.title,
            e.event_type,
            e.event_date,
            e.is_hidden,
            o.name as org_name,
            u.name as organizer_name,
            COUNT(r.event_id) FILTER (WHERE r.status = 'going') as going_count
        FROM events e
        LEFT JOIN organizations o ON e.organizer_org_id = o.org_id
        LEFT JOIN users u ON e.organizer_user_id::text = u.id::text
        LEFT JOIN event_rsvps r ON e.event_id = r.event_id
        GROUP BY e.event_id, e.title, e.event_type, e.event_date, e.is_hidden, o.name, u.name
        ORDER BY e.event_date DESC
        LIMIT 200
    `)

    return { ok: true, events: res.rows }
}

export async function getAdminOrgs() {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")
    const isAdmin = await isUserAdmin(session.user.id)
    if (!isAdmin) throw new Error("Admin access required")

    const res = await pool.query(`
        SELECT
            o.org_id,
            o.name,
            o.tag,
            o.is_hidden,
            o.created_at,
            COUNT(m.user_id) as member_count
        FROM organizations o
        LEFT JOIN org_members m ON o.org_id = m.org_id
        GROUP BY o.org_id, o.name, o.tag, o.is_hidden, o.created_at
        ORDER BY o.created_at DESC
        LIMIT 200
    `)

    return { ok: true, orgs: res.rows }
}
