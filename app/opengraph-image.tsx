import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'BF1942 Online — Battlefield 1942 Stats, Servers & Community';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    padding: '72px 80px',
                    background:
                        'linear-gradient(135deg, #0d1208 0%, #0a0f06 55%, #060a04 100%)',
                    color: '#f5f7f0',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* Olive glow accent */}
                <div
                    style={{
                        position: 'absolute',
                        right: '-180px',
                        bottom: '-220px',
                        width: '620px',
                        height: '620px',
                        borderRadius: '9999px',
                        background:
                            'radial-gradient(circle, rgba(122,158,66,0.22), transparent 65%)',
                    }}
                />

                {/* Brand row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '72px',
                            height: '72px',
                            borderRadius: '16px',
                            border: '2px solid rgba(140,180,80,0.45)',
                            background: 'rgba(122,158,66,0.16)',
                            color: '#a3c34d',
                            fontSize: '30px',
                            fontWeight: 800,
                            letterSpacing: '-1px',
                        }}
                    >
                        BF
                    </div>
                    <span
                        style={{
                            fontSize: '26px',
                            letterSpacing: '6px',
                            textTransform: 'uppercase',
                            color: 'rgba(163,195,77,0.85)',
                        }}
                    >
                        Battlefield 1942 · Online
                    </span>
                </div>

                {/* Headline */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h1
                        style={{
                            fontSize: '88px',
                            fontWeight: 800,
                            margin: 0,
                            lineHeight: 1.02,
                            letterSpacing: '-3px',
                        }}
                    >
                        Live Stats, Servers
                        <br />& Community
                    </h1>
                    <p
                        style={{
                            fontSize: '30px',
                            color: '#9fb08f',
                            marginTop: '24px',
                        }}
                    >
                        Server browser · Leaderboards · Wiki · Mods · bf1942.online
                    </p>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
