"use client"

import { useEffect, useState } from "react"
import { OrgCard } from "@/components/org-card"
import { Search, Users, Plus, Shield } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
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
    <div className="space-y-8 pb-8">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl border border-[#1e2a14] shadow-2xl"
        style={{ background: "linear-gradient(135deg, #0d1208 0%, #0a0f06 50%, #060a04 100%)" }}
      >
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-500/6 blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary/6 blur-[70px] pointer-events-none" />

        <div className="relative z-10 px-8 py-12 sm:px-12 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400 mb-4">
                <Shield className="h-2.5 w-2.5" />
                Squads &amp; Clans
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                Organi-<br />
                <span className="text-primary">zations</span>
              </h1>
              <p className="mt-3 text-slate-400 max-w-md text-sm leading-relaxed">
                Community-created groups, clans, and squads. Find your unit or form a new one.
              </p>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-4">
              <div className="flex items-center gap-6 font-mono">
                <div className="text-center">
                  <p className="text-2xl font-black text-primary tabular-nums">{total}</p>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">Organizations</p>
                </div>
              </div>
              {session?.user && (
                <Link href="/orgs/create">
                  <button className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/15 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-primary transition-all hover:bg-primary/25 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/10">
                    <Plus className="h-4 w-4" />
                    Create Org
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Search ────────────────────────────────────────────────────── */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
        <input
          type="text"
          placeholder="Search organizations..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="w-full rounded-xl border border-[#1e2a14] bg-[#070b05] py-3 pl-10 pr-4 font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 transition-colors"
        />
      </div>

      {/* ── Grid ──────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[140px] rounded-xl bg-[#0a0f06]" />
          ))}
        </div>
      ) : orgs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#1e2a14] bg-[#060a04] py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#1e2a14] bg-[#0a0f06] mb-5">
            <Users className="h-7 w-7 text-muted-foreground/30" />
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground/40 mb-2">No Organizations Found</p>
          <p className="text-sm text-muted-foreground/60 max-w-xs">
            {search ? "Try a different search term." : "No organizations yet. Be the first to create one."}
          </p>
          {session?.user && !search && (
            <Link href="/orgs/create">
              <button className="mt-6 flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary/20 transition-colors">
                <Plus className="h-3.5 w-3.5" />
                Create Organization
              </button>
            </Link>
          )}
        </div>
      ) : (
        <>
          {search && (
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
              {orgs.length} result{orgs.length !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;
            </p>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {orgs.map((org) => (
              <OrgCard key={org.org_id} org={org} />
            ))}
          </div>

          {total > 20 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="rounded-lg border border-[#1e2a14] bg-[#070b05] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:border-[#2a3a1a] hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              <span className="font-mono text-xs text-muted-foreground/60 tabular-nums">
                {page} / {Math.ceil(total / 20)}
              </span>
              <button
                disabled={page >= Math.ceil(total / 20)}
                onClick={() => setPage(page + 1)}
                className="rounded-lg border border-[#1e2a14] bg-[#070b05] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:border-[#2a3a1a] hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
