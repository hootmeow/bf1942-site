import { ServerDirectory } from "@/components/server-directory";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
    return data;

  } catch (error) {
    console.error("[Server Fetch] FAILED:", error);
    return { ok: false, servers: [] };
  }
}

export default async function ServersPage() {
  const data = await getServers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Server Directory
        </h1>
        <p className="mt-1 text-muted-foreground">
          Live list of all active battlefields.
        </p>
      </div>

      {(!data || !data.ok) && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            Could not retrieve live server data.
            <br />
            <span className="text-xs opacity-80 font-mono">
              Target: http://127.0.0.1:3000/api/v1/servers
            </span>
          </AlertDescription>
        </Alert>
      )}

      <ServerDirectory initialServers={data?.servers || []} />
    </div>
  );
}