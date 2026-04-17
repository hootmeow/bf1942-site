import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getRandomBgDataUri } from '../../sig/bg-loader';

export const runtime = 'nodejs';

function formatTimeRemaining(seconds: number | null | undefined): string {
    if (!seconds || seconds <= 0) return '';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')} left`;
}

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const serverId = params.id.replace(/\.(png|jpg|jpeg|gif)$/i, '');

        const envApiUrl = process.env.API_URL
            ? process.env.API_URL.replace(/\/+$/, '')
            : 'http://127.0.0.1:8000/api/v1';

        let serverName = 'Unknown Server';
        let ipDisplay = '';
        let mapName = '---';
        let playerCount = '0';
        let maxPlayers = '0';
        let gameMode = '';
        let globalRank = '';
        let timeRemaining = '';
        let debugStatus = 'OK';

        try {
            // Fetch server info and rankings in parallel
            const [serverRes, rankingsRes] = await Promise.all([
                fetch(`${envApiUrl}/servers/search?search=${encodeURIComponent(serverId)}`, { next: { revalidate: 30 } }),
                fetch(`${envApiUrl}/servers/rankings?limit=500`, { next: { revalidate: 300 } }),
            ]);

            if (serverRes.ok) {
                const data = await serverRes.json();
                if (data.ok && data.server_info) {
                    const s = data.server_info;

                    serverName = s.current_server_name || 'Unknown Server';
                    ipDisplay = s.ip ? String(s.ip) : '';
                    playerCount = String(s.current_player_count ?? 0);
                    maxPlayers = String(s.current_max_players ?? 0);

                    // Format map name
                    const rawMap: string = s.current_map || '---';
                    mapName = rawMap
                        .split('/')
                        .pop()!
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, (c: string) => c.toUpperCase());

                    // Game mode — prefer ClickHouse gamemode, fall back to Postgres gametype
                    const rawMode: string = s.gamemode || s.current_gametype || '';
                    gameMode = rawMode
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, (c: string) => c.toUpperCase());

                    // Time remaining from ClickHouse live data
                    timeRemaining = formatTimeRemaining(s.round_time_remain);

                    // Look up rank from rankings list
                    if (rankingsRes.ok) {
                        const rankData = await rankingsRes.json();
                        if (rankData.ok && Array.isArray(rankData.rankings)) {
                            const found = rankData.rankings.find((r: any) => r.server_id === s.server_id);
                            if (found) globalRank = `#${found.rank}`;
                        }
                    }
                }
            } else {
                debugStatus = `Err${serverRes.status}`;
            }
        } catch (e: any) {
            debugStatus = 'FetchFail';
            console.error('[ServerSig] Fetch Exception:', e);
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
                    padding: '0 18px',
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
                    {/* Dark overlay — use explicit dimensions, not inset shorthand */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: 500,
                        height: 120,
                        background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.85) 100%)',
                        zIndex: 1,
                    }} />

                    {debugStatus !== 'OK' && (
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

                    {/* Left — server name + IP */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        zIndex: 10,
                        textShadow: '0 2px 4px #000, 0 0 10px #000',
                        maxWidth: 240,
                    }}>
                        <div style={{
                            display: 'flex',
                            fontSize: 16,
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                        }}>
                            {serverName}
                        </div>
                        <div style={{ display: 'flex', fontSize: 10, color: '#94a3b8', marginTop: 3, fontWeight: '600' }}>
                            {ipDisplay}
                        </div>
                    </div>

                    {/* Right — players, mode, map, rank, time */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: 2,
                        zIndex: 10,
                        textShadow: '0 2px 4px #000, 0 0 10px #000',
                    }}>
                        {/* Players — most prominent */}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                            <span style={{ display: 'flex', fontSize: 10, color: '#fff', opacity: 0.7, fontWeight: '600' }}>PLAYERS</span>
                            <span style={{ display: 'flex', fontSize: 22, fontWeight: 'bold', color: '#ea580c' }}>
                                {playerCount}/{maxPlayers}
                            </span>
                        </div>

                        {/* Game mode */}
                        {gameMode ? (
                            <span style={{ display: 'flex', fontSize: 11, color: '#ffffff', fontWeight: '600' }}>
                                {gameMode}
                            </span>
                        ) : null}

                        {/* Map */}
                        <span style={{ display: 'flex', fontSize: 11, color: '#cbd5e1' }}>
                            {mapName}
                        </span>

                        {/* Rank + time remaining */}
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            {globalRank ? (
                                <span style={{ display: 'flex', fontSize: 10, color: '#fbbf24', fontWeight: '700' }}>
                                    RANK {globalRank}
                                </span>
                            ) : null}
                            {timeRemaining ? (
                                <span style={{ display: 'flex', fontSize: 10, color: '#94a3b8' }}>
                                    {timeRemaining}
                                </span>
                            ) : null}
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
        console.error('Server Signature Fatal Error:', e);
        return new Response(`Failed to generate server signature: ${e.message}`, { status: 500 });
    }
}
