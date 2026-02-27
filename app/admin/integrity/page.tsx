import { getIntegrityStats, getReviewQueue } from "../actions/integrity-actions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { AlertTriangle, CheckCircle, Shield, Server, Users, FileText, Eye } from "lucide-react"

export const metadata = {
    title: "Integrity Dashboard | Admin",
    description: "Monitor game integrity and detect suspicious activity",
}

export default async function IntegrityDashboardPage() {
    const statsData = await getIntegrityStats()
    const queueData = await getReviewQueue('pending', 10)

    if (!statsData.ok) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Integrity Dashboard</h1>
                <p className="text-destructive">Failed to load dashboard: {statsData.error}</p>
            </div>
        )
    }

    const stats = statsData.stats
    const recentItems = (queueData.ok && queueData.items) ? queueData.items : []

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Shield className="h-6 w-6" />
                        Integrity Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Automated detection of stat padding, abuse, and suspicious activity
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/review-queue">
                        <Eye className="h-4 w-4 mr-2" />
                        Review Queue
                    </Link>
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Pending Reviews
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pending_reviews}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Items awaiting admin action
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            High Risk
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">{stats.high_risk_items}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Priority review needed
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Server className="h-4 w-4" />
                            Blacklisted Servers
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.blacklisted_servers}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Servers excluded from ranking
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Flagged Players
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.flagged_players}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Players under investigation
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent High-Risk Items */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Recent Detections</CardTitle>
                            <CardDescription>Latest items flagged by automated detection</CardDescription>
                        </div>
                        {recentItems.length > 0 && (
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/admin/review-queue">View All</Link>
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {recentItems.length === 0 ? (
                        <div className="text-center py-8">
                            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                            <p className="text-sm text-muted-foreground">
                                No pending items. System running cleanly!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentItems.map((item: any) => {
                                const itemDetails = item.item_details || {}
                                const getRiskColor = (score: number) => {
                                    if (score >= 80) return "text-red-500"
                                    if (score >= 60) return "text-orange-500"
                                    return "text-yellow-500"
                                }

                                return (
                                    <div
                                        key={item.queue_id}
                                        className="flex items-center justify-between p-3 rounded-lg border border-border/60 hover:bg-muted/30 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="outline" className="text-xs">
                                                    {item.item_type}
                                                </Badge>
                                                <span className={`text-sm font-medium ${getRiskColor(item.risk_score)}`}>
                                                    Risk: {item.risk_score}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium">{item.flag_reason}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {item.item_type === 'round' && `Round #${itemDetails.round_id} • ${itemDetails.map_name}`}
                                                {item.item_type === 'player' && `Player: ${itemDetails.canonical_name}`}
                                                {item.item_type === 'server' && `Server: ${itemDetails.server_name}`}
                                            </p>
                                        </div>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href="/admin/review-queue">Review</Link>
                                        </Button>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Detection Run History */}
            {statsData.recentRuns && statsData.recentRuns.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Detection History</CardTitle>
                        <CardDescription>Recent automated detection runs</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {statsData.recentRuns.map((run: any, i: number) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between text-sm p-2 rounded border border-border/40"
                                >
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <span>{run.detection_type}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span>{run.items_flagged} flagged</span>
                                        <span>{run.run_duration_ms}ms</span>
                                        <span>{new Date(run.run_at).toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* System Info */}
            <Card className="border-blue-500/30 bg-blue-500/5">
                <CardHeader>
                    <CardTitle className="text-blue-500">How It Works</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                    <p>
                        <strong>Automated Detection:</strong> The system runs hourly to scan for suspicious patterns like stat farming, impossible K/D ratios, and coordinated abuse.
                    </p>
                    <p>
                        <strong>Human Oversight:</strong> Nothing is automatically banned or unranked. All flagged items go to the review queue for your decision.
                    </p>
                    <p>
                        <strong>Risk Scoring:</strong> Each flagged item gets a risk score (1-100) to help prioritize reviews. Higher scores = more suspicious.
                    </p>
                    <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/review-queue">Go to Review Queue</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
