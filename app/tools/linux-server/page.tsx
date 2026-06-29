import type { Metadata } from "next";
import Link from "next/link";
import { safeJsonLd } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Github, AlertTriangle, ShieldCheck, Server, Settings, Monitor,
  Download, Cpu, Network, Lock, Wrench, Terminal, Radio, Activity,
  ChevronRight, Archive, Copy,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Linux BF1942 Server",
  description: "Automated setup for running Battlefield 1942 Dedicated Servers on modern 64-bit Linux systems with multi-instance support, smart IP detection, and comprehensive management tools.",
};

// ── Data ───────────────────────────────────────────────────────────────────

const distributions = [
  { distro: "Ubuntu 24.04 LTS",              script: "installers/ubuntu/ubu_24.0.3_bfsmd_setup.sh",   notes: "Uses libcurl4t64:i386 (auto-detected)." },
  { distro: "Ubuntu 22.04 LTS",              script: "installers/ubuntu/ubu_22.04_bfsmd_setup.sh",    notes: "Uses libcurl4:i386." },
  { distro: "Debian 12 (Bookworm) / 13 (Trixie)", script: "installers/debian/deb_12_bfsmd_setup.sh", notes: "Auto-detects libcurl4 vs libcurl4t64 at runtime." },
  { distro: "Fedora 40 / 41",               script: "installers/fedora/fed_40_bfsmd_setup.sh",        notes: "dnf + .i686 packages, firewalld, SELinux, zlib-ng auto-detection." },
  { distro: "RHEL 9",                        script: "installers/rhel/rhel_9_bfsmd_setup.sh",          notes: "Same as Fedora + auto-enables EPEL and CRB repos." },
  { distro: "CentOS Stream 9",               script: "installers/centos/centos_stream9_bfsmd_setup.sh", notes: "Same as RHEL 9." },
];

const portExamples = [
  { instance: "server1",  game: "14600", query: "23033", mgmt: "14700" },
  { instance: "server2",  game: "14605", query: "23038", mgmt: "14705" },
  { instance: "conquest", game: "14620", query: "23053", mgmt: "14720" },
  { instance: "tdm",      game: "14589", query: "23022", mgmt: "14689" },
];

const features = [
  { icon: Settings,    label: "Single-Script Setup",   desc: "One unified script handles everything — standalone or BFSMD modes." },
  { icon: Cpu,         label: "Multi-Instance Support", desc: "Run unlimited servers on one machine with automatic port allocation." },
  { icon: Network,     label: "Smart Configuration",   desc: "Interactive IP detection, port conflict prevention, resource validation." },
  { icon: ShieldCheck, label: "Secure Runtime",        desc: "Runs entirely under a dedicated service account (bf1942_user)." },
  { icon: Server,      label: "Modern Compatibility",  desc: "Handles legacy 32-bit dependency resolution across all supported distros." },
  { icon: Monitor,     label: "Management Tools",      desc: "Comprehensive CLI for monitoring and managing all instances." },
  { icon: Wrench,      label: "Performance Optimized", desc: "CPU affinity, memory limits, and I/O tuning automatically configured." },
  { icon: Terminal,    label: "Systemd Integration",   desc: "Standard systemctl commands with auto-start on boot." },
];

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Install a BF1942 Linux Server",
  description: "Automated setup for running Battlefield 1942 Dedicated Servers on modern 64-bit Linux systems with multi-instance support.",
  step: [
    { "@type": "HowToStep", name: "Download the Scripts",  text: "Download the setup script and management tool using wget.", url: "https://www.bf1942.online/tools/linux-server#installation" },
    { "@type": "HowToStep", name: "Make Executable",       text: "Make the scripts executable with chmod +x.",              url: "https://www.bf1942.online/tools/linux-server#installation" },
    { "@type": "HowToStep", name: "Run the Setup",         text: "Run the setup script with sudo and follow the prompts.",   url: "https://www.bf1942.online/tools/linux-server#installation" },
    { "@type": "HowToStep", name: "Configure via BFRM",    text: "Connect with BF Remote Manager to configure settings.",    url: "https://www.bf1942.online/tools/linux-server#bfsmd-setup" },
  ],
};

// ── Sub-components ─────────────────────────────────────────────────────────

function TerminalBlock({ title = "bash", children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#1e2a14] shadow-2xl shadow-black/50">
      <div className="flex items-center gap-3 bg-[#0d1208] px-4 py-2.5 border-b border-[#1e2a14]">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57] shadow-sm" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e] shadow-sm" />
          <span className="h-3 w-3 rounded-full bg-[#28c840] shadow-sm" />
        </div>
        <span className="ml-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#4a6030]">{title}</span>
      </div>
      <pre className="overflow-x-auto bg-[#040704] p-5 font-mono text-sm leading-relaxed text-emerald-300">
        <code>{children}</code>
      </pre>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-amber-500">{children}</span>
      <div className="flex-1 h-px bg-gradient-to-r from-amber-500/40 via-amber-500/10 to-transparent" />
    </div>
  );
}

function StepCard({ number, title, badge, children }: { number: string; title: string; badge?: string; children: React.ReactNode }) {
  return (
    <div className="relative flex gap-5 rounded-xl border border-[#1e2a14] bg-[#070b05] p-5 overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500/60 via-amber-500/20 to-transparent" />
      <div className="shrink-0 flex items-start pt-0.5">
        <span className="font-mono text-4xl font-black leading-none text-amber-500/20 select-none">{number}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-base font-bold text-foreground">{title}</h3>
          {badge && (
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
              {badge}
            </span>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

function TroubleshootCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#1e2a14] bg-[#070b05] overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3 border-b border-[#1e2a14] bg-[#0a0f06]">
        <div className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
        <h4 className="font-mono text-sm font-semibold text-foreground">{title}</h4>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function LinuxServerPage() {
  return (
    <div className="space-y-12 pb-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(howToJsonLd) }} />

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl border border-[#1e2a14] shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #0d1208 0%, #0a0f06 50%, #060a04 100%)",
        }}
      >
        {/* Grid pattern overlay */}
        {/* Glow blobs */}
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-amber-500/5 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary/8 blur-[80px] pointer-events-none" />

        <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-12">
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 mb-3">
            Deployment Tool
          </span>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl leading-tight">
            BF1942 Linux<br />
            <span className="text-primary">Dedicated Server</span>
          </h1>

          <p className="mt-4 max-w-xl text-slate-400 leading-relaxed">
            Automated setup for running BF1942 servers on modern 64-bit Linux. Handles dependency
            resolution, user creation, systemd services, and firewall config in a single interactive script.
          </p>

          {/* Status pills */}
          <div className="mt-6 flex flex-wrap gap-4 text-xs font-mono">
            {[
              { dot: "bg-emerald-500", label: "6 Distros Supported" },
              { dot: "bg-emerald-500", label: "Multi-Instance Ready" },
              { dot: "bg-amber-500",   label: "BFSMD + Standalone" },
              { dot: "bg-blue-400",    label: "MIT Licensed" },
            ].map(({ dot, label }) => (
              <span key={label} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-slate-300">
                <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                {label}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
              <Link href="https://github.com/hootmeow/bf1942-linux" target="_blank" rel="noreferrer">
                <Github className="mr-2 h-4 w-4" />
                View on GitHub
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ── CAPABILITIES ────────────────────────────────────────────────── */}
      <section>
        <SectionLabel>// Capabilities</SectionLabel>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, label, desc }) => (
            <li
              key={label}
              className="group flex gap-3 rounded-xl border border-[#1e2a14] bg-[#070b05] p-4 transition-colors hover:border-amber-500/30 hover:bg-[#0a0f06]"
            >
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 transition-colors group-hover:bg-amber-500/15">
                <Icon className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <span className="text-sm font-semibold text-foreground">{label}</span>
                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ── QUICK START ─────────────────────────────────────────────────── */}
      <section id="installation">
        <SectionLabel>// Deployment Sequence</SectionLabel>

        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-200/80">
            <span className="font-semibold text-amber-400">Prerequisite:</span>{" "}
            Commands must be run by a user with <code className="rounded bg-amber-500/10 px-1 py-0.5 font-mono text-xs text-amber-300">sudo</code> privileges.
          </p>
        </div>

        <div className="space-y-4">
          <StepCard number="01" title="Download Scripts">
            <TerminalBlock title="bash · download">
              {`# Download main setup script (example: Ubuntu 24.04)
wget https://raw.githubusercontent.com/hootmeow/bf1942-linux/main/installers/ubuntu/ubu_24.0.3_bfsmd_setup.sh

# Download management tool (same file for all distros)
wget https://raw.githubusercontent.com/hootmeow/bf1942-linux/main/bf1942_manager.sh

# Make executable
chmod +x ubu_24.0.3_bfsmd_setup.sh bf1942_manager.sh`}
            </TerminalBlock>
            <p className="mt-3 text-xs text-muted-foreground">
              Replace the script name with your distro's version from the{" "}
              <a href="#distributions" className="text-primary hover:underline">Supported Distributions</a> table below.{" "}
              <code className="rounded bg-muted px-1 font-mono">bf1942_manager.sh</code> is shared across all distros.
            </p>
          </StepCard>

          <StepCard number="02" title="Run the Installer" badge="BFSMD Recommended">
            <TerminalBlock title="bash · install">sudo ./ubu_24.0.3_bfsmd_setup.sh</TerminalBlock>
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-500/80">Interactive Prompts</p>
              <ul className="space-y-2">
                {[
                  ["Installation mode", "Standalone (no remote management) or BFSMD (full GUI via BFRM)"],
                  ["Instance name", "(BFSMD only) — unique name like server1, conquest, tdm"],
                  ["IP address", "Auto-detected; choose local, public, or enter custom"],
                  ["BFSMD version", "(BFSMD only) — v2.0 recommended, or v2.01 for admin/PunkBuster fixes"],
                  ["Firewall rules", "Optional, interactive security level selection"],
                ].map(([key, val]) => (
                  <li key={key} className="flex gap-2 text-xs">
                    <ChevronRight className="h-3 w-3 mt-0.5 shrink-0 text-amber-500/60" />
                    <span>
                      <span className="font-semibold text-foreground">{key}</span>
                      <span className="text-muted-foreground"> — {val}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </StepCard>

          <StepCard number="03" title="Add More Instances" badge="Optional">
            <p className="mb-3 text-xs text-muted-foreground">
              Pass an instance name as an argument. Each instance automatically gets unique ports, its own systemd service, and dedicated CPU cores when available.
            </p>
            <TerminalBlock title="bash · multi-instance">
              {`sudo ./ubu_24.0.3_bfsmd_setup.sh server2
sudo ./ubu_24.0.3_bfsmd_setup.sh conquest
sudo ./ubu_24.0.3_bfsmd_setup.sh tdm`}
            </TerminalBlock>
          </StepCard>
        </div>
      </section>

      {/* ── PORT CONFIGURATION ──────────────────────────────────────────── */}
      <section>
        <SectionLabel>// Port Allocation</SectionLabel>

        {/* How it works */}
        <div className="mb-6 rounded-xl border border-[#1e2a14] bg-[#070b05] overflow-hidden">
          <div className="bg-[#0d1208] px-5 py-3 border-b border-[#1e2a14]">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#4a6030]">How Port Assignment Works</p>
          </div>
          <div className="p-5 space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              When you run the installer with an instance name (e.g. <code className="rounded bg-muted px-1 font-mono text-xs">server1</code>),
              the script calculates a deterministic offset from that name using a CRC-32 checksum,
              then adds it to three base ports. The same name always produces the same ports — on any machine.
            </p>
            <TerminalBlock title="bash · port formula">
              {`# The script computes this internally:
offset = cksum("server1") % 100      # → a value 0–99

game_port = 14567 + offset            # UDP  — players connect here
query_port = 23000 + offset           # UDP  — server browser / ping
mgmt_port  = 14667 + offset           # TCP  — BFRM management`}
            </TerminalBlock>
            <div className="grid gap-3 sm:grid-cols-3 text-xs">
              {[
                { label: "Game Port", proto: "UDP", range: "14567–14666", color: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/5" },
                { label: "Query Port", proto: "UDP", range: "23000–23099", color: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/5" },
                { label: "Mgmt Port", proto: "TCP", range: "14667–14766", color: "text-blue-400", border: "border-blue-500/20", bg: "bg-blue-500/5" },
              ].map(({ label, proto, range, color, border, bg }) => (
                <div key={label} className={`rounded-lg border ${border} ${bg} px-4 py-3`}>
                  <p className="font-semibold text-foreground">{label}</p>
                  <p className={`font-mono mt-1 ${color}`}>{range}</p>
                  <p className="text-muted-foreground mt-0.5">{proto} · offset 0–99</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Conflict detection:</span> If two instance names hash to the same offset,
              the installer detects the port collision and tells you to pick a different name.
              Up to 100 unique port sets are possible from the base configuration.
            </p>
          </div>
        </div>

        {/* Example table */}
        <div className="overflow-hidden rounded-xl border border-[#1e2a14]">
          <div className="bg-[#0d1208] px-5 py-3 border-b border-[#1e2a14]">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#4a6030]">Example Assignments</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-[#1e2a14] hover:bg-transparent">
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Instance Name</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Game (UDP)</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold hidden sm:table-cell">Query (UDP)</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Mgmt (TCP)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {portExamples.map((item) => (
                <TableRow key={item.instance} className="border-[#1e2a14] hover:bg-amber-500/3">
                  <TableCell className="font-mono text-sm font-bold text-amber-400">{item.instance}</TableCell>
                  <TableCell className="font-mono text-sm text-emerald-400/80">{item.game}</TableCell>
                  <TableCell className="font-mono text-sm text-emerald-400/80 hidden sm:table-cell">{item.query}</TableCell>
                  <TableCell className="font-mono text-sm text-blue-400/80">{item.mgmt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground font-mono">
          $ ./bf1942_manager.sh ports{" "}
          <span className="text-muted-foreground/50">— show actual assigned ports for all instances</span>
        </p>
      </section>

      {/* ── MANAGEMENT COMMANDS ─────────────────────────────────────────── */}
      <section>
        <SectionLabel>// Management Commands</SectionLabel>
        <p className="mb-5 text-sm text-muted-foreground">
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">bf1942_manager.sh</code> lives at the repo root and manages all instances regardless of which distro installed them.
        </p>
        <div className="space-y-4">
          <TerminalBlock title="bf1942_manager.sh · reference">
            {`./bf1942_manager.sh list                  # All instances and their status
./bf1942_manager.sh ports                 # Port assignments for all instances
./bf1942_manager.sh status server1        # Detailed status of one instance
./bf1942_manager.sh config server1        # Show config file paths
./bf1942_manager.sh health                # Health check all instances
./bf1942_manager.sh security              # Security audit (passwords, ownership, firewall)
./bf1942_manager.sh logs server1          # Live log tail (Ctrl+C to exit)

sudo ./bf1942_manager.sh start server1
sudo ./bf1942_manager.sh stop server1
sudo ./bf1942_manager.sh restart server1
sudo ./bf1942_manager.sh start-all
sudo ./bf1942_manager.sh stop-all
sudo ./bf1942_manager.sh remove server2   # Removes instance (asks for confirmation)`}
          </TerminalBlock>
          <TerminalBlock title="systemd · direct commands">
            {`# BFSMD instance
sudo systemctl status bfsmd-server1.service
sudo systemctl restart bfsmd-server1.service
journalctl -u bfsmd-server1.service -f

# Standalone server
sudo systemctl status bf1942.service`}
          </TerminalBlock>
        </div>
      </section>

      {/* ── BFRM SETUP ──────────────────────────────────────────────────── */}
      <section id="bfsmd-setup">
        <SectionLabel>// Connect to BFRM</SectionLabel>

        {/* Credentials */}
        <div className="mb-8 overflow-hidden rounded-xl border border-[#1e2a14]">
          <div className="flex items-center justify-between bg-[#0d1208] px-5 py-3 border-b border-[#1e2a14]">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#4a6030]">Default Credentials</p>
            <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-400">
              Change Immediately
            </span>
          </div>
          <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#1e2a14]">
            <div className="px-6 py-5">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Username</p>
              <code className="font-mono text-lg font-bold text-amber-400">bf1942</code>
            </div>
            <div className="px-6 py-5">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Password</p>
              <code className="font-mono text-lg font-bold text-amber-400">battlefield</code>
            </div>
          </div>
          <div className="flex items-center gap-3 border-t border-[#1e2a14] bg-red-950/20 px-5 py-3">
            <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0" />
            <p className="text-xs text-red-300/80">
              Change the default password <strong>immediately</strong> via the Admin tab in BFRM after first login.
            </p>
          </div>
        </div>

        {/* Connection steps */}
        <div className="mb-8">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">Connection Steps</h3>
          <ol className="space-y-3">
            {[
              ["Open BFRM client", "on your Windows machine"],
              ["Connect to", "your-server-ip:management-port"],
              ["Login", "with default credentials above"],
              ["Change password immediately", "Admin tab → Change Password"],
            ].map(([action, detail], i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 font-mono text-xs font-bold text-amber-400">
                  {i + 1}
                </span>
                <span className="text-sm pt-0.5">
                  <span className="font-semibold text-foreground">{action}</span>{" "}
                  <span className="text-muted-foreground">{detail}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Screenshots */}
        {[
          { src: "/images/server/bfsmd_password.png",     alt: "BFSMD Login Screen",       title: "01 · Login",                desc: "Connect with default credentials, then change them immediately." },
          { src: "/images/server/bfsmd_ip_addr.png",      alt: "Set Server IP Address",    title: "02 · Set Server IP",        desc: "Navigate to IP settings and set your server's IP address explicitly." },
          { src: "/images/server/bfsmd_remoteconsole.png",alt: "Remote Console Security",  title: "03 · Secure Remote Console",desc: "Change default remote console password and create secure admin accounts." },
          { src: "/images/server/bfsmd_setmap.png",       alt: "Set Default Map",          title: "04 · Set Default Map",      desc: "Add at least one map to the rotation before starting the server." },
          { src: "/images/server/bfsmd_adminpassword.png",alt: "Set Admin Users",          title: "05 · Update Admin Passwords",desc: "Create secure admin accounts and disable the default bf1942 account." },
        ].map(({ src, alt, title, desc }) => (
          <div key={title} className="mb-6 overflow-hidden rounded-xl border border-[#1e2a14]">
            <div className="bg-[#0d1208] px-5 py-3 border-b border-[#1e2a14]">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-500/80">{title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
            </div>
            <div className="bg-black">
              <img src={src} alt={alt} className="w-full max-w-2xl" />
            </div>
          </div>
        ))}
      </section>

      {/* ── FIREWALL ────────────────────────────────────────────────────── */}
      <section>
        <SectionLabel>// Firewall Configuration</SectionLabel>
        <p className="mb-6 text-sm text-muted-foreground">
          Firewall rules are configured during installation — UFW on Debian/Ubuntu, firewalld on Fedora/RHEL/CentOS.
          For the management port, choose a security posture:
        </p>
        <div className="grid gap-4 sm:grid-cols-3 mb-6">
          {[
            {
              label:   "Open to All",
              tier:    "LOW",
              color:   "text-slate-400",
              border:  "border-[#1e2a14]",
              bg:      "bg-[#070b05]",
              tierBg:  "bg-slate-500/10 text-slate-400 border-slate-500/30",
              points:  ["Anyone can attempt connection", "Still requires password", "Good for testing or behind another firewall"],
            },
            {
              label:   "Restrict to IP",
              tier:    "RECOMMENDED",
              color:   "text-amber-400",
              border:  "border-amber-500/30",
              bg:      "bg-amber-500/5",
              tierBg:  "bg-amber-500/10 text-amber-400 border-amber-500/30",
              points:  ["Only your specified IP can connect", "Firewall + password protection", "Best for static admin IP"],
            },
            {
              label:   "SSH Tunnel",
              tier:    "MAX SECURITY",
              color:   "text-blue-400",
              border:  "border-blue-500/20",
              bg:      "bg-blue-500/5",
              tierBg:  "bg-blue-500/10 text-blue-400 border-blue-500/30",
              points:  ["No direct internet exposure", "All traffic encrypted via SSH", "Port not opened in firewall at all"],
            },
          ].map(({ label, tier, color, border, bg, tierBg, points }) => (
            <div key={label} className={`rounded-xl border ${border} ${bg} p-5`}>
              <div className="flex items-start justify-between gap-2 mb-4">
                <h4 className={`font-bold text-sm ${color}`}>{label}</h4>
                <span className={`rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${tierBg}`}>
                  {tier}
                </span>
              </div>
              <ul className="space-y-2">
                {points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className={`mt-1.5 h-1 w-1 rounded-full shrink-0 ${color.replace("text-", "bg-")}`} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <TerminalBlock title="ssh · tunnel example">
          {`# On your local machine:
ssh -L 14700:localhost:14700 user@your-server-ip

# Then point BFRM at localhost:14700`}
        </TerminalBlock>
      </section>

      {/* ── NETWORK SCENARIOS ───────────────────────────────────────────── */}
      <section>
        <SectionLabel>// Network Scenarios</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              title:  "Home Server (Behind Router)",
              icon:   Radio,
              points: [
                ["During Install", "Choose Local IP (192.168.x.x)"],
                ["Router Config", "Forward Game + Query ports (UDP)"],
                ["Players Connect To", "Your public IP"],
              ],
            },
            {
              title:  "Cloud / VPS (AWS, DigitalOcean…)",
              icon:   Activity,
              points: [
                ["During Install", "Choose Local IP (10.x.x.x or private IP)"],
                ["Cloud Firewall", "Allow Game + Query ports from 0.0.0.0/0"],
                ["Players Connect To", "Instance's public IP"],
              ],
            },
          ].map(({ title, icon: Icon, points }) => (
            <div key={title} className="rounded-xl border border-[#1e2a14] bg-[#070b05] p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 border border-primary/20">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <h4 className="font-semibold text-sm text-foreground">{title}</h4>
              </div>
              <ul className="space-y-2.5">
                {points.map(([label, val]) => (
                  <li key={label} className="flex gap-3 text-xs">
                    <span className="font-semibold text-muted-foreground whitespace-nowrap">{label}:</span>
                    <span className="text-foreground/80">{val}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── TROUBLESHOOTING ─────────────────────────────────────────────── */}
      <section>
        <SectionLabel>// Known Issues · Resolution Protocols</SectionLabel>
        <div className="space-y-4">
          <TroubleshootCard title='"Internal error!" in Logs'>
            <p className="mb-3 text-sm text-muted-foreground">
              <span className="font-semibold text-emerald-400">This is normal.</span>{" "}
              BFSMD v2.0/v2.01 produces these continuously on modern kernels when reading <code className="font-mono text-xs">/proc</code>.
              The server functions perfectly regardless.
            </p>
            <TerminalBlock title="filter logs">
              journalctl -u bfsmd-server1.service -f | grep -v &quot;Internal error&quot;
            </TerminalBlock>
          </TroubleshootCard>

          <TroubleshootCard title="Can't Connect to Server">
            <TerminalBlock title="diagnostics">
              {`# 1. Check service is running
systemctl is-active bfsmd-server1.service

# 2. Check firewall (Debian/Ubuntu)
sudo ufw status
# Check firewall (Fedora/RHEL/CentOS)
sudo firewall-cmd --list-ports

# 3. Verify ports are listening
sudo ss -tulnp | grep 14567

# 4. View live logs
./bf1942_manager.sh logs server1`}
            </TerminalBlock>
          </TroubleshootCard>

          <TroubleshootCard title="Port Conflict During Installation">
            <p className="text-sm text-muted-foreground">
              Try a different instance name — ports are derived from the name hash, so a new name generates a different port set.
              Check existing assignments with{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">./bf1942_manager.sh ports</code>.
            </p>
          </TroubleshootCard>

          <TroubleshootCard title="Can't Login to BFRM">
            <ol className="space-y-2">
              {[
                <>Confirm credentials: <code className="font-mono text-xs text-amber-400">bf1942</code> / <code className="font-mono text-xs text-amber-400">battlefield</code></>,
                <>Confirm management port: <code className="font-mono text-xs">./bf1942_manager.sh ports</code></>,
                "Confirm firewall allows the connection from your IP",
                <>Confirm service is running: <code className="font-mono text-xs">./bf1942_manager.sh status server1</code></>,
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                  <span className="font-mono text-[10px] text-amber-500/60 mt-1 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </TroubleshootCard>
        </div>
      </section>

      {/* ── CONFIGURATION FILES ─────────────────────────────────────────── */}
      <section>
        <SectionLabel>// Configuration Files</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Standalone Server</p>
            <TerminalBlock title="file tree">
              {`/home/bf1942_user/bf1942/mods/bf1942/settings/
├── ServerSettings.con  # Game settings
└── MapList.con         # Map rotation`}
            </TerminalBlock>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">BFSMD Instance</p>
            <TerminalBlock title="file tree">
              {`/home/bf1942_user/instances/<name>/mods/bf1942/settings/
├── servermanager.con   # BFSMD settings
├── useraccess.con      # Admin accounts
├── ServerSettings.con  # Game settings
└── MapList.con         # Map rotation`}
            </TerminalBlock>
          </div>
        </div>
      </section>

      {/* ── ADVANCED USAGE ──────────────────────────────────────────────── */}
      <section>
        <SectionLabel>// Advanced Operations</SectionLabel>
        <div className="space-y-4">
          {/* Instance limits */}
          <div className="overflow-hidden rounded-xl border border-[#1e2a14]">
            <div className="bg-[#0d1208] px-5 py-3 border-b border-[#1e2a14]">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#4a6030]">Instance Limits · Recommended Ceiling</p>
              <p className="mt-0.5 text-xs text-muted-foreground">The script warns if exceeded but won't block you.</p>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-[#1e2a14] hover:bg-transparent">
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">CPU Cores</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Recommended Max Instances</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[["2", "4"], ["4", "8"], ["8", "16"]].map(([cores, max]) => (
                  <TableRow key={cores} className="border-[#1e2a14] hover:bg-amber-500/3">
                    <TableCell className="font-mono text-sm font-bold text-amber-400">{cores}</TableCell>
                    <TableCell className="font-mono text-sm text-foreground/80">{max}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Archive className="h-3.5 w-3.5 text-primary" />
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Backup &amp; Restore</p>
              </div>
              <TerminalBlock title="bash">
                {`# Backup settings
sudo tar -czf server1-backup-$(date +%F).tar.gz \\
  /home/bf1942_user/instances/server1/mods/bf1942/settings/

# Restore
sudo tar -xzf server1-backup-*.tar.gz -C /
sudo systemctl restart bfsmd-server1.service`}
              </TerminalBlock>
            </div>
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Copy className="h-3.5 w-3.5 text-primary" />
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Clone Instance</p>
              </div>
              <TerminalBlock title="bash">
                {`sudo cp -r \\
  /home/bf1942_user/instances/server1/mods/bf1942/settings/* \\
  /home/bf1942_user/instances/server2/mods/bf1942/settings/

# Update port in ServerSettings.con, then:
sudo systemctl restart bfsmd-server2.service`}
              </TerminalBlock>
            </div>
          </div>
        </div>
      </section>

      {/* ── DOWNLOADS ───────────────────────────────────────────────────── */}
      <section>
        <SectionLabel>// BFRM Downloads · Windows Client</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              href:    "https://files.bf1942.online/server/tools/BFRemoteManager20final-patched.zip",
              name:    "BFRM v2.0 Final",
              tag:     "Recommended",
              tagCls:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
              desc:    "Stable release, suitable for most deployments.",
            },
            {
              href:    "https://files.bf1942.online/server/tools/BFRemoteManager201-patched.zip",
              name:    "BFRM v2.01 Patched",
              tag:     "Bug Fixes",
              tagCls:  "bg-blue-500/10 text-blue-400 border-blue-500/30",
              desc:    "Fixes unauthorized admin access and PunkBuster bugs.",
            },
          ].map(({ href, name, tag, tagCls, desc }) => (
            <Link
              key={name}
              href={href}
              className="group flex items-center gap-4 rounded-xl border border-[#1e2a14] bg-[#070b05] p-5 transition-all hover:border-primary/40 hover:bg-[#0a0f06]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 transition-colors group-hover:bg-primary/20">
                <Download className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-foreground">{name}</span>
                  <span className={`rounded-full border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${tagCls}`}>
                    {tag}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── SUPPORTED DISTRIBUTIONS ─────────────────────────────────────── */}
      <section id="distributions">
        <SectionLabel>// Supported Distributions</SectionLabel>
        <div className="overflow-hidden rounded-xl border border-[#1e2a14]">
          <div className="bg-[#0d1208] px-5 py-3 border-b border-[#1e2a14] flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#4a6030]">All distros fully tested and supported</p>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
              6 / 6 Active
            </span>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-[#1e2a14] hover:bg-transparent">
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Distribution</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Script</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground font-semibold hidden md:table-cell">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {distributions.map((d) => (
                <TableRow key={d.distro} className="border-[#1e2a14] hover:bg-amber-500/3">
                  <TableCell className="font-semibold text-sm text-foreground">{d.distro}</TableCell>
                  <TableCell className="font-mono text-xs text-primary/80">{d.script}</TableCell>
                  <TableCell className="text-xs text-muted-foreground hidden md:table-cell">{d.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          See the{" "}
          <Link href="https://github.com/hootmeow/bf1942-linux" className="text-primary hover:underline" target="_blank" rel="noreferrer">
            GitHub repo
          </Link>{" "}
          for the latest scripts and update history.
        </p>
      </section>

      {/* ── PATCHES + LICENSE ───────────────────────────────────────────── */}
      <section className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 rounded-xl border border-[#1e2a14] bg-[#070b05] p-5">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500/80">Applying Patches</p>
          <p className="text-sm text-muted-foreground">
            The{" "}
            <Link href="https://github.com/hootmeow/bf1942-linux/tree/main/patches" className="text-primary hover:underline">
              patches folder
            </Link>{" "}
            contains Python scripts to fix known server bugs. See each patch file for details and instructions.
          </p>
        </div>
        <div className="flex-1 rounded-xl border border-[#1e2a14] bg-[#070b05] p-5">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500/80">License</p>
          <p className="text-sm text-muted-foreground">
            Scripts released under the <span className="text-foreground font-medium">MIT License</span>.
            All Battlefield 1942 game assets remain © Electronic Arts Inc.
          </p>
        </div>
      </section>
    </div>
  );
}
