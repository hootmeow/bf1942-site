import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    FileText,
    ShieldCheck,
    Database,
    Cookie,
    Globe,
    Baby,
    Clock,
    Lock,
    Mail,
    AlertTriangle,
    Scale,
    Server,
    UserX,
    RefreshCw,
    ExternalLink,
    ChevronRight
} from "lucide-react";

export const metadata: Metadata = {
    title: "Terms of Service & Privacy Policy | BF1942 Online",
    description: "Read the Terms of Service and Privacy Policy for BF1942 Online. Learn about data collection, your rights under GDPR and COPPA, and how we protect your information.",
};

// Section component with icon
function Section({
    id,
    icon: Icon,
    title,
    children,
    iconColor = "text-primary"
}: {
    id: string;
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
    iconColor?: string;
}) {
    return (
        <section id={id} className="scroll-mt-24">
            <div className="flex items-start gap-4 mb-4">
                <div className={`p-2.5 rounded-xl bg-primary/10 ${iconColor} shrink-0 mt-0.5`}>
                    <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{title}</h3>
            </div>
            <div className="pl-14 space-y-4 text-muted-foreground leading-relaxed">
                {children}
            </div>
        </section>
    );
}

// Table of contents item
function TocItem({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <a
            href={href}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-1"
        >
            <ChevronRight className="h-3 w-3" />
            {children}
        </a>
    );
}

export default function TosPrivacyPage() {
    return (
        <div className="max-w-5xl mx-auto">
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 px-8 py-12 mb-10">
                <div className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[100px]" />
                <div className="absolute -bottom-10 -left-10 h-[200px] w-[200px] rounded-full bg-blue-500/10 blur-[80px]" />

                <div className="relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <ShieldCheck className="h-8 w-8 text-primary" />
                        <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-3">
                        Terms of Service & Privacy Policy
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Your privacy matters to us. This document explains how we collect, use, and protect your information.
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-3">
                        <Badge variant="outline" className="border-slate-700 bg-slate-800/50 text-slate-300">
                            <Clock className="h-3 w-3 mr-1" />
                            Last Updated: January 14, 2026
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sticky Table of Contents - Desktop */}
                <aside className="hidden lg:block">
                    <div className="sticky top-24 space-y-6">
                        <Card className="border-border/60 bg-card/40">
                            <CardContent className="p-4">
                                <h4 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-primary" />
                                    Terms of Service
                                </h4>
                                <nav className="space-y-0.5">
                                    <TocItem href="#service-description">Service Description</TocItem>
                                    <TocItem href="#user-conduct">User Conduct</TocItem>
                                    <TocItem href="#stat-manipulation">Stat Manipulation</TocItem>
                                    <TocItem href="#intellectual-property">Intellectual Property</TocItem>
                                    <TocItem href="#third-party">Third-Party Links</TocItem>
                                    <TocItem href="#disclaimer">Disclaimer</TocItem>
                                </nav>
                            </CardContent>
                        </Card>

                        <Card className="border-border/60 bg-card/40">
                            <CardContent className="p-4">
                                <h4 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-primary" />
                                    Privacy Policy
                                </h4>
                                <nav className="space-y-0.5">
                                    <TocItem href="#data-collection">Data Collection</TocItem>
                                    <TocItem href="#cookies">Cookies</TocItem>
                                    <TocItem href="#data-retention">Data Retention</TocItem>
                                    <TocItem href="#data-security">Data Security</TocItem>
                                    <TocItem href="#gdpr">Your Rights (GDPR)</TocItem>
                                    <TocItem href="#ccpa">California Privacy (CCPA)</TocItem>
                                    <TocItem href="#coppa">Children's Privacy</TocItem>
                                    <TocItem href="#analytics">Analytics</TocItem>
                                    <TocItem href="#changes">Policy Changes</TocItem>
                                    <TocItem href="#contact">Contact Us</TocItem>
                                </nav>
                            </CardContent>
                        </Card>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-12">
                    {/* Terms of Service */}
                    <Card className="border-border/60 bg-card/40 overflow-hidden">
                        <div className="bg-gradient-to-r from-primary/10 via-transparent to-transparent border-b border-border/40 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/20">
                                    <FileText className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground">Terms of Service</h2>
                                    <p className="text-sm text-muted-foreground">Rules governing your use of BF1942 Online</p>
                                </div>
                            </div>
                        </div>
                        <CardContent className="p-6 space-y-10">
                            <Section id="service-description" icon={Server} title="Description of Service">
                                <p>
                                    BF1942 Online (the "Site" or "Service") provides statistics, leaderboards, and information
                                    related to the video game Battlefield 1942. All gameplay data is captured from publicly
                                    broadcast game servers that choose to participate in our network.
                                </p>
                                <p>
                                    The Service is provided on an <strong>"as is"</strong> and <strong>"as available"</strong> basis.
                                    We make no warranties, expressed or implied, regarding the accuracy, completeness, reliability,
                                    or timeliness of any data displayed on the Site.
                                </p>
                                <p>
                                    By accessing or using the Site, you agree to be bound by these Terms of Service. If you do
                                    not agree to these Terms, you may not use the Site.
                                </p>
                            </Section>

                            <Section id="user-conduct" icon={UserX} title="User Conduct">
                                <p>You agree not to use the Site in any way that:</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Is unlawful, harmful, or fraudulent</li>
                                    <li>Could harm, disable, overburden, or impair the Site or its infrastructure</li>
                                    <li>Involves unauthorized data scraping, crawling, or automated access</li>
                                    <li>Attempts to gain unauthorized access to any systems or accounts</li>
                                    <li>Transmits malicious code, viruses, or any harmful software</li>
                                    <li>Harasses, threatens, or impersonates other users</li>
                                    <li>Violates the intellectual property rights of others</li>
                                </ul>
                                <p>
                                    We reserve the right to terminate access for users who violate these terms without prior notice.
                                </p>
                            </Section>

                            <Section id="stat-manipulation" icon={AlertTriangle} title="Stat Manipulation & Exploits" iconColor="text-amber-500">
                                <div className="p-4 rounded-lg border border-amber-500/30 bg-amber-500/5">
                                    <p className="text-foreground font-medium mb-2">Zero Tolerance Policy</p>
                                    <p>
                                        Stats manipulation, boosting, or using exploits to artificially inflate statistics is
                                        <strong> strictly prohibited</strong>. This includes but is not limited to:
                                    </p>
                                    <ul className="list-disc pl-5 space-y-1 mt-2">
                                        <li>Farming kills on empty or private servers</li>
                                        <li>Using multiple accounts to boost stats</li>
                                        <li>Exploiting game bugs for statistical advantage</li>
                                        <li>Collusion with other players to manipulate rankings</li>
                                    </ul>
                                </div>
                                <p>
                                    Users and servers identified engaging in this behavior will have their accounts flagged,
                                    removed from leaderboards, or permanently blacklisted from the ranking system at our sole discretion.
                                </p>
                            </Section>

                            <Section id="intellectual-property" icon={Scale} title="Intellectual Property">
                                <p>
                                    The design, branding, code, and original content of this Site are the property of BF1942 Online
                                    and are protected by applicable copyright and trademark laws.
                                </p>
                                <p>
                                    <strong>Battlefield 1942</strong> and all associated trademarks, logos, and assets are the
                                    property of Electronic Arts Inc. and DICE. This is an <strong>unofficial fan site</strong> and
                                    is not affiliated with, endorsed by, or sponsored by EA or DICE.
                                </p>
                            </Section>

                            <Section id="third-party" icon={ExternalLink} title="Third-Party Links">
                                <p>
                                    The Site may contain links to third-party websites, services, or downloads (such as game
                                    installers, mods, or community tools) that are not owned or controlled by us.
                                </p>
                                <p>
                                    We have no control over, and assume no responsibility for, the content, privacy policies,
                                    or practices of any third-party sites. You acknowledge and agree that we shall not be
                                    responsible for any damage or loss caused by your use of such external sites.
                                </p>
                            </Section>

                            <Section id="disclaimer" icon={AlertTriangle} title="Disclaimer of Warranties">
                                <p>
                                    THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
                                    BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
                                    NON-INFRINGEMENT.
                                </p>
                                <p>
                                    IN NO EVENT SHALL BF1942 ONLINE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
                                    OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE.
                                </p>
                            </Section>
                        </CardContent>
                    </Card>

                    {/* Privacy Policy */}
                    <Card className="border-border/60 bg-card/40 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-500/10 via-transparent to-transparent border-b border-border/40 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-green-500/20">
                                    <ShieldCheck className="h-6 w-6 text-green-500" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground">Privacy Policy</h2>
                                    <p className="text-sm text-muted-foreground">How we collect, use, and protect your data</p>
                                </div>
                            </div>
                        </div>
                        <CardContent className="p-6 space-y-10">
                            <Section id="data-collection" icon={Database} title="Information We Collect">
                                <p>
                                    We collect different types of information depending on how you interact with our Service:
                                </p>

                                <div className="space-y-4">
                                    <div className="p-4 rounded-lg border border-border/60 bg-card/60">
                                        <h4 className="font-semibold text-foreground mb-2">Public Game Data</h4>
                                        <p className="text-sm">
                                            Player in-game names (aliases), keyhashes (anonymized identifiers), IP addresses of game
                                            servers, and performance statistics are collected from public game servers. This information
                                            is publicly broadcast by game servers and is considered public within the gaming context.
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-lg border border-border/60 bg-card/60">
                                        <h4 className="font-semibold text-foreground mb-2">Account Information (Optional)</h4>
                                        <p className="text-sm">
                                            If you choose to log in via Discord to claim a profile, we collect:
                                        </p>
                                        <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
                                            <li>Discord Username and User ID</li>
                                            <li>Discord Avatar (public)</li>
                                            <li>Email address (for verification only, never shared or used for marketing)</li>
                                        </ul>
                                    </div>

                                    <div className="p-4 rounded-lg border border-border/60 bg-card/60">
                                        <h4 className="font-semibold text-foreground mb-2">Technical Data</h4>
                                        <p className="text-sm">
                                            Our servers and service providers (such as Cloudflare) automatically collect standard
                                            technical data including IP addresses, browser type, device information, and access
                                            times for security, analytics, and performance monitoring. This data is anonymized
                                            and not linked to individual identities.
                                        </p>
                                    </div>
                                </div>
                            </Section>

                            <Section id="cookies" icon={Cookie} title="Use of Cookies">
                                <p>We use minimal, essential cookies to provide our Service:</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>
                                        <strong>Session Cookies:</strong> Manage your login session and keep you authenticated
                                    </li>
                                    <li>
                                        <strong>Security Cookies:</strong> Prevent cross-site request forgery (CSRF) attacks
                                    </li>
                                    <li>
                                        <strong>Preference Cookies:</strong> Remember your theme preference (dark/light mode)
                                    </li>
                                </ul>
                                <p>
                                    We do <strong>not</strong> use cookies for third-party tracking, advertising, or behavioral profiling.
                                    You can configure your browser to reject cookies, but some features may not function properly.
                                </p>
                            </Section>

                            <Section id="data-retention" icon={Clock} title="Data Retention">
                                <p>We retain different types of data for different periods:</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>
                                        <strong>Game Statistics:</strong> Retained indefinitely as historical records for leaderboards
                                        and player profiles
                                    </li>
                                    <li>
                                        <strong>Account Data:</strong> Retained until you request deletion or disconnect your account
                                    </li>
                                    <li>
                                        <strong>Server Logs:</strong> Automatically purged after 90 days
                                    </li>
                                    <li>
                                        <strong>Analytics Data:</strong> Aggregated and anonymized, retained for up to 24 months
                                    </li>
                                </ul>
                            </Section>

                            <Section id="data-security" icon={Lock} title="Data Security">
                                <p>
                                    We implement appropriate technical and organizational measures to protect your data:
                                </p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>All data transmitted via HTTPS/TLS encryption</li>
                                    <li>Database encryption at rest</li>
                                    <li>Regular security audits and updates</li>
                                    <li>Access controls and authentication for administrative functions</li>
                                    <li>DDoS protection via Cloudflare</li>
                                </ul>
                                <p>
                                    While we strive to protect your data, no method of transmission over the Internet is 100% secure.
                                    We cannot guarantee absolute security.
                                </p>
                            </Section>

                            <Section id="gdpr" icon={Globe} title="Your Rights (GDPR)">
                                <p>
                                    If you are a resident of the European Economic Area (EEA), United Kingdom, or Switzerland,
                                    you have the following data protection rights under the General Data Protection Regulation:
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                    {[
                                        { title: "Access", desc: "Request a copy of your personal data" },
                                        { title: "Rectification", desc: "Request correction of inaccurate data" },
                                        { title: "Erasure", desc: "Request deletion of your data" },
                                        { title: "Portability", desc: "Receive your data in a portable format" },
                                        { title: "Restriction", desc: "Request limitation of processing" },
                                        { title: "Objection", desc: "Object to certain types of processing" },
                                    ].map((right) => (
                                        <div key={right.title} className="p-3 rounded-lg border border-border/60 bg-card/60">
                                            <p className="font-semibold text-foreground text-sm">{right.title}</p>
                                            <p className="text-xs text-muted-foreground">{right.desc}</p>
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-4">
                                    To exercise these rights, contact us via our Discord server. We will respond within 30 days.
                                    Note that public game statistics may remain as anonymized historical data.
                                </p>
                            </Section>

                            <Section id="ccpa" icon={Scale} title="California Privacy Rights (CCPA)">
                                <p>
                                    If you are a California resident, you have specific rights under the California Consumer
                                    Privacy Act (CCPA):
                                </p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Right to know what personal information is collected and how it's used</li>
                                    <li>Right to delete personal information (with certain exceptions)</li>
                                    <li>Right to opt-out of the sale of personal information</li>
                                    <li>Right to non-discrimination for exercising your privacy rights</li>
                                </ul>
                                <p>
                                    <strong>We do not sell your personal information.</strong> To make a request, contact us via Discord.
                                </p>
                            </Section>

                            <Section id="coppa" icon={Baby} title="Children's Privacy (COPPA)">
                                <div className="p-4 rounded-lg border border-blue-500/30 bg-blue-500/5">
                                    <p className="text-foreground">
                                        Our Service is not directed to children under the age of 13. We do not knowingly collect
                                        personally identifiable information from children under 13.
                                    </p>
                                </div>
                                <p>
                                    If you are a parent or guardian and believe your child has provided us with personal
                                    information, please contact us immediately. If we discover that a child under 13 has
                                    provided personal information, we will delete it promptly.
                                </p>
                            </Section>

                            <Section id="analytics" icon={RefreshCw} title="Analytics">
                                <p>
                                    We use <strong>Umami Analytics</strong>, a privacy-focused, self-hosted analytics solution
                                    to understand website traffic and usage patterns.
                                </p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Does not use cookies</li>
                                    <li>Does not track you across websites</li>
                                    <li>Does not collect personally identifiable information (PII)</li>
                                    <li>All data is anonymized and aggregated</li>
                                    <li>Compliant with GDPR, CCPA, and PECR</li>
                                </ul>
                            </Section>

                            <Section id="changes" icon={RefreshCw} title="Changes to This Policy">
                                <p>
                                    We may update this Privacy Policy from time to time. We will notify you of any significant
                                    changes by posting the new policy on this page and updating the "Last Updated" date.
                                </p>
                                <p>
                                    Your continued use of the Service after any modifications indicates your acceptance of the
                                    updated terms. We encourage you to review this page periodically.
                                </p>
                            </Section>

                            <Section id="contact" icon={Mail} title="Contact Us">
                                <p>
                                    If you have any questions about these Terms or Privacy Policy, or wish to exercise your
                                    data rights, please contact us:
                                </p>
                                <div className="p-4 rounded-lg border border-border/60 bg-card/60 mt-4">
                                    <p className="font-semibold text-foreground mb-2">Discord Server</p>
                                    <Link
                                        href="https://discord.gg/n2FXvJU4zJ"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline inline-flex items-center gap-1"
                                    >
                                        Join our Discord <ExternalLink className="h-3 w-3" />
                                    </Link>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        This is the fastest way to reach us for support, data requests, or general inquiries.
                                    </p>
                                </div>
                            </Section>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
