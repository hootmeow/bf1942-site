import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'BF1942 Command Center';
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
                    background: 'linear-gradient(to bottom right, #0F172A, #1E293B)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '20px'
                    }}
                >
                    {/* Simple SVG Logo Placeholder */}
                    <svg
                        width="80"
                        height="80"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ color: '#F97316' }} // Orange-500
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="22" y1="12" x2="18" y2="12" />
                        <line x1="6" y1="12" x2="2" y2="12" />
                        <line x1="12" y1="6" x2="12" y2="2" />
                        <line x1="12" y1="22" x2="12" y2="18" />
                    </svg>
                </div>
                <h1
                    style={{
                        fontSize: '64px',
                        fontWeight: 'bold',
                        margin: '0',
                        letterSpacing: '-2px'
                    }}
                >
                    BF1942 COMMAND CENTER
                </h1>
                <p
                    style={{
                        fontSize: '32px',
                        color: '#94A3B8', // Slate-400
                        marginTop: '10px'
                    }}
                >
                    Live Stats • Server Browser • Community
                </p>
            </div>
        ),
        {
            ...size,
        }
    );
}
