import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Linux BF1942 Server | BF1942 Command Center",
  description: "Automated setup and patching scripts for running a Battlefield 1942 Dedicated Server on modern 64-bit Linux systems.",
};

const distributions = [
  { distro: "Ubuntu 24.04.3 LTS", status: "✅ Tested", notes: "Primary tested platform" },
  { distro: "Ubuntu 25.x", status: "📝 TODO", notes: "Expected to work unchanged" },
  { distro: "Ubuntu 22.04 LTS", status: "📝 TODO", notes: "Minor package name adjustments" },
  { distro: "Debian 12 (Bookworm)", status: "📝 TODO", notes: "Same multiarch flow" },
  { distro: "Debian 11 (Bullseye)", status: "📝 TODO", notes: "Legacy libc compatible" },
  { distro: "Fedora 40", status: "📝 TODO", notes: "Requires dnf multilib equivalents" },
  { distro: "CentOS Stream 9 / Rocky / AlmaLinux 9", status: "📝 TODO", notes: "Requires yum/dnf adaptation" },
];

export default function LinuxServerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Linux BF1942 Server Scripts
        </h1>
        <p className="mt-1 text-muted-foreground">
          Automated setup and patching scripts for running a <strong>Battlefield 1942 Dedicated Server</strong> on
          modern 64-bit Linux systems — securely, without ever running the game or related services
          with elevated privileges.
        </p>
      </div>

      <Card className="border-border/60">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            These scripts install the legacy 32-bit Battlefield 1942 dedicated server using a
            dedicated, non-privileged account with limited <code>sudo</code> permissions,
            following best security practices.
          </p>

          <hr className="my-6 border-border" />

          <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
            🧩 Overview
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>
              Installs and runs entirely under a <strong>dedicated service account</strong> (
              <code>bf1942_user</code>)
            </li>
            <li>
              Uses <strong>limited sudoers permissions</strong> for service control
            </li>
            <li>
              Works with <strong>systemd</strong> for clean background operation
            </li>
            <li>
              Tested on <strong>Ubuntu 24.04.3 LTS</strong>
            </li>
            <li>
              Uses <strong>i386 multiarch</strong> and legacy libraries for compatibility
            </li>
          </ul>

          <hr className="my-6 border-border" />

          <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
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

          <hr className="my-6 border-border" />

          <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
            📦 Scripts Overview
          </h2>
          <h3 className="mb-2 font-mono text-lg font-medium text-foreground">
            <code>&lt;version&gt;-setup_env.sh</code>
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Prepares the system for a Battlefield 1942 server environment.
          </p>
          <div className="space-y-4 rounded-md border border-border/60 bg-card/40 p-6">
            <h4 className="font-semibold text-foreground">What it does:</h4>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>
                Creates a non-privileged user <code>bf1942_user</code>
              </li>
              <li>Prompts for a password for that user</li>
              <li>Enables i386 multiarch and installs required 32-bit libraries</li>
              <li>
                Downloads the <strong>1.6 RC2 server installer</strong> into{" "}
                <code>/home/bf1942_user/bf1942/downloads</code>
              </li>
              <li>
                Creates a <code>systemd</code> unit to run the server as <code>bf1942_user</code>
              </li>
              <li>
                Adds a limited sudoers entry so <code>bf1942_user</code> can:
                <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
                  <li>start, stop, restart, or check the service</li>
                  <li>view logs</li>
                  <li>
                    run patch scripts inside <code>~/bf1942</code>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}