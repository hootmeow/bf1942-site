"use client"

import { useEffect, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Eye, Plus, CheckCircle, AlertTriangle, Search } from "lucide-react"
import {
    getWatchlistPlayers,
    addPlayerToWatchlist,
    resolvePlayerFlag,
    searchPlayers,
} from "@/app/actions/watchlist-admin-actions"
import { useToast } from "@/components/ui/toast-simple"

interface FlagRow {
    flag_id: number
    player_id: number
    flag_type: string
    severity: string
    details: { reason?: string; notes?: string; added_by?: string } | null
    created_at: string
    resolved: boolean
    player_name: string
}

interface PlayerResult {
    player_id: number
    name: string
}

const SEVERITY_STYLES: Record<string, string> = {
    critical: "border-red-500/50 bg-red-500/10 text-red-400",
    high:     "border-orange-500/50 bg-orange-500/10 text-orange-400",
    medium:   "border-amber-500/50 bg-amber-500/10 text-amber-400",
    low:      "border-blue-500/50 bg-blue-500/10 text-blue-400",
}

export default function WatchlistPage() {
    const [flags, setFlags]           = useState<FlagRow[]>([])
    const [loading, setLoading]       = useState(true)
    const [isPending, startTransition]= useTransition()
    const { toast } = useToast()

    // Add form state
    const [playerSearch, setPlayerSearch]     = useState("")
    const [searchResults, setSearchResults]   = useState<PlayerResult[]>([])
    const [selectedPlayer, setSelectedPlayer] = useState<PlayerResult | null>(null)
    const [reason, setReason]                 = useState("")
    const [severity, setSeverity]             = useState("medium")
    const [notes, setNotes]                   = useState("")
    const [searching, setSearching]           = useState(false)
    const [adding, setAdding]                 = useState(false)

    async function fetchFlags() {
        const res = await getWatchlistPlayers()
        if (res.ok) setFlags(res.flags as FlagRow[])
        setLoading(false)
    }

    useEffect(() => { fetchFlags() }, [])

    async function handleSearch(query: string) {
        setPlayerSearch(query)
        setSelectedPlayer(null)
        if (query.length < 2) { setSearchResults([]); return }
        setSearching(true)
        const res = await searchPlayers(query)
        setSearchResults(res.players as PlayerResult[])
        setSearching(false)
    }

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault()
        if (!selectedPlayer || !reason) return
        setAdding(true)
        try {
            const res = await addPlayerToWatchlist({
                player_id: selectedPlayer.player_id,
                reason,
                severity,
                notes: notes || undefined,
            })
            if (res.ok) {
                toast({ title: "Player added to watchlist", variant: "success" })
                setPlayerSearch("")
                setSelectedPlayer(null)
                setReason("")
                setNotes("")
                fetchFlags()
            }
        } catch (err) {
            toast({ title: "Error", description: String(err), variant: "destructive" })
        } finally {
            setAdding(false)
        }
    }

    function handleResolve(flagId: number) {
        startTransition(async () => {
            try {
                const res = await resolvePlayerFlag(flagId)
                if (res.ok) {
                    setFlags(prev => prev.filter(f => f.flag_id !== flagId))
                    toast({ title: "Flag resolved", variant: "success" })
                }
            } catch (err) {
                toast({ title: "Error", description: String(err), variant: "destructive" })
            }
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Eye className="h-6 w-6 text-primary" />
                <div>
                    <h1 className="text-2xl font-bold">Player Watchlist</h1>
                    <p className="text-sm text-muted-foreground">Active flags on players under monitoring</p>
                </div>
            </div>

            {/* Add to Watchlist */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Plus className="h-5 w-5" />
                        Flag a Player
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            {/* Player search */}
                            <div className="space-y-1.5">
                                <Label>Player Name</Label>
                                <div className="relative">
                                    <Input
                                        value={playerSearch}
                                        onChange={e => handleSearch(e.target.value)}
                                        placeholder="Search player name..."
                                    />
                                    {searching && (
                                        <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
                                    )}
                                </div>
                                {searchResults.length > 0 && !selectedPlayer && (
                                    <div className="border border-border rounded-md bg-background shadow-md z-10 max-h-40 overflow-y-auto">
                                        {searchResults.map(p => (
                                            <button
                                                key={p.player_id}
                                                type="button"
                                                className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
                                                onClick={() => {
                                                    setSelectedPlayer(p)
                                                    setPlayerSearch(p.name)
                                                    setSearchResults([])
                                                }}
                                            >
                                                {p.name}
                                                <span className="text-xs text-muted-foreground ml-2">#{p.player_id}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {selectedPlayer && (
                                    <p className="text-xs text-green-500">
                                        Selected: {selectedPlayer.name} (#{selectedPlayer.player_id})
                                    </p>
                                )}
                            </div>

                            {/* Severity */}
                            <div className="space-y-1.5">
                                <Label>Severity</Label>
                                <select
                                    value={severity}
                                    onChange={e => setSeverity(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="critical">Critical</option>
                                </select>
                            </div>

                            {/* Reason */}
                            <div className="space-y-1.5">
                                <Label>Reason</Label>
                                <Input
                                    value={reason}
                                    onChange={e => setReason(e.target.value)}
                                    placeholder="e.g. Suspicious K/D spike, stat padding suspected"
                                    required
                                />
                            </div>

                            {/* Notes */}
                            <div className="space-y-1.5">
                                <Label>Notes (optional)</Label>
                                <Input
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    placeholder="Additional context..."
                                />
                            </div>
                        </div>

                        <Button type="submit" disabled={adding || !selectedPlayer || !reason}>
                            {adding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add to Watchlist
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Watchlist Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between text-lg">
                        <span className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-400" />
                            Active Flags
                        </span>
                        <Badge variant="outline">{flags.length} flagged</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : flags.length === 0 ? (
                        <div className="text-center py-12">
                            <CheckCircle className="h-10 w-10 mx-auto mb-3 text-green-500" />
                            <p className="text-muted-foreground">No active flags. Watchlist is clear.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Player</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Severity</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Notes</TableHead>
                                    <TableHead>Flagged</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {flags.map(flag => (
                                    <TableRow key={flag.flag_id}>
                                        <TableCell className="font-medium">
                                            <a
                                                href={`/player/${flag.player_id}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="hover:underline text-primary"
                                            >
                                                {flag.player_name}
                                            </a>
                                            <span className="text-xs text-muted-foreground ml-2">#{flag.player_id}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-xs">{flag.flag_type}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`text-xs ${SEVERITY_STYLES[flag.severity] ?? ""}`}
                                            >
                                                {flag.severity}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm max-w-[200px] truncate">
                                            {flag.details?.reason ?? "—"}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground max-w-[160px] truncate">
                                            {flag.details?.notes ?? "—"}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {new Date(flag.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleResolve(flag.flag_id)}
                                                disabled={isPending}
                                                className="text-green-500 border-green-500/30 hover:bg-green-500/10"
                                            >
                                                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                                Resolve
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
