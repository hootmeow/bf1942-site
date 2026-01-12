import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Github, AlertTriangle, Terminal, ShieldCheck, Server, Settings, Monitor, Download } from "lucide-react";
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
      "text": "Download the setup script using wget.",
      "url": "https://www.bf1942.online/tools/linux-server#installation"
    },
    {
      "@type": "HowToStep",
      "name": "Make Executable",
      "text": "Make the script executable with chmod +x.",
      "url": "https://www.bf1942.online/tools/linux-server#installation"
    },
    {
      "@type": "HowToStep",
      "name": "Run the Script",
      "text": "Run the script with sudo privileges.",
      "url": "https://www.bf1942.online/tools/linux-server#installation"
    }
  ]
};

export default function LinuxServerPage() {
  return (
    <div className="space-y-6">
      {/* --- JSON-LD --- */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />

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
            This solution installs the legacy 32-bit Battlefield 1942 dedicated server on modern 64-bit Linux systems using a dedicated,
            non-privileged account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-10">

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
                <Monitor className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <span className="font-medium text-foreground">Optional Manager</span>
                  <p className="text-sm text-muted-foreground">Option to install BFSMD (Battlefield Server Manager Daemon) for remote management.</p>
                </div>
              </li>
              <li className="flex gap-3 rounded-md border border-border/60 p-3 sm:col-span-2">
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
          <section id="installation" className="space-y-6">
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

            <p className="text-sm text-muted-foreground">
              You have two options for installation. <strong>We recommend using the BFSMD version</strong> for the ease of server and player management.
              The installation scripts below are for <strong>Ubuntu 24.0.3 LTS</strong>. For other distros, select the appropriate install script from the project and adjust the file names accordingly.
            </p>

            <div className="space-y-6">
              {/* Option A */}
              <div className="rounded-lg border border-border/60 bg-card/50 p-4">
                <h3 className="mb-2 text-lg font-semibold flex items-center gap-2">
                  Option A: Install with BFSMD (Recommended)
                  <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">Best Choice</span>
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  This version installs the Battlefield Server Manager Daemon, allowing you to manage the server remotely via the Windows client.
                </p>
                <ul className="mb-4 list-disc pl-5 text-sm text-muted-foreground">
                  <li>You will be prompted to set a password for the service user.</li>
                  <li>Choose between <strong>BF Remote Manager v2.0 (Final)</strong> or <strong>v2.01 (Patched)</strong>.</li>
                  <li>Automatically configure UFW firewall rules (optional).</li>
                </ul>

                <CodeBlock>
                  curl -O https://raw.githubusercontent.com/hootmeow/bf1942-linux/main/ubuntu/24.0.3_bfsmd_setup.sh
                  <br />
                  chmod +x 24.0.3_bfsmd_setup.sh
                  <br />
                  sudo ./24.0.3_bfsmd_setup.sh
                </CodeBlock>
              </div>

              {/* Option B */}
              <div className="rounded-lg border border-border/60 bg-card/50 p-4">
                <h3 className="mb-2 text-lg font-semibold">Option B: Standard Installation</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  This version installs the base dedicated server without the remote manager daemon.
                </p>
                <CodeBlock>
                  curl -# -O https://raw.githubusercontent.com/hootmeow/bf1942-linux/main/ubuntu/24.0.3_setup.sh
                  <br />
                  chmod +x 24.0.3_setup.sh
                  <br />
                  sudo ./24.0.3_setup.sh
                </CodeBlock>
              </div>
            </div>
          </section>

          {/* Setup Guide with Images */}
          <section className="space-y-8 border-t border-border/60 pt-8">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Server Manager Configuration (BFSMD Only)
            </h2>

            {/* Step 2 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">2️⃣ Connect to Server Manager</h3>
              <p className="text-sm text-muted-foreground">
                If you installed the BFSMD version, open your Battlefield Server Manager client (Windows) and connect using your server's IP address.
              </p>
              <div className="rounded-md bg-muted p-3">
                <p className="text-sm font-mono">Default Username : <span className="text-foreground font-bold">bf1942</span></p>
                <p className="text-sm font-mono">Default Password : <span className="text-foreground font-bold">battlefield</span></p>
              </div>
              <div className="overflow-hidden rounded-lg border border-border/60 shadow-sm">
                <img
                  src="/images/server/bfsmd_password.png"
                  alt="BFSMD Login Screen"
                  className="w-full max-w-2xl bg-black"
                />
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">3️⃣ Set Server IP</h3>
              <p className="text-sm text-muted-foreground">
                Once connected, navigate to the IP settings tab. You must set the server's IP address explicitly under the <strong>IP Address</strong> field to ensure it binds correctly to your network interface.
              </p>
              <div className="overflow-hidden rounded-lg border border-border/60 shadow-sm">
                <img
                  src="/images/server/bfsmd_ip_addr.png"
                  alt="Set Server IP Address"
                  className="w-full max-w-2xl bg-black"
                />
              </div>
            </div>

            {/* Step 4 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">4️⃣ Secure Remote Console & Admin</h3>
              <p className="text-sm text-muted-foreground">
                Go to the <strong>Remote Console</strong> or <strong>Admin</strong> tab. Change the default passwords immediately to something secure. This protects your server from unauthorized rcon commands.
              </p>
              <div className="overflow-hidden rounded-lg border border-border/60 shadow-sm">
                <img
                  src="/images/server/bfsmd_remoteconsole.png"
                  alt="Remote Console Security"
                  className="w-full max-w-2xl bg-black"
                />
              </div>
            </div>

            {/* Step 5 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">5️⃣ Set a Default Map</h3>
              <p className="text-sm text-muted-foreground">
                The server requires a map rotation to start effectively. Go to the <strong>Maps</strong> list and add at least one map to the rotation to set it as the default map.
              </p>
              <div className="overflow-hidden rounded-lg border border-border/60 shadow-sm">
                <img
                  src="/images/server/bfsmd_setmap.png"
                  alt="Set Default Map"
                  className="w-full max-w-2xl bg-black"
                />
              </div>
            </div>

            {/* Step 6 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">6️⃣ Server Manager Users</h3>
              <p className="text-sm text-muted-foreground">
                For security, do not keep using the default account.
              </p>
              <ul className="list-decimal pl-5 text-sm text-muted-foreground">
                <li>Change the password for the <code>bf1942</code> user from the default (<code>battlefield</code>).</li>
                <li>Create new accounts for any other admins if needed.</li>
                <li>Ensure you set appropriate permissions for each user.</li>
              </ul>
              <div className="overflow-hidden rounded-lg border border-border/60 shadow-sm">
                <img
                  src="/images/server/bfsmd_adminpassword.png"
                  alt="Set Admin Users"
                  className="w-full max-w-2xl bg-black"
                />
              </div>
            </div>

            {/* Patches */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">🛠️ Applying Patches</h3>
              <p className="text-sm text-muted-foreground">
                The <Link href="https://github.com/hootmeow/bf1942-linux/tree/main/patches" className="text-primary hover:underline">patches folder</Link> contains Python scripts to fix various server bugs. Please see individual patch files for additional details and instructions.
              </p>
            </div>
          </section>

          {/* Downloads */}
          <section className="space-y-4 border-t border-border/60 pt-8">
            <h2 className="text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" /> Server Manager Downloads (Windows)
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              <li>
                <Button variant="outline" className="w-full justify-start h-auto py-4" asChild>
                  <Link href="https://files.bf1942.online/server/toolsBFRemoteManager20final-patched.zip">
                    <Download className="mr-2 h-4 w-4" />
                    <div className="text-left">
                      <div className="font-semibold">BFRM Version 2.0</div>
                      <div className="text-xs text-muted-foreground">Standard Release</div>
                    </div>
                  </Link>
                </Button>
              </li>
              <li>
                <Button variant="outline" className="w-full justify-start h-auto py-4" asChild>
                  <Link href="https://files.bf1942.online/server/tools/BFRemoteManager201-patched.zip">
                    <Download className="mr-2 h-4 w-4" />
                    <div className="text-left">
                      <div className="font-semibold">BFRM Version 2.1 (Patched)</div>
                      <div className="text-xs text-muted-foreground">Recommended</div>
                    </div>
                  </Link>
                </Button>
              </li>
            </ul>
          </section>

          {/* Supported Distributions */}
          <section className="space-y-4 border-t border-border/60 pt-8">
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
            <div className="text-sm text-muted-foreground">
              <p>Scripts released under the MIT License. All Battlefield 1942 game assets remain © Electronic Arts Inc.</p>
              <p className="mt-2">Author: <Link href="https://github.com/hootmeow" className="text-primary hover:underline">OWLCAT</Link></p>
            </div>
          </section>

        </CardContent>
      </Card>
    </div>
  );
}