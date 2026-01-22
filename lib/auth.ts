import NextAuth from "next-auth"
import Discord from "next-auth/providers/discord"
import PostgresAdapter from "@auth/pg-adapter"
import { pool } from "@/lib/db"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PostgresAdapter(pool),
    providers: [
        Discord({
            profile(profile) {
                if (profile.avatar === null) {
                    const defaultAvatarNumber = parseInt(profile.discriminator) % 5
                    profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`
                } else {
                    const format = profile.avatar.startsWith("a_") ? "gif" : "png"
                    profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`
                }
                return {
                    id: profile.id,
                    name: profile.username, // Use actual username (e.g. owlcat1942) instead of global_name
                    email: profile.email,
                    image: profile.image_url,
                }
            },
        }),
    ],
    callbacks: {
        async session({ session, user }) {
            // Pass the user ID to the session so we can identify them
            if (session.user) {
                session.user.id = user.id;
            }
            return session;
        },
    },
})
