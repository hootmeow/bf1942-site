import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getRandomBgDataUri } from '../bg-loader';

export const runtime = 'nodejs';

const FETCH_TIMEOUT_MS = 5000;

function withTimeout(promise: Promise<Response>, ms: number): Promise<Response> {
    return Promise.race([
        promise,
        new Promise<Response>((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), ms)
        ),
    ]);
}

function formatPlaytime(seconds: number | null | undefined): string {
    if (!seconds || seconds <= 0) return '';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h >= 1) return `${h}h ${m}m`;
    return `${m}m`;
}

export async function GET(request: NextRequest, props: { params: Promise<{ slug: string }> }) {
    try {
        const params = await props.params;
        const { slug } = params;

        let playerName = 'Unknown';
        let kdr = '--';
        let globalRank = '# --';
        let rank = 'Private';
        let playtime = '';
        let totalScore = '';
        let avgPing = '';

        if (slug) {
            const rawSlug = Array.isArray(slug) ? slug.join('/') : slug;
            playerName = decodeURIComponent(rawSlug).replace(/\.(png|jpg|jpeg|gif)$/i, '');
        }

        const envApiUrl = process.env.API_URL
            ? process.env.API_URL.replace(/\/+$/, '')
            : 'http://127.0.0.1:8000/api/v1';

        let debugStatus = 'OK';
        try {
            const [profileRes, advancedRes] = await Promise.all([
                withTimeout(
                    fetch(`${envApiUrl}/players/search/profile?name=${encodeURIComponent(playerName)}`, { next: { revalidate: 60 } }),
                    FETCH_TIMEOUT_MS
                ),
                withTimeout(
                    fetch(`${envApiUrl}/players/search/profile_advanced?name=${encodeURIComponent(playerName)}`, { next: { revalidate: 60 } }),
                    FETCH_TIMEOUT_MS
                ),
            ]);

            if (profileRes.ok) {
                const data = await profileRes.json();
                if (data.ok && data.lifetime_stats) {
                    const ls = data.lifetime_stats;
                    kdr = ls.overall_kdr != null ? Number(ls.overall_kdr).toFixed(2) : '--';
                    playtime = formatPlaytime(ls.total_playtime_seconds);
                    totalScore = ls.total_score != null ? Number(ls.total_score).toLocaleString() : '';
                    avgPing = ls.average_ping != null ? `${Math.round(ls.average_ping)}ms` : '';
                } else {
                    debugStatus = 'InvData';
                }
            } else {
                debugStatus = `Err${profileRes.status}`;
            }

            if (advancedRes.ok) {
                const advData = await advancedRes.json();
                if (advData.ok && advData.skill_rating) {
                    if (advData.skill_rating.label) rank = advData.skill_rating.label;
                    if (advData.skill_rating.global_rank) globalRank = `# ${advData.skill_rating.global_rank}`;
                }
            }
        } catch (e: any) {
            debugStatus = e?.message === 'timeout' ? 'Timeout' :
                e?.cause?.code === 'ECONNREFUSED' ? 'ConnRefused' : 'FetchFail';
            console.error('[Sig] Fetch Exception:', e);
        }

        // Build the bottom info strip — only include fields that have data
        const bottomParts = [
            playtime ? `${playtime} played` : null,
            totalScore ? `${totalScore} pts` : null,
            avgPing ? `${avgPing} ping` : null,
        ].filter(Boolean);
        const bottomStrip = bottomParts.join('  ·  ');

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
                    {/* Background image */}
                    <img
                        src={randomBg}
                        style={{ position: 'absolute', top: 0, left: 0, width: 500, height: 120 }}
                    />
                    {/* Dark overlay */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: 500, height: 120,
                        background: 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.75) 100%)',
                        zIndex: 1,
                    }} />

                    {debugStatus !== 'OK' && (
                        <div style={{
                            display: 'flex', position: 'absolute', top: 0, right: 0,
                            background: 'red', color: 'white', fontSize: 10, padding: '2px 4px', zIndex: 50,
                        }}>
                            {debugStatus}
                        </div>
                    )}

                    {/* Left — name + rank */}
                    <div style={{
                        display: 'flex', flexDirection: 'column', zIndex: 10,
                        textShadow: '0 2px 4px #000, 0 0 10px #000',
                        marginBottom: bottomStrip ? 22 : 0,
                    }}>
                        <div style={{
                            display: 'flex', fontSize: 24, fontWeight: 'bold',
                            whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: 270,
                        }}>
                            {playerName}
                        </div>
                        <div style={{ display: 'flex', fontSize: 13, color: '#ea580c', marginTop: 3, fontWeight: '700' }}>
                            {rank.toUpperCase()}
                        </div>
                    </div>

                    {/* Right — K/D | Global Rank */}
                    <div style={{
                        display: 'flex', alignItems: 'center', zIndex: 10,
                        textShadow: '0 2px 4px #000, 0 0 10px #000',
                        marginBottom: bottomStrip ? 22 : 0,
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', paddingRight: 16 }}>
                            <span style={{ display: 'flex', fontSize: 9, color: '#fff', fontWeight: '600', opacity: 0.8, letterSpacing: '0.06em' }}>K/D RATIO</span>
                            <span style={{ display: 'flex', fontSize: 22, fontWeight: 'bold' }}>{kdr}</span>
                        </div>
                        <div style={{ display: 'flex', width: 1, height: 34, background: 'rgba(255,255,255,0.5)' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', paddingLeft: 16 }}>
                            <span style={{ display: 'flex', fontSize: 9, color: '#fff', fontWeight: '600', opacity: 0.8, letterSpacing: '0.06em' }}>GLOBAL RANK</span>
                            <span style={{ display: 'flex', fontSize: 22, fontWeight: 'bold', color: '#ea580c' }}>{globalRank}</span>
                        </div>
                    </div>

                    {/* Bottom strip — playtime · score · ping */}
                    {bottomStrip ? (
                        <div style={{
                            display: 'flex', position: 'absolute', bottom: 6, left: 24,
                            fontSize: 9, color: 'rgba(255,255,255,0.55)', zIndex: 20,
                            letterSpacing: '0.04em', fontFamily: 'monospace',
                            textShadow: '0 1px 3px #000',
                        }}>
                            {bottomStrip}
                        </div>
                    ) : null}

                    {/* Watermark */}
                    <div style={{
                        display: 'flex', position: 'absolute', bottom: 4, right: 6,
                        fontSize: 8, color: 'rgba(255,255,255,0.6)', zIndex: 20,
                        letterSpacing: '0.5px', textShadow: '0 2px 4px #000',
                    }}>
                        bf1942.online
                    </div>
                </div>
            ),
            {
                width: 500,
                height: 120,
                headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' },
            }
        );
    } catch (e: any) {
        console.error('Signature Generation Fatal Error:', e);
        return new Response(`Failed to generate signature: ${e.message}`, { status: 500 });
    }
}
