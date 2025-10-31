import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayerStatsBarChart, PopularMapsChart } from "@/components/charts";

export default function StatsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Player Statistics</h1>
        <p className="mt-1 text-muted-foreground">
          Actionable player analytics sourced from live Battlefield 1942 telemetry feeds.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Player Activity</CardTitle>
            <CardDescription>Daily active players over the past week across ranked servers.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <PlayerStatsBarChart />
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Popular Maps</CardTitle>
            <CardDescription>Top battlefield rotations measured by completed rounds.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <PopularMapsChart />
          </CardContent>
        </Card>
      </div>
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Engagement Insights</CardTitle>
          <CardDescription>Signals surfaced from aggregated telemetry to inform operations.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {[
            {
              title: "Prime Time",
              detail: "Player counts peak between 20:00 and 23:00 CET with 22% higher retention.",
            },
            {
              title: "New Recruit Cohorts",
              detail: "Tutorial completion correlates with a 1.8x increase in Day-7 return rate.",
            },
            {
              title: "Competitive Demand",
              detail: "Ranked queue wait times have dropped 12% since the last anti-cheat update.",
            },
            {
              title: "Mod Adoption",
              detail: "Desert Combat lobbies now represent 35% of weekend matches in NA-East.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-lg border border-border/60 bg-card/40 p-4">
              <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.detail}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
