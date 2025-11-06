import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">About bf1942.online</h1>
        <p className="mt-1 text-muted-foreground">
          A modern, fast hub for everything Battlefield 1942.
        </p>
      </div>
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Project Goal</CardTitle>
          <CardDescription>
            This site was built to provide a valuable, modern resource for the BF1942 community.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-sm text-muted-foreground">
          <p>
            After a lot of work, this project was launched to create a central hub for the Battlefield
            1942 community. The goal was to create a modern, fast hub for everything Battlefield 1942.
          </p>
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Key Features</h3>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Live Server List:</strong> You can browse a live list of servers, automatically
                sorted by who's online. Clicking a server takes you to a detailed page with a full
                scoreboard (split by team), a player history graph, the server's top 10 players, and a
                chart of the most played maps.
              </li>
              <li>
                <strong>Player Search & Profiles:</strong> There's a full player search so you can look
                up anyone by name. Every player gets their own profile page showing their overall K/D,
                total score, playtime, and a full history of their recent matches.
              </li>
              <li>
                <strong>Round History:</strong> Want to find a specific match? The Round History page is
                fully searchable by server name, map, or IP. You can click on any round to see the final
                scoreboard and who played in it.
              </li>
              <li>
                <strong>Game & Mod Downloads:</strong> A "Play Now" Guide with easy instructions for
                installing the game on a modern PC, plus a Mod Downloads section with links for DC, GC,
                IS82, and BF1918.
              </li>
            </ul>
          </div>
          <p>
            This site is currently under active development. You may run into bugs or GUI errors. If
            there are any features or requests that you would like to see please let us know.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}