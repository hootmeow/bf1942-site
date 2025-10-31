import Link from "next/link";
import { AlertTriangle, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function GuidePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Installation Guide</h1>
        <p className="mt-1 text-muted-foreground">
          Get back on the battlefield. For the best experience, we recommend the installers created by MoonGamers.
        </p>
      </div>

      {/* Section 1: Full Game Install */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-base font-semibold text-primary">
              1
            </span>
            Full Game Install (For New Players)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Installers Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-lg">For Modern GPUs</CardTitle>
                <CardDescription>
                  Use this installer if your PC has a modern AMD or Nvidia card (e.g., RX 580 / GTX 1080 or newer).
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild>
                  <Link href="https://drive.proton.me/urls/FH233HV5GC#0V0x9I62PWsj" target="_blank" rel="noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Download (Vulkan)
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-lg">For Older / Integrated GPUs</CardTitle>
                <CardDescription>
                  Use this installer if your PC has an older GPU or an integrated Intel GPU.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild>
                  <Link href="https://drive.proton.me/urls/F4T3E0T9DM#HfYNhn7JGBwG" target="_blank" rel="noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Download (dgVoodoo)
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* How-to box */}
          <div className="rounded-lg border border-border/60 bg-card/40 p-4">
            <h3 className="font-semibold text-foreground">How to determine your GPU:</h3>
            <ol className="list-decimal pl-5 pt-2 text-sm text-muted-foreground">
              <li>In the Start Menu, type "Device Manager" and open it.</li>
              <li>Expand the "Display Adapters" section.</li>
              <li>
                If you see AMD or Nvidia, use the <strong>Vulkan</strong> installer. If you only see Intel, use the{" "}
                <strong>dgVoodoo</strong> installer.
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Master Server Patch */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-base font-semibold text-primary">
              2
            </span>
            Master Server Patch (For Existing Installs)
          </CardTitle>
          <CardDescription className="pt-2">
            If you already have the game installed, this patch is required to see servers in the in-game server browser.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild>
            <Link href="https://drive.proton.me/urls/717J9Q83FM#tfLbp587W5nl" target="_blank" rel="noreferrer">
              <Download className="mr-2 h-4 w-4" />
              Download Master Server Patch
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Section 3: Add-ons */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-base font-semibold text-secondary-foreground">
              3
            </span>
            Community Fixes & Add-ons (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {/* Expansions */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-lg">Expansions Only</CardTitle>
              <CardDescription>
                If you have the base game and only need the expansions, download this. Extract the .zip and copy the
                `Mods` folder to your BF1942 install location.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild variant="outline">
                <Link href="https://drive.proton.me/urls/9AESD4BGHM#QriuaVVN2SCQ" target="_blank" rel="noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Download Expansions
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* No Siren Fix */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-lg">Battle of Britain - No Siren Fix</CardTitle>
              <CardDescription>
                This patch removes the continuous air raid siren sound. Extract the `.rfa` file and place it in your
                `.../mods/bf1942/archives/bf1942/levels` directory.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild variant="outline">
                <Link href="https://drive.proton.me/urls/79Y6GYNQK4#ZUrVGBa1O9Cj" target="_blank" rel="noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Download No Siren Patch
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="flex items-start gap-4 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
        <AlertTriangle className="h-5 w-5 flex-shrink-0" />
        <div>
          <h3 className="font-semibold">Disclaimer</h3>
          <p className="text-destructive/90">
            The files linked on this page are not hosted by bf1942.online. They are created and maintained by community
            members. This site and its operators take no responsibility or liability for these files or their use.
            Download and install at your own risk.
          </p>
        </div>
      </div>
    </div>
  );
}