import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const tools = [
  {
    title: "BF1942 Map Alert Bot",
    description: "The BF1942 Map Alert Bot is an essential tool that allows your community members to receive private DM alerts the moment their favorite maps start on a server. It also provides a full suite of slash commands to view live server lists, check real-time scoreboards, find players, and more, ensuring you never miss a round.",
    href: "/tools/map-alert",
  },
  {
    title: "Linux BF1942 server",
    description: "Automated setup and patching scripts for running a Battlefield 1942 Dedicated Server on modern 64-bit Linux systems — securely, without ever running the game or related services with elevated privileges.",
    href: "/tools/linux-server",
  },
  {
    title: "Server Config Generator",
    description: "Build your `serversettings.con` file through an interactive web form. This tool guides you through all available server options, from server name and friendly fire to network settings, and compiles a complete, ready-to-download config file, eliminating syntax errors.",
    href: "/tools/server-config",
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

