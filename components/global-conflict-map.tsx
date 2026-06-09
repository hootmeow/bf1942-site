"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { GeoData } from "@/hooks/use-server-geo";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Map as MapLucide, ZoomIn, ZoomOut, Maximize2, Users } from "lucide-react";
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
    players: number;
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

// Continent marker styles. NOTE: every Tailwind class is a complete literal
// string so the JIT compiler picks them up (interpolated classes like
// `${x}/10` are NOT generated and silently break — that was the old bug).
interface ContinentStyle {
    dot: string;
    glow: string;
    ring: string;
    text: string;
    chip: string;
    legend: string;
}
const CONTINENT_STYLE: Record<string, ContinentStyle> = {
    'North America': { dot: 'bg-sky-400', glow: 'shadow-[0_0_10px_rgba(56,189,248,0.6)]', ring: 'ring-sky-300/50', text: 'text-sky-300', chip: 'bg-sky-500/10 border-sky-500/30', legend: 'bg-sky-400' },
    'South America': { dot: 'bg-emerald-400', glow: 'shadow-[0_0_10px_rgba(52,211,153,0.6)]', ring: 'ring-emerald-300/50', text: 'text-emerald-300', chip: 'bg-emerald-500/10 border-emerald-500/30', legend: 'bg-emerald-400' },
    'Europe': { dot: 'bg-violet-400', glow: 'shadow-[0_0_10px_rgba(167,139,250,0.6)]', ring: 'ring-violet-300/50', text: 'text-violet-300', chip: 'bg-violet-500/10 border-violet-500/30', legend: 'bg-violet-400' },
    'Asia': { dot: 'bg-rose-400', glow: 'shadow-[0_0_10px_rgba(251,113,133,0.6)]', ring: 'ring-rose-300/50', text: 'text-rose-300', chip: 'bg-rose-500/10 border-rose-500/30', legend: 'bg-rose-400' },
    'Africa': { dot: 'bg-amber-400', glow: 'shadow-[0_0_10px_rgba(251,191,36,0.6)]', ring: 'ring-amber-300/50', text: 'text-amber-300', chip: 'bg-amber-500/10 border-amber-500/30', legend: 'bg-amber-400' },
    'Oceania': { dot: 'bg-cyan-400', glow: 'shadow-[0_0_10px_rgba(34,211,238,0.6)]', ring: 'ring-cyan-300/50', text: 'text-cyan-300', chip: 'bg-cyan-500/10 border-cyan-500/30', legend: 'bg-cyan-400' },
    'Unknown': { dot: 'bg-slate-400', glow: 'shadow-[0_0_10px_rgba(148,163,184,0.55)]', ring: 'ring-slate-300/50', text: 'text-slate-300', chip: 'bg-slate-500/10 border-slate-500/30', legend: 'bg-slate-400' },
};

const CONTINENT_ORDER = ['North America', 'South America', 'Europe', 'Africa', 'Asia', 'Oceania', 'Unknown'];

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
    const [locating, setLocating] = useState(true);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);

    const mapRef = useRef<HTMLDivElement>(null);
    const dragStart = useRef({ x: 0, y: 0 });
    const movedRef = useRef(false);
    const fetchedRef = useRef<Set<string>>(new Set(Object.keys(STATIC_GEO_CACHE)));

    // Pointer-based pan (works for both mouse and touch)
    const handlePointerDown = (e: React.PointerEvent) => {
        // Reset on every press so a previous drag can't suppress a later tap.
        movedRef.current = false;
        if (zoom <= 1) return;
        setIsDragging(true);
        dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    };
    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging || zoom <= 1) return;
        const nx = e.clientX - dragStart.current.x;
        const ny = e.clientY - dragStart.current.y;
        if (Math.abs(nx - pan.x) > 2 || Math.abs(ny - pan.y) > 2) movedRef.current = true;
        setPan({ x: nx, y: ny });
    };
    const handlePointerUp = () => setIsDragging(false);

    // Scroll-wheel zoom (non-passive listener so we can preventDefault page scroll)
    useEffect(() => {
        const el = mapRef.current;
        if (!el) return;
        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            setZoom(z => Math.min(4, Math.max(0.5, +(z + (e.deltaY < 0 ? 0.3 : -0.3)).toFixed(2))));
        };
        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, []);

    // Reset pan whenever we return to (or below) 1x so the map can't get stuck off-screen
    useEffect(() => {
        if (zoom <= 1) setPan({ x: 0, y: 0 });
    }, [zoom]);

    // Bulk-fetch geo data. Depends only on `servers`; a ref tracks which IPs we've
    // already requested so we never loop or refetch (the old effect depended on
    // geoMap and re-ran on every update).
    useEffect(() => {
        let mounted = true;

        async function loadAll() {
            setLocating(true);
            const uniqueIPs = Array.from(new Set(servers.map(s => s.ip)));
            const uncachedIPs = uniqueIPs.filter(ip => !fetchedRef.current.has(ip));

            if (uncachedIPs.length > 0) {
                uncachedIPs.forEach(ip => fetchedRef.current.add(ip));
                const results = await fetchGeoForIPs(uncachedIPs);

                // FALLBACK: guess from server name for any that still failed
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

            if (mounted) setLocating(false);
        }

        if (servers.length > 0) {
            loadAll();
        } else {
            setLocating(false);
        }

        return () => { mounted = false; };
    }, [servers]);

    // Group servers into geographic clusters
    const clusters = useMemo(() => {
        const groups: Record<string, Cluster> = {};

        servers.forEach(server => {
            const geo = geoMap[server.ip];
            if (!geo || geo.latitude == null || geo.longitude == null) return;
            if (!isValidCoordinates(geo.latitude, geo.longitude)) return;

            // 0.01 degree ≈ 1km — close enough to be the "same location"
            const key = `${geo.latitude.toFixed(2)},${geo.longitude.toFixed(2)}`;

            if (!groups[key]) {
                // Equirectangular projection
                const x = ((geo.longitude + 180) / 360) * 100 + MAP_OFFSET_X;
                const y = ((90 - geo.latitude) / 180) * 100 + MAP_OFFSET_Y;
                groups[key] = { id: key, x, y, servers: [], geo, players: 0 };
            }
            groups[key].servers.push(server);
            groups[key].players += server.current_player_count;
        });

        // Larger clusters render last so they sit on top
        return Object.values(groups).sort((a, b) => a.servers.length - b.servers.length);
    }, [servers, geoMap]);

    const totalPlayers = useMemo(
        () => clusters.reduce((sum, c) => sum + c.players, 0),
        [clusters]
    );

    // Only show continents that are actually present, in a stable order
    const presentContinents = useMemo(() => {
        const set = new Set<string>();
        clusters.forEach(c => set.add(getContinentFromCountryCode(c.geo.country_code)));
        return CONTINENT_ORDER.filter(c => set.has(c));
    }, [clusters]);

    return (
        <div className="relative overflow-hidden rounded-2xl border border-[#1e2a14] bg-[#070b05] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.6)]">
            {/* Header */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 p-4">
                <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-primary">
                    <MapLucide className="h-4 w-4" />
                    Global Conflict Map
                </h2>
                <p className="mt-1 font-mono text-[10px] text-muted-foreground/50">
                    {clusters.length} location{clusters.length !== 1 ? "s" : ""} · {totalPlayers} player{totalPlayers !== 1 ? "s" : ""} live
                </p>
            </div>

            {/* Zoom controls */}
            <div className="absolute right-4 top-4 z-20 flex flex-col gap-2">
                <Button
                    onClick={() => setZoom(z => Math.min(z + 0.5, 4))}
                    variant="outline"
                    size="icon"
                    aria-label="Zoom in"
                    className="h-9 w-9 border-primary/20 bg-black/40 text-primary/80 backdrop-blur hover:bg-primary/15 hover:text-primary"
                    disabled={zoom >= 4}
                >
                    <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                    onClick={() => setZoom(z => Math.max(z - 0.5, 0.5))}
                    variant="outline"
                    size="icon"
                    aria-label="Zoom out"
                    className="h-9 w-9 border-primary/20 bg-black/40 text-primary/80 backdrop-blur hover:bg-primary/15 hover:text-primary"
                    disabled={zoom <= 0.5}
                >
                    <ZoomOut className="h-4 w-4" />
                </Button>
                <Button
                    onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
                    variant="outline"
                    size="icon"
                    aria-label="Reset view"
                    className="h-9 w-9 border-primary/20 bg-black/40 text-primary/80 backdrop-blur hover:bg-primary/15 hover:text-primary"
                >
                    <Maximize2 className="h-4 w-4" />
                </Button>
                <div className="rounded bg-black/40 px-2 py-1 text-center font-mono text-[10px] text-primary/80 backdrop-blur">
                    {(zoom * 100).toFixed(0)}%
                </div>
            </div>

            {/* Map viewport */}
            <div
                ref={mapRef}
                className={cn(
                    "relative aspect-[2/1] w-full overflow-hidden bg-[#0a0f06]",
                    zoom > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
                )}
                style={{ touchAction: zoom > 1 ? "none" : "auto" }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onClick={() => { if (!movedRef.current) setActiveId(null); }}
            >
                {/* Zoomable / pannable inner layer */}
                <div
                    className="absolute inset-0 origin-center transition-transform duration-200"
                    style={{ transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)` }}
                >
                    {/* Tactical grid */}
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(122,158,66,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(122,158,66,0.08)_1px,transparent_1px)] bg-[size:4%_8%]" />

                    {/* Equirectangular world map (strict 2:1 to match projection) */}
                    <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                            backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/8/83/Equirectangular_projection_SW.jpg')`,
                            backgroundSize: "100% 100%",
                            backgroundRepeat: "no-repeat",
                            // Neutral-dark landmass with a faint olive cast to sit under olive chrome
                            filter: "grayscale(100%) brightness(0.5) sepia(0.35) hue-rotate(35deg) saturate(0.7) contrast(1.05)",
                            opacity: 0.7,
                        }}
                    />
                    {/* Subtle vignette for depth */}
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.45))]" />

                    {/* Clusters */}
                    {clusters.map(cluster => {
                        const count = cluster.servers.length;
                        const sizePx = count === 1 ? 12 : 12 + (Math.min(count, 5) * 4) + (Math.max(0, count - 5) * 2);
                        const isSingle = count === 1;
                        const continent = getContinentFromCountryCode(cluster.geo.country_code);
                        const style = CONTINENT_STYLE[continent];
                        const open = activeId === cluster.id;

                        const dot = (
                            <>
                                {/* Ping pulse */}
                                <span
                                    className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-60", style.dot)}
                                    style={{ animationDuration: "1.8s" }}
                                />
                                {/* Core */}
                                <span
                                    className={cn(
                                        "relative inline-flex items-center justify-center rounded-full text-[10px] font-bold text-white ring-2 z-30",
                                        style.dot, style.glow, style.ring
                                    )}
                                    style={{ width: `${sizePx}px`, height: `${sizePx}px` }}
                                >
                                    {count > 1 && count}
                                </span>
                            </>
                        );

                        return (
                            <div
                                key={cluster.id}
                                className="group absolute z-20 cursor-pointer"
                                style={{
                                    left: `${cluster.x}%`,
                                    top: `${cluster.y}%`,
                                    transform: `translate(-50%, -50%) scale(${1 / zoom})`,
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (movedRef.current) return;
                                    if (!isSingle) setActiveId(prev => (prev === cluster.id ? null : cluster.id));
                                }}
                            >
                                {isSingle ? (
                                    <Link
                                        href={`/servers/${cluster.servers[0].server_id}`}
                                        className="block"
                                        onClick={(e) => { if (movedRef.current) e.preventDefault(); }}
                                    >
                                        {dot}
                                    </Link>
                                ) : (
                                    dot
                                )}

                                {/* Tooltip / details — hover on desktop, tap-toggle on touch */}
                                <div
                                    className={cn(
                                        "absolute bottom-[140%] left-1/2 z-50 mb-2 min-w-[220px] -translate-x-1/2",
                                        open ? "block" : "hidden group-hover:block"
                                    )}
                                >
                                    <div className="overflow-hidden rounded-lg border border-[#1e2a14] bg-[#070b05]/95 text-xs text-white shadow-2xl backdrop-blur">
                                        <div className={cn("flex items-center justify-between border-b px-3 py-2 font-bold uppercase tracking-wider", style.chip, style.text)}>
                                            <span className="flex items-center gap-2"><MapLucide className="h-3 w-3" /> {cluster.geo.city || "Unknown Grid"}</span>
                                            <span className="text-[11px]">{count} server{count !== 1 ? "s" : ""}</span>
                                        </div>
                                        <div className="max-h-[200px] overflow-y-auto p-1">
                                            {cluster.servers.map(s => (
                                                <Link href={`/servers/${s.server_id}`} key={s.server_id} className="block">
                                                    <div className="flex items-center justify-between rounded border-b border-dashed border-white/10 p-2 transition-colors last:border-0 hover:bg-primary/15">
                                                        <span className="max-w-[130px] truncate font-medium text-slate-200">{s.current_server_name}</span>
                                                        <Badge variant="outline" className="h-4 border-primary/30 bg-primary/10 font-mono text-[9px] text-primary">
                                                            {s.current_player_count}/{s.current_max_players}
                                                        </Badge>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#070b05]/95" />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty / locating state */}
                {clusters.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="rounded-lg border border-[#1e2a14] bg-black/40 px-4 py-3 text-center backdrop-blur">
                            <p className="text-sm font-medium text-muted-foreground">
                                {locating ? "Locating active servers…" : "No servers to plot right now"}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Legend + hint footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#1e2a14] px-4 py-2.5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    {presentContinents.map(continent => (
                        <span key={continent} className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                            <span className={cn("h-2 w-2 rounded-full", CONTINENT_STYLE[continent].legend)} />
                            {continent}
                        </span>
                    ))}
                </div>
                <span className="hidden items-center gap-1.5 font-mono text-[10px] text-muted-foreground/50 sm:flex">
                    <Users className="h-3 w-3" />
                    Scroll or pinch to zoom · drag to pan · tap a marker for details
                </span>
            </div>
        </div>
    );
}
