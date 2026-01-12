import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';



export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Default values
    let playerName = "Unknown";
    let score = "0";
    let kdr = "0.00";
    let rank = "Private";
    let rankAbbr = "Pvt";

    // Decode Player Name safely
    try {
        if (Array.isArray(slug)) {
            playerName = decodeURIComponent(slug.join('/'));
        } else if (slug) {
            playerName = decodeURIComponent(slug);
        }
    } catch (e) {
        console.error("Failed to decode slug", slug);
    }

    // Fetch Player Stats
    try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bf1942.online";
        const res = await fetch(`${baseUrl}/api/v1/players/search/profile?name=${encodeURIComponent(playerName)}`, {
            next: { revalidate: 300 } // Cache for 5 mins
        });
        if (res.ok) {
            const data = await res.json();
            if (data.ok && data.lifetime_stats) {
                kdr = data.lifetime_stats.overall_kdr?.toFixed(2) || "0.00";
                score = data.lifetime_stats.total_score?.toLocaleString() || "0";
                // Simple rank heuristic until we have the full rank table
                const s = data.lifetime_stats.total_score || 0;
                if (s > 100000) { rank = "General"; rankAbbr = "Gen"; }
                else if (s > 50000) { rank = "Colonel"; rankAbbr = "Col"; }
                else if (s > 25000) { rank = "Major"; rankAbbr = "Maj"; }
                else if (s > 10000) { rank = "Captain"; rankAbbr = "Cpt"; }
                else if (s > 5000) { rank = "Lieutenant"; rankAbbr = "Lt"; }
                else if (s > 1000) { rank = "Sergeant"; rankAbbr = "Sgt"; }
            }
        }
    } catch (e) {
        console.error("Sig Fetch Error", e);
    }

    return new ImageResponse(
        (
            <div
                style={{
                    width: '500px',
                    height: '120px',
                    background: '#0F172A', // Slate-900
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 20px',
                    borderLeft: '4px solid #F97316', // Orange Accent
                    fontFamily: 'sans-serif',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Background Texture */}
                <div style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    width: '100px',
                    height: '200px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    transform: 'rotate(20deg)',
                }} />

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '12px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        BF1942.ONLINE
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '300px', textOverflow: 'ellipsis' }}>
                        {rankAbbr}. {playerName}
                    </div>
                    <div style={{ fontSize: '14px', color: '#F97316', marginTop: '4px' }}>
                        {rank}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', zIndex: 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span style={{ fontSize: '10px', color: '#94A3B8' }}>SCORE</span>
                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{score}</span>
                    </div>
                    <div style={{ width: '1px', height: '30px', background: '#334155' }}></div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span style={{ fontSize: '10px', color: '#94A3B8' }}>K/D RATIO</span>
                        <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#F97316' }}>{kdr}</span>
                    </div>
                </div>
            </div>
        ),
        {
            width: 500,
            height: 120,
        }
    );
}
