import type { Metadata } from "next";
import { ServerDetailView } from "@/components/server-detail-view";

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

// FIX: Next.js 15/16 requirement: params is a Promise
type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; // <--- This was the missing await causing 'undefined'
  const data = await getServerData(slug);

  if (!data || !data.ok) {
    return { title: "Server Not Found | BF1942 Online" };
  }

  const { current_server_name, current_map, current_player_count, current_max_players } = data.server_info;

  return {
    title: `${current_server_name} | BF1942 Online`,
    description: `Join ${current_server_name} playing ${current_map}. ${current_player_count}/${current_max_players} players online now.`,
    openGraph: {
      title: current_server_name || "BF1942 Server",
      description: `Playing ${current_map} with ${current_player_count} players.`,
    }
  };
}

export default async function ServerPage({ params }: Props) {
  const { slug } = await params; // <--- This was the missing await
  const data = await getServerData(slug);

  return <ServerDetailView initialData={data} slug={slug} />;
}