import { ServerDirectory } from "@/components/server-directory";
import { ServerListSchema } from "@/lib/schemas";
import { AlertTriangle, Server as ServerIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Server Browser",
  description: "Live list of all active Battlefield 1942 servers. Filter by player count, map, and game mode.",
};

async function getServers() {
  // FIX: We intentionally hit the Next.js Proxy (port 3000)
  // This ensures the request goes through the 'rewrites' in next.config.mjs
  // just like it did when it was a Client Component.
  const targetUrl = "http://127.0.0.1:3000/api/v1/servers";

  console.log(`[Server Fetch] Fetching via Proxy: ${targetUrl}`);

  try {
    const res = await fetch(targetUrl, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000)
    });

    if (!res.ok) {
      console.error(`[Server Fetch] Error ${res.status}: ${res.statusText}`);
      // We return null/empty here to allow the page to render the error state
      return { ok: false, servers: [] };
    }

    const data = await res.json();

    // Validate with Zod
    const parsed = ServerListSchema.safeParse(data);
    if (!parsed.success) {
      console.error("[Server Fetch] Validation Error:", parsed.error);
      return { ok: false, servers: [] };
    }

    return parsed.data;

  } catch (error) {
    console.error("[Server Fetch] FAILED:", error);
    return { ok: false, servers: [] };
  }
}

export default async function ServersPage() {
  const data = await getServers();

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl">
        {/* Background blur orbs */}
        <div className="pointer-events-none absolute -top-12 right-0 h-48 w-48 rounded-full bg-green-500/10 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-12 left-0 h-40 w-40 rounded-full bg-blue-500/10 blur-[70px]" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-in-up">
            <div className="rounded-xl bg-green-500/20 p-3">
              <ServerIcon className="h-8 w-8 text-green-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Server Browser
                </h1>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                  <span className="relative flex h-2 w-2 mr-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                  </span>
                  Live
                </Badge>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Real-time tracking of all active Battlefield 1942 servers worldwide
              </p>
            </div>
          </div>
        </div>
      </div>

      {(!data || !data.ok) && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            Could not retrieve live server data. Please try again later.
          </AlertDescription>
        </Alert>
      )}

      <ServerDirectory initialServers={data?.servers || []} />
    </div>
  );
}