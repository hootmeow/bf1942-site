import type { Metadata } from "next";
import { ModMapData } from "@/lib/types";
import MapDetailPageClient from "./map-page-client"; // Import the new client component

// This is the server-side metadata function
export async function generateMetadata(
  { params }: { params: { slug: string, mapSlug: string } }
): Promise<Metadata> {
  
  if (!params.slug || !params.mapSlug) {
    return { title: "Map Not Found" };
  }

  try {
    // --- THIS IS THE FIX ---
    // We add .tsx to the path for the SERVER-SIDE import
    const mapModule = await import(`@/content/maps/${params.slug}/${params.mapSlug}.tsx`);
    // --- END FIX ---

    const map: ModMapData = mapModule.default;

    return {
      title: `${map.name} - ${params.slug}`,
      description: map.description,
      openGraph: {
        title: map.name,
        description: map.description,
        images: map.galleryImages ? [map.galleryImages[0]] : [],
      },
    };
  } catch (e) {
    console.error("Metadata error:", e); // Added for debugging
    return {
      title: "Map Not Found",
      description: "Details for this map could not be found.",
    };
  }
}

// This is the default export for the page
export default function MapDetailPage() {
  return <MapDetailPageClient />;
}