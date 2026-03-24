"use client"

import { useState, useTransition } from "react"
import { addWhitelistedServer, removeWhitelistedServer, toggleServerStatus, unignoreServer, updateServerDetails, blockServer, unblockServer } from "@/app/actions/whitelist"
import type { WhitelistedServer } from "@/app/actions/whitelist"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Loader2, Trash2, ShieldCheck, ShieldAlert, RotateCcw, AlertCircle, FileText, Save, Circle, Users, Map as MapIcon, Clock, Database, Ban, Eye } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface WhitelistManagerProps {
    initialServers: WhitelistedServer[]
    isReadOnly?: boolean
}

function formatTimeAgo(date: Date): string {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
}

function resolveDisplayName(server: WhitelistedServer): string {
    const liveIsReal = server.live_server_name && server.live_server_name.trim().length > 0
    const labelIsReal = server.server_name
        && server.server_name.trim().length > 0
        && server.server_name !== "New Discovery"

    return liveIsReal
        ? server.live_server_name!
        : labelIsReal
            ? server.server_name!
            : "Unknown Server"
}

function StateBadge({ state }: { state: string | null }) {
    if (!state) return null
    const styles: Record<string, string> = {
        ACTIVE: "bg-green-500 hover:bg-green-600 text-white",
        EMPTY: "bg-blue-500 hover:bg-blue-600 text-white",
        OFFLINE: "bg-muted text-muted-foreground",
        UNKNOWN: "bg-yellow-500 hover:bg-yellow-600 text-white",
    }
    return (
        <Badge className={`text-[10px] flex items-center gap-1 ${styles[state] ?? ""}`}>
            <Circle className="h-2 w-2 fill-current" />
            {state.charAt(0) + state.slice(1).toLowerCase()}
        </Badge>
    )
}

function DetailsDialog({ server }: { server: WhitelistedServer }) {
    const [serverName, setServerName] = useState(server.server_name && server.server_name !== "New Discovery" ? server.server_name : "")
    const [notes, setNotes] = useState(server.admin_notes || "")
    const [contact, setContact] = useState(server.owner_contact || "")
    const [open, setOpen] = useState(false)
    const [saving, setSaving] = useState(false)

    const handleSave = async () => {
        setSaving(true)
        await updateServerDetails(server.ip, serverName, notes, contact)
        setSaving(false)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" title="Edit Details">
                    <FileText className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Server Details</DialogTitle>
                    <DialogDescription className="font-mono text-xs">{server.ip}{server.port ? `:${server.port}` : ""}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="server-name">Admin Label</Label>
                        <Input
                            id="server-name"
                            placeholder={server.live_server_name || "Custom display name…"}
                            value={serverName}
                            onChange={(e) => setServerName(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">Overrides the live server name in this list.</p>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="contact">Owner Contact</Label>
                        <Input
                            id="contact"
                            placeholder="Discord ID, Email, etc."
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="notes">Admin Notes</Label>
                        <Textarea
                            id="notes"
                            placeholder="Internal comments about this server…"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function ServerNameCell({ server }: { server: WhitelistedServer }) {
    const displayName = resolveDisplayName(server)
    const ipPort = server.port ? `${server.ip}:${server.port}` : server.ip
    return (
        <div className="min-w-0">
            <div className="font-medium text-sm truncate max-w-[220px]" title={displayName}>{displayName}</div>
            <div className="text-xs text-muted-foreground font-mono">{ipPort}</div>
            {server.admin_notes && (
                <div className="text-[10px] text-muted-foreground italic truncate max-w-[220px] mt-0.5" title={server.admin_notes}>
                    {server.admin_notes}
                </div>
            )}
        </div>
    )
}

export function WhitelistManager({ initialServers, isReadOnly = false }: WhitelistManagerProps) {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    const activeServers = initialServers.filter(s => s.is_active && !s.is_ignored && !s.is_blocked)
    const inactiveServers = initialServers.filter(s => !s.is_active && !s.is_ignored && !s.is_blocked)
    const ignoredServers = initialServers.filter(s => s.is_ignored && !s.is_blocked)
    const blockedServers = initialServers.filter(s => s.is_blocked)

    async function handleAddServer(formData: FormData) {
        setError(null)
        startTransition(async () => {
            const result = await addWhitelistedServer(formData)
            if (result.error) {
                setError(result.error)
            } else {
                const form = document.getElementById("add-server-form") as HTMLFormElement
                form.reset()
            }
        })
    }

    return (
        <div className="space-y-6">
            {isReadOnly && (
                <Alert>
                    <Eye className="h-4 w-4" />
                    <AlertTitle>Read-only view</AlertTitle>
                    <AlertDescription>You have viewer access. Contact an admin to make changes.</AlertDescription>
                </Alert>
            )}

            {!isReadOnly && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle>Add New Server</CardTitle>
                        <CardDescription>Manually add a server to the whitelist (or re-activate an existing one).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form id="add-server-form" action={handleAddServer} className="flex flex-col md:flex-row gap-3 items-end">
                            <div className="grid w-full gap-1.5">
                                <label htmlFor="ip" className="text-sm font-medium">Server IP</label>
                                <Input name="ip" id="ip" placeholder="1.2.3.4" required />
                            </div>
                            <div className="grid w-full gap-1.5">
                                <label htmlFor="name" className="text-sm font-medium">Admin Label (Optional)</label>
                                <Input name="name" id="name" placeholder="My BF1942 Server" />
                            </div>
                            <Button type="submit" disabled={isPending} className="shrink-0">
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Server"}
                            </Button>
                        </form>
                        {error && (
                            <Alert variant="destructive" className="mt-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Pending / Inactive — shown first, needs action */}
            {inactiveServers.length > 0 && (
                <Card className="border-yellow-500/40 bg-yellow-500/5">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-yellow-500" />
                                Pending Approval
                            </span>
                            <Badge className="bg-yellow-500 text-white">{inactiveServers.length}</Badge>
                        </CardTitle>
                        <CardDescription>Servers seen by the ingest engine but not yet approved. Review and approve, ignore, or block each one.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-y border-yellow-500/20 bg-yellow-500/10">
                                        <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2">Server</th>
                                        <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2 whitespace-nowrap">State</th>
                                        <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2 whitespace-nowrap">
                                            <span className="flex items-center gap-1"><Users className="h-3 w-3" />Players</span>
                                        </th>
                                        <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2 whitespace-nowrap">
                                            <span className="flex items-center gap-1"><MapIcon className="h-3 w-3" />Map</span>
                                        </th>
                                        <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2 whitespace-nowrap">
                                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Last Seen</span>
                                        </th>
                                        {!isReadOnly && <th className="text-right text-xs font-medium text-muted-foreground px-4 py-2">Actions</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-yellow-500/10">
                                    {inactiveServers.map((server) => (
                                        <tr key={server.ip} className="hover:bg-yellow-500/10 transition-colors">
                                            <td className="px-4 py-2.5"><ServerNameCell server={server} /></td>
                                            <td className="px-3 py-2.5"><StateBadge state={server.current_state} /></td>
                                            <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                                                {server.current_player_count !== null && server.current_state !== 'OFFLINE'
                                                    ? `${server.current_player_count}/${server.current_max_players}`
                                                    : <span className="text-muted-foreground/50">—</span>}
                                            </td>
                                            <td className="px-3 py-2.5 text-xs text-muted-foreground max-w-[140px]">
                                                {server.current_map && server.current_state !== 'OFFLINE'
                                                    ? <span className="truncate block" title={server.current_map}>{server.current_map}</span>
                                                    : <span className="text-muted-foreground/50">—</span>}
                                            </td>
                                            <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                                                {server.last_seen
                                                    ? <span title={new Date(server.last_seen).toLocaleString()}>{formatTimeAgo(new Date(server.last_seen))}</span>
                                                    : <span className="italic">Never</span>}
                                            </td>
                                            {!isReadOnly && (
                                                <td className="px-4 py-2.5">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <Button
                                                            size="sm"
                                                            className="bg-green-600 hover:bg-green-700 text-white h-7 text-xs px-2.5"
                                                            onClick={() => startTransition(async () => { await toggleServerStatus(server.ip, true) })}
                                                            disabled={isPending}
                                                        >
                                                            <ShieldCheck className="w-3 h-3 mr-1" />
                                                            Approve
                                                        </Button>
                                                        <DetailsDialog server={server} />
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-7 text-xs px-2.5 text-yellow-600 hover:bg-yellow-500/10 border-yellow-500/30"
                                                            onClick={() => {
                                                                if (confirm("Ignore this server? It will be hidden but can be restored later.")) {
                                                                    startTransition(async () => { await removeWhitelistedServer(server.ip) })
                                                                }
                                                            }}
                                                            disabled={isPending}
                                                        >
                                                            <ShieldAlert className="w-3 h-3 mr-1" />
                                                            Ignore
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-7 text-xs px-2.5 text-destructive hover:bg-destructive/10 border-destructive/20"
                                                            onClick={() => {
                                                                if (confirm(`Block ${resolveDisplayName(server)}? This permanently blacklists the IP. You can unblock it later.`)) {
                                                                    startTransition(async () => { await blockServer(server.ip) })
                                                                }
                                                            }}
                                                            disabled={isPending}
                                                        >
                                                            <Ban className="w-3 h-3 mr-1" />
                                                            Block
                                                        </Button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Active Whitelist */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-green-500" />
                            Active Whitelist
                        </span>
                        <Badge variant="secondary">{activeServers.length}</Badge>
                    </CardTitle>
                    <CardDescription>Servers currently being tracked and displayed.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {activeServers.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic px-4 pb-4">No active servers.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-y bg-muted/40">
                                        <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2">Server</th>
                                        <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2 whitespace-nowrap">State</th>
                                        <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2 whitespace-nowrap">
                                            <span className="flex items-center gap-1"><Users className="h-3 w-3" />Players</span>
                                        </th>
                                        <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2 whitespace-nowrap">
                                            <span className="flex items-center gap-1"><MapIcon className="h-3 w-3" />Map</span>
                                        </th>
                                        <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2 whitespace-nowrap">
                                            <span className="flex items-center gap-1"><Database className="h-3 w-3" />Rounds</span>
                                        </th>
                                        <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2 whitespace-nowrap">
                                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Last Seen</span>
                                        </th>
                                        {!isReadOnly && <th className="text-right text-xs font-medium text-muted-foreground px-4 py-2">Actions</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {activeServers.map((server) => (
                                        <tr key={server.ip} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-2.5"><ServerNameCell server={server} /></td>
                                            <td className="px-3 py-2.5"><StateBadge state={server.current_state} /></td>
                                            <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                                                {server.current_player_count !== null && server.current_state !== 'OFFLINE'
                                                    ? `${server.current_player_count}/${server.current_max_players}`
                                                    : <span className="text-muted-foreground/50">—</span>}
                                            </td>
                                            <td className="px-3 py-2.5 text-xs text-muted-foreground max-w-[140px]">
                                                {server.current_map && server.current_state !== 'OFFLINE'
                                                    ? <span className="truncate block" title={server.current_map}>{server.current_map}</span>
                                                    : <span className="text-muted-foreground/50">—</span>}
                                            </td>
                                            <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                                                {server.total_rounds > 0 ? server.total_rounds.toLocaleString() : <span className="text-muted-foreground/50">—</span>}
                                            </td>
                                            <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                                                {server.last_seen
                                                    ? <span title={new Date(server.last_seen).toLocaleString()}>{formatTimeAgo(new Date(server.last_seen))}</span>
                                                    : <span className="italic">Never</span>}
                                            </td>
                                            {!isReadOnly && (
                                                <td className="px-4 py-2.5">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Switch
                                                            checked={server.is_active}
                                                            onCheckedChange={(checked) => startTransition(async () => { await toggleServerStatus(server.ip, checked) })}
                                                            disabled={isPending}
                                                            title="Toggle tracking"
                                                        />
                                                        <DetailsDialog server={server} />
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 text-muted-foreground hover:text-yellow-500"
                                                            onClick={() => {
                                                                if (confirm("Ignore this server? It will be hidden but can be restored later.")) {
                                                                    startTransition(async () => { await removeWhitelistedServer(server.ip) })
                                                                }
                                                            }}
                                                            disabled={isPending}
                                                            title="Ignore Server"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                            onClick={() => {
                                                                if (confirm(`Block ${resolveDisplayName(server)}? This will permanently blacklist the IP. You can unblock it later.`)) {
                                                                    startTransition(async () => { await blockServer(server.ip) })
                                                                }
                                                            }}
                                                            disabled={isPending}
                                                            title="Block Server"
                                                        >
                                                            <Ban className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Ignored Servers */}
            {ignoredServers.length > 0 && (
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="ignored" className="border rounded-lg overflow-hidden">
                        <AccordionTrigger className="hover:no-underline px-4 py-3">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <ShieldAlert className="w-4 h-4" />
                                <span className="text-sm">Ignored Servers</span>
                                <Badge variant="outline" className="ml-1">{ignoredServers.length}</Badge>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-y bg-muted/40">
                                            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2">Server</th>
                                            <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2 whitespace-nowrap">
                                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Last Seen</span>
                                            </th>
                                            {!isReadOnly && <th className="text-right text-xs font-medium text-muted-foreground px-4 py-2">Actions</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {ignoredServers.map((server) => (
                                            <tr key={server.ip} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-4 py-2.5"><ServerNameCell server={server} /></td>
                                                <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                                                    {server.last_seen
                                                        ? <span title={new Date(server.last_seen).toLocaleString()}>{formatTimeAgo(new Date(server.last_seen))}</span>
                                                        : <span className="italic">Never</span>}
                                                </td>
                                                {!isReadOnly && (
                                                    <td className="px-4 py-2.5">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <DetailsDialog server={server} />
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-7 text-xs px-2.5"
                                                                onClick={() => startTransition(async () => { await unignoreServer(server.ip) })}
                                                                disabled={isPending}
                                                            >
                                                                <RotateCcw className="w-3 h-3 mr-1" />
                                                                Restore
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-7 text-xs px-2.5 text-destructive hover:bg-destructive/10 border-destructive/20"
                                                                onClick={() => {
                                                                    if (confirm(`Block ${resolveDisplayName(server)}? This permanently blacklists the IP.`)) {
                                                                        startTransition(async () => { await blockServer(server.ip) })
                                                                    }
                                                                }}
                                                                disabled={isPending}
                                                            >
                                                                <Ban className="w-3 h-3 mr-1" />
                                                                Block
                                                            </Button>
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            )}

            {/* Blocked Servers */}
            {blockedServers.length > 0 && (
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="blocked" className="border border-destructive/30 rounded-lg overflow-hidden bg-destructive/5">
                        <AccordionTrigger className="hover:no-underline px-4 py-3">
                            <div className="flex items-center gap-2 text-destructive">
                                <Ban className="w-4 h-4" />
                                <span className="text-sm">Blocked Servers</span>
                                <Badge variant="destructive" className="ml-1">{blockedServers.length}</Badge>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-y border-destructive/20 bg-destructive/10">
                                            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2">Server</th>
                                            <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2 whitespace-nowrap">
                                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Last Seen</span>
                                            </th>
                                            {!isReadOnly && <th className="text-right text-xs font-medium text-muted-foreground px-4 py-2">Actions</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-destructive/10">
                                        {blockedServers.map((server) => (
                                            <tr key={server.ip} className="hover:bg-destructive/10 transition-colors">
                                                <td className="px-4 py-2.5">
                                                    <div className="min-w-0">
                                                        <div className="font-medium text-sm text-destructive/80 truncate max-w-[220px]">{resolveDisplayName(server)}</div>
                                                        <div className="text-xs text-muted-foreground font-mono">{server.port ? `${server.ip}:${server.port}` : server.ip}</div>
                                                        {server.admin_notes && (
                                                            <div className="text-[10px] text-muted-foreground italic truncate max-w-[220px] mt-0.5">{server.admin_notes}</div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                                                    {server.last_seen
                                                        ? <span title={new Date(server.last_seen).toLocaleString()}>{formatTimeAgo(new Date(server.last_seen))}</span>
                                                        : <span className="italic">Never</span>}
                                                </td>
                                                {!isReadOnly && (
                                                    <td className="px-4 py-2.5">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <DetailsDialog server={server} />
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-7 text-xs px-2.5"
                                                                onClick={() => {
                                                                    if (confirm(`Unblock ${resolveDisplayName(server)}? This will remove the blacklist flag and move it to the Ignored list.`)) {
                                                                        startTransition(async () => { await unblockServer(server.ip) })
                                                                    }
                                                                }}
                                                                disabled={isPending}
                                                            >
                                                                <RotateCcw className="w-3 h-3 mr-1" />
                                                                Unblock
                                                            </Button>
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            )}
        </div>
    )
}
