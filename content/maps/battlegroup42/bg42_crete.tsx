import React from 'react';
import { ModMapData } from '@/lib/types';

const mapData: ModMapData = {
  slug: 'bg42_crete',
  name: 'Crete',
  description: 'The massive German airborne invasion of Crete in 1941, featuring paratroopers and glider assaults.',

  galleryImages: [],

  content: (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">Map Overview</h3>
      <p>Experience Operation Mercury, the German airborne invasion of Crete in May 1941. German Fallschirmjäger (paratroopers) and glider-borne troops assault the island defended by British, Commonwealth, and Greek forces.</p>

      <h3 className="text-xl font-semibold text-foreground">Historical Context</h3>
      <p>The Battle of Crete was the first primarily airborne invasion in military history. Despite ultimately capturing the island, German paratroopers suffered such heavy casualties that Hitler forbade large-scale airborne operations for the rest of the war.</p>

      <h3 className="text-xl font-semibold text-foreground">Gameplay Features</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Airborne Assault:</strong> German forces deploy via parachute and DFS 230 gliders.</li>
        <li><strong>Airfield Objectives:</strong> Capturing airfields allows for reinforcement by Ju 52 transports.</li>
        <li><strong>Mediterranean Setting:</strong> Rocky terrain and olive groves provide cover.</li>
        <li><strong>Naval Support:</strong> Royal Navy vessels provide fire support for defenders.</li>
      </ul>

      <div className="rounded-lg border border-border/60 bg-muted/30 p-4 mt-6">
        <p className="text-sm text-muted-foreground italic">This is a placeholder page. Detailed map information coming soon.</p>
      </div>
    </div>
  )
};

export default mapData;
