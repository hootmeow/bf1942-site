import React from 'react';

// A type for a single download link
export interface DownloadLink {
  name: string;
  url: string;
}

// This defines the *full* data for a single map file
export interface ModMapData {
  slug: string;
  name: string;
  description: string;
  galleryImages?: string[]; 
  content: React.ReactNode;
}

// This is just the *basic info* for the list on the mod page
export interface ModMap {
  slug: string;
  name: string;
  description: string;
}

// This defines the full data for a single mod
export interface ModData {
  name: string;
  version: string;
  description: string;
  downloadLinks?: DownloadLink[]; 
  galleryImages?: string[]; 
  content: React.ReactNode;
  maps: ModMap[];
}

// This defines the basic info for the main /mods list
export interface ModInfo {
  slug: string;
  name: string;
  version: string;
  description: string;
}

// --- NEW ---
// For the simple list/table of other mods
export interface OtherMod {
  name: string;
  author: string;
  description: string;
}