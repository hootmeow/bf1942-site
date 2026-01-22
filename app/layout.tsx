import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { AppShell } from "@/components/app-shell";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// --- MODIFIED METADATA ---
export const metadata: Metadata = {
  // Set your canonical URL base
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.bf1942.online"),

  title: {
    default: "BF1942 Command Center | Live Stats & Server Browser",
    template: "%s | BF1942 Command Center",
  },
  description: "A central hub for the Battlefield 1942 community. Live server browser, player statistics, mod database, and installation guides.",

  // Add default Open Graph (social sharing) tags
  openGraph: {
    title: "BF1942 Command Center | Live Stats & Server Browser",
    description: "A central hub for the Battlefield 1942 community.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.bf1942.online",
    siteName: "BF1942 Command Center",
    images: [
      {
        url: "/images/og-image.png", // <-- You should create this image (1200x630)
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Add default Twitter Card tags
  twitter: {
    card: "summary_large_image",
    title: "BF1942 Command Center | Live Stats & Server Browser",
    description: "A central hub for the Battlefield 1942 community.",
    images: ["/images/og-image.png"], // <-- This should be the same image
  },
};
// --- END MODIFIED METADATA ---

import { auth } from "@/lib/auth"; // Import auth

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
              "name": "BF1942 Command Center",
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
        <ThemeProvider>
          <AppShell user={session?.user}>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}