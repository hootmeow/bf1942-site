import React from 'react';
import { ModMapData } from '@/lib/types';

const mapData: ModMapData = {
  slug: 'fh_berlin',
  name: 'Berlin',
  description: 'The final battle for the German capital in 1945, featuring intense urban combat and Soviet assault.',

  galleryImages: [],

  content: (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">Map Overview</h3>
      <p>Experience the apocalyptic final battle for Berlin in April-May 1945. Soviet forces assault the heart of Nazi Germany while desperate German defenders make their last stand in the rubble-strewn streets of the capital.</p>

      <h3 className="text-xl font-semibold text-foreground">Historical Context</h3>
      <p>The Battle of Berlin was one of the bloodiest battles of World War II, with over 1 million Soviet troops assaulting a city defended by a mix of Wehrmacht, Waffen-SS, Volkssturm militia, and Hitler Youth. The battle ended with Hitler's suicide and Germany's unconditional surrender.</p>

      <h3 className="text-xl font-semibold text-foreground">Gameplay Features</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Urban Destruction:</strong> Fight through bombed-out buildings and rubble-filled streets.</li>
        <li><strong>Soviet Armor:</strong> IS-2 heavy tanks and T-34s lead the assault.</li>
        <li><strong>German Defenders:</strong> Panzerfausts and improvised defenses in every building.</li>
        <li><strong>Iconic Locations:</strong> Battle for the Reichstag and Brandenburg Gate.</li>
      </ul>

      <div className="rounded-lg border border-border/60 bg-muted/30 p-4 mt-6">
        <p className="text-sm text-muted-foreground italic">This is a placeholder page. Detailed map information coming soon.</p>
      </div>
    </div>
  )
};

export default mapData;
