import Link from "next/link";
import Image from "next/image"; // --- IMPORTED Image ---
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Github } from "lucide-react"; // --- ADDED GITHUB ICON ---

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

// --- COMMANDS STRUCTURE (Unchanged) ---
const commandCategories = [
  {
    title: "Server & Player Info",
    commands: [
      {
        name: "/servers",
        description:
          "Provides a live list of the top 25 active BF1942 servers. It queries the servers table for all servers marked ACTIVE or EMPTY and sorts them by the highest player count, showing each server's name, current map, and player count.",
      },
      {
        name: "/playing",
        description:
          "Finds all online servers that are currently playing a specific map. This command uses an autocomplete to help you find a map name, then queries the servers table for all active servers where the current_map matches your selection.",
      },
      {
        name: "/findgametype",
        description:
          "Finds all online servers running a specific gametype (like Conquest, CTF, etc.). It uses an autocomplete to show you available gametypes, then queries the servers table to list all matching servers, sorted by player count.",
      },
      {
        name: "/find",
        description:
          "Locates a specific player on any active server. It queries the live_player_snapshot table for an exact, case-sensitive player name, then joins with the servers table to return the server name and the player's current stats (score, kills, deaths).",
      },
      {
        name: "/seed",
        description:
          "Helps you find servers that need seeding. It queries the servers table for ACTIVE servers that have between 1 and 5 players, then lists them sorted with the lowest player count first.",
      },
      {
        name: "/serverinfo",
        description:
          "Gives you a detailed, live scoreboard for a single server. It joins the servers and live_server_snapshot tables to get all server info, then grabs all players from live_player_snapshot for that server, displaying teams, tickets, and sorted player lists.",
      },
    ],
  },
  {
    title: "Alert & Subscription Management",
    commands: [
      {
        name: "/subscribe",
        description:
          "Subscribes you to an alert for a specific map on a specific server. It saves your user_id, the server_name, and the map_name into the subscriptions table so the bot can alert you.",
      },
      {
        name: "/subscribe_server",
        description:
          "Subscribes you to alerts for any map change on a specific server. It works just like /subscribe but uses a special map_name value (*all*) to signify a server-wide subscription.",
      },
      {
        name: "/list",
        description:
          "Privately lists all of your active subscriptions. It queries the subscriptions table for your user_id and displays all your alerts, showing if they are for a specific map or all maps, and whether they are paused.",
      },
      {
        name: "/unsubscribe",
        description:
          "Removes all of your subscriptions at once. This command finds and deletes all entries from the subscriptions table that match your user_id.",
      },
      {
        name: "/pause_alerts",
        description:
          "Temporarily pauses or unpauses all of your map alerts. This command updates all your entries in the subscriptions table, setting the is_paused column to true or false.",
      },
    ],
  },
  {
    title: "Do Not Disturb (DND)",
    commands: [
      {
        name: "/dnd set",
        description:
          "Sets a 'Do Not Disturb' schedule to block all alerts. It takes a start hour, end hour, a list of days, and your timezone, converts it all to UTC, and saves it in the user_dnd_rules table.",
      },
      {
        name: "/dnd view",
        description:
          "Shows your current DND schedule. It reads the rules from the user_dnd_rules table, converts the UTC times back to your saved timezone, and displays your 'do not disturb' hours and days.",
      },
      {
        name: "/dnd clear",
        description:
          "Clears your DND schedule. It finds and deletes your entry from the user_dnd_rules table, allowing all alerts to resume.",
      },
    ],
  },
  {
    title: "Bot Statistics",
    commands: [
      {
        name: "/alert_stats",
        description:
          "Shows a public, Top 10 list of the most popular maps and servers based on all user subscriptions. It queries the subscriptions table, groups by map and server, and counts the results to build the lists.",
      },
    ],
  },
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

      {/* --- MODIFIED BUTTONS SECTION --- */}
      <div className="flex flex-wrap gap-4">
        <Button asChild size="lg">
          <Link
            href="https://discord.com/oauth2/authorize?client_id=1383245299828392028&permissions=18432&integration_type=0&scope=bot+applications.commands"
            target="_blank"
            rel="noreferrer"
          >
            Add to Discord
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link
            href="https://github.com/hootmeow/bf1942-map-alert"
            target="_blank"
            rel="noreferrer"
          >
            <Github className="mr-2 h-4 w-4" />
            View on GitHub
          </Link>
        </Button>
      </div>
      {/* --- END MODIFIED SECTION --- */}

      {/* Grid Layout (Unchanged from last step) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content (Left Column) */}
        <div className="space-y-6 lg:col-span-2">
          {/* How it Works */}
          <Card className="border-border/60">
            <CardHeader>
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

          {/* Available Commands */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle as="h2">Available Commands</CardTitle>
              <CardDescription>
                The bot uses Discord's built-in slash commands. Just type `/` to see the list.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {commandCategories.map((category) => (
                  <div key={category.title}>
                    <h4 className="mb-3 text-lg font-semibold text-foreground">{category.title}</h4>
                    <ul className="space-y-4 pl-2">
                      {category.commands.map((cmd) => (
                        <li key={cmd.name} className="flex flex-col">
                          <span className="font-mono text-sm font-medium text-primary">{cmd.name}</span>
                          <span className="text-sm text-muted-foreground">{cmd.description}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar (Right Column) */}
        {/* Screenshots */}
        <Card className="border-border/60 lg:col-span-1">
          <CardHeader>
            <CardTitle as="h2">Screenshots</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-1">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}