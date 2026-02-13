"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Trash2, Users } from "lucide-react"
import { deleteOrganization } from "@/app/actions/org-actions"
import { useToast } from "@/components/ui/toast-simple"
import Link from "next/link"

interface Org {
  org_id: number
  name: string
  tag?: string | null
  member_count: number
  created_at: string
}

export default function AdminOrgsPage() {
  const [orgs, setOrgs] = useState<Org[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  async function fetchOrgs() {
    try {
      const res = await fetch("/api/v1/orgs?limit=100")
      if (res.ok) {
        const data = await res.json()
        if (data.ok) setOrgs(data.organizations)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrgs() }, [])

  async function handleDelete(orgId: number) {
    if (!confirm("Delete this organization?")) return
    const res = await deleteOrganization(orgId)
    if (res.ok) {
      setOrgs(orgs.filter(o => o.org_id !== orgId))
      toast({ title: "Deleted", variant: "success" })
    } else {
      toast({ title: "Error", description: res.error, variant: "destructive" })
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
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orgs.map((org) => (
                  <TableRow key={org.org_id}>
                    <TableCell className="font-mono text-xs">{org.org_id}</TableCell>
                    <TableCell>
                      <Link href={`/orgs/${org.org_id}`} className="hover:underline text-primary">
                        {org.name}
                      </Link>
                    </TableCell>
                    <TableCell>{org.tag || "-"}</TableCell>
                    <TableCell>{org.member_count}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {org.created_at ? new Date(org.created_at).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(org.org_id)}
                      >
                        <Trash2 className="h-4 w-4" />
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
