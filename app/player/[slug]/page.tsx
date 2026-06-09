import type { Metadata } from "next";
import PlayerPageClient from "./player-page-client";
import type { PlayerProfileApiResponse } from "./player-page-client";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { auth } from "@/lib/auth";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bf1942.online";
// Hit the upstream API directly from the server (avoids looping through Next.js proxy)
const API_BASE = (process.env.API_URL || "http://127.0.0.1:8000/api/v1/").replace(/\/$/, "");

export const revalidate = 300; // ISR: re-render player pages every 5 minutes

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params;
  if (!slug) return { title: "Player Not Found" };

  const playerName = decodeURIComponent(slug);
  const sigUrl = `${SITE_URL}/sig/${encodeURIComponent(playerName)}.png`;

  return {
    title: `${playerName} — BF1942 Player Stats`,
    description: `Battlefield 1942 stats for ${playerName}: score, K/D ratio, rounds played, top maps, and full match history on BF1942 Online.`,
    alternates: {
      canonical: `${SITE_URL}/player/${encodeURIComponent(playerName)}`,
    },
    openGraph: {
      title: `${playerName} — BF1942 Player Stats`,
      description: `Score, rank, K/D, and lifetime stats for ${playerName} in Battlefield 1942.`,
      url: `${SITE_URL}/player/${encodeURIComponent(playerName)}`,
      images: [{ url: sigUrl, width: 500, height: 120, alt: `${playerName}'s BF1942 stats card` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${playerName} — BF1942 Stats`,
      description: `Score, rank, and lifetime stats for ${playerName} in Battlefield 1942.`,
      images: [sigUrl],
    },
  };
}

export default async function PlayerPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const playerName = decodeURIComponent(slug);
  const session = await auth();

  // Fetch profile server-side so Googlebot sees real content on first render
  let initialProfile: PlayerProfileApiResponse | null = null;
  try {
    const res = await fetch(
      `${API_BASE}/players/search/profile?name=${encodeURIComponent(playerName)}`,
      { next: { revalidate: 300 } }
    );
    if (res.ok) {
      const data = await res.json();
      if (data.ok) initialProfile = data as PlayerProfileApiResponse;
    }
  } catch {
    // Non-fatal — client will fetch on hydration
  }

  const ls = initialProfile?.lifetime_stats;
  const pi = initialProfile?.player_info;

  // ProfilePage JSON-LD — tells Google exactly what this page is about
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "name": `${playerName} — BF1942 Player Stats`,
    "url": `${SITE_URL}/player/${encodeURIComponent(playerName)}`,
    "dateModified": pi?.last_seen ?? new Date().toISOString(),
    "mainEntity": {
      "@type": "Person",
      "name": playerName,
      "identifier": String(pi?.player_id ?? ""),
      "description": ls
        ? `BF1942 player with ${ls.total_rounds_played} rounds, ${ls.total_kills} kills, and a ${ls.overall_kdr?.toFixed(2) ?? '0.00'} K/D ratio.`
        : `Battlefield 1942 player profile for ${playerName}.`,
      ...(pi?.iso_country_code ? { "nationality": pi.iso_country_code } : {}),
    },
    ...(ls ? {
      "interactionStatistic": [
        { "@type": "InteractionCounter", "interactionType": "https://schema.org/WatchAction", "userInteractionCount": ls.total_rounds_played },
      ],
    } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={
        <div className="flex min-h-[400px] items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p>Loading profile...</p>
        </div>
      }>
        <PlayerPageClient currentUser={session?.user} initialProfile={initialProfile} />
      </Suspense>
    </>
  );
}
