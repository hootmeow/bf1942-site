"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Loader2, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// --- Custom Debounce Hook ---
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// --- API Response Types ---
interface PlayerSearchResult {
  player_id: number | string;
  last_known_name: string;
}

interface PlayerSearchApiResponse {
  ok: boolean;
  players: PlayerSearchResult[];
}

// --- NEW: Props interface ---
interface PlayerSearchProps {
  containerClassName?: string;
  inputClassName?: string;
}

// --- Main Search Component ---
export function PlayerSearch({ containerClassName, inputClassName }: PlayerSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<PlayerSearchResult[]>([]);
  const [recentPlayers, setRecentPlayers] = useState<PlayerSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const router = useRouter();
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const searchRef = useRef<HTMLDivElement>(null);

  // Load recent players on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("recent_players");
      if (stored) {
        setRecentPlayers(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load recent players", e);
    }
  }, []);

  // Save specific player to recent list
  const addToRecent = (player: PlayerSearchResult) => {
    const newList = [player, ...recentPlayers.filter(p => p.player_id !== player.player_id)].slice(0, 5);
    setRecentPlayers(newList);
    localStorage.setItem("recent_players", JSON.stringify(newList));
  };

  // Fetch results when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm.length < 2) {
      setResults([]);
      setIsLoading(false);
      // Keep dropdown open if we have recent players and user is focused (searchTerm check is removed here to allow empty focus)
      // fetchPlayers logic handles the API call, but we handle the dropdown visibility logic slightly separately now
      return;
    }

    async function fetchPlayers() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/v1/players/search?name=${debouncedSearchTerm}`);
        if (!response.ok) {
          throw new Error("Failed to fetch players");
        }
        const data: PlayerSearchApiResponse = await response.json();
        if (data.ok && data.players.length > 0) {
          setResults(data.players);
          setIsDropdownOpen(true);
        } else {
          setResults([]);
          // Don't close immediately if term is valid but no results, let user seeing "No results" potentially (not implemented here but good practice)
          setIsDropdownOpen(false);
        }
      } catch (error) {
        console.error(error);
        setResults([]);
        setIsDropdownOpen(false);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlayers();
  }, [debouncedSearchTerm]);

  // Handle submitting the search (e.g., pressing Enter)
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim().length > 0) {
      router.push(`/search?q=${searchTerm.trim()}`);
      setSearchTerm("");
      setIsDropdownOpen(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  const showDropdown = isDropdownOpen && (results.length > 0 || (searchTerm.length === 0 && recentPlayers.length > 0));

  return (
    <div className={cn("relative w-full max-w-sm", containerClassName)} ref={searchRef}>
      <form onSubmit={handleSearchSubmit}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search players..."
          className={cn("pl-10", "search-glow", inputClassName)} // Apply props
          type="search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (e.target.value.length === 0) setIsDropdownOpen(true); // Show recents on clear
          }}
          onFocus={() => setIsDropdownOpen(true)}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground animate-spin" />
        )}
      </form>

      {/* Autocomplete Dropdown */}
      {showDropdown && (
        <div className="absolute top-12 z-50 w-full overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md">
          <div className="flex flex-col p-1">

            {/* Recent Players Section */}
            {searchTerm.length === 0 && recentPlayers.length > 0 && (
              <>
                <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Recently Viewed</p>
                {recentPlayers.map((player) => (
                  <Link
                    key={player.player_id}
                    href={`/player/${encodeURIComponent(player.last_known_name)}`}
                    className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      // Do not clear search term here necessarily if just nav, but usually resetting state is good
                      addToRecent(player); // Refresh position
                    }}
                  >
                    <div className="bg-primary/10 p-1 rounded-full">
                      <User className="h-3 w-3 text-primary" />
                    </div>
                    <span>{player.last_known_name}</span>
                  </Link>
                ))}
                <div className="h-px bg-border my-1" />
              </>
            )}

            {/* Search Results Section */}
            {results.length > 0 && (
              <>
                <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Results</p>
                {results.slice(0, 7).map((player) => ( // Show top 7 results
                  <Link
                    key={player.player_id}
                    href={`/player/${encodeURIComponent(player.last_known_name)}`}
                    className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setSearchTerm("");
                      addToRecent(player);
                    }}
                  >
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{player.last_known_name}</span>
                  </Link>
                ))}
                {/* "See all results" link */}
                <Link
                  href={`/search?q=${searchTerm.trim()}`}
                  className="mt-1 rounded-sm border-t border-border px-2 py-2 text-center text-xs font-medium text-primary outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setSearchTerm("");
                  }}
                >
                  See all results for "{searchTerm}"
                </Link>
              </>
            )}

            {searchTerm.length > 0 && results.length === 0 && !isLoading && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No results found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}