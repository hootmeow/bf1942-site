import { getAdminRounds } from "@/app/admin/actions"
import Link from "next/link"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Eye, Search } from "lucide-react"
import DeleteRoundButton from "../components/delete-button"
import { redirect } from "next/navigation"

export default async function AdminRoundsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string, search?: string }>
}) {
    const { page: pageParam, search: searchParam } = await searchParams
    const currentPage = Number(pageParam) || 1
    const searchQuery = searchParam || ""
    const { rounds, totalPages, page } = await getAdminRounds(currentPage, 50, searchQuery)

    async function searchAction(formData: FormData) {
        "use server"
        const query = formData.get("query")?.toString() || ""
        redirect(`/admin/rounds?search=${encodeURIComponent(query)}`)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Rounds Management</h1>
                <form action={searchAction} className="flex w-full sm:w-auto items-center gap-2">
                    <Input
                        name="query"
                        placeholder="Search map, ID, server, or player..."
                        defaultValue={searchQuery}
                        className="w-full sm:w-[300px]"
                    />
                    <Button type="submit" size="icon">
                        <Search className="h-4 w-4" />
                    </Button>
                </form>
            </div>

            <div className="rounded-md border border-border/60 overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Map</TableHead>
                            <TableHead>Server</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Ranked</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rounds.map((round: any) => (
                            <TableRow key={round.round_id}>
                                <TableCell className="font-mono text-xs text-muted-foreground">{round.round_id}</TableCell>
                                <TableCell>
                                    {new Date(round.start_time).toLocaleString()}
                                </TableCell>
                                <TableCell>{round.map_name}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{round.server_name}</span>
                                        <span className="text-xs text-muted-foreground">ID: {round.server_id}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{Math.floor(round.duration_seconds / 60)}m {round.duration_seconds % 60}s</TableCell>
                                <TableCell>
                                    {round.is_ranked === false ? (
                                        <span className="text-xs font-semibold text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">UNRANKED</span>
                                    ) : (
                                        <span className="text-xs font-semibold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">RANKED</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right flex justify-end gap-2">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/admin/rounds/${round.round_id}`}>
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <DeleteRoundButton roundId={round.round_id} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex justify-center gap-2 mt-4">
                <Button variant="outline" size="sm" disabled={page <= 1} asChild>
                    <Link href={`/admin/rounds?page=${page - 1}&search=${searchQuery}`}>
                        <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                    </Link>
                </Button>
                <div className="flex items-center text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                </div>
                <Button variant="outline" size="sm" disabled={page >= totalPages} asChild>
                    <Link href={`/admin/rounds?page=${page + 1}&search=${searchQuery}`}>
                        Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                </Button>
            </div>
        </div>
    )
}
