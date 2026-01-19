import { getWatchlist, removeFromWatchlist } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Trash2 } from "lucide-react"
import WatchlistAddCmp from "./add-modal"

export default async function WatchlistPage() {
    const watchlist = await getWatchlist()

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Player Watchlist</h1>
                    <p className="text-muted-foreground">Monitor suspicious or problematic players</p>
                </div>
                <WatchlistAddCmp />
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Player Name</TableHead>
                            <TableHead>Added At</TableHead>
                            <TableHead>Last Seen</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {watchlist.map((entry: any) => (
                            <TableRow key={entry.player_id}>
                                <TableCell className="font-medium">{entry.display_name}</TableCell>
                                <TableCell>{new Date(entry.added_at).toLocaleDateString()}</TableCell>
                                <TableCell>{entry.last_seen ? new Date(entry.last_seen).toLocaleDateString() : 'N/A'}</TableCell>
                                <TableCell className="text-right">
                                    <RemoveWatchlistButton playerId={entry.player_id} />
                                </TableCell>
                            </TableRow>
                        ))}
                        {watchlist.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    No players on watchlist.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

function RemoveWatchlistButton({ playerId }: { playerId: string }) {
    return (
        <form action={async () => {
            "use server"
            await removeFromWatchlist(playerId)
        }}>
            <Button variant="ghost" size="icon" type="submit" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove</span>
            </Button>
        </form>
    )
}
