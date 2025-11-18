import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // SET YOUR REAL DOMAIN HERE
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bf1942.online';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/', // Block your API routes
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}