import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const tools = [
  {
    title: "Server Config Generator",
    description: "Build compliant server configs with validated presets, rate limits, and mod integrations.",
    href: "#",
  },
  {
    title: "Log Intelligence",
    description: "Stream and annotate server logs to flag anomalies, vote kick abuse, or crash loops.",
    href: "#",
  },
  {
    title: "Latency Diagnostics",
    description: "Trace route visualizations and packet loss monitors for global Battlefield 1942 endpoints.",
    href: "#",
  },
];

export default function ToolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Tools</h1>
        <p className="mt-1 text-muted-foreground">
          Operational utilities crafted by the community to stabilize and enhance gameplay.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <Card key={tool.title} className="flex flex-col border-border/60">
            <CardHeader>
              <CardTitle>{tool.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <CardDescription className="text-sm leading-6 text-muted-foreground">
                {tool.description}
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline">
                <Link href={tool.href}>Go to Tool</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
