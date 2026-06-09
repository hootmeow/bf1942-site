import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

// Apple touch icon — solid (non-transparent) on-brand monogram.
export default function AppleIcon() {
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
                    fontSize: 88,
                    fontWeight: 800,
                    letterSpacing: '-5px',
                    fontFamily: 'sans-serif',
                }}
            >
                BF
            </div>
        ),
        { ...size }
    );
}
