'use client';
import { useSearchParams } from 'next/navigation';
import RouteProgressArc from '@/app/components/RouteProgressArc';
import type { Airport } from '@/app/components/RouteProgressArc';

type Scenario = {
  origin: Airport;
  destination: Airport;
  current: { lat: number; lon: number };
  progress: number;
};

const JFK: Airport = { iata: 'JFK', lat: 40.64, lon: -73.78 };
const LHR: Airport = { iata: 'LHR', lat: 51.47, lon: -0.45 };

const scenarios: Record<string, Scenario> = {
  MidFlight: {
    origin: JFK,
    destination: LHR,
    current: { lat: 48.2, lon: -35.1 },
    progress: 65,
  },
  EarlyFlight: {
    origin: JFK,
    destination: LHR,
    current: { lat: 42.1, lon: -62.4 },
    progress: 15,
  },
  NearLanding: {
    origin: JFK,
    destination: LHR,
    current: { lat: 51.0, lon: -5.2 },
    progress: 90,
  },
};

export default function RouteProgressArcIsolation() {
  const searchParams = useSearchParams();
  const scenarioName = searchParams.get('s') || 'MidFlight';
  const props = scenarios[scenarioName] || scenarios['MidFlight'];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-base)',
      }}
    >
      <div
        id="codeyam-capture"
        style={{
          width: '100%',
          maxWidth: 600,
          backgroundColor: 'var(--bg-surface)',
          border: 'var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-4)',
        }}
      >
        <RouteProgressArc {...props} />
      </div>
    </div>
  );
}
