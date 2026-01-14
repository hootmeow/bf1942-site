"use server"

import { signIn, signOut } from "@/lib/auth"

export async function loginAction() {
    await signIn("discord")
}

export async function logoutAction() {
    await signOut()
}
