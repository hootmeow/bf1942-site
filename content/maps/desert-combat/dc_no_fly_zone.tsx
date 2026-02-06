import React from 'react';
import { ModMapData } from '@/lib/types';

const mapData: ModMapData = {
  slug: 'dc_no_fly_zone',
  name: 'No Fly Zone',
  description: 'Mountainous terrain with anti-aircraft focus.',

  content: (
    <div className="space-y-4">
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-6 text-center">
        <p className="text-lg font-medium text-foreground">Content Coming Soon</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Detailed map information, tactical analysis, and screenshots for No Fly Zone are currently being prepared.
        </p>
      </div>
    </div>
  )
};

export default mapData;
