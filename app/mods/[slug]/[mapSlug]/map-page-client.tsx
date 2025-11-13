"use client";

import Image from "next/image"; // Now uses next/image
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ModMapData } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

// Component name is changed
export default function MapDetailPageClient() {
  const params = useParams();
  
  const modSlug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;
  const mapSlug = Array.isArray(params.mapSlug) ? params.mapSlug.join('/') : params.mapSlug;

  const [map, setMap] = useState<ModMapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!modSlug || !mapSlug) return;
    
    const loadMapData = async () => {
      try {
        setLoading(true);
        // --- THIS IS THE FIX ---
        // We REMOVE .tsx from the path for the CLIENT-SIDE import
        const mapDataModule = await import(`@/content/maps/${modSlug}/${mapSlug}`);
        // --- END FIX ---
        const mapData: ModMapData = mapDataModule.default;
        setMap(mapData);
      } catch (e) {
        console.error("Failed to load map data", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    loadMapData();
  }, [modSlug, mapSlug]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <p>Loading Map...</p>
      </div>
    );
  }
  
  if (error || !map) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Map Not Found</AlertTitle>
        <AlertDescription>
          This map could not be found. (Make sure a file exists at: /content/maps/{modSlug}/{mapSlug}.tsx)
          <Button asChild variant="link" className="p-0 pl-2">
            <Link href={modSlug ? `/mods/${modSlug}` : "/mods"}>Return to Mod</Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Button asChild variant="outline">
        <Link href={`/mods/${modSlug}`}>← Back to {modSlug}</Link>
      </Button>

      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {map.name}
        </h1>
        <p className="mt-1 text-lg text-muted-foreground">
          {map.description}
        </p>
      </div>

      {map.galleryImages && map.galleryImages.length > 0 && (
        <div className="flex items-center justify-center px-12">
          <Carousel
            className="w-full max-w-2xl"
            opts={{ loop: true }}
            // Add the autoplay plugin
            plugins={[
              Autoplay({
                delay: 4000, // 4 seconds per slide
                stopOnInteraction: true,
              }),
            ]}
          >
            <CarouselContent>
              {map.galleryImages.map((src, index) => (
                <CarouselItem key={index}>
                  <Image
                    src={src}
                    alt={`Screenshot of ${map.name} ${index + 1}`}
                    width={1280}
                    height={720}
                    className="aspect-video w-full rounded-lg border border-border/60 object-cover"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}
      
      <Card className="flex flex-col border-border/60">
        <CardHeader>
          <CardTitle>Map Guide & Details</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          {map.content}
        </CardContent>
      </Card>
    </div>
  );
}