"use client"

import { useState } from "react"
import { searchPlayers, addToWatchlist } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Plus, Search, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function WatchlistAddCmp() {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedPlayer, setSelectedPlayer] = useState<any>(null)
    const router = useRouter()

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await searchPlayers(query)
            setResults(res)
        } finally {
            setLoading(false)
        }
    }

    const handleAdd = async () => {
        if (!selectedPlayer) return
        await addToWatchlist(selectedPlayer.player_id, selectedPlayer.canonical_name || selectedPlayer.last_known_name)
        setOpen(false)
        setQuery("")
        setResults([])
        setSelectedPlayer(null)
        router.refresh()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive">
                    <Plus className="h-4 w-4 mr-2" /> Add to Watchlist
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add to Watchlist</DialogTitle>
                    <DialogDescription>
                        Search for a player to add to the watchlist.
                    </DialogDescription>
                </DialogHeader>

                {!selectedPlayer ? (
                    <div className="space-y-4">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <Input
                                placeholder="Search player name..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <Button type="submit" disabled={loading}>
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                            </Button>
                        </form>

                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                            {results.map((player) => (
                                <div key={player.player_id} className="flex items-center justify-between p-2 border rounded hover:bg-accent/50 cursor-pointer" onClick={() => setSelectedPlayer(player)}>
                                    <div>
                                        <p className="font-medium">{player.canonical_name}</p>
                                        <p className="text-xs text-muted-foreground">{player.last_known_name}</p>
                                    </div>
                                    <Button size="sm" variant="ghost">Select</Button>
                                </div>
                            ))}
                            {results.length === 0 && query && !loading && (
                                <p className="text-sm text-center text-muted-foreground py-4">No players found.</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="p-4 border rounded bg-accent/20">
                            <p className="font-medium">Selected: {selectedPlayer.canonical_name}</p>
                            <p className="text-xs text-muted-foreground">ID: {selectedPlayer.player_id}</p>
                            <Button variant="link" size="sm" className="px-0 h-auto text-muted-foreground" onClick={() => setSelectedPlayer(null)}>Change Player</Button>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setSelectedPlayer(null)}>Cancel</Button>
                            <Button variant="destructive" onClick={handleAdd}>Add Player</Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
