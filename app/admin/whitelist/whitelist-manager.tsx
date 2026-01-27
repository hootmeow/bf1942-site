"use client"

import { useState, useTransition } from "react"
import { addWhitelistedServer, removeWhitelistedServer, toggleServerStatus, unignoreServer, updateServerDetails } from "@/app/actions/whitelist"
import type { WhitelistedServer } from "@/app/actions/whitelist"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Loader2, Trash2, ShieldCheck, ShieldAlert, RotateCcw, AlertCircle, FileText, Save } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface WhitelistManagerProps {
    initialServers: WhitelistedServer[]
}

export function WhitelistManager({ initialServers }: WhitelistManagerProps) {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    // Separate servers by status
    const activeServers = initialServers.filter(s => s.is_active && !s.is_ignored)
    const inactiveServers = initialServers.filter(s => !s.is_active && !s.is_ignored)
    const ignoredServers = initialServers.filter(s => s.is_ignored)

    async function handleAddServer(formData: FormData) {
        setError(null)
        startTransition(async () => {
            const result = await addWhitelistedServer(formData)
            if (result.error) {
                setError(result.error)
            } else {
                // Clear the form
                const form = document.getElementById("add-server-form") as HTMLFormElement
                form.reset()
            }
        })
    }

    const DetailsDialog = ({ server }: { server: WhitelistedServer }) => {
        const [notes, setNotes] = useState(server.admin_notes || "")
        const [contact, setContact] = useState(server.owner_contact || "")
        const [open, setOpen] = useState(false)
        const [saving, setSaving] = useState(false)

        const handleSave = async () => {
            setSaving(true)
            await updateServerDetails(server.ip, notes, contact)
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
                        <DialogTitle>Server Details: {server.server_name}</DialogTitle>
                        <DialogDescription>Add internal notes or contact info for {server.ip}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
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
                                placeholder="Internal comments about this server..."
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

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Server</CardTitle>
                    <CardDescription>Manually add a server to the whitelist (or re-activate an existing one).</CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="add-server-form" action={handleAddServer} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="grid w-full gap-1.5">
                            <label htmlFor="ip" className="text-sm font-medium">Server IP</label>
                            <Input name="ip" id="ip" placeholder="1.2.3.4" required />
                        </div>
                        <div className="grid w-full gap-1.5">
                            <label htmlFor="name" className="text-sm font-medium">Server Name (Optional)</label>
                            <Input name="name" id="name" placeholder="My BF1942 Server" />
                        </div>
                        <Button type="submit" disabled={isPending}>
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

            <div className="grid grid-cols-1 gap-8">
                {/* Active Servers */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-green-500" />
                                Active Whitelist
                            </span>
                            <Badge variant="secondary">{activeServers.length}</Badge>
                        </CardTitle>
                        <CardDescription>Servers currently being tracked and displayed.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {activeServers.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic">No active servers.</p>
                        ) : (
                            <div className="rounded-md border">
                                <div className="divide-y">
                                    {activeServers.map((server) => (
                                        <div key={server.ip} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                                            <div className="space-y-1">
                                                <div className="font-medium flex items-center gap-2">
                                                    {server.server_name || "Unknown Server"}
                                                    <Badge variant="outline" className="text-xs font-normal font-mono">{server.ip}</Badge>
                                                    {server.admin_notes && <Badge variant="secondary" className="text-[10px]">Has Notes</Badge>}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Added by {server.added_by || "System"} on {new Date(server.added_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-muted-foreground hidden md:inline">Tracking</span>
                                                    <Switch
                                                        checked={server.is_active}
                                                        onCheckedChange={(checked) => startTransition(async () => { await toggleServerStatus(server.ip, checked) })}
                                                        disabled={isPending}
                                                    />
                                                </div>
                                                <DetailsDialog server={server} />
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="text-muted-foreground hover:text-destructive"
                                                    onClick={() => {
                                                        if (confirm("Are you sure you want to ignore this server? It will be removed from lists.")) {
                                                            startTransition(async () => { await removeWhitelistedServer(server.ip) })
                                                        }
                                                    }}
                                                    disabled={isPending}
                                                    title="Ignore Server"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pending Servers */}
                {inactiveServers.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                                    Detected / Inactive
                                </span>
                                <Badge variant="secondary">{inactiveServers.length}</Badge>
                            </CardTitle>
                            <CardDescription>Known servers that are currently disabled or pending approval.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="rounded-md border bg-yellow-500/5 border-yellow-200 dark:border-yellow-900/50">
                                <div className="divide-y divide-yellow-200 dark:divide-yellow-900/50">
                                    {inactiveServers.map((server) => (
                                        <div key={server.ip} className="flex items-center justify-between p-4">
                                            <div className="space-y-1">
                                                <div className="font-medium flex items-center gap-2">
                                                    {server.server_name || "Unknown Server"}
                                                    <Badge variant="outline" className="text-xs font-normal font-mono">{server.ip}</Badge>
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Added by {server.added_by || "System"}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                    onClick={() => startTransition(async () => { await toggleServerStatus(server.ip, true) })}
                                                    disabled={isPending}
                                                >
                                                    <ShieldCheck className="w-4 h-4 mr-2" />
                                                    Approve
                                                </Button>
                                                <DetailsDialog server={server} />
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-destructive hover:bg-destructive/10 border-destructive/20"
                                                    onClick={() => {
                                                        if (confirm("Ignore this server? It will be hidden.")) {
                                                            startTransition(async () => { await removeWhitelistedServer(server.ip) })
                                                        }
                                                    }}
                                                    disabled={isPending}
                                                >
                                                    <ShieldAlert className="w-4 h-4 mr-2" />
                                                    Ignore
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Ignored Servers Accordion */}
            {ignoredServers.length > 0 && (
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="ignored" className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline py-4">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <ShieldAlert className="w-4 h-4" />
                                <span>Ignored Servers</span>
                                <Badge variant="outline" className="ml-2">{ignoredServers.length}</Badge>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 pb-4">
                                {ignoredServers.map((server) => (
                                    <div key={server.ip} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                                        <div className="space-y-1 overflow-hidden min-w-0">
                                            <div className="font-medium truncate text-sm" title={server.server_name || "Unknown"}>
                                                {server.server_name || "Unknown"}
                                            </div>
                                            <div className="text-xs font-mono text-muted-foreground truncate">
                                                {server.ip}
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="ml-2 shrink-0"
                                            onClick={() => startTransition(async () => { await unignoreServer(server.ip) })}
                                            disabled={isPending}
                                        >
                                            <RotateCcw className="w-3 h-3 mr-2" />
                                            Restore
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            )}
        </div>
    )
}
