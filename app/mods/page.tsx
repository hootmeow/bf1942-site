import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// Import the table components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// Import both lists
import { modsList, otherModsList } from "@/lib/mods-list";

export default function ModsPage() {
  return (
    <div className="space-y-8"> {/* Increased spacing */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Mods & Expansions</h1>
        <p className="mt-1 text-muted-foreground">
          Curated Battlefield 1942 mods vetted for stability, authenticity, and active communities.
        </p>
      </div>

      {/* --- FEATURED MODS SECTION --- */}
      <div>
        <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">
          Featured Mods
        </h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {modsList.map((mod) => (
            <Card key={mod.slug} className="flex flex-col border-border/60">
              <CardHeader>
                <CardTitle>{mod.name}</CardTitle>
                <CardDescription>Version {mod.version}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground">{mod.description}</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline">
                  <Link href={`/mods/${mod.slug}`}>Learn More & Install</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* --- LESS COMMON MODS SECTION --- */}
      <div className="pt-4">
        <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">
          Community & Other Mods
        </h2>
        <Card className="border-border/60">
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mod Name</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {otherModsList.map((mod) => (
                  <TableRow key={mod.name}>
                    <TableCell className="font-medium text-foreground">{mod.name}</TableCell>
                    <TableCell className="text-muted-foreground">{mod.author}</TableCell>
                    <TableCell className="text-muted-foreground">{mod.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}