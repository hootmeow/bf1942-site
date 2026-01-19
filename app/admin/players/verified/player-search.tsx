"use client"

import { useState } from "react"
import { searchPlayers, toggleVerification } from "@/app/admin/actions"
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
import { Plus, Search, Loader2, Check } from "lucide-react"
import { useRouter } from "next/navigation"

export default function PlayerSearchCmp() {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
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

    const handleVerify = async (playerId: string) => {
        await toggleVerification(playerId, true)
        setOpen(false)
        setQuery("")
        setResults([])
        router.refresh()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" /> Add Verified Player
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Verified Player</DialogTitle>
                    <DialogDescription>
                        Search for a player to add to the verified list.
                    </DialogDescription>
                </DialogHeader>
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
                            <div key={player.player_id} className="flex items-center justify-between p-2 border rounded hover:bg-accent/50">
                                <div>
                                    <p className="font-medium">{player.canonical_name}</p>
                                    <p className="text-xs text-muted-foreground">{player.last_known_name}</p>
                                </div>
                                {player.is_verified ? (
                                    <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">Verified</span>
                                ) : (
                                    <Button size="sm" variant="secondary" onClick={() => handleVerify(player.player_id)}>
                                        Verify
                                    </Button>
                                )}
                            </div>
                        ))}
                        {results.length === 0 && query && !loading && (
                            <p className="text-sm text-center text-muted-foreground py-4">No players found.</p>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
