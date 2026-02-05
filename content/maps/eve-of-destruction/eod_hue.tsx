import React from 'react';
import { ModMapData } from '@/lib/types';

const mapData: ModMapData = {
  slug: 'eod_hue',
  name: 'Hue City',
  description: 'Urban warfare during the Tet Offensive in the streets of the ancient imperial capital.',

  galleryImages: [],

  content: (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">Map Overview</h3>
      <p>Hue City brings the brutal urban combat of the 1968 Tet Offensive to life. Fight through the streets and buildings of Vietnam's ancient imperial capital in some of the most intense close-quarters combat of the Vietnam War.</p>

      <h3 className="text-xl font-semibold text-foreground">Historical Context</h3>
      <p>The Battle of Hue was one of the longest and bloodiest battles of the Vietnam War. NVA and Viet Cong forces occupied the city for nearly a month before being driven out by US Marines and ARVN forces in house-to-house fighting.</p>

      <h3 className="text-xl font-semibold text-foreground">Gameplay Features</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Urban Combat:</strong> Dense city streets and buildings create intense close-quarters engagements.</li>
        <li><strong>Imperial Citadel:</strong> The ancient fortress provides a dramatic backdrop and key objective.</li>
        <li><strong>Limited Vehicles:</strong> Tight streets favor infantry with limited armor support.</li>
        <li><strong>House-to-House:</strong> Clearing buildings room by room is essential for victory.</li>
      </ul>

      <div className="rounded-lg border border-border/60 bg-muted/30 p-4 mt-6">
        <p className="text-sm text-muted-foreground italic">This is a placeholder page. Detailed map information coming soon.</p>
      </div>
    </div>
  )
};

export default mapData;
