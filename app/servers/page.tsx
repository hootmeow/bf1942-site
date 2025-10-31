import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const servers = [
  {
    status: "online",
    name: "Allied Frontline #1",
    mod: "Vanilla",
    map: "Wake Island",
    players: "54/64",
    ping: 42,
  },
  {
    status: "online",
    name: "Desert Combat - Official EU",
    mod: "Desert Combat",
    map: "El Alamein",
    players: "48/64",
    ping: 58,
  },
  {
    status: "offline",
    name: "Retro Conquest Classics",
    mod: "BattleGroup42",
    map: "Berlin",
    players: "0/48",
    ping: 0,
  },
  {
    status: "online",
    name: "Pacific Theatre Ranked",
    mod: "Road to Rome",
    map: "Iwo Jima",
    players: "31/64",
    ping: 75,
  },
  {
    status: "online",
    name: "High Command Competitive",
    mod: "Forgotten Hope",
    map: "Stalingrad",
    players: "63/64",
    ping: 35,
  },
  {
    status: "online",
    name: "Community Builders",
    mod: "Eve of Destruction",
    map: "Hue",
    players: "22/48",
    ping: 110,
  },
  {
    status: "offline",
    name: "Asia-Pacific Rush",
    mod: "Vanilla",
    map: "Guadalcanal",
    players: "0/64",
    ping: 0,
  },
];

export default function ServersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Server Directory</h1>
        <p className="mt-1 text-muted-foreground">
          Live Battlefield 1942 servers curated from trusted community providers.
        </p>
      </div>
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Active Listings</CardTitle>
          <CardDescription>Join directly or review performance before deploying your squad.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Server Name</TableHead>
                <TableHead>Mod</TableHead>
                <TableHead>Map</TableHead>
                <TableHead>Players</TableHead>
                <TableHead>Ping</TableHead>
                <TableHead className="w-[80px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {servers.map((server) => (
                <TableRow key={server.name}>
                  <TableCell>
                    <Badge variant={server.status === "online" ? "success" : "danger"}>
                      {server.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{server.name}</TableCell>
                  <TableCell>{server.mod}</TableCell>
                  <TableCell>{server.map}</TableCell>
                  <TableCell>{server.players}</TableCell>
                  <TableCell>{server.ping} ms</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" disabled={server.status !== "online"}>
                      Join
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
