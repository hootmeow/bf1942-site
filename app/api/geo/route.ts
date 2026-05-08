import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    const ip = request.nextUrl.searchParams.get('ip');
    if (!ip) {
        return NextResponse.json({ error: 'Missing ip' }, { status: 400 });
    }

    try {
        const res = await fetch(
            `https://ipwho.is/${ip}?fields=country,country_code,city,region,latitude,longitude,timezone`,
            {
                next: { revalidate: 86400 }, // cache for 24 h — IPs rarely change region
                signal: AbortSignal.timeout(5000),
            }
        );
        if (!res.ok) throw new Error(`ipwho.is ${res.status}`);

        const data = await res.json();
        if (!data.country_code) throw new Error('No country_code in response');

        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
            },
        });
    } catch (e) {
        console.error('[geo] lookup failed for', ip, e);
        return NextResponse.json({ error: 'Geo lookup failed' }, { status: 500 });
    }
}
