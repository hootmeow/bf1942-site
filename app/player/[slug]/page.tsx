import type { Metadata } from "next";
import PlayerPageClient from "./player-page-client"; // This MUST match the filename below
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

// This is the server-side metadata function
// This is the server-side metadata function
export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const params = await props.params;

  if (!params.slug) {
    return { title: "Player Not Found" };
  }

  try {
    // Decode the player name from the URL slug
    const playerName = decodeURIComponent(params.slug);

    return {
      title: `Player Profile for ${playerName}`,
      description: `View the full Battlefield 1942 stats, match history, and playstyle habits for ${playerName}.`,
      openGraph: {
        title: `Player Profile for ${playerName}`,
        description: `View the full Battlefield 1942 stats for ${playerName}.`,
      },
    };
  } catch (e) {
    console.error("Metadata error:", e);
    return {
      title: "Player Not Found",
      description: "Details for this player could not be found.",
    };
  }
}

import { auth } from "@/lib/auth";

// This is the default export for the page
export default async function PlayerPage() {
  const session = await auth();

  // We keep the Suspense boundary here, wrapping the client component
  return (
    <Suspense fallback={
      <div className="flex min-h-[400px] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <p>Loading profile...</p>
      </div>
    }>
      <PlayerPageClient currentUser={session?.user} />
    </Suspense>
  );
}