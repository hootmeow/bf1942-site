import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

// On-brand app icon: olive "BF" monogram on the dark chrome backdrop.
export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background:
                        'linear-gradient(135deg, #0d1208 0%, #0a0f06 60%, #060a04 100%)',
                    color: '#a3c34d',
                    fontSize: 248,
                    fontWeight: 800,
                    letterSpacing: '-12px',
                    fontFamily: 'sans-serif',
                    borderRadius: 96,
                }}
            >
                BF
            </div>
        ),
        { ...size }
    );
}
