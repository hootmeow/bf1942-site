import NextAuth from "next-auth"
import Discord from "next-auth/providers/discord"
import PostgresAdapter from "@auth/pg-adapter"
import { pool } from "@/lib/db"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PostgresAdapter(pool),
    providers: [
        Discord,
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
