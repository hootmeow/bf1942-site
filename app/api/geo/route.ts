import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const IP_PATTERN = /^(\d{1,3}\.){3}\d{1,3}$|^[0-9a-fA-F:]{2,45}$/

export async function GET(request: NextRequest) {
    const ip = request.nextUrl.searchParams.get('ip');
    if (!ip) {
        return NextResponse.json({ error: 'Missing ip' }, { status: 400 });
    }

    if (!IP_PATTERN.test(ip)) {
        return NextResponse.json({ error: 'Invalid IP address' }, { status: 400 });
    }

    try {
        // ip-api.com is much more reliable than ipwho.is; free tier, no key needed
        const res = await fetch(
            `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,countryCode,city,regionName,lat,lon,timezone`,
            {
                next: { revalidate: 86400 },
                signal: AbortSignal.timeout(5000),
            }
        );
        if (!res.ok) throw new Error(`ip-api.com ${res.status}`);

        const d = await res.json();
        if (d.status !== 'success' || !d.countryCode) throw new Error('ip-api returned non-success');

        // Compute timezone metadata using Intl (runs in Node.js, no extra deps)
        const now = new Date();
        const tzId: string = d.timezone || 'UTC';

        const abbr = new Intl.DateTimeFormat('en-US', { timeZone: tzId, timeZoneName: 'short' })
            .formatToParts(now)
            .find(p => p.type === 'timeZoneName')?.value ?? tzId;

        // "2024-01-15 14:30:00" → "2024-01-15T14:30:00" (matches what the UI splits on 'T')
        const localStr = new Intl.DateTimeFormat('sv-SE', {
            timeZone: tzId,
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false,
        }).format(now).replace(' ', 'T');

        const geo = {
            country: d.country,
            country_code: d.countryCode,
            city: d.city,
            region: d.regionName,
            latitude: d.lat,
            longitude: d.lon,
            timezone: {
                id: tzId,
                abbr,
                utc: '',
                current_time: localStr,
            },
        };

        return NextResponse.json(geo, {
            headers: { 'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800' },
        });
    } catch (e) {
        console.error('[geo] lookup failed for', ip, e);
        return NextResponse.json({ error: 'Geo lookup failed' }, { status: 500 });
    }
}
