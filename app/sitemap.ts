import { MetadataRoute } from 'next'
import { modsList } from '@/lib/mods-list'
import { articles } from '@/lib/articles'

// --- FIX: Explicitly define the type for changeFrequency ---
type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  // Fetch active servers
  let serverEntries: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch('http://127.0.0.1:8000/api/v1/servers', { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      if (data.ok && Array.isArray(data.servers)) {
        serverEntries = data.servers.map((server: any) => ({
          url: `${siteUrl}/servers/${server.server_id}`,
          lastModified: new Date(),
          changeFrequency: 'hourly' as ChangeFrequency,
          priority: 0.7,
        }));
      }
    }
  } catch (e) {
    console.error("Failed to fetch servers for sitemap", e);
  }

  // Fetch top players (Leaderboard)
  let playerEntries: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch('http://127.0.0.1:8000/api/v1/leaderboard', { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      if (data.ok && Array.isArray(data.leaderboard)) {
        // Limit to top 500 active players
        playerEntries = data.leaderboard.slice(0, 500).map((player: any) => ({
          url: `${siteUrl}/player/${encodeURIComponent(player.name)}`,
          lastModified: new Date(),
          changeFrequency: 'daily' as ChangeFrequency,
          priority: 0.6,
        }));
      }
    }
  } catch (e) {
    console.error("Failed to fetch players for sitemap", e);
  }

  return [
    ...staticEntries,
    ...modEntries,
    ...newsEntries,
    ...serverEntries,
    ...playerEntries,
  ];
}