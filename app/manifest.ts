import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BF1942 Online",
    short_name: "BF1942",
    description: "Battlefield 1942 community hub — live servers, player stats, leaderboards, wiki, and mods.",
    start_url: "/",
    display: "standalone",
    background_color: "#060a04",
    theme_color: "#060a04",
    orientation: "portrait-primary",
    categories: ["games", "sports"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        // Generated on-brand by app/apple-icon.tsx
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
      {
        // Generated on-brand by app/icon.tsx
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
