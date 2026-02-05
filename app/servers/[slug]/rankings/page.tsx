import type { Metadata } from "next";
import { ServerRankingsView } from "./rankings-view";

export const dynamic = "force-dynamic";

const API_BASE = "http://127.0.0.1:3000/api/v1";

async function getServerInfo(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/servers/search?search=${slug}`, {
      cache: 'no-store'
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("[ServerRankings] Error:", error);
    return null;
  }
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getServerInfo(slug);

  if (!data || !data.ok) {
    return { title: "Server Not Found | BF1942 Online" };
  }

  const serverName = data.server_info.current_server_name;

  return {
    title: `Player Rankings - ${serverName} | BF1942 Online`,
    description: `View all player rankings on ${serverName}. See who has the highest score, most kills, best K/D ratio, and most rounds played.`,
  };
}

export default async function ServerRankingsPage({ params }: Props) {
  const { slug } = await params;
  const data = await getServerInfo(slug);

  if (!data || !data.ok) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-muted-foreground">
          Server not found.
        </div>
      </div>
    );
  }

  return (
    <ServerRankingsView
      serverId={data.server_info.server_id}
      serverName={data.server_info.current_server_name}
      slug={slug}
    />
  );
}
