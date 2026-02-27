import { getRoundDetails, getRoundPlayers } from "@/app/admin/actions"
import DeleteRoundButton from "../../components/delete-button"
import ToggleRankedButton from "../../components/toggle-ranked-button"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Shield, ShieldOff } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default async function AdminRoundDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id: roundId } = await params

    // Validate it looks like a number, but keep as string for DB Query
    if (!/^\d+$/.test(roundId)) notFound()

    const round = await getRoundDetails(roundId)
    if (!round) notFound()

    const players = await getRoundPlayers(roundId)

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/rounds">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold">Round Details</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 h-fit">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Round #{round.round_id}</CardTitle>
                                <CardDescription>Basic Information</CardDescription>
                            </div>
                            <Badge variant={round.is_ranked ? "default" : "secondary"} className="flex items-center gap-1">
                                {round.is_ranked ? (
                                    <>
                                        <Shield className="h-3 w-3" />
                                        Ranked
                                    </>
                                ) : (
                                    <>
                                        <ShieldOff className="h-3 w-3" />
                                        Unranked
                                    </>
                                )}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Map</p>
                                <p>{round.map_name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Server</p>
                                <p>{round.server_name}</p>
                                <p className="text-xs text-muted-foreground">ID: {round.server_id}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Start Time</p>
                                <p>{new Date(round.start_time).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">End Time</p>
                                <p>{round.end_time ? new Date(round.end_time).toLocaleString() : "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Duration</p>
                                <p>{round.duration_seconds} seconds</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Winner Team</p>
                                <p>{round.winner_team}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Game Mode</p>
                                <p>{round.gamemode}</p>
                            </div>
                        </div>

                        <div className="pt-6 border-t space-y-4">
                            <div>
                                <h3 className="text-lg font-medium mb-2">Ranking Status</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {round.is_ranked
                                        ? "This round is currently ranked and counts toward player statistics."
                                        : "This round is unranked and does not count toward player statistics."}
                                </p>
                                <ToggleRankedButton roundId={round.round_id} isRanked={round.is_ranked} />
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-destructive mb-2">Danger Zone</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Deleting this round will remove it from all statistics. This action cannot be undone.
                                </p>
                                <DeleteRoundButton roundId={round.round_id} className="w-full" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Player Stats</CardTitle>
                        <CardDescription>Players in this round ({players.length})</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Player</TableHead>
                                    <TableHead className="text-right">Score</TableHead>
                                    <TableHead className="text-right">Kills</TableHead>
                                    <TableHead className="text-right">Deaths</TableHead>
                                    <TableHead className="text-right">Team</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {players.map((p: any, i: number) => (
                                    <TableRow key={i}>
                                        <TableCell className="font-medium">
                                            {p.player_name || p.name || "Unknown"}
                                        </TableCell>
                                        <TableCell className="text-right">{p.score}</TableCell>
                                        <TableCell className="text-right">{p.kills}</TableCell>
                                        <TableCell className="text-right">{p.deaths}</TableCell>
                                        <TableCell className="text-right">{p.team}</TableCell>
                                    </TableRow>
                                ))}
                                {players.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                            No player stats found for this round.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
