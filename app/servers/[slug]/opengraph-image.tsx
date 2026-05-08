import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'BF1942 Server Status';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    let serverName = 'BF1942 Server';
    let mapName = 'Unknown Map';
    let playerCount = '0';
    let maxPlayers = '64';
    let rank: string | null = null;
    let state = 'UNKNOWN';

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bf1942.online';

    try {
        const res = await fetch(
            `${baseUrl}/api/v1/servers/search?search=${encodeURIComponent(slug)}`,
            { cache: 'no-store' }
        );
        if (res.ok) {
            const data = await res.json();
            if (data.ok && data.server_info) {
                const s = data.server_info;
                serverName = s.current_server_name || serverName;
                mapName = s.current_map || mapName;
                playerCount = String(s.current_player_count ?? 0);
                maxPlayers = String(s.current_max_players ?? 64);
                state = s.current_state || state;
            }
        }
    } catch (_) {}

    try {
        const rankRes = await fetch(
            `${baseUrl}/api/v1/servers/rankings?limit=250`,
            { cache: 'force-cache' }
        );
        if (rankRes.ok) {
            const rankData = await rankRes.json();
            if (rankData.ok && Array.isArray(rankData.rankings)) {
                const match = rankData.rankings.find(
                    (r: { server_id: number; rank: number }) => String(r.server_id) === String(slug)
                );
                if (match) rank = String(match.rank);
            }
        }
    } catch (_) {}

    const playerNum = parseInt(playerCount, 10);
    const displayName = serverName.length > 42 ? serverName.slice(0, 39) + '…' : serverName;
    const displayMap = mapName.length > 32 ? mapName.slice(0, 29) + '…' : mapName;

    const statusColor =
        state === 'ACTIVE' ? '#22C55E' :
        state === 'EMPTY'  ? '#94A3B8' :
                             '#EF4444';
    const statusLabel =
        state === 'ACTIVE' ? 'ONLINE' :
        state === 'EMPTY'  ? 'EMPTY'  :
                             'OFFLINE';

    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 55%, #0F172A 100%)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '56px 64px',
                    color: 'white',
                    position: 'relative',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* Decorative circles — no filter, just low opacity */}
                <div style={{
                    position: 'absolute', top: '-80px', right: '-80px',
                    width: '340px', height: '340px',
                    background: '#F97316', borderRadius: '50%',
                    opacity: '0.06', display: 'flex',
                }} />
                <div style={{
                    position: 'absolute', bottom: '-60px', left: '-60px',
                    width: '280px', height: '280px',
                    background: '#3B82F6', borderRadius: '50%',
                    opacity: '0.06', display: 'flex',
                }} />

                {/* Top bar */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '40px',
                }}>
                    <span style={{
                        fontSize: '18px',
                        color: '#F97316',
                        letterSpacing: '3px',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        display: 'flex',
                    }}>
                        BATTLEFIELD 1942 · LIVE SERVER
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '12px', height: '12px', borderRadius: '50%',
                            background: statusColor, display: 'flex',
                        }} />
                        <span style={{
                            fontSize: '18px', color: statusColor,
                            fontWeight: 'bold', letterSpacing: '2px', display: 'flex',
                        }}>
                            {statusLabel}
                        </span>
                    </div>
                </div>

                {/* Server name + map */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{
                        fontSize: displayName.length > 32 ? '52px' : '64px',
                        fontWeight: 'bold',
                        lineHeight: '1.1',
                        color: 'white',
                        marginBottom: '12px',
                        display: 'flex',
                    }}>
                        {displayName}
                    </div>
                    <div style={{
                        fontSize: '28px',
                        color: '#64748B',
                        marginBottom: '48px',
                        display: 'flex',
                    }}>
                        {displayMap}
                    </div>

                    {/* Stats row */}
                    <div style={{ display: 'flex', gap: '64px', alignItems: 'flex-end' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{
                                fontSize: '16px', color: '#64748B',
                                textTransform: 'uppercase', letterSpacing: '2px',
                                marginBottom: '6px', display: 'flex',
                            }}>
                                Players
                            </span>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                <span style={{
                                    fontSize: '52px', fontWeight: 'bold',
                                    color: playerNum > 0 ? '#F97316' : '#94A3B8',
                                    display: 'flex',
                                }}>
                                    {playerCount}
                                </span>
                                <span style={{ fontSize: '30px', color: '#475569', display: 'flex' }}>
                                    /{maxPlayers}
                                </span>
                            </div>
                        </div>

                        {rank && (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{
                                    fontSize: '16px', color: '#64748B',
                                    textTransform: 'uppercase', letterSpacing: '2px',
                                    marginBottom: '6px', display: 'flex',
                                }}>
                                    Global Rank
                                </span>
                                <span style={{
                                    fontSize: '52px', fontWeight: 'bold',
                                    color: '#F97316', display: 'flex',
                                }}>
                                    #{rank}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom branding bar */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid #1E293B',
                    paddingTop: '24px',
                    marginTop: '32px',
                }}>
                    <span style={{ fontSize: '20px', color: '#475569', fontWeight: 'bold', display: 'flex' }}>
                        bf1942.online
                    </span>
                    <span style={{ fontSize: '16px', color: '#334155', letterSpacing: '1px', display: 'flex' }}>
                        Live Stats · Server Browser · Community
                    </span>
                </div>
            </div>
        ),
        { ...size }
    );
}
