import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const mods = [
  {
    name: "Desert Combat",
    version: "0.8 Final",
    description: "Modern warfare overhaul featuring jet fighters, guided missiles, and expanded vehicle combat.",
  },
  {
    name: "Forgotten Hope",
    version: "0.7",
    description: "Hyper-detailed World War II expansion with historically accurate arsenals and theaters of war.",
  },
  {
    name: "BattleGroup42",
    version: "1.9",
    description: "Extended global conflict with 150+ vehicles, naval warfare, and cooperative scenarios.",
  },
  {
    name: "Eve of Destruction",
    version: "2.51",
    description: "Vietnam War total conversion introducing asymmetric gameplay and dense jungle combat.",
  },
];

export default function ModsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Mods & Expansions</h1>
        <p className="mt-1 text-muted-foreground">
          Curated Battlefield 1942 mods vetted for stability, authenticity, and active communities.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mods.map((mod) => (
          <Card key={mod.name} className="flex flex-col border-border/60">
            <CardHeader>
              <CardTitle>{mod.name}</CardTitle>
              <CardDescription>Version {mod.version}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">{mod.description}</p>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
              <Button size="sm">Download</Button>
              <Button size="sm" variant="outline">
                Install Guide
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
