'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import FlightKpiGrid from '@/app/components/FlightKpiGrid';

const scenarios: Record<string, React.ComponentProps<typeof FlightKpiGrid>> = {
  Cruising: { altitude: 38000, groundSpeed: 520, heading: 75 },
  Descending: { altitude: 12000, groundSpeed: 310, heading: 290 },
  TakingOff: { altitude: 2500, groundSpeed: 180, heading: 5 },
  Zeroes: { altitude: 0, groundSpeed: 0, heading: 0 },
};

function Content() {
  const params = useSearchParams();
  const s = params.get('s') ?? 'Cruising';
  const props = scenarios[s] ?? scenarios['Cruising'];

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#080d1a' }}>
      <div id="codeyam-capture" style={{ display: 'inline-block' }}>
        <div style={{ width: 380, background: 'linear-gradient(180deg, rgba(8,13,26,0.98) 0%, rgba(3,6,15,0.99) 100%)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <FlightKpiGrid {...props} />
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
