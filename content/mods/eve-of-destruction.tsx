import React from 'react';
import { ModData } from '@/lib/types';

const EveofDestructionData: ModData = {
  name: 'Eve of Destruction',
  version: '2.51',
  description: 'The definitive Vietnam War total conversion featuring asymmetric warfare, helicopter combat, and hundreds of jungle maps.',
  downloadLinks: [
    { name: "Eve of Destruction 2.51 (ModDB)", url: "https://www.moddb.com/mods/eve-of-destruction/downloads/eod-251-full" },
  ],
  galleryImages: [],
  content: (
    <div className="space-y-4">
      <p><b>Eve of Destruction (EoD)</b> is a total-conversion modification that transports Battlefield 1942 from the beaches of Normandy to the rice paddies and jungles of Vietnam. As one of the longest-running and most actively developed mods for the game, EoD delivers an intense, action-packed recreation of the Vietnam War with a focus on the unique asymmetrical warfare that defined the conflict.</p>

      <h3>Development History</h3>
      <p>Eve of Destruction began development shortly after BF1942's release and has been continuously updated for over a decade. The mod predates DICE's official <b>Battlefield: Vietnam</b> release and is widely credited with demonstrating player demand for Vietnam-era gameplay. Version 2.51 represents years of refinement, bug fixes, and content additions.</p>
      <p>The development team's dedication has resulted in one of the most feature-complete mods in BF1942 history, with hundreds of maps and an enormous arsenal of period-accurate equipment.</p>

      <h3>Gameplay Philosophy</h3>
      <p>Unlike hardcore realism mods, Eve of Destruction prioritizes fast-paced, visceral action similar to Desert Combat. The mod captures the <i>feel</i> of Vietnam War movies and media while remaining accessible and fun:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li><b>Action-Oriented:</b> Quick respawns, readily available vehicles, and constant firefights.</li>
        <li><b>Atmospheric:</b> Dense jungle terrain, period music, authentic sound effects, and weather effects.</li>
        <li><b>Asymmetrical:</b> Each side plays differently, reflecting the actual nature of the conflict.</li>
      </ul>

      <h3>Asymmetrical Warfare</h3>
      <p>The core of EoD's gameplay is the fundamental asymmetry between the two sides:</p>

      <h4>United States / ARVN Forces</h4>
      <ul className="list-disc space-y-1 pl-5">
        <li><b>Air Superiority:</b> Extensive helicopter fleet (UH-1 Huey, AH-1 Cobra, CH-47 Chinook) and fixed-wing aircraft (F-4 Phantom, A-4 Skyhawk, F-105 Thunderchief)</li>
        <li><b>Firepower:</b> Artillery support, napalm strikes, gunship support</li>
        <li><b>Mobility:</b> Air assault capability allows rapid troop deployment</li>
        <li><b>Naval Power:</b> PBR river boats, Swift boats, aircraft carriers</li>
        <li><b>Challenge:</b> Must hunt an elusive enemy across vast terrain</li>
      </ul>

      <h4>North Vietnamese Army (NVA) / Viet Cong</h4>
      <ul className="list-disc space-y-1 pl-5">
        <li><b>Tunnel Networks:</b> Hidden spawn points and movement routes</li>
        <li><b>Booby Traps:</b> Punji stick traps, mines, and improvised explosives</li>
        <li><b>Camouflage:</b> Better concealment in jungle terrain</li>
        <li><b>Anti-Aircraft:</b> ZSU-23 and SA-7 missiles to counter US air power</li>
        <li><b>Guerrilla Tactics:</b> Hit-and-run attacks, ambushes from concealment</li>
        <li><b>Limited Armor:</b> PT-76 light tanks, T-54 tanks in later war scenarios</li>
      </ul>

      <h3>Arsenal</h3>

      <h4>US/ARVN Weapons</h4>
      <ul className="list-disc space-y-1 pl-5">
        <li><b>Rifles:</b> M16A1, M14, M1 Carbine, CAR-15</li>
        <li><b>Machine Guns:</b> M60, M1919 Browning</li>
        <li><b>Shotguns:</b> Ithaca 37 "Trench Gun"</li>
        <li><b>Sidearms:</b> M1911, .38 Revolver</li>
        <li><b>Support:</b> M79 Grenade Launcher, M72 LAW, Claymore mines</li>
        <li><b>Flamethrower:</b> M2 Flamethrower for bunker clearing</li>
      </ul>

      <h4>NVA/VC Weapons</h4>
      <ul className="list-disc space-y-1 pl-5">
        <li><b>Rifles:</b> AK-47, SKS, Mosin-Nagant</li>
        <li><b>Machine Guns:</b> RPD, Type 56</li>
        <li><b>Anti-Tank:</b> RPG-7, RPG-2</li>
        <li><b>Support:</b> Stick grenades, satchel charges</li>
        <li><b>Unique:</b> Crossbow with poisoned bolts for silent kills</li>
      </ul>

      <h3>Vehicle Roster</h3>

      <h4>Helicopters</h4>
      <p>Helicopters define Vietnam-era combat, and EoD features an extensive roster:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li><b>UH-1 "Huey":</b> The iconic transport/gunship in multiple variants</li>
        <li><b>AH-1 Cobra:</b> Dedicated attack helicopter</li>
        <li><b>CH-47 Chinook:</b> Heavy transport helicopter</li>
        <li><b>OH-6 Loach:</b> Light observation helicopter</li>
        <li><b>CH-46 Sea Knight:</b> Marine transport helicopter</li>
      </ul>

      <h4>Fixed-Wing Aircraft</h4>
      <ul className="list-disc space-y-1 pl-5">
        <li><b>F-4 Phantom:</b> Multi-role fighter-bomber</li>
        <li><b>F-105 Thunderchief:</b> Strike aircraft</li>
        <li><b>A-4 Skyhawk:</b> Light attack aircraft</li>
        <li><b>A-1 Skyraider:</b> Prop-driven close air support</li>
        <li><b>MiG-17/21:</b> North Vietnamese interceptors</li>
        <li><b>AC-47 "Spooky":</b> Gunship with miniguns</li>
      </ul>

      <h4>Ground Vehicles</h4>
      <ul className="list-disc space-y-1 pl-5">
        <li><b>M48 Patton:</b> Main US tank</li>
        <li><b>M113 APC:</b> Armored personnel carrier</li>
        <li><b>M551 Sheridan:</b> Light tank</li>
        <li><b>PT-76:</b> NVA amphibious tank</li>
        <li><b>T-54/55:</b> NVA main battle tank</li>
        <li><b>Various trucks, jeeps, and motorcycles</b></li>
      </ul>

      <h3>Map Library</h3>
      <p>Eve of Destruction features hundreds of maps spanning the entire Vietnam War:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li><b>Ia Drang Valley:</b> The first major battle between US and NVA forces (1965)</li>
        <li><b>Hue City:</b> Intense urban combat during the Tet Offensive (1968)</li>
        <li><b>Khe Sanh:</b> The famous siege of the Marine base</li>
        <li><b>Hamburger Hill:</b> The bloody assault on Hill 937</li>
        <li><b>Mekong Delta:</b> River patrol and brown water navy operations</li>
        <li><b>Ho Chi Minh Trail:</b> Interdiction missions along the supply route</li>
        <li><b>Operation Rolling Thunder:</b> Air missions over North Vietnam</li>
      </ul>

      <h3>Special Features</h3>
      <ul className="list-disc space-y-2 pl-5">
        <li><b>Tunnel Systems:</b> Viet Cong can spawn from hidden tunnel entrances and move through underground networks.</li>
        <li><b>Booby Traps:</b> Place and trigger various traps including punji stakes and trip-wire explosives.</li>
        <li><b>Vehicle Airlifts:</b> Chinooks can transport vehicles to forward positions.</li>
        <li><b>Napalm Strikes:</b> Call in devastating area-denial weapons.</li>
        <li><b>River Patrol:</b> PBR boats for brown water navy operations on the Mekong.</li>
        <li><b>Dynamic Weather:</b> Monsoon rains, fog, and tropical conditions.</li>
      </ul>

      <h3>Legacy and Influence</h3>
      <p>Eve of Destruction demonstrated the viability of Vietnam as a gaming setting before DICE released the official Battlefield: Vietnam. Many gameplay innovations from EoD, such as helicopter-centric air assault gameplay and asymmetric faction design, influenced later games in the genre.</p>
      <p>The mod remains actively played today, with dedicated servers running the latest version. Its combination of accessible gameplay, atmospheric immersion, and massive content library ensures its continued popularity among the BF1942 community.</p>

      <h3>Installation Requirements</h3>
      <ul className="list-disc space-y-2 pl-5">
        <li>Battlefield 1942 patched to version 1.6 or higher</li>
        <li>Approximately 2 GB of free disk space</li>
        <li>Version 2.51 is a complete standalone installation</li>
      </ul>
    </div>
  ),

  maps: [
    {
      slug: 'eod_ia_drang',
      name: 'Ia Drang Valley',
      description: 'The first major battle between US and NVA forces, featuring intense helicopter air assault operations.',
    },
    {
      slug: 'eod_hue',
      name: 'Hue City',
      description: 'Urban warfare during the Tet Offensive in the streets of the ancient imperial capital.',
    },
    {
      slug: 'eod_khe_sanh',
      name: 'Khe Sanh',
      description: 'The famous 77-day siege of the remote Marine combat base near the DMZ.',
    },
  ]
};

export default EveofDestructionData;
