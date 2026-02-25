import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle, Github, Bot, Bell, Clock, Users, TrendingUp, Trophy,
  UserCircle, Eye, BarChart3, CalendarDays, Server, Map, Gamepad2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "BF1942 Map Alert Bot",
  description: "Get notified on Discord when your favorite BF1942 maps are running. Track players, view leaderboards, and never miss a round!",
};

const setupSteps = [
  {
    title: "Click the Invite Button",
    description: "Use the 'Add to Discord' button below to start the authorization process.",
  },
  {
    title: "Select Your Server",
    description: "Choose the Discord server you want to add the bot to from the dropdown menu.",
  },
  {
    title: "Authorize",
    description: "Grant the bot the required permissions. It only needs to create slash commands and send messages.",
  },
];

const commandCategories = [
  {
    title: "Server & Player Info",
    icon: Server,
    color: "bg-blue-500/15 text-blue-400",
    commands: [
      {
        name: "/servers",
        description: "Browse a live paginated list of the top 25 active BF1942 servers sorted by player count.",
      },
      {
        name: "/playing [map]",
        description: "Find all servers currently running a specific map. Uses autocomplete to help you search.",
      },
      {
        name: "/findgametype [gametype]",
        description: "Find all servers running a specific gametype (Conquest, CTF, etc.) with autocomplete support.",
      },
      {
        name: "/find [player]",
        description: "Locate a specific player on any active server with their current stats (score, kills, deaths).",
      },
      {
        name: "/seed",
        description: "Find low-population servers (1-5 players) that need seeding, sorted by player count.",
      },
      {
        name: "/serverinfo [server]",
        description: "Get a detailed live scoreboard for a server: teams, tickets, map info, player lists, and IP address.",
      },
      {
        name: "/trends [server]",
        description: "View server activity trends: top players (24h), popular maps (24h), population graphs, and peak hours.",
      },
    ],
  },
  {
    title: "Alert & Subscription Management",
    icon: Bell,
    color: "bg-amber-500/15 text-amber-400",
    commands: [
      {
        name: "/subscribe [server] [map] [players_over] [channel]",
        description: "Subscribe to alerts when a specific map starts on a server. Optionally set minimum player threshold.",
      },
      {
        name: "/subscribe_server [server] [players_over] [channel]",
        description: "Subscribe to alerts for ANY map change on a server. Great for tracking your favorite server.",
      },
      {
        name: "/subscribe_rounds [server] [channel]",
        description: "Get notified when a round ends with map name, winner, duration, and top 3 players.",
      },
      {
        name: "/unsubscribe_rounds [server]",
        description: "Stop receiving round result notifications for a specific server.",
      },
      {
        name: "/list",
        description: "Privately view all your active subscriptions with pause status and settings.",
      },
      {
        name: "/unsubscribe",
        description: "Remove ALL of your subscriptions at once. Use with caution!",
      },
      {
        name: "/pause_alerts [pause|unpause]",
        description: "Temporarily pause or unpause all your map alerts without deleting them.",
      },
    ],
  },
  {
    title: "Do Not Disturb (DND)",
    icon: Clock,
    color: "bg-purple-500/15 text-purple-400",
    commands: [
      {
        name: "/dnd set [start_hour] [end_hour] [days] [timezone]",
        description: "Set a DND schedule to block all alerts during specific hours and days with timezone support.",
      },
      {
        name: "/dnd view",
        description: "View your current DND schedule converted to your local timezone.",
      },
      {
        name: "/dnd clear",
        description: "Remove your DND schedule to resume all alerts 24/7.",
      },
    ],
  },
  {
    title: "Leaderboards & Rankings",
    icon: Trophy,
    color: "bg-green-500/15 text-green-400",
    commands: [
      {
        name: "/leaderboard [period] [server]",
        description: "View top 10 players by V5 score. Filter by all-time, weekly, or monthly, and optionally by server.",
      },
    ],
  },
  {
    title: "Player Profiles",
    icon: UserCircle,
    color: "bg-cyan-500/15 text-cyan-400",
    commands: [
      {
        name: "/profile [player]",
        description: "Comprehensive player stats: lifetime K/D, win rate, top maps/servers, recent rounds, personal bests, and estimated playtime.",
      },
    ],
  },
  {
    title: "Player Watchlist",
    icon: Eye,
    color: "bg-pink-500/15 text-pink-400",
    commands: [
      {
        name: "/watch [player]",
        description: "Get a DM notification when a specific player joins any server. Track friends, rivals, or clan members.",
      },
      {
        name: "/unwatch [player]",
        description: "Stop tracking a player and remove them from your watchlist.",
      },
      {
        name: "/watchlist",
        description: "View all players you are currently watching.",
      },
    ],
  },
  {
    title: "Statistics & Analytics",
    icon: BarChart3,
    color: "bg-orange-500/15 text-orange-400",
    commands: [
      {
        name: "/alert_stats",
        description: "Top 10 most subscribed maps and servers across all bot users.",
      },
      {
        name: "/stats",
        description: "Global BF1942 statistics: total rounds played, unique players, currently active, and popular maps (7 days).",
      },
    ],
  },
  {
    title: "Daily Digest",
    icon: CalendarDays,
    color: "bg-indigo-500/15 text-indigo-400",
    commands: [
      {
        name: "/digest_subscribe [channel]",
        description: "Subscribe to a daily summary of BF1942 activity sent around midnight UTC. Includes top maps, servers, and player stats.",
      },
      {
        name: "/digest_unsubscribe",
        description: "Stop receiving the daily digest in your server.",
      },
    ],
  },
];

const features = [
  {
    icon: Bell,
    title: "Real-Time Alerts",
    description: "Get instant notifications when your favorite maps start or rounds end.",
  },
  {
    icon: TrendingUp,
    title: "Server Trends",
    description: "Track server activity, popular maps, and peak player hours.",
  },
  {
    icon: Eye,
    title: "Player Watchlist",
    description: "Monitor when specific players join servers — perfect for coordinating with friends.",
  },
  {
    icon: Trophy,
    title: "Leaderboards",
    description: "View top players by score with all-time, weekly, and monthly rankings.",
  },
  {
    icon: Clock,
    title: "DND Scheduling",
    description: "Set custom quiet hours with timezone support to avoid late-night notifications.",
  },
  {
    icon: CalendarDays,
    title: "Daily Digest",
    description: "Automated daily summaries of community activity and top performers.",
  },
];

export default function MapAlertBotPage() {
  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl">
        {/* Background blur orbs */}
        <div className="pointer-events-none absolute -top-12 right-0 h-48 w-48 rounded-full bg-primary/10 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-12 left-0 h-40 w-40 rounded-full bg-blue-500/10 blur-[70px]" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-in-up">
            <div className="rounded-xl bg-primary/20 p-3">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  BF1942 Map Alert Bot
                </h1>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                  <span className="relative flex h-2 w-2 mr-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                  </span>
                  Online
                </Badge>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Never miss your favorite map. Real-time alerts, leaderboards, player tracking, and more for the BF1942 community.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6 animate-fade-in-up stagger-1">
            <Button asChild size="lg" className="shadow-lg shadow-primary/20">
              <Link
                href="https://discord.com/oauth2/authorize?client_id=1383245299828392028&permissions=18432&integration_type=0&scope=bot+applications.commands"
                target="_blank"
                rel="noreferrer"
              >
                <Bot className="mr-2 h-5 w-5" />
                Add to Discord
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link
                href="https://github.com/hootmeow/bf1942-map-alert"
                target="_blank"
                rel="noreferrer"
              >
                <Github className="mr-2 h-5 w-5" />
                View on GitHub
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Key Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <Card
              key={feature.title}
              className={`border-border/60 bg-card/40 card-hover animate-fade-in-up ${
                i === 0 ? "stagger-1" : i === 1 ? "stagger-2" : i === 2 ? "stagger-3" : ""
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/15 p-2.5 text-primary shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Setup Guide */}
      <Card className="border-border/60 bg-card/40">
        <CardHeader>
          <CardTitle as="h2" className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Quick Setup
          </CardTitle>
          <CardDescription>
            Get started in under a minute. You must have "Manage Server" permissions in Discord.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {setupSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-base font-bold text-primary shrink-0">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
                {index < setupSteps.length - 1 && (
                  <div className="hidden sm:block absolute top-4 -right-4 w-8 border-t border-dashed border-border/60" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Commands Reference */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Gamepad2 className="h-6 w-6 text-primary" />
            Command Reference
          </h2>
          <p className="text-muted-foreground mt-1">
            All commands use Discord's slash command system. Just type <code className="text-xs bg-muted px-1.5 py-0.5 rounded">/</code> to see the full list.
          </p>
        </div>

        <div className="grid gap-4">
          {commandCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.title} className="border-border/60 bg-card/40">
                <CardHeader className="pb-3">
                  <CardTitle as="h3" className="flex items-center gap-2 text-lg">
                    <div className={`rounded-lg p-2 ${category.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    {category.title}
                    <Badge variant="outline" className="ml-auto text-xs">
                      {category.commands.length} {category.commands.length === 1 ? "command" : "commands"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.commands.map((cmd) => (
                      <div key={cmd.name} className="rounded-lg border border-border/40 bg-muted/30 p-3">
                        <div className="flex items-start gap-2">
                          <code className="font-mono text-sm font-semibold text-primary shrink-0">{cmd.name}</code>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{cmd.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Screenshots */}
      <Card className="border-border/60 bg-card/40">
        <CardHeader>
          <CardTitle as="h2" className="flex items-center gap-2">
            <Image
              src="/favicon.ico"
              alt=""
              width={20}
              height={20}
              className="opacity-80"
            />
            In Action
          </CardTitle>
          <CardDescription>
            See the bot in action with real Discord screenshots.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Image
                src="/images/bot-alert.png"
                alt="Discord bot map alert notification"
                width={400}
                height={250}
                className="rounded-lg border border-border/60 w-full"
              />
              <p className="text-xs text-muted-foreground text-center">Map alert notification</p>
            </div>
            <div className="space-y-2">
              <Image
                src="/images/bot-serverinfo.png"
                alt="Discord bot server info command"
                width={400}
                height={250}
                className="rounded-lg border border-border/60 w-full"
              />
              <p className="text-xs text-muted-foreground text-center">Live server scoreboard</p>
            </div>
            <div className="space-y-2">
              <Image
                src="/images/bot-commands.png"
                alt="Discord bot slash commands list"
                width={400}
                height={250}
                className="rounded-lg border border-border/60 w-full"
              />
              <p className="text-xs text-muted-foreground text-center">Slash commands menu</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer CTA */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
          <div>
            <h3 className="font-semibold text-lg">Ready to get started?</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Add the bot to your Discord server and never miss a round.
            </p>
          </div>
          <Button asChild size="lg">
            <Link
              href="https://discord.com/oauth2/authorize?client_id=1383245299828392028&permissions=18432&integration_type=0&scope=bot+applications.commands"
              target="_blank"
              rel="noreferrer"
            >
              <Bot className="mr-2 h-5 w-5" />
              Add to Discord
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
