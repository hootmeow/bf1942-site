"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, Loader2, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// API response structure
interface PlayerSearchResult {
  player_id: number | string;
  last_known_name: string;
}

interface PlayerSearchApiResponse {
  ok: boolean;
  players: PlayerSearchResult[];
}

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const [results, setResults] = useState<PlayerSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    async function fetchPlayers() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/v1/players/search?name=${query}`);
        if (!response.ok) {
          throw new Error("Failed to fetch players");
        }
        const data: PlayerSearchApiResponse = await response.json();
        if (data.ok) {
          setResults(data.players);
        } else {
          setResults([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchPlayers();
  }, [query]);

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <p>Loading search results for "{query}"...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (results.length === 0) {
    return (
      <Alert>
        <User className="h-4 w-4" />
        <AlertTitle>No Results</AlertTitle>
        <AlertDescription>
          No players found matching "{query}".
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {results.map((player) => (
        // --- THIS IS THE FIX ---
        // Props are now correctly placed on the <Link> tag
        <Link
          key={player.player_id}
          href={`/player/${encodeURIComponent(player.last_known_name)}`}
          className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/40 p-4 transition-colors hover:bg-accent"
        >
          <div className="rounded-full bg-primary/10 p-2 text-primary">
            <User className="h-4 w-4" />
          </div>
          <span className="font-medium text-foreground">{player.last_known_name}</span>
        </Link>
        // --- END FIX ---
      ))}
    </div>
  );
}

// Main page component that wraps the results in Suspense
export default function SearchPage() {
  return (
    <div className="space-y-6">
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Player Search Results</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Suspense is required by Next.js when using useSearchParams */}
          <Suspense fallback={<div>Loading...</div>}>
            <SearchResults />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}