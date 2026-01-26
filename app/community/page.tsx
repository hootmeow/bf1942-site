import Link from "next/link";
import { MessageCircle, Users, Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Communities & Clans | BF1942 Command Center",
  description: "Join the active Battlefield 1942 community. Find clans, Discord servers, and groups keeping the game alive.",
};

const communities = [
  {
    title: "Team SiMPLE",
    description: "A long-standing, active BF1942 community that provides resources, downloads, and multiple active servers for vanilla and modded gameplay.",
    website: "https://team-simple.org/forum/",
    discord: "https://discord.gg/w35q7AYD",
  },
  {
    title: "Moongamers",
    description: "Established in 2004, this friendly community runs popular servers known for comprehensive installers. Join them for weekly events, including CTF on Saturdays and Expansions on Sundays.",
    website: "http://www.moongamers.com/",
    discord: "http://moon-discord.sytes.net/",
  },
  {
    title: "HelloClan",
    description: "A social gaming network started in 2008, specializing in preserving older games. They foster a friendly, inclusive atmosphere and host servers for IS82, Desert Combat, and GC, often holding events for those mods.",
    website: "https://www.helloclan.eu/",
    discord: "https://discord.gg/helloclan-the-social-gaming-network-276061597636624395",
  },
  {
    title: "Tanks'nPlanes Unlimited (TPU)",
    description: "A dedicated co-op (PvE) server where human players and bots team up against a larger team of all bots. It runs 24/7 with modified maps featuring increased vehicle spawns.",
    website: "https://jdrgaming.com/tpu/",
    discord: "https://discord.gg/kvg9mfX",
  },
  {
    title: "TheGreatEscape-BF1942-USA (TGE)",
    description: "A US-based Battlefield 1942 server and community with an 18+ atmosphere.",
    website: "https://usa-bf1942.proboards.com/",
    discord: null,
  },
  {
    title: "Interstate 82 (is82.com)",
    description: "A popular racing, stunt, and vehicular combat mod inspired by 'Interstate '76'. While it's a mod, it has a dedicated community and is actively hosted by groups like HelloClan.",
    website: "http://www.IS82.com",
    discord: "https://discord.com/invite/CHM7AApBAP",
  },
  {
    title: "The Lazy Bastards (TLB)",
    description: "Founded by a group of mature Battlefield 1942 players, TLB's main goal is to enjoy 'idiot-free' gaming. It's a community for those who appreciate playing online games as intended.",
    website: null,
    discord: "https://discord.gg/3N6JVpt3",
  },
];

export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Community</h1>
        <p className="mt-1 text-muted-foreground">
          Connect with squads, organizers, and creators keeping Battlefield 1942 alive.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {communities.map((community) => (
          <Card key={community.title} className="flex flex-col border-border/60">
            <CardHeader>
              <CardTitle>{community.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <CardDescription className="text-sm leading-6 text-muted-foreground">
                {community.description}
              </CardDescription>
            </CardContent>
            <CardFooter className="flex gap-2">
              {community.website && (
                <Button asChild size="sm">
                  <Link href={community.website} target="_blank" rel="noreferrer">
                    <Globe className="mr-2 h-4 w-4" />
                    Website
                  </Link>
                </Button>
              )}
              {community.discord && (
                <Button asChild size="sm" variant="outline">
                  <Link href={community.discord} target="_blank" rel="noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Discord
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="pt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Is your community missing? Contact us on the{" "}
          <Link href="httpsD://discord.gg/n2FXvJU4zJ" target="_blank" rel="noreferrer" className="font-medium text-primary hover:underline">
            bf1942.online discord
          </Link>{" "}
          to have your community added or information updated.
        </p>
      </div>
    </div>
  );
}