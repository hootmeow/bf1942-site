import React from 'react';
import { ModMapData } from '@/lib/types';

const mapData: ModMapData = {
  slug: 'is82_challenge_1',
  name: 'Various Challenge Maps',
  description: 'Over 250 custom maps featuring vehicle parkour challenges graded from difficulty 1-7.',

  galleryImages: [],

  content: (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">Map Overview</h3>
      <p>Interstate 82 features an extensive library of over 250 custom challenge maps designed specifically for vehicular parkour and stunt driving. Maps are graded on a difficulty scale from 1 (beginner) to 7 (expert).</p>

      <h3 className="text-xl font-semibold text-foreground">Difficulty Levels</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Level 1-2 (Beginner):</strong> Simple jumps and wide platforms to learn basic vehicle handling and physics.</li>
        <li><strong>Level 3-4 (Intermediate):</strong> More complex sequences requiring good timing and precision.</li>
        <li><strong>Level 5-6 (Advanced):</strong> Demanding challenges that require extensive practice and mastery.</li>
        <li><strong>Level 7 (Expert):</strong> The most difficult challenges requiring complete mastery of the physics engine.</li>
      </ul>

      <h3 className="text-xl font-semibold text-foreground">Map Types</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Challenge Maps:</strong> Obstacle courses with checkpoints and precision platforming.</li>
        <li><strong>Arena Maps:</strong> Combat-focused designs with weapons and power-ups.</li>
        <li><strong>Race Tracks:</strong> Circuits and point-to-point racing courses.</li>
        <li><strong>Freestyle Maps:</strong> Open areas for stunting and exploration.</li>
      </ul>

      <div className="rounded-lg border border-border/60 bg-muted/30 p-4 mt-6">
        <p className="text-sm text-muted-foreground italic">This is a placeholder page. Detailed map information coming soon.</p>
      </div>
    </div>
  )
};

export default mapData;
