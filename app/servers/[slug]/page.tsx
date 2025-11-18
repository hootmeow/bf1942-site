import type { Metadata } from "next";
import { ServerDetailView } from "@/components/server-detail-view";

async function getServerData(slug: string) {
  try {
    // FIX: Force connection to local proxy to handle the rewrite correctly
    const targetUrl = `http://127.0.0.1:3000/api/v1/servers/search?search=${slug}`;

    const res = await fetch(targetUrl, {
      cache: 'no-store'
    });

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Fetch error:", error);
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