"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Newspaper, Plus, Pencil, Trash2, X, Check, Eye, EyeOff } from "lucide-react"
import {
    getDbArticles,
    getDbArticleById,
    createDbArticle,
    updateDbArticle,
    deleteDbArticle,
} from "@/app/actions/news-article-actions"
import { useToast } from "@/components/ui/toast-simple"

interface ArticleRow {
    article_id: number
    slug: string
    title: string
    category: string
    excerpt: string
    is_published: boolean
    created_at: string
    updated_at: string
}

interface EditState {
    article_id: number | null  // null = new article
    slug: string
    title: string
    category: string
    excerpt: string
    content: string
    is_published: boolean
}

const CATEGORIES = ["News", "Update", "Announcement", "Community"]

const EMPTY_FORM: EditState = {
    article_id: null,
    slug: "",
    title: "",
    category: "News",
    excerpt: "",
    content: "",
    is_published: true,
}

function slugify(s: string) {
    return s.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
}

export default function AdminNewsPage() {
    const [articles, setArticles] = useState<ArticleRow[]>([])
    const [loading, setLoading]   = useState(true)
    const [form, setForm]         = useState<EditState | null>(null)
    const [saving, setSaving]     = useState(false)
    const { toast } = useToast()

    async function fetchArticles() {
        const res = await getDbArticles(true)
        if (res.ok) setArticles(res.articles as ArticleRow[])
        setLoading(false)
    }

    useEffect(() => { fetchArticles() }, [])

    function openNew() {
        setForm({ ...EMPTY_FORM })
    }

    async function openEdit(article: ArticleRow) {
        // Load full content from DB before opening the form
        const full = await getDbArticleById(article.article_id)
        setForm({
            article_id: article.article_id,
            slug: article.slug,
            title: article.title,
            category: article.category,
            excerpt: article.excerpt,
            content: full?.content ?? "",
            is_published: article.is_published,
        })
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault()
        if (!form) return
        setSaving(true)
        try {
            if (form.article_id === null) {
                const res = await createDbArticle({
                    slug: form.slug || slugify(form.title),
                    title: form.title,
                    category: form.category,
                    excerpt: form.excerpt,
                    content: form.content,
                    is_published: form.is_published,
                })
                if (res.ok) {
                    toast({ title: "Article published", variant: "success" })
                    setForm(null)
                    fetchArticles()
                }
            } else {
                const res = await updateDbArticle(form.article_id, {
                    slug: form.slug || slugify(form.title),
                    title: form.title,
                    category: form.category,
                    excerpt: form.excerpt,
                    content: form.content,
                    is_published: form.is_published,
                })
                if (res.ok) {
                    toast({ title: "Article updated", variant: "success" })
                    setForm(null)
                    fetchArticles()
                }
            }
        } catch (err) {
            toast({ title: "Error", description: String(err), variant: "destructive" })
        } finally {
            setSaving(false)
        }
    }

    async function handleDelete(articleId: number, title: string) {
        if (!confirm(`Delete "${title}"?`)) return
        try {
            const res = await deleteDbArticle(articleId)
            if (res.ok) {
                setArticles(prev => prev.filter(a => a.article_id !== articleId))
                toast({ title: "Article deleted", variant: "success" })
            }
        } catch (err) {
            toast({ title: "Error", description: String(err), variant: "destructive" })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Newspaper className="h-6 w-6 text-primary" />
                    <div>
                        <h1 className="text-2xl font-bold">News Articles</h1>
                        <p className="text-sm text-muted-foreground">Create and manage site news articles</p>
                    </div>
                </div>
                {!form && (
                    <Button onClick={openNew}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Article
                    </Button>
                )}
            </div>

            {/* Editor Form */}
            {form && (
                <Card className="border-primary/30">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between text-lg">
                            <span>{form.article_id === null ? "New Article" : "Edit Article"}</span>
                            <Button variant="ghost" size="icon" onClick={() => setForm(null)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </CardTitle>
                        <CardDescription>
                            Write content as plain text. Separate paragraphs with a blank line.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={form.title}
                                        onChange={e => setForm(f => f ? {
                                            ...f,
                                            title: e.target.value,
                                            slug: f.slug || slugify(e.target.value),
                                        } : f)}
                                        placeholder="Article title"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="slug">Slug (URL path) *</Label>
                                    <Input
                                        id="slug"
                                        value={form.slug}
                                        onChange={e => setForm(f => f ? { ...f, slug: slugify(e.target.value) } : f)}
                                        placeholder="article-slug"
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">/news/{form.slug || "article-slug"}</p>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="category">Category</Label>
                                    <select
                                        id="category"
                                        value={form.category}
                                        onChange={e => setForm(f => f ? { ...f, category: e.target.value } : f)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="published">Status</Label>
                                    <select
                                        id="published"
                                        value={form.is_published ? "published" : "draft"}
                                        onChange={e => setForm(f => f ? { ...f, is_published: e.target.value === "published" } : f)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        <option value="published">Published</option>
                                        <option value="draft">Draft</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="excerpt">Excerpt *</Label>
                                <Input
                                    id="excerpt"
                                    value={form.excerpt}
                                    onChange={e => setForm(f => f ? { ...f, excerpt: e.target.value } : f)}
                                    placeholder="Short summary shown in the news listing..."
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="content">Content *</Label>
                                <textarea
                                    id="content"
                                    value={form.content}
                                    onChange={e => setForm(f => f ? { ...f, content: e.target.value } : f)}
                                    placeholder="Article body. Separate paragraphs with a blank line..."
                                    required
                                    rows={16}
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y font-mono"
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button type="submit" disabled={saving}>
                                    {saving
                                        ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        : <Check className="mr-2 h-4 w-4" />
                                    }
                                    {form.article_id === null ? "Publish" : "Save"}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setForm(null)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Article List */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Published Articles</CardTitle>
                    <CardDescription>
                        These are DB-managed articles. Static articles in <code className="text-xs">lib/articles.tsx</code> are shown on the news page automatically.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : articles.length === 0 ? (
                        <p className="text-center py-8 text-muted-foreground">
                            No articles yet. Click "New Article" to write the first one.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Published</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {articles.map(article => (
                                    <TableRow key={article.article_id}>
                                        <TableCell className="font-medium max-w-[240px] truncate">
                                            {article.title}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-muted-foreground">
                                            {article.slug}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-xs">{article.category}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            {article.is_published ? (
                                                <span className="flex items-center gap-1 text-xs text-green-500">
                                                    <Eye className="h-3 w-3" /> Published
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <EyeOff className="h-3 w-3" /> Draft
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {new Date(article.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => openEdit(article)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                                    onClick={() => handleDelete(article.article_id, article.title)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
