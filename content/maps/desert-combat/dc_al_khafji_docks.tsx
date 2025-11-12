import React from 'react';
import { ModMapData } from '@/lib/types';

const mapData: ModMapData = {
  slug: 'dc_al_khafji_docks', 
  name: 'DC Al Khafji Docks', 
  description: 'Amphibious assault map where US forces must launch a helicopter-based invasion from a carrier against a heavily-defended Iraqi-held port.',
  
  galleryImages: [
    "/images/mods/desert-combat/dc_al_khafji_docks-1.jpg",
  ],

  content: (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">Map Info</h3>
      <p>Set in a large, industrial Middle Eastern port, the map is a classic of asymmetrical warfare, pitting US forces deploying from an offshore aircraft carrier against Iraqi forces defending the mainland. The US must rely on a massive helicopter-based amphibious assault to establish a beachhead in the expansive, open docks. Iraqi forces leverage a powerful, pre-established defense network, including heavy armor and critical anti-aircraft batteries (like the ZSU-23-4). The map's layout forces an intense air-vs-ground battle for the initial objectives, which transitions into a large-scale combined-arms engagement if the US successfully captures a foothold and gains access to their own armor spawns.</p>
      
      <h3 className="text-xl font-semibold text-foreground">Tactical Considerations & Gameplay Flow</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Asymmetrical Air Assault:</strong> The entire match's flow is defined by the US team's opening objective: use transport helicopters (Blackhawks) to ferry infantry from the carrier to a mainland flag. The US has no ground armor at the start.</li>
        <li><strong>Anti-Air Dominance:</strong> This is the Iraqi team's most critical task. The ZSU-23-4 "Shilka," supported by infantry AA, must create a "no-fly zone" over the docks. Denying the initial US helicopter landings is the primary path to an Iraqi victory.</li>
        <li><strong>Air-to-Ground Coordination:</strong> For the US, this is paramount. Attack helicopters (Cobras) must prioritize hunting and suppressing the Iraqi ZSU to create a safe window for the transport helicopters to land their infantry.</li>
        <li><strong>The "Beachhead" Shift:</strong> The battle fundamentally changes if the US successfully captures the Docks. This action provides the US team with its own ground vehicle spawns (M1A1s, LAVs), transforming the fight from an amphibious assault into a conventional ground war.</li>
        <li><strong>Heavy Armor:</strong> Unlike infantry-focused maps, the mid-to-late game of Docks becomes a heavy armor grind. Once the beachhead is set, the battle becomes a push-and-pull between T-72s and M1A1s for control of the open port and the critical bridge chokepoint.</li>
      </ul>
    </div>
  )
};

export default mapData;