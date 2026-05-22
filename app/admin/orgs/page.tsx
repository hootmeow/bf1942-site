"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Trash2, Users, Eye, EyeOff } from "lucide-react"
import { deleteOrganization } from "@/app/actions/org-actions"
import { getAdminOrgs, setOrgVisibility } from "@/app/actions/content-mod-actions"
import { useToast } from "@/components/ui/toast-simple"
import Link from "next/link"

interface Org {
    org_id: number
    name: string
    tag?: string | null
    member_count: number
    created_at: string
    is_hidden?: boolean
}

export default function AdminOrgsPage() {
    const [orgs, setOrgs]       = useState<Org[]>([])
    const [loading, setLoading] = useState(true)
    const [acting, setActing]   = useState<number | null>(null)
    const { toast } = useToast()

    async function fetchOrgs() {
        try {
            const res = await getAdminOrgs()
            if (res.ok) {
                setOrgs(res.orgs as Org[])
            }
        } catch {
            // fallback to external API
            try {
                const res = await fetch("/api/v1/orgs?limit=100")
                if (res.ok) {
                    const data = await res.json()
                    if (data.ok) setOrgs(data.organizations)
                }
            } catch (e) {
                console.error(e)
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchOrgs() }, [])

    async function handleDelete(orgId: number) {
        if (!confirm("Delete this organization?")) return
        setActing(orgId)
        try {
            const res = await deleteOrganization(orgId)
            if (res.ok) {
                setOrgs(orgs.filter(o => o.org_id !== orgId))
                toast({ title: "Deleted", variant: "success" })
            } else {
                toast({ title: "Error", description: res.error, variant: "destructive" })
            }
        } finally {
            setActing(null)
        }
    }

    async function handleToggleHidden(org: Org) {
        setActing(org.org_id)
        try {
            const res = await setOrgVisibility(org.org_id, !org.is_hidden)
            if (res.ok) {
                setOrgs(prev => prev.map(o =>
                    o.org_id === org.org_id ? { ...o, is_hidden: !o.is_hidden } : o
                ))
                toast({ title: org.is_hidden ? "Organization visible" : "Organization hidden", variant: "success" })
            }
        } catch (err) {
            toast({ title: "Error", description: String(err), variant: "destructive" })
        } finally {
            setActing(null)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">Organizations</h1>
            </div>

            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : orgs.length === 0 ? (
                        <p className="text-center py-8 text-muted-foreground">No organizations</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Tag</TableHead>
                                    <TableHead>Members</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orgs.map((org) => (
                                    <TableRow key={org.org_id} className={org.is_hidden ? "opacity-50" : ""}>
                                        <TableCell className="font-mono text-xs">{org.org_id}</TableCell>
                                        <TableCell>
                                            <Link href={`/orgs/${org.org_id}`} className="hover:underline text-primary">
                                                {org.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{org.tag || "—"}</TableCell>
                                        <TableCell>{org.member_count ?? 0}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {org.created_at ? new Date(org.created_at).toLocaleDateString() : "—"}
                                        </TableCell>
                                        <TableCell>
                                            {org.is_hidden ? (
                                                <Badge variant="outline" className="text-xs text-muted-foreground">Hidden</Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-xs text-green-500 border-green-500/30">Visible</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => handleToggleHidden(org)}
                                                    disabled={acting === org.org_id}
                                                    title={org.is_hidden ? "Show org" : "Hide org"}
                                                >
                                                    {acting === org.org_id
                                                        ? <Loader2 className="h-4 w-4 animate-spin" />
                                                        : org.is_hidden
                                                            ? <Eye className="h-4 w-4 text-green-500" />
                                                            : <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                    }
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                                    onClick={() => handleDelete(org.org_id)}
                                                    disabled={acting === org.org_id}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
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
