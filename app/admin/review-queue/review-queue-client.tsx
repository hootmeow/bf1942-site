"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { reviewQueueItem, bulkReviewAction } from "../actions/integrity-actions"
import { useRouter } from "next/navigation"
import { AlertTriangle, CheckCircle, XCircle, Flag, Ban, Eye, Trash2 } from "lucide-react"
import Link from "next/link"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"

export default function ReviewQueueClient({
    initialItems,
    initialStatus,
}: {
    initialItems: any[]
    initialStatus: string
}) {
    const router = useRouter()
    const [items, setItems] = useState(initialItems)
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
    const [expandedItem, setExpandedItem] = useState<string | null>(null)
    const [notes, setNotes] = useState<Record<string, string>>({})
    const [processing, setProcessing] = useState(false)

    const handleAction = async (queueId: string, action: string, itemNotes?: string) => {
        setProcessing(true)
        try {
            const result = await reviewQueueItem(queueId, action as any, itemNotes)
            if (result.ok) {
                // Remove from list
                setItems(items.filter(item => item.queue_id !== queueId))
                setSelectedItems(prev => {
                    const next = new Set(prev)
                    next.delete(queueId)
                    return next
                })
            } else {
                alert(result.error)
            }
        } catch (e) {
            console.error(e)
            alert("Failed to process action")
        } finally {
            setProcessing(false)
        }
    }

    const handleBulkAction = async (action: string) => {
        if (selectedItems.size === 0) {
            alert("No items selected")
            return
        }

        if (!confirm(`Are you sure you want to ${action} ${selectedItems.size} items?`)) {
            return
        }

        setProcessing(true)
        try {
            const result = await bulkReviewAction(Array.from(selectedItems), action as any)
            if (result.ok) {
                router.refresh()
            }
        } catch (e) {
            console.error(e)
            alert("Failed to process bulk action")
        } finally {
            setProcessing(false)
        }
    }

    const toggleItemSelection = (queueId: string) => {
        setSelectedItems(prev => {
            const next = new Set(prev)
            if (next.has(queueId)) {
                next.delete(queueId)
            } else {
                next.add(queueId)
            }
            return next
        })
    }

    const getRiskColor = (score: number) => {
        if (score >= 80) return "text-red-500"
        if (score >= 60) return "text-orange-500"
        return "text-yellow-500"
    }

    const getRiskBadge = (score: number) => {
        if (score >= 80) return <Badge variant="destructive">High Risk</Badge>
        if (score >= 60) return <Badge className="bg-orange-500">Medium Risk</Badge>
        return <Badge variant="secondary">Low Risk</Badge>
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Review Queue</h1>
                    <p className="text-sm text-muted-foreground">
                        Review flagged items for integrity issues
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push('/admin/integrity')}
                    >
                        <Eye className="h-4 w-4 mr-2" />
                        Dashboard
                    </Button>
                </div>
            </div>

            {/* Status Tabs */}
            <Tabs
                defaultValue={initialStatus}
                onValueChange={(value) => router.push(`/admin/review-queue?status=${value}`)}
            >
                <TabsList>
                    <TabsTrigger value="pending">Pending ({items.length})</TabsTrigger>
                    <TabsTrigger value="actioned">Actioned</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="dismissed">Dismissed</TabsTrigger>
                    <TabsTrigger value="all">All</TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Bulk Actions */}
            {selectedItems.size > 0 && (
                <Card className="border-blue-500/30 bg-blue-500/5">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                                {selectedItems.size} items selected
                            </span>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleBulkAction('approve')}
                                    disabled={processing}
                                >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve All
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleBulkAction('unrank')}
                                    disabled={processing}
                                >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Unrank All
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleBulkAction('dismiss')}
                                    disabled={processing}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Dismiss All
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Items List */}
            <div className="space-y-4">
                {items.length === 0 && (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                            <p className="text-lg font-medium">All clear!</p>
                            <p className="text-sm text-muted-foreground mt-2">
                                No items in the queue
                            </p>
                        </CardContent>
                    </Card>
                )}

                {items.map((item) => {
                    const isExpanded = expandedItem === item.queue_id
                    const itemDetails = item.item_details || {}

                    return (
                        <Card key={item.queue_id} className="border-border/60">
                            <CardHeader className="pb-3">
                                <div className="flex items-start gap-4">
                                    <Checkbox
                                        checked={selectedItems.has(item.queue_id)}
                                        onCheckedChange={() => toggleItemSelection(item.queue_id)}
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline">{item.item_type}</Badge>
                                                {getRiskBadge(item.risk_score)}
                                                <span className={`text-sm font-mono ${getRiskColor(item.risk_score)}`}>
                                                    Risk: {item.risk_score}
                                                </span>
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(item.created_at).toLocaleString()}
                                            </span>
                                        </div>

                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                                            {item.flag_reason}
                                        </CardTitle>

                                        <CardDescription className="mt-1">
                                            {item.item_type === 'round' && (
                                                <>
                                                    Round #{itemDetails.round_id} on {itemDetails.map_name}
                                                    {' • '}
                                                    {itemDetails.server_name}
                                                    {' • '}
                                                    <Link
                                                        href={`/admin/rounds/${itemDetails.round_id}`}
                                                        className="text-primary hover:underline"
                                                    >
                                                        View Round
                                                    </Link>
                                                </>
                                            )}
                                            {item.item_type === 'player' && (
                                                <>
                                                    Player: {itemDetails.canonical_name || itemDetails.last_known_name}
                                                </>
                                            )}
                                            {item.item_type === 'server' && (
                                                <>
                                                    Server: {itemDetails.server_name} ({itemDetails.ip})
                                                </>
                                            )}
                                        </CardDescription>

                                        {/* Details */}
                                        {item.flag_details && (
                                            <div className="mt-3 text-sm space-y-1">
                                                {Object.entries(item.flag_details).map(([key, value]: [string, any]) => (
                                                    <div key={key} className="flex gap-2">
                                                        <span className="text-muted-foreground capitalize">
                                                            {key.replace(/_/g, ' ')}:
                                                        </span>
                                                        <span className="font-medium">
                                                            {typeof value === 'number' ? value.toFixed(2) : String(value)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-0">
                                {/* Notes */}
                                <Textarea
                                    placeholder="Add notes (optional)..."
                                    value={notes[item.queue_id] || ''}
                                    onChange={(e) => setNotes({ ...notes, [item.queue_id]: e.target.value })}
                                    className="mb-3"
                                    rows={2}
                                />

                                {/* Actions */}
                                <div className="flex gap-2 flex-wrap">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleAction(item.queue_id, 'approve', notes[item.queue_id])}
                                        disabled={processing}
                                    >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Approve
                                    </Button>

                                    {item.item_type === 'round' && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleAction(item.queue_id, 'unrank', notes[item.queue_id])}
                                            disabled={processing}
                                        >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Unrank Round
                                        </Button>
                                    )}

                                    {item.item_type === 'player' && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleAction(item.queue_id, 'flag_player', notes[item.queue_id])}
                                            disabled={processing}
                                        >
                                            <Flag className="h-4 w-4 mr-2" />
                                            Flag Player
                                        </Button>
                                    )}

                                    {item.item_type === 'server' && (
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleAction(item.queue_id, 'blacklist_server', notes[item.queue_id])}
                                            disabled={processing}
                                        >
                                            <Ban className="h-4 w-4 mr-2" />
                                            Blacklist Server
                                        </Button>
                                    )}

                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleAction(item.queue_id, 'dismiss', notes[item.queue_id])}
                                        disabled={processing}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Dismiss
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
