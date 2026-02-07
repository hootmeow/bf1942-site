import { GameHealthDashboard } from "@/components/game-health-dashboard";
import { GlobalMetricsSchema } from "@/lib/schemas";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const dynamic = "force-dynamic";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Game Health",
  description:
    "30-day population trends, server activity, rounds played, and game mode breakdown for Battlefield 1942.",
};

async function getHealthData() {
  const targetUrl = "http://127.0.0.1:3000/api/v1/metrics/global/health";
  try {
    const res = await fetch(targetUrl, {
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.ok) return null;
    return data;
  } catch (error) {
    console.error("[GameHealth Fetch] FAILED:", error);
    return null;
  }
}

async function getGlobalMetrics() {
  const targetUrl = "http://127.0.0.1:3000/api/v1/metrics/global";
  try {
    const res = await fetch(targetUrl, {
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const parsed = GlobalMetricsSchema.safeParse(data);
    if (!parsed.success) return null;
    return parsed.data;
  } catch (error) {
    console.error("[GameHealth GlobalMetrics Fetch] FAILED:", error);
    return null;
  }
}

export default async function GameHealthPage() {
  const [healthData, globalMetrics] = await Promise.all([
    getHealthData(),
    getGlobalMetrics(),
  ]);

  if (!healthData) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            Could not retrieve game health data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <GameHealthDashboard
      healthData={healthData}
      globalMetrics={globalMetrics}
    />
  );
}
