'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import FlightPositionRow from '@/app/components/FlightPositionRow';

const scenarios: Record<string, React.ComponentProps<typeof FlightPositionRow>> = {
  NorthAtlantic: { lat: 51.2, lon: -30.4 },
  NearJFK: { lat: 40.6413, lon: -73.7781 },
  SouthernHemisphere: { lat: -33.8688, lon: 151.2093 },
  Equator: { lat: 0.0, lon: 0.0 },
};

function Content() {
  const params = useSearchParams();
  const s = params.get('s') ?? 'NorthAtlantic';
  const props = scenarios[s] ?? scenarios['NorthAtlantic'];

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#080d1a' }}>
      <div id="codeyam-capture" style={{ display: 'inline-block' }}>
        <div style={{ width: 380, background: 'linear-gradient(180deg, rgba(8,13,26,0.98) 0%, rgba(3,6,15,0.99) 100%)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <FlightPositionRow {...props} />
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
}
