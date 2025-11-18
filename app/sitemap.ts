import { MetadataRoute } from 'next'
import { modsList } from '@/lib/mods-list'
import { articles } from '@/lib/articles'

// --- FIX: Explicitly define the type for changeFrequency ---
type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

export default function sitemap(): MetadataRoute.Sitemap {
  // SET YOUR REAL DOMAIN HERE
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bf1942.online';

  // Dynamic Mod Pages
  const modEntries: MetadataRoute.Sitemap = modsList.map((mod) => ({
    url: `${siteUrl}/mods/${mod.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as ChangeFrequency, // <-- FIX
  }));

  // Dynamic News Pages
  const newsEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${siteUrl}/news/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: 'yearly' as ChangeFrequency, // <-- FIX
  }));

  // Static Pages
  const staticRoutes = [
    '/',
    '/about',
    '/community',
    '/guide',
    '/login',
    '/mods',
    '/news',
    '/profile',
    '/search',
    '/servers',
    '/signup',
    '/stats',
    '/system-status',
    '/tools',
    '/tools/linux-server',
    '/tools/map-alert',
    '/tools/server-config',
    '/tos-privacy'
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as ChangeFrequency, // <-- FIX
    priority: route === '/' ? 1.0 : 0.8,
  }));

  return [
    ...staticEntries,
    ...modEntries,
    ...newsEntries,
  ];
}