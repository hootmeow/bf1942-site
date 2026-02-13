"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface ComponentStatus {
  name: string;
  status: "Operational" | "Degraded" | "Maintenance" | "Unknown";
  description: string;
}

interface SystemHealth {
  status: "Operational" | "Degraded" | "Maintenance";
  components: ComponentStatus[];
  services?: ComponentStatus[];
}

export default function SystemStatusClient() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHealth() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/health`);
        if (!res.ok) throw new Error("Failed to fetch status");
        const data = await res.json();
        setHealth(data);
      } catch (err) {
        console.error(err);
        setError("Unable to connect to status service.");
      } finally {
        setLoading(false);
      }
    }
    fetchHealth();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Fallback if API fails completely
  if (error || !health) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">System Status</h1>
        <Card className="border-red-500/30 bg-red-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              System Status Unavailable
            </CardTitle>
            <CardDescription className="text-red-600/80">
              We couldn't retrieve the live status. The API gateway might be down.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Determine global color
  const globalStatus = health.status;
  let statusColor = "text-green-700 dark:text-green-400";
  let statusBorder = "border-green-500/30 bg-green-500/5 dark:border-green-500/50 dark:bg-green-500/10";
  let StatusIcon = CheckCircle2;

  if (globalStatus === "Degraded" || globalStatus === "Maintenance") {
    statusColor = "text-yellow-700 dark:text-yellow-400";
    statusBorder = "border-yellow-500/30 bg-yellow-500/5 dark:border-yellow-500/50 dark:bg-yellow-500/10";
    StatusIcon = AlertCircle;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">System Status</h1>
        <p className="mt-1 text-muted-foreground">
          Real-time status of all bf1942.online components.
        </p>
      </div>

      <Card className={statusBorder}>
        <CardHeader>
          <CardTitle as="h2" className={`flex items-center gap-3 ${statusColor}`}>
            <StatusIcon className="h-6 w-6" />
            {globalStatus === "Operational" ? "All Systems Operational" : `System ${globalStatus}`}
          </CardTitle>
          <CardDescription className="opacity-90">
            {globalStatus === "Operational"
              ? "All services are currently online and responding normally."
              : "Some services are experiencing issues or are in maintenance mode."}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle as="h2">Infrastructure Health</CardTitle>
          <CardDescription>Connectivity to databases and internal components.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">System</TableHead>
                <TableHead className="w-[150px]">Status</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {health.components
                .filter(c => c.name !== "Telemetry Ingestion")
                .map((component) => (
                  <TableRow key={component.name}>
                    <TableCell className="font-medium text-foreground">{component.name}</TableCell>
                    <TableCell>
                      <Badge variant={component.status === 'Operational' ? 'success' : 'destructive'}
                        className={component.status === 'Degraded' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}>
                        {component.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">{component.description}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Services Section */}
      {health.services && health.services.length > 0 && (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle as="h2">Service Processes</CardTitle>
            <CardDescription>Status of background system services.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Service Name</TableHead>
                  <TableHead className="w-[150px]">Status</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {health.services.map((service) => (
                  <TableRow key={service.name}>
                    <TableCell className="font-medium text-foreground">{service.name}</TableCell>
                    <TableCell>
                      <Badge variant={service.status === 'Operational' ? 'success' : 'destructive'}
                        className={service.status === 'Degraded' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}>
                        {service.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">{service.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <div className="text-xs text-muted-foreground text-center pt-8">
        Status updates automatically. Last check: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}
