import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Github, AlertTriangle, Terminal, ShieldCheck, Server, Settings } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const metadata: Metadata = {
  title: "Linux BF1942 Server | BF1942 Command Center",
  description: "Automated setup script for running a Battlefield 1942 Dedicated Server on modern 64-bit Linux systems.",
};

// A helper component to make code blocks look nice
const CodeBlock = ({ children }: { children: React.ReactNode }) => {
  return (
    <pre className="mt-2 overflow-x-auto rounded-md bg-slate-900 p-4 font-mono text-sm text-slate-100">
      <code>{children}</code>
    </pre>
  );
};

const distributions = [
  { distro: "Ubuntu 24.04.3 LTS", status: "✅ Tested", notes: "Primary tested platform." },
  { distro: "Ubuntu 22.04 LTS", status: "📝 TODO", notes: "Likely works; may need minor package name adjustments." },
  { distro: "Debian 12 (Bookworm)", status: "📝 TODO", notes: "Uses the same multiarch structure as Ubuntu." },
  { distro: "Fedora", status: "📝 TODO", notes: "Requires converting apt commands to dnf." },
  { distro: "CentOS Stream / RHEL", status: "📝 TODO", notes: "Requires converting apt commands to yum/dnf." },
];

const configVariables = [
  { variable: "BF_USER", default: "bf1942_user", desc: "The system username created to run the server." },
  { variable: "BF_HOME", default: "/home/bf1942_user", desc: "The home directory for the service user." },
  { variable: "BF_ROOT", default: "~/bf1942", desc: "The actual game installation directory." },
  { variable: "SERVER_TAR_URL", default: ".../linux-bf1942-server.tar", desc: "URL to the game server tarball." },
];

// --- UPDATED: HowTo JSON-LD Schema ---
const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Install a BF1942 Linux Server",
  "description": "Automated setup script for running a Battlefield 1942 Dedicated Server on modern 64-bit Linux systems.",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Download the Script",
      "text": "Download the setup script using wget: wget https://raw.githubusercontent.com/hootmeow/bf1942-linux/main/ubuntu/24.0.3_setup.sh",
      "url": "https://www.bf1942.online/tools/linux-server#installation"
    },
    {
      "@type": "HowToStep",
      "name": "Make Executable",
      "text": "Make the script executable: chmod +x 24.0.3_setup.sh",
      "url": "https://www.bf1942.online/tools/linux-server#installation"
    },
    {
      "@type": "HowToStep",
      "name": "Run the Script",
      "text": "Run the script with sudo privileges: sudo ./24.0.3_setup.sh",
      "url": "https://www.bf1942.online/tools/linux-server#installation"
    }
  ]
};
// --- END ADDED SECTION ---

export default function LinuxServerPage() {
  return (
    <div className="space-y-6">
      {/* --- ADDED: Script tag for JSON-LD --- */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      {/* --- END ADDED SECTION --- */}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Battlefield 1942 Linux Dedicated Server
        </h1>
        <p className="mt-1 text-muted-foreground">
          Linux (Non-Privileged Runtime)
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link
            href="https://github.com/hootmeow/bf1942-linux"
            target="_blank"
            rel="noreferrer"
          >
            <Github className="mr-2 h-4 w-4" />
            View on GitHub
          </Link>
        </Button>
      </div>

      {/* Main Content Card */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle as="h2">Automated Setup Script</CardTitle>
          <CardDescription>
            This solution installs the legacy 32-bit Battlefield 1942 dedicated server using a dedicated,
            non-privileged account, following best security practices.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          {/* Overview Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Terminal className="h-5 w-5 text-primary" /> Overview
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              <li className="flex gap-3 rounded-md border border-border/60 p-3">
                <Settings className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <span className="font-medium text-foreground">Single-Script Setup</span>
                  <p className="text-sm text-muted-foreground">One script handles OS dependencies, user creation, and game installation.</p>
                </div>
              </li>
              <li className="flex gap-3 rounded-md border border-border/60 p-3">
                <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <span className="font-medium text-foreground">Secure Runtime</span>
                  <p className="text-sm text-muted-foreground">Runs entirely under a dedicated service account (bf1942_user).</p>
                </div>
              </li>
              <li className="flex gap-3 rounded-md border border-border/60 p-3">
                <Server className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <span className="font-medium text-foreground">Modern Compatibility</span>
                  <p className="text-sm text-muted-foreground">Automatically installs required i386 libraries and legacy libncurses5/libstdc++5.</p>
                </div>
              </li>
              <li className="flex gap-3 rounded-md border border-border/60 p-3">
                <Terminal className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <span className="font-medium text-foreground">Systemd Integration</span>
                  <p className="text-sm text-muted-foreground">Managed via standard systemctl commands.</p>
                </div>
              </li>
            </ul>
          </section>

          {/* Configuration Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              ⚙️ Configuration
            </h2>
            <p className="text-sm text-muted-foreground">
              The setup script contains several configuration variables at the top that you can customize before running.
            </p>
            <div className="overflow-hidden rounded-md border border-border/60">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Variable</TableHead>
                    <TableHead className="w-[200px]">Default</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {configVariables.map((item) => (
                    <TableRow key={item.variable}>
                      <TableCell className="font-mono text-sm font-medium">{item.variable}</TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">{item.default}</TableCell>
                      <TableCell className="text-muted-foreground">{item.desc}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          {/* Installation Section */}
          <section id="installation" className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              🚀 Usage
            </h2>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Prerequisite</AlertTitle>
              <AlertDescription>
                Commands must be run by a user with <strong>sudo</strong> privileges.
              </AlertDescription>
            </Alert>
            
            <div className="mt-4">
              <h3 className="mb-2 text-lg font-medium">1️⃣ Download and Run</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                This install script is for <strong>Ubuntu 24.0.3</strong> servers. For other distros, please check the repository and adjust the file links accordingly.
              </p>
              <CodeBlock>
                wget https://raw.githubusercontent.com/hootmeow/bf1942-linux/main/ubuntu/24.0.3_setup.sh
                <br />
                chmod +x 24.0.3_setup.sh
                <br />
                sudo ./24.0.3_setup.sh
              </CodeBlock>
            </div>
          </section>

          {/* Supported Distributions */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              🧪 Supported Distributions
            </h2>
            <div className="overflow-hidden rounded-md border border-border/60">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Distro</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {distributions.map((distro) => (
                    <TableRow key={distro.distro}>
                      <TableCell className="font-medium text-foreground">
                        {distro.distro}
                      </TableCell>
                      <TableCell>{distro.status}</TableCell>
                      <TableCell>{distro.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          {/* License */}
          <section className="border-t border-border/60 pt-6">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              📜 License
            </h2>
            <p className="text-sm text-muted-foreground">
              Scripts released under the MIT License. All Battlefield 1942 game assets remain © Electronic Arts Inc.
            </p>
          </section>

        </CardContent>
      </Card>
    </div>
  );
}