import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Download, Map, MessageCircle, Server, Wrench } from "lucide-react";

// New Metadata from your HTML
export const metadata: Metadata = {
  title: "About | BF1942 Online",
  description: "Learn about BF1942 Online, a community-driven statistics hub for Battlefield 1942, providing live server tracking, player profiles, and detailed round history.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header Text */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          About BF1942 Online
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          BF1942 Online is a passion project built for the Battlefield 1942 community. Our goal is to
          provide a modern, fast, and comprehensive hub for all things stats-related. From tracking live
          servers and detailed player performance to digging through historical round data, this site is
          designed to be the definitive resource for players new and old.
        </p>
      </div>

      {/* What We Offer Card */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">What We Offer</CardTitle>
          <CardDescription>
            A complete toolkit for players, server admins, and community newcomers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Live Statistics</h3>
              <p className="text-muted-foreground">
                Our site is powered by a real-time server browser, allowing you to see every active
                server, its current map, and a live scoreboard. We track player performance over
                time, building detailed player profiles, global leaderboards, and 24/7 server metrics.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Mods & Downloads</h3>
              <p className="text-muted-foreground">
                We serve as a central hub for the game's most popular mods, including Desert Combat,
                Forgotten Hope, and Galactic Conquest. We provide detailed install guides, map lists,
                and secure, high-speed download links from our dedicated file server.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Community Tools & Guides</h3>
              <p className="text-muted-foreground">
                Beyond stats, we offer a growing list of utilities. This includes a comprehensive
                step-by-step Installation Guide to get the game running on a modern PC,
                and powerful tools for admins like our Linux Server Scripts and Server Config Generator.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Community Card */}
      <Card className="border-border/60 bg-card/40 text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Join the Community
          </CardTitle>
          <CardDescription>
            Have questions, feedback, or just want to find a game? Join our official Discord server!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            asChild
            size="lg"
            // Added custom classes for the green button style
            className="bg-emerald-600 text-primary-foreground hover:bg-emerald-700"
          >
            <Link
              href="https://discord.gg/XWkkZnqJnm"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Join Discord
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}