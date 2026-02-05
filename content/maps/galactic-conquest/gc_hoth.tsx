import React from 'react';
import { ModMapData } from '@/lib/types';

const mapData: ModMapData = {
  slug: 'gc_hoth',
  name: 'Hoth',
  description: 'The iconic Battle of Hoth featuring AT-ATs, Snowspeeders, and the assault on Echo Base.',

  galleryImages: [],

  content: (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">Map Overview</h3>
      <p>Experience the iconic Battle of Hoth from The Empire Strikes Back. Imperial forces assault the Rebel Alliance's Echo Base with massive AT-AT walkers while Rebel Snowspeeders attempt to bring down the armored behemoths with tow cables.</p>

      <h3 className="text-xl font-semibold text-foreground">Key Features</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>AT-AT Walkers:</strong> Massive Imperial walkers advance on Echo Base, requiring coordinated Rebel defense.</li>
        <li><strong>Snowspeeders:</strong> Use tow cables to trip AT-ATs or engage with blaster cannons.</li>
        <li><strong>Echo Base:</strong> Defend the Rebel hangar and shield generator from Imperial assault.</li>
        <li><strong>Trench Warfare:</strong> Infantry battles in the snow trenches surrounding the base.</li>
        <li><strong>AT-ST Support:</strong> Smaller Imperial walkers provide anti-infantry support.</li>
      </ul>

      <div className="rounded-lg border border-border/60 bg-muted/30 p-4 mt-6">
        <p className="text-sm text-muted-foreground italic">This is a placeholder page. Detailed map information coming soon.</p>
      </div>
    </div>
  )
};

export default mapData;
