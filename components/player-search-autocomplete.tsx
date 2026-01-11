"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, User, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// --- Types ---
export interface PlayerSearchResult {
    player_id: number | string;
    last_known_name: string;
}

interface PlayerSearchApiResponse {
    ok: boolean;
    players: PlayerSearchResult[];
}

interface PlayerSearchAutocompleteProps {
    onSelect: (player: PlayerSearchResult) => void;
    placeholder?: string;
    className?: string;
    excludePlayerId?: number | string; // To avoid selecting same player twice
}

// --- Custom Debounce Hook (Duplicate for now, or move to hooks/use-debounce.ts later) ---
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}

export function PlayerSearchAutocomplete({ onSelect, placeholder = "Search player...", className, excludePlayerId }: PlayerSearchAutocompleteProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<PlayerSearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const searchRef = useRef<HTMLDivElement>(null);

    // Fetch results
    useEffect(() => {
        if (debouncedSearchTerm.length < 2) {
            setResults([]);
            setIsLoading(false);
            return;
        }

        async function fetchPlayers() {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/v1/players/search?name=${debouncedSearchTerm}`);
                if (!response.ok) throw new Error("Failed");

                const data: PlayerSearchApiResponse = await response.json();
                if (data.ok && data.players.length > 0) {
                    // Filter out excluded player
                    const filtered = excludePlayerId
                        ? data.players.filter(p => String(p.player_id) !== String(excludePlayerId))
                        : data.players;
                    setResults(filtered);
                    setIsDropdownOpen(true);
                } else {
                    setResults([]);
                    setIsDropdownOpen(false);
                }
            } catch (error) {
                console.error(error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }

        fetchPlayers();
    }, [debouncedSearchTerm, excludePlayerId]);

    // Click outside to close
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [searchRef]);

    const showDropdown = isDropdownOpen && results.length > 0;

    return (
        <div className={cn("relative w-full", className)} ref={searchRef}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder={placeholder}
                    className="pl-9 pr-10"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsDropdownOpen(true);
                    }}
                    onFocus={() => {
                        if (searchTerm.length >= 2) setIsDropdownOpen(true);
                    }}
                />
                {/* Loading Spinner */}
                {isLoading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
                )}
                {/* Clear Button (only if not loading and has text) */}
                {!isLoading && searchTerm.length > 0 && (
                    <button
                        onClick={() => { setSearchTerm(""); setResults([]); setIsDropdownOpen(false); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Dropdown */}
            {showDropdown && (
                <div className="absolute top-full mt-1 z-50 w-full overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 duration-100">
                    <div className="flex flex-col p-1 max-h-[300px] overflow-y-auto">
                        {results.map((player) => (
                            <button
                                key={player.player_id}
                                onClick={() => {
                                    onSelect(player);
                                    setSearchTerm(""); // Clear or keep? Usually clear after selection if it's a "Select one" action
                                    setIsDropdownOpen(false);
                                    setResults([]);
                                }}
                                className="flex items-center gap-3 rounded-sm px-2 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground text-left"
                            >
                                <div className="bg-primary/10 p-1.5 rounded-full flex-shrink-0">
                                    <User className="h-3 w-3 text-primary" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium">{player.last_known_name}</span>
                                    <span className="text-[10px] text-muted-foreground font-mono">ID: {player.player_id}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
