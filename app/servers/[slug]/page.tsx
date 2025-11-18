import type { Metadata } from "next";
import { ServerDetailView } from "@/components/server-detail-view";

// Use local proxy
const API_BASE = process.env.API_URL || "http://localhost:3000/api/v1";

async function getServerData(slug: string) {
  try {
    // FIX: Use ID-based endpoint instead of search
    const targetUrl = `http://127.0.0.1:3000/api/v1/servers/${slug}`;

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

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await getServerData(params.slug);

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

export default async function ServerPage({ params }: { params: { slug: string } }) {
  const data = await getServerData(params.slug);

  return <ServerDetailView initialData={data} slug={params.slug} />;
}