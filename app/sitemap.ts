// Create new file: app/sitemap.ts
import { MetadataRoute } from 'next'
import { modsList } from '@/lib/mods-list';
import { articles } from '@/lib/articles';

export default function sitemap(): MetadataRoute.Sitemap {
  // SET YOUR REAL DOMAIN HERE
  const siteUrl = 'https://www.bf1942.online';

  // Dynamic Mod Pages
  const modEntries: MetadataRoute.Sitemap = modsList.map((mod) => ({
    url: `${siteUrl}/mods/${mod.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
  }));

  // Dynamic News Pages
  const newsEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${siteUrl}/news/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: 'yearly',
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

  const staticEntries = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '/' ? 1.0 : 0.8,
  }));
  
  return [
    ...staticEntries,
    ...modEntries,
    ...newsEntries,
    // NOTE: You should also add dynamic entries for /player/[slug] if possible,
    // but that would require fetching all players, which might be too large.
    // The current setup is a great start.
  ];
}