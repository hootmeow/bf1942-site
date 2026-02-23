import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { AppShell } from "@/components/app-shell";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// --- VIEWPORT CONFIGURATION ---
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' }
  ],
};

// --- MODIFIED METADATA ---
export const metadata: Metadata = {
  // Set your canonical URL base
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.bf1942.online"),

  title: {
    default: "BF1942 Online | Battlefield 1942 Stats, Servers & Community",
    template: "%s | BF1942 Online",
  },
  description: "The Battlefield 1942 community hub — live server browser, player statistics, leaderboards, game wiki, mods, and installation guides at bf1942.online.",
  keywords: ["Battlefield 1942", "BF1942", "bf1942.online", "BF1942 stats", "BF1942 servers", "Battlefield 1942 server browser", "BF1942 leaderboard", "BF1942 mods"],

  openGraph: {
    title: "BF1942 Online | Battlefield 1942 Stats, Servers & Community",
    description: "The Battlefield 1942 community hub — live server browser, player stats, leaderboards, game wiki, mods, and guides.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.bf1942.online",
    siteName: "BF1942 Online",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "BF1942 Online — Battlefield 1942 Stats & Community Hub",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "BF1942 Online | Battlefield 1942 Stats & Servers",
    description: "The Battlefield 1942 community hub — live servers, player stats, leaderboards, wiki, and mods.",
    images: ["/images/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
  },
};
// --- END MODIFIED METADATA ---

import { auth } from "@/lib/auth"; // Import auth
import { SessionProvider } from "@/components/session-provider";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        {/* --- Umami Analytics --- */}
        <Script
          src="https://analytics.bf1942.online/script.js"
          data-website-id="6dab5e14-3b7c-4d1e-a756-ed4b219fc1ff"
          strategy="afterInteractive"
        />
        {/* --- ADDED: WebSite JSON-LD Schema --- */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "BF1942 Online",
              "url": process.env.NEXT_PUBLIC_SITE_URL || "https://www.bf1942.online",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.bf1942.online"}/search?q={search_term_string}`
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        {/* --- END ADDED SECTION --- */}
        <SessionProvider>
          <ThemeProvider>
            <AppShell user={session?.user}>{children}</AppShell>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}