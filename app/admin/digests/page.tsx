"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Trash2, Newspaper } from "lucide-react"
import { deleteDigest } from "@/app/admin/actions"
import { useToast } from "@/components/ui/toast-simple"
import Link from "next/link"

interface DigestRow {
  digest_id: number
  week_number: number
  period_start: string
  period_end: string
  created_at: string
  digest_data: {
    summary: { total_rounds: number; total_kills: number; unique_players: number }
  }
}

export default function AdminDigestsPage() {
  const [digests, setDigests] = useState<DigestRow[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  async function fetchDigests() {
    try {
      const res = await fetch("/api/v1/news/digests")
      if (res.ok) {
        const data = await res.json()
        if (data.ok) setDigests(data.digests)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDigests() }, [])

  async function handleDelete(weekNumber: number) {
    if (!confirm(`Delete Weekly Sitrep #${weekNumber}? This cannot be undone.`)) return
    const res = await deleteDigest(weekNumber)
    if (res.ok) {
      setDigests(digests.filter(d => d.week_number !== weekNumber))
      toast({ title: "Deleted", variant: "success" })
    } else {
      toast({ title: "Error", description: res.error, variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Newspaper className="h-6 w-6 text-purple-500" />
        <h1 className="text-2xl font-bold">Weekly Digests</h1>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : digests.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No digests generated yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead className="text-right">Rounds</TableHead>
                  <TableHead className="text-right">Kills</TableHead>
                  <TableHead className="text-right">Players</TableHead>
                  <TableHead className="text-right">Created</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {digests.map((d) => (
                  <TableRow key={d.digest_id}>
                    <TableCell className="font-mono text-xs">{d.week_number}</TableCell>
                    <TableCell>
                      <Link href={`/news/weekly-sitrep/${d.week_number}`} className="hover:underline text-primary text-sm">
                        {d.period_start} &rarr; {d.period_end}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-sm">
                      {d.digest_data.summary.total_rounds}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-sm">
                      {d.digest_data.summary.total_kills.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-sm">
                      {d.digest_data.summary.unique_players}
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {new Date(d.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(d.week_number)}
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
