import { auth } from "@/lib/auth"
import { isUserAdmin } from "@/lib/admin-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Shield, List, LayoutDashboard, UserCheck, Users, Calendar, Youtube, Newspaper, Bot, Server } from "lucide-react"

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
        <div className="flex min-h-screen flex-col md:flex-row">
            <aside className="w-full md:w-64 bg-secondary/30 border-r border-border p-4">
                <div className="flex items-center gap-2 mb-8 px-2 font-bold text-xl">
                    <Shield className="h-6 w-6 text-primary" />
                    <span>Admin Panel</span>
                </div>

                <nav className="space-y-2">
                    <Link href="/admin" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-secondary transition-colors">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                    </Link>
                    <Link href="/admin/rounds" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-secondary transition-colors">
                        <List className="h-4 w-4" />
                        Rounds
                    </Link>
                    <Link href="/admin/bot-reports" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-secondary transition-colors">
                        <Bot className="h-4 w-4" />
                        Bot Reports
                    </Link>
                    <Link href="/admin/players/verified" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-secondary transition-colors">
                        <Shield className="h-4 w-4" />
                        Verified Players
                    </Link>
                    <Link href="/admin/claims" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-secondary transition-colors">
                        <UserCheck className="h-4 w-4" />
                        Player Claims
                    </Link>
                    <Link href="/admin/server-claims" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-secondary transition-colors">
                        <Server className="h-4 w-4" />
                        Server Claims
                    </Link>
                    <div className="h-px bg-border my-2" />
                    <Link href="/admin/orgs" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-secondary transition-colors">
                        <Users className="h-4 w-4" />
                        Organizations
                    </Link>
                    <Link href="/admin/events" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-secondary transition-colors">
                        <Calendar className="h-4 w-4" />
                        Events
                    </Link>
                    <Link href="/admin/videos" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-secondary transition-colors">
                        <Youtube className="h-4 w-4" />
                        Videos
                    </Link>
                    <Link href="/admin/digests" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-secondary transition-colors">
                        <Newspaper className="h-4 w-4" />
                        Weekly Digests
                    </Link>
                    <div className="h-px bg-border my-2" />
                    <Link href="/admin/whitelist" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-secondary transition-colors text-green-500 hover:text-green-400">
                        <Shield className="h-4 w-4" />
                        Ingest Whitelist
                    </Link>
                </nav>
            </aside>

            <main className="flex-1 p-6 md:p-8 overflow-auto">
                {children}
            </main>
        </div>
    )
}
