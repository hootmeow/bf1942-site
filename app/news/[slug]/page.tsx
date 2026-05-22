import type { Metadata } from "next";
import { getArticleBySlug } from "@/lib/articles";
import { getDbArticleBySlug } from "@/app/actions/news-article-actions";
import ArticlePageClient from "./article-page-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;

    const staticArticle = getArticleBySlug(slug);
    if (staticArticle) {
        return {
            title: staticArticle.title,
            description: staticArticle.excerpt,
            openGraph: { title: staticArticle.title, description: staticArticle.excerpt, type: "article" },
        };
    }

    const dbArticle = await getDbArticleBySlug(slug);
    if (dbArticle) {
        return {
            title: dbArticle.title,
            description: dbArticle.excerpt,
            openGraph: { title: dbArticle.title, description: dbArticle.excerpt, type: "article" },
        };
    }

    return { title: "Article Not Found" };
}

export default async function ArticlePage(
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    // Static articles are handled entirely client-side (existing behaviour)
    const isStatic = !!getArticleBySlug(slug);
    if (isStatic) {
        return <ArticlePageClient />;
    }

    // DB article
    const article = await getDbArticleBySlug(slug);
    if (!article) {
        return (
            <div className="mx-auto max-w-4xl space-y-6">
                <Button asChild variant="outline">
                    <Link href="/news">← Back to all news</Link>
                </Button>
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        Article not found.
                    </CardContent>
                </Card>
            </div>
        );
    }

    const paragraphs = (article.content as string).split(/\n\n+/).filter(Boolean);
    const publishDate = new Date(article.created_at).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
    });

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
                        <span>{publishDate}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
                        {paragraphs.map((p, i) => (
                            <p key={i}>{p}</p>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
