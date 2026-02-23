"use server"

import { auth } from "@/lib/auth"
import { pool } from "@/lib/db"
import { isUserAdmin } from "@/lib/admin-auth"
import { revalidatePath } from "next/cache"

export async function createEvent(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Login required" }

    const title = (formData.get("title") as string)?.trim()
    const description = (formData.get("description") as string)?.trim()
    const eventType = (formData.get("eventType") as string) || "other"
    const eventDate = formData.get("eventDate") as string
    const endDate = (formData.get("endDate") as string) || null
    const organizerOrgId = formData.get("organizerOrgId") ? Number(formData.get("organizerOrgId")) : null
    const bannerUrl = (formData.get("bannerUrl") as string)?.trim()
    const recurrenceFrequency = (formData.get("recurrenceFrequency") as string)?.trim() || null
    const recurrenceEnd = (formData.get("recurrenceEnd") as string)?.trim() || null
    const serverId = formData.get("serverId") ? Number(formData.get("serverId")) : null
    const serverNameManual = (formData.get("serverNameManual") as string)?.trim() || null
    const timezone = (formData.get("timezone") as string)?.trim() || null
    const tagsStr = (formData.get("tags") as string)?.trim()
    const tags = tagsStr ? tagsStr.split(",").map(t => t.trim()).filter(Boolean) : null
    const discordLink = (formData.get("discordLink") as string)?.trim() || null

    if (!title || title.length > 200) return { error: "Title required, max 200 chars" }
    if (!eventDate) return { error: "Event date required" }
    if (recurrenceFrequency && !["weekly", "biweekly", "monthly"].includes(recurrenceFrequency)) {
        return { error: "Invalid recurrence frequency" }
    }

    const client = await pool.connect()
    try {
        const res = await client.query(
            `INSERT INTO events (title, description, event_type, event_date, end_date, organizer_user_id, organizer_org_id, banner_url, recurrence_frequency, recurrence_end, server_id, server_name_manual, timezone, tags, discord_link)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING event_id`,
            [title, description || null, eventType, eventDate, endDate, session.user.id, organizerOrgId, bannerUrl || null, recurrenceFrequency, recurrenceEnd, serverId, serverNameManual, timezone, tags, discordLink]
        )
        revalidatePath("/events")
        return { ok: true, eventId: res.rows[0].event_id }
    } catch (e) {
        console.error("Create event error:", e)
        return { error: "Failed to create event" }
    } finally {
        client.release()
    }
}

export async function updateEvent(eventId: number, formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Login required" }

    const isAdmin = await isUserAdmin(session.user.id)
    const client = await pool.connect()

    try {
        const evRes = await client.query("SELECT organizer_user_id FROM events WHERE event_id = $1", [eventId])
        if (evRes.rows.length === 0) return { error: "Event not found" }
        if (String(evRes.rows[0].organizer_user_id) !== session.user.id && !isAdmin) {
            return { error: "Not authorized" }
        }

        const title = (formData.get("title") as string)?.trim()
        const description = (formData.get("description") as string)?.trim()
        const eventType = (formData.get("eventType") as string) || "other"
        const eventDate = formData.get("eventDate") as string
        const endDate = (formData.get("endDate") as string) || null
        const bannerUrl = (formData.get("bannerUrl") as string)?.trim()
        const recurrenceFrequency = (formData.get("recurrenceFrequency") as string)?.trim() || null
        const recurrenceEnd = (formData.get("recurrenceEnd") as string)?.trim() || null
        const serverId = formData.get("serverId") ? Number(formData.get("serverId")) : null
        const serverNameManual = (formData.get("serverNameManual") as string)?.trim() || null
        const timezone = (formData.get("timezone") as string)?.trim() || null
        const tagsStr = (formData.get("tags") as string)?.trim()
        const tags = tagsStr ? tagsStr.split(",").map(t => t.trim()).filter(Boolean) : null
        const discordLink = (formData.get("discordLink") as string)?.trim() || null

        if (!title) return { error: "Title required" }
        if (recurrenceFrequency && !["weekly", "biweekly", "monthly"].includes(recurrenceFrequency)) {
            return { error: "Invalid recurrence frequency" }
        }

        await client.query(
            `UPDATE events SET title = $1, description = $2, event_type = $3, event_date = $4,
                    end_date = $5, banner_url = $6, recurrence_frequency = $7, recurrence_end = $8,
                    server_id = $9, server_name_manual = $10, timezone = $11, tags = $12, discord_link = $13, updated_at = NOW()
             WHERE event_id = $14`,
            [title, description || null, eventType, eventDate, endDate, bannerUrl || null, recurrenceFrequency, recurrenceEnd, serverId, serverNameManual, timezone, tags, discordLink, eventId]
        )
        revalidatePath(`/events/${eventId}`)
        return { ok: true }
    } catch (e) {
        console.error("Update event error:", e)
        return { error: "Failed to update" }
    } finally {
        client.release()
    }
}

export async function rsvpEvent(eventId: number, status: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Login required" }

    if (!["going", "maybe", "not_going"].includes(status)) return { error: "Invalid status" }

    const client = await pool.connect()
    try {
        const evRes = await client.query("SELECT event_id FROM events WHERE event_id = $1", [eventId])
        if (evRes.rows.length === 0) return { error: "Event not found" }

        if (status === "not_going") {
            await client.query(
                "DELETE FROM event_rsvps WHERE event_id = $1 AND user_id = $2",
                [eventId, session.user.id]
            )
        } else {
            await client.query(
                `INSERT INTO event_rsvps (event_id, user_id, status)
                 VALUES ($1, $2, $3)
                 ON CONFLICT (event_id, user_id)
                 DO UPDATE SET status = $3, responded_at = NOW()`,
                [eventId, session.user.id, status]
            )
        }
        revalidatePath(`/events/${eventId}`)
        return { ok: true, status }
    } catch (e) {
        console.error("RSVP error:", e)
        return { error: "Failed to update RSVP" }
    } finally {
        client.release()
    }
}

export async function deleteEvent(eventId: number) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Login required" }

    const isAdmin = await isUserAdmin(session.user.id)
    const client = await pool.connect()

    try {
        const evRes = await client.query("SELECT organizer_user_id FROM events WHERE event_id = $1", [eventId])
        if (evRes.rows.length === 0) return { error: "Event not found" }
        if (String(evRes.rows[0].organizer_user_id) !== session.user.id && !isAdmin) {
            return { error: "Not authorized" }
        }

        await client.query("DELETE FROM events WHERE event_id = $1", [eventId])
        revalidatePath("/events")
        return { ok: true }
    } catch (e) {
        console.error("Delete event error:", e)
        return { error: "Failed to delete" }
    } finally {
        client.release()
    }
}
