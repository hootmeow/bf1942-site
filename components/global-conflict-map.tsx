"use client";

import { useEffect, useState, useMemo } from "react";
import { GeoData } from "@/hooks/use-server-geo";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Map as MapIcon, RefreshCw, Server, Map as MapLucide } from "lucide-react"; // Renamed Map to MapLucide avoiding conflict
import { Button } from "@/components/ui/button";

interface LiveServer {
    server_id: number;
    current_server_name: string;
    current_map: string;
    current_player_count: number;
    current_max_players: number;
    ip: string;
    port: number;
}

// Known Servers Static Cache to ensure map is populated immediately for VIPs
const STATIC_GEO_CACHE: Record<string, GeoData> = {
    // SiMPLE | BF1942 (France/OVH)
    "37.187.92.162": {
        country: "France", country_code: "FR", city: "Roubaix", region: "Hauts-de-France",
        latitude: 50.69, longitude: 3.17, timezone: { id: "Europe/Paris", abbr: "CET", utc: "+01:00", current_time: "" }
    },
    // MoonGamers (USA/East)
    "51.81.48.224": {
        country: "United States", country_code: "US", city: "Manassas", region: "Virginia",
        latitude: 38.75, longitude: -77.48, timezone: { id: "America/New_York", abbr: "EST", utc: "-05:00", current_time: "" }
    },
    // FHSW (Germany)
    "176.9.19.239": {
        country: "Germany", country_code: "DE", city: "Falkenstein", region: "Saxony",
        latitude: 50.47, longitude: 12.37, timezone: { id: "Europe/Berlin", abbr: "CET", utc: "+01:00", current_time: "" }
    },
    // Tanks'nPlanes (Canada)
    "184.71.170.154": {
        country: "Canada", country_code: "CA", city: "Calgary", region: "Alberta",
        latitude: 51.04, longitude: -114.07, timezone: { id: "America/Edmonton", abbr: "MST", utc: "-07:00", current_time: "" }
    },
    // Pixel Fighter (Germany)
    "213.239.196.115": {
        country: "Germany", country_code: "DE", city: "Nuremberg", region: "Bavaria",
        latitude: 49.45, longitude: 11.08, timezone: { id: "Europe/Berlin", abbr: "CET", utc: "+01:00", current_time: "" }
    },
    // Oz Wake (USA/NJ - Choopa)
    "108.61.255.31": {
        country: "United States", country_code: "US", city: "Parsippany-Troy Hills", region: "New Jersey",
        latitude: 40.86, longitude: -74.42, timezone: { id: "America/New_York", abbr: "EST", utc: "-05:00", current_time: "" }
    },
    // ATF's Casting Couch (USA/VA - OVH)
    "51.81.187.43": {
        country: "United States", country_code: "US", city: "Vint Hill Farms", region: "Virginia",
        latitude: 38.75, longitude: -77.67, timezone: { id: "America/New_York", abbr: "EST", utc: "-05:00", current_time: "" }
    },
    // TheGreatEscape (Canada/QC - OVH)
    "168.235.94.165": {
        country: "Canada", country_code: "CA", city: "Montreal", region: "Quebec",
        latitude: 45.50, longitude: -73.56, timezone: { id: "America/Toronto", abbr: "EST", utc: "-05:00", current_time: "" }
    },
    // Generic Europe Fallback (if needed later)
    "Europe": {
        country: "Germany", country_code: "DE", city: "Frankfurt", region: "Hesse",
        latitude: 50.11, longitude: 8.68, timezone: { id: "", abbr: "", utc: "", current_time: "" }
    }
};

// Internal cache to avoid re-fetching within the session
const GEO_CACHE: Record<string, GeoData> = { ...STATIC_GEO_CACHE };

async function fetchGeoForIP(ip: string): Promise<GeoData | null> {
    if (GEO_CACHE[ip]) return GEO_CACHE[ip];

    // Check LocalStorage
    try {
        const stored = localStorage.getItem("server_geo_full_cache");
        if (stored) {
            const cache = JSON.parse(stored);
            if (cache[ip]) {
                GEO_CACHE[ip] = cache[ip];
                return cache[ip];
            }
        }
    } catch { }

    try {
        const res = await fetch(`https://ipwho.is/${ip}?fields=country,country_code,city,region,latitude,longitude,timezone`);
        if (res.ok) {
            const result = await res.json();
            if (result && result.country_code) {
                const geo = {
                    country: result.country,
                    country_code: result.country_code,
                    city: result.city,
                    region: result.region,
                    latitude: result.latitude,
                    longitude: result.longitude,
                    timezone: result.timezone
                };
                GEO_CACHE[ip] = geo;
                // Update LS
                try {
                    const stored = localStorage.getItem("server_geo_full_cache");
                    const cache = stored ? JSON.parse(stored) : {};
                    // Merge static cache just in case
                    const final = { ...cache, ...STATIC_GEO_CACHE, [ip]: geo };
                    localStorage.setItem("server_geo_full_cache", JSON.stringify(final));
                } catch { }
                return geo;
            }
        }
    } catch (e) {
        console.error("Geo fetch failed", e);
    }
    return null;
}

interface Cluster {
    id: string; // key "lat,long"
    x: number;
    y: number;
    servers: LiveServer[];
    geo: GeoData;
}

// Helper to guess location if API fails completely
function guessGeoFromName(name: string): GeoData {
    const n = name.toLowerCase();

    // Default to "Unknown Operations" in mid-Atlantic if totally unknown
    // Lat 0, Long 0 is too generic. Let's put them near the equator/prime meridian intersection but slightly visible.
    let geo: GeoData = {
        country: "Unknown", country_code: "UN", city: "Classified Location", region: "Unknown",
        latitude: 0, longitude: 0, timezone: { id: "", abbr: "", utc: "", current_time: "" }
    };

    if (n.includes("usa") || n.includes("america") || n.includes("new york") || n.includes("chicago") || n.includes("miami")) {
        geo = { country: "United States", country_code: "US", city: "Unknown Site (USA)", region: "North America", latitude: 39.8, longitude: -98.5, timezone: { id: "EST", abbr: "EST", utc: "-05:00", current_time: "" } };
    } else if (n.includes("de") || n.includes("germany") || n.includes("berlin") || n.includes("frankfurt")) {
        geo = { country: "Germany", country_code: "DE", city: "Unknown Site (DE)", region: "Europe", latitude: 51.1, longitude: 10.4, timezone: { id: "CET", abbr: "CET", utc: "+01:00", current_time: "" } };
    } else if (n.includes("fr") || n.includes("france") || n.includes("paris")) {
        geo = { country: "France", country_code: "FR", city: "Unknown Site (FR)", region: "Europe", latitude: 46.2, longitude: 2.2, timezone: { id: "CET", abbr: "CET", utc: "+01:00", current_time: "" } };
    } else if (n.includes("uk") || n.includes("london") || n.includes("britain")) {
        geo = { country: "United Kingdom", country_code: "GB", city: "Unknown Site (UK)", region: "Europe", latitude: 55.3, longitude: -3.4, timezone: { id: "GMT", abbr: "GMT", utc: "+00:00", current_time: "" } };
    } else if (n.includes("ru") || n.includes("russia") || n.includes("moscow")) {
        geo = { country: "Russia", country_code: "RU", city: "Unknown Site (RU)", region: "Asia", latitude: 61.5, longitude: 105.3, timezone: { id: "MSK", abbr: "MSK", utc: "+03:00", current_time: "" } };
    } else if (n.includes("jp") || n.includes("japan") || n.includes("tokyo")) {
        geo = { country: "Japan", country_code: "JP", city: "Unknown Site (JP)", region: "Asia", latitude: 36.2, longitude: 138.2, timezone: { id: "JST", abbr: "JST", utc: "+09:00", current_time: "" } };
    }

    return geo;
}

export function GlobalConflictMap({ servers }: { servers: LiveServer[] }) {
    const [geoMap, setGeoMap] = useState<Record<string, GeoData>>({});
    const [loading, setLoading] = useState(true);

    // 1. Bulk Fetch Geo Data (Sequential to avoid Rate Limits)
    useEffect(() => {
        let mounted = true;

        async function loadAll() {
            setLoading(true);
            const uniqueIPs = Array.from(new Set(servers.map(s => s.ip)));
            const results: Record<string, GeoData> = {};
            let hasNewData = false;

            for (const ip of uniqueIPs) {
                if (!mounted) break;

                // Check if we already have it in state to avoid re-fetching
                if (geoMap[ip]) continue;

                let data = await fetchGeoForIP(ip);

                // FALLBACK: If API failed, guess from server name
                if (!data) {
                    const server = servers.find(s => s.ip === ip);
                    if (server) {
                        data = guessGeoFromName(server.current_server_name);
                    }
                }

                if (data) {
                    results[ip] = data;
                    hasNewData = true;
                }

                // Wait 400ms between requests to be safe (API limit is usually ~2/sec or ~45/min for free tiers)
                // Only wait if we actually performed a fetch (i.e. not cached) - fetchGeoForIP handles cache check internally
                // but we can't easily know if it hit network or cache without changing signature. 
                // Let's just wait a bit to be safe.
                await new Promise(r => setTimeout(r, 400));
            }

            if (mounted && hasNewData) {
                setGeoMap(prev => ({ ...prev, ...results }));
            }
            if (mounted) setLoading(false);
        }

        if (servers.length > 0) {
            loadAll();
        } else {
            setLoading(false);
        }

        return () => { mounted = false; };
    }, [servers]); // depend on servers, but logic checks duplicates

    // 2. Group into Clusters
    const clusters = useMemo(() => {
        const groups: Record<string, Cluster> = {};

        servers.forEach(server => {
            const geo = geoMap[server.ip];
            if (!geo || !geo.latitude || !geo.longitude) return;

            // Rounding to create 'buckets' for clustering slightly different IPs in same city
            // 0.1 degree is roughly 11km. 
            const latKey = geo.latitude.toFixed(1);
            const lonKey = geo.longitude.toFixed(1);
            const key = `${latKey},${lonKey}`;

            if (!groups[key]) {
                groups[key] = {
                    id: key,
                    // Equirectangular Projection
                    // x: -180..180 -> 0..100
                    x: ((geo.longitude + 180) / 360) * 100,
                    // y: 90..-90 -> 0..100
                    // Lat increases North (up), but CSS top increases South (down).
                    // So 90 (North Pole) -> 0% Top. -90 (South Pole) -> 100% Top.
                    y: ((90 - geo.latitude) / 180) * 100,
                    servers: [],
                    geo: geo
                };
            }
            groups[key].servers.push(server);
        });

        return Object.values(groups);
    }, [servers, geoMap]);


    // Sort for sidebar
    const sortedServers = [...servers].sort((a, b) => b.current_player_count - a.current_player_count).slice(0, 5);
    const totalPlayers = servers.reduce((acc, s) => acc + s.current_player_count, 0);

    return (
        <div className="relative rounded-xl border border-blue-500/30 bg-[#0a0f1c] shadow-[0_0_15px_rgba(59,130,246,0.1)] overflow-hidden">
            {/* Header Overlay */}
            <div className="absolute top-0 left-0 w-full p-4 flex items-start justify-between z-10 pointer-events-none">
                <div>
                    <h2 className="text-xl font-bold tracking-widest text-blue-400 uppercase drop-shadow-[0_0_5px_rgba(59,130,246,0.5)] flex items-center gap-2">
                        <MapLucide className="h-5 w-5" />
                        Global Conflict Map
                    </h2>
                    <p className="text-[10px] text-blue-500/60 font-mono mt-1">
                        LIVE GEOLOCATION FEED v2.0
                    </p>
                </div>
                <div className="bg-black/40 backdrop-blur border border-blue-500/20 p-2 rounded-md pointer-events-auto">
                    <div className="text-[10px] text-muted-foreground uppercase text-center mb-1">Total Deployed</div>
                    <div className="text-2xl font-mono font-bold text-center text-blue-400">{totalPlayers}</div>
                </div>
            </div>

            {/* Map Container - SVG Based for perfect alignment */}
            <div className="relative w-full aspect-[2/1] bg-[#0f172a] rounded-lg overflow-hidden border border-slate-800">

                {/* 1. Tactical Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(30,41,59,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.3)_1px,transparent_1px)] bg-[size:4%_8%] pointer-events-none"></div>

                {/* 2. Equirectangular Map Image (Strict 2:1 Ratio to match projection) 
                    Using a verified Equirectangular projection image source.
                    Styled with CSS filters to match the 'Cyberpunk' aesthetic.
                */}
                <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
                    style={{
                        backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/2000px-World_map_blank_without_borders.svg.png')`,
                        backgroundSize: '100% 100%',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        // High-tech dark mode filter: Invert to make land dark/light, rotate to blue/cyan
                        filter: 'invert(1) grayscale(100%) brightness(0.5) sepia(1) hue-rotate(180deg) saturate(2)'
                    }}
                ></div>

                {/* 3. Coastline Glow (Optional, via Drop Shadow on image container if we had transparency, 
                    but simpler to just style the image itself) */}

                {/* 3. Plot Clusters */}
                {clusters.map(cluster => {
                    const count = cluster.servers.length;
                    const sizePx = 6 + (Math.min(count, 10) * 3);

                    return (
                        <div
                            key={cluster.id}
                            className="absolute group z-20 cursor-pointer"
                            style={{ left: `${cluster.x}%`, top: `${cluster.y}%`, transform: 'translate(-50%, -50%)' }}
                        >
                            {/* Radar Scan Effect */}
                            <div className="absolute -inset-2 rounded-full border border-green-500/30 animate-[spin_3s_linear_infinite] opacity-0 group-hover:opacity-100"></div>

                            {/* Pulse - High Visibility Neon */}
                            <span
                                className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75"
                                style={{ animationDuration: '1.5s' }}
                            ></span>

                            {/* Core Dot (Bright Gold/Green mix for max contrast on dark blue) */}
                            <span
                                className="relative inline-flex items-center justify-center rounded-full bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,1)] border-2 border-white text-[10px] font-bold text-black z-30"
                                style={{ width: `${sizePx}px`, height: `${sizePx}px` }}
                            >
                                {count > 1 && count}
                            </span>

                            {/* Location Label (Always visible for large clusters?) No, keeps clutter down. tooltip only. */}

                            {/* Tooltip */}
                            <div className="absolute left-1/2 bottom-[140%] mb-2 -translate-x-1/2 hidden group-hover:block z-50 min-w-[220px]">
                                <div className="bg-slate-900/95 backdrop-blur text-white text-xs rounded border border-green-500/30 shadow-2xl overflow-hidden">
                                    <div className="px-3 py-2 bg-green-500/10 border-b border-green-500/20 font-bold flex justify-between items-center text-green-400 uppercase tracking-wider">
                                        <span className="flex items-center gap-2"><MapLucide className="h-3 w-3" /> {cluster.geo.city || "Unknown Grid"}</span>
                                        <span className="text-xs">{count} Active</span>
                                    </div>
                                    <div className="p-1 max-h-[200px] overflow-y-auto custom-scrollbar">
                                        {cluster.servers.map(s => (
                                            <div key={s.server_id} className="flex justify-between items-center p-2 hover:bg-white/5 rounded transition-colors border-b border-dashed border-white/10 last:border-0">
                                                <span className="truncate max-w-[130px] font-medium text-slate-200">{s.current_server_name}</span>
                                                <Badge variant="outline" className="text-[9px] h-4 border-slate-600 font-mono text-green-400 bg-green-950/30">
                                                    {s.current_player_count}/{s.current_max_players}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-green-900/90 absolute left-1/2 -translate-x-1/2 top-full shadow-sm"></div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Sidebar / Overlay for Active Theaters */}
            <div className="absolute top-20 right-4 w-64 hidden md:block z-10 transition-all hover:translate-x-0 translate-x-4 opacity-90 hover:opacity-100">
                <div className="bg-[#0f172a]/90 backdrop-blur border border-yellow-500/20 rounded-lg p-3 shadow-xl">
                    <h3 className="text-xs font-bold text-yellow-400 uppercase mb-3 tracking-wider flex items-center justify-between">
                        Active Theaters
                        <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                    </h3>
                    <div className="space-y-2">
                        {sortedServers.map(server => (
                            <Link href={`/servers/${server.server_id}`} key={server.server_id} className="block group">
                                <div className="flex items-center justify-between text-xs p-1.5 rounded hover:bg-yellow-500/10 transition-colors border border-transparent hover:border-yellow-500/20">
                                    <div className="truncate max-w-[130px] font-medium text-slate-300 group-hover:text-yellow-200">
                                        {server.current_server_name}
                                    </div>
                                    <div className="font-mono text-slate-400 group-hover:text-white">
                                        {server.current_player_count}/{server.current_max_players}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Cyberpunk details */}
            <div className="absolute bottom-2 left-4 text-[9px] font-mono text-blue-500/30">
                CLUSTERS: {clusters.length} // TARGETS: {servers.length}
            </div>
        </div>
    );
}
