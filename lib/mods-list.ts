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
    version: '8.5',
    description: 'A Star Wars total conversion bringing the galactic civil war to the BF1942 engine.',
  },
];

// --- COMMUNITY & OTHER MODS LIST ---
export const otherModsList: OtherMod[] = [
  {
    name: 'Action Battlefield',
    author: 'v1.152',
    description: 'Fast-paced action modification'
  },
  {
    name: 'Aftermath',
    author: 'v0.6k',
    description: 'Post-war battlefield modification'
  },
  {
    name: 'BF1918',
    author: 'v3.3',
    description: 'World War I total conversion'
  },
  {
    name: 'BF1941',
    author: 'v0.2',
    description: 'Early World War II modification'
  },
  {
    name: 'BF1942',
    author: 'v1.61',
    description: 'Base game'
  },
  {
    name: 'BF2',
    author: 'v1.0',
    description: 'Modern warfare modification'
  },
  {
    name: 'Battlefield: Grand Prix',
    author: 'v2.2',
    description: 'Racing modification'
  },
  {
    name: 'Battlefield Heroes',
    author: 'v5.3F',
    description: 'Cartoon-style combat modification'
  },
  {
    name: 'BFPro',
    author: 'v0.8',
    description: 'Competitive gameplay enhancement'
  },
  {
    name: 'BattleGroup42',
    author: 'Final',
    description: 'Massive WWII expansion with 200 maps'
  },
  {
    name: 'The Conflict in Somalia: Black Hawk Down',
    author: 'v1.0',
    description: 'Somalia conflict recreation'
  },
  {
    name: 'Comike',
    author: 'senkyo_satuei',
    description: 'Japanese community modification'
  },
  {
    name: 'Desert Combat 2',
    author: 'v2.0',
    description: 'Modern warfare sequel'
  },
  {
    name: 'Desert Combat Extended',
    author: 'v0.9.0',
    description: 'Desert Combat expansion (Requires Desert Combat)'
  },
  {
    name: 'Desert Combat Final',
    author: 'v0.8',
    description: 'Desert Combat final version (Requires Desert Combat)'
  },
  {
    name: 'Desert Combat Realism',
    author: 'v1.0',
    description: 'Realistic Desert Combat variant (Requires Desert Combat Final)'
  },
  {
    name: 'DeadCities',
    author: 'v0.135',
    description: 'Urban warfare modification'
  },
  {
    name: 'DEV_GHIBLIMOD',
    author: 'laputa_ohirome',
    description: 'Studio Ghibli themed modification'
  },
  {
    name: 'Forgotten Hope Secret Weapons',
    author: 'v0.621',
    description: 'WWII secret weapons expansion (Requires Forgotten Hope)'
  },
  {
    name: 'Forgotten Honour',
    author: 'v0.8',
    description: 'Historical accuracy enhancement (Requires Forgotten Hope)'
  },
  {
    name: 'Finnish Wars',
    author: 'v1.92c',
    description: 'Winter War and Continuation War'
  },
  {
    name: 'Fragfield',
    author: 'v0.2',
    description: 'Fast-paced fragfest modification'
  },
  {
    name: 'Fun Racing',
    author: 'v0.2',
    description: 'Vehicle racing modification'
  },
  {
    name: 'GCN Mario Kart',
    author: 'v12F',
    description: 'Mario Kart inspired racing'
  },
  {
    name: 'Galactic Conquest Redux',
    author: 'v0.96a',
    description: 'Enhanced Star Wars modification'
  },
  {
    name: 'Hydro Racers',
    author: 'v1.6 beta',
    description: 'Water-based racing modification'
  },
  {
    name: 'Infantry',
    author: 'v1.3',
    description: 'Infantry-focused gameplay'
  },
  {
    name: 'Light of the Rising Sun',
    author: 'v0.45',
    description: 'Pacific Theater modification (Requires Realplayer)'
  },
  {
    name: 'Ohanami',
    author: 'v14',
    description: 'Japanese themed modification'
  },
  {
    name: 'Parallel World',
    author: 'v0.63',
    description: 'Alternate history modification'
  },
  {
    name: 'Pirates',
    author: 'v1.0',
    description: 'Age of sail naval warfare'
  },
  {
    name: 'Player Unknown\'s Battlefield',
    author: 'beta',
    description: 'Battle royale modification'
  },
  {
    name: 'Raised Fist',
    author: 'v0.64',
    description: 'Revolutionary warfare modification'
  },
  {
    name: 'Russian Comrade Mappack',
    author: 'v1.0',
    description: 'Russian Front maps collection'
  },
  {
    name: 'SASUKE',
    author: 'v0.41',
    description: 'Japanese obstacle course modification'
  },
  {
    name: 'Sengoku',
    author: 'v0.15A',
    description: 'Japanese feudal warfare'
  },
  {
    name: 'Siege',
    author: 'v0.32',
    description: 'Medieval siege warfare'
  },
  {
    name: 'Silent Heroes',
    author: 'v1.2',
    description: 'Nordic WWII conflicts'
  },
  {
    name: 'Soccer',
    author: '2023',
    description: 'Football/Soccer modification'
  },
  {
    name: 'Stargate',
    author: 'v0.32 Beta',
    description: 'Stargate universe modification'
  },
  {
    name: 'The Great War',
    author: 'v0.15b',
    description: 'World War I modification'
  },
  {
    name: 'Transformers',
    author: 'v2.003b',
    description: 'Transformers universe modification'
  },
  {
    name: 'WarFront',
    author: 'v3.5',
    description: 'Enhanced combat modification'
  },
  {
    name: 'Wasteland 2042',
    author: 'v1.96',
    description: 'Post-apocalyptic warfare'
  },
  {
    name: 'Xtreme Battlefield',
    author: 'v1.2',
    description: 'Enhanced action modification'
  },
  {
    name: 'The Road to Rome',
    author: 'v1.6',
    description: 'Official expansion pack'
  },
  {
    name: 'Secret Weapons of WWII',
    author: 'v1.6',
    description: 'Official expansion pack'
  },
  {
    name: 'Experience WWII',
    author: 'v2.6',
    description: 'Enhanced WWII realism'
  },
  {
    name: 'zQuake',
    author: 'v0.30',
    description: 'Earthquake-themed modification'
  }
];
