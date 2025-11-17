import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { guidesList } from "@/lib/guides-list"; // Import the new list

export default function GuideOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Guides</h1>
        <p className="mt-1 text-muted-foreground">
          A collection of guides for installing the game, optimizing performance, and mastering mods.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {guidesList.map((guide) => (
          <Card key={guide.title} className="flex flex-col border-border/60">
            <CardHeader>
              <CardTitle>{guide.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <CardDescription className="text-sm leading-6 text-muted-foreground">
                {guide.description}
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline">
                <Link href={`/guide/${guide.slug}`}>Read Guide</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}