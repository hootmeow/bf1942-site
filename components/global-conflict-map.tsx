"use client";

import { useEffect, useState, useMemo } from "react";
import { GeoData } from "@/hooks/use-server-geo";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Map as MapIcon, RefreshCw, Server, Map as MapLucide, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
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

async function fetchGeoForIPs(ips: string[]): Promise<Record<string, GeoData>> {
    const results: Record<string, GeoData> = {};
    const uncachedIPs: string[] = [];

    // Check memory cache and localStorage first
    for (const ip of ips) {
        if (GEO_CACHE[ip]) {
            results[ip] = GEO_CACHE[ip];
            continue;
        }

        try {
            const stored = localStorage.getItem("server_geo_full_cache");
            if (stored) {
                const cache = JSON.parse(stored);
                if (cache[ip]) {
                    GEO_CACHE[ip] = cache[ip];
                    results[ip] = cache[ip];
                    continue;
                }
            }
        } catch { }

        uncachedIPs.push(ip);
    }

    // Fetch uncached IPs from backend (which caches in DB)
    if (uncachedIPs.length > 0) {
        try {
            const res = await fetch(`/api/v1/servers/geoip?ips=${uncachedIPs.join(',')}`);
            if (res.ok) {
                const data = await res.json();
                if (data.ok && data.geoip) {
                    for (const [ip, geoData] of Object.entries(data.geoip)) {
                        const geo = geoData as any;
                        if (geo.latitude != null && geo.longitude != null && isValidCoordinates(geo.latitude, geo.longitude)) {
                            const geoObj: GeoData = {
                                country: geo.country,
                                country_code: geo.country_code,
                                city: geo.city,
                                region: geo.region,
                                latitude: geo.latitude,
                                longitude: geo.longitude,
                                timezone: geo.timezone
                            };
                            GEO_CACHE[ip] = geoObj;
                            results[ip] = geoObj;
                        }
                    }

                    // Update localStorage
                    try {
                        const stored = localStorage.getItem("server_geo_full_cache");
                        const cache = stored ? JSON.parse(stored) : {};
                        const final = { ...cache, ...STATIC_GEO_CACHE, ...results };
                        localStorage.setItem("server_geo_full_cache", JSON.stringify(final));
                    } catch { }
                }
            }
        } catch (e) {
            console.error("Geo fetch failed", e);
        }
    }

    return results;
}

interface Cluster {
    id: string; // key "lat,long"
    x: number;
    y: number;
    servers: LiveServer[];
    geo: GeoData;
}

// Helper to validate coordinates are valid and meaningful
function isValidCoordinates(lat: number, lng: number): boolean {
    // Check valid ranges
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return false;
    // Exclude 0,0 (Gulf of Guinea) as it's likely an API failure or unknown location
    if (lat === 0 && lng === 0) return false;
    return true;
}

// Helper to guess location if API fails completely
function guessGeoFromName(name: string): GeoData | null {
    const n = name.toLowerCase();

    if (n.includes("usa") || n.includes("america") || n.includes("new york") || n.includes("chicago") || n.includes("miami")) {
        return { country: "United States", country_code: "US", city: "Unknown Site (USA)", region: "North America", latitude: 39.8, longitude: -98.5, timezone: { id: "EST", abbr: "EST", utc: "-05:00", current_time: "" } };
    } else if (n.includes("de") || n.includes("germany") || n.includes("berlin") || n.includes("frankfurt")) {
        return { country: "Germany", country_code: "DE", city: "Unknown Site (DE)", region: "Europe", latitude: 51.1, longitude: 10.4, timezone: { id: "CET", abbr: "CET", utc: "+01:00", current_time: "" } };
    } else if (n.includes("fr") || n.includes("france") || n.includes("paris")) {
        return { country: "France", country_code: "FR", city: "Unknown Site (FR)", region: "Europe", latitude: 46.2, longitude: 2.2, timezone: { id: "CET", abbr: "CET", utc: "+01:00", current_time: "" } };
    } else if (n.includes("uk") || n.includes("london") || n.includes("britain")) {
        return { country: "United Kingdom", country_code: "GB", city: "Unknown Site (UK)", region: "Europe", latitude: 55.3, longitude: -3.4, timezone: { id: "GMT", abbr: "GMT", utc: "+00:00", current_time: "" } };
    } else if (n.includes("ru") || n.includes("russia") || n.includes("moscow")) {
        return { country: "Russia", country_code: "RU", city: "Unknown Site (RU)", region: "Asia", latitude: 61.5, longitude: 105.3, timezone: { id: "MSK", abbr: "MSK", utc: "+03:00", current_time: "" } };
    } else if (n.includes("jp") || n.includes("japan") || n.includes("tokyo")) {
        return { country: "Japan", country_code: "JP", city: "Unknown Site (JP)", region: "Asia", latitude: 36.2, longitude: 138.2, timezone: { id: "JST", abbr: "JST", utc: "+09:00", current_time: "" } };
    }

    // Return null if we can't determine a valid location
    return null;
}

// Map alignment adjustments (percentage offsets)
const MAP_OFFSET_X = 0; // Adjust if markers are horizontally offset
const MAP_OFFSET_Y = 0; // Adjust if markers are vertically offset

// Continent colors for server markers
const CONTINENT_COLORS: Record<string, { bg: string; border: string; shadow: string; text: string }> = {
    'North America': { bg: 'bg-blue-500', border: 'border-blue-300', shadow: 'shadow-[0_0_15px_rgba(59,130,246,1)]', text: 'text-blue-400' },
    'South America': { bg: 'bg-green-500', border: 'border-green-300', shadow: 'shadow-[0_0_15px_rgba(34,197,94,1)]', text: 'text-green-400' },
    'Europe': { bg: 'bg-purple-500', border: 'border-purple-300', shadow: 'shadow-[0_0_15px_rgba(168,85,247,1)]', text: 'text-purple-400' },
    'Asia': { bg: 'bg-red-500', border: 'border-red-300', shadow: 'shadow-[0_0_15px_rgba(239,68,68,1)]', text: 'text-red-400' },
    'Africa': { bg: 'bg-yellow-500', border: 'border-yellow-300', shadow: 'shadow-[0_0_15px_rgba(234,179,8,1)]', text: 'text-yellow-400' },
    'Oceania': { bg: 'bg-cyan-500', border: 'border-cyan-300', shadow: 'shadow-[0_0_15px_rgba(6,182,212,1)]', text: 'text-cyan-400' },
    'Unknown': { bg: 'bg-gray-500', border: 'border-gray-300', shadow: 'shadow-[0_0_15px_rgba(107,114,128,1)]', text: 'text-gray-400' },
};

// Helper to determine continent from country code
function getContinentFromCountryCode(countryCode: string): string {
    const northAmerica = ['US', 'CA', 'MX', 'GL', 'BM', 'PM'];
    const southAmerica = ['BR', 'AR', 'CL', 'CO', 'PE', 'VE', 'EC', 'BO', 'PY', 'UY', 'GY', 'SR', 'GF'];
    const europe = ['GB', 'FR', 'DE', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'RO', 'PT', 'GR', 'HU', 'IE', 'SK', 'BG', 'HR', 'SI', 'LT', 'LV', 'EE', 'LU', 'MT', 'CY', 'IS', 'AL', 'RS', 'BA', 'MK', 'ME', 'XK', 'MD', 'BY', 'UA', 'RU'];
    const asia = ['CN', 'IN', 'JP', 'KR', 'ID', 'TH', 'VN', 'PH', 'MY', 'SG', 'BD', 'PK', 'KZ', 'UZ', 'TM', 'KG', 'TJ', 'MN', 'MM', 'KH', 'LA', 'NP', 'LK', 'AF', 'IR', 'IQ', 'SA', 'YE', 'SY', 'JO', 'IL', 'PS', 'LB', 'OM', 'KW', 'AE', 'QA', 'BH', 'TR', 'GE', 'AM', 'AZ'];
    const africa = ['ZA', 'EG', 'NG', 'KE', 'GH', 'TZ', 'UG', 'DZ', 'MA', 'AO', 'SD', 'ET', 'CD', 'CM', 'CI', 'MG', 'BF', 'ML', 'MW', 'ZM', 'SN', 'SO', 'TD', 'ZW', 'RW', 'BJ', 'TN', 'BI', 'SS', 'TG', 'LY', 'LR', 'MR', 'CF', 'ER', 'GM', 'BW', 'GA', 'GN', 'SL', 'MZ', 'LS', 'GW', 'MU', 'SZ', 'DJ', 'RE', 'KM', 'CV', 'ST', 'SC', 'YT', 'EH'];
    const oceania = ['AU', 'NZ', 'PG', 'FJ', 'SB', 'NC', 'PF', 'VU', 'WS', 'GU', 'KI', 'FM', 'TO', 'PW', 'MH', 'NR', 'TV', 'AS', 'MP', 'CK'];

    if (northAmerica.includes(countryCode)) return 'North America';
    if (southAmerica.includes(countryCode)) return 'South America';
    if (europe.includes(countryCode)) return 'Europe';
    if (asia.includes(countryCode)) return 'Asia';
    if (africa.includes(countryCode)) return 'Africa';
    if (oceania.includes(countryCode)) return 'Oceania';
    return 'Unknown';
}

export function GlobalConflictMap({ servers }: { servers: LiveServer[] }) {
    const [geoMap, setGeoMap] = useState<Record<string, GeoData>>({});
    const [loading, setLoading] = useState(true);
    const [cacheCleared, setCacheCleared] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Mouse drag handlers for panning
    const handleMouseDown = (e: React.MouseEvent) => {
        if (zoom > 1) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && zoom > 1) {
            setPan({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    // Clear cache function
    const clearGeoCache = () => {
        try {
            localStorage.removeItem("server_geo_full_cache");
            // Clear memory cache except static entries
            Object.keys(GEO_CACHE).forEach(key => {
                if (!STATIC_GEO_CACHE[key]) {
                    delete GEO_CACHE[key];
                }
            });
            setGeoMap({});
            setCacheCleared(true);
            setTimeout(() => setCacheCleared(false), 3000);
            console.log("[Map] Cache cleared, will refetch all coordinates");
        } catch (e) {
            console.error("Failed to clear cache", e);
        }
    };

    // 1. Bulk Fetch Geo Data (uses backend caching)
    useEffect(() => {
        let mounted = true;

        async function loadAll() {
            setLoading(true);
            const uniqueIPs = Array.from(new Set(servers.map(s => s.ip)));

            // Filter out already-cached IPs
            const uncachedIPs = uniqueIPs.filter(ip => !geoMap[ip]);

            if (uncachedIPs.length > 0) {
                const results = await fetchGeoForIPs(uncachedIPs);

                // FALLBACK: Guess from server name for any that still failed
                for (const ip of uncachedIPs) {
                    if (!results[ip]) {
                        const server = servers.find(s => s.ip === ip);
                        if (server) {
                            const guessedGeo = guessGeoFromName(server.current_server_name);
                            if (guessedGeo && isValidCoordinates(guessedGeo.latitude, guessedGeo.longitude)) {
                                results[ip] = guessedGeo;
                            }
                        }
                    }
                }

                if (mounted && Object.keys(results).length > 0) {
                    setGeoMap(prev => ({ ...prev, ...results }));
                }
            }

            if (mounted) setLoading(false);
        }

        if (servers.length > 0) {
            loadAll();
        } else {
            setLoading(false);
        }

        return () => { mounted = false; };
    }, [servers, geoMap]); // depend on servers and geoMap

    // 2. Group into Clusters
    const clusters = useMemo(() => {
        const groups: Record<string, Cluster> = {};

        servers.forEach(server => {
            const geo = geoMap[server.ip];
            if (!geo || geo.latitude == null || geo.longitude == null) return;

            // Validate coordinates before clustering
            if (!isValidCoordinates(geo.latitude, geo.longitude)) {
                console.warn(`[Map] Skipping server ${server.current_server_name} (${server.ip}) - invalid coords: ${geo.latitude}, ${geo.longitude}`);
                return;
            }

            // Use more precise coordinates for clustering - only group if at exact same location
            // 0.01 degree is roughly 1km - close enough to be "same location"
            const latKey = geo.latitude.toFixed(2);
            const lonKey = geo.longitude.toFixed(2);
            const key = `${latKey},${lonKey}`;

            if (!groups[key]) {
                // Equirectangular Projection with offset adjustments
                const x = ((geo.longitude + 180) / 360) * 100 + MAP_OFFSET_X;
                const y = ((90 - geo.latitude) / 180) * 100 + MAP_OFFSET_Y;

                console.log(`[Map] Plotting ${server.current_server_name}: ${geo.city}, ${geo.country} (lat:${geo.latitude.toFixed(2)}, lng:${geo.longitude.toFixed(2)}) -> x:${x.toFixed(1)}%, y:${y.toFixed(1)}%`);

                groups[key] = {
                    id: key,
                    x: x,
                    y: y,
                    servers: [],
                    geo: geo
                };
            }
            groups[key].servers.push(server);
        });

        return Object.values(groups);
    }, [servers, geoMap]);


    return (
        <div className="relative rounded-xl border border-blue-500/30 bg-[#0a0f1c] shadow-[0_0_15px_rgba(59,130,246,0.1)] overflow-hidden">
            {/* Header Overlay */}
            <div className="absolute top-0 left-0 p-4 z-10 pointer-events-none">
                <div>
                    <h2 className="text-xl font-bold tracking-widest text-blue-400 uppercase drop-shadow-[0_0_5px_rgba(59,130,246,0.5)] flex items-center gap-2">
                        <MapLucide className="h-5 w-5" />
                        Global Conflict Map
                    </h2>
                    <p className="text-[10px] text-blue-500/60 font-mono mt-1">
                        LIVE GEOLOCATION FEED v2.0
                    </p>
                    <Button
                        onClick={clearGeoCache}
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-[10px] h-6 px-2 pointer-events-auto text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                        <RefreshCw className={cn("h-3 w-3 mr-1", cacheCleared && "animate-spin")} />
                        Clear Cache
                    </Button>
                </div>
            </div>

            {/* Zoom Controls */}
            <div className="absolute top-20 left-4 z-20 flex flex-col gap-2 pointer-events-auto">
                <Button
                    onClick={() => setZoom(z => Math.min(z + 0.5, 4))}
                    variant="outline"
                    size="icon"
                    className="bg-black/40 backdrop-blur border-blue-500/20 text-blue-400 hover:bg-blue-500/20"
                    disabled={zoom >= 4}
                >
                    <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                    onClick={() => setZoom(z => Math.max(z - 0.5, 0.5))}
                    variant="outline"
                    size="icon"
                    className="bg-black/40 backdrop-blur border-blue-500/20 text-blue-400 hover:bg-blue-500/20"
                    disabled={zoom <= 0.5}
                >
                    <ZoomOut className="h-4 w-4" />
                </Button>
                <Button
                    onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
                    variant="outline"
                    size="icon"
                    className="bg-black/40 backdrop-blur border-blue-500/20 text-blue-400 hover:bg-blue-500/20"
                >
                    <Maximize2 className="h-4 w-4" />
                </Button>
                <div className="text-[10px] text-center text-blue-400 font-mono bg-black/40 px-2 py-1 rounded">
                    {(zoom * 100).toFixed(0)}%
                </div>
            </div>

            {/* Map Container - SVG Based for perfect alignment */}
            <div
                className={cn("relative w-full aspect-[2/1] bg-[#0f172a] rounded-lg overflow-hidden border border-slate-800",
                    zoom > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
                )}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
            >

                {/* Zoomable/Pannable Inner Container */}
                <div
                    className="absolute inset-0 origin-center transition-transform duration-200"
                    style={{
                        transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`
                    }}
                >
                    {/* 1. Tactical Grid Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(30,41,59,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.3)_1px,transparent_1px)] bg-[size:4%_8%] pointer-events-none"></div>

                {/* 2. Equirectangular Map Image (Strict 2:1 Ratio to match projection)
                    Using reliable Wikimedia Commons equirectangular projection
                */}
                <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
                    style={{
                        backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/8/83/Equirectangular_projection_SW.jpg')`,
                        backgroundSize: '100% 100%',
                        backgroundPosition: '0 0',
                        backgroundRepeat: 'no-repeat',
                        // Brighter styling for better visibility
                        filter: 'grayscale(100%) brightness(0.7) sepia(1) hue-rotate(180deg) saturate(1.5) contrast(1.2)',
                        opacity: 0.85
                    }}
                ></div>

                {/* 3. Coastline Glow (Optional, via Drop Shadow on image container if we had transparency, 
                    but simpler to just style the image itself) */}

                {/* 3. Plot Clusters */}
                {clusters.map(cluster => {
                    const count = cluster.servers.length;
                    // Base size 12px, add 4px per server up to 5 servers, then slower scaling
                    const sizePx = count === 1 ? 12 : 12 + (Math.min(count, 5) * 4) + (Math.max(0, count - 5) * 2);
                    const isSingleServer = count === 1;

                    // Determine continent color
                    const continent = getContinentFromCountryCode(cluster.geo.country_code);
                    const colors = CONTINENT_COLORS[continent];

                    const clusterDot = (
                        <>
                            {/* Radar Scan Effect */}
                            <div className={`absolute -inset-2 rounded-full border ${colors.border}/30 animate-[spin_3s_linear_infinite] opacity-0 group-hover:opacity-100`}></div>

                            {/* Pulse - Continent Color */}
                            <span
                                className={`absolute inline-flex h-full w-full animate-ping rounded-full ${colors.bg} opacity-75`}
                                style={{ animationDuration: '1.5s' }}
                            ></span>

                            {/* Core Dot */}
                            <span
                                className={`relative inline-flex items-center justify-center rounded-full ${colors.bg} ${colors.shadow} border-2 ${colors.border} text-[10px] font-bold text-white z-30`}
                                style={{ width: `${sizePx}px`, height: `${sizePx}px` }}
                            >
                                {count > 1 && count}
                            </span>
                        </>
                    );

                    return (
                        <div
                            key={cluster.id}
                            className="absolute group z-20 cursor-pointer"
                            style={{
                                left: `${cluster.x}%`,
                                top: `${cluster.y}%`,
                                transform: `translate(-50%, -50%) scale(${1 / zoom})`
                            }}
                        >
                            {isSingleServer ? (
                                <Link href={`/servers/${cluster.servers[0].server_id}`} className="block">
                                    {clusterDot}
                                </Link>
                            ) : (
                                clusterDot
                            )}

                            {/* Location Label (Always visible for large clusters?) No, keeps clutter down. tooltip only. */}

                            {/* Tooltip */}
                            <div className="absolute left-1/2 bottom-[140%] mb-2 -translate-x-1/2 hidden group-hover:block z-50 min-w-[220px]">
                                <div className={`bg-slate-900/95 backdrop-blur text-white text-xs rounded border ${colors.border}/30 shadow-2xl overflow-hidden`}>
                                    <div className={`px-3 py-2 ${colors.bg}/10 border-b ${colors.border}/20 font-bold flex justify-between items-center ${colors.text} uppercase tracking-wider`}>
                                        <span className="flex items-center gap-2"><MapLucide className="h-3 w-3" /> {cluster.geo.city || "Unknown Grid"}</span>
                                        <span className="text-xs">{count} Server{count !== 1 ? 's' : ''}</span>
                                    </div>
                                    <div className="p-1 max-h-[200px] overflow-y-auto custom-scrollbar">
                                        {cluster.servers.map(s => (
                                            <Link href={`/servers/${s.server_id}`} key={s.server_id} className="block">
                                                <div className="flex justify-between items-center p-2 hover:bg-green-500/20 rounded transition-colors border-b border-dashed border-white/10 last:border-0 cursor-pointer">
                                                    <span className="truncate max-w-[130px] font-medium text-slate-200 hover:text-green-300">{s.current_server_name}</span>
                                                    <Badge variant="outline" className="text-[9px] h-4 border-slate-600 font-mono text-green-400 bg-green-950/30">
                                                        {s.current_player_count}/{s.current_max_players}
                                                    </Badge>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-slate-900/90 absolute left-1/2 -translate-x-1/2 top-full shadow-sm"></div>
                            </div>
                        </div>
                    );
                })}
                </div> {/* End Zoomable Container */}
            </div>


            {/* Cyberpunk details */}
            <div className="absolute bottom-2 left-4 text-[9px] font-mono text-blue-500/30">
                CLUSTERS: {clusters.length} // TARGETS: {servers.length}
            </div>
        </div>
    );
}
