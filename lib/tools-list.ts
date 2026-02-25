import { Bot, Terminal, FileCode, LucideIcon, BarChart3, ExternalLink, Sparkles, Globe, Download } from 'lucide-react';

export interface ToolInfo {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  category: string;
  color: string;
  bgColor: string;
  external?: boolean;
  author: string;
  authorUrl: string;
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
    author: "OWLCAT",
    authorUrl: "https://github.com/hootmeow",
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
    author: "OWLCAT",
    authorUrl: "https://github.com/hootmeow",
  },
  {
    slug: 'bfstats',
    title: "BFStats.io",
    description: "Comprehensive Battlefield 1942 server browser and stats tracking engine. Features real-time server monitoring and historical player statistics.",
    icon: BarChart3,
    href: "https://bfstats.io",
    category: "Server Browser & Stats",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    external: true,
    author: "Skandia",
    authorUrl: "https://github.com/dylanMunyard",
  },
  {
    slug: 'bf42plus',
    title: "BF1942 Plus",
    description: "Client modification adding various gameplay enhancements and quality of life improvements including widescreen fixes, enhanced visuals, and modern conveniences.",
    icon: Sparkles,
    href: "https://github.com/uuuzbf/bf42plus",
    category: "Game Enhancement",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    external: true,
    author: "uuuzbf",
    authorUrl: "https://github.com/uuuzbf",
  },
  {
    slug: 'bf1942eu',
    title: "BF1942.eu",
    description: "Comprehensive BF1942 information hub by the master server manager. Find server lists, game information, patches, mods, maps, and community resources all in one place.",
    icon: Globe,
    href: "http://bf1942.eu/",
    category: "Community Hub",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    external: true,
    author: "Arkyliën",
    authorUrl: "https://github.com/Ahrkylien",
  },
  {
    slug: 'datafield42',
    title: "DataField42",
    description: "Automatic map and mod download tool for Battlefield 1942. Seamlessly downloads missing content when joining servers, eliminating manual installation hassles.",
    icon: Download,
    href: "https://github.com/Ahrkylien/BF1942-DataField42",
    category: "Game Enhancement",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    external: true,
    author: "Arkyliën",
    authorUrl: "https://github.com/Ahrkylien",
  },
];
