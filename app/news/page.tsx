import Link from "next/link";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const articles = [
  {
    title: "Command Center 2.0 Launch",
    category: "Product",
    date: "May 12, 2024",
    excerpt: "The analytics suite receives real-time telemetry, mod syncing, and zero-downtime patch delivery.",
    href: "#",
  },
  {
    title: "Wake Island League Finals Recap",
    category: "Esports",
    date: "May 8, 2024",
    excerpt: "Allied Strike Team clinches the title after a tense best-of-five decided on capture point differential.",
    href: "#",
  },
  {
    title: "Server Hardening Playbook Released",
    category: "Ops",
    date: "April 29, 2024",
    excerpt: "New infrastructure guidelines reduce exploit vectors and improve visibility across remote admins.",
    href: "#",
  },
];

export default function NewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">News & Updates</h1>
        <p className="mt-1 text-muted-foreground">
          Stay informed on product releases, community highlights, and operational advisories.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {articles.map((article) => (
          <Card key={article.title} className="flex flex-col border-border/60">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">{article.title}</CardTitle>
              <CardDescription className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground/80">
                <span>{article.category}</span>
                <span>{article.date}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">{article.excerpt}</p>
            </CardContent>
            <CardFooter>
              <Link href={article.href} className="text-sm font-medium text-primary hover:underline">
                Read More
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
