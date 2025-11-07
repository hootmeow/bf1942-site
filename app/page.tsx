"use client";

import { useState, useEffect } from "react";
import { Activity, Users, BarChart, Loader2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PlayerActivityChart } from "@/components/charts"; // Use the updated chart
import { cn } from "@/lib/utils"; 

// --- API Types ---
interface PopularMap {
  map_name: string;
  rounds_played: number;
}

interface GlobalMetrics {
  total_rounds_processed: number;
  total_players_seen: number;
  active_players_24h: number;
  active_players_24h_change_pct: number;
  popular_maps_7_days: PopularMap[];
  global_concurrency_heatmap_24h: number[]; // Updated
  global_concurrency_heatmap_7d: number[]; // Updated
}

interface MetricsApiResponse {
  ok: boolean;
  [key: string]: any; 
}

// --- Main Page Component ---

export default function Page() {
  const [data, setData] = useState<GlobalMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGlobalMetrics() {
      try {
        const response = await fetch("/api/v1/metrics/global");
        if (!response.ok) {
          throw new Error(`Failed to fetch global metrics: ${response.statusText}`);
        }
        const result: MetricsApiResponse = await response.json();
        if (result.ok) {
          setData(result as unknown as GlobalMetrics);
        } else {
          throw new Error("API returned an error");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchGlobalMetrics();
  }, []);

  // This check fixes the build error
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error || "Failed to load dashboard data."}</AlertDescription>
      </Alert>
    );
  }

  // Format the change percentage
  const changePct = data.active_players_24h_change_pct.toFixed(2);
  const isPositiveChange = data.active_players_24h_change_pct >= 0;

  return (
    <div className="space-y-6">
      {/* 1. Welcome Text - Centered & Larger */}
      <div className="space-y-2 py-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
          Welcome Back to the Battlefield
        </h1>
        <p className="text-lg text-muted-foreground">
          Here is your live, global battlefield report. All stats are updated in real-time.
        </p>
      </div>

      {/* 2. Stat Cards - Smaller */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Players (24h)</CardTitle>
              <div className="mt-2 text-2xl font-semibold text-foreground">{data.active_players_24h}</div>
            </div>
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <Activity className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              <span className={cn("font-medium", isPositiveChange ? "text-green-500" : "text-red-500")}>
                {isPositiveChange ? "+" : ""}{changePct}%
              </span>
              {" "}from yesterday.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Players Seen</CardTitle>
              <div className="mt-2 text-2xl font-semibold text-foreground">{data.total_players_seen}</div>
            </div>
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Total unique players recorded.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Rounds Processed</CardTitle>
              <div className="mt-2 text-2xl font-semibold text-foreground">{data.total_rounds_processed}</div>
            </div>
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <BarChart className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Total rounds logged by the tracker.
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* 3. Charts (new 50/50 layout) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Player Activity Chart */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Global Player Concurrency</CardTitle>
            <CardDescription>Average player count by hour (UTC).</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {/* This now has the 24h/7d toggle inside it */}
            <PlayerActivityChart
              data24h={data.global_concurrency_heatmap_24h}
              data7d={data.global_concurrency_heatmap_7d}
            />
          </CardContent>
        </Card>
        
        {/* Popular Maps Table */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Popular Maps (7 Days)</CardTitle>
            <CardDescription>Top 10 most played maps by round.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {/* The table is now scrollable on small screens to be more compact */}
            <div className="h-[308px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Map</TableHead>
                    <TableHead className="text-right">Rounds Played</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.popular_maps_7_days.map((map) => (
                    <TableRow key={map.map_name}>
                      <TableCell className="font-medium text-foreground">{map.map_name}</TableCell>
                      <TableCell className="text-right">{map.rounds_played}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}