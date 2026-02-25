# Open Graph Images Guide

## Current State

Most pages have basic metadata set. To improve social sharing previews:

## Recommended Improvements

### 1. Player Profile OG Images
Create dynamic OG images at `/player/[slug]/opengraph-image.tsx`:
```typescript
// Shows player name, rank, RP score, K/D ratio
// Uses @vercel/og or similar for image generation
```

### 2. Wiki Pages
Add static or semi-dynamic OG images for:
- Individual maps (show map thumbnail + name)
- Wiki categories (show category icon + title)

### 3. Server Pages
Dynamic images showing:
- Server name
- Current player count
- Current map

### 4. Events
Event detail pages with:
- Event title
- Date/time
- Participant count

## Implementation Pattern

```typescript
// Example: app/player/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export default async function Image({ params }: { params: { slug: string } }) {
  // Fetch player data
  // Generate image with stats overlay
  return new ImageResponse(
    (
      <div style={{...}}>
        {/* Player stats, rank badge, etc */}
      </div>
    ),
    { ...size }
  );
}
```

## Priority Order

1. **High:** Player profiles (most shared)
2. **Medium:** Wiki articles, maps
3. **Low:** Events, organizations

## Current Images

- Home: `/images/og-image.png` (generic)
- About: Inherits from home
- Most pages: Default site preview

## Tools

- `@vercel/og` - Recommended for dynamic image generation
- `sharp` - For image processing
- Tailwind-like syntax in ImageResponse
