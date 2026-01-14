import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { isUserAdmin } from "@/lib/admin-auth"

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

    if (!isAdmin) {
        redirect("/")
    }

    return (
        <div className="flex flex-col gap-6 py-8">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage reports, claims, and users.</p>
            </div>
            <div className="flex gap-8">
                <aside className="w-64 shrink-0">
                    <nav className="flex flex-col gap-2">
                        <a href="/admin/claims" className="flex items-center gap-2 rounded-md bg-secondary px-3 py-2 text-sm font-medium">
                            Profile Claims
                        </a>
                        {/* Add more admin links here later */}
                    </nav>
                </aside>
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    )
}

