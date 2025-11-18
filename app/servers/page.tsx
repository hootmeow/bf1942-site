import { ServerDirectory } from "@/components/server-directory";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// FIX: Default to localhost:3000/api/v1 since the API is part of the Next.js app
const API_BASE = process.env.API_URL || "http://localhost:3000/api/v1";

async function getServers() {
  const targetUrl = `${API_BASE}/servers`;

  // DEBUG: This will show up in your VS Code terminal so you can see exactly what it's doing
  console.log(`[Server Fetch] Fetching: ${targetUrl}`);

  try {
    const res = await fetch(targetUrl, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000)
    });

    if (!res.ok) {
      console.error(`[Server Fetch] Error ${res.status}: ${res.statusText}`);
      throw new Error(`Status: ${res.status}`);
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

      {!data.ok && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            Could not retrieve live server data.
            <br />
            <span className="text-xs opacity-80 font-mono">
              Target: {API_BASE}/servers
            </span>
          </AlertDescription>
        </Alert>
      )}

      <ServerDirectory initialServers={data.servers || []} />
    </div>
  );
}