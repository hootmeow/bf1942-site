import type { Metadata } from "next"
import { auth } from "@/lib/auth"

export const metadata: Metadata = {
    title: "Admin Panel",
    robots: { index: false, follow: false },
}
import { isUserAdmin, isUserViewer } from "@/lib/admin-auth"
import { redirect } from "next/navigation"
import { AdminNav } from "./components/admin-nav"
import { ConfirmProvider } from "./components/confirm-provider"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()
    if (!session?.user?.id) {
        redirect("/")
    }

    const isAdmin = await isUserAdmin(session.user.id)
    const canView = isAdmin || await isUserViewer(session.user.id)
    if (!canView) {
        redirect("/")
    }

    return (
        <ConfirmProvider>
            <div className="flex min-h-screen flex-col md:flex-row">
                <AdminNav />
                <main className="flex-1 p-6 md:p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </ConfirmProvider>
    )
}
