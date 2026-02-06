import React from 'react';
import { ModMapData } from '@/lib/types';

const mapData: ModMapData = {
  slug: 'dc_al_khafji_docks',
  name: 'Al Khafji Docks',
  description: 'Amphibious assault map featuring helicopter-based invasion from carrier to heavily-defended port with container maze combat.',

  galleryImages: [
    "/images/mods/desert-combat/dc_al_khafji_docks-1.jpg",
  ],

  content: (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">Map Info</h3>
      <p><strong>Setting:</strong> A large industrial Middle Eastern port with container yards, cranes, and dock infrastructure.</p>
      <p><strong>Start Conditions:</strong> US forces deploy from an offshore carrier; Iraqi forces hold the port.</p>
      <p><strong>Conflict Type:</strong> Asymmetrical amphibious assault transitioning to combined-arms ground war.</p>

      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 my-4">
        <p className="font-semibold text-red-400 mb-2">Asymmetrical Start</p>
        <p className="text-sm">US forces have no ground armor at match start. The entire opening phase depends on helicopter insertion success. Iraqi AA dominance can end the match before US boots hit the ground.</p>
      </div>

      <h3 className="text-xl font-semibold text-foreground">Tactical Considerations & Gameplay Flow</h3>

      <h4 className="text-lg font-medium text-foreground">The Amphibious Breach</h4>
      <p>The entire match flow is defined by the <strong>US team's opening objective</strong>: use transport helicopters (Black Hawks) to ferry infantry from the carrier to a mainland capture point. The US has no ground armor at the start—everything depends on establishing a beachhead.</p>

      <p>This creates a desperate, high-stakes opening phase where helicopter pilots and their passengers are the difference between victory and defeat.</p>

      <h4 className="text-lg font-medium text-foreground">Anti-Air Dominance</h4>
      <p>For Iraqi forces, <strong>AA is the decisive element</strong>. The ZSU-23-4 "Shilka" and infantry-carried Iglas must create a no-fly zone over the docks. Denying US helicopter landings is the primary path to victory.</p>

      <p>Iraqi commanders should position AA assets with overlapping fields of fire covering all viable landing zones.</p>

      <h4 className="text-lg font-medium text-foreground">Container Maze Combat</h4>
      <p>The dock's <strong>shipping container yards</strong> create a labyrinthine infantry environment. Stacked containers provide hard cover, elevation changes, and countless ambush positions. The resulting gameplay is claustrophobic and lethal—every corner could hide an enemy.</p>

      <p>Assault and Spec Ops classes thrive in this environment, while snipers must find elevated positions to be effective.</p>

      <h4 className="text-lg font-medium text-foreground">Crane Sniper Positions</h4>
      <p>The port cranes provide <strong>elevated sniper nests</strong> with commanding views of the dock area. A skilled sniper on a crane can dominate large sections of the map, but these positions are also exposed and easy to locate.</p>

      <p>Counter-sniping and helicopter strafing runs are effective responses to crane campers.</p>

      <h4 className="text-lg font-medium text-foreground">The Beachhead Transition</h4>
      <p>The battle fundamentally changes if the US captures the Docks objective. This grants the US team <strong>ground vehicle spawns</strong> (M1A1s, LAVs), transforming the fight from an amphibious assault into a conventional ground war.</p>

      <p>Iraqi forces must prepare for this transition—falling back to secondary defensive lines rather than committing everything to the waterfront.</p>

      <h4 className="text-lg font-medium text-foreground">Heavy Armor Endgame</h4>
      <p>The mid-to-late game becomes a <strong>heavy armor grind</strong>. Once the beachhead is established, the battle becomes a push-and-pull between T-72s and M1A1s for control of the open port areas and the critical bridge chokepoint.</p>

      <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 mt-4">
        <p className="font-semibold text-green-400 mb-2">Key Tactics</p>
        <ul className="text-sm space-y-2">
          <li><strong>AA Coordination:</strong> Iraqi Shilkas and Iglas must cover all landing zones.</li>
          <li><strong>Air-to-Ground:</strong> US Cobras must hunt Shilkas to open landing windows.</li>
          <li><strong>Container Fighting:</strong> Use the maze for close-quarters ambushes and flanking.</li>
          <li><strong>Crane Awareness:</strong> Check elevated positions for snipers; counter-snipe or strafe.</li>
          <li><strong>Beachhead Priority:</strong> US must capture Docks to unlock armor spawns.</li>
        </ul>
      </div>
    </div>
  )
};

export default mapData;
