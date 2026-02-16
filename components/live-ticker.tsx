"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Server } from "@/components/server-directory";
import { Globe, Users, Trophy, Crosshair, Map as MapIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsItem {
    id: string;
    type: "active_match" | "player_action" | "recent_event";
    message: string;
    icon: React.ElementType;
}

export function LiveTicker({ className }: { className?: string }) {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTickerData() {
            try {
                // 1. Fetch Servers
                const res = await fetch("/api/v1/servers");
                if (!res.ok) throw new Error("Failed to fetch servers");

                const data = await res.json();
                if (!data.ok || !data.servers) return;

                const activeServers: Server[] = data.servers.filter(
                    (s: Server) => s.current_state === "ACTIVE" && s.current_player_count > 0
                );

                let items: NewsItem[] = [];

                // 2. Fetch details (scoreboard) for top 3 active servers to get player names
                // We limit to 3 to avoid spamming the API
                const topServers = activeServers.slice(0, 3);
                const serverDetailsPromises = topServers.map(s =>
                    fetch(`/api/v1/servers/search?search=${s.server_id}`).then(r => r.json())
                );

                const serverDetails = await Promise.all(serverDetailsPromises);

                // 3. Build News Items
                topServers.forEach((server, index) => {
                    // Note: We are prioritizing Player Names over Server Names per user request.

                    // B. Player Highlights from scoreboard
                    const details = serverDetails[index];
                    if (details?.ok && details?.scoreboard && details.scoreboard.length > 0) {
                        const scoreboard = details.scoreboard;

                        // Show Top Scorer
                        const topScorer = scoreboard[0];
                        if (topScorer) {
                            items.push({
                                id: `leader-${server.server_id}`,
                                type: "player_action",
                                message: `${topScorer.player_name} [${topScorer.kills} K / ${topScorer.deaths} D]`, // Convert to K/D
                                icon: Crosshair, // Unified Icon
                            });
                        }

                        // Show multiple random players (Increased from 1 to 3 active players)
                        if (scoreboard.length > 1) {
                            // Get up to 3 random players (excluding top scorer)
                            const otherPlayers = scoreboard.slice(1);
                            const shuffled = otherPlayers.sort(() => 0.5 - Math.random());
                            const selected = shuffled.slice(0, 3);

                            selected.forEach((p: any) => {
                                items.push({
                                    id: `active-${p.player_name}-${server.server_id}`,
                                    type: "player_action",
                                    message: `${p.player_name} [${p.kills} K / ${p.deaths} D]`,
                                    icon: Crosshair, // Unified Icon
                                });
                            });
                        }
                    } else {
                        // Fallback if no scoreboard
                        items.push({
                            id: `server-${server.server_id}`,
                            type: "active_match",
                            message: `ACTIVE FRONT: ${server.current_map} on ${server.current_server_name}`,
                            icon: Crosshair, // Unified Icon
                        });
                    }
                });


                // Fallback
                if (items.length === 0) {
                    items.push({
                        id: "system-idle-1",
                        type: "recent_event",
                        message: "LONG RANGE SCANNERS ACTIVE... MONITORING FREQUENCIES...",
                        icon: Crosshair, // Unified Icon
                    });
                    items.push({
                        id: "system-idle-2",
                        type: "recent_event",
                        message: "NO ACTIVE CONFLICTS DETECTED. STANDBY.",
                        icon: Crosshair, // Unified Icon
                    });
                }

                // Shuffle items slightly so it's not always Server -> Leader -> Random
                // A simple deterministic sort or just interleave could work, but random is fun for a ticker
                items = items.sort(() => Math.random() - 0.5);

                setNews(items);
            } catch (e) {
                console.error("Ticker fetch error", e);
            } finally {
                setLoading(false);
            }
        }

        fetchTickerData();
        const interval = setInterval(fetchTickerData, 60000); // 60s poll
        return () => clearInterval(interval);
    }, []);

    // Measure content width and compute a readable scroll duration (~50px/s)
    const scrollRef = useRef<HTMLDivElement>(null);
    const [duration, setDuration] = useState(120);

    useEffect(() => {
        if (scrollRef.current && news.length > 0) {
            // The element is tripled, so one "copy" is 1/3 of scrollWidth
            const oneThirdWidth = scrollRef.current.scrollWidth / 3;
            // Target ~50px per second for comfortable reading
            const computed = Math.max(oneThirdWidth / 50, 30);
            setDuration(computed);
        }
    }, [news]);

    const tripledNews = useMemo(() => [...news, ...news, ...news], [news]);

    if (loading || news.length === 0) return null;

    return (
        <div className={cn(
            "w-full bg-black/40 border-y border-white/5 backdrop-blur-sm overflow-hidden flex items-center relative z-40 h-8",
            className
        )}>
            {/* Label: Smaller and more compact */}
            <div className="absolute left-0 top-0 bottom-0 z-50 flex items-center px-3 bg-background/95 border-r border-primary/20 text-primary font-bold text-[10px] uppercase tracking-widest shadow-sm">
                Live Intel
            </div>

            {/* Scrolling Content */}
            <div
                ref={scrollRef}
                className="flex whitespace-nowrap items-center gap-8 pl-[100px]"
                style={{ animation: `marquee ${duration}s linear infinite` }}
            >
                {tripledNews.map((item, i) => (
                    <div key={`${item.id}-${i}`} className="flex items-center gap-2 text-xs font-mono">
                        <item.icon className="w-3 h-3 text-primary/70" />
                        <span className="text-muted-foreground/90 uppercase">{item.message}</span>
                        <span className="text-primary/20 mx-1">///</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
