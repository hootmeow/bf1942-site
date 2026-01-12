import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { SIG_BACKGROUNDS } from '../static-assets';

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
        // Prioritize the user-configured production API IP
        let profileUrl = `http://15.204.245.34:8000/api/v1/players/search/profile?name=${encodeURIComponent(playerName)}`;
        let advancedUrl = `http://15.204.245.34:8000/api/v1/players/search/profile_advanced?name=${encodeURIComponent(playerName)}`;

        // Use env var if specifically set (e.g. for local overrides)
        const envApiUrl = process.env.API_URL ? process.env.API_URL.replace(/\/+$/, "") : "";
        if (envApiUrl) {
            profileUrl = `${envApiUrl}/players/search/profile?name=${encodeURIComponent(playerName)}`;
            advancedUrl = `${envApiUrl}/players/search/profile_advanced?name=${encodeURIComponent(playerName)}`;
        }

        let debugStatus = "OK";

        try {
            console.log(`[Sig] Fetching profile: ${profileUrl}`);

            // Parallel Fetch
            const [profileRes, advancedRes] = await Promise.all([
                fetch(profileUrl, { next: { revalidate: 60 } }),
                fetch(advancedUrl, { next: { revalidate: 60 } })
            ]);

            if (profileRes.ok) {
                const data = await profileRes.json();
                if (data.ok && data.lifetime_stats) {
                    kdr = data.lifetime_stats.overall_kdr?.toFixed(2) || "0.00";
                    // Fallback score if advanced fails or has no rating
                    score = data.lifetime_stats.total_score?.toLocaleString() || "0";
                } else {
                    debugStatus = "InvData";
                }
            } else {
                debugStatus = `Err${profileRes.status}`;
            }

            // Override score with Skill Rating if available (matches Profile Page)
            if (advancedRes.ok) {
                const advData = await advancedRes.json();
                if (advData.ok && advData.skill_rating && advData.skill_rating.score) {
                    score = advData.skill_rating.score.toLocaleString();
                    if (advData.skill_rating.label) {
                        // Optional: Use rank label from advanced stats if preferred
                        rank = advData.skill_rating.label;
                    }
                }
            }

        } catch (e: any) {
            debugStatus = "FetchFail";
            if (e.cause && e.cause.code === 'ECONNREFUSED') {
                debugStatus = "ConnRefused";
            }
            console.error("[Sig] Fetch Exception:", e);
        }

        // Pick random theme from all available backgrounds
        const randomBg = SIG_BACKGROUNDS[Math.floor(Math.random() * SIG_BACKGROUNDS.length)];

        // VISUAL ERROR INDICATOR
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
                        backgroundColor: '#0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 20px',
                        borderLeft: '4px solid rgba(255,255,255,0.5)',
                        fontFamily: 'sans-serif',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {errorBadge}

                    {/* BACKGROUND IMAGE (Randomized) */}
                    <img
                        src={randomBg}
                        width="500"
                        height="120"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            objectFit: 'cover',
                            zIndex: 0
                        }}
                    />

                    {/* Dark Overlay for readability - Maximum Contrast */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.85) 100%)',
                        zIndex: 1
                    }} />

                    {/* Left Column - Name & Rank */}
                    <div style={{ display: 'flex', flexDirection: 'column', zIndex: 10, textShadow: '0 2px 4px #000000, 0 0 10px #000000' }}>
                        <div style={{ display: 'flex', fontSize: '24px', fontWeight: 'bold', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '280px', textOverflow: 'ellipsis' }}>
                            {playerName}
                        </div>
                        <div style={{ display: 'flex', fontSize: '14px', color: '#ea580c', marginTop: '2px', fontWeight: '700', textTransform: 'uppercase' }}>
                            {rank}
                        </div>
                    </div>

                    {/* Right Column - Stats */}
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', zIndex: 10, textShadow: '0 2px 4px #000000, 0 0 10px #000000' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <span style={{ display: 'flex', fontSize: '10px', color: '#ffffff', fontWeight: '600', opacity: 0.9 }}>SCORE</span>
                            <span style={{ display: 'flex', fontSize: '18px', fontWeight: 'bold' }}>{score}</span>
                        </div>
                        <div style={{ display: 'flex', width: '1px', height: '30px', background: 'rgba(255,255,255,0.6)' }}></div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <span style={{ display: 'flex', fontSize: '10px', color: '#ffffff', fontWeight: '600', opacity: 0.9 }}>K/D</span>
                            <span style={{ display: 'flex', fontSize: '24px', fontWeight: 'bold', color: '#ea580c' }}>{kdr}</span>
                        </div>
                    </div>

                    {/* Bottom Right Watermark (Requested) */}
                    <div style={{
                        display: 'flex',
                        position: 'absolute',
                        bottom: '4px',
                        right: '6px',
                        fontSize: '8px',
                        color: 'rgba(255, 255, 255, 0.8)',
                        zIndex: 20,
                        letterSpacing: '0.5px',
                        textShadow: '0 2px 4px #000000, 0 0 10px #000000'
                    }}>
                        bf1942.online
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
