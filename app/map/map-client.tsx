"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertTriangle, Radio } from "lucide-react";
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
            // Show ALL servers
            setServers(data.servers);
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
      {/* Hero */}
      <div
        className="relative overflow-hidden rounded-2xl border border-[#1e2a14] shadow-2xl"
        style={{ background: "linear-gradient(135deg, #0d1208 0%, #0a0f06 50%, #060a04 100%)" }}
      >
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-sky-500/6 blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary/6 blur-[70px] pointer-events-none" />

        <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-sky-400 mb-4">
                <Radio className="h-2.5 w-2.5 animate-pulse" />
                Live Intelligence
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                Global Conflict<br />
                <span className="text-primary">Map</span>
              </h1>
              <p className="mt-3 text-slate-400 max-w-md text-sm leading-relaxed">
                Live view of all active Battlefield 1942 servers worldwide. Click a location to see server details.
              </p>
            </div>
            <div className="flex items-center gap-6 font-mono">
              <div className="text-center">
                <p className="text-2xl font-black text-primary tabular-nums">{servers.length}</p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">Active Servers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-sky-400 tabular-nums">
                  {servers.reduce((sum, s) => sum + s.current_player_count, 0)}
                </p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">Players Online</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <GlobalConflictMap servers={servers} />
    </div>
  );
}
