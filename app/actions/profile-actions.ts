"use server"

import { auth } from "@/lib/auth"
import { pool } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Validation Schema
const ProfileUpdateSchema = z.object({
    playerId: z.number(),
    bio: z.string().max(280).optional(),
    isoCountryCode: z.string().length(2).toUpperCase().optional().or(z.literal("")),
    customTitle: z.string().max(50).optional().or(z.literal("")),
    displayDiscordId: z.boolean().default(false)
})

export type ProfileUpdateState = {
    message?: string
    error?: string
    ok?: boolean
}

export async function updateProfileSettings(prevState: ProfileUpdateState | null, formData: FormData): Promise<ProfileUpdateState> {
    const session = await auth()
    if (!session?.user?.id) {
        return { error: "You must be logged in." }
    }

    // Parse Data
    const rawData = {
        playerId: Number(formData.get("playerId")),
        bio: formData.get("bio") as string,
        isoCountryCode: formData.get("isoCountryCode") as string,
        customTitle: formData.get("customTitle") as string,
        displayDiscordId: formData.get("displayDiscordId") === "on"
    }

    const validated = ProfileUpdateSchema.safeParse(rawData)

    if (!validated.success) {
        return { error: validated.error.errors[0].message }
    }

    const { playerId, bio, isoCountryCode, customTitle, displayDiscordId } = validated.data

    const client = await pool.connect()

    try {
        // 1. Verify Ownership
        // We must check if the logged-in user (session.user.id) is actually linked to this player
        // Note: session.user.id is the UUID from `users` table
        // players.linked_user_id is the foreign key
        const checkRes = await client.query(
            `SELECT player_id FROM players WHERE player_id = $1 AND linked_user_id = $2`,
            [playerId, session.user.id]
        )

        if (checkRes.rows.length === 0) {
            return { error: "Unauthorized: You do not own this profile." }
        }

        // 2. Update Profile
        // Handle empty strings as NULL for cleaner DB
        const finalCountry = isoCountryCode || null
        const finalTitle = customTitle || null
        const finalBio = bio || null

        await client.query(
            `UPDATE players 
             SET bio = $1, iso_country_code = $2, custom_title = $3, display_discord_id = $4
             WHERE player_id = $5`,
            [finalBio, finalCountry, finalTitle, displayDiscordId, playerId]
        )

        return { ok: true, message: "Profile updated successfully." }

    } catch (e) {
        console.error("Profile Update Error:", e)
        return { error: "Failed to update profile." }
    } finally {
        client.release()
        // Revalidate the specific player page
        // We assume we can get the slug/name, but we don't have it here easily.
        // We'll trust the client component to refresh or use a broad revalidate if needed.
        // Actually, let's just revalidate the path if we knew it, or just let client router refresh.
        // If we want to be safe: revalidatePath('/player/[slug]')
    }
}

export async function getMyLinkedProfile(userId: string): Promise<string | null> {
    try {
        const client = await pool.connect();
        const res = await client.query(
            "SELECT last_known_name FROM players WHERE linked_user_id = $1 LIMIT 1",
            [userId]
        );
        client.release();

        if (res.rows.length > 0) {
            const name = res.rows[0].last_known_name;
            // The frontend expects the name, we can encode it or just return name
            // Returning the name allows the frontend to encodeURIComponent(name)
            return name;
        }
        return null;
    } catch (e) {
        console.error("Failed to fetch linked profile:", e);
        return null;
    }
}
