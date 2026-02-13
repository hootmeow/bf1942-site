"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { OrgCard } from "@/components/org-card"
import { Loader2, Plus, Search, Users } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"

interface Org {
  org_id: number
  name: string
  tag?: string | null
  description?: string | null
  banner_url?: string | null
  member_count: number
}

export default function OrgsPage() {
  const [orgs, setOrgs] = useState<Org[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const { data: session } = useSession()

  useEffect(() => {
    async function fetchOrgs() {
      setLoading(true)
      try {
        const params = new URLSearchParams({ page: String(page), limit: "20" })
        if (search) params.set("search", search)
        const res = await fetch(`/api/v1/orgs?${params}`)
        if (res.ok) {
          const data = await res.json()
          if (data.ok) {
            setOrgs(data.organizations)
            setTotal(data.total)
          }
        }
      } catch (e) {
        console.error("Failed to fetch orgs:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchOrgs()
  }, [search, page])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Organizations</h1>
            <p className="text-sm text-muted-foreground">Community-created groups and clans</p>
          </div>
        </div>
        {session?.user && (
          <Link href="/orgs/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Organization
            </Button>
          </Link>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search organizations..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : orgs.length === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-muted-foreground">No organizations found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {orgs.map((org) => (
              <OrgCard key={org.org_id} org={org} />
            ))}
          </div>

          {total > 20 && (
            <div className="flex justify-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              <span className="flex items-center text-sm text-muted-foreground px-3">
                Page {page} of {Math.ceil(total / 20)}
              </span>
              <Button variant="outline" size="sm" disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
