import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getRandomBgDataUri } from '../../sig/bg-loader';

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
            const [serverRes, rankingsRes] = await Promise.all([
                withTimeout(
                    fetch(`${envApiUrl}/servers/search?search=${encodeURIComponent(serverId)}`, { next: { revalidate: 30 } }),
                    FETCH_TIMEOUT_MS
                ),
                withTimeout(
                    fetch(`${envApiUrl}/servers/rankings?limit=500`, { next: { revalidate: 300 } }),
                    FETCH_TIMEOUT_MS
                ),
            ]);

            if (serverRes.ok) {
                const data = await serverRes.json();
                if (data.ok && data.server_info) {
                    const s = data.server_info;

                    serverName = s.current_server_name || 'Unknown Server';
                    ipDisplay = s.ip
                        ? (s.current_game_port ? `${String(s.ip)}:${s.current_game_port}` : String(s.ip))
                        : '';
                    playerCount = String(s.current_player_count ?? 0);
                    maxPlayers = String(s.current_max_players ?? 0);

                    const rawMap: string = s.current_map || '---';
                    mapName = rawMap
                        .split('/')
                        .pop()!
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, (c: string) => c.toUpperCase());

                    const rawMode: string = s.gamemode || s.current_gametype || '';
                    gameMode = rawMode
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, (c: string) => c.toUpperCase());

                    timeRemaining = formatTimeRemaining(s.round_time_remain);

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
            debugStatus = e?.message === 'timeout' ? 'Timeout' : 'FetchFail';
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
                    {/* Dark overlay */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: 500,
                        height: 120,
                        background: 'linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.72) 100%)',
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

                    {/* Left — server name, IP:port, rank */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        zIndex: 10,
                        textShadow: '0 2px 4px #000, 0 0 10px #000',
                        maxWidth: 210,
                        gap: 4,
                    }}>
                        <div style={{
                            display: 'flex',
                            fontSize: 17,
                            fontWeight: 'bold',
                            color: '#ffffff',
                            lineHeight: 1.2,
                        }}>
                            {serverName}
                        </div>
                        {ipDisplay ? (
                            <div style={{ display: 'flex', fontSize: 12, color: '#94a3b8', fontWeight: '600' }}>
                                {ipDisplay}
                            </div>
                        ) : null}
                        {globalRank ? (
                            <div style={{ display: 'flex', fontSize: 12, color: '#fbbf24', fontWeight: '700' }}>
                                RANK {globalRank}
                            </div>
                        ) : null}
                    </div>

                    {/* Right — player count, game mode, map, time */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        zIndex: 10,
                        textShadow: '0 2px 4px #000, 0 0 10px #000',
                        gap: 2,
                        maxWidth: 240,
                    }}>
                        <div style={{ display: 'flex', fontSize: 9, color: 'rgba(255,255,255,0.55)', fontWeight: '600', letterSpacing: '0.08em' }}>
                            PLAYERS:
                        </div>
                        <div style={{ display: 'flex', fontSize: 32, fontWeight: 'bold', color: '#ea580c', lineHeight: 1, marginTop: -2 }}>
                            {playerCount}/{maxPlayers}
                        </div>

                        {/* Game mode + map on same line if both present */}
                        <span style={{ display: 'flex', fontSize: 11, color: '#cbd5e1', textAlign: 'right' }}>
                            {gameMode && mapName !== '---' ? `${gameMode} · ${mapName}` : mapName}
                        </span>

                        {timeRemaining ? (
                            <span style={{ display: 'flex', fontSize: 10, color: '#94a3b8' }}>
                                {timeRemaining}
                            </span>
                        ) : null}
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
            {
                width: 500,
                height: 120,
                headers: { 'Cache-Control': 'public, max-age=30, stale-while-revalidate=120' },
            }
        );
    } catch (e: any) {
        console.error('Server Signature Fatal Error:', e);
        return new Response(`Failed to generate server signature: ${e.message}`, { status: 500 });
    }
}
