import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Github, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const metadata: Metadata = {
  title: "Linux BF1942 Server | BF1942 Command Center",
  description: "Automated setup and patching scripts for running a Battlefield 1942 Dedicated Server on modern 64-bit Linux systems.",
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
  { distro: "Ubuntu 24.04.3 LTS", status: "✅ Tested", notes: "Primary tested platform" },
  { distro: "Ubuntu 22.04 LTS", status: "📝 TODO", notes: "Minor package name adjustments" },
  { distro: "Debian 12 (Bookworm)", status: "📝 TODO", notes: "Same multiarch flow" },
];

export default function LinuxServerPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Linux BF1942 Server Scripts
        </h1>
        <p className="mt-1 text-muted-foreground">
          Automated setup and patching scripts for running a <strong>Battlefield 1942 Dedicated Server</strong> on
          modern 64-bit Linux systems.
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
          <CardTitle>Overview</CardTitle>
          <CardDescription>
            This project automates the setup of the 32-bit BF1942 server on a modern 64-bit
            Linux OS, following best security practices.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Prerequisites */}
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            1. Prerequisites
          </h2>
          <p className="text-sm text-muted-foreground">
            Before you begin, you will need:
          </p>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>
              A server running a supported OS (see list below). <strong>Ubuntu 24.04 LTS</strong> is recommended.
            </li>
            <li>
              Root or <code>sudo</code> access.
            </li>
            <li>
              <code>git</code> and <code>curl</code> installed:
              <CodeBlock>sudo apt update && sudo apt install -y git curl</CodeBlock>
            </li>
          </ul>

          {/* Installation */}
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            2. Installation
          </h2>
          <p className="text-sm text-muted-foreground">
            Clone the repository and run the setup script as root. The script will guide you
            through the process.
          </p>
          <CodeBlock>
            # Clone the repository
            <br />
            git clone https://github.com/hootmeow/bf1942-linux.git
            <br />
            cd bf1942-linux
            <br />
            <br />
            # Make the script executable
            <br />
            chmod +x setup_env.sh
            <br />
            <br />
            # Run the setup script as root
            <br />
            sudo ./setup_env.sh
          </CodeBlock>
          <p className="text-sm text-muted-foreground">
            The script will prompt you to create a secure password for the new, unprivileged 
            <code>bf1942_user</code>.
          </p>

          {/* How It Works */}
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            3. How It Works
          </h2>
          <p className="text-sm text-muted-foreground">
            The <code>setup_env.sh</code> script performs the following actions:
          </p>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>
              Creates a dedicated, non-privileged service account named <code>bf1942_user</code>.
            </li>
            <li>
              Enables i386 multiarch and installs all required 32-bit libraries (e.g., <code>lib32stdc++6</code>).
            </li>
            <li>
              Downloads the BF1942 1.61b server files and all necessary patches.
            </li>
            <li>
              Applies the "No-CD" patch and the community master server patch.
            </li>
            <li>
              Sets up a <code>systemd</code> service file (<code>bf1942-server.service</code>) to run the server.
            </li>
            <li>
              Configures a limited <code>sudoers</code> file to allow <code>bf1942_user</code> to safely
              manage the service without a password.
            </li>
          </ul>

          {/* Managing Server */}
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            4. Managing Your Server
          </h2>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Security Best Practice</AlertTitle>
            <AlertDescription>
              All server commands should be run as the <code>bf1942_user</code>, not as root.
            </AlertDescription>
          </Alert>
          <p className="mt-4 text-sm text-muted-foreground">
            First, log in as the service user:
            <CodeBlock>sudo -iu bf1942_user</CodeBlock>
          </p>
          <p className="text-sm text-muted-foreground">
            From there, you can use <code>sudo</code> (which will not require a password) to
            manage the service:
          </p>
          <CodeBlock>
            # Start the server
            <br />
            sudo systemctl start bf1942-server.service
            <br />
            <br />
            # Stop the server
            <br />
            sudo systemctl stop bf1942-server.service
            <br />
            <br />
            # Check the server's status
            <br />
            sudo systemctl status bf1942-server.service
            <br />
            <br />
            # View the live server console/log
            <br />
            journalctl -fu bf1942-server.service
          </CodeBlock>
          <p className="text-sm text-muted-foreground">
            The server's <code>serversettings.con</code> file is located in:
            <code>/home/bf1942_user/bf1942/mods/bf1942/settings/</code>
          </p>

          {/* Supported Distributions */}
          <h2 className="pt-4 text-xl font-semibold tracking-tight text-foreground">
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
                      <strong>{distro.distro.split(" ")[0]}</strong> {distro.distro.substring(distro.distro.indexOf(" ") + 1)}
                    </TableCell>
                    <TableCell>{distro.status}</TableCell>
                    <TableCell>{distro.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}