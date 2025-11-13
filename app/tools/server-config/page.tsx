"use client";

import React, { useState } from "react";
import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";

// Note: Metadata export is for static metadata. For dynamic, we'd use generateMetadata.
// Since this is a client component, we'll just keep this in mind if we were on a layout.
// For a page, this is fine, but Next.js might prefer it in a layout or server component.
// For now, we'll focus on the form functionality.

const defaultSettings = {
  "game.serverName": "OWLKITTY",
  "game.serverDedicated": 1,
  "game.serverGameTime": 0,
  "game.serverMaxPlayers": 64,
  "game.serverScoreLimit": 0,
  "game.serverInternet": 1,
  "game.serverNumberOfRounds": 3,
  "game.serverSpawnTime": 20,
  "game.serverSpawnDelay": 3,
  "game.serverGameStartDelay": 20,
  "game.serverGameRoundStartDelay": 10,
  "game.serverSoldierFriendlyFire": 100,
  "game.serverVehicleFriendlyFire": 100,
  "game.serverTicketRatio": 100,
  "game.serverAlliedTeamRatio": 1,
  "game.serverAxisTeamRatio": 1,
  "game.serverCoopAiSkill": 75,
  "game.serverCoopCpu": 20,
  "game.serverPassword": "",
  "game.serverReservedPassword": "",
  "game.serverNumReservedSlots": 0,
  "game.setServerWelcomeMessage": '0 "OWLKITTY"',
  "game.serverBandwidthChokeLimit": 0,
  "game.serverMaxAllowedConnectionType": "CTLanT1",
  "game.serverAllowNoseCam": 1,
  "game.serverFreeCamera": 0,
  "game.serverExternalViews": 1,
  "game.serverAutoBalanceTeams": 0,
  "game.serverNameTagDistance": 50,
  "game.serverNameTagDistanceScope": 300,
  "game.serverKickBack": 0.0,
  "game.serverKickBackOnSplash": 0.0,
  "game.serverSoldierFriendlyFireOnSplash": 100,
  "game.serverVehicleFriendlyFireOnSplash": 100,
  "game.serverIP": "137.184.167.47",
  "game.serverPort": 14567,
  "game.gameSpyLANPort": 0,
  "game.gameSpyPort": 0,
  "game.ASEPort": 0,
  "game.serverHitIndication": 1,
  "game.serverTKPunishMode": 1,
  "game.serverCrossHairCenterPoint": 1,
  "game.serverDeathCameraType": 1,
  "game.serverContentCheck": 1,
  "game.serverEventLogging": 1,
  "game.serverEventLogCompression": 0,
  "game.objectiveAttackerTicketsMod": 100,
  "game.serverPunkBuster": 0,
  "game.serverUnpureMods": '""',
};

type Settings = typeof defaultSettings;

export default function ServerConfigPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    let processedValue: string | number = value;

    if (type === "checkbox") {
      processedValue = (e.target as HTMLInputElement).checked ? 1 : 0;
    }
    if (type === "number") {
      processedValue = value === "" ? "" : parseFloat(value);
    }

    setSettings((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const compileConfig = () => {
    // Special handling for welcome message
    const welcomeMessage = settings["game.setServerWelcomeMessage"];
    const serverName = settings["game.serverName"];
    let finalWelcome = welcomeMessage;
    if (!welcomeMessage.match(/^0\s/)) {
      finalWelcome = `0 "${welcomeMessage.replace(/"/g, "")}"`;
    }
    
    // Ensure server name is quoted
    const finalServerName = `"${serverName.replace(/"/g, "")}"`;

    const configLines = Object.entries({ ...settings, "game.serverName": finalServerName, "game.setServerWelcomeMessage": finalWelcome })
      .map(([key, value]) => {
        // Handle empty strings for passwords explicitly
        if ((key === "game.serverPassword" || key === "game.serverReservedPassword") && value === "") {
          return `${key} ""`;
        }
        if (key === "game.serverUnpureMods" && value === "") {
          return `${key} ""`;
        }
         // Ensure server name is always quoted (handled above but good to double check)
        if (key === "game.serverName") {
           return `${key} ${value}`;
        }
        // Ensure connection type is not quoted
        if (key === "game.serverMaxAllowedConnectionType") {
          return `${key} ${value}`;
        }
        // Handle numeric values
        if (typeof value === "number") {
          // Format floats
          if (key.includes("KickBack")) {
             return `${key} ${value.toFixed(6)}`;
          }
          return `${key} ${value}`;
        }
        // Default to string, quoting if not already quoted (and not welcome msg)
        if (typeof value === 'string' && key !== "game.setServerWelcomeMessage" && key !== "game.serverUnpureMods") {
           return `${key} "${value.replace(/"/g, "")}"`;
        }
        return `${key} ${value}`;
      });

    return configLines.join("\n");
  };

  const handleDownload = () => {
    const configData = compileConfig();
    const blob = new Blob([configData], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "serversettings.con";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Server Config Generator
          </h1>
          <p className="mt-1 text-muted-foreground">
            Build your <code>serversettings.con</code> file with this interactive form.
          </p>
        </div>
        <Button onClick={handleDownload} size="lg">
          <Download className="mr-2 h-4 w-4" />
          Download serversettings.con
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* General Settings */}
          <Card className="border-border/60">
            <CardHeader>
              {/* --- UPDATED: Use as="h2" --- */}
              <CardTitle as="h2">General Settings</CardTitle>
              <CardDescription>
                Basic server identification and access.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <FormInput
                label="Server Name"
                name="game.serverName"
                value={settings["game.serverName"]}
                onChange={handleChange}
                description="The name displayed in the server browser."
              />
              <FormInput
                label="Welcome Message"
                name="game.setServerWelcomeMessage"
                value={settings["game.setServerWelcomeMessage"].toString().match(/^0\s"(.*)"$/)?.[1] || settings["game.serverName"]}
                onChange={(e) => {
                  setSettings(prev => ({...prev, "game.setServerWelcomeMessage": `0 "${e.target.value}"`}))
                }}
                description='The message shown to players on connect. (Prefix "0 " is handled automatically)'
              />
              <FormInput
                label="Server Password"
                name="game.serverPassword"
                type="password"
                value={settings["game.serverPassword"]}
                onChange={handleChange}
                description="Password required to join the server."
              />
              <FormInput
                label="Reserved Slot Password"
                name="game.serverReservedPassword"
                type="password"
                value={settings["game.serverReservedPassword"]}
                onChange={handleChange}
                description="Password for accessing reserved slots."
              />
              <FormInput
                label="Reserved Slots"
                name="game.serverNumReservedSlots"
                type="number"
                min={0}
                max={settings["game.serverMaxPlayers"]}
                value={settings["game.serverNumReservedSlots"]}
                onChange={handleChange}
                description="Number of slots reserved for players with the password."
              />
            </CardContent>
          </Card>

          {/* Gameplay Settings */}
          <Card className="border-border/60">
            <CardHeader>
              {/* --- UPDATED: Use as="h2" --- */}
              <CardTitle as="h2">Gameplay Settings</CardTitle>
              <CardDescription>
                Rules affecting game mode, scoring, and teams.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <FormInput
                label="Max Players"
                name="game.serverMaxPlayers"
                type="number"
                min={1}
                max={64}
                value={settings["game.serverMaxPlayers"]}
                onChange={handleChange}
              />
              <FormInput
                label="Number of Rounds"
                name="game.serverNumberOfRounds"
                type="number"
                min={1}
                value={settings["game.serverNumberOfRounds"]}
                onChange={handleChange}
              />
              <FormInput
                label="Score Limit"
                name="game.serverScoreLimit"
                type="number"
                min={0}
                value={settings["game.serverScoreLimit"]}
                description="0 for no limit."
              />
              <FormInput
                label="Game Time (Minutes)"
                name="game.serverGameTime"
                type="number"
                min={0}
                value={settings["game.serverGameTime"]}
                description="0 for no limit."
              />
              <FormInput
                label="Ticket Ratio"
                name="game.serverTicketRatio"
                type="number"
                min={1}
                value={settings["game.serverTicketRatio"]}
                description="Percentage of default tickets."
              />
              <FormInput
                label="Soldier Friendly Fire"
                name="game.serverSoldierFriendlyFire"
                type="number"
                min={0}
                max={100}
                value={settings["game.serverSoldierFriendlyFire"]}
                description="0-100 (percent damage)."
              />
              <FormInput
                label="Vehicle Friendly Fire"
                name="game.serverVehicleFriendlyFire"
                type="number"
                min={0}
                max={100}
                value={settings["game.serverVehicleFriendlyFire"]}
                description="0-100 (percent damage)."
              />
                <FormInput
                label="Soldier Splash FF"
                name="game.serverSoldierFriendlyFireOnSplash"
                type="number"
                min={0}
                max={100}
                value={settings["game.serverSoldierFriendlyFireOnSplash"]}
                description="0-100 (percent damage)."
              />
              <FormInput
                label="Vehicle Splash FF"
                name="game.serverVehicleFriendlyFireOnSplash"
                type="number"
                min={0}
                max={100}
                value={settings["game.serverVehicleFriendlyFireOnSplash"]}
                description="0-100 (percent damage)."
              />
            </CardContent>
          </Card>
          
           {/* Spawn Settings */}
          <Card className="border-border/60">
            <CardHeader>
              {/* --- UPDATED: Use as="h2" --- */}
              <CardTitle as="h2">Spawn & Delay Settings</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
               <FormInput
                label="Spawn Time (sec)"
                name="game.serverSpawnTime"
                type="number"
                min={0}
                value={settings["game.serverSpawnTime"]}
              />
              <FormInput
                label="Spawn Delay (sec)"
                name="game.serverSpawnDelay"
                type="number"
                min={0}
                value={settings["game.serverSpawnDelay"]}
              />
              <FormInput
                label="Game Start Delay (sec)"
                name="game.serverGameStartDelay"
                type="number"
                min={0}
                value={settings["game.serverGameStartDelay"]}
              />
              <FormInput
                label="Round Start Delay (sec)"
                name="game.serverGameRoundStartDelay"
                type="number"
                min={0}
                value={settings["game.serverGameRoundStartDelay"]}
              />
            </CardContent>
          </Card>

          {/* Co-op Settings */}
          <Card className="border-border/60">
            <CardHeader>
              {/* --- UPDATED: Use as="h2" --- */}
              <CardTitle as="h2">Co-op Settings</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <FormInput
                label="Co-op Bot Skill"
                name="game.serverCoopAiSkill"
                type="number"
                min={0}
                max={100}
                value={settings["game.serverCoopAiSkill"]}
                description="Skill level of AI (0-100)."
              />
              <FormInput
                label="Co-op Bot Count"
                name="game.serverCoopCpu"
                type="number"
                min={0}
                max={64}
                value={settings["game.serverCoopCpu"]}
                description="Number of AI bots."
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-1">
          {/* Network Settings */}
          <Card className="border-border/60">
            <CardHeader>
              {/* --- UPDATED: Use as="h2" --- */}
              <CardTitle as="h2">Network Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormCheckbox
                label="Dedicated Server"
                name="game.serverDedicated"
                checked={settings["game.serverDedicated"] === 1}
                onChange={handleChange}
                description="Server runs as a dedicated instance (1 = On)."
              />
              <FormCheckbox
                label="Internet Server"
                name="game.serverInternet"
                checked={settings["game.serverInternet"] === 1}
                onChange={handleChange}
                description="Server reports to master server (1 = On)."
              />
              <FormInput
                label="Server IP"
                name="game.serverIP"
                value={settings["game.serverIP"]}
                onChange={handleChange}
                description="The public IP address of the server."
              />
              <FormInput
                label="Server Port"
                name="game.serverPort"
                type="number"
                min={1024}
                max={65535}
                value={settings["game.serverPort"]}
                description="Main game port (default 14567)."
              />
              <FormSelect
                label="Max Connection Type"
                name="game.serverMaxAllowedConnectionType"
                value={settings["game.serverMaxAllowedConnectionType"]}
                onChange={handleChange}
                description="Max connection speed allowed."
              >
                <option value="CTModem">Modem</option>
                <option value="CTISDN">ISDN</option>
                <option value="CTDSL">DSL</option>
                <option value="CTCable">Cable</option>
                <option value="CTLanT1">LAN/T1</option>
              </FormSelect>
            </CardContent>
          </Card>

          {/* View Settings */}
          <Card className="border-border/60">
            <CardHeader>
              {/* --- UPDATED: Use as="h2" --- */}
              <CardTitle as="h2">View & Camera Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormCheckbox
                label="Allow Nose Cam"
                name="game.serverAllowNoseCam"
                checked={settings["game.serverAllowNoseCam"] === 1}
                onChange={handleChange}
                description="Allow 1st person view in planes (1 = On)."
              />
              <FormCheckbox
                label="Allow Free Camera"
                name="game.serverFreeCamera"
                checked={settings["game.serverFreeCamera"] === 1}
                onChange={handleChange}
                description="Allow free camera mode (1 = On)."
              />
              <FormCheckbox
                label="Allow External Views"
                name="game.serverExternalViews"
                checked={settings["game.serverExternalViews"] === 1}
                onChange={handleChange}
                description="Allow 3rd person vehicle views (1 = On)."
              />
            </CardContent>
          </Card>

          {/* Misc Settings */}
          <Card className="border-border/60">
            <CardHeader>
              {/* --- UPDATED: Use as="h2" --- */}
              <CardTitle as="h2">Misc. Server Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormCheckbox
                label="Auto-Balance Teams"
                name="game.serverAutoBalanceTeams"
                checked={settings["game.serverAutoBalanceTeams"] === 1}
                onChange={handleChange}
                description="Automatically balance teams (1 = On)."
              />
              <FormCheckbox
                label="Hit Indication"
                name="game.serverHitIndication"
                checked={settings["game.serverHitIndication"] === 1}
                onChange={handleChange}
                description="Show indicator on successful hit (1 = On)."
              />
              <FormSelect
                label="TK Punish Mode"
                name="game.serverTKPunishMode"
                value={settings["game.serverTKPunishMode"]}
                onChange={handleChange}
                description="Action to take on team kill."
              >
                <option value={0}>Nothing</option>
                <option value={1}>Punish</option>
              </FormSelect>
              <FormCheckbox
                label="Content Check"
                name="game.serverContentCheck"
                checked={settings["game.serverContentCheck"] === 1}
                onChange={handleChange}
                description="Verify client game files (1 = On)."
              />
              <FormCheckbox
                label="PunkBuster"
                name="game.serverPunkBuster"
                checked={settings["game.serverPunkBuster"] === 1}
                onChange={handleChange}
                description="Enable PunkBuster (1 = On)."
              />
               <FormCheckbox
                label="Event Logging"
                name="game.serverEventLogging"
                checked={settings["game.serverEventLogging"] === 1}
                onChange={handleChange}
                description="Enable server event logging (1 = On)."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// --- Helper Form Components ---

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  description?: string;
}

function FormInput({ label, name, description, ...props }: FormInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} {...props} />
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

interface FormCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  description?: string;
}

function FormCheckbox({ label, name, description, ...props }: FormCheckboxProps) {
  return (
    <div className="flex items-start gap-3 space-y-0 rounded-md border border-border/60 p-4">
      <input
        type="checkbox"
        id={name}
        name={name}
        className="h-4 w-4 shrink-0 translate-y-0.5 rounded border-border text-primary shadow focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2"
        {...props}
      />
      <div className="space-y-1 leading-none">
        <Label htmlFor={name} className="font-medium">
          {label}
        </Label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  description?: string;
}

function FormSelect({ label, name, description, children, ...props }: FormSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <select
        id={name}
        name={name}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
      >
        {children}
      </select>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}