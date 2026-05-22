"use server"

import { auth } from "@/lib/auth"
import { pool } from "@/lib/db"
import { isUserAdmin } from "@/lib/admin-auth"
import { revalidatePath } from "next/cache"
import { logAdminAction } from "./audit-log-actions"

let tableReady = false

async function ensureTable() {
    if (tableReady) return
    await pool.query(`
        CREATE TABLE IF NOT EXISTS news_articles (
            article_id SERIAL PRIMARY KEY,
            slug TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            category TEXT NOT NULL DEFAULT 'News',
            excerpt TEXT NOT NULL DEFAULT '',
            content TEXT NOT NULL DEFAULT '',
            is_published BOOLEAN NOT NULL DEFAULT TRUE,
            author_user_id TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        )
    `)
    await pool.query(`CREATE INDEX IF NOT EXISTS news_articles_slug_idx ON news_articles (slug)`)
    await pool.query(`CREATE INDEX IF NOT EXISTS news_articles_created_idx ON news_articles (created_at DESC)`)
    tableReady = true
}

async function checkAdmin() {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")
    const isAdmin = await isUserAdmin(session.user.id)
    if (!isAdmin) throw new Error("Admin access required")
    return session.user
}

export async function getDbArticles(includeUnpublished = false) {
    await ensureTable()

    const res = await pool.query(`
        SELECT article_id, slug, title, category, excerpt, is_published, created_at, updated_at
        FROM news_articles
        ${includeUnpublished ? "" : "WHERE is_published = TRUE"}
        ORDER BY created_at DESC
    `)
    return { ok: true, articles: res.rows }
}

export async function getDbArticleById(articleId: number) {
    await ensureTable()
    const res = await pool.query(
        `SELECT article_id, slug, title, category, excerpt, content, is_published, created_at
         FROM news_articles WHERE article_id = $1`,
        [articleId]
    )
    return res.rows[0] ?? null
}

export async function getDbArticleBySlug(slug: string) {
    await ensureTable()

    const res = await pool.query(
        `SELECT article_id, slug, title, category, excerpt, content, is_published, created_at
         FROM news_articles
         WHERE slug = $1 AND is_published = TRUE`,
        [slug]
    )
    return res.rows[0] ?? null
}

export async function createDbArticle(data: {
    slug: string
    title: string
    category: string
    excerpt: string
    content: string
    is_published: boolean
}) {
    const user = await checkAdmin()
    await ensureTable()

    const slugified = data.slug.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")

    const res = await pool.query(
        `INSERT INTO news_articles (slug, title, category, excerpt, content, is_published, author_user_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING article_id, slug`,
        [slugified, data.title, data.category, data.excerpt, data.content, data.is_published, user.id]
    )

    await logAdminAction(user.id, "create_article", "news_article", String(res.rows[0].article_id), { slug: slugified, title: data.title })

    revalidatePath("/news")
    revalidatePath(`/news/${slugified}`)
    revalidatePath("/admin/news")
    return { ok: true, article_id: res.rows[0].article_id, slug: res.rows[0].slug }
}

export async function updateDbArticle(
    articleId: number,
    data: {
        slug: string
        title: string
        category: string
        excerpt: string
        content: string
        is_published: boolean
    }
) {
    const user = await checkAdmin()
    await ensureTable()

    const slugified = data.slug.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")

    await pool.query(
        `UPDATE news_articles
         SET slug = $1, title = $2, category = $3, excerpt = $4, content = $5,
             is_published = $6, updated_at = NOW()
         WHERE article_id = $7`,
        [slugified, data.title, data.category, data.excerpt, data.content, data.is_published, articleId]
    )

    await logAdminAction(user.id, "update_article", "news_article", String(articleId), { slug: slugified })

    revalidatePath("/news")
    revalidatePath(`/news/${slugified}`)
    revalidatePath("/admin/news")
    return { ok: true }
}

export async function deleteDbArticle(articleId: number) {
    const user = await checkAdmin()
    await ensureTable()

    await pool.query(`DELETE FROM news_articles WHERE article_id = $1`, [articleId])

    await logAdminAction(user.id, "delete_article", "news_article", String(articleId))

    revalidatePath("/news")
    revalidatePath("/admin/news")
    return { ok: true }
}
