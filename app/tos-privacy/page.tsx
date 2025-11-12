import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ShieldCheck } from "lucide-react"; // Icons for TOS and Privacy

// New Metadata from your HTML
export const metadata: Metadata = {
  title: "Terms of Service & Privacy Policy | BF1942 Online",
  description: "Read the Terms of Service and Privacy Policy for BF1942 Online.",
};

// Helper component to style the text content
const ProseContent = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-6 space-y-4 text-muted-foreground">
    {children}
  </div>
);

// Helper component for styled <h3> tags
const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xl font-semibold text-foreground">{children}</h3>
);

export default function TosPrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Terms of Service & Privacy Policy
        </h1>
        <p className="mt-2 text-muted-foreground">Last Updated: August 14, 2025</p>
      </div>

      <div className="space-y-12">
        {/* Terms of Service Card */}
        <Card className="border-border/60 bg-card/40">
          <CardHeader>
            <div className="flex items-center gap-4">
              {/* --- UPDATED: Changed icon color to text-primary --- */}
              <div className="flex-shrink-0 text-primary">
                <FileText className="h-8 w-8" />
              </div>
              <CardTitle className="text-3xl font-semibold">Terms of Service</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ProseContent>
              <p>
                By accessing or using BF1942 Online (the "Site"), you agree to be bound by these Terms of
                Service ("Terms"). If you do not agree to these Terms, you may not use the Site.
              </p>
              <H3>Description of Service</H3>
              <p>
                The Site provides statistics and information related to the video game Battlefield 1942.
                All data is captured from publicly broadcast game servers. The service is provided on an
                "as is" and "as available" basis, and we do not guarantee its accuracy, completeness, or
                timeliness.
              </p>
              <H3>User Conduct</H3>
              <p>
                You agree not to use the Site in any way that is unlawful, or that could harm, disable,
                overburden, or impair the Site. Prohibited activities include, but are not limited to:
                data scraping, attempting to gain unauthorized access, and transmitting any malicious
                code.
              </p>
              <H3>Intellectual Property</H3>
              <p>
                The design, branding, and original content of this Site are the property of BF1942
                Online. Battlefield 1942 and all associated trademarks and assets are the property of
                their respective owners. This is an unofficial fan site and is not affiliated with EA or
                DICE.
              </p>
              <H3>Third-Party Links</H3>
              <p>
                The Site may contain links to third-party websites or services (such as game installers or
                mods) that are not owned or controlled by us. We are not responsible for the content or
                practices of any third-party sites.
              </p>
            </ProseContent>
          </CardContent>
        </Card>

        {/* Privacy Policy Card */}
        <Card className="border-border/60 bg-card/40">
          <CardHeader>
            <div className="flex items-center gap-4">
              {/* --- UPDATED: Changed icon color to text-primary --- */}
              <div className="flex-shrink-0 text-primary">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <CardTitle className="text-3xl font-semibold">Privacy Policy</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ProseContent>
              <H3>Information We Collect</H3>
              <p>
                We do not require user registration or collect personally identifiable information, with
                the exception of data that is publicly broadcast by game servers.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Public Game Data:</strong> Player in-game names (aliases), keyhashes, and performance
                  statistics are collected from public game servers. This is considered public information
                  within the context of the game.
                </li>
                <li>
                  <strong>Anonymous Technical Data:</strong> Our web server and service providers (like Cloudflare)
                  may collect standard, anonymous data, such as IP addresses and browser types, for
                  security, analytics, and performance monitoring.
                </li>
              </ul>
              <H3>Use of Cookies</H3>
              <p>This Site does not use cookies for tracking or advertising purposes.</p>
              <H3>Your Rights (GDPR)</H3>
              <p>
                If you are a resident of the European Economic Area (EEA), you have certain data
                protection rights. If you wish for your public game alias and associated statistics to be
                removed from this Site, please contact us via our official Discord server.
              </p>
              <H3>Children's Privacy (COPPA)</H3>
              <p>
                Our Service does not address anyone under the age of 13. We do not knowingly collect
                personally identifiable information from children under 13. If you are a parent or
                guardian and you are aware that your child has provided us with Personal Information,
                please contact us.
              </p>
            </ProseContent>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}