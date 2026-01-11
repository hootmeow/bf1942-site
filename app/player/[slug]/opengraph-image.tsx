import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Player Profile';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
    const slug = params.slug;
    let playerName = "Unknown Soldier";
    let kd = "N/A";
    let rank = "Private";
    let score = "0";

    if (Array.isArray(slug)) {
        playerName = decodeURIComponent(slug.join('/'));
    } else {
        playerName = decodeURIComponent(slug);
    }

    // Fetch Player Data
    // We use the full URL normally, but here we can try to fetch from the API directly if possible
    // Since this is edge runtime, we need absolute URL.
    // Using a fallback "mock" fetch for the image generation if API is not reachable, 
    // but ideally we hit the API.
    try {
        const res = await fetch(`http://127.0.0.1:8000/api/v1/players/search/profile?name=${encodeURIComponent(playerName)}`);
        if (res.ok) {
            const data = await res.json();
            if (data.ok && data.lifetime_stats) {
                kd = data.lifetime_stats.overall_kdr.toFixed(2);
                score = data.lifetime_stats.total_score.toLocaleString();
                // Try to guess rank from score? Or just show "Veteran"
                if (data.lifetime_stats.total_score > 100000) rank = "General";
                else if (data.lifetime_stats.total_score > 50000) rank = "Colonel";
                else if (data.lifetime_stats.total_score > 10000) rank = "Sergeant";
            }
        }
    } catch (e) {
        console.error("OG Image Fetch Error", e);
    }

    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #0F172A, #1E293B)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    position: 'relative',
                }}
            >
                {/* Background Decorative Elements */}
                <div style={{
                    position: 'absolute',
                    top: '-100px',
                    right: '-100px',
                    width: '400px',
                    height: '400px',
                    background: '#F97316',
                    borderRadius: '50%',
                    opacity: '0.1',
                    filter: 'blur(100px)'
                }} />

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
                    <h2 style={{ fontSize: '32px', color: '#F97316', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>
                        COMBAT RECORD
                    </h2>
                    <h1 style={{ fontSize: '84px', fontWeight: 'bold', margin: '0', textAlign: 'center', lineHeight: '1' }}>
                        {playerName}
                    </h1>
                    <div style={{ display: 'flex', marginTop: '40px', gap: '60px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: '24px', color: '#94A3B8', textTransform: 'uppercase' }}>K/D Ratio</span>
                            <span style={{ fontSize: '64px', fontWeight: 'bold' }}>{kd}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: '24px', color: '#94A3B8', textTransform: 'uppercase' }}>Total Score</span>
                            <span style={{ fontSize: '64px', fontWeight: 'bold' }}>{score}</span>
                        </div>
                    </div>
                    <p style={{ marginTop: '50px', fontSize: '24px', color: '#64748B' }}>
                        bf1942.online
                    </p>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
