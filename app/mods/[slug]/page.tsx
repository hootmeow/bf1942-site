import type { Metadata } from "next";
import { ModData } from "@/lib/types";
import ModDetailPageClient from "./mod-page-client"; // Import the new client component

// This is the server-side metadata function
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  
  if (!params.slug) {
    return { title: "Mod Not Found" };
  }

  try {
    // --- THIS IS THE FIX ---
    // We add .tsx to the path for the SERVER-SIDE import
    const modModule = await import(`@/content/mods/${params.slug}.tsx`);
    // --- END FIX ---
    
    const mod: ModData = modModule.default;

    return {
      title: `${mod.name} Mod`,
      description: mod.description,
      openGraph: {
        title: mod.name,
        description: mod.description,
      },
    };
  } catch (e) {
    console.error("Metadata error:", e); // Added for debugging
    return {
      title: "Mod Not Found",
      description: "Details for this mod could not be found.",
    };
  }
}

// This is the default export for the page
export default function ModDetailPage() {
  // This is now a Server Component. It just renders the client part.
  return <ModDetailPageClient />;
}