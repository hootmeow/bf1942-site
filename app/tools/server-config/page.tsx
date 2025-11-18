"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Download, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; // Note: Requires Shadcn Form component installed
import { Checkbox } from "@/components/ui/checkbox"; // Requires Shadcn Checkbox

// --- Zod Schema Definition ---
const configSchema = z.object({
  serverName: z.string().min(1, "Server name is required"),
  welcomeMessage: z.string(),
  serverPassword: z.string().optional(),
  reservedPassword: z.string().optional(),
  serverIP: z.string().ip({ version: "v4" }).or(z.literal("")),
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

  // Toggles (1 = on, 0 = off for config file, boolean for form)
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
  // If you haven't installed the shadcn Form/Checkbox components yet, 
  // you might see import errors. Run: npx shadcn-ui@latest add form checkbox
  
  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configSchema),
    defaultValues,
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

      {/* We use standard HTML inputs here if Shadcn Form isn't fully set up in your project, 
          but assuming you have it, here is the proper structure. 
          I will use standard div/label/input for maximum compatibility with your current UI kit. */}
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* General */}
        <Card className="border-border/60">
          <CardHeader><CardTitle>General</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Server Name</Label>
              <Input {...form.register("serverName")} />
              {form.formState.errors.serverName && <p className="text-xs text-red-500">{form.formState.errors.serverName.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label>Welcome Message</Label>
              <Input {...form.register("welcomeMessage")} />
            </div>
            <div className="grid gap-2">
              <Label>Password (Optional)</Label>
              <Input type="password" {...form.register("serverPassword")} />
            </div>
          </CardContent>
        </Card>

        {/* Network */}
        <Card className="border-border/60">
          <CardHeader><CardTitle>Network</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>IP Address</Label>
                <Input {...form.register("serverIP")} placeholder="0.0.0.0" />
              </div>
              <div className="grid gap-2">
                <Label>Port</Label>
                <Input type="number" {...form.register("serverPort")} />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" id="dedicated" className="h-4 w-4" {...form.register("dedicated")} />
              <Label htmlFor="dedicated">Dedicated Server</Label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="internet" className="h-4 w-4" {...form.register("internet")} />
              <Label htmlFor="internet">Report to Master Server</Label>
            </div>
          </CardContent>
        </Card>

        {/* Gameplay */}
        <Card className="border-border/60">
          <CardHeader><CardTitle>Gameplay</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Max Players</Label>
              <Input type="number" {...form.register("maxPlayers")} />
            </div>
            <div className="grid gap-2">
              <Label>Rounds</Label>
              <Input type="number" {...form.register("numberOfRounds")} />
            </div>
            <div className="grid gap-2">
              <Label>Soldier FF %</Label>
              <Input type="number" {...form.register("soldierFF")} />
            </div>
            <div className="grid gap-2">
              <Label>Vehicle FF %</Label>
              <Input type="number" {...form.register("vehicleFF")} />
            </div>
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
               <div key={key} className="flex items-center gap-2">
                 <input type="checkbox" id={key} className="h-4 w-4" {...form.register(key as any)} />
                 <Label htmlFor={key}>{label}</Label>
               </div>
             ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}