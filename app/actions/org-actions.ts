"use server"

import { auth } from "@/lib/auth"
import { pool } from "@/lib/db"
import { isUserAdmin } from "@/lib/admin-auth"
import { revalidatePath } from "next/cache"

export async function createOrganization(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Login required" }

    const name = (formData.get("name") as string)?.trim()
    const tag = (formData.get("tag") as string)?.trim()
    const description = (formData.get("description") as string)?.trim()
    const bannerUrl = (formData.get("bannerUrl") as string)?.trim()
    const discordUrl = (formData.get("discordUrl") as string)?.trim()
    const websiteUrl = (formData.get("websiteUrl") as string)?.trim()

    if (!name || name.length > 100) return { error: "Name required, max 100 chars" }
    if (tag && tag.length > 10) return { error: "Tag max 10 chars" }

    const client = await pool.connect()
    try {
        await client.query("BEGIN")
        const res = await client.query(
            `INSERT INTO organizations (name, tag, description, banner_url, created_by, discord_url, website_url)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING org_id`,
            [name, tag || null, description || null, bannerUrl || null, session.user.id, discordUrl || null, websiteUrl || null]
        )
        const orgId = res.rows[0].org_id
        await client.query(
            `INSERT INTO org_members (org_id, user_id, role) VALUES ($1, $2, 'leader')`,
            [orgId, session.user.id]
        )
        await client.query("COMMIT")
        revalidatePath("/orgs")
        return { ok: true, orgId }
    } catch (e: any) {
        await client.query("ROLLBACK")
        if (e.code === "23505") return { error: "An organization with this name already exists" }
        console.error("Create org error:", e)
        return { error: "Failed to create organization" }
    } finally {
        client.release()
    }
}

export async function updateOrganization(orgId: number, formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Login required" }

    const isAdmin = await isUserAdmin(session.user.id)
    const client = await pool.connect()

    try {
        // Check if user is leader
        const memberRes = await client.query(
            "SELECT role FROM org_members WHERE org_id = $1 AND user_id = $2",
            [orgId, session.user.id]
        )
        if ((!memberRes.rows[0] || memberRes.rows[0].role !== "leader") && !isAdmin) {
            return { error: "Only leaders or admins can edit" }
        }

        const name = (formData.get("name") as string)?.trim()
        const tag = (formData.get("tag") as string)?.trim()
        const description = (formData.get("description") as string)?.trim()
        const bannerUrl = (formData.get("bannerUrl") as string)?.trim()
        const discordUrl = (formData.get("discordUrl") as string)?.trim()
        const websiteUrl = (formData.get("websiteUrl") as string)?.trim()

        if (!name) return { error: "Name required" }

        await client.query(
            `UPDATE organizations SET name = $1, tag = $2, description = $3, banner_url = $4,
                    discord_url = $5, website_url = $6, updated_at = NOW()
             WHERE org_id = $7`,
            [name, tag || null, description || null, bannerUrl || null, discordUrl || null, websiteUrl || null, orgId]
        )
        revalidatePath(`/orgs/${orgId}`)
        return { ok: true }
    } catch (e) {
        console.error("Update org error:", e)
        return { error: "Failed to update organization" }
    } finally {
        client.release()
    }
}

export async function deleteOrganization(orgId: number) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Login required" }

    const isAdmin = await isUserAdmin(session.user.id)
    const client = await pool.connect()

    try {
        const memberRes = await client.query(
            "SELECT role FROM org_members WHERE org_id = $1 AND user_id = $2",
            [orgId, session.user.id]
        )
        if ((!memberRes.rows[0] || memberRes.rows[0].role !== "leader") && !isAdmin) {
            return { error: "Only leaders or admins can delete" }
        }

        await client.query("DELETE FROM organizations WHERE org_id = $1", [orgId])
        revalidatePath("/orgs")
        return { ok: true }
    } catch (e) {
        console.error("Delete org error:", e)
        return { error: "Failed to delete" }
    } finally {
        client.release()
    }
}

export async function removeMember(orgId: number, targetUserId: number) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Login required" }

    const isSelf = String(session.user.id) === String(targetUserId)
    if (!isSelf) {
        const client = await pool.connect()
        try {
            const res = await client.query(
                "SELECT role FROM org_members WHERE org_id = $1 AND user_id = $2",
                [orgId, session.user.id]
            )
            if (!res.rows[0] || !["leader", "officer"].includes(res.rows[0].role)) {
                return { error: "Not authorized" }
            }
        } finally {
            client.release()
        }
    }

    await pool.query(
        "DELETE FROM org_members WHERE org_id = $1 AND user_id = $2",
        [orgId, targetUserId]
    )
    revalidatePath(`/orgs/${orgId}`)
    return { ok: true }
}

export async function updateMemberRole(orgId: number, targetUserId: number, newRole: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Login required" }

    if (!["leader", "officer", "member"].includes(newRole)) return { error: "Invalid role" }

    const client = await pool.connect()
    try {
        const res = await client.query(
            "SELECT role FROM org_members WHERE org_id = $1 AND user_id = $2",
            [orgId, session.user.id]
        )
        if (!res.rows[0] || res.rows[0].role !== "leader") {
            return { error: "Only leaders can change roles" }
        }

        await client.query(
            "UPDATE org_members SET role = $1 WHERE org_id = $2 AND user_id = $3",
            [newRole, orgId, targetUserId]
        )
        revalidatePath(`/orgs/${orgId}`)
        return { ok: true }
    } catch (e) {
        console.error("Update role error:", e)
        return { error: "Failed to update role" }
    } finally {
        client.release()
    }
}
