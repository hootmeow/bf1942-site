"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Trash2, Target, Plus, History } from "lucide-react"
import { createChallenge, deleteChallenge } from "@/app/actions/admin-actions"
import { useToast } from "@/components/ui/toast-simple"

interface ChallengeRow {
  challenge_id: number
  title: string
  description: string | null
  stat_type: string
  target_value: number
  current_value: number
  progress_percent: number
  period_type: string
  start_time: string
  end_time: string
  is_completed: boolean
  calculation_mode: string | null
  template_key: string | null
}

interface HistoryRow {
  history_id: number
  title: string
  stat_type: string
  target_value: number
  final_value: number
  progress_percent: number
  period_type: string
  start_time: string
  end_time: string
  is_completed: boolean
}

const STAT_TYPE_OPTIONS = [
  "kills", "score", "deaths", "rounds",
  "player_count", "full_house_rounds", "ace_rounds", "playtime",
]

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toLocaleString()
}

function getTimeRemaining(endTime: string): string {
  const diff = new Date(endTime).getTime() - Date.now()
  if (diff <= 0) return "Ended"
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  if (days > 0) return `${days}d ${hours}h`
  return `${hours}h`
}

export default function AdminChallengesPage() {
  const [challenges, setChallenges] = useState<ChallengeRow[]>([])
  const [history, setHistory] = useState<HistoryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const { toast } = useToast()

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [statType, setStatType] = useState("kills")
  const [targetValue, setTargetValue] = useState("")
  const [periodType, setPeriodType] = useState("weekly")
  const [icon, setIcon] = useState("")
  const [endTime, setEndTime] = useState("")

  async function fetchData() {
    try {
      const [chalRes, histRes] = await Promise.all([
        fetch("/api/v1/challenges?include_completed=true"),
        fetch("/api/v1/challenges/history?limit=20"),
      ])
      if (chalRes.ok) {
        const data = await chalRes.json()
        if (data.ok) setChallenges(data.challenges)
      }
      if (histRes.ok) {
        const data = await histRes.json()
        if (data.ok) setHistory(data.history)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !targetValue || !endTime) return
    setCreating(true)
    try {
      const res = await createChallenge({
        title,
        description: description || undefined,
        stat_type: statType,
        target_value: parseInt(targetValue),
        period_type: periodType,
        icon: icon || undefined,
        end_time: new Date(endTime).toISOString(),
      })
      if (res.ok) {
        toast({ title: "Challenge created", variant: "success" })
        setTitle("")
        setDescription("")
        setTargetValue("")
        setIcon("")
        setEndTime("")
        fetchData()
      }
    } catch (err) {
      toast({ title: "Error", description: String(err), variant: "destructive" })
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(challengeId: number) {
    if (!confirm("Deactivate this challenge?")) return
    try {
      const res = await deleteChallenge(challengeId)
      if (res.ok) {
        setChallenges(challenges.filter(c => c.challenge_id !== challengeId))
        toast({ title: "Challenge deactivated", variant: "success" })
      }
    } catch (err) {
      toast({ title: "Error", description: String(err), variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Target className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Challenges</h1>
      </div>

      {/* Create Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Plus className="h-5 w-5" />
            Create Challenge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Weekly Kill Goal" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Input id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional description" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="stat_type">Stat Type</Label>
              <select id="stat_type" value={statType} onChange={e => setStatType(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                {STAT_TYPE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="target">Target Value</Label>
              <Input id="target" type="number" value={targetValue} onChange={e => setTargetValue(e.target.value)} placeholder="100000" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="period">Period</Label>
              <select id="period" value={periodType} onChange={e => setPeriodType(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="end_time">End Time</Label>
              <Input id="end_time" type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="icon">Icon (optional)</Label>
              <Input id="icon" value={icon} onChange={e => setIcon(e.target.value)} placeholder="target" />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={creating}>
                {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Active Challenges Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Active Challenges</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : challenges.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No active challenges</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Time Left</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {challenges.map(ch => (
                  <TableRow key={ch.challenge_id}>
                    <TableCell className="font-mono text-xs">{ch.challenge_id}</TableCell>
                    <TableCell className="font-medium">{ch.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{ch.stat_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[140px]">
                        <Progress value={Math.min(ch.progress_percent || 0, 100)} className="h-2 flex-1" />
                        <span className="text-xs font-mono w-12 text-right">
                          {(ch.progress_percent || 0).toFixed(1)}%
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {formatNumber(ch.current_value)} / {formatNumber(ch.target_value)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">{ch.period_type}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {getTimeRemaining(ch.end_time)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {ch.calculation_mode || "incremental"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(ch.challenge_id)}
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

      {/* History */}
      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <History className="h-5 w-5" />
              Challenge History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map(h => (
                  <TableRow key={h.history_id}>
                    <TableCell className="font-medium">{h.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{h.stat_type}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      {formatNumber(h.final_value)} / {formatNumber(h.target_value)}
                      <span className="ml-1 text-muted-foreground">({(h.progress_percent || 0).toFixed(1)}%)</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">{h.period_type}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(h.start_time).toLocaleDateString()} — {new Date(h.end_time).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={h.is_completed ? "default" : "secondary"} className="text-xs">
                        {h.is_completed ? "Completed" : "Expired"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
