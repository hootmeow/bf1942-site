import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { AppShell } from "@/components/app-shell";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// --- MODIFIED METADATA ---
export const metadata: Metadata = {
  // Set your canonical URL base
  metadataBase: new URL("https://www.bf1942.online"), // <-- REPLACE with your real domain

  title: {
    default: "BF1942 Command Center | Live Stats & Server Browser",
    template: "%s | BF1942 Command Center",
  },
  description: "A central hub for the Battlefield 1942 community. Live server browser, player statistics, mod database, and installation guides.",
  
  // Add default Open Graph (social sharing) tags
  openGraph: {
    title: "BF1942 Command Center | Live Stats & Server Browser",
    description: "A central hub for the Battlefield 1942 community.",
    url: "https://www.bf1942.online", // <-- REPLACE with your real domain
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}