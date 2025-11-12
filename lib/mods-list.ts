import { ModInfo, OtherMod } from './types'; // Import both types

// This is the "Featured" list
export const modsList: ModInfo[] = [
  {
    slug: 'desert-combat',
    name: 'Desert Combat',
    version: '0.8 Final',
    description: 'Modern warfare overhaul featuring jet fighters, guided missiles, and expanded vehicle combat.',
  },
  {
    slug: 'forgotten-hope',
    name: 'Forgotten Hope',
    version: '0.7',
    description: 'Hyper-detailed World War II expansion with historically accurate arsenals and theaters of war.',
  },
  {
    slug: 'battlegroup42',
    name: 'BattleGroup42',
    version: '1.9',
    description: 'Extended global conflict with 150+ vehicles, naval warfare, and cooperative scenarios.',
  },
  {
    slug: 'eve-of-destruction',
    name: 'Eve of Destruction',
    version: '2.51',
    description: 'Vietnam War total conversion introducing asymmetric gameplay and dense jungle combat.',
  },
  // --- NEWLY ADDED AS REQUESTED ---
  {
    slug: 'interstate-82',
    name: 'Interstate 82',
    version: '1.81', // Using a common version
    description: 'Drive, race, and fight in car-based combat inspired by Interstate \'76.',
  },
  {
    slug: 'galactic-conquest',
    name: 'Galactic Conquest',
    version: '8.1', // Using a common version
    description: 'A Star Wars total conversion bringing the galactic civil war to the BF1942 engine.',
  },
];

// --- NEW LIST ---
export const otherModsList: OtherMod[] = [
  {
    name: 'BF1942 Mario Kart',
    author: 'Community',
    description: 'A fun mod that adds Mario Kart tracks and vehicles to the game.'
  },
  {
    name: 'Homefront',
    author: 'Community',
    description: 'A mod focused on a "what if" scenario of a conflict in the US homeland.'
  },
  {
    name: 'SilentHeroes',
    author: 'Community',
    description: 'Focuses on the unique WWII conflict between Norway, Sweden, and Finland.'
  }
  // Add more as needed
];