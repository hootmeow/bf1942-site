import React from 'react';
import { ModData } from '@/lib/types';

const GalacticConquestData: ModData = {
  name: 'Galactic Conquest',
  version: '5.3 Final',
  description: 'The original Star Wars total conversion featuring space battles, land warfare, and drivable capital ships in the Galactic Civil War.',
  downloadLinks: [
    { name: "Galactic Conquest 5.3 (ModDB)", url: "https://www.moddb.com/mods/galactic-conquest/downloads/galactic-conquest-53" },
  ],
  galleryImages: [],
  content: (
    <div className="space-y-4">
      <p><b>Galactic Conquest (GC)</b> is a groundbreaking total-conversion modification that transforms Battlefield 1942 into an epic Star Wars experience. Released years before the official Star Wars: Battlefront game, Galactic Conquest was the first large-scale multiplayer game to deliver combined-arms Star Wars combat with massive battles featuring infantry, vehicles, starfighters, and even controllable capital ships.</p>

      <h3>Historical Significance</h3>
      <p>Galactic Conquest holds a unique place in gaming history. When it was released, there was no official way to experience large-scale Star Wars battles in a multiplayer FPS format. The mod proved that there was enormous demand for this type of game, and many consider it a direct influence on LucasArts' decision to develop Star Wars: Battlefront.</p>
      <p>The mod team achieved what seemed impossible at the time - adapting the BF1942 engine to handle space combat, energy weapons, and science fiction vehicles while maintaining the game's signature large-scale combined-arms gameplay.</p>

      <h3>Factions</h3>

      <h4>Galactic Empire</h4>
      <p>The forces of the Emperor, featuring the iconic military might of the dark side:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li><b>Infantry:</b> Stormtroopers, Scout Troopers, Imperial Officers, Snowtroopers, Dark Troopers</li>
        <li><b>Vehicles:</b> AT-AT, AT-ST, Speeder Bikes, TX-130 Tank</li>
        <li><b>Starfighters:</b> TIE Fighter, TIE Interceptor, TIE Bomber, TIE Advanced</li>
        <li><b>Capital Ships:</b> Star Destroyers, various support vessels</li>
      </ul>

      <h4>Rebel Alliance</h4>
      <p>The brave freedom fighters of the Rebellion:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li><b>Infantry:</b> Rebel Soldiers, Rebel Pilots, Wookiee Warriors, Bothan Spies</li>
        <li><b>Vehicles:</b> T-47 Snowspeeder, Combat Landspeeders, Rebel Tanks</li>
        <li><b>Starfighters:</b> X-Wing, Y-Wing, A-Wing, B-Wing</li>
        <li><b>Capital Ships:</b> Mon Calamari Cruisers, Corellian Corvettes, various transports</li>
      </ul>

      <h3>Weapons Arsenal</h3>
      <ul className="list-disc space-y-1 pl-5">
        <li><b>Blasters:</b> E-11 Blaster Rifle, DL-44 Pistol, A280 Rifle, Bowcaster</li>
        <li><b>Heavy Weapons:</b> Rocket Launchers, Repeating Blasters, Thermal Detonators</li>
        <li><b>Special:</b> Lightsabers (limited availability), Ion weapons for droids/vehicles</li>
        <li><b>Equipment:</b> Jetpacks, Grappling Hooks, various grenades</li>
      </ul>

      <h3>Revolutionary Features</h3>

      <h4>Space Combat</h4>
      <p>Galactic Conquest broke new ground with true space battles:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li><b>Zero-Gravity Dogfights:</b> Full 3D movement in space environments</li>
        <li><b>Capital Ship Battles:</b> Star Destroyers and Mon Calamari Cruisers engage in massive fleet actions</li>
        <li><b>Boarding Actions:</b> Land your ship in enemy hangars and fight through the corridors</li>
        <li><b>Mixed Combat:</b> Some maps feature both space and planetary warfare</li>
      </ul>

      <h4>Drivable Capital Ships</h4>
      <p>One of GC's most unique features was the ability to pilot massive capital ships:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>Control Star Destroyers, Mon Calamari Cruisers, and other large vessels</li>
        <li>Coordinate with crew members manning turrets and fighter bays</li>
        <li>Experience the scale of Star Wars fleet combat firsthand</li>
      </ul>

      <h4>Ground Warfare</h4>
      <p>Classic Battlefield-style conquest on iconic Star Wars planets:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li><b>Vehicle Combat:</b> AT-ATs stomping across Hoth, speeder bikes racing through Endor</li>
        <li><b>Combined Arms:</b> Infantry working alongside armor and air support</li>
        <li><b>Authentic Locations:</b> Faithful recreations of movie locations</li>
      </ul>

      <h3>Iconic Maps</h3>

      <h4>Land Battle Maps</h4>
      <ul className="list-disc space-y-1 pl-5">
        <li><b>Hoth:</b> The Battle of Hoth with AT-ATs, Snowspeeders, and the assault on Echo Base</li>
        <li><b>Endor:</b> Forest warfare with speeder bikes and the shield generator assault</li>
        <li><b>Tatooine:</b> Mos Eisley and the surrounding desert, including Jabba's Palace</li>
        <li><b>Yavin 4:</b> The jungle moon and Rebel base from A New Hope</li>
        <li><b>Bespin:</b> Cloud City platforms and the carbon freezing chamber</li>
        <li><b>Geonosis:</b> The arena battle and droid factory from the prequel era</li>
      </ul>

      <h4>Space Battle Maps</h4>
      <ul className="list-disc space-y-1 pl-5">
        <li><b>Death Star Assault:</b> The famous trench run, complete with the exhaust port target</li>
        <li><b>Battle of Endor:</b> The massive fleet engagement from Return of the Jedi</li>
        <li><b>Asteroid Field:</b> Dogfights among the asteroids from The Empire Strikes Back</li>
        <li><b>Various Fleet Battles:</b> Open space engagements between Imperial and Rebel fleets</li>
      </ul>

      <h3>Unique Gameplay Elements</h3>
      <ul className="list-disc space-y-2 pl-5">
        <li><b>Force Powers:</b> Limited Force abilities for certain hero units</li>
        <li><b>Droid Units:</b> Controllable battle droids and astromech droids</li>
        <li><b>Hero Characters:</b> Iconic characters like Darth Vader and Luke Skywalker available on some maps</li>
        <li><b>Ship-to-Ship Combat:</b> Ram enemy vessels, board through breached hulls</li>
        <li><b>Tow Cables:</b> Snowspeeders can actually trip AT-ATs with tow cables</li>
      </ul>

      <h3>Community and Legacy</h3>
      <p>Galactic Conquest developed a passionate community that kept the mod alive for years. The mod demonstrated several important things:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>The BF1942 engine could be adapted far beyond its original WWII setting</li>
        <li>There was massive player demand for large-scale Star Wars multiplayer</li>
        <li>Space combat could work in a Battlefield-style game</li>
        <li>Modders could create experiences rivaling commercial releases</li>
      </ul>
      <p>While Star Wars: Battlefront eventually provided an official alternative, many players still prefer GC's unique features like controllable capital ships and the specific feel of its space combat.</p>

      <h3>Installation Requirements</h3>
      <ul className="list-disc space-y-2 pl-5">
        <li>Battlefield 1942 patched to version 1.6 or higher</li>
        <li>Approximately 800 MB of free disk space</li>
        <li>Version 5.3 is the final official release</li>
      </ul>

      <h3>Note on Versions</h3>
      <p>Several versions of Galactic Conquest exist, including community-made expansions and unofficial updates. Version 5.3 is considered the final "official" release by the original development team. Some community servers may run modified versions with additional content.</p>
    </div>
  ),

  maps: [
    {
      slug: 'gc_hoth',
      name: 'Hoth',
      description: 'The iconic Battle of Hoth featuring AT-ATs, Snowspeeders, and the assault on Echo Base.',
    },
    {
      slug: 'gc_death_star',
      name: 'Death Star Trench Run',
      description: 'Navigate the trench and destroy the Death Star in this recreation of the climactic A New Hope battle.',
    },
    {
      slug: 'gc_endor',
      name: 'Endor',
      description: 'Forest combat with speeder bikes and the assault on the Imperial shield generator bunker.',
    },
  ]
};

export default GalacticConquestData;
