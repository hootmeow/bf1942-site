"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Server } from "@/components/server-directory";
import { Globe, Users, Trophy, Crosshair, Map as MapIcon, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsItem {
    id: string;
    type: "active_match" | "player_action" | "bulletin";
    message: string;
    icon: React.ElementType;
}

export function LiveTicker({ className }: { className?: string }) {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTickerData() {
            try {
                const res = await fetch("/api/v1/servers");
                if (!res.ok) throw new Error("Failed to fetch servers");

                const data = await res.json();
                if (!data.ok || !data.servers) return;

                const activeServers: Server[] = data.servers.filter(
                    (s: Server) => s.current_state === "ACTIVE" && s.current_player_count > 0
                );

                const liveItems: NewsItem[] = [];
                const bulletinItems: NewsItem[] = [];

                // ── LIVE PLAYER FEED ─────────────────────────────────────────
                const topServers = activeServers.slice(0, 3);
                const serverDetailsPromises = topServers.map(s =>
                    fetch(`/api/v1/servers/search?search=${s.server_id}`).then(r => r.json())
                );
                const serverDetails = await Promise.all(serverDetailsPromises);

                topServers.forEach((server, index) => {
                    const details = serverDetails[index];
                    if (details?.ok && details?.scoreboard && details.scoreboard.length > 0) {
                        const scoreboard = details.scoreboard;
                        const topScorer = scoreboard[0];
                        if (topScorer) {
                            liveItems.push({
                                id: `leader-${server.server_id}`,
                                type: "player_action",
                                message: `${topScorer.player_name} [${topScorer.kills} K / ${topScorer.deaths} D]`,
                                icon: Crosshair,
                            });
                        }
                        if (scoreboard.length > 1) {
                            const others = scoreboard.slice(1).sort(() => 0.5 - Math.random()).slice(0, 3);
                            others.forEach((p: any) => {
                                liveItems.push({
                                    id: `active-${p.player_name}-${server.server_id}`,
                                    type: "player_action",
                                    message: `${p.player_name} [${p.kills} K / ${p.deaths} D]`,
                                    icon: Crosshair,
                                });
                            });
                        }
                    } else {
                        liveItems.push({
                            id: `server-${server.server_id}`,
                            type: "active_match",
                            message: `ACTIVE FRONT: ${server.current_map} on ${server.current_server_name}`,
                            icon: Crosshair,
                        });
                    }
                });

                // ── BULLETIN ITEMS ────────────────────────────────────────────
                const totalPlayers = activeServers.reduce((sum, s) => sum + s.current_player_count, 0);
                if (totalPlayers > 0) {
                    bulletinItems.push({
                        id: "bulletin-total",
                        type: "bulletin",
                        message: `${totalPlayers} SOLDIERS DEPLOYED ACROSS ${activeServers.length} ACTIVE FRONT${activeServers.length !== 1 ? "S" : ""}`,
                        icon: Globe,
                    });
                }

                if (activeServers.length > 0) {
                    const biggest = activeServers.reduce((a, b) =>
                        a.current_player_count > b.current_player_count ? a : b
                    );
                    bulletinItems.push({
                        id: "bulletin-biggest",
                        type: "bulletin",
                        message: `MAJOR ENGAGEMENT: ${biggest.current_server_name} — ${biggest.current_player_count}/${biggest.current_max_players} TROOPS`,
                        icon: Radio,
                    });
                }

                // Map highlights from top servers
                topServers.forEach((server, i) => {
                    const rawMap: string = server.current_map || "";
                    const mapName = rawMap.split("/").pop()?.replace(/_/g, " ").toUpperCase() || "";
                    if (mapName && mapName !== "---") {
                        bulletinItems.push({
                            id: `bulletin-map-${server.server_id}`,
                            type: "bulletin",
                            message: `THEATER: ${mapName} — ${server.current_player_count} COMBATANTS ENGAGED`,
                            icon: MapIcon,
                        });
                    }
                });

                // ── INTERLEAVE: 2 live → 1 bulletin ─────────────────────────
                let combined: NewsItem[] = [];
                const live = liveItems.sort(() => Math.random() - 0.5);
                const bull = bulletinItems;
                let li = 0, bi = 0;
                while (li < live.length || bi < bull.length) {
                    if (li < live.length) combined.push(live[li++]);
                    if (li < live.length) combined.push(live[li++]);
                    if (bi < bull.length) combined.push(bull[bi++]);
                }

                if (combined.length === 0) {
                    combined = [
                        { id: "idle-1", type: "bulletin", message: "LONG RANGE SCANNERS ACTIVE... MONITORING FREQUENCIES...", icon: Radio },
                        { id: "idle-2", type: "bulletin", message: "NO ACTIVE CONFLICTS DETECTED. STANDBY.", icon: Radio },
                    ];
                }

                setNews(combined);
            } catch (e) {
                console.error("Ticker fetch error", e);
            } finally {
                setLoading(false);
            }
        }

        fetchTickerData();
        const interval = setInterval(fetchTickerData, 60000);
        return () => clearInterval(interval);
    }, []);

    const scrollRef = useRef<HTMLDivElement>(null);
    const [duration, setDuration] = useState(120);

    useEffect(() => {
        if (scrollRef.current && news.length > 0) {
            const oneThirdWidth = scrollRef.current.scrollWidth / 3;
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
            {/* Label */}
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
                        <item.icon className={cn(
                            "w-3 h-3",
                            item.type === "bulletin" ? "text-amber-500/80" : "text-primary/70"
                        )} />
                        <span className={cn(
                            "uppercase",
                            item.type === "bulletin"
                                ? "text-amber-400/80"
                                : "text-muted-foreground/90"
                        )}>
                            {item.message}
                        </span>
                        <span className="text-primary/20 mx-1">///</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
