"use client"

import { useState } from "react"
import { addWhitelistedServer, removeWhitelistedServer, toggleServerStatus } from "@/app/actions/whitelist"
import type { WhitelistedServer } from "@/app/actions/whitelist"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Trash2, CheckCircle2, XCircle, ShieldCheck } from "lucide-react"

export function WhitelistManager({ initialServers }: { initialServers: WhitelistedServer[] }) {
    // We use optimistic updates or just rely on server action revalidation. 
    // Since we pass initialServers from the server page, they will update on refresh/revalidate.
    // But for immediate feedback, we might want local state or useRouter.refresh()
    // However, server actions with revalidatePath usually handle this. 
    // To keep it simple, we'll just accept that there might be a split second delay or rely on the props updating.
    // Actually, in a client component, props don't auto-update unless the parent re-renders. 
    // So we should probably just use the server page to fetch and pass down.

    // Simpler: Just refresh the page logic is automatic with Server Actions if inside a form?
    // Let's use `useOptimistic` if we wanted to be fancy, but simple form submission is fine.

    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState("")

    async function handleAdd(formData: FormData) {
        setIsPending(true)
        setError("")
        try {
            const res = await addWhitelistedServer(formData)
            if (res.error) {
                setError(res.error)
            } else {
                // creating a ref to the form would be better to reset it, 
                // but we can just target the event target if we used onSubmit
                const form = document.getElementById("add-server-form") as HTMLFormElement
                form?.reset()
            }
        } catch (e) {
            setError("Something went wrong")
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="space-y-6">
            <Card className="bg-secondary/20 border-border/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-green-500" />
                        Add New Trusted Server
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form id="add-server-form" action={handleAdd} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 space-y-2 w-full">
                            <label className="text-sm font-medium text-muted-foreground">Server IP (IPv4 or IPv6)</label>
                            <Input
                                name="ip"
                                placeholder="e.g. 192.168.1.1 or 2001:db8::1"
                                required
                                className="bg-background"
                            />
                        </div>
                        <div className="flex-1 space-y-2 w-full">
                            <label className="text-sm font-medium text-muted-foreground">Server Name / Description</label>
                            <Input
                                name="name"
                                placeholder="e.g. My Official Server #1"
                                required
                                className="bg-background"
                            />
                        </div>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Whitelist Server
                        </Button>
                    </form>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </CardContent>
            </Card>

            <div className="grid gap-4">
                <h2 className="text-xl font-bold">Approved Servers ({initialServers.length})</h2>

                <div className="border border-border rounded-lg overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-secondary/50 text-muted-foreground font-medium uppercase border-b border-border">
                            <tr>
                                <th className="p-3">Status</th>
                                <th className="p-3">IP Address</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Added By</th>
                                <th className="p-3">Date</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {initialServers.map((server) => (
                                <tr key={server.ip} className="hover:bg-secondary/20 transition-colors">
                                    <td className="p-3">
                                        <div
                                            className="cursor-pointer"
                                            onClick={() => toggleServerStatus(server.ip, !server.is_active)}
                                        >
                                            {server.is_active ? (
                                                <Badge variant="outline" className="text-green-500 border-green-500/50 bg-green-500/10 hover:bg-green-500/20">
                                                    Active
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-muted-foreground">
                                                    Inactive
                                                </Badge>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-3 font-mono text-xs md:text-sm">{server.ip}</td>
                                    <td className="p-3 font-medium">{server.server_name}</td>
                                    <td className="p-3 text-muted-foreground text-xs">{server.added_by}</td>
                                    <td className="p-3 text-muted-foreground text-xs">
                                        {new Date(server.added_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-3 text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10 h-8 w-8 p-0"
                                            onClick={() => {
                                                if (confirm("Are you sure you want to remove this server? It will stop being tracked immediately.")) {
                                                    removeWhitelistedServer(server.ip)
                                                }
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            <span className="sr-only">Delete</span>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {initialServers.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                        No servers whitelisted yet. The ingestion engine will ignore all traffic until you add one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
