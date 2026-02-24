import { auth } from "@/lib/auth";
import { pool } from "@/lib/db";
import { isUserAdmin } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, TrendingUp, Clock, Map, Users, Activity, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Use local proxy
const API_BASE = "http://127.0.0.1:3000/api/v1";

async function getServerBySlug(slug: string) {
    try {
        const res = await fetch(`${API_BASE}/servers/search?search=${slug}`, { cache: 'no-store' });
        if (!res.ok) return null;
        const data = await res.json();
        return data.ok ? data.server_info : null;
    } catch (e) {
        return null;
    }
}

async function checkServerOwnership(serverId: number, userId: string): Promise<boolean> {
    try {
        const result = await pool.query(
            `SELECT 1 FROM server_claims WHERE server_id = $1 AND user_id = $2 AND status = 'APPROVED'`,
            [serverId, userId]
        );
        return result.rows.length > 0;
    } catch (e) {
        return false;
    }
}

type Props = {
    params: Promise<{ slug: string }>;
};

export default async function ServerAdminPage({ params }: Props) {
    const { slug } = await params;
    const session = await auth();

    // Require authentication
    if (!session?.user?.id) {
        redirect(`/auth/signin?callbackUrl=/servers/${slug}/admin`);
    }

    const server = await getServerBySlug(slug);

    if (!server) {
        return (
            <div className="container py-10">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-red-500">Server Not Found</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">The requested server could not be found.</p>
                        <Button asChild className="mt-4">
                            <Link href="/servers">Back to Servers</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Check permissions: must be owner or admin
    const isAdmin = await isUserAdmin(session.user.id);
    const isOwner = await checkServerOwnership(server.server_id, session.user.id);

    if (!isOwner && !isAdmin) {
        return (
            <div className="container py-10">
                <Card className="border-red-500/50 bg-red-900/20">
                    <CardHeader>
                        <CardTitle className="text-red-500 flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Access Denied
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">
                            You do not have permission to access this server's admin dashboard.
                            Only the verified server owner can view this page.
                        </p>
                        <Button asChild variant="outline">
                            <Link href={`/servers/${slug}`}>Back to Server Page</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container py-6 md:py-10 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Shield className="h-8 w-8 text-amber-500" />
                        Server Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {server.current_server_name || server.server_name || "Unknown Server"}
                    </p>
                </div>
                <Button asChild variant="outline">
                    <Link href={`/servers/${slug}`}>View Public Page</Link>
                </Button>
            </div>

            {isAdmin && !isOwner && (
                <Card className="border-amber-500/50 bg-amber-900/20">
                    <CardContent className="py-4">
                        <div className="flex items-center gap-2 text-amber-500 text-sm">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Viewing as admin (not owner)</span>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Quick Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-border/60 bg-card/40">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Players</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {server.current_player_count}/{server.current_max_players}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {Math.round((server.current_player_count / server.current_max_players) * 100)}% capacity
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border/60 bg-card/40">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Map</CardTitle>
                        <Map className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold truncate">{server.current_map || "N/A"}</div>
                        <p className="text-xs text-muted-foreground">
                            {server.current_gametype || "Unknown"} mode
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border/60 bg-card/40">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Server Status</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">Online</div>
                        <p className="text-xs text-muted-foreground">
                            {server.is_blacklisted ? "Unranked" : "Ranked"} matches
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border/60 bg-card/40">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Time Remaining</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {Math.max(0, Math.floor((server.round_time_remain || 0) / 60))}m
                        </div>
                        <p className="text-xs text-muted-foreground">Current round</p>
                    </CardContent>
                </Card>
            </div>

            {/* Analytics Coming Soon */}
            <Card className="border-border/60 bg-gradient-to-br from-card/40 to-primary/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Advanced Analytics
                    </CardTitle>
                    <CardDescription>
                        Detailed insights for server owners
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
                            <h3 className="font-semibold text-sm mb-2 text-primary">Player Retention</h3>
                            <p className="text-xs text-muted-foreground">
                                Track returning players, new vs. veteran ratios, and player loyalty metrics.
                            </p>
                            <div className="mt-3 text-2xl font-bold text-muted-foreground">Coming Soon</div>
                        </div>

                        <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
                            <h3 className="font-semibold text-sm mb-2 text-primary">Peak Hours Analysis</h3>
                            <p className="text-xs text-muted-foreground">
                                Identify when your server is busiest to optimize map rotations and events.
                            </p>
                            <div className="mt-3 text-2xl font-bold text-muted-foreground">Coming Soon</div>
                        </div>

                        <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
                            <h3 className="font-semibold text-sm mb-2 text-primary">Map Performance</h3>
                            <p className="text-xs text-muted-foreground">
                                See which maps drive engagement and which cause player dropoff.
                            </p>
                            <div className="mt-3 text-2xl font-bold text-muted-foreground">Coming Soon</div>
                        </div>
                    </div>

                    <p className="text-sm text-muted-foreground text-center pt-4">
                        These analytics features are currently in development. Check back soon for detailed insights!
                    </p>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-border/60 bg-card/40">
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Manage your server</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        <Button asChild variant="outline">
                            <Link href={`/servers/${slug}`}>View Server Page</Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href={`/servers/${slug}/rounds`}>View Match History</Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href={`/servers/${slug}/rankings`}>View Rankings</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
