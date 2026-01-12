import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest, props: { params: Promise<{ slug: string }> }) {
    try {
        const params = await props.params;
        const { slug } = params;

        // Default values
        let playerName = "Unknown";
        let score = "0";
        let kdr = "0.00";
        let rank = "Private";
        let rankAbbr = "Pvt";

        // Decode Player Name
        if (slug) {
            const rawSlug = Array.isArray(slug) ? slug.join('/') : slug;
            playerName = decodeURIComponent(rawSlug);
        }

        // --- DYNAMIC API URL RESOLUTION ---
        // 1. Try environment variable (Standard method)
        // 2. Fallback to localhost direct (Dev method)
        // 3. Last resort: current origin (Prod/Edge method)

        let apiUrl = "";
        // Remove ANY trailing slashes from env var to prevent double slashes
        const envApiUrl = process.env.API_URL ? process.env.API_URL.replace(/\/+$/, "") : "";

        if (envApiUrl) {
            apiUrl = `${envApiUrl}/players/search/profile?name=${encodeURIComponent(playerName)}`;
        } else {
            // Fallback for when API_URL is missing
            const origin = request.nextUrl.origin;
            if (origin.includes("localhost")) {
                apiUrl = `http://127.0.0.1:8000/api/v1/players/search/profile?name=${encodeURIComponent(playerName)}`;
            } else {
                apiUrl = `${origin}/api/v1/players/search/profile?name=${encodeURIComponent(playerName)}`;
            }
        }

        let debugStatus = "OK";

        try {
            console.log(`[Sig] Fetching from: ${apiUrl}`);
            const res = await fetch(apiUrl, {
                next: { revalidate: 300 }
            });

            if (res.ok) {
                const data = await res.json();
                if (data.ok && data.lifetime_stats) {
                    kdr = data.lifetime_stats.overall_kdr?.toFixed(2) || "0.00";
                    score = data.lifetime_stats.total_score?.toLocaleString() || "0";

                    // Rank Heuristic
                    const s = data.lifetime_stats.total_score || 0;
                    if (s > 100000) { rank = "General"; rankAbbr = "Gen"; }
                    else if (s > 50000) { rank = "Colonel"; rankAbbr = "Col"; }
                    else if (s > 25000) { rank = "Major"; rankAbbr = "Maj"; }
                    else if (s > 10000) { rank = "Captain"; rankAbbr = "Cpt"; }
                    else if (s > 5000) { rank = "Lieutenant"; rankAbbr = "Lt"; }
                    else if (s > 1000) { rank = "Sergeant"; rankAbbr = "Sgt"; }
                } else {
                    debugStatus = "InvData";
                    console.error("[Sig] Data missing lifetime_stats or not ok");
                }
            } else {
                debugStatus = `Err${res.status}`;
                console.error(`[Sig] API Error: ${res.status}`);
            }
        } catch (e: any) {
            debugStatus = "FetchFail";
            // Check for connection refused specifically
            if (e.cause && e.cause.code === 'ECONNREFUSED') {
                debugStatus = "ConnRefused";
            }
            console.error("[Sig] Fetch Exception:", e);
        }

        // VISUAL ERROR INDICATOR (Only if failed)
        // Fixed zIndex type error (number, not string)
        const errorBadge = debugStatus !== "OK" ? (
            <div style={{
                display: 'flex',
                position: 'absolute',
                top: 0,
                right: 0,
                background: 'red',
                color: 'white',
                fontSize: '10px',
                padding: '2px 4px',
                zIndex: 50
            }}>
                {debugStatus}
            </div>
        ) : null;

        return new ImageResponse(
            (
                <div
                    style={{
                        width: '500px',
                        height: '120px',
                        background: '#0F172A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 20px',
                        borderLeft: '4px solid #F97316',
                        fontFamily: 'sans-serif',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {errorBadge}
                    {/* Background Texture */}
                    <div style={{
                        position: 'absolute',
                        top: '-20px',
                        right: '-20px',
                        width: '100px',
                        height: '200px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        transform: 'rotate(20deg)',
                    }} />

                    {/* Left Column - Name & Rank */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', fontSize: '12px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            BF1942.ONLINE
                        </div>
                        <div style={{ display: 'flex', fontSize: '24px', fontWeight: 'bold', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '300px', textOverflow: 'ellipsis' }}>
                            {rankAbbr}. {playerName}
                        </div>
                        <div style={{ display: 'flex', fontSize: '14px', color: '#F97316', marginTop: '4px' }}>
                            {rank}
                        </div>
                    </div>

                    {/* Right Column - Stats */}
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', zIndex: 10 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <span style={{ display: 'flex', fontSize: '10px', color: '#94A3B8' }}>SCORE</span>
                            <span style={{ display: 'flex', fontSize: '18px', fontWeight: 'bold' }}>{score}</span>
                        </div>
                        <div style={{ display: 'flex', width: '1px', height: '30px', background: '#334155' }}></div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <span style={{ display: 'flex', fontSize: '10px', color: '#94A3B8' }}>K/D RATIO</span>
                            <span style={{ display: 'flex', fontSize: '24px', fontWeight: 'bold', color: '#F97316' }}>{kdr}</span>
                        </div>
                    </div>
                </div>
            ),
            {
                width: 500,
                height: 120,
            }
        );
    } catch (e: any) {
        console.error("Signature Generation Fatal Error:", e);
        return new Response(`Failed to generate signature: ${e.message}`, { status: 500 });
    }
}
