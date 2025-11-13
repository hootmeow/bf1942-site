import React from 'react';
import { ModData } from '@/lib/types';

const forgottenHopeData: ModData = {
  name: 'Forgotten Hope',
  version: '0.7',
  description: 'Hyper-detailed World War II expansion with historically accurate arsenals and theaters of war.',
  downloadLinks: [
    { name: "Forgotten Hope 0.7", url: "https://www.moddb.com/mods/forgotten-hope/downloads/forgotten-hope-07-full-win7" }, // <-- FIXED
  ],
  galleryImages: [
    // Add paths to your FH gallery images here
    // e.g., "/images/mods/fh/fh_gallery_1.jpg",
  ],
  content: (
    <div className="space-y-4">
      <p><b>Forgotten Hope (FH)</b> is a total-conversion modification for Battlefield 1942 that focuses on delivering the most historically accurate, realistic, and intense World War II experience possible. It stands as one of the most acclaimed mods for the game, completely overhauling every aspect of the vanilla experience to emphasize realism and tactical teamplay.</p>
      
      <h3>Background and Realism Focus</h3>
      <p>Where the original BF1942 balanced authenticity with arcade-style gameplay, Forgotten Hope's primary goal was realism. The development team meticulously researched historical data to model vehicle armor, weapon ballistics, and equipment. This mod is known for its unforgiving combat, where a single shot is often lethal and strategic positioning is paramount.</p>
      <p>The mod features over 250 new pieces of authentic equipment, far exceeding the original game. This includes everything from the massive Russian IS-2 heavy tank to the British Fairey Swordfish biplane. New factions were also introduced, such as the Polish and French armies.</p>
      
      <h3>Key Gameplay Changes</h3>
      <p>Forgotten Hope is not just a content pack; it fundamentally changes the core gameplay mechanics of Battlefield 1942:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li><b>Advanced Armor System:</b> Tank combat is revolutionized. A complex armor code means shells must penetrate actual armor thickness, which varies by the tank's side (front, side, rear). This makes flanking and using the correct anti-tank weapon critical.</li>
        <li><b>Class and Kit Overhaul:</b> The Pilot class is now the only class equipped with a parachute. Sniper rifles are no longer a standard class weapon; instead, sniper "kits" must be picked up at strategic locations on the map.</li>
        <li><b>New Deployable Weapons:</b> Infantry can find and deploy heavy machine guns to create defensive strongpoints. Towed anti-tank and anti-aircraft guns can be moved by trucks and set up for ambushes.</li>
        <li><b>New Factions and Maps:</b> The mod includes a massive library of custom maps set across all theaters of the war, including many not seen in the original game, like the 1940 Battle of France.</li>
      </ul>
      
      <h3>Impact and Legacy</h3>
      <p>Forgotten Hope is often considered the high-water mark for realism in the *Battlefield* modding scene. Its success and massive content library led to the creation of an unofficial (but highly popular) expansion, *Forgotten Hope: Secret Weapon* (FHSW), which added experimental and prototype weapons of the war. The core principles of FH also heavily influenced its sequel, *Forgotten Hope 2*, a mod for *Battlefield 2*.</p>
      
      <h3>Installation and Compatibility Notes</h3>
      <p>The community standard version is widely considered to be <b>0.7</b>. This version is the most balanced and is still played on community servers today. Installation requires a BF1942 game patched to version 1.6 or higher.</p>
    </div>
  ),
  
  maps: [
    // Add any specific FH maps you want to feature here
    // { 
    //   slug: 'fh_map_slug', 
    //   name: 'FH Map Name',  
    //   description: 'Description of the map.',
    // },
  ]
};

export default forgottenHopeData;