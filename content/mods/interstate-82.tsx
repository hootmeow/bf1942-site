import React from 'react';
import { ModData } from '@/lib/types';

const Interstate82Data: ModData = {
  name: 'Interstate 82',
  version: '1.81',
  description: 'Drive, race, and fight in car-based combat inspired by Interstate \'76.',
  downloadLinks: [
    { name: "Interstate 82 v1.8 Full", url: "http://www.is82.com/dlm.php?item=503" },
    { name: "Interstate 82 v1.8.1 Patch", url: "http://www.is82.com/dlm.php?item=501" },
  ],
  galleryImages: [
    "/images/mods/is82/is82_gallery_2.png",
    "/images/mods/is82/is82_gallery_3.png",
  ],
  content: (
    <div className="space-y-4">
      <p><b>Interstate 82 (IS82)</b> is a full-conversion modification for Battlefield 1942 that completely removes the infantry-based combat and replaces it with 1970s-style vehicular warfare. Inspired by the classic game *Interstate '76*, this mod is about driving, racing, and car-based combat.</p>
      
      <h3>Gameplay Focus: Vehicular Combat & Parkour</h3>
      <p>IS82 is fundamentally different from any other BF1942 mod. The core gameplay loop is not "Conquest," but rather a unique blend of competitive racing, arena-style deathmatches, and "Competitive Vehicle Parkour". Players battle in weaponized 70s muscle cars across a massive library of over 250 custom maps.</p>
      <p>The mod's core is its "challenge maps," which are graded in difficulty from 1 to 7. These maps test a driver's skill in platforming, racing, and obstacle navigation. Teamwork is crucial, as players in a "convoy" can help each other, and if one player's car is destroyed, they can ride along with another driver.</p>
      
      <h3>Key Features</h3>
      <p>IS82 transforms BF1942 into an entirely new genre:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li><b>Car-Based Combat:</b> All infantry and military vehicles are replaced with a roster of classic cars, each with unique handling and weapon loadouts.</li>
        <li><b>Vehicle Parkour:</b> The primary game mode involves navigating complex challenge maps filled with ramps, jumps, and intricate obstacles.</li>
        <li><b>Arena & Race Modes:</b> Other maps focus on "arena style" combat or straightforward racing.</li>
        <li><b>Massive Map Library:</b> The mod features a huge collection of over 250 maps, each designed specifically for car-based gameplay.</li>
        <li><b>Unique Community:</b> IS82 has fostered a dedicated community focused on skill, stunting, and map creation, which is still active today.</li>
      </ul>
      
      <h3>Impact and Legacy</h3>
      <p>Interstate 82 is a testament to the versatility of the BF1942 engine. It completely sheds the game's military-shooter origins to create a cult-classic racing and stunt game. It is still hosted by several community servers, often paired with other popular mods.</p>
    </div>
  ),
  
  maps: [
    // Add any specific IS82 maps you want to feature here
  ]
};

export default Interstate82Data;