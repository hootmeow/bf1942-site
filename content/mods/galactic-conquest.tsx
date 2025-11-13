import React from 'react';
import { ModData } from '@/lib/types';

const GalaticConquestData: ModData = {
  name: 'Galactic Conquest',
  version: '8.1', // You can update this to 8.4 or similar
  description: 'A Star Wars total conversion bringing the galactic civil war to the BF1942 engine.',
  downloadLinks: [
    { name: "Galactic Conquest 8.4", url: "https://www.mediafire.com/file/628jyth54.exe/file" },
  ],
  galleryImages: [
    // Add paths to your GC gallery images here
  ],
  content: (
    <div className="space-y-4">
      <p><b>Galactic Conquest (GC)</b> is a groundbreaking total-conversion modification for Battlefield 1942 that transports the entire game into the Star Wars universe. Created *before* the release of the official *Star Wars: Battlefront*, this mod was one of the first to give players a massive, combined-arms Star Wars experience in a large-scale engine.</p>
      
      <h3>Background and Gameplay</h3>
      <p>The mod allows players to choose between the two iconic factions of the Galactic Civil War: the Galactic Empire and the Rebel Alliance. It replaces all of BF1942's WWII assets with faithfully recreated weapons, vehicles, and locations from the Star Wars saga. Players can pilot X-Wings and TIE Fighters, drive AT-STs, and fight in iconic locations like Hoth, Tatooine, and even the Death Star.</p>
      
      <h3>Key Features</h3>
      <p>Galactic Conquest was revolutionary for its time, introducing features that many fans had only dreamed of:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li><b>Total Star Wars Conversion:</b> All factions, weapons (blasters, thermal detonators), vehicles (X-Wings, TIEs, AT-STs, Speeders), and maps are replaced with Star Wars assets.</li>
        <li><b>Land and Space Battles:</b> The mod features both ground-based combat on planets and unique space battle maps, including a famous Death Star map.</li>
        <li><b>Drivable Capital Ships:</b> A key feature was the ability to control and drive large-sized capital ships, a mechanic that set it apart from many other games.</li>
        <li><b>Iconic Locations:</b> Players can fight in famous battles and locations, including a Cloud City map.</li>
        <li><b>New Units:</b> The mod even features unique units, such as controllable droids.</li>
      </ul>
      
      <h3>Impact and Legacy</h3>
      <p>Galactic Conquest is one of the most beloved and memorable mods in Battlefield history. It proved that the BF1942 engine was capable of handling wildly different settings and demonstrated the massive community demand for a large-scale *Battlefront* game. Its success and dedicated following kept it popular for years, and it is still hosted by community servers today.</p>
    </div>
  ),
  
  maps: [
    // Add any specific GC maps you want to feature here
  ]
};

export default GalaticConquestData;