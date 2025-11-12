"use client";

import Image from "next/image"; // Now uses next/image
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ModData } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Download, Map, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Component name is changed
export default function ModDetailPageClient() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;

  const [mod, setMod] = useState<ModData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    
    const loadModData = async () => {
      try {
        setLoading(true);
        const modData = await import(`@/content/mods/${slug}`);
        setMod(modData.default);
      } catch (e) {
        console.error("Failed to load mod data", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    loadModData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <p>Loading Mod...</p>
      </div>
    );
  }

  if (error || !mod) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Mod Not Found</AlertTitle>
        <AlertDescription>
          This mod could not be found.
          <Button asChild variant="link" className="p-0 pl-2">
            <Link href="/mods">Return to Mods</Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {mod.name}
          </h1>
          <p className="mt-1 text-lg text-muted-foreground">
            {mod.description}
          </p>
        </div>
      </div>
      
      {mod.downloadLinks && mod.downloadLinks.length > 0 && (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Downloads</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-3">
            {mod.downloadLinks.map((link) => (
              <Button asChild key={link.name} variant="outline" className="justify-start">
                <Link href={link.url} target="_blank" rel="noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  {link.name}
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="flex flex-col border-border/60">
        <CardHeader>
          <CardTitle>Mod Details</CardTitle>
          <CardDescription>
            Version: {mod.version}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[500px] overflow-y-auto pr-3 text-muted-foreground">
          {mod.content}
        </CardContent>
      </Card>

      {mod.galleryImages && mod.galleryImages.length > 0 && (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Mod Gallery</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center px-12">
            <Carousel className="w-full max-w-xl" opts={{ loop: true }}>
              <CarouselContent>
                {mod.galleryImages.map((src, index) => (
                  <CarouselItem key={index}>
                    <Image 
                      src={src} 
                      alt={`${mod.name} gallery image ${index + 1}`} 
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
          </CardContent>
        </Card>
      )}

      {mod.maps && mod.maps.length > 0 && (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Maps in {mod.name}</CardTitle>
            <CardDescription>
              Browse all maps included in this mod.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {mod.maps.map((map) => (
              <Link
                key={map.slug}
                href={`/mods/${slug}/${map.slug}`}
                className="flex items-start gap-3 rounded-lg border border-border/60 p-4 transition-colors hover:bg-accent"
              >
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <Map className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{map.name}</h3>
                  <p className="text-sm text-muted-foreground">{map.description}</p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}