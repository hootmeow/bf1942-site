import type { Metadata } from "next";
import { getArticleBySlug } from "@/lib/articles";
import ArticlePageClient from "./article-page-client"; // Import the new client component

// This is the server-side metadata function
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  
  const article = params.slug ? getArticleBySlug(params.slug) : undefined;

  if (!article) {
    return {
      title: "Article Not Found | BF1942 Online",
    };
  }

  return {
    title: `${article.title} | BF1942 Online`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
    },
  };
}

// This is the default export for the page
export default function ArticlePage() {
  return <ArticlePageClient />;
}