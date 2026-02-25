import type { Metadata } from "next";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  AlertTriangle,
  Download,
  Info,
  ShieldAlert,
  Wrench,
  Gamepad2,
  CheckCircle,
  Monitor,
  HelpCircle,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Installation Guide — How to Install Battlefield 1942",
  description: "Step-by-step guide to installing Battlefield 1942 on modern Windows PCs in 2026. Covers download, patching, widescreen fixes, and getting online.",
};

const CodeBlock = ({ children }: { children: React.ReactNode }) => {
  return (
    <pre className="mt-2 overflow-x-auto rounded-md bg-slate-900 p-4 font-mono text-sm text-slate-100">
      <code>{children}</code>
    </pre>
  )
}

const OriginAndCdSteps = () => (
  <>
    {/* --- STEP 3: MASTER SERVER PATCH --- */}
    <h3 className="mb-4 mt-12 text-2xl font-semibold tracking-tight flex items-center gap-2">
      <Wrench className="h-6 w-6 text-amber-500" />
      Step 3: How to Play Online (Essential Fix)
    </h3>
    <Alert className="mb-8 border-amber-500/50 bg-amber-500/5">
      <Wrench className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-700 dark:text-amber-400">
        Your server list will be EMPTY without this fix.
      </AlertTitle>
      <AlertDescription className="text-amber-700/90 dark:text-amber-400/90">
        The original "GameSpy" master server was shut down in 2014. The
        community created a new one to replace it.
        <ol className="mt-3 list-inside list-decimal space-y-2">
          <li>
            Download the <strong>Community Master Server Patch</strong>.
          </li>
          <li>
            Run the installer. It will automatically find your BF1942
            installation.
          </li>
          <li>
            That's it! Launch the game, go to "Multiplayer," and
            click "Update" to see all the active servers.
          </li>
        </ol>
        <Button asChild className="mt-4 shadow-lg shadow-primary/20">
          <a
            href="https://files.bf1942.online/game/bf1942_master_server_patch.zip"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download className="mr-2 h-4 w-4" /> Download Master
            Server Patch
          </a>
        </Button>
      </AlertDescription>
    </Alert>

    {/* --- STEP 4: WIDESCREEN FIX --- */}
    <h3 className="mb-4 mt-12 text-2xl font-semibold tracking-tight flex items-center gap-2">
      <Monitor className="h-6 w-6 text-blue-500" />
      Step 4: How to Set Widescreen Resolution
    </h3>
    <p className="mb-4 text-muted-foreground">
      The in-game options are broken and don't show modern
      resolutions. You must edit a config file manually.
    </p>
    <ol className="mb-4 list-inside list-decimal space-y-3">
      <li>
        Navigate to your profile's settings folder. The path is:
        <CodeBlock>
          Documents\Battlefield 1942\Mods\bf1942\Settings\Profiles\Custom
        </CodeBlock>
      </li>
      <li>
        Open the file{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
          Video.con
        </code>{" "}
        with Notepad.
      </li>
      <li>
        Find the following line and change the numbers to your
        monitor's resolution. For example, 1920x1080 at 60Hz:
        <CodeBlock>
          game.setGameDisplayMode 1920 1080 32 60
        </CodeBlock>
      </li>
      <li>Save the file. Your game will now run in widescreen.</li>
    </ol>
  </>
)

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Install Battlefield 1942 on a Modern PC (2026)",
  "description": "A complete guide to install Battlefield 1942, get online with the community master server patch, and apply widescreen fixes.",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Enable DirectPlay",
      "text": "Open 'OptionalFeatures.exe', find 'Legacy Components', and check the box for 'DirectPlay'. This is required for the game to launch on modern Windows.",
      "url": "https://www.bf1942.online/guide/installation#step-1"
    },
    {
      "@type": "HowToStep",
      "name": "Install Battlefield 1942",
      "text": "Install the game using the recommended Community Repack, the Origin/EA App version, or the original CD version.",
      "url": "https://www.bf1942.online/guide/installation#step-2"
    },
    {
      "@type": "HowToStep",
      "name": "Install Master Server Patch",
      "text": "Download and run the Community Master Server Patch. This is essential to see servers in the multiplayer list, as the original GameSpy server is offline.",
      "url": "https://www.bf1942.online/guide/installation#step-3"
    },
    {
      "@type": "HowToStep",
      "name": "Apply Widescreen Fix",
      "text": "Manually edit the 'Video.con' file in your Documents folder to set your monitor's modern resolution, such as 'game.setGameDisplayMode 1920 1080 32 60'.",
      "url": "https://www.bf1942.online/guide/installation#step-4"
    }
  ]
};

export default function GuidePage() {
  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl">
        {/* Background blur orbs */}
        <div className="pointer-events-none absolute -top-12 right-0 h-48 w-48 rounded-full bg-primary/10 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-12 left-0 h-40 w-40 rounded-full bg-blue-500/10 blur-[70px]" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-in-up">
            <div className="rounded-xl bg-primary/20 p-3">
              <Gamepad2 className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Installation Guide
                </h1>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                  2026
                </Badge>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Get a 20+ year-old classic running on modern Windows. From installation to playing online in minutes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 1: DIRECTPLAY --- */}
      <Card className="border-red-500/50 bg-red-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
            <AlertTriangle className="h-5 w-5" />
            Critical First Step (Do This Now)
          </CardTitle>
          <CardDescription className="text-red-700/80 dark:text-red-400/80">
            You MUST Enable DirectPlay — Battlefield 1942 will not launch on modern Windows without this.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-inside list-decimal space-y-2 text-sm">
            <li>
              Press <strong>Windows Key + R</strong> to open "Run".
            </li>
            <li>
              Type{" "}
              <code className="rounded bg-red-200 px-1.5 py-0.5 font-mono text-xs text-red-900 dark:bg-red-800 dark:text-red-100">
                OptionalFeatures.exe
              </code>{" "}
              and press Enter.
            </li>
            <li>
              Find and expand the <strong>"Legacy Components"</strong>{" "}
              folder.
            </li>
            <li>
              Check the box for <strong>"DirectPlay"</strong> and
              click OK. Windows will install it for you.
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* --- SECTION 2: INSTALLATION --- */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Download className="h-6 w-6 text-primary" />
            How to Install Battlefield 1942
          </h2>
          <p className="text-muted-foreground mt-1">
            Choose the installation method that matches what you have. We highly recommend the "Community Repack" for the simplest experience.
          </p>
        </div>

        <Tabs defaultValue="repack" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="repack" className="data-[state=active]:bg-primary/15">
              Community Repack (Easiest)
            </TabsTrigger>
            <TabsTrigger value="origin" className="data-[state=active]:bg-primary/15">
              Origin / EA App
            </TabsTrigger>
            <TabsTrigger value="cd" className="data-[state=active]:bg-primary/15">
              Original CDs
            </TabsTrigger>
          </TabsList>

          {/* --- REPACK TAB --- */}
          <TabsContent value="repack" className="mt-6 space-y-6">
            <Alert className="border-primary/30 bg-primary/5">
              <CheckCircle className="h-4 w-4 text-primary" />
              <AlertTitle>Recommended Method</AlertTitle>
              <AlertDescription>
                These all-in-one installers are <strong>pre-patched</strong>, include both expansions,
                and have widescreen and online fixes built-in. Just install and play.
              </AlertDescription>
            </Alert>

            <div>
              <h3 className="text-lg font-semibold mb-3">MoonGamers Community Installers (Preferred)</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Created by the <strong>MoonGamers community</strong>, these are the most complete and tested installers.
              </p>

              <Alert className="mb-4 border-blue-500/30 bg-blue-500/5">
                <Info className="h-4 w-4 text-blue-500" />
                <AlertTitle className="text-blue-700 dark:text-blue-400">How to determine your GPU</AlertTitle>
                <AlertDescription className="text-blue-700/90 dark:text-blue-400/90">
                  <ol className="mt-2 list-inside list-decimal space-y-1 text-sm">
                    <li>
                      In the Start Menu, type <strong>"Device Manager"</strong>{" "}
                      and open it.
                    </li>
                    <li>
                      Expand the <strong>"Display Adapters"</strong> section.
                    </li>
                    <li>
                      If you see <strong>AMD</strong> or <strong>Nvidia</strong>
                      , use the <strong>Vulkan</strong> installer.
                    </li>
                    <li>
                      If you <em>only</em> see <strong>Intel</strong>, use the{" "}
                      <strong>dgVoodoo</strong> installer.
                    </li>
                  </ol>
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card className="border-border/60 bg-card/40 card-hover">
                  <CardHeader>
                    <CardTitle className="text-lg">Vulkan (Modern GPUs)</CardTitle>
                    <CardDescription>
                      For modern AMD or Nvidia cards (e.g., RX 580 / GTX 1080 or newer).
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full shadow-lg shadow-primary/20">
                      <a
                        href="https://drive.proton.me/urls/FH233HV5GC#0V0x9I62PWsj"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="mr-2 h-4 w-4" /> Download Vulkan Installer
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-border/60 bg-card/40 card-hover">
                  <CardHeader>
                    <CardTitle className="text-lg">dgVoodoo (Older / Integrated)</CardTitle>
                    <CardDescription>
                      For older GPUs or integrated Intel graphics.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      asChild
                      variant="secondary"
                      className="w-full"
                    >
                      <a
                        href="https://drive.proton.me/urls/F4T3E0T9DM#HfYNhn7JGBwG"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="mr-2 h-4 w-4" /> Download dgVoodoo Installer
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="pt-4 border-t border-border/40">
              <h3 className="text-lg font-semibold mb-3">Alternative: Team Simple Installer</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Another solid community-maintained option. We recommend the MoonGamers installers above if you want
                the latest community fixes, but this one works great too.
              </p>
              <Button asChild variant="outline">
                <a
                  href="https://team-simple.org/download/Battlefield_1942_WWII_Anthology.zip"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="mr-2 h-4 w-4" /> Download Team Simple Installer
                </a>
              </Button>
            </div>
          </TabsContent>

          {/* --- ORIGIN TAB --- */}
          <TabsContent value="origin" className="mt-6 space-y-6">
            <p className="text-sm text-muted-foreground">
              If you claimed BF1942 for free on Origin (now the EA App) years ago,
              you can still install it. This requires manual patching.
            </p>
            <ol className="list-inside list-decimal space-y-3 text-sm">
              <li>
                Install the game via the <strong>EA App</strong>.
              </li>
              <li>
                The game is installed to v1.61b, so you do{" "}
                <strong>not</strong> need the official patches.
              </li>
            </ol>
            <OriginAndCdSteps />
          </TabsContent>

          {/* --- CD TAB --- */}
          <TabsContent value="cd" className="mt-6 space-y-6">
            <p className="text-sm text-muted-foreground">
              For those with the original 2002-era discs. This method requires the most steps.
            </p>
            <ol className="list-inside list-decimal space-y-3 text-sm">
              <li>
                Install Battlefield 1942 from your CD.
              </li>
              <li>
                Install the <strong>Road to Rome</strong> &{" "}
                <strong>Secret Weapons of WWII</strong> expansions (if you have them).
              </li>
              <li>
                Download and install the <strong>Official 1.61b Patch</strong>.
              </li>
            </ol>
            <Button asChild className="shadow-lg shadow-primary/20">
              <a
                href="https://files.bf1942.online/game/bf1942_v1.6_to_v1.61b.zip"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="mr-2 h-4 w-4" /> Download 1.61b Patch
              </a>
            </Button>

            <OriginAndCdSteps />
          </TabsContent>
        </Tabs>
      </div>

      {/* --- SECTION 3: TROUBLESHOOTING --- */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-primary" />
            Common Issues & Troubleshooting
          </h2>
          <p className="text-muted-foreground mt-1">
            Solutions to the most frequently encountered problems.
          </p>
        </div>

        <Card className="border-border/60 bg-card/40">
          <CardContent className="p-0">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-border/40">
                <AccordionTrigger className="px-6 hover:no-underline hover:bg-muted/30">
                  I clicked "Update" but my server list is still empty!
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-sm text-muted-foreground">
                  This means you used the Origin or CD method and did not
                  install the Master Server Patch from Step 3, or your
                  firewall is blocking the game. Try re-running the patch
                  installer as an administrator. Make sure <code className="bg-muted px-1 py-0.5 rounded text-xs">BF1942.exe</code> is
                  allowed through your firewall.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-border/40">
                <AccordionTrigger className="px-6 hover:no-underline hover:bg-muted/30">
                  My game crashes right after I launch it.
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-sm text-muted-foreground">
                  99% of the time, this is because you did not enable{" "}
                  <strong>DirectPlay</strong>. Please go back to Section 1
                  and follow those steps. If you have, try running
                  <code className="bg-muted px-1 py-0.5 rounded text-xs mx-1">BF1942.exe</code> in Compatibility Mode for "Windows XP (Service
                  Pack 3)" and check "Run as administrator".
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-border/40">
                <AccordionTrigger className="px-6 hover:no-underline hover:bg-muted/30">
                  I get an error about "MSVCR70.dll was not found".
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-sm text-muted-foreground">
                  This is a missing (and very old) Microsoft C++ runtime
                  file. You can fix this by downloading and installing the
                  "Microsoft Visual C++ 2010 Redistributable Package" from Microsoft's official website.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="border-b-0">
                <AccordionTrigger className="px-6 hover:no-underline hover:bg-muted/30">
                  My mouse is lagging or feels weird in the menus.
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-sm text-muted-foreground">
                  This is a common issue. A tool like{" "}
                  <strong>Borderless1942</strong> can help, as it forces the
                  game into a modern borderless window which can fix mouse
                  and alt-tabbing issues.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* --- DISCLAIMER --- */}
      <Card className="border-border/60 bg-muted/30">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <ShieldAlert className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">Disclaimer</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The files linked on this page are not hosted by bf1942.online.
                They are created and maintained by community members. This site
                and its operators take no responsibility or liability for these
                files or their use. Download and install at your own risk.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
