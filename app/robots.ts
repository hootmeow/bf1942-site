// Create new file: app/robots.ts
import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  // SET YOUR REAL DOMAIN HERE
  const siteUrl = 'https://www.bf1942.online'; 

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/', // Block your API routes
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}