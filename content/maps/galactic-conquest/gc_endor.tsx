import React from 'react';
import { ModMapData } from '@/lib/types';

const mapData: ModMapData = {
  slug: 'gc_endor',
  name: 'Endor',
  description: 'Forest combat with speeder bikes and the assault on the Imperial shield generator bunker.',

  galleryImages: [],

  content: (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">Map Overview</h3>
      <p>Battle through the forests of the Sanctuary Moon of Endor. Rebel forces must destroy the Imperial shield generator bunker protecting the second Death Star while Imperial troops defend with AT-STs and speeder bikes.</p>

      <h3 className="text-xl font-semibold text-foreground">Key Features</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Dense Forest:</strong> Towering trees provide cover and create unique combat scenarios.</li>
        <li><strong>Speeder Bikes:</strong> High-speed chases through the forest on 74-Z speeder bikes.</li>
        <li><strong>Shield Bunker:</strong> The primary objective for Rebel forces to destroy.</li>
        <li><strong>AT-ST Walkers:</strong> Imperial chicken walkers patrol the forest paths.</li>
        <li><strong>Ewok Village:</strong> The treetop village provides strategic positions.</li>
      </ul>

      <div className="rounded-lg border border-border/60 bg-muted/30 p-4 mt-6">
        <p className="text-sm text-muted-foreground italic">This is a placeholder page. Detailed map information coming soon.</p>
      </div>
    </div>
  )
};

export default mapData;
