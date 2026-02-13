"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServerDirectory, Server } from "@/components/server-directory";
import { Map, Loader2, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";

// Placeholder for map image mapping if we had them
// const getMapImage = (mapName: string) => `/maps/${mapName.toLowerCase().replace(/ /g, '_')}.jpg`;

export default function MapDetailClient() {
    const params = useParams();
    const mapName = typeof params.slug === 'string' ? decodeURIComponent(params.slug) : '';

    const [servers, setServers] = useState<Server[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!mapName) return;

        async function fetchServersPlayingMap() {
            setLoading(true);
            try {
                // Fetch all servers and filter client side for now as we don't have a map search endpoint yet
                // Or if we do, use it. stick to client-side filtering of active servers for "Active Matches"
                const res = await fetch('/api/v1/servers');
                if (res.ok) {
                    const data = await res.json();
                    if (data.ok && Array.isArray(data.servers)) {
                        const playing = data.servers.filter((s: Server) =>
                            s.current_map?.toLowerCase() === mapName.toLowerCase() &&
                            s.current_state === "ACTIVE"
                        );
                        setServers(playing);
                    }
                }
            } catch (e) {
                console.error("Failed to fetch map servers", e);
            } finally {
                setLoading(false);
            }
        }

        fetchServersPlayingMap();
    }, [mapName]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <Map className="h-8 w-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{mapName}</h1>
                    <p className="text-muted-foreground">Map Statistics & Active Servers</p>
                </div>
            </div>

            {/* Info Card - Placeholder for future stats */}
            <Card className="border-border/60 bg-muted/20">
                <CardContent className="p-6 flex gap-4 items-start">
                    <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                        <h3 className="font-semibold">About this Map</h3>
                        <p className="text-sm text-muted-foreground">
                            Global win rates and historical data for {mapName} coming soon.
                            Currently tracking {servers.length} active battles on this map.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Active Servers List */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Active Matches</h2>
                {loading ? (
                    <div className="flex items-center justify-center p-12 text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        Scanning servers...
                    </div>
                ) : servers.length > 0 ? (
                    <ServerDirectory initialServers={servers} />
                ) : (
                    <Alert>
                        <AlertTitle>No Active Battles</AlertTitle>
                        <AlertDescription>
                            There are currently no servers running {mapName}. Check back later!
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    );
}
