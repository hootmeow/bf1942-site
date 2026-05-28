import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Github, AlertTriangle, Terminal, ShieldCheck, Server, Settings, Monitor, Download, Cpu, Network, Lock, Wrench } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const metadata: Metadata = {
  title: "Linux BF1942 Server",
  description: "Automated setup for running Battlefield 1942 Dedicated Servers on modern 64-bit Linux systems with multi-instance support, smart IP detection, and comprehensive management tools.",
};

const CodeBlock = ({ children }: { children: React.ReactNode }) => {
  return (
    <pre className="mt-2 overflow-x-auto rounded-md bg-slate-900 p-4 font-mono text-sm text-slate-100">
      <code>{children}</code>
    </pre>
  );
};

const distributions = [
  { distro: "Ubuntu 24.04 LTS", script: "installers/ubuntu/ubu_24.0.3_bfsmd_setup.sh", notes: "Uses libcurl4t64:i386 (auto-detected)." },
  { distro: "Ubuntu 22.04 LTS", script: "installers/ubuntu/ubu_22.04_bfsmd_setup.sh", notes: "Uses libcurl4:i386." },
  { distro: "Debian 12 (Bookworm) / 13 (Trixie)", script: "installers/debian/deb_12_bfsmd_setup.sh", notes: "Auto-detects libcurl4 vs libcurl4t64 at runtime." },
  { distro: "Fedora 40 / 41", script: "installers/fedora/fed_40_bfsmd_setup.sh", notes: "dnf + .i686 packages, firewalld, SELinux (restorecon), zlib-ng auto-detection." },
  { distro: "RHEL 9", script: "installers/rhel/rhel_9_bfsmd_setup.sh", notes: "Same as Fedora + automatically enables EPEL and CRB repos." },
  { distro: "CentOS Stream 9", script: "installers/centos/centos_stream9_bfsmd_setup.sh", notes: "Same as RHEL 9." },
];

const portExamples = [
  { instance: "server1", game: "14600 (UDP)", query: "23033 (UDP)", mgmt: "14700 (TCP)" },
  { instance: "server2", game: "14605 (UDP)", query: "23038 (UDP)", mgmt: "14705 (TCP)" },
  { instance: "conquest", game: "14620 (UDP)", query: "23053 (UDP)", mgmt: "14720 (TCP)" },
  { instance: "tdm", game: "14589 (UDP)", query: "23022 (UDP)", mgmt: "14689 (TCP)" },
];

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Install a BF1942 Linux Server",
  "description": "Automated setup for running Battlefield 1942 Dedicated Servers on modern 64-bit Linux systems with multi-instance support.",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Download the Scripts",
      "text": "Download the setup script and management tool using wget.",
      "url": "https://www.bf1942.online/tools/linux-server#installation"
    },
    {
      "@type": "HowToStep",
      "name": "Make Executable",
      "text": "Make the scripts executable with chmod +x.",
      "url": "https://www.bf1942.online/tools/linux-server#installation"
    },
    {
      "@type": "HowToStep",
      "name": "Run the Setup",
      "text": "Run the setup script with sudo privileges and follow the interactive prompts.",
      "url": "https://www.bf1942.online/tools/linux-server#installation"
    },
    {
      "@type": "HowToStep",
      "name": "Configure via BFRM",
      "text": "Connect to the server using BF Remote Manager to configure settings, maps, and admin accounts.",
      "url": "https://www.bf1942.online/tools/linux-server#bfsmd-setup"
    }
  ]
};

export default function LinuxServerPage() {
  return (
    <div className="space-y-6">
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
          Enhanced Multi-Instance Setup with Secure Runtime
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
            Automated setup for running Battlefield 1942 dedicated servers on modern 64-bit Linux using a dedicated,
            non-privileged account. Handles all dependency resolution (including legacy 32-bit libraries), user creation,
            systemd service setup, and firewall configuration in a single interactive script across Ubuntu, Debian,
            Fedora, RHEL, and CentOS.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-10">

          {/* Features Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Terminal className="h-5 w-5 text-primary" /> Features
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              <li className="flex gap-3 rounded-md border border-border/60 p-3">
                <Settings className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <span className="font-medium text-foreground">Single-Script Setup</span>
                  <p className="text-sm text-muted-foreground">One unified script handles everything - standalone or BFSMD modes.</p>
                </div>
              </li>
              <li className="flex gap-3 rounded-md border border-border/60 p-3">
                <Cpu className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <span className="font-medium text-foreground">Multi-Instance Support</span>
                  <p className="text-sm text-muted-foreground">Run unlimited servers on one machine with automatic port allocation.</p>
                </div>
              </li>
              <li className="flex gap-3 rounded-md border border-border/60 p-3">
                <Network className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <span className="font-medium text-foreground">Smart Configuration</span>
                  <p className="text-sm text-muted-foreground">Interactive IP detection, port conflict prevention, resource validation.</p>
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
                  <p className="text-sm text-muted-foreground">Handles legacy 32-bit dependency resolution across all supported distributions automatically.</p>
                </div>
              </li>
              <li className="flex gap-3 rounded-md border border-border/60 p-3">
                <Monitor className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <span className="font-medium text-foreground">Management Tools</span>
                  <p className="text-sm text-muted-foreground">Comprehensive CLI tool for monitoring and managing all instances.</p>
                </div>
              </li>
              <li className="flex gap-3 rounded-md border border-border/60 p-3">
                <Wrench className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <span className="font-medium text-foreground">Performance Optimized</span>
                  <p className="text-sm text-muted-foreground">CPU affinity, memory limits, I/O tuning automatically configured.</p>
                </div>
              </li>
              <li className="flex gap-3 rounded-md border border-border/60 p-3">
                <Terminal className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <span className="font-medium text-foreground">Systemd Integration</span>
                  <p className="text-sm text-muted-foreground">Managed via standard systemctl commands with auto-start on boot.</p>
                </div>
              </li>
            </ul>
          </section>

          {/* Port Configuration */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              ⚙️ Port Configuration
            </h2>
            <p className="text-sm text-muted-foreground">
              Each instance gets automatically calculated ports based on its name. This prevents conflicts and makes
              managing multiple servers straightforward.
            </p>
            <div className="overflow-hidden rounded-md border border-border/60">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Instance Name</TableHead>
                    <TableHead>Game Port</TableHead>
                    <TableHead>Query Port</TableHead>
                    <TableHead>Management Port</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {portExamples.map((item) => (
                    <TableRow key={item.instance}>
                      <TableCell className="font-mono text-sm font-medium">{item.instance}</TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">{item.game}</TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">{item.query}</TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">{item.mgmt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="text-sm text-muted-foreground">
              View your actual ports with: <code className="rounded bg-muted px-1 py-0.5">./bf1942_manager.sh ports</code>
            </p>
          </section>

          {/* Installation Section */}
          <section id="installation" className="space-y-6">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              🚀 Quick Start (Ubuntu 24.04 LTS)
            </h2>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Prerequisite</AlertTitle>
              <AlertDescription>
                Commands must be run by a user with <strong>sudo</strong> privileges.
              </AlertDescription>
            </Alert>

            <div className="space-y-6">
              {/* Step 1: Download */}
              <div className="rounded-lg border border-border/60 bg-card/50 p-4">
                <h3 className="mb-2 text-lg font-semibold">1️⃣ Download Scripts</h3>
                <CodeBlock>
                  {`# Download main setup script (example: Ubuntu 24.04)
wget https://raw.githubusercontent.com/hootmeow/bf1942-linux/main/installers/ubuntu/ubu_24.0.3_bfsmd_setup.sh

# Download management tool (same file for all distros)
wget https://raw.githubusercontent.com/hootmeow/bf1942-linux/main/bf1942_manager.sh

# Make executable
chmod +x ubu_24.0.3_bfsmd_setup.sh bf1942_manager.sh`}
                </CodeBlock>
                <p className="mt-3 text-sm text-muted-foreground">
                  Replace <code className="rounded bg-muted px-1 py-0.5">ubu_24.0.3_bfsmd_setup.sh</code> with your distro's script name from the table below. <code className="rounded bg-muted px-1 py-0.5">bf1942_manager.sh</code> is the same for all distros.
                </p>
              </div>

              {/* Step 2: Install */}
              <div className="rounded-lg border border-border/60 bg-card/50 p-4">
                <h3 className="mb-2 text-lg font-semibold flex items-center gap-2">
                  2️⃣ Install Your First Server
                  <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">BFSMD Recommended</span>
                </h3>
                <CodeBlock>sudo ./ubu_24.0.3_bfsmd_setup.sh</CodeBlock>
                <p className="mt-4 text-sm text-muted-foreground">
                  <strong>Interactive Setup Prompts:</strong>
                </p>
                <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li><strong>Installation mode</strong> — choose Standalone (no remote management) or BFSMD (full GUI management via BFRM)</li>
                  <li><strong>Instance name</strong> <em>(BFSMD only)</em> — a unique name like <code className="rounded bg-muted px-1 py-0.5">server1</code>, <code className="rounded bg-muted px-1 py-0.5">conquest</code>, <code className="rounded bg-muted px-1 py-0.5">tdm</code></li>
                  <li><strong>IP address</strong> — auto-detected; choose local, public, or enter custom</li>
                  <li><strong>BFSMD version</strong> <em>(BFSMD only)</em> — v2.0 (recommended) or v2.01 (fixes admin/PunkBuster bugs)</li>
                  <li><strong>Firewall rules</strong> — optional, interactive security level selection</li>
                </ul>
              </div>

              {/* Step 3: Additional Instances */}
              <div className="rounded-lg border border-border/60 bg-card/50 p-4">
                <h3 className="mb-2 text-lg font-semibold">3️⃣ Create Additional Instances (Optional)</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Add more servers by passing an instance name. Each gets unique ports automatically.
                </p>
                <CodeBlock>
                  {`sudo ./ubu_24.0.3_bfsmd_setup.sh server2
sudo ./ubu_24.0.3_bfsmd_setup.sh conquest
sudo ./ubu_24.0.3_bfsmd_setup.sh tdm`}
                </CodeBlock>
              </div>
            </div>
          </section>

          {/* Management Commands */}
          <section className="space-y-4 border-t border-border/60 pt-8">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              🛠️ Management Commands
            </h2>
            <p className="text-sm text-muted-foreground">
              Use the <code className="rounded bg-muted px-1 py-0.5">bf1942_manager.sh</code> tool to manage all your server instances.
            </p>
            <CodeBlock>
              {`# View all instances
./bf1942_manager.sh list

# Check port assignments
./bf1942_manager.sh ports

# View detailed status
./bf1942_manager.sh status server1

# Show configuration paths
./bf1942_manager.sh config server1

# Health check all instances
./bf1942_manager.sh health

# Security audit
./bf1942_manager.sh security

# Service control (requires sudo)
sudo ./bf1942_manager.sh start server1
sudo ./bf1942_manager.sh stop server1
sudo ./bf1942_manager.sh restart server1

# View live logs
./bf1942_manager.sh logs server1

# Remove instance (with confirmation)
sudo ./bf1942_manager.sh remove server2`}
            </CodeBlock>
            <p className="text-sm text-muted-foreground mt-4">
              <strong>Direct Systemd Commands:</strong>
            </p>
            <CodeBlock>
              {`# BFSMD instance
sudo systemctl status bfsmd-server1.service
sudo systemctl restart bfsmd-server1.service
journalctl -u bfsmd-server1.service -f

# Standalone server
sudo systemctl status bf1942.service`}
            </CodeBlock>
          </section>

          {/* BFSMD Setup Guide */}
          <section id="bfsmd-setup" className="space-y-8 border-t border-border/60 pt-8">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              🎮 Connect to BFRM (BFSMD Mode)
            </h2>

            {/* Default Credentials */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Default Credentials</h3>
              <div className="rounded-md bg-muted p-3">
                <p className="text-sm font-mono">Username: <span className="text-foreground font-bold">bf1942</span></p>
                <p className="text-sm font-mono">Password: <span className="text-foreground font-bold">battlefield</span></p>
              </div>
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Critical Security Warning</AlertTitle>
                <AlertDescription>
                  Change the default password immediately via BFRM after first login!
                </AlertDescription>
              </Alert>
            </div>

            {/* Connection Steps */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Connection Steps</h3>
              <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-2">
                <li>Open <strong>BFRM client</strong> (Windows)</li>
                <li>Connect to <code className="rounded bg-muted px-1 py-0.5">your-server-ip:management-port</code></li>
                <li>Login with default credentials</li>
                <li><strong>Change password immediately</strong> (Admin tab)</li>
              </ol>
              <div className="overflow-hidden rounded-lg border border-border/60 shadow-sm">
                <img
                  src="/images/server/bfsmd_password.png"
                  alt="BFSMD Login Screen"
                  className="w-full max-w-2xl bg-black"
                />
              </div>
            </div>

            {/* Set Server IP */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Set Server IP</h3>
              <p className="text-sm text-muted-foreground">
                Navigate to IP settings and set your server's IP address explicitly.
              </p>
              <div className="overflow-hidden rounded-lg border border-border/60 shadow-sm">
                <img
                  src="/images/server/bfsmd_ip_addr.png"
                  alt="Set Server IP Address"
                  className="w-full max-w-2xl bg-black"
                />
              </div>
            </div>

            {/* Secure Remote Console */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Secure Remote Console & Admin</h3>
              <p className="text-sm text-muted-foreground">
                Change default remote console password and create secure admin accounts.
              </p>
              <div className="overflow-hidden rounded-lg border border-border/60 shadow-sm">
                <img
                  src="/images/server/bfsmd_remoteconsole.png"
                  alt="Remote Console Security"
                  className="w-full max-w-2xl bg-black"
                />
              </div>
            </div>

            {/* Set Default Map */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Set Default Map</h3>
              <p className="text-sm text-muted-foreground">
                Add at least one map to the rotation before starting the server.
              </p>
              <div className="overflow-hidden rounded-lg border border-border/60 shadow-sm">
                <img
                  src="/images/server/bfsmd_setmap.png"
                  alt="Set Default Map"
                  className="w-full max-w-2xl bg-black"
                />
              </div>
            </div>

            {/* Admin Passwords */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Update Admin Passwords</h3>
              <p className="text-sm text-muted-foreground">
                Create secure admin accounts and disable defaults.
              </p>
              <div className="overflow-hidden rounded-lg border border-border/60 shadow-sm">
                <img
                  src="/images/server/bfsmd_adminpassword.png"
                  alt="Set Admin Users"
                  className="w-full max-w-2xl bg-black"
                />
              </div>
            </div>
          </section>

          {/* Firewall Configuration */}
          <section className="space-y-4 border-t border-border/60 pt-8">
            <h2 className="text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" /> Firewall Configuration
            </h2>
            <p className="text-sm text-muted-foreground">
              During installation, firewall rules are configured automatically — UFW on Debian/Ubuntu, firewalld on Fedora/RHEL/CentOS. For the management port, choose a security level:
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border/60 p-4">
                <h4 className="font-semibold text-foreground">Option 1: Open to All</h4>
                <p className="text-xs text-muted-foreground mt-1">Easiest setup</p>
                <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                  <li>Anyone can attempt connection</li>
                  <li>Still requires password</li>
                  <li>Good for testing or behind other firewall</li>
                </ul>
              </div>
              <div className="rounded-lg border border-primary/50 bg-primary/5 p-4">
                <h4 className="font-semibold text-foreground">Option 2: Restrict to IP</h4>
                <p className="text-xs text-primary mt-1">Recommended</p>
                <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                  <li>Only specified IP can connect</li>
                  <li>Firewall + password protection</li>
                  <li>Good for static admin IP</li>
                </ul>
              </div>
              <div className="rounded-lg border border-border/60 p-4">
                <h4 className="font-semibold text-foreground">Option 3: SSH Tunnel</h4>
                <p className="text-xs text-muted-foreground mt-1">Most secure</p>
                <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                  <li>No direct internet access</li>
                  <li>All traffic encrypted via SSH</li>
                  <li>Good for maximum security</li>
                </ul>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 bg-card/50 p-4">
              <h4 className="font-semibold text-foreground mb-2">SSH Tunnel Example</h4>
              <CodeBlock>
                {`# On your local machine
ssh -L 14700:localhost:14700 user@your-server-ip

# Then connect BFRM to localhost:14700`}
              </CodeBlock>
            </div>
          </section>

          {/* Network Scenarios */}
          <section className="space-y-4 border-t border-border/60 pt-8">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              🌐 Network Scenarios
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border/60 p-4">
                <h4 className="font-semibold text-foreground">Home Server (Behind Router)</h4>
                <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                  <li><strong>During Install:</strong> Choose Local IP (192.168.x.x)</li>
                  <li><strong>Router Config:</strong> Forward Game + Query ports (UDP)</li>
                  <li><strong>Players Connect To:</strong> Your public IP</li>
                </ul>
              </div>
              <div className="rounded-lg border border-border/60 p-4">
                <h4 className="font-semibold text-foreground">Cloud Server (AWS, DigitalOcean, etc.)</h4>
                <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                  <li><strong>During Install:</strong> Choose Local IP (10.x.x.x or private IP)</li>
                  <li><strong>Cloud Firewall:</strong> Allow Game + Query from 0.0.0.0/0</li>
                  <li><strong>Players Connect To:</strong> Instance's public IP</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Troubleshooting */}
          <section className="space-y-4 border-t border-border/60 pt-8">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              🔧 Troubleshooting
            </h2>
            <div className="space-y-4">
              <div className="rounded-lg border border-border/60 p-4">
                <h4 className="font-semibold text-foreground">"Internal error!" Messages</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>This is normal!</strong> BFSMD v2.0/v2.01 shows these continuously when reading /proc on modern kernels.
                  The server functions perfectly despite these messages.
                </p>
                <CodeBlock>journalctl -u bfsmd-server1.service -f | grep -v "Internal error"</CodeBlock>
              </div>
              <div className="rounded-lg border border-border/60 p-4">
                <h4 className="font-semibold text-foreground">Can't Connect to Server</h4>
                <CodeBlock>
                  {`# 1. Check service is running
systemctl is-active bfsmd-server1.service

# 2. Check firewall (Debian/Ubuntu)
sudo ufw status
# Check firewall (Fedora/RHEL/CentOS)
sudo firewall-cmd --list-ports

# 3. Check ports are listening
sudo ss -tulnp | grep 14567

# 4. View logs
./bf1942_manager.sh logs server1`}
                </CodeBlock>
              </div>
              <div className="rounded-lg border border-border/60 p-4">
                <h4 className="font-semibold text-foreground">Port Conflict During Installation</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Try a different instance name — ports are derived from the name hash. Check existing assignments with{" "}
                  <code className="rounded bg-muted px-1 py-0.5">./bf1942_manager.sh ports</code>.
                </p>
              </div>
              <div className="rounded-lg border border-border/60 p-4">
                <h4 className="font-semibold text-foreground">Can't Login to BFRM</h4>
                <ol className="mt-2 list-decimal pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Confirm credentials: <code className="rounded bg-muted px-1 py-0.5">bf1942</code> / <code className="rounded bg-muted px-1 py-0.5">battlefield</code></li>
                  <li>Confirm the management port: <code className="rounded bg-muted px-1 py-0.5">./bf1942_manager.sh ports</code></li>
                  <li>Confirm firewall allows the connection from your IP</li>
                  <li>Confirm the service is running: <code className="rounded bg-muted px-1 py-0.5">./bf1942_manager.sh status server1</code></li>
                </ol>
              </div>
            </div>
          </section>

          {/* Configuration Files */}
          <section className="space-y-4 border-t border-border/60 pt-8">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              📁 Configuration Files
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border/60 p-4">
                <h4 className="font-semibold text-foreground mb-2">Standalone Server</h4>
                <CodeBlock>
                  {`/home/bf1942_user/bf1942/mods/bf1942/settings/
├── ServerSettings.con  # Game settings
└── MapList.con         # Map rotation`}
                </CodeBlock>
              </div>
              <div className="rounded-lg border border-border/60 p-4">
                <h4 className="font-semibold text-foreground mb-2">BFSMD Instance</h4>
                <CodeBlock>
                  {`/home/bf1942_user/instances/<name>/mods/bf1942/settings/
├── servermanager.con   # BFSMD settings
├── useraccess.con      # Admin accounts
├── ServerSettings.con  # Game settings
└── MapList.con         # Map rotation`}
                </CodeBlock>
              </div>
            </div>
          </section>

          {/* Advanced Usage */}
          <section className="space-y-4 border-t border-border/60 pt-8">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              🛠️ Advanced Usage
            </h2>
            <div className="space-y-4">
              <div className="rounded-lg border border-border/60 p-4">
                <h4 className="font-semibold text-foreground mb-2">Instance Limits</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  The script warns if you exceed the recommended ceiling but won't block you:
                </p>
                <div className="overflow-hidden rounded-md border border-border/60">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>CPU Cores</TableHead>
                        <TableHead>Recommended Max Instances</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow><TableCell>2</TableCell><TableCell>4</TableCell></TableRow>
                      <TableRow><TableCell>4</TableCell><TableCell>8</TableCell></TableRow>
                      <TableRow><TableCell>8</TableCell><TableCell>16</TableCell></TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
              <div className="rounded-lg border border-border/60 p-4">
                <h4 className="font-semibold text-foreground mb-2">Backup & Restore</h4>
                <CodeBlock>
                  {`# Backup settings
sudo tar -czf server1-backup-$(date +%F).tar.gz \\
  /home/bf1942_user/instances/server1/mods/bf1942/settings/

# Restore
sudo tar -xzf server1-backup-*.tar.gz -C /
sudo systemctl restart bfsmd-server1.service`}
                </CodeBlock>
              </div>
              <div className="rounded-lg border border-border/60 p-4">
                <h4 className="font-semibold text-foreground mb-2">Clone Instance Settings</h4>
                <CodeBlock>
                  {`sudo cp -r /home/bf1942_user/instances/server1/mods/bf1942/settings/* \\
           /home/bf1942_user/instances/server2/mods/bf1942/settings/
# Update the port in ServerSettings.con, then restart server2`}
                </CodeBlock>
              </div>
            </div>
          </section>

          {/* Downloads */}
          <section className="space-y-4 border-t border-border/60 pt-8">
            <h2 className="text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" /> BFRM Downloads (Windows)
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              <li>
                <Button variant="outline" className="w-full justify-start h-auto py-4" asChild>
                  <Link href="https://files.bf1942.online/server/tools/BFRemoteManager20final-patched.zip">
                    <Download className="mr-2 h-4 w-4" />
                    <div className="text-left">
                      <div className="font-semibold">BFRM v2.0 (Final)</div>
                      <div className="text-xs text-muted-foreground">Recommended</div>
                    </div>
                  </Link>
                </Button>
              </li>
              <li>
                <Button variant="outline" className="w-full justify-start h-auto py-4" asChild>
                  <Link href="https://files.bf1942.online/server/tools/BFRemoteManager201-patched.zip">
                    <Download className="mr-2 h-4 w-4" />
                    <div className="text-left">
                      <div className="font-semibold">BFRM v2.01 (Patched)</div>
                      <div className="text-xs text-muted-foreground">Fixes admin bugs</div>
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
                    <TableHead>Distribution</TableHead>
                    <TableHead>Script</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {distributions.map((distro) => (
                    <TableRow key={distro.distro}>
                      <TableCell className="font-medium text-foreground">
                        {distro.distro}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{distro.script}</TableCell>
                      <TableCell className="text-muted-foreground">{distro.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="text-sm text-muted-foreground">
              All distributions are fully tested and supported. See the{" "}
              <Link href="https://github.com/hootmeow/bf1942-linux" className="text-primary hover:underline" target="_blank" rel="noreferrer">GitHub repo</Link>{" "}
              for the latest scripts.
            </p>
          </section>

          {/* Patches */}
          <section className="space-y-4 border-t border-border/60 pt-8">
            <h3 className="text-lg font-medium">🛠️ Applying Patches</h3>
            <p className="text-sm text-muted-foreground">
              The <Link href="https://github.com/hootmeow/bf1942-linux/tree/main/patches" className="text-primary hover:underline">patches folder</Link> contains
              Python scripts to improve various server bugs. See individual patch files for details and instructions.
            </p>
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
