import React from 'react';
import { ModMapData } from '@/lib/types';

const mapData: ModMapData = {
  slug: 'gc_death_star',
  name: 'Death Star Trench Run',
  description: 'Navigate the trench and destroy the Death Star in this recreation of the climactic A New Hope battle.',

  galleryImages: [],

  content: (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">Map Overview</h3>
      <p>Relive the climactic battle from A New Hope as Rebel pilots navigate the Death Star trench to deliver proton torpedoes to the thermal exhaust port. Imperial TIE fighters scramble to defend the battle station.</p>

      <h3 className="text-xl font-semibold text-foreground">Key Features</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Trench Run:</strong> Navigate the iconic trench while avoiding turbolaser fire and TIE fighters.</li>
        <li><strong>Exhaust Port:</strong> The ultimate objective - deliver proton torpedoes to destroy the Death Star.</li>
        <li><strong>X-Wings & Y-Wings:</strong> Rebel fighters assault the battle station in waves.</li>
        <li><strong>TIE Fighters:</strong> Imperial pilots defend the Death Star from Rebel attack.</li>
        <li><strong>Surface Turrets:</strong> Automated defenses target incoming Rebel ships.</li>
      </ul>

      <div className="rounded-lg border border-border/60 bg-muted/30 p-4 mt-6">
        <p className="text-sm text-muted-foreground italic">This is a placeholder page. Detailed map information coming soon.</p>
      </div>
    </div>
  )
};

export default mapData;
