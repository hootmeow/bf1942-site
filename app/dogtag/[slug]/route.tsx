import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

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

export async function GET(request: NextRequest, props: { params: Promise<{ slug: string }> }) {
    try {
        const params = await props.params;
        const rawSlug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;
        const playerName = decodeURIComponent(rawSlug).replace(/\.(png|jpg|jpeg|gif)$/i, '');

        const envApiUrl = process.env.API_URL
            ? process.env.API_URL.replace(/\/+$/, '')
            : 'http://127.0.0.1:8000/api/v1';

        let rank = 'Unknown';
        let kdr = '--';
        let winRate = '--';
        let totalRounds = '--';
        let globalRank = '--';
        let country = '';
        let totalKills = '--';

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
                if (data.ok) {
                    const ls = data.lifetime_stats;
                    if (ls) {
                        kdr = ls.overall_kdr != null ? Number(ls.overall_kdr).toFixed(2) : '--';
                        winRate = ls.win_rate != null ? `${Math.round(ls.win_rate)}%` : '--';
                        totalRounds = ls.total_rounds_played != null ? String(ls.total_rounds_played) : '--';
                        totalKills = ls.total_kills != null ? Number(ls.total_kills).toLocaleString() : '--';
                    }
                    if (data.player_info) {
                        country = data.player_info.iso_country_code || '';
                    }
                }
            }

            if (advancedRes.ok) {
                const advData = await advancedRes.json();
                if (advData.ok && advData.skill_rating) {
                    if (advData.skill_rating.label) rank = advData.skill_rating.label;
                    if (advData.skill_rating.global_rank) globalRank = `#${advData.skill_rating.global_rank}`;
                }
            }
        } catch (e) {
            console.error('[DogTag] Fetch Exception:', e);
        }

        // Dog tag dimensions — real tag is roughly 5:2.5 ratio
        const W = 420;
        const H = 200;

        return new ImageResponse(
            (
                <div style={{
                    width: W,
                    height: H,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#1a1a1a',
                    padding: 8,
                }}>
                    {/* Tag body */}
                    <div style={{
                        width: W - 16,
                        height: H - 16,
                        borderRadius: 12,
                        background: 'linear-gradient(145deg, #d4d4d4 0%, #a8a8a8 40%, #c0c0c0 60%, #9a9a9a 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.6), inset 0 -1px 2px rgba(0,0,0,0.3)',
                        padding: '14px 22px 10px',
                        gap: 0,
                    }}>
                        {/* Chain hole */}
                        <div style={{
                            position: 'absolute',
                            top: 8,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            background: '#1a1a1a',
                            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.8)',
                        }} />

                        {/* Divider line top */}
                        <div style={{
                            width: '100%',
                            height: 1,
                            background: 'rgba(0,0,0,0.18)',
                            marginBottom: 10,
                            marginTop: 6,
                        }} />

                        {/* NAME */}
                        <div style={{
                            display: 'flex',
                            fontSize: 26,
                            fontWeight: 'bold',
                            fontFamily: 'monospace',
                            letterSpacing: '0.12em',
                            color: '#1a1a1a',
                            textTransform: 'uppercase',
                            lineHeight: 1,
                            textShadow: '0 1px 0 rgba(255,255,255,0.4)',
                            marginBottom: 4,
                            maxWidth: 360,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                        }}>
                            {playerName}
                        </div>

                        {/* RANK */}
                        <div style={{
                            display: 'flex',
                            fontSize: 12,
                            fontFamily: 'monospace',
                            letterSpacing: '0.18em',
                            color: '#3a3a3a',
                            textTransform: 'uppercase',
                            marginBottom: 10,
                        }}>
                            {rank.toUpperCase()}
                        </div>

                        {/* Divider */}
                        <div style={{
                            width: '100%',
                            height: 1,
                            background: 'rgba(0,0,0,0.18)',
                            marginBottom: 10,
                        }} />

                        {/* Stats row */}
                        <div style={{
                            display: 'flex',
                            width: '100%',
                            justifyContent: 'space-between',
                            gap: 8,
                            marginBottom: 10,
                        }}>
                            {[
                                { label: 'K/D', value: kdr },
                                { label: 'WIN RATE', value: winRate },
                                { label: 'TOTAL KILLS', value: totalKills },
                                { label: 'ROUNDS', value: totalRounds },
                            ].map((stat) => (
                                <div key={stat.label} style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    flex: 1,
                                }}>
                                    <div style={{
                                        fontSize: 8,
                                        fontFamily: 'monospace',
                                        letterSpacing: '0.14em',
                                        color: '#555',
                                        marginBottom: 2,
                                        textTransform: 'uppercase',
                                    }}>
                                        {stat.label}
                                    </div>
                                    <div style={{
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                        fontFamily: 'monospace',
                                        color: '#1a1a1a',
                                        letterSpacing: '0.06em',
                                        textShadow: '0 1px 0 rgba(255,255,255,0.35)',
                                    }}>
                                        {stat.value}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Divider */}
                        <div style={{
                            width: '100%',
                            height: 1,
                            background: 'rgba(0,0,0,0.18)',
                            marginBottom: 8,
                        }} />

                        {/* Footer row */}
                        <div style={{
                            display: 'flex',
                            width: '100%',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{
                                display: 'flex',
                                fontSize: 9,
                                fontFamily: 'monospace',
                                letterSpacing: '0.14em',
                                color: '#555',
                                textTransform: 'uppercase',
                            }}>
                                {country ? `COUNTRY: ${country.toUpperCase()}` : 'BATTLEFIELD 1942'}
                            </div>
                            <div style={{
                                display: 'flex',
                                fontSize: 9,
                                fontFamily: 'monospace',
                                letterSpacing: '0.14em',
                                color: '#555',
                                textTransform: 'uppercase',
                            }}>
                                RANK {globalRank} · BF1942.ONLINE
                            </div>
                        </div>
                    </div>
                </div>
            ),
            {
                width: W,
                height: H,
                headers: { 'Cache-Control': 'public, max-age=120, stale-while-revalidate=600' },
            }
        );
    } catch (e: any) {
        console.error('Dog Tag Generation Fatal Error:', e);
        return new Response(`Failed to generate dog tag: ${e.message}`, { status: 500 });
    }
}
