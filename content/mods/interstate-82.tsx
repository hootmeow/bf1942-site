import React from 'react';
import { ModData } from '@/lib/types';

const Interstate82Data: ModData = {
  name: 'Interstate 82',
  version: '1.81',
  description: 'A unique vehicular combat and stunt driving mod featuring 1970s muscle cars, competitive parkour challenges, and over 250 custom maps.',
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
      <p><b>Interstate 82 (IS82)</b> is one of the most unique modifications ever created for Battlefield 1942. Unlike every other major mod that focuses on military combat, IS82 completely transforms the game into a vehicular combat and stunt driving experience inspired by the classic 1997 game Interstate '76 and 1970s car culture.</p>

      <h3>A Completely Different Game</h3>
      <p>IS82 strips away virtually everything that makes Battlefield 1942 a military shooter. There's no infantry combat, no military vehicles, and no traditional conquest gameplay. Instead, players drive weaponized 1970s-era vehicles across an enormous library of custom maps designed specifically for racing, stunts, and car combat.</p>
      <p>The mod is a testament to the flexibility of the BF1942 engine and the creativity of its modding community. It proves that the same engine that powers intense WWII battles can also deliver an entirely different genre of gameplay.</p>

      <h3>Core Gameplay Modes</h3>

      <h4>Competitive Vehicle Parkour</h4>
      <p>The heart of IS82 is its unique "challenge map" system. These maps are graded on a difficulty scale from 1 to 7 and test players' driving skills in increasingly complex obstacle courses:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li><b>Precision Platforming:</b> Navigate narrow platforms, execute precise jumps, and thread through tight gaps.</li>
        <li><b>Ramp Sequences:</b> Chain together jumps across massive gaps using carefully placed ramps.</li>
        <li><b>Timing Challenges:</b> Moving platforms, rotating obstacles, and timed sequences.</li>
        <li><b>Physics Puzzles:</b> Use vehicle momentum and physics to reach seemingly impossible areas.</li>
        <li><b>Convoy Runs:</b> Complete challenges as a team, with successful drivers helping those who fall.</li>
      </ul>

      <h4>Arena Combat</h4>
      <p>Classic vehicular deathmatch in purpose-built arenas:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>Weapons mounted on vehicles for drive-by combat</li>
        <li>Power-ups scattered around arenas</li>
        <li>Destructible environments</li>
        <li>Team-based and free-for-all modes</li>
      </ul>

      <h4>Racing</h4>
      <p>Straightforward racing maps for competitive speed runs:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>Circuit races with multiple laps</li>
        <li>Point-to-point rally stages</li>
        <li>Checkpoint-based time trials</li>
      </ul>

      <h3>Vehicle Roster</h3>
      <p>IS82 features a roster of vehicles inspired by classic American muscle cars and 1970s automotive design:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li><b>Muscle Cars:</b> Various models inspired by Mustangs, Camaros, Challengers, and other iconic designs</li>
        <li><b>Hot Rods:</b> Customized vehicles with enhanced performance</li>
        <li><b>Trucks:</b> Larger, heavier vehicles with different handling characteristics</li>
        <li><b>Special Vehicles:</b> Unique designs created specifically for the mod</li>
      </ul>
      <p>Each vehicle has distinct handling characteristics, encouraging players to find the car that best suits their driving style. Some vehicles excel at precision platforming while others are better for combat or speed.</p>

      <h3>Map Library</h3>
      <p>IS82 boasts one of the largest custom map libraries of any BF1942 mod, with over 250 maps designed specifically for vehicular gameplay:</p>

      <h4>Challenge Maps (Difficulty 1-7)</h4>
      <ul className="list-disc space-y-1 pl-5">
        <li><b>Beginner (1-2):</b> Simple jumps and wide platforms to learn the basics</li>
        <li><b>Intermediate (3-4):</b> More complex sequences requiring good timing</li>
        <li><b>Advanced (5-6):</b> Demanding precision and extensive practice</li>
        <li><b>Expert (7):</b> The most difficult challenges requiring mastery of the physics</li>
      </ul>

      <h4>Other Map Types</h4>
      <ul className="list-disc space-y-1 pl-5">
        <li><b>Arena Maps:</b> Combat-focused designs with weapons and power-ups</li>
        <li><b>Race Tracks:</b> Circuits and point-to-point racing courses</li>
        <li><b>Freestyle Maps:</b> Open areas for stunting and exploration</li>
        <li><b>Mixed Maps:</b> Combinations of parkour, combat, and racing elements</li>
      </ul>

      <h3>Community and Teamwork</h3>
      <p>One of IS82's most distinctive features is its emphasis on cooperative gameplay during challenge maps:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li><b>Convoy System:</b> Players can ride as passengers in other players' vehicles if their own is destroyed.</li>
        <li><b>Team Progression:</b> Success is often measured by how many players complete a challenge, not just the fastest time.</li>
        <li><b>Coaching Culture:</b> Experienced players frequently guide newcomers through difficult sections.</li>
        <li><b>Shared Achievement:</b> Completing especially difficult maps is a community celebration.</li>
      </ul>
      <p>This cooperative aspect has fostered one of the most welcoming and tight-knit communities in the BF1942 modding scene.</p>

      <h3>Technical Achievements</h3>
      <p>The IS82 development team pushed the BF1942 engine in unexpected directions:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li><b>Custom Physics:</b> Modified vehicle handling specifically tuned for precision platforming</li>
        <li><b>Specialized Maps:</b> Map designs that would be impossible in standard BF1942</li>
        <li><b>Removed Mechanics:</b> Infantry, weapons, and military features stripped out entirely</li>
        <li><b>New Game Modes:</b> Checkpoint systems, time trials, and parkour progression</li>
      </ul>

      <h3>Cultural Impact</h3>
      <p>Interstate 82 demonstrates that creative modding can transform a game into something entirely different. While other mods added content to BF1942's formula, IS82 replaced the formula entirely. It has inspired similar "genre-swap" mods in other games and remains a beloved cult classic among its dedicated community.</p>
      <p>The mod continues to be played on community servers, with regular events and new map releases from dedicated community members.</p>

      <h3>Installation Requirements</h3>
      <ul className="list-disc space-y-2 pl-5">
        <li>Battlefield 1942 patched to version 1.6 or higher</li>
        <li>Download the v1.8 Full installer first</li>
        <li>Apply the v1.8.1 patch after installation</li>
        <li>Approximately 500 MB of free disk space</li>
      </ul>

      <h3>Getting Started</h3>
      <p>For new players, the IS82 community recommends:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>Start with Difficulty 1-2 challenge maps to learn vehicle handling</li>
        <li>Join a populated server and ask for guidance - the community is helpful</li>
        <li>Don't be discouraged by failures - mastering the physics takes time</li>
        <li>Try different vehicles to find your preferred handling style</li>
      </ul>
    </div>
  ),

  maps: [
    {
      slug: 'is82_challenge_1',
      name: 'Various Challenge Maps',
      description: 'Over 250 custom maps featuring vehicle parkour challenges graded from difficulty 1-7.',
    },
  ]
};

export default Interstate82Data;
