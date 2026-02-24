import { pool } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Crown, ExternalLink, Settings } from "lucide-react"
import Link from "next/link"

interface ClaimedServer {
    claim_id: string
    server_id: number
    server_name: string
    server_ip: string
    discord_username: string
    claimed_at: Date
    reviewed_at: Date
    is_online: boolean
    current_player_count: number | null
    current_max_players: number | null
}

async function getClaimedServers(): Promise<ClaimedServer[]> {
    const res = await pool.query(`
        SELECT
            sc.claim_id,
            sc.server_id,
            s.current_server_name as server_name,
            s.ip::text as server_ip,
            sc.discord_username,
            sc.created_at as claimed_at,
            sc.reviewed_at,
            CASE
                WHEN s.last_seen > NOW() - INTERVAL '10 minutes' THEN true
                ELSE false
            END as is_online,
            s.current_player_count,
            s.current_max_players
        FROM server_claims sc
        JOIN servers s ON sc.server_id = s.server_id
        WHERE sc.status = 'APPROVED'
        ORDER BY sc.reviewed_at DESC
    `)
    return res.rows
}

export default async function ClaimedServersPage() {
    const servers = await getClaimedServers()

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Crown className="h-5 w-5 text-amber-500" />
                        Claimed Servers
                    </CardTitle>
                    <CardDescription>
                        Servers that have been verified and claimed by their owners.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {servers.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No claimed servers yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {servers.map((server) => (
                                <div
                                    key={server.claim_id}
                                    className="flex items-center justify-between p-4 rounded-lg border border-border/60 bg-card/40 hover:bg-muted/30 transition-colors"
                                >
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Crown className="h-4 w-4 text-amber-500" />
                                            <span className="font-semibold text-foreground">
                                                {server.server_name || "Unknown Server"}
                                            </span>
                                            <Badge variant="outline" className="text-xs font-mono">
                                                {server.server_ip}
                                            </Badge>
                                            {server.is_online ? (
                                                <Badge className="text-[10px] bg-green-500">
                                                    Online
                                                    {server.current_player_count !== null &&
                                                        ` • ${server.current_player_count}/${server.current_max_players}`
                                                    }
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="text-[10px]">
                                                    Offline
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span>
                                                <strong>Owner:</strong> {server.discord_username}
                                            </span>
                                            <span>•</span>
                                            <span>
                                                <strong>Claimed:</strong> {new Date(server.claimed_at).toLocaleDateString()}
                                            </span>
                                            <span>•</span>
                                            <span>
                                                <strong>Approved:</strong> {new Date(server.reviewed_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        <Button asChild size="sm" variant="outline">
                                            <Link href={`/servers/${server.server_ip}`}>
                                                <ExternalLink className="h-3 w-3 mr-1" />
                                                View
                                            </Link>
                                        </Button>
                                        <Button asChild size="sm" variant="outline">
                                            <Link href={`/servers/${server.server_ip}/admin`}>
                                                <Settings className="h-3 w-3 mr-1" />
                                                Dashboard
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
