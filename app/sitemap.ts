import { MetadataRoute } from "next";
import { modsList } from "@/lib/mods-list";
import { articles } from "@/lib/articles";
import { wikiMaps } from "@/lib/wiki-maps";

type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.bf1942.online";

// Map slugs organized by mod
const MAP_SLUGS: Record<string, string[]> = {
  "desert-combat": ["dc_al_khafji_docks", "dc_lostvillage"],
};

interface ServerResponse {
  server_id: number;
}

interface PlayerResponse {
  player_id: number;
  name: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    // High priority - main pages
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "hourly" as ChangeFrequency,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/servers`,
      lastModified: now,
      changeFrequency: "always" as ChangeFrequency,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/stats`,
      lastModified: now,
      changeFrequency: "hourly" as ChangeFrequency,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/rank-info`,
      lastModified: now,
      changeFrequency: "hourly" as ChangeFrequency,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: now,
      changeFrequency: "weekly" as ChangeFrequency,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/game-health`,
      lastModified: now,
      changeFrequency: "daily" as ChangeFrequency,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/challenges`,
      lastModified: now,
      changeFrequency: "daily" as ChangeFrequency,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/map`,
      lastModified: now,
      changeFrequency: "hourly" as ChangeFrequency,
      priority: 0.6,
    },
    // Community
    {
      url: `${BASE_URL}/community`,
      lastModified: now,
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/community/highlights`,
      lastModified: now,
      changeFrequency: "weekly" as ChangeFrequency,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/orgs`,
      lastModified: now,
      changeFrequency: "daily" as ChangeFrequency,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/events`,
      lastModified: now,
      changeFrequency: "daily" as ChangeFrequency,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/news`,
      lastModified: now,
      changeFrequency: "weekly" as ChangeFrequency,
      priority: 0.7,
    },
    // Mods & guides
    {
      url: `${BASE_URL}/mods`,
      lastModified: now,
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/guide`,
      lastModified: now,
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/guide/installation`,
      lastModified: now,
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/guide/player-guide`,
      lastModified: now,
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.6,
    },
    // Wiki
    {
      url: `${BASE_URL}/wiki`,
      lastModified: now,
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/wiki/maps`,
      lastModified: now,
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/wiki/basic-training`,
      lastModified: now,
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/wiki/kits`,
      lastModified: now,
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/wiki/weapons`,
      lastModified: now,
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/wiki/vehicles`,
      lastModified: now,
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/wiki/vehicles/land`,
      lastModified: now,
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/wiki/vehicles/air`,
      lastModified: now,
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/wiki/vehicles/naval`,
      lastModified: now,
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/wiki/tactics`,
      lastModified: now,
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.6,
    },
    // Tools
    {
      url: `${BASE_URL}/tools`,
      lastModified: now,
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/tools/linux-server`,
      lastModified: now,
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/tools/map-alert`,
      lastModified: now,
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.5,
    },
    // Info pages
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/rank-system`,
      lastModified: now,
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/system-status`,
      lastModified: now,
      changeFrequency: "daily" as ChangeFrequency,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/tos-privacy`,
      lastModified: now,
      changeFrequency: "yearly" as ChangeFrequency,
      priority: 0.2,
    },
  ];

  // Mod pages from modsList
  const modPages: MetadataRoute.Sitemap = modsList.map((mod) => ({
    url: `${BASE_URL}/mods/${mod.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as ChangeFrequency,
    priority: 0.6,
  }));

  // Map pages (nested under mods)
  const mapPages: MetadataRoute.Sitemap = Object.entries(MAP_SLUGS).flatMap(
    ([modSlug, mapSlugs]) =>
      mapSlugs.map((mapSlug) => ({
        url: `${BASE_URL}/mods/${modSlug}/${mapSlug}`,
        lastModified: now,
        changeFrequency: "monthly" as ChangeFrequency,
        priority: 0.5,
      }))
  );

  // Wiki map pages from wikiMaps data
  const wikiMapPages: MetadataRoute.Sitemap = wikiMaps.map((m) => ({
    url: `${BASE_URL}/wiki/maps/${m.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as ChangeFrequency,
    priority: 0.5,
  }));

  // News articles
  const newsPages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${BASE_URL}/news/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "yearly" as ChangeFrequency,
    priority: 0.6,
  }));

  // Dynamic: Active servers
  let serverPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${BASE_URL}/api/v1/servers`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.ok && Array.isArray(data.servers)) {
        serverPages = data.servers.map((server: ServerResponse) => ({
          url: `${BASE_URL}/servers/${server.server_id}`,
          lastModified: now,
          changeFrequency: "hourly" as ChangeFrequency,
          priority: 0.7,
        }));
      }
    }
  } catch (e) {
    console.error("Failed to fetch servers for sitemap:", e);
  }

  // Dynamic: Top players from leaderboard
  let playerPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${BASE_URL}/api/v1/leaderboard?limit=500`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.ok && Array.isArray(data.leaderboard)) {
        playerPages = data.leaderboard
          .filter((player: PlayerResponse) => player.name)
          .map((player: PlayerResponse) => ({
            url: `${BASE_URL}/player/${encodeURIComponent(player.name)}`,
            lastModified: now,
            changeFrequency: "daily" as ChangeFrequency,
            priority: 0.6,
          }));
      }
    }
  } catch (e) {
    console.error("Failed to fetch players for sitemap:", e);
  }

  return [
    ...staticPages,
    ...modPages,
    ...mapPages,
    ...wikiMapPages,
    ...newsPages,
    ...serverPages,
    ...playerPages,
  ];
}
