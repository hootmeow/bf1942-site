import React from 'react';
import { ModData } from '@/lib/types';

const desertCombatData: ModData = {
  name: 'Desert Combat',
  version: '0.7 and DC Final',
  description: 'Modern warfare overhaul featuring jet fighters, guided missiles, and expanded vehicle combat.',
  downloadLinks: [
    { name: "Desert Combat 0.7 & Final", url: "https://files.bf1942.online/mods/desert-combat/desert_combat.zip" },
  ],
  galleryImages: [
    "/images/mods/desert-combat/dc_gallery_1.jpg",
    "/images/mods/desert-combat/dc_gallery_2.jpg",
    "/images/mods/desert-combat/dc_gallery_3.jpg",
    "/images/mods/desert-combat/dc_gallery_4.png",
    "/images/mods/desert-combat/dc_gallery_5.png",
  ],
  content: (
    <div className="space-y-4">
      <p><b>Desert Combat</b> (DC) is a total-conversion modification for the game Battlefield 1942, originally developed by Trauma Studios under the leadership of Frank DeLise, Brian Holinka and Tim Brophy. It transforms the World War II era of Battlefield 1942 into a modern-era conflict inspired by the Gulf War and early 2000s Middle Eastern warfare. The mod’s engine remains Battlefield 1942’s Refractor engine, but nearly all gameplay assets (vehicles, maps, weapons, factions) are overhauled for contemporary combat.</p>
      
      <h3>Background and Development</h3>
      <p>The project began as a community mod, with the team replacing original WWII assets with modern equivalents and proving highly popular with the Battlefield 1942 player base. According to sources, by version 0.1 the team had already replaced every weapon and added early vehicles and modern hardware. Throughout development, active community feedback guided balancing, especially for vehicles and flight/ballistics of the new modern equipment.</p>
      <p>The success of DC led to the acquisition of Trauma Studios by DICE in 2004, and many of the features and design philosophies of Desert Combat influenced the later development of Battlefield 2.</p>
      
      <h3>Versions</h3>
      <p>Two main public builds of the mod are commonly referenced: version 0.7 (often seen as the community standard) and the “Final” release (sometimes labelled 0.8 or DC Final). The community typically favors version 0.7 for stability and balance; the Final release introduced additional tweaks and effects but also some performance and balance trade-offs.</p>
      
      {/* Tables in JSX need some props changed (border="1" -> border={1}, etc.) */}
      <table border={1} cellSpacing={0} cellPadding={6} className="w-full border-collapse border border-border">
        <thead>
          <tr className="bg-muted">
            <th className="border border-border p-2 text-left">Property</th>
            <th className="border border-border p-2 text-left">Version 0.7</th>
            <th className="border border-border p-2 text-left">Final (0.8)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-border p-2">Release status</td>
            <td className="border border-border p-2">Public release prior to Final; widely adopted</td>
            <td className="border border-border p-2">Official “Final” build following 0.7</td>
          </tr>
          <tr>
            <td className="border border-border p-2">Balance focus</td>
            <td className="border border-border p-2">Highly tuned by developers and community; considered best balanced</td>
            <td className="border border-border p-2">Added new effects, tweaks and some content changes; some servers and players report balance issues</td>
          </tr>
          <tr>
            <td className="border border-border p-2">Performance / stability</td>
            <td className="border border-border p-2">Stable across many servers; heavy community support</td>
            <td className="border border-border p-2">Introduced new visual/weapon effects and minor bugs; some performance overheads</td>
          </tr>
          <tr>
            <td className="border border-border p-2">Content changes</td>
            <td className="border border-border p-2">Core vehicles, maps, weapons and balance established</td>
            <td className="border border-border p-2">Additional effects (missile smoke, icon refactors), some vehicle/weapon behaviour tweaks, some removals of outdated icons/vehicles.</td>
          </tr>
        </tbody>
      </table>
      
      <h3>Key Features</h3>
      <p>Desert Combat overhauls Battlefield 1942 with:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Modern era factions (Coalition vs Opposing Forces) replacing WWII era armies.</li>
        <li>Large roster of modern vehicles (tanks, helicopters, jets, missile systems) and modernised weapons (infantry loadouts, launchers, etc).</li>
        <li>Custom maps and re-themed terrain suited to modern warfare (desert, Middle East, oil fields, coastal zones).</li>
        <li>Refined vehicle physics, flight models, and balance adjustments to fit modern hardware rather than WWII counterparts.</li>
        <li>Support for single-player bots and multiplayer servers, with many community expansions and sub-mods built on top of DC (for example, DC Extended and DC Realism).</li>
      </ul>
      
      <h3>Impact and Legacy</h3>
      <p>Desert Combat quickly became one of the most downloaded and played mods for Battlefield 1942. Its large player base, vehicle‐heavy gameplay and modern setting kept BF1942 active long after many expected its lifespan to fade. Sources note that it earned awards and media attention, and that its design influenced official Battlefield sequels.</p>
      <p>Beyond simply extending BF1942’s lifespan, DC served as a proving ground for modern combined-arms gameplay in the Battlefield series, demonstrating the appeal of large-scale vehicle + infantry + air warfare in a contemporary setting. Many server communities still run DC 0.7 today, and the mod remains a landmark in modding history.</p>
      
      <h3>Installation and Compatibility Notes</h3>
      <p>Players should note the following when installing:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>DC 0.7 requires Battlefield 1942 patched to version 1.6 (or higher depending on platform) for proper multiplayer function.</li>
        <li>The Final version is an update from 0.7; some servers require installing 0.7 first and then applying the Final client patch.</li>
      </ul>
    </div>
  ),
  
  
  
  maps: [
    {
      slug: 'dc_73_easting',
      name: '73 Easting',
      description: 'Desert tank battle featuring armored warfare across open terrain.',
    },
    {
      slug: 'dc_al_khafji_docks',
      name: 'Al Khafji Docks',
      description: 'Urban/Industrial harbor with amphibious assault opportunities.',
    },
    {
      slug: 'dc_basrahs_edge',
      name: "Basrah's Edge",
      description: 'Urban desert city with intense street-to-street combat.',
    },
    {
      slug: 'dc_battle_of_73_easting',
      name: 'Battle of 73 Easting',
      description: 'Night variant of the famous desert tank engagement.',
    },
    {
      slug: 'dc_desert_shield',
      name: 'Desert Shield',
      description: 'Large scale air/ground combat at an airbase.',
    },
    {
      slug: 'dc_inshasi_airbase',
      name: 'Inshasi Airbase',
      description: 'Inland airfield with combined arms warfare.',
    },
    {
      slug: 'dc_lostvillage',
      name: 'Lost Village',
      description: 'Infantry-focused rural valley combat.',
    },
    {
      slug: 'dc_no_fly_zone',
      name: 'No Fly Zone',
      description: 'Mountainous terrain with anti-aircraft focus.',
    },
    {
      slug: 'dc_oil_fields',
      name: 'Oil Fields',
      description: 'Open desert warfare around oil derricks.',
    },
    {
      slug: 'dc_sea_rigs',
      name: 'Sea Rigs',
      description: 'Ocean combat around oil platforms.',
    },
    {
      slug: 'dc_urban_siege',
      name: 'Urban Siege',
      description: 'Dense city combat in an urban environment.',
    },
    {
      slug: 'dc_weapon_storage',
      name: 'Weapon Storage',
      description: 'Bunker and interior focused combat.',
    },
  ]
};

export default desertCombatData;