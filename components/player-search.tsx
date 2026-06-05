"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Loader2, User, Server } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

interface PlayerResult {
  player_id: number | string;
  last_known_name: string;
}

interface ServerResult {
  server_id: number;
  current_server_name: string | null;
}

interface PlayerSearchProps {
  containerClassName?: string;
  inputClassName?: string;
}

export function PlayerSearch({ containerClassName, inputClassName }: PlayerSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [playerResults, setPlayerResults] = useState<PlayerResult[]>([]);
  const [serverResults, setServerResults] = useState<ServerResult[]>([]);
  const [recentPlayers, setRecentPlayers] = useState<PlayerResult[]>([]);
  const [allServers, setAllServers] = useState<ServerResult[] | null>(null);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(false);
  const [isLoadingServers, setIsLoadingServers] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const router = useRouter();
  const debouncedTerm = useDebounce(searchTerm, 300);
  const searchRef = useRef<HTMLDivElement>(null);

  const isLoading = isLoadingPlayers || isLoadingServers;

  // Load recent players from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("recent_players");
      if (stored) setRecentPlayers(JSON.parse(stored));
    } catch {}
  }, []);

  const addToRecent = (player: PlayerResult) => {
    const newList = [player, ...recentPlayers.filter(p => p.player_id !== player.player_id)].slice(0, 5);
    setRecentPlayers(newList);
    localStorage.setItem("recent_players", JSON.stringify(newList));
  };

  // Fetch server list once on first focus
  const fetchServersOnce = async () => {
    if (allServers !== null) return;
    setIsLoadingServers(true);
    try {
      const res = await fetch("/api/v1/servers");
      if (res.ok) {
        const data = await res.json();
        if (data.ok && data.servers) {
          setAllServers(data.servers.map((s: ServerResult) => ({
            server_id: s.server_id,
            current_server_name: s.current_server_name,
          })));
        } else {
          setAllServers([]);
        }
      } else {
        setAllServers([]);
      }
    } catch {
      setAllServers([]);
    } finally {
      setIsLoadingServers(false);
    }
  };

  // Player search — debounced API call
  useEffect(() => {
    if (debouncedTerm.length < 2) {
      setPlayerResults([]);
      setIsLoadingPlayers(false);
      return;
    }
    async function fetchPlayers() {
      setIsLoadingPlayers(true);
      try {
        const res = await fetch(`/api/v1/players/search?name=${encodeURIComponent(debouncedTerm)}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setPlayerResults(data.ok ? data.players : []);
        if (data.ok && data.players.length > 0) setIsDropdownOpen(true);
      } catch {
        setPlayerResults([]);
      } finally {
        setIsLoadingPlayers(false);
      }
    }
    fetchPlayers();
  }, [debouncedTerm]);

  // Server filter — purely client-side against cached list
  useEffect(() => {
    if (debouncedTerm.length < 2 || !allServers) {
      setServerResults([]);
      return;
    }
    const q = debouncedTerm.toLowerCase();
    const matches = allServers
      .filter(s => s.current_server_name?.toLowerCase().includes(q))
      .slice(0, 5);
    setServerResults(matches);
    if (matches.length > 0) setIsDropdownOpen(true);
  }, [debouncedTerm, allServers]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setIsDropdownOpen(false);
    }
  };

  // Close on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const hasResults = playerResults.length > 0 || serverResults.length > 0;
  const showRecents = searchTerm.length === 0 && recentPlayers.length > 0;
  const showDropdown = isDropdownOpen && (hasResults || showRecents || (searchTerm.length >= 2 && !isLoading));

  return (
    <div className={cn("relative w-full max-w-sm", containerClassName)} ref={searchRef}>
      <form onSubmit={handleSubmit}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search players & servers..."
          className={cn("pl-10", "search-glow", inputClassName)}
          type="search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (e.target.value.length === 0) setIsDropdownOpen(true);
          }}
          onFocus={() => {
            setIsDropdownOpen(true);
            fetchServersOnce();
          }}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground animate-spin" />
        )}
      </form>

      {showDropdown && (
        <div className="absolute top-12 z-50 w-full overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md">
          <div className="flex flex-col p-1 max-h-[360px] overflow-y-auto">

            {/* Recent players */}
            {showRecents && (
              <>
                <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Recently Viewed</p>
                {recentPlayers.map((player) => (
                  <Link
                    key={player.player_id}
                    href={`/player/${encodeURIComponent(player.last_known_name)}`}
                    className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                    onClick={() => { setIsDropdownOpen(false); addToRecent(player); }}
                  >
                    <div className="bg-primary/10 p-1 rounded-full shrink-0">
                      <User className="h-3 w-3 text-primary" />
                    </div>
                    <span>{player.last_known_name}</span>
                  </Link>
                ))}
                <div className="h-px bg-border my-1" />
              </>
            )}

            {/* Player results */}
            {playerResults.length > 0 && (
              <>
                <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Players</p>
                {playerResults.slice(0, 6).map((player) => (
                  <Link
                    key={player.player_id}
                    href={`/player/${encodeURIComponent(player.last_known_name)}`}
                    className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                    onClick={() => { setIsDropdownOpen(false); setSearchTerm(""); addToRecent(player); }}
                  >
                    <User className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>{player.last_known_name}</span>
                  </Link>
                ))}
              </>
            )}

            {/* Server results */}
            {serverResults.length > 0 && (
              <>
                {playerResults.length > 0 && <div className="h-px bg-border my-1" />}
                <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Servers</p>
                {serverResults.map((server) => (
                  <Link
                    key={server.server_id}
                    href={`/servers/${server.server_id}`}
                    className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                    onClick={() => { setIsDropdownOpen(false); setSearchTerm(""); }}
                  >
                    <Server className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="truncate">{server.current_server_name ?? `Server ${server.server_id}`}</span>
                  </Link>
                ))}
              </>
            )}

            {/* No results */}
            {searchTerm.length >= 2 && !isLoading && !hasResults && (
              <div className="p-4 text-center text-sm text-muted-foreground">No results found.</div>
            )}

            {/* See all */}
            {hasResults && (
              <Link
                href={`/search?q=${encodeURIComponent(searchTerm.trim())}`}
                className="mt-1 rounded-sm border-t border-border px-2 py-2 text-center text-xs font-medium text-primary outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                onClick={() => { setIsDropdownOpen(false); setSearchTerm(""); }}
              >
                See all results for "{searchTerm}"
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
