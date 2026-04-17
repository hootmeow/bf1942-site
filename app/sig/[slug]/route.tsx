import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getRandomBgDataUri } from '../bg-loader';

export const runtime = 'nodejs';

export async function GET(request: NextRequest, props: { params: Promise<{ slug: string }> }) {
    try {
        const params = await props.params;
        const { slug } = params;

        let playerName = "Unknown";
        let score = "0";
        let globalRank = "# --";
        let rank = "Private";

        // Strip image extension so forum hotlinks work
        if (slug) {
            const rawSlug = Array.isArray(slug) ? slug.join('/') : slug;
            playerName = decodeURIComponent(rawSlug).replace(/\.(png|jpg|jpeg|gif)$/i, '');
        }

        const envApiUrl = process.env.API_URL
            ? process.env.API_URL.replace(/\/+$/, "")
            : "http://127.0.0.1:8000/api/v1";

        let debugStatus = "OK";
        try {
            const [profileRes, advancedRes] = await Promise.all([
                fetch(`${envApiUrl}/players/search/profile?name=${encodeURIComponent(playerName)}`, { next: { revalidate: 60 } }),
                fetch(`${envApiUrl}/players/search/profile_advanced?name=${encodeURIComponent(playerName)}`, { next: { revalidate: 60 } })
            ]);

            if (profileRes.ok) {
                const data = await profileRes.json();
                if (data.ok && data.lifetime_stats) {
                    score = data.lifetime_stats.total_score?.toLocaleString() || "0";
                } else {
                    debugStatus = "InvData";
                }
            } else {
                debugStatus = `Err${profileRes.status}`;
            }

            if (advancedRes.ok) {
                const advData = await advancedRes.json();
                if (advData.ok && advData.skill_rating) {
                    if (advData.skill_rating.score) score = advData.skill_rating.score.toLocaleString();
                    if (advData.skill_rating.label) rank = advData.skill_rating.label;
                    if (advData.skill_rating.global_rank) globalRank = `# ${advData.skill_rating.global_rank}`;
                }
            }
        } catch (e: any) {
            debugStatus = e?.cause?.code === 'ECONNREFUSED' ? "ConnRefused" : "FetchFail";
            console.error("[Sig] Fetch Exception:", e);
        }

        const randomBg = getRandomBgDataUri();

        return new ImageResponse(
            (
                <div style={{
                    width: 500,
                    height: 120,
                    backgroundColor: '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 20px',
                    borderLeft: '4px solid rgba(255,255,255,0.5)',
                    fontFamily: 'sans-serif',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    {/* Background image — width/height MUST be in style for Satori */}
                    <img
                        src={randomBg}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: 500,
                            height: 120,
                        }}
                    />
                    {/* Dark overlay — inset:0 not reliable in Satori, use explicit dimensions */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: 500,
                        height: 120,
                        background: 'linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.72) 100%)',
                        zIndex: 1,
                    }} />

                    {debugStatus !== "OK" && (
                        <div style={{
                            display: 'flex',
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            background: 'red',
                            color: 'white',
                            fontSize: 10,
                            padding: '2px 4px',
                            zIndex: 50,
                        }}>
                            {debugStatus}
                        </div>
                    )}

                    {/* Left — name + rank */}
                    <div style={{ display: 'flex', flexDirection: 'column', zIndex: 10, textShadow: '0 2px 4px #000, 0 0 10px #000' }}>
                        <div style={{ display: 'flex', fontSize: 24, fontWeight: 'bold', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: 280 }}>
                            {playerName}
                        </div>
                        <div style={{ display: 'flex', fontSize: 14, color: '#ea580c', marginTop: 2, fontWeight: '700' }}>
                            {rank.toUpperCase()}
                        </div>
                    </div>

                    {/* Right — score + global rank */}
                    <div style={{ display: 'flex', gap: 20, alignItems: 'center', zIndex: 10, textShadow: '0 2px 4px #000, 0 0 10px #000' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <span style={{ display: 'flex', fontSize: 10, color: '#fff', fontWeight: '600', opacity: 0.9 }}>SCORE</span>
                            <span style={{ display: 'flex', fontSize: 18, fontWeight: 'bold' }}>{score}</span>
                        </div>
                        <div style={{ display: 'flex', width: 1, height: 30, background: 'rgba(255,255,255,0.6)' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <span style={{ display: 'flex', fontSize: 10, color: '#fff', fontWeight: '600', opacity: 0.9 }}>GLOBAL RANK</span>
                            <span style={{ display: 'flex', fontSize: 24, fontWeight: 'bold', color: '#ea580c' }}>{globalRank}</span>
                        </div>
                    </div>

                    {/* Watermark */}
                    <div style={{
                        display: 'flex',
                        position: 'absolute',
                        bottom: 4,
                        right: 6,
                        fontSize: 8,
                        color: 'rgba(255,255,255,0.8)',
                        zIndex: 20,
                        letterSpacing: '0.5px',
                        textShadow: '0 2px 4px #000, 0 0 10px #000',
                    }}>
                        bf1942.online
                    </div>
                </div>
            ),
            { width: 500, height: 120 }
        );
    } catch (e: any) {
        console.error("Signature Generation Fatal Error:", e);
        return new Response(`Failed to generate signature: ${e.message}`, { status: 500 });
    }
}
