"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Server, Map as MapIcon, Globe, Target, Ghost } from "lucide-react";
import { ServerFlag } from "@/components/server-flag";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Types
interface LiveServer {
    server_id: number;
    current_server_name: string;
    current_map: string;
    current_player_count: number;
    current_max_players: number;
    ip: string;
    port: number;
}

interface WarRoomState {
    servers: LiveServer[];
    totalPlayers: number;
    activeServersCount: number;
    lastUpdated: Date;
}

export default function WarRoomPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<WarRoomState>({
        servers: [],
        totalPlayers: 0,
        activeServersCount: 0,
        lastUpdated: new Date()
    });

    // Session Tracking (Mocked for now, future idea: "Track My Session")
    const [sessionStart] = useState(new Date());
    const [sessionKills, setSessionKills] = useState(0);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/v1/servers');
            if (res.ok) {
                const json = await res.json();
                if (json.ok && Array.isArray(json.servers)) {
                    const active = json.servers.filter((s: any) => s.current_state === "ACTIVE");

                    let totalP = 0;
                    active.forEach((s: any) => totalP += s.current_player_count);

                    setData({
                        servers: active,
                        totalPlayers: totalP,
                        activeServersCount: active.length,
                        lastUpdated: new Date()
                    });
                }
            }
        } catch (e) {
            console.error("War Room Poll Failed", e);
        } finally {
            setLoading(false);
        }
    };

    // Poll every 30s
    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)] space-y-4">
            {/* Header / StatusBar */}
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-red-600 flex items-center gap-2">
                        <Target className="h-8 w-8" />
                        WAR ROOM
                    </h1>
                    <p className="text-muted-foreground text-sm uppercase tracking-widest font-mono">
                        LIVE TACTICAL DASHBOARD
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <div className="text-xs text-muted-foreground">LOCAL TIME</div>
                        <div className="font-mono text-xl">{new Date().toLocaleTimeString()}</div>
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={fetchData}
                        disabled={loading}
                        className={cn(loading && "animate-spin")}
                    >
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">

                {/* Left Column: Global Status */}
                <div className="space-y-4">
                    <Card className="bg-card/50 border-border/60">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">GLOBAL STATUS</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2 text-sm"><Globe className="h-4 w-4 text-blue-500" /> Active Fronts</span>
                                <span className="text-2xl font-mono font-bold">{data.activeServersCount}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2 text-sm"><UsersIcon className="h-4 w-4 text-green-500" /> Soldiers Deployed</span>
                                <span className="text-2xl font-mono font-bold text-green-500">{data.totalPlayers}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/50 border-border/60">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">SESSION TRACKER</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-6 text-muted-foreground text-sm border border-dashed rounded-md">
                                <Ghost className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                Tracker Inactive<br />
                                <span className="text-xs">Select your player profile to start tracking live stats.</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Center/Right: Live Server Feeds */}
                <div className="md:col-span-3 space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {data.servers.map((server) => (
                            <Card key={server.server_id} className="bg-card/40 border-l-4 border-l-primary hover:bg-card/60 transition-colors">
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="space-y-1">
                                            <h3 className="font-bold flex items-center gap-2 text-lg">
                                                <ServerFlag ip={server.ip} />
                                                <Link href={`/servers/${server.server_id}`} className="hover:underline line-clamp-1">
                                                    {server.current_server_name}
                                                </Link>
                                            </h3>
                                            <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                                                <span className="flex items-center gap-1"><MapIcon className="h-3 w-3" /> {server.current_map}</span>
                                                <span className="flex items-center gap-1"><Server className="h-3 w-3" /> {server.ip}</span>
                                            </div>
                                        </div>
                                        <Badge variant={server.current_player_count > 20 ? "default" : "secondary"} className="font-mono">
                                            {server.current_player_count} / {server.current_max_players}
                                        </Badge>
                                    </div>

                                    {/* Visual Player Bar */}
                                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden flex">
                                        <div
                                            className="h-full bg-primary transition-all duration-1000"
                                            style={{ width: `${(server.current_player_count / server.current_max_players) * 100}%` }}
                                        ></div>
                                    </div>

                                </CardContent>
                            </Card>
                        ))}

                        {data.servers.length === 0 && !loading && (
                            <div className="col-span-full py-12 text-center text-muted-foreground">
                                <AlertCircle className="h-10 w-10 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold">No Active Fronts</h3>
                                <p>All servers are currently offline or empty.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Icon helper
function UsersIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    )
}
