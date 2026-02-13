"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { GlobalConflictMap } from "@/components/global-conflict-map";

interface LiveServer {
  server_id: number;
  current_server_name: string;
  current_map: string;
  current_player_count: number;
  current_max_players: number;
  ip: string;
  port: number;
}

export default function MapClient() {
  const [servers, setServers] = useState<LiveServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServers() {
      try {
        const res = await fetch("/api/v1/servers");
        if (res.ok) {
          const data = await res.json();
          if (data.servers) {
            // Filter to only include active servers with players
            const activeServers = data.servers.filter(
              (s: any) => s.current_state === "ACTIVE" || s.current_player_count > 0
            );
            setServers(activeServers);
          }
        } else {
          setError("Failed to load servers");
        }
      } catch (e) {
        console.error("Failed to fetch servers", e);
        setError("Failed to load servers");
      } finally {
        setLoading(false);
      }
    }

    fetchServers();

    // Refresh every 30 seconds
    const interval = setInterval(fetchServers, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <p>Loading global map...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Global Conflict Map</h1>
        <p className="text-muted-foreground mt-2">
          Live view of all active Battlefield 1942 servers worldwide. Click on a location to see server details.
        </p>
      </div>

      <GlobalConflictMap servers={servers} />
    </div>
  );
}
