import type { Metadata } from "next";
import { ServerDetailView } from "@/components/server-detail-view";
import { pool } from "@/lib/db";

export const dynamic = "force-dynamic";

// Use local proxy to ensure we hit the internal API correctly
const API_BASE = "http://127.0.0.1:3000/api/v1";

async function getServerData(slug: string) {
  try {
    // REVERTED: Going back to the query-based lookup which is how your API works
    const targetUrl = `${API_BASE}/servers/search?search=${slug}`;

    console.log(`[ServerDetail Fetch] Fetching: ${targetUrl}`);

    const res = await fetch(targetUrl, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
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
    return { title: "Server Not Found" };
  }

  const { server_id, current_server_name, current_map, current_player_count, current_max_players } = data.server_info;

  // Attempt to fetch rank
  const rank = await getGlobalRank(server_id);
  const rankStr = rank ? `(Rank #${rank})` : "";
  const title = rank ? `${rankStr} ${current_server_name}` : `${current_server_name}`;

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

async function getServerOwner(serverId: number) {
  try {
    const result = await pool.query(
      `SELECT user_id as owner_id, discord_username, created_at as claimed_at
       FROM server_claims
       WHERE server_id = $1 AND status = 'APPROVED'
       LIMIT 1`,
      [serverId]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (e) {
    console.error("[ServerOwner] DB error:", e);
    return null;
  }
}

export default async function ServerPage({ params }: Props) {
  const { slug } = await params;
  const data = await getServerData(slug);

  // Fetch owner server-side (avoids rewrite proxy conflict)
  const owner = data?.ok && data.server_info?.server_id
    ? await getServerOwner(data.server_info.server_id)
    : null;

  return <ServerDetailView initialData={data} slug={slug} serverOwner={owner} />;
}