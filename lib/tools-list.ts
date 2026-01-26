import { Bot, Terminal, FileCode, LucideIcon } from 'lucide-react';

export interface ToolInfo {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  category: string;
  color: string;
  bgColor: string;
}

export const toolsList: ToolInfo[] = [
  {
    slug: 'map-alert',
    title: "BF1942 Map Alert Bot",
    description: "Receive private DM alerts when your favorite maps start. Includes full slash commands for live server info and player searching.",
    icon: Bot,
    href: "/tools/map-alert",
    category: "Discord Integration",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    slug: 'linux-server',
    title: "Linux BF1942 Server",
    description: "Automated, secure setup script for running a dedicated server on modern 64-bit Linux systems without root privileges.",
    icon: Terminal,
    href: "/tools/linux-server",
    category: "Server Hosting",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },

];
