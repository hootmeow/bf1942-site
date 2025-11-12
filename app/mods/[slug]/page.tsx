import type { Metadata } from "next";
import { ModData } from "@/lib/types";
import ModDetailPageClient from "./mod-page-client"; // Import the new client component

// This is the server-side metadata function
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  
  if (!params.slug) {
    return { title: "Mod Not Found | BF1942 Online" };
  }

  try {
    // We can use a dynamic import on the server
    const modModule = await import(`@/content/mods/${params.slug}`);
    const mod: ModData = modModule.default;

    return {
      title: `${mod.name} Mod | BF1942 Online`,
      description: mod.description,
      openGraph: {
        title: mod.name,
        description: mod.description,
      },
    };
  } catch (e) {
    return {
      title: "Mod Not Found | BF1942 Online",
      description: "Details for this mod could not be found.",
    };
  }
}

// This is the default export for the page
export default function ModDetailPage() {
  // This is now a Server Component. It just renders the client part.
  return <ModDetailPageClient />;
}