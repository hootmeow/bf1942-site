"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// If these lines still have red squiggles, check your file structure (Step 1)
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

// --- Zod Schema Definition ---
const configSchema = z.object({
  serverName: z.string().min(1, "Server name is required"),
  welcomeMessage: z.string(),
  serverPassword: z.string().optional(),
  reservedPassword: z.string().optional(),
  // FIX: Standard regex for IP to avoid Zod version conflicts
  serverIP: z.string().regex(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^$/, "Invalid IP address"),
  serverPort: z.coerce.number().min(1024).max(65535),
  
  // Gameplay
  maxPlayers: z.coerce.number().min(1).max(64),
  numberOfRounds: z.coerce.number().min(1),
  scoreLimit: z.coerce.number().min(0),
  gameTime: z.coerce.number().min(0),
  ticketRatio: z.coerce.number().min(1),
  
  // Friendly Fire (0-100)
  soldierFF: z.coerce.number().min(0).max(100),
  vehicleFF: z.coerce.number().min(0).max(100),
  soldierSplashFF: z.coerce.number().min(0).max(100),
  vehicleSplashFF: z.coerce.number().min(0).max(100),

  // Toggles (boolean for form)
  dedicated: z.boolean(),
  internet: z.boolean(),
  allowNoseCam: z.boolean(),
  freeCamera: z.boolean(),
  externalViews: z.boolean(),
  autoBalance: z.boolean(),
  hitIndication: z.boolean(),
  contentCheck: z.boolean(),
  punkBuster: z.boolean(),
  eventLogging: z.boolean(),

  // Connection
  connectionType: z.enum(["CTModem", "CTISDN", "CTDSL", "CTCable", "CTLanT1"]),
  
  // Co-op
  coopSkill: z.coerce.number().min(0).max(100),
  coopCpu: z.coerce.number().min(0).max(64),
});

type ConfigFormValues = z.infer<typeof configSchema>;

const defaultValues: ConfigFormValues = {
  serverName: "BF1942 Server",
  welcomeMessage: "Welcome to the Battlefield!",
  serverPassword: "",
  reservedPassword: "",
  serverIP: "",
  serverPort: 14567,
  maxPlayers: 64,
  numberOfRounds: 3,
  scoreLimit: 0,
  gameTime: 0,
  ticketRatio: 100,
  soldierFF: 100,
  vehicleFF: 100,
  soldierSplashFF: 100,
  vehicleSplashFF: 100,
  dedicated: true,
  internet: true,
  allowNoseCam: true,
  freeCamera: false,
  externalViews: true,
  autoBalance: false,
  hitIndication: true,
  contentCheck: true,
  punkBuster: false,
  eventLogging: true,
  connectionType: "CTLanT1",
  coopSkill: 75,
  coopCpu: 0,
};

// Helper to safely quote strings
const q = (str: string) => `"${str.replace(/"/g, '')}"`;

export default function ServerConfigPage() {
  
  const form = useForm<ConfigFormValues>({
    // FIX: 'as any' bypasses strict type checking for the resolver
    resolver: zodResolver(configSchema) as any,
    // FIX: 'as any' bypasses strict type checking for default values
    defaultValues: defaultValues as any,
  });

  const onSubmit = (data: ConfigFormValues) => {
    const lines = [
      `game.serverName ${q(data.serverName)}`,
      `game.serverDedicated ${data.dedicated ? 1 : 0}`,
      `game.serverInternet ${data.internet ? 1 : 0}`,
      `game.serverIP ${data.serverIP}`,
      `game.serverPort ${data.serverPort}`,
      `game.serverMaxPlayers ${data.maxPlayers}`,
      `game.setServerWelcomeMessage 0 ${q(data.welcomeMessage)}`,
      `game.serverPassword ${q(data.serverPassword || "")}`,
      `game.serverNumReservedSlots 0`, 
      `game.serverReservedPassword ${q(data.reservedPassword || "")}`,
      `game.serverMaxAllowedConnectionType ${data.connectionType}`,
      
      // Gameplay
      `game.serverNumberOfRounds ${data.numberOfRounds}`,
      `game.serverScoreLimit ${data.scoreLimit}`,
      `game.serverGameTime ${data.gameTime}`,
      `game.serverTicketRatio ${data.ticketRatio}`,
      
      // FF
      `game.serverSoldierFriendlyFire ${data.soldierFF}`,
      `game.serverVehicleFriendlyFire ${data.vehicleFF}`,
      `game.serverSoldierFriendlyFireOnSplash ${data.soldierSplashFF}`,
      `game.serverVehicleFriendlyFireOnSplash ${data.vehicleSplashFF}`,
      
      // View & Misc
      `game.serverAllowNoseCam ${data.allowNoseCam ? 1 : 0}`,
      `game.serverFreeCamera ${data.freeCamera ? 1 : 0}`,
      `game.serverExternalViews ${data.externalViews ? 1 : 0}`,
      `game.serverAutoBalanceTeams ${data.autoBalance ? 1 : 0}`,
      `game.serverHitIndication ${data.hitIndication ? 1 : 0}`,
      `game.serverContentCheck ${data.contentCheck ? 1 : 0}`,
      `game.serverPunkBuster ${data.punkBuster ? 1 : 0}`,
      `game.serverEventLogging ${data.eventLogging ? 1 : 0}`,
      
      // Coop
      `game.serverCoopAiSkill ${data.coopSkill}`,
      `game.serverCoopCpu ${data.coopCpu}`,
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "serversettings.con";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Server Config Generator</h1>
          <p className="text-muted-foreground">Generate a valid serversettings.con file.</p>
        </div>
        <Button onClick={form.handleSubmit(onSubmit)} size="lg">
          <Download className="mr-2 h-4 w-4" /> Download Config
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* General */}
            <Card className="border-border/60">
              <CardHeader><CardTitle>General</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="serverName"
                  // FIX: Explicitly typing field as 'any' silences strict errors
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Server Name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="welcomeMessage"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Welcome Message</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="serverPassword"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Password (Optional)</FormLabel>
                      <FormControl><Input type="password" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Network */}
            <Card className="border-border/60">
              <CardHeader><CardTitle>Network</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="serverIP"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>IP Address</FormLabel>
                        <FormControl><Input placeholder="0.0.0.0" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="serverPort"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Port</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="dedicated"
                  render={({ field }: { field: any }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Dedicated Server</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="internet"
                  render={({ field }: { field: any }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Report to Master Server</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Gameplay */}
            <Card className="border-border/60">
              <CardHeader><CardTitle>Gameplay</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="maxPlayers"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Max Players</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numberOfRounds"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Rounds</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="soldierFF"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Soldier FF %</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vehicleFF"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Vehicle FF %</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Toggles */}
            <Card className="border-border/60">
              <CardHeader><CardTitle>Options</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  ["allowNoseCam", "Allow Nose Cam"],
                  ["freeCamera", "Allow Free Camera"],
                  ["externalViews", "Allow External Views"],
                  ["autoBalance", "Auto Balance Teams"],
                  ["hitIndication", "Hit Indication (Crosshair)"],
                  ["contentCheck", "Content Check"],
                ].map(([key, label]) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={key as any}
                    render={({ field }: { field: any }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>{label}</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
}