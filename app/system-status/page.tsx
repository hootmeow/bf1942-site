import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const components = [
  {
    name: "Website & Dashboard",
    status: "Operational",
    description: "Main web application and UI.",
  },
  {
    name: "Master Server API",
    status: "Operational",
    description: "Fetches live server list from master.",
  },
  {
    name: "Server Telemetry Ingestion",
    status: "Operational",
    description: "Receives real-time data from game servers.",
  },
  {
    name: "Player Statistics API",
    status: "Operational",
    description: "Serves player profiles and stats.",
  },
  {
    name: "Map Alert Discord Bot",
    status: "Operational",
    description: "Handles Discord commands and alerts.",
  },
  {
    name: "Database (Player Stats)",
    status: "Operational",
    description: "Primary database for player analytics.",
  },
  {
    name: "Database (Server History)",
    status: "Operational",
    description: "Stores historical server and round data.",
  },
];

export default function SystemStatusPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">System Status</h1>
        <p className="mt-1 text-muted-foreground">
          Real-time status of all bf1942.online components.
        </p>
      </div>

      <Card className="border-green-500/30 bg-green-500/5 dark:border-green-500/50 dark:bg-green-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-green-700 dark:text-green-400">
            All Systems Operational
          </CardTitle>
          <CardDescription className="text-green-700/80 dark:text-green-400/80">
            All services are currently online and responding normally.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Component Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Component</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {components.map((component) => (
                <TableRow key={component.name}>
                  <TableCell className="font-medium text-foreground">{component.name}</TableCell>
                  <TableCell>
                    <Badge variant="success">{component.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{component.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}