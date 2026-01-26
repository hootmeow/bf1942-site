import { LucideIcon } from 'lucide-react';

export interface GuideInfo {
  slug: string;
  title: string;
  description: string;
  category?: string;
  color?: string;
  bgColor?: string;
}

/**
 * A list of all guides for the /guide overview page.
 */
export const guidesList = [
  {
    slug: 'installation',
    title: 'Installation Guide',
    category: 'Getting Started',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    description: 'A complete step-by-step guide to install Battlefield 1942 on a modern PC, get online, and apply widescreen fixes.',
  },
  {
    slug: 'player-guide',
    title: "Ultimate Player's Guide",
    category: 'Tactics & Strategy',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    description: "Veteran tactics, hidden mechanics, and advanced strategies for Infantry, Armor, and Air combat.",
  },
  // {
  //   slug: 'performance',
  //   title: 'Performance & Tweaks',
  //   description: 'Learn how to improve framerates, fix mouse lag, and optimize the game for the best experience.'
  // },
  // {
  //   slug: 'mod-install',
  //   title: 'Installing Mods',
  //   description: 'How to properly install, manage, and switch between popular mods like Desert Combat and Forgotten Hope.'
  // },
];