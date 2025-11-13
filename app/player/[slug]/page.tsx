import type { Metadata } from "next";
import PlayerPageClient from "./player-page-client"; // This MUST match the filename below
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

// This is the server-side metadata function
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  
  if (!params.slug) {
    return { title: "Player Not Found | BF1942 Online" };
  }

  try {
    // Decode the player name from the URL slug
    const playerName = decodeURIComponent(params.slug);

    return {
      title: `Player Profile for ${playerName} | BF1942 Online`,
      description: `View the full Battlefield 1942 stats, match history, and playstyle habits for ${playerName}.`,
      openGraph: {
        title: `Player Profile for ${playerName}`,
        description: `View the full Battlefield 1942 stats for ${playerName}.`,
      },
    };
  } catch (e) {
    console.error("Metadata error:", e);
    return {
      title: "Player Not Found | BF1942 Online",
      description: "Details for this player could not be found.",
    };
  }
}

// This is the default export for the page
export default function PlayerPage() {
  // We keep the Suspense boundary here, wrapping the client component
  return (
    <Suspense fallback={
      <div className="flex min-h-[400px] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <p>Loading profile...</p>
      </div>
    }>
      <PlayerPageClient />
    </Suspense>
  );
}