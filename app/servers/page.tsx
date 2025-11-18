import { ServerDirectory } from "@/components/server-directory";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Note: Ensure API_URL is set in .env (e.g., http://localhost:8000)
// If running strictly local for dev without env, fallback to localhost
const API_BASE = process.env.API_URL || "http://127.0.0.1:8000"; 

async function getServers() {
  try {
    // 'no-store' ensures real-time data on every refresh
    const res = await fetch(`${API_BASE}/servers`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch servers:", error);
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
             Could not retrieve live server data from the backend.
           </AlertDescription>
         </Alert>
      )}

      <ServerDirectory initialServers={data.servers || []} />
    </div>
  );
}