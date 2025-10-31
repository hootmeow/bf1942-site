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
} from "lucide-react"

// A helper component to make code blocks look nice
const CodeBlock = ({ children }: { children: React.ReactNode }) => {
  return (
    <pre className="mt-2 overflow-x-auto rounded-md bg-slate-900 p-4 font-mono text-sm text-slate-100">
      <code>{children}</code>
    </pre>
  )
}

// A helper component to avoid duplicating the Origin/CD steps
const OriginAndCdSteps = () => (
  <>
    {/* --- STEP 3: MASTER SERVER PATCH --- */}
    <h3 className="mb-4 mt-12 text-2xl font-semibold tracking-tight">
      Step 3: How to Play Online (Essential Fix)
    </h3>
    <Alert className="mb-8 border-yellow-500 text-yellow-700">
      <Wrench className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="text-yellow-700">
        Your server list will be EMPTY without this fix.
      </AlertTitle>
      <AlertDescription>
        The original "GameSpy" master server was shut down in 2014. The
        community created a new one to replace it.
        <ol className="mt-2 list-inside list-decimal space-y-1">
          <li>
            Download the <strong>Community Master Server Patch</strong>
            .
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
        <Button asChild className="mt-4">
          <a
            href="[LINK_TO_MASTER_SERVER_PATCH]"
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
    <h3 className="mb-4 mt-12 text-2xl font-semibold tracking-tight">
      Step 4: How to Set Widescreen Resolution
    </h3>
    <p className="mb-4 text-muted-foreground">
      The in-game options are broken and don't show modern
      resolutions. You must edit a config file manually.
    </p>
    <ol className="mb-4 list-inside list-decimal space-y-2">
      <li>
        Navigate to your profile's settings folder. The path is:
        <CodeBlock>
          Documents\Battlefield 1942\Mods\bf1942\Settings\Profiles\Custom
        </CodeBlock>
      </li>
      <li>
        Open the file{" "}
        <code className="rounded bg-slate-200 px-1 py-0.5">
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

export default function GuidePage() {
  return (
    <div className="container mx-auto max-w-4xl py-12">
      <h1 className="mb-4 text-4xl font-bold tracking-tight">
        Battlefield 1942 Installation Guide (2025)
      </h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Welcome! Getting a 20+ year-old game to run on a modern PC
        requires a few extra steps. This guide will get you from
        installation to playing online in minutes.
      </p>

      {/* --- SECTION 1: DIRECTPLAY (DARK MODE FIX) --- */}
      <h2 className="mb-4 text-3xl font-semibold tracking-tight">
        Section 1: Critical First Step (Do This Now)
      </h2>
      <Alert className="mb-8 border-red-500 bg-red-50 dark:border-red-700 dark:bg-red-950">
        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
        <AlertTitle className="font-bold text-red-700 dark:text-red-300">
          You MUST Enable DirectPlay
        </AlertTitle>
        <AlertDescription className="text-red-700 dark:text-red-400/90">
          Battlefield 1942 will not launch on modern Windows without
          this.
          <ol className="mt-2 list-inside list-decimal space-y-1">
            <li>
              Press <strong>Windows Key + R</strong> to open "Run".
            </li>
            <li>
              Type{" "}
              <code className="rounded bg-red-200 px-1 py-0.5 font-medium text-red-900 dark:bg-red-800 dark:text-red-100">
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
        </AlertDescription>
      </Alert>

      {/* --- SECTION 2: INSTALLATION --- */}
      <h2 className="mb-4 text-3xl font-semibold tracking-tight">
        Section 2: How to Install Battlefield 1942
      </h2>
      <p className="mb-4 text-muted-foreground">
        Choose the installation method that matches what you have. We
        highly recommend the "Community Repack" for the simplest
        experience.
      </p>
      <Tabs defaultValue="repack" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="repack">
            Easiest Way (Community Repack)
          </TabsTrigger>
          <TabsTrigger value="origin">Origin / EA App Version</TabsTrigger>
          <TabsTrigger value="cd">Original CD Version</TabsTrigger>
        </TabsList>

        {/* --- REPACK TAB (MOONGAMERS CREDIT) --- */}
        <TabsContent value="repack" className="mt-4">
          <p className="mb-4">
            These all-in-one installers,{" "}
            <strong>created by the Moongamers community</strong>, are
            pre-patched, include both expansions, and have widescreen
            and online fixes built-in. Just install and play.
          </p>

          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>How to determine your GPU</AlertTitle>
            <AlertDescription>
              <ol className="mt-2 list-inside list-decimal space-y-1">
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

          {/* --- CARD GRID WITH ALIGNMENT FIX --- */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Vulkan (Modern GPUs)</CardTitle>
                <CardDescription>
                  For modern AMD or Nvidia cards (e.g., RX 580 / GTX
                  1080 or newer).
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button asChild className="w-full">
                  <a
                    href="https://drive.proton.me/urls/FH233HV5GC#0V0x9I62PWsj"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="mr-2 h-4 w-4" /> Download
                    Vulkan Installer
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>dgVoodoo (Older / Integrated GPUs)</CardTitle>
                <CardDescription>
                  For older GPUs or integrated Intel graphics.
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
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
                    <Download className="mr-2 h-4 w-4" /> Download
                    dgVoodoo Installer
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* --- ORIGIN TAB --- */}
        <TabsContent value="origin" className="mt-4">
          <p className="mb-2">
            If you claimed BF1942 for free on Origin (now the EA App)
            years ago, you can still install it. This requires manual
            patching.
          </p>
          <ol className="list-inside list-decimal space-y-2">
            <li>
              Install the game via the <strong>EA App</strong>.
            </li>
            <li>
              The game is installed to v1.61b, so you do{" "}
              <strong>not</strong> need the official patches.
            </li>
          </ol>
          {/* Steps 3 and 4 are injected here */}
          <OriginAndCdSteps />
        </TabsContent>

        {/* --- CD TAB --- */}
        <TabsContent value="cd" className="mt-4">
          <p className="mb-2">
            For those with the original 2002-era discs. This method
            requires the most steps.
          </p>
          <ol className="list-inside list-decimal space-y-2">
            <li>
              Install Battlefield 1942 from your CD. (Step 1)
            </li>
            <li>
              Install the <strong>Road to Rome</strong> &{" "}
              <strong>Secret Weapons of WWII</strong> expansions (if
              you have them).
            </li>
            <li>
              Download and install the{" "}
              <strong>Official 1.61b Patch</strong>. This is Step 2.
            </li>
          </ol>
          <Button asChild className="mt-4">
            <a
              href="[LINK_TO_1.61B_PATCH]"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="mr-2 h-4 w-4" /> Download 1.61b Patch
            </a>
          </Button>

          {/* Steps 3 and 4 are injected here */}
          <OriginAndCdSteps />
        </TabsContent>
      </Tabs>

      {/* --- SECTION 3: TROUBLESHOOTING --- */}
      <h2 className="mb-4 mt-12 text-3xl font-semibold tracking-tight">
        Section 3: Common Issues & Troubleshooting
      </h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            I clicked "Update" but my server list is still empty!
          </AccordionTrigger>
          <AccordionContent>
            This means you used the Origin or CD method and did not
            install the Master Server Patch from Step 3, or your
            firewall is blocking the game. Try re-running the patch
            installer as an administrator. Make sure `BF1942.exe` is
            allowed through your firewall.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            My game crashes right after I launch it.
          </AccordionTrigger>
          <AccordionContent>
            99% of the time, this is because you did not enable{" "}
            <strong>DirectPlay</strong>. Please go back to Section 1
            and follow those steps. If you have, try running
            `BF1942.exe` in Compatibility Mode for "Windows XP (Service
            Pack 3)" and check "Run as administrator".
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            I get an error about "MSVCR70.dll was not found".
          </AccordionTrigger>
          <AccordionContent>
            This is a missing (and very old) Microsoft C++ runtime
            file. You can fix this by downloading and installing the
            "Microsoft Visual C++ 2010 Redistributable Package".
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>
            My mouse is lagging or feels weird in the menus.
          </AccordionTrigger>
          <AccordionContent>
            This is a common issue. A tool like{" "}
            <strong>Borderless1942</strong> can help, as it forces the
            game into a modern borderless window which can fix mouse
            and alt-tabbing issues.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* --- DISCLAIMER (DIVIDER REMOVED) --- */}
      <div className="mt-16">
        <Alert>
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Disclaimer</AlertTitle>
          <AlertDescription>
            The files linked on this page are not hosted by
            bf1942.online. They are created and maintained by
            community members. This site and its operators take no
            responsibility or liability for these files or their use.
            Download and install at your own risk.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}