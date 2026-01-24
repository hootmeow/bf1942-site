
import { auth } from "@/lib/auth"
import { isUserAdmin } from "@/lib/admin-auth"
import { redirect } from "next/navigation"
import { getWhitelistedServers } from "@/app/actions/whitelist"
import { WhitelistManager } from "./whitelist-manager"

export const metadata = {
    title: "Server Whitelist | Admin",
}

export default async function WhitelistPage() {
    const session = await auth()
    if (!session?.user?.id) return redirect("/")

    // Double check admin status
    const isAdmin = await isUserAdmin(session.user.id)
    if (!isAdmin) return redirect("/")

    const servers = await getWhitelistedServers()

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Ingest Whitelist</h1>
                <p className="text-muted-foreground">
                    Only servers listed here will have their stats processed by the ingestion engine.
                    This prevents spoofed data from unverified sources.
                </p>
            </div>

            <WhitelistManager initialServers={servers} />
        </div>
    )
}
