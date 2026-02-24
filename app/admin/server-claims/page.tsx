import { pool } from "@/lib/db"
import { approveServerClaim, denyServerClaim } from "@/app/actions/admin-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X, Shield, Server } from "lucide-react"

// Define Interface
interface ServerClaimRequest {
    claim_id: string
    server_id: number
    discord_username: string
    created_at: Date
    server_name: string
    server_ip: string
}

async function getPendingServerClaims(): Promise<ServerClaimRequest[]> {
    const res = await pool.query(`
    SELECT sc.claim_id, sc.server_id, sc.discord_username, sc.created_at,
           s.server_name, s.ip_address as server_ip
    FROM server_claims sc
    JOIN servers s ON sc.server_id = s.server_id
    WHERE sc.status = 'PENDING'
    ORDER BY sc.created_at DESC
  `)
    return res.rows
}

export default async function AdminServerClaimsPage() {
    const claims = await getPendingServerClaims()

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Pending Server Claims</CardTitle>
                    <CardDescription>Review requests from users claiming to own specific servers.</CardDescription>
                </CardHeader>
                <CardContent>
                    {claims.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No pending server claims.</p>
                    ) : (
                        <div className="space-y-4">
                            {claims.map((claim) => (
                                <div key={claim.claim_id} className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Server className="h-4 w-4 text-orange-500" />
                                            <span className="font-semibold">{claim.discord_username}</span>
                                            <span className="text-muted-foreground">wants to claim</span>
                                            <span className="font-bold text-primary">{claim.server_name}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Server IP: {claim.server_ip}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Submitted: {new Date(claim.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <form action={denyServerClaim.bind(null, claim.claim_id)}>
                                            <Button size="sm" variant="destructive" className="gap-2">
                                                <X className="h-4 w-4" /> Deny
                                            </Button>
                                        </form>
                                        <form action={approveServerClaim.bind(null, claim.claim_id)}>
                                            <Button size="sm" variant="default" className="gap-2 bg-green-600 hover:bg-green-700">
                                                <Check className="h-4 w-4" /> Approve
                                            </Button>
                                        </form>
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
