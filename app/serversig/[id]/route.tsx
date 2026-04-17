import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getRandomBgDataUri } from '../../sig/bg-loader';

export const runtime = 'nodejs';

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        // Strip image extension so forum hotlinks work
        const serverId = params.id.replace(/\.(png|jpg|jpeg|gif)$/i, '');

        const envApiUrl = process.env.API_URL
            ? process.env.API_URL.replace(/\/+$/, '')
            : 'http://127.0.0.1:8000/api/v1';

        const searchUrl = `${envApiUrl}/servers/search?search=${encodeURIComponent(serverId)}`;

        let serverName = 'Unknown Server';
        let ipDisplay = '';
        let mapName = '---';
        let playerCount = '0';
        let maxPlayers = '0';
        let debugStatus = 'OK';

        try {
            console.log(`[ServerSig] Fetching: ${searchUrl}`);
            const res = await fetch(searchUrl, { next: { revalidate: 30 } });
            if (res.ok) {
                const data = await res.json();
                if (data.ok && data.server_info) {
                    const s = data.server_info;
                    serverName = s.current_server_name || 'Unknown Server';
                    ipDisplay = s.ip ? String(s.ip) : '';
                    // Format map: strip path prefix, replace underscores, title-case
                    const rawMap: string = s.current_map || '---';
                    mapName = rawMap
                        .split('/')
                        .pop()!
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, (c: string) => c.toUpperCase());
                    playerCount = String(s.current_player_count ?? 0);
                    maxPlayers = String(s.current_max_players ?? 0);
                }
            } else {
                debugStatus = `Err${res.status}`;
            }
        } catch (e: any) {
            debugStatus = 'FetchFail';
            console.error('[ServerSig] Fetch Exception:', e);
        }

        const randomBg = getRandomBgDataUri();

        const errorBadge = debugStatus !== 'OK' ? (
            <div style={{
                display: 'flex',
                position: 'absolute',
                top: 0,
                right: 0,
                background: 'red',
                color: 'white',
                fontSize: '10px',
                padding: '2px 4px',
                zIndex: 50,
            }}>
                {debugStatus}
            </div>
        ) : null;

        return new ImageResponse(
            (
                <div style={{
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
                    overflow: 'hidden',
                }}>
                    {errorBadge}

                    <img
                        src={randomBg}
                        width="500"
                        height="120"
                        style={{ position: 'absolute', top: 0, left: 0, objectFit: 'cover', zIndex: 0 }}
                    />
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.85) 100%)',
                        zIndex: 1,
                    }} />

                    {/* Left — server name + IP */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        zIndex: 10,
                        textShadow: '0 2px 4px #000000, 0 0 10px #000000',
                        maxWidth: '260px',
                    }}>
                        <div style={{
                            display: 'flex',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                        }}>
                            {serverName}
                        </div>
                        <div style={{
                            display: 'flex',
                            fontSize: '11px',
                            color: '#94a3b8',
                            marginTop: '4px',
                            fontWeight: '600',
                            letterSpacing: '0.3px',
                        }}>
                            {ipDisplay}
                        </div>
                    </div>

                    {/* Right — map and player count */}
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', zIndex: 10, textShadow: '0 2px 4px #000000, 0 0 10px #000000' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <span style={{ display: 'flex', fontSize: '10px', color: '#ffffff', fontWeight: '600', opacity: 0.9 }}>MAP</span>
                            <span style={{ display: 'flex', fontSize: '13px', fontWeight: 'bold', maxWidth: '120px' }}>{mapName}</span>
                        </div>
                        <div style={{ display: 'flex', width: '1px', height: '30px', background: 'rgba(255,255,255,0.6)' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <span style={{ display: 'flex', fontSize: '10px', color: '#ffffff', fontWeight: '600', opacity: 0.9 }}>PLAYERS</span>
                            <span style={{ display: 'flex', fontSize: '24px', fontWeight: 'bold', color: '#ea580c' }}>
                                {playerCount}/{maxPlayers}
                            </span>
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        position: 'absolute',
                        bottom: '4px',
                        right: '6px',
                        fontSize: '8px',
                        color: 'rgba(255, 255, 255, 0.8)',
                        zIndex: 20,
                        letterSpacing: '0.5px',
                        textShadow: '0 2px 4px #000000, 0 0 10px #000000',
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
