"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, ScrollText, ChevronLeft, ChevronRight } from "lucide-react"
import { getAuditLog } from "@/app/actions/audit-log-actions"

interface LogEntry {
    log_id: number
    admin_user_id: string
    admin_display_name: string
    action_type: string
    target_type: string | null
    target_id: string | null
    details: Record<string, unknown> | null
    created_at: string
}

function renderDetails(actionType: string, details: Record<string, unknown> | null): string {
    if (!details) return "—"
    const d = details
    switch (actionType) {
        case "approve_claim":
        case "deny_claim":
            return String(d.player_name || d.target_name || d.claim_id || "—")
        case "whitelist_approve":
        case "whitelist_ignore":
        case "whitelist_block":
        case "whitelist_unblock":
        case "whitelist_restore":
        case "whitelist_deactivate":
            return String(d.server_name ? `${d.server_name} (${d.ip})` : d.ip || "—")
        case "whitelist_bulk_approve":
        case "whitelist_bulk_ignore":
        case "whitelist_bulk_block":
            return `${d.count} servers`
        case "integrity_approve":
        case "integrity_dismissed":
            return `${d.queue_id ? `Queue #${d.queue_id}` : "—"}`
        case "integrity_unranked":
            return `Round #${d.item_id || "—"}`
        case "integrity_player_flagged":
            return `Player #${d.item_id || "—"}`
        case "integrity_server_blacklisted":
            return `Server #${d.item_id || "—"}`
        case "delete_round":
        case "rank_round":
        case "unrank_round":
            return `Round #${d.round_id || "—"}`
        case "verify_player":
        case "unverify_player":
            return `Player #${d.player_id || "—"}`
        case "create_article":
        case "update_article":
        case "delete_article":
            return String(d.title || d.slug || "—")
        case "create_challenge":
        case "update_challenge":
        case "delete_challenge":
            return String(d.title || d.challenge_id || "—")
        case "hide_event":
        case "unhide_event":
        case "hide_org":
        case "unhide_org":
            return String(d.name || d.event_id || d.org_id || "—")
        default: {
            const str = JSON.stringify(details)
            return str.length > 80 ? str.slice(0, 80) + "…" : str
        }
    }
}

const ACTION_COLORS: Record<string, string> = {
    approve_claim:    "border-green-500/40 bg-green-500/10 text-green-400",
    deny_claim:       "border-red-500/40 bg-red-500/10 text-red-400",
    create_challenge: "border-blue-500/40 bg-blue-500/10 text-blue-400",
    update_challenge: "border-cyan-500/40 bg-cyan-500/10 text-cyan-400",
    delete_challenge: "border-orange-500/40 bg-orange-500/10 text-orange-400",
    hide_event:       "border-amber-500/40 bg-amber-500/10 text-amber-400",
    unhide_event:     "border-green-500/40 bg-green-500/10 text-green-400",
    hide_org:         "border-amber-500/40 bg-amber-500/10 text-amber-400",
    unhide_org:       "border-green-500/40 bg-green-500/10 text-green-400",
    create_article:   "border-purple-500/40 bg-purple-500/10 text-purple-400",
    update_article:   "border-purple-500/40 bg-purple-500/10 text-purple-400",
    delete_article:   "border-red-500/40 bg-red-500/10 text-red-400",
}

const PAGE_SIZE = 50

export default function AuditLogPage() {
    const [entries, setEntries] = useState<LogEntry[]>([])
    const [total, setTotal]     = useState(0)
    const [page, setPage]       = useState(1)
    const [loading, setLoading] = useState(true)

    async function fetchPage(p: number) {
        setLoading(true)
        try {
            const res = await getAuditLog(PAGE_SIZE, (p - 1) * PAGE_SIZE)
            if (res.ok) {
                setEntries(res.entries as LogEntry[])
                setTotal(res.total)
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchPage(1) }, [])

    function goToPage(p: number) {
        setPage(p)
        fetchPage(p)
    }

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <ScrollText className="h-6 w-6 text-primary" />
                    <div>
                        <h1 className="text-2xl font-bold">Audit Log</h1>
                        <p className="text-sm text-muted-foreground">Record of admin actions on this platform</p>
                    </div>
                </div>
                <Badge variant="outline">{total.toLocaleString()} entries</Badge>
            </div>

            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : entries.length === 0 ? (
                        <p className="text-center py-12 text-muted-foreground">
                            No audit log entries yet. Actions will appear here as admins interact with the platform.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[60px]">ID</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Target</TableHead>
                                    <TableHead>Details</TableHead>
                                    <TableHead>Admin</TableHead>
                                    <TableHead>Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {entries.map(entry => (
                                    <TableRow key={entry.log_id}>
                                        <TableCell className="font-mono text-xs text-muted-foreground">
                                            {entry.log_id}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`text-xs font-mono ${ACTION_COLORS[entry.action_type] ?? ""}`}
                                            >
                                                {entry.action_type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs">
                                            {entry.target_type && (
                                                <span className="text-muted-foreground">
                                                    {entry.target_type}
                                                    {entry.target_id ? ` #${entry.target_id}` : ""}
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate" title={entry.details ? JSON.stringify(entry.details) : undefined}>
                                            {renderDetails(entry.action_type, entry.details)}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground max-w-[140px] truncate" title={entry.admin_user_id}>
                                            {entry.admin_display_name}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                            {new Date(entry.created_at).toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
                        <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                    </Button>
                    <div className="flex items-center text-sm text-muted-foreground px-2">
                        Page {page} of {totalPages}
                    </div>
                    <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => goToPage(page + 1)}>
                        Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            )}
        </div>
    )
}
