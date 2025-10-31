import { Activity, Clock, Users } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayerActivityChart, ServerUptimeChart, CommunityActivityChart } from "@/components/charts";

const highlights = [
  {
    title: "Active Players",
    value: "4,582",
    change: "+12.4%",
    description: "Total players online across all tracked servers in the last 24 hours.",
    icon: Activity,
  },
  {
    title: "Average Server Uptime",
    value: "97.2%",
    change: "+1.8%",
    description: "Mean uptime across ranked Battlefield 1942 servers this week.",
    icon: Clock,
  },
  {
    title: "Community Growth",
    value: "22.3K",
    change: "+5.2%",
    description: "Discord members, forum users, and subreddit subscribers combined.",
    icon: Users,
  },
];

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">BF1942 Command Center</h1>
        <p className="mt-1 text-muted-foreground">
          Monitor player trends, track server uptime, and keep the Battlefield 1942 community in sync.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="border-border/60">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
                  <div className="mt-2 text-2xl font-semibold text-foreground">{item.value}</div>
                </div>
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                  <span className="ml-2 font-medium text-primary">{item.change}</span>
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="border-border/60 xl:col-span-2">
          <CardHeader>
            <CardTitle>Player Activity</CardTitle>
            <CardDescription>Hourly concurrency across top Battlefield 1942 servers.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <PlayerActivityChart />
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Community Activity</CardTitle>
            <CardDescription>Engagement split across major community platforms.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <CommunityActivityChart />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Server Uptime</CardTitle>
            <CardDescription>Health trend for ranked servers across the globe.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ServerUptimeChart />
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Operational Notes</CardTitle>
            <CardDescription>Top priorities from server administrators this week.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4 text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground">Patch Rollout - 1.61a</p>
              <p>Coordinate weekend maintenance windows to deploy security hotfixes with minimal downtime.</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Community Spotlight</p>
              <p>Highlight the long-running Wake Island League and promote sign-ups in Discord announcements.</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Infrastructure Review</p>
              <p>Audit legacy hardware in EU-West to ensure parity with new analytics and anti-cheat tooling.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
