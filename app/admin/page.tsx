import { pool } from "@/lib/db"
import { getIntegrityStats } from "./actions/integrity-actions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
    UserCheck, Server, Bot, AlertTriangle, Shield, Target,
    Calendar, Users, Newspaper, Eye, ArrowRight, CheckCircle2,
} from "lucide-react"

async function getDashboardCounts() {
    try {
        const res = await pool.query(`
            SELECT
                (SELECT COUNT(*) FROM claim_requests   WHERE status = 'PENDING')                       AS pending_player_claims,
                (SELECT COUNT(*) FROM server_claims    WHERE status = 'PENDING')                       AS pending_server_claims,
                (SELECT COUNT(*) FROM bot_round_reports WHERE status = 'pending')                      AS pending_bot_reports,
                (SELECT COUNT(*) FROM challenges       WHERE is_active = TRUE AND end_time > NOW())    AS active_challenges,
                (SELECT COUNT(*) FROM events           WHERE event_date >= NOW())                      AS upcoming_events,
                (SELECT COUNT(*) FROM organizations)                                                   AS total_orgs,
                (SELECT COUNT(*) FROM players         WHERE is_verified = TRUE)                       AS verified_players
        `)
        return res.rows[0]
    } catch {
        return null
    }
}

export const metadata = {
    title: "Dashboard | Admin",
}

export default async function AdminDashboardPage() {
    const [counts, integrity] = await Promise.all([
        getDashboardCounts(),
        getIntegrityStats(),
    ])

    const pendingPlayerClaims = parseInt(counts?.pending_player_claims ?? "0", 10)
    const pendingServerClaims = parseInt(counts?.pending_server_claims ?? "0", 10)
    const pendingBotReports  = parseInt(counts?.pending_bot_reports  ?? "0", 10)
    const activeChallenges   = parseInt(counts?.active_challenges    ?? "0", 10)
    const upcomingEvents     = parseInt(counts?.upcoming_events      ?? "0", 10)
    const totalOrgs          = parseInt(counts?.total_orgs           ?? "0", 10)
    const verifiedPlayers    = parseInt(counts?.verified_players     ?? "0", 10)

    const pendingReviews  = integrity.ok ? parseInt(integrity.stats?.pending_reviews  ?? "0", 10) : 0
    const highRiskItems   = integrity.ok ? parseInt(integrity.stats?.high_risk_items  ?? "0", 10) : 0
    const flaggedPlayers  = integrity.ok ? parseInt(integrity.stats?.flagged_players  ?? "0", 10) : 0

    const totalActionable = pendingPlayerClaims + pendingServerClaims + pendingBotReports + pendingReviews

    const actionItems = [
        { label: "Player Claims",   count: pendingPlayerClaims, href: "/admin/claims",       icon: UserCheck,  color: "text-blue-400"   },
        { label: "Server Claims",   count: pendingServerClaims, href: "/admin/server-claims", icon: Server,    color: "text-cyan-400"   },
        { label: "Bot Reports",     count: pendingBotReports,   href: "/admin/bot-reports",  icon: Bot,        color: "text-orange-400" },
        { label: "Review Queue",    count: pendingReviews,      href: "/admin/review-queue", icon: Eye,        color: "text-red-400"    },
    ]

    const overviewItems = [
        { label: "Active Challenges",  value: activeChallenges,  href: "/admin/challenges",      icon: Target,      color: "text-primary"    },
        { label: "Upcoming Events",    value: upcomingEvents,    href: "/admin/events",           icon: Calendar,    color: "text-purple-400" },
        { label: "Organizations",      value: totalOrgs,         href: "/admin/orgs",             icon: Users,       color: "text-green-400"  },
        { label: "Verified Players",   value: verifiedPlayers,   href: "/admin/players/verified", icon: Shield,      color: "text-amber-400"  },
        { label: "Flagged Players",    value: flaggedPlayers,    href: "/admin/players/watchlist",icon: AlertTriangle, color: "text-red-400"  },
        { label: "High-Risk Items",    value: highRiskItems,     href: "/admin/integrity",        icon: AlertTriangle, color: "text-orange-400"},
    ]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Platform overview and pending actions
                </p>
            </div>

            {/* Action Required */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        Action Required
                    </h2>
                    {totalActionable === 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-green-500">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            All clear
                        </div>
                    )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {actionItems.map(({ label, count, href, icon: Icon, color }) => (
                        <Link key={href} href={href}>
                            <Card className={`hover:border-border transition-colors ${count > 0 ? "border-amber-500/40 bg-amber-500/5" : ""}`}>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Icon className={`h-4 w-4 ${color}`} />
                                        {label}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-2xl font-bold ${count > 0 ? "text-amber-400" : "text-muted-foreground"}`}>
                                            {count}
                                        </span>
                                        {count > 0 && (
                                            <Badge variant="outline" className="text-xs border-amber-500/40 text-amber-400">
                                                Pending
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Overview Stats */}
            <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                    Platform Overview
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {overviewItems.map(({ label, value, href, icon: Icon, color }) => (
                        <Link key={href} href={href}>
                            <Card className="hover:border-border transition-colors">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Icon className={`h-4 w-4 ${color}`} />
                                        {label}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <span className="text-2xl font-bold">{value}</span>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Quick Links */}
            <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                    Quick Actions
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                        { label: "Publish News Article",  href: "/admin/news",          icon: Newspaper,  desc: "Create or manage site articles" },
                        { label: "Create Challenge",      href: "/admin/challenges",     icon: Target,     desc: "Launch a new community challenge" },
                        { label: "Manage Whitelist",      href: "/admin/whitelist",      icon: Shield,     desc: "Control server data ingestion" },
                        { label: "Player Watchlist",      href: "/admin/players/watchlist", icon: Eye,     desc: "Monitor flagged players" },
                        { label: "Integrity Dashboard",   href: "/admin/integrity",      icon: AlertTriangle, desc: "Review automated detections" },
                        { label: "Audit Log",             href: "/admin/audit-log",      icon: Newspaper,  desc: "View recent admin actions" },
                    ].map(({ label, href, icon: Icon, desc }) => (
                        <Link key={href} href={href}>
                            <Card className="hover:border-border transition-colors h-full">
                                <CardContent className="pt-4 pb-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <div className="flex items-center gap-2 font-medium text-sm mb-1">
                                                <Icon className="h-4 w-4 text-primary" />
                                                {label}
                                            </div>
                                            <p className="text-xs text-muted-foreground">{desc}</p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
