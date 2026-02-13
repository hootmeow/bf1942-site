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
    displayDiscordId: z.boolean().default(false),
    profileTheme: z.enum(["default", "axis", "allied", "desert", "pacific", "arctic"]).default("default"),
    favoriteMaps: z.array(z.string().max(100)).max(10).default([]),
    galleryUrls: z.array(z.string().url().max(500)).max(6).default([]),
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
        displayDiscordId: formData.get("displayDiscordId") === "on",
        profileTheme: (formData.get("profileTheme") as string) || "default",
        favoriteMaps: JSON.parse((formData.get("favoriteMaps") as string) || "[]"),
        galleryUrls: JSON.parse((formData.get("galleryUrls") as string) || "[]"),
    }

    const validated = ProfileUpdateSchema.safeParse(rawData)

    if (!validated.success) {
        return { error: validated.error.issues[0].message }
    }

    const { playerId, bio, isoCountryCode, customTitle, displayDiscordId, profileTheme, favoriteMaps, galleryUrls } = validated.data

    const client = await pool.connect()

    try {
        const checkRes = await client.query(
            `SELECT player_id FROM players WHERE player_id = $1 AND linked_user_id = $2`,
            [playerId, session.user.id]
        )

        if (checkRes.rows.length === 0) {
            return { error: "Unauthorized: You do not own this profile." }
        }

        const finalCountry = isoCountryCode || null
        const finalTitle = customTitle || null
        const finalBio = bio || null

        await client.query(
            `UPDATE players
             SET bio = $1, iso_country_code = $2, custom_title = $3, display_discord_id = $4,
                 profile_theme = $5, favorite_maps = $6, gallery_urls = $7
             WHERE player_id = $8`,
            [finalBio, finalCountry, finalTitle, displayDiscordId, profileTheme,
             favoriteMaps.length > 0 ? favoriteMaps : null,
             galleryUrls.length > 0 ? galleryUrls : null,
             playerId]
        )

        return { ok: true, message: "Profile updated successfully." }

    } catch (e) {
        console.error("Profile Update Error:", e)
        return { error: "Failed to update profile." }
    } finally {
        client.release()
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
            return name;
        }
        return null;
    } catch (e) {
        console.error("Failed to fetch linked profile:", e);
        return null;
    }
}
