import type { Metadata } from "next";
import { ServerDetailView } from "@/components/server-detail-view";

// FIX: Force connection to local proxy to handle the rewrite correctly
// We use 127.0.0.1 to avoid potential localhost resolution issues in some environments
const API_BASE = "http://127.0.0.1:3000/api/v1";

async function getServerData(slug: string) {
  try {
    // FIX: Use the direct ID endpoint
    const targetUrl = `${API_BASE}/servers/${slug}`;

    console.log(`[ServerDetail Fetch] Fetching: ${targetUrl}`);

    const res = await fetch(targetUrl, {
      cache: 'no-store'
    });

    if (!res.ok) {
      console.error(`[ServerDetail Fetch] Error ${res.status}`);
      return null;
    }
    return res.json();
  } catch (error) {
    console.error("[ServerDetail Fetch] Error:", error);
    return null;
  }
}

// FIX: Next.js 15/16 Breaking Change
// 'params' is now a Promise that must be awaited
type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; // <--- Await is required here
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
  const { slug } = await params; // <--- Await is required here
  const data = await getServerData(slug);

  return <ServerDetailView initialData={data} slug={slug} />;
}