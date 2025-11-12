import type { Metadata } from "next";
import { ModMapData } from "@/lib/types";
import MapDetailPageClient from "./map-page-client"; // Import the new client component

// This is the server-side metadata function
export async function generateMetadata(
  { params }: { params: { slug: string, mapSlug: string } }
): Promise<Metadata> {
  
  if (!params.slug || !params.mapSlug) {
    return { title: "Map Not Found | BF1942 Online" };
  }

  try {
    const mapModule = await import(`@/content/maps/${params.slug}/${params.mapSlug}`);
    const map: ModMapData = mapModule.default;

    return {
      title: `${map.name} - ${params.slug} | BF1942 Online`,
      description: map.description,
      openGraph: {
        title: map.name,
        description: map.description,
        images: map.galleryImages ? [map.galleryImages[0]] : [],
      },
    };
  } catch (e) {
    return {
      title: "Map Not Found | BF1942 Online",
      description: "Details for this map could not be found.",
    };
  }
}

// This is the default export for the page
export default function MapDetailPage() {
  return <MapDetailPageClient />;
}