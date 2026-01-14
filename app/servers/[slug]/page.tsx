import type { Metadata } from "next";
import { ServerDetailView } from "@/components/server-detail-view";

export const dynamic = "force-dynamic";

// Use local proxy to ensure we hit the internal API correctly
const API_BASE = "http://127.0.0.1:3000/api/v1";

async function getServerData(slug: string) {
  try {
    // REVERTED: Going back to the query-based lookup which is how your API works
    const targetUrl = `${API_BASE}/servers/search?search=${slug}`;

    console.log(`[ServerDetail Fetch] Fetching: ${targetUrl}`);

    const res = await fetch(targetUrl, {
      cache: 'no-store'
    });

    if (!res.ok) {
      console.error(`[ServerDetail Fetch] Error ${res.status}: ${res.statusText}`);
      return null;
    }
    return res.json();
  } catch (error) {
    console.error("[ServerDetail Fetch] Network Error:", error);
    return null;
  }
}

// Helper to get Global Rank (Client-side mirror logic)
async function getGlobalRank(serverId: number) {
  try {
    const res = await fetch(`${API_BASE}/servers/rankings?limit=250`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.ok || !Array.isArray(data.rankings)) return null;

    const rankItem = data.rankings.find((r: any) => r.server_id === serverId);
    return rankItem ? rankItem.rank : null;
  } catch (e) {
    return null;
  }
}

// FIX: Next.js 15/16 requirement: params is a Promise
type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getServerData(slug);

  if (!data || !data.ok) {
    return { title: "Server Not Found | BF1942 Online" };
  }

  const { server_id, current_server_name, current_map, current_player_count, current_max_players } = data.server_info;

  // Attempt to fetch rank
  const rank = await getGlobalRank(server_id);
  const rankStr = rank ? `(Rank #${rank})` : "";
  const title = rank ? `${rankStr} ${current_server_name} | BF1942 Online` : `${current_server_name} | BF1942 Online`;

  return {
    title: title,
    description: `Join ${current_server_name} on ${current_map}. ${current_player_count}/${current_max_players} soldiers deployed. ${rank ? `Rated #${rank} globally based on activity.` : ""}`,
    openGraph: {
      title: title,
      description: `Playing ${current_map} - ${current_player_count}/${current_max_players} online. View live stats, scoreboard, and more.`,
      images: [
        {
          url: '/opengraph-image', // Fallback or dynamic generator if you have one
          width: 1200,
          height: 630,
        }
      ]
    }
  };
}

export default async function ServerPage({ params }: Props) {
  const { slug } = await params; // <--- This was the missing await
  const data = await getServerData(slug);

  return <ServerDetailView initialData={data} slug={slug} />;
}