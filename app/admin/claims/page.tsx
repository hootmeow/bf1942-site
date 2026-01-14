import { pool } from "@/lib/db"
import { approveClaim, denyClaim } from "@/app/actions/admin-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X, Shield } from "lucide-react"

// Define Interface
interface ClaimRequest {
    claim_id: string
    player_id: number
    discord_username: string
    created_at: Date
    player_name: string
}

async function getPendingClaims(): Promise<ClaimRequest[]> {
    const res = await pool.query(`
    SELECT c.claim_id, c.player_id, c.discord_username, c.created_at, p.last_known_name as player_name
    FROM claim_requests c
    JOIN players p ON c.player_id = p.player_id
    WHERE c.status = 'PENDING'
    ORDER BY c.created_at DESC
  `)
    return res.rows
}

export default async function AdminClaimsPage() {
    const claims = await getPendingClaims()

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Pending Claims</CardTitle>
                    <CardDescription>Review requests from users claiming to be specific players.</CardDescription>
                </CardHeader>
                <CardContent>
                    {claims.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No pending claims.</p>
                    ) : (
                        <div className="space-y-4">
                            {claims.map((claim) => (
                                <div key={claim.claim_id} className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-4 w-4 text-orange-500" />
                                            <span className="font-semibold">{claim.discord_username}</span>
                                            <span className="text-muted-foreground">wants to claim</span>
                                            <span className="font-bold text-primary">{claim.player_name}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Submitted: {new Date(claim.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <form action={denyClaim.bind(null, claim.claim_id)}>
                                            <Button size="sm" variant="destructive" className="gap-2">
                                                <X className="h-4 w-4" /> Deny
                                            </Button>
                                        </form>
                                        <form action={approveClaim.bind(null, claim.claim_id)}>
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
