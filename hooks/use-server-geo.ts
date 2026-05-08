"use client";

import { useEffect, useState } from "react";

export interface GeoData {
    country_code: string;
    country: string;
    city: string;
    region: string;
    latitude: number;
    longitude: number;
    timezone: {
        id: string; // e.g. America/Los_Angeles
        abbr: string; // e.g. PST
        utc: string; // e.g. -08:00
        current_time: string;
    };
}

// Global cache
const CACHE_KEY = "server_geo_full_cache";
let memoryCache: Record<string, GeoData> = {};

export function useServerGeo(ip: string) {
    const [data, setData] = useState<GeoData | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!ip) return;

        // 1. Check memory
        if (memoryCache[ip]) {
            setData(memoryCache[ip]);
            return;
        }

        // 2. Check localStorage
        try {
            const stored = localStorage.getItem(CACHE_KEY);
            if (stored) {
                memoryCache = JSON.parse(stored);
                if (memoryCache[ip]) {
                    setData(memoryCache[ip]);
                    return;
                }
            }
        } catch (e) {
            console.error("Error reading geo cache", e);
        }

        // 3. Fetch via server-side proxy (avoids CORS + caches at the edge)
        let mounted = true;
        async function fetchGeo() {
            setLoading(true);
            try {
                const res = await fetch(`/api/geo?ip=${encodeURIComponent(ip)}`);
                if (res.ok) {
                    const result = await res.json();
                    if (result && result.country_code) {
                        const geo: GeoData = {
                            country: result.country,
                            country_code: result.country_code,
                            city: result.city,
                            region: result.region,
                            latitude: result.latitude,
                            longitude: result.longitude,
                            timezone: result.timezone,
                        };
                        if (mounted) {
                            setData(geo);
                            memoryCache[ip] = geo;
                            localStorage.setItem(CACHE_KEY, JSON.stringify(memoryCache));
                        }
                    }
                }
            } catch (e) {
                console.error(`Failed to fetch geo for ${ip}`, e);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        fetchGeo();
        return () => { mounted = false; };
    }, [ip]);

    return { data, loading };
}
