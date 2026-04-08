'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import FlightRouteSection from '@/app/components/FlightRouteSection';

const jfk = { iata: 'JFK', city: 'New York', lat: 40.6413, lon: -73.7781 };
const lhr = { iata: 'LHR', city: 'London', lat: 51.477, lon: -0.4543 };
const lax = { iata: 'LAX', city: 'Los Angeles', lat: 33.9425, lon: -118.408 };
const ord = { iata: 'ORD', city: 'Chicago', lat: 41.9742, lon: -87.9073 };

const scenarios: Record<string, React.ComponentProps<typeof FlightRouteSection>> = {
  EarlyFlight: { origin: jfk, destination: lhr, progress: 12 },
  MidFlight: { origin: jfk, destination: lhr, progress: 52 },
  NearLanding: { origin: lax, destination: ord, progress: 88 },
  ShortHop: { origin: jfk, destination: ord, progress: 35 },
};

function Content() {
  const params = useSearchParams();
  const s = params.get('s') ?? 'MidFlight';
  const props = scenarios[s] ?? scenarios['MidFlight'];

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#080d1a' }}>
      <div id="codeyam-capture" style={{ display: 'inline-block' }}>
        <div style={{ width: 380, background: 'linear-gradient(180deg, rgba(8,13,26,0.98) 0%, rgba(3,6,15,0.99) 100%)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <FlightRouteSection {...props} />
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
