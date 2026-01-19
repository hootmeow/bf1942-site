import { getVerifiedPlayers, searchPlayers, toggleVerification } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Check, Plus, Search, Trash2, X } from "lucide-react"
import PlayerSearchCmp from "./player-search"

export default async function VerifiedPlayersPage() {
    const verifiedPlayers = await getVerifiedPlayers()

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Verified Players</h1>
                    <p className="text-muted-foreground">Manage players with verified status</p>
                </div>
                <PlayerSearchCmp />
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Canonical Name</TableHead>
                            <TableHead>Last Known Name</TableHead>
                            <TableHead>Last Seen</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {verifiedPlayers.map((player: any) => (
                            <TableRow key={player.player_id}>
                                <TableCell className="font-medium">{player.canonical_name}</TableCell>
                                <TableCell>{player.last_known_name}</TableCell>
                                <TableCell>{new Date(player.last_seen).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <VerificationToggle playerId={player.player_id} isVerified={true} />
                                </TableCell>
                            </TableRow>
                        ))}
                        {verifiedPlayers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    No verified players found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

// Client component for the toggle button to avoid full page refresh issues potentially
function VerificationToggle({ playerId, isVerified }: { playerId: string, isVerified: boolean }) {
    return (
        <form action={async () => {
            "use server"
            await toggleVerification(playerId, !isVerified)
        }}>
            <Button variant="ghost" size="sm" type="submit" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                <span className="sr-only">Revoke</span>
                Revoke
            </Button>
        </form>
    )
}
