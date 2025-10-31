import Link from "next/link";
import { MessageCircle, Users, Megaphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const resources = [
  {
    title: "Discord Command Hub",
    description: "Real-time LFG channels, match scheduling, and weekly developer briefings.",
    href: "https://discord.com",
    icon: MessageCircle,
    action: "Join Discord",
  },
  {
    title: "Tactical Forums",
    description: "Persistent strategy discussions, mod support threads, and archival resources.",
    href: "https://forums.example.com",
    icon: Users,
    action: "Visit Forums",
  },
  {
    title: "Reddit Situation Report",
    description: "Community highlights, patch speculation, and large-scale event coordination.",
    href: "https://reddit.com/r/bf1942",
    icon: Megaphone,
    action: "Open Reddit",
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
        {resources.map((resource) => {
          const Icon = resource.icon;
          return (
            <Card key={resource.title} className="flex flex-col border-border/60">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-primary/10 p-3 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <CardTitle>{resource.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <CardDescription className="text-sm leading-6 text-muted-foreground">
                  {resource.description}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href={resource.href} target="_blank" rel="noreferrer">
                    {resource.action}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
