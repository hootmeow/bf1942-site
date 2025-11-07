import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// Import the articles data
import { articles } from "@/lib/articles";

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
          <Card key={article.slug} className="flex flex-col border-border/60">
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
              <Link
                href={`/news/${article.slug}`} // Link to the dynamic page
                className="text-sm font-medium text-primary hover:underline"
              >
                Read More
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}