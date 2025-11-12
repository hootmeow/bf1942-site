"use client";

import { useParams } from "next/navigation";
import { getArticleBySlug } from "@/lib/articles";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Component name is changed
export default function ArticlePageClient() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;
  
  const article = slug ? getArticleBySlug(slug) : undefined;

  if (!article) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Article Not Found</AlertTitle>
        <AlertDescription>
          This news article could not be found.
          <Button asChild variant="link" className="p-0 pl-2">
            <Link href="/news">Return to News</Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Button asChild variant="outline">
        <Link href="/news">← Back to all news</Link>
      </Button>
      
      <Card className="flex flex-col border-border/60">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-foreground">
            {article.title}
          </CardTitle>
          <CardDescription className="flex items-center justify-between text-sm uppercase tracking-wide text-muted-foreground/80">
            <span>{article.category}</span>
            <span>{article.date}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {article.content}
        </CardContent>
      </Card>
    </div>
  );
}