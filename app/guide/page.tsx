import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  {
    step: 1,
    title: "Download the Latest Installer",
    detail: "Grab the verified Battlefield 1942 ISO or Origin build from the official EA archive.",
  },
  {
    step: 2,
    title: "Apply Community Patch",
    detail: "Install the BF1942 1.61b community patch to restore server browser functionality and widescreen support.",
  },
  {
    step: 3,
    title: "Install PunkBuster Replacement",
    detail: "Use the BF1942Hub anti-cheat service to ensure compatibility with modern ranked servers.",
  },
  {
    step: 4,
    title: "Configure Video & Network",
    detail: "Set your resolution, enable 60 FPS cap, and configure port forwarding (UDP 14567) for hosting.",
  },
  {
    step: 5,
    title: "Sync Mods with Command Center",
    detail: "Use the built-in mod manager to download, verify, and activate your preferred experiences.",
  },
];

export default function GuidePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Installation Guide</h1>
        <p className="mt-1 text-muted-foreground">
          Follow these steps to deploy Battlefield 1942 with modern compatibility enhancements.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {steps.map((step) => (
          <Card key={step.step} className="border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-base font-semibold text-primary">
                  {step.step}
                </span>
                {step.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm leading-6 text-muted-foreground">{step.detail}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
