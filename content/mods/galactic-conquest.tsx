import React from 'react';
import { ModData } from '@/lib/types';

const GalacticConquestData: ModData = {
  name: 'Galactic Conquest',
  version: '8.5',
  description: 'The original Star Wars total conversion featuring space battles, land warfare, and drivable capital ships in the Galactic Civil War.',
  downloadLinks: [
    { name: "Galactic Conquest 8.5 (ModDB)", url: "https://www.moddb.com/mods/battlefield-galactic-conquest/downloads/galactic-conquest-85" },
  ],
  socialLinks: [
    { name: "Official Website", url: "https://battlefieldgalacticconquest.com" },
    { name: "Discord Community", url: "https://discord.gg/KtM223KZkF" },
  ],
  galleryImages: [],
  content: (
    <div className="space-y-6">
      {/* Hero Description */}
      <p className="text-lg leading-relaxed"><b>Galactic Conquest (GC)</b> is a groundbreaking total-conversion modification that transforms Battlefield 1942 into an epic Star Wars experience. Released years before the official Star Wars: Battlefront game, Galactic Conquest was the first large-scale multiplayer game to deliver combined-arms Star Wars combat with massive battles featuring infantry, vehicles, starfighters, and even controllable capital ships.</p>

      {/* Version Banner */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <p className="text-blue-400 font-semibold">⚡ Version 9.0 Coming Soon!</p>
        <p className="text-sm text-muted-foreground mt-1">The next major update is in development. Join the Discord to stay updated on the latest news and releases.</p>
      </div>

      {/* Key Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-border/60 bg-muted/30 rounded-lg p-4">
          <div className="text-2xl mb-2">🚀</div>
          <h4 className="font-semibold mb-1">Space Combat</h4>
          <p className="text-sm text-muted-foreground">Full 3D dogfights and capital ship battles in zero gravity</p>
        </div>
        <div className="border border-border/60 bg-muted/30 rounded-lg p-4">
          <div className="text-2xl mb-2">🎮</div>
          <h4 className="font-semibold mb-1">Drivable Capital Ships</h4>
          <p className="text-sm text-muted-foreground">Pilot Star Destroyers and Mon Calamari Cruisers with your crew</p>
        </div>
        <div className="border border-border/60 bg-muted/30 rounded-lg p-4">
          <div className="text-2xl mb-2">⚔️</div>
          <h4 className="font-semibold mb-1">Combined Arms Warfare</h4>
          <p className="text-sm text-muted-foreground">Infantry, vehicles, and starfighters in massive battles</p>
        </div>
      </div>

      {/* Historical Significance */}
      <div>
        <h3>Historical Significance</h3>
        <div className="space-y-4 mt-3">
          <p>Galactic Conquest holds a unique place in gaming history. When it was released, there was no official way to experience large-scale Star Wars battles in a multiplayer FPS format. The mod proved that there was enormous demand for this type of game, and many consider it a direct influence on LucasArts' decision to develop Star Wars: Battlefront.</p>

          <div className="border-l-4 border-primary/50 bg-muted/20 pl-4 py-3">
            <p className="text-sm italic">The mod team achieved what seemed impossible at the time - adapting the BF1942 engine to handle space combat, energy weapons, and science fiction vehicles while maintaining the game's signature large-scale combined-arms gameplay.</p>
          </div>
        </div>
      </div>

      <h3>Factions</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rebel Alliance */}
        <div className="border border-blue-500/30 bg-blue-500/5 rounded-lg p-5">
          <h4 className="text-blue-400 flex items-center gap-2 mb-3">
            <span className="text-xl">⭐</span>
            Rebel Alliance
          </h4>
          <p className="text-sm leading-relaxed">The more the Empire tightened its grip on the people of the galaxy, the harder the Alliance to restore the Republic fought. Born shortly after Palpatine's transformation of the Old Republic into the New Order, the Alliance started as little more than a rag-tag group of freedom fighters woefully under-equipped to challenge an enemy as mighty as the Galactic Empire. The continued injustices of the Empire, however, brought many into the Rebellion's fold.</p>
        </div>

        {/* Galactic Empire */}
        <div className="border border-red-500/30 bg-red-500/5 rounded-lg p-5">
          <h4 className="text-red-400 flex items-center gap-2 mb-3">
            <span className="text-xl">⚡</span>
            Galactic Empire
          </h4>
          <div className="text-sm leading-relaxed space-y-2">
            <p>From the bloated carcass of the Old Republic, an ambitious politician carved the Galactic Empire, a New Order of government meant to sweep away the injustices and inefficiencies of its predecessor.</p>
            <p>Rather than offer the people of the galaxy newfound hope, the Empire instead became a tyrannical regime, presided over by a shadowy and detached despot steeped in the dark side of the Force.</p>
          </div>
        </div>
      </div>

      <h3>Combat Classes</h3>

      <details className="border border-border/60 bg-card/40 rounded-lg overflow-hidden">
        <summary className="cursor-pointer p-4 font-semibold hover:bg-muted/30 transition-colors flex items-center gap-2">
          <span>⚔️</span>
          <span>View All Classes (6 total)</span>
        </summary>
        <div className="p-5 pt-0 space-y-4 border-t border-border/40">
          <div className="bg-muted/20 rounded-lg p-4">
            <h4 className="font-semibold text-primary mb-2">Trooper</h4>
            <p className="text-sm">Troopers form the backbone of both the Rebel and Imperial forces. They are the most balanced combat class, equipped with weapons that combine a strong rate of fire, accuracy, and range. Armed with the E-11 Blaster Rifle (Empire) or A295 (Alliance), Troopers excel at both close and medium-range combat. Every Trooper also carries grenades, a speeder pistol, and a vibroblade for melee combat.</p>
          </div>

          <div className="bg-muted/20 rounded-lg p-4">
            <h4 className="font-semibold text-primary mb-2">Scout</h4>
            <p className="text-sm">Scouts are by far the most mobile class in GC, and are masters at using the terrain around them. Equipped with long range single-shot rifles (E-11 Special for Empire, Dresselian Rifle for Alliance), scouts can kill any troop on the battlefield in two shots. Scouts have the unique ability to sprint and deploy camouflage, making them ideal for reconnaissance and calling in artillery strikes.</p>
          </div>

          <div className="bg-muted/20 rounded-lg p-4">
            <h4 className="font-semibold text-primary mb-2">Medic</h4>
            <p className="text-sm">Medics are the strongest support class for infantry combat. Their heal rate is phenomenal, meaning that other classes backed by a healing medic will be much more effective at winning infantry battles. Medics are equipped with Disruptors, toxic Gas Grenades (which only damage the opposing team), and "Lethal Injection" - a one-shot-kill melee weapon with very close range.</p>
          </div>

          <div className="bg-muted/20 rounded-lg p-4">
            <h4 className="font-semibold text-primary mb-2">Anti-Vehicular (AV)</h4>
            <p className="text-sm">The AV class is the only player class specifically tooled to offensively fight enemy ground vehicles. AV troops are equipped with rocket launchers capable of dealing damage to almost all vehicles, save the largest capital ships. They carry Flechette Launchers (Empire) or Missile Launchers (Alliance), along with mines that can instantly kill tanks.</p>
          </div>

          <div className="bg-muted/20 rounded-lg p-4">
            <h4 className="font-semibold text-primary mb-2">Engineer</h4>
            <p className="text-sm">Engineers are a critical supporting class. They are the only class that can repair vehicles and construct defensive shields. Engineers carry explosive detonation kits that can be placed and remotely detonated, making them essential for objective-based gameplay. They're also equipped with the Hydrospanner tool for repairs.</p>
          </div>

          <div className="bg-muted/20 rounded-lg p-4">
            <h4 className="font-semibold text-primary mb-2">Heavy Weapons (Special Kit)</h4>
            <p className="text-sm">The Heavy Weapons class is not one of the five core classes and is only available in specific locations. Armed with T-21 (Empire) or Tracker 16 (Alliance) heavy repeating blasters, this class excels in close infantry combat with the fastest fire rate in the game.</p>
          </div>
        </div>
      </details>

      <h3>Capital Ships</h3>

      <details className="border border-border/60 bg-card/40 rounded-lg overflow-hidden">
        <summary className="cursor-pointer p-4 font-semibold hover:bg-muted/30 transition-colors flex items-center gap-2">
          <span>🛸</span>
          <span>View Capital Ships (4 total)</span>
        </summary>
        <div className="p-5 pt-0 space-y-4 border-t border-border/40">
          <div>
            <h4 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
              <span>⚡</span> Imperial Capital Ships
            </h4>
            <div className="space-y-3 ml-4">
              <div className="border-l-2 border-red-500/30 pl-3">
                <p className="text-sm"><b>Imperial Carrack Cruiser:</b> The largest ship in GC with a hangar containing 4 TIE Fighters and 2 Bombers or Interceptors. Features more armor than any other capital ship and two forward-mounted heavy Turbolasers.</p>
              </div>
              <div className="border-l-2 border-red-500/30 pl-3">
                <p className="text-sm"><b>Imperial Lancer Frigate:</b> The Empire's answer to the rebel fighter threat. Armed with several anti-fighter turrets and one lower-mounted heavy turbolaser. Equipped with an escape pod.</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-blue-400 mb-3 flex items-center gap-2">
              <span>⭐</span> Alliance Capital Ships
            </h4>
            <div className="space-y-3 ml-4">
              <div className="border-l-2 border-blue-500/30 pl-3">
                <p className="text-sm"><b>Rebel Nebulon-B Frigate:</b> Hangar contains 1 X-Wing and limited A-Wings or Y-Wings. Features several anti-fighter turrets and two forward-mounted heavy turbolasers.</p>
              </div>
              <div className="border-l-2 border-blue-500/30 pl-3">
                <p className="text-sm"><b>Rebel Blockade Runner:</b> One of the faster and smaller capital ships. Works well as an anti-fighter platform with pilot-controlled forward turbolaser. Equipped with 2 escape pods.</p>
              </div>
            </div>
          </div>
        </div>
      </details>

      <h3>Starfighters</h3>

      <details className="border border-border/60 bg-card/40 rounded-lg overflow-hidden">
        <summary className="cursor-pointer p-4 font-semibold hover:bg-muted/30 transition-colors flex items-center gap-2">
          <span>✈️</span>
          <span>View Starfighters (11 total)</span>
        </summary>
        <div className="p-5 pt-0 space-y-4 border-t border-border/40">
          <div>
            <h4 className="font-semibold text-red-400 mb-3">Imperial Fighters</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-muted/20 rounded p-3">
                <p className="text-sm"><b>TIE Fighter:</b> Basic air and space defender with two forward-mounted blasters. Fast and capable in dogfights. (6.3m)</p>
              </div>
              <div className="bg-muted/20 rounded p-3">
                <p className="text-sm"><b>TIE Interceptor:</b> Space superiority fighter with four blasters and one proton torpedo launcher. Faster than standard TIEs.</p>
              </div>
              <div className="bg-muted/20 rounded p-3">
                <p className="text-sm"><b>TIE Bomber:</b> Slow but heavily armed with bombs for ground and capital ship targets. Two forward blasters. (7.8m)</p>
              </div>
              <div className="bg-muted/20 rounded p-3">
                <p className="text-sm"><b>TIE Advanced (X2):</b> Experimental TIE flown by Darth Vader. Unmatched in speed and maneuverability.</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-blue-400 mb-3">Alliance Fighters</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-muted/20 rounded p-3">
                <p className="text-sm"><b>A-Wing:</b> Fastest non-experimental craft. Excellent interceptor with two lasers and concussion missiles. (9.6m)</p>
              </div>
              <div className="bg-muted/20 rounded p-3">
                <p className="text-sm"><b>X-Wing:</b> Most flexible fighter. Four lasers and twin proton torpedo launchers with R2 droid support. (12.5m)</p>
              </div>
              <div className="bg-muted/20 rounded p-3">
                <p className="text-sm"><b>Y-Wing:</b> Bomber with larger proton torpedo load. Better armored with defensive gunner and R2 droid positions.</p>
              </div>
              <div className="bg-muted/20 rounded p-3">
                <p className="text-sm"><b>E-Wing:</b> Newest generation Rebel craft exclusive to Mon Calamari. Faster and better armored than X-Wing.</p>
              </div>
              <div className="bg-muted/20 rounded p-3">
                <p className="text-sm"><b>B-Wing:</b> Heavy assault starfighter with impressive firepower.</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-400 mb-3">Atmospheric Craft</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-muted/20 rounded p-3">
                <p className="text-sm"><b>T-16 Skyhopper:</b> Light atmospheric craft native to Tatooine. Single blaster with passenger capacity.</p>
              </div>
              <div className="bg-muted/20 rounded p-3">
                <p className="text-sm"><b>Snow Speeder:</b> Hoth-exclusive craft with two forward blasters, rear gunner, and famous harpoon tow cable. (5.3m)</p>
              </div>
            </div>
          </div>
        </div>
      </details>

      <h3>Ground Vehicles</h3>

      <details className="border border-border/60 bg-card/40 rounded-lg overflow-hidden">
        <summary className="cursor-pointer p-4 font-semibold hover:bg-muted/30 transition-colors flex items-center gap-2">
          <span>🚙</span>
          <span>View Ground Vehicles (9 total)</span>
        </summary>
        <div className="p-5 pt-0 space-y-4 border-t border-border/40">
          <div>
            <h4 className="font-semibold text-red-400 mb-3">Imperial Ground Forces</h4>
            <div className="space-y-2">
              <div className="bg-muted/20 rounded p-3">
                <p className="text-sm"><b>AT-AT:</b> The iconic walker from Hoth. Chin guns and side guns with multiple crew positions. (15.5m tall)</p>
              </div>
              <div className="bg-muted/20 rounded p-3">
                <p className="text-sm"><b>AT-ST:</b> Dependable ground attack craft with forward-mounted blasters and grenade launcher. Room for side gunner and commander. (8.6m tall)</p>
              </div>
              <div className="bg-muted/20 rounded p-3">
                <p className="text-sm"><b>Firehawke:</b> Fast Imperial tank equipped with heavy blast cannon. Trades armor for speed.</p>
              </div>
              <div className="bg-muted/20 rounded p-3">
                <p className="text-sm"><b>Speeder Bike:</b> Fastest Imperial ground transport. Carries two players with forward-mounted blaster.</p>
              </div>
              <div className="bg-muted/20 rounded p-3">
                <p className="text-sm"><b>MIAU:</b> Single-shot artillery with large splash damage radius. Vulnerable at close range.</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-blue-400 mb-3">Alliance Ground Forces</h4>
            <div className="space-y-2">
              <div className="bg-muted/20 rounded p-3">
                <p className="text-sm"><b>Landspeeder:</b> Fastest hover transport in the game. Carries two players with better protection than bikes.</p>
              </div>
              <div className="bg-muted/20 rounded p-3">
                <p className="text-sm"><b>T-3B:</b> Top Rebel tank with good armor, two heavy blasters, and short-range artillery position.</p>
              </div>
              <div className="bg-muted/20 rounded p-3">
                <p className="text-sm"><b>T-3Ba:</b> Artillery variant built on T-3B chassis. Fires devastating 3-burst volley equivalent to MIAU rounds.</p>
              </div>
              <div className="bg-muted/20 rounded p-3">
                <p className="text-sm"><b>Amphibion:</b> Mon Calamari craft capable of travel over land and water. Features remote rear turret.</p>
              </div>
            </div>
          </div>
        </div>
      </details>

      <h3>Transports</h3>

      <details className="border border-border/60 bg-card/40 rounded-lg overflow-hidden">
        <summary className="cursor-pointer p-4 font-semibold hover:bg-muted/30 transition-colors flex items-center gap-2">
          <span>🚁</span>
          <span>View Transports (5 total)</span>
        </summary>
        <div className="p-5 pt-0 space-y-4 border-t border-border/40">
          <div>
            <h4 className="font-semibold text-red-400 mb-3">Imperial Transports</h4>
            <div className="space-y-2">
              <div className="bg-muted/20 rounded p-3">
                <p className="text-sm"><b>Lambda Shuttle:</b> Main Imperial transport with mobile spawn point. Holds 6 players. Four forward blasters and rear defense turret. (20m long)</p>
              </div>
              <div className="bg-muted/20 rounded p-3">
                <p className="text-sm"><b>Imperial Landing Craft:</b> Massive transport nearly three times the size of Lambda. Water-landing capable with two crewable defense turrets.</p>
              </div>
              <div className="bg-muted/20 rounded p-3">
                <p className="text-sm"><b>DTAP:</b> Evolution of STAP for quick battlefield transport. Forward anti-infantry gun and rear medium blaster.</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-blue-400 mb-3">Alliance Transports</h4>
            <div className="space-y-2">
              <div className="bg-muted/20 rounded p-3">
                <p className="text-sm"><b>Millennium Falcon:</b> With good crew, functions as fighter/transport hybrid. Concussion missiles and powerful top/bottom turrets. (26.7m long)</p>
              </div>
              <div className="bg-muted/20 rounded p-3">
                <p className="text-sm"><b>Rebel Gunship:</b> Salvaged Republic Gunship with 2 bubble turrets, nose gunner, and full rocket complement.</p>
              </div>
            </div>
          </div>
        </div>
      </details>

      <h3>Droids & Special Units</h3>

      <details className="border border-border/60 bg-card/40 rounded-lg overflow-hidden">
        <summary className="cursor-pointer p-4 font-semibold hover:bg-muted/30 transition-colors flex items-center gap-2">
          <span>🤖</span>
          <span>View Droids (4 total)</span>
        </summary>
        <div className="p-5 pt-0 space-y-2 border-t border-border/40">
          <div className="bg-muted/20 rounded p-3">
            <p className="text-sm"><b>R2 Unit:</b> Repair and healing droid found on Mon Calamari.</p>
          </div>
          <div className="bg-muted/20 rounded p-3">
            <p className="text-sm"><b>R5 Unit:</b> Most common droid. Primary fire heals vehicles and players. Available in Imperial and Rebel versions.</p>
          </div>
          <div className="bg-muted/20 rounded p-3">
            <p className="text-sm"><b>Probe Droid:</b> Only offensive droid with light laser. Can fly and call in scouting positions.</p>
          </div>
          <div className="bg-muted/20 rounded p-3">
            <p className="text-sm"><b>Mouse Droid:</b> Small droid that can charge ankles and capture flags to slow enemy advance.</p>
          </div>
        </div>
      </details>

      <h3>Unique Features & Gameplay</h3>

      <details className="border border-border/60 bg-card/40 rounded-lg overflow-hidden">
        <summary className="cursor-pointer p-4 font-semibold hover:bg-muted/30 transition-colors flex items-center gap-2">
          <span>⭐</span>
          <span>View All Features (11 total)</span>
        </summary>
        <div className="p-5 pt-0 space-y-4 border-t border-border/40">
          {/* Space Combat */}
          <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
            <h4 className="text-purple-400 font-semibold mb-2 flex items-center gap-2">
              <span>🚀</span> Space Combat
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>• Zero-Gravity Dogfights with full 3D movement</div>
              <div>• Capital Ship Battles between massive fleets</div>
              <div>• Boarding Actions through enemy hangars</div>
              <div>• Mixed Combat (space and planetary warfare)</div>
            </div>
          </div>

          {/* Drivable Capital Ships */}
          <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-4">
            <h4 className="text-orange-400 font-semibold mb-2 flex items-center gap-2">
              <span>🛸</span> Drivable Capital Ships
            </h4>
            <div className="text-sm space-y-1">
              <div>• Pilot Star Destroyers and Mon Calamari Cruisers</div>
              <div>• Coordinate with crew manning turrets and fighter bays</div>
              <div>• Experience massive fleet combat firsthand</div>
            </div>
          </div>

          {/* Gameplay Mechanics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="bg-muted/20 rounded p-3 flex items-start gap-2">
              <span className="text-xl">🏃</span>
              <div>
                <h4 className="font-semibold text-sm">Sprint Ability</h4>
                <p className="text-xs text-muted-foreground">Scouts sprint faster and escape danger</p>
              </div>
            </div>

            <div className="bg-muted/20 rounded p-3 flex items-start gap-2">
              <span className="text-xl">👻</span>
              <div>
                <h4 className="font-semibold text-sm">Camouflage</h4>
                <p className="text-xs text-muted-foreground">Scouts deploy camo covers to hide</p>
              </div>
            </div>

            <div className="bg-muted/20 rounded p-3 flex items-start gap-2">
              <span className="text-xl">🛡️</span>
              <div>
                <h4 className="font-semibold text-sm">Defensive Shields</h4>
                <p className="text-xs text-muted-foreground">Engineers construct energy shields</p>
              </div>
            </div>

            <div className="bg-muted/20 rounded p-3 flex items-start gap-2">
              <span className="text-xl">🪂</span>
              <div>
                <h4 className="font-semibold text-sm">Escape Pods</h4>
                <p className="text-xs text-muted-foreground">Emergency evacuation craft with limited fuel</p>
              </div>
            </div>

            <div className="bg-muted/20 rounded p-3 flex items-start gap-2">
              <span className="text-xl">🪢</span>
              <div>
                <h4 className="font-semibold text-sm">Tow Cables</h4>
                <p className="text-xs text-muted-foreground">Snowspeeders trip AT-ATs</p>
              </div>
            </div>

            <div className="bg-muted/20 rounded p-3 flex items-start gap-2">
              <span className="text-xl">💥</span>
              <div>
                <h4 className="font-semibold text-sm">Artillery Strikes</h4>
                <p className="text-xs text-muted-foreground">Scouts call in heavy bombardment</p>
              </div>
            </div>
          </div>
        </div>
      </details>

      <h3>Iconic Maps</h3>

      <details className="border border-border/60 bg-card/40 rounded-lg overflow-hidden">
        <summary className="cursor-pointer p-4 font-semibold hover:bg-muted/30 transition-colors flex items-center gap-2">
          <span>🗺️</span>
          <span>View Maps (10 featured)</span>
        </summary>
        <div className="p-5 pt-0 space-y-4 border-t border-border/40">
          <div>
            <h4 className="font-semibold text-green-400 mb-3">Land Battle Maps</h4>
            <div className="space-y-2">
              <div className="bg-muted/20 rounded p-3 text-sm">
                <b>Hoth:</b> The Battle of Hoth with AT-ATs, Snowspeeders, and the assault on Echo Base
              </div>
              <div className="bg-muted/20 rounded p-3 text-sm">
                <b>Endor:</b> Forest warfare with speeder bikes and the shield generator assault
              </div>
              <div className="bg-muted/20 rounded p-3 text-sm">
                <b>Tatooine:</b> Mos Eisley and the surrounding desert, including Jabba's Palace and Sarlacc pit
              </div>
              <div className="bg-muted/20 rounded p-3 text-sm">
                <b>Yavin 4:</b> The jungle moon and Rebel base from A New Hope
              </div>
              <div className="bg-muted/20 rounded p-3 text-sm">
                <b>Bespin:</b> Cloud City platforms and the carbon freezing chamber
              </div>
              <div className="bg-muted/20 rounded p-3 text-sm">
                <b>Dantooine:</b> Open plains combat with various vehicle engagements
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-blue-400 mb-3">Space Battle Maps</h4>
            <div className="space-y-2">
              <div className="bg-muted/20 rounded p-3 text-sm">
                <b>Death Star Assault:</b> The famous trench run, complete with the exhaust port target
              </div>
              <div className="bg-muted/20 rounded p-3 text-sm">
                <b>Battle of Endor:</b> The massive fleet engagement from Return of the Jedi
              </div>
              <div className="bg-muted/20 rounded p-3 text-sm">
                <b>Judicator:</b> Intense capital ship interior combat
              </div>
              <div className="bg-muted/20 rounded p-3 text-sm">
                <b>Mon Calamari:</b> Space and water warfare around the Mon Calamari homeworld
              </div>
            </div>
          </div>
        </div>
      </details>

      <h3>Community and Legacy</h3>
      <div className="border border-border/60 bg-card/40 rounded-lg p-5 space-y-4">
        <p>Galactic Conquest developed a passionate community that keeps the mod alive to this day. The mod demonstrated several important things:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-start gap-2">
            <span className="text-primary mt-1">✓</span>
            <span className="text-sm">The BF1942 engine could be adapted far beyond its original WWII setting</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary mt-1">✓</span>
            <span className="text-sm">There was massive player demand for large-scale Star Wars multiplayer</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary mt-1">✓</span>
            <span className="text-sm">Space combat could work in a Battlefield-style game</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary mt-1">✓</span>
            <span className="text-sm">Modders could create experiences rivaling commercial releases</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground pt-2 border-t border-border/40">While Star Wars: Battlefront eventually provided an official alternative, many players still prefer GC's unique features like controllable capital ships and the specific feel of its space combat. The mod continues to receive updates and maintains an active player base.</p>
      </div>

      <h3>Installation Requirements</h3>
      <div className="border border-border/60 bg-muted/20 rounded-lg p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💾</span>
            <div>
              <div className="font-semibold text-sm">Base Game</div>
              <div className="text-sm text-muted-foreground">BF1942 v1.6+</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">📦</span>
            <div>
              <div className="font-semibold text-sm">Disk Space</div>
              <div className="text-sm text-muted-foreground">~1 GB required</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔢</span>
            <div>
              <div className="font-semibold text-sm">Version</div>
              <div className="text-sm text-muted-foreground">8.5 (9.0 soon)</div>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-green-500/30 bg-green-500/5 rounded-lg p-5">
        <h3 className="text-green-400 flex items-center gap-2 mb-3">
          <span className="text-xl">💬</span>
          Join the Community
        </h3>
        <p>Connect with other GC players, get support, and stay updated on the latest developments by joining the official Discord server. The community is active and welcoming to both veterans and new players.</p>
      </div>
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
    {
      slug: 'gc_tatooine',
      name: 'Tatooine',
      description: 'Desert warfare including Mos Eisley, Jabba\'s Palace, and the Great Pit of Carkoon.',
    },
    {
      slug: 'gc_bespin',
      name: 'Bespin - Cloud City',
      description: 'Platform-based combat high in the clouds of Bespin with Cloud Cars and unique verticality.',
    },
  ]
};

export default GalacticConquestData;
