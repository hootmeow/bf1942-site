import Link from "next/link";
import Image from "next/image"; // --- IMPORTED Image ---
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

// Metadata from the site for SEO
export const metadata: Metadata = {
  title: "BF1942 Map Alert Bot | BF1942 Command Center",
  description: "Get notified on Discord when your favorite BF1942 maps are running. Never miss a round!",
};

const setupSteps = [
  {
    title: "Click the Invite Button",
    description: "Use the 'Add to Discord' button on this page to start the process.",
  },
  {
    title: "Select Your Server",
    description: "Choose the server you want to add the bot to from the Discord dropdown menu.",
  },
  {
    title: "Authorize",
    description: "Grant the bot the required permissions. It only needs to create slash commands and send messages.",
  },
];

const commands = [
  { name: "/subscribe", description: "Get a private DM when your favorite map starts on a server." },
  { name: "/list", description: "Lists all of your current map alert subscriptions." },
  { name: "/unsubscribe", description: "Instantly removes all of your map alerts." },
  { name: "/servers", description: "Get a private list of all active servers." },
  { name: "/serverinfo [server_name]", description: "Get a detailed, real-time scoreboard for a server." },
  { name: "/playing [map_name]", description: "Find all servers currently running a specific map." },
  { name: "/find [player_name]", description: "See which server a player is currently on." },
  { name: "/seed", description: "Find servers with a low player count to get a game started." },
];

export default function MapAlertBotPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          BF1942 Map Alert Bot
        </h1>
        <p className="mt-1 text-muted-foreground">
          A powerful Discord bot for your Battlefield 1942 community. Never miss your favorite map again.
        </p>
      </div>

      {/* Add to Discord Button */}
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link
            href="https://discord.com/oauth2/authorize?client_id=1383245299828392028&permissions=18432&integration_type=0&scope=bot+applications.commands"
            target="_blank"
            rel="noreferrer"
          >
            Add to Discord
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* How it Works */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-border/60">
            <CardHeader>
              {/* --- UPDATED: Use as="h2" --- */}
              <CardTitle as="h2">How it Works</CardTitle>
              <CardDescription>
                Get set up in less than a minute. You must have "Manage Server" permissions in Discord.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {setupSteps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-lg font-semibold text-primary">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="font-medium text-foreground">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Screenshots */}
          <Card className="border-border/60">
            <CardHeader>
              {/* --- UPDATED: Use as="h2" --- */}
              <CardTitle as="h2">Screenshots</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* --- MODIFIED: Replaced <img> with <Image> --- */}
              <Image
                src="/images/bot-alert.png"
                alt="Discord bot map alert notification"
                width={400}
                height={250}
                className="rounded-md border border-border/60"
              />
              <Image
                src="/images/bot-serverinfo.png"
                alt="Discord bot server info command"
                width={400}
                height={250}
                className="rounded-md border border-border/60"
              />
              <Image
                src="/images/bot-commands.png"
                alt="Discord bot slash commands list"
                width={400}
                height={250}
                className="rounded-md border border-border/60"
              />
              {/* --- END MODIFICATION --- */}
            </CardContent>
          </Card>
        </div>

        {/* Commands List */}
        <Card className="border-border/60 lg:col-span-1">
          <CardHeader>
            {/* --- UPDATED: Use as="h2" --- */}
            <CardTitle as="h2">Available Commands</CardTitle>
            <CardDescription>
              The bot uses Discord's built-in slash commands. Just type `/` to see the list.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {commands.map((cmd) => (
                <li key={cmd.name} className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">{cmd.name}</span>
                  <span className="text-sm text-muted-foreground">{cmd.description}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}