"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Eye, Check, X, ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { getBotReports, reviewBotReport } from "@/app/actions/bot-report-actions"

type BotReport = {
    report_id: string
    round_id: string
    reason: string
    detection_details: any
    status: string
    reviewed_at: string | null
    created_at: string
    map_name: string
    gamemode: string
    start_time: string
    end_time: string
    duration_seconds: number
    server_name: string
}

const STATUS_TABS = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "dismissed", label: "Dismissed" },
    { value: "all", label: "All" },
]

export default function AdminBotReportsPage() {
    const [reports, setReports] = useState<BotReport[]>([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState("pending")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [reviewingId, setReviewingId] = useState<string | null>(null)

    const loadReports = useCallback(async () => {
        setLoading(true)
        try {
            const data = await getBotReports(page, statusFilter)
            setReports(data.reports)
            setTotalPages(data.totalPages)
        } catch (e) {
            console.error("Failed to load bot reports:", e)
        } finally {
            setLoading(false)
        }
    }, [page, statusFilter])

    useEffect(() => {
        loadReports()
    }, [loadReports])

    async function handleReview(reportId: string, status: "approved" | "dismissed") {
        setReviewingId(reportId)
        try {
            await reviewBotReport(reportId, status)
            await loadReports()
        } catch (e) {
            console.error("Failed to review report:", e)
        } finally {
            setReviewingId(null)
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Bot Round Reports</h1>

            <div className="flex gap-2">
                {STATUS_TABS.map((tab) => (
                    <Button
                        key={tab.value}
                        variant={statusFilter === tab.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => { setStatusFilter(tab.value); setPage(1) }}
                    >
                        {tab.label}
                    </Button>
                ))}
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-12 text-muted-foreground">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading reports...
                </div>
            ) : reports.length === 0 ? (
                <div className="text-center text-muted-foreground p-12">No reports found.</div>
            ) : (
                <div className="space-y-3">
                    {reports.map((report) => {
                        const details = typeof report.detection_details === 'string'
                            ? JSON.parse(report.detection_details)
                            : report.detection_details
                        const topPlayer = details?.top_player
                        const isExpanded = expandedId === report.report_id

                        return (
                            <div key={report.report_id} className="rounded-lg border border-border/60 bg-card/40 p-4 space-y-3">
                                {/* Top row: Round info + Status */}
                                <div className="flex items-start justify-between gap-4 flex-wrap">
                                    <div className="space-y-1.5 flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Link href={`/stats/rounds/${report.round_id}`} className="text-primary hover:underline font-mono text-sm font-semibold">
                                                Round #{report.round_id}
                                            </Link>
                                            {report.status === "pending" && (
                                                <span className="text-xs font-semibold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">PENDING</span>
                                            )}
                                            {report.status === "approved" && (
                                                <span className="text-xs font-semibold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded">UNRANKED</span>
                                            )}
                                            {report.status === "dismissed" && (
                                                <span className="text-xs font-semibold text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">DISMISSED</span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                            <span><strong>Map:</strong> {report.map_name}</span>
                                            <span><strong>Server:</strong> {report.server_name}</span>
                                            <span><strong>Date:</strong> {new Date(report.start_time).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                            <span><strong>Reason:</strong> {report.reason}</span>
                                            <span><strong>KSR:</strong> <span className="font-mono">{details?.ksr ?? "—"}</span></span>
                                            {topPlayer && (
                                                <span><strong>Top Player:</strong> {topPlayer.name} ({topPlayer.kills}K/{topPlayer.deaths}D)</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setExpandedId(isExpanded ? null : report.report_id)}
                                        >
                                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                        </Button>
                                        {report.status !== "approved" && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-green-500 hover:text-green-400"
                                                disabled={reviewingId === report.report_id}
                                                onClick={() => handleReview(report.report_id, "approved")}
                                            >
                                                <Check className="h-4 w-4 mr-1" /> Unranked
                                            </Button>
                                        )}
                                        {report.status !== "dismissed" && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-muted-foreground"
                                                disabled={reviewingId === report.report_id}
                                                onClick={() => handleReview(report.report_id, "dismissed")}
                                            >
                                                <X className="h-4 w-4 mr-1" /> Dismiss
                                            </Button>
                                        )}
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/stats/rounds/${report.round_id}`}>
                                                <Eye className="h-4 w-4 mr-1" /> View
                                            </Link>
                                        </Button>
                                    </div>
                                </div>

                                {/* Expanded details */}
                                {isExpanded && (
                                    <div className="rounded-md bg-muted/20 p-3 border border-border/40">
                                        <pre className="text-xs text-muted-foreground overflow-auto max-h-48">
                                            {JSON.stringify(details, null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                        <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                    </Button>
                    <div className="flex items-center text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                    </div>
                    <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                        Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            )}
        </div>
    )
}
