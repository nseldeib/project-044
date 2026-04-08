'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import FlightPanelHeader from '@/app/components/FlightPanelHeader';

const scenarios: Record<string, React.ComponentProps<typeof FlightPanelHeader>> = {
  EnRoute: {
    callsign: 'UAL123',
    airline: 'United Airlines',
    status: 'en_route',
    onClose: () => {},
  },
  Delayed: {
    callsign: 'DAL456',
    airline: 'Delta Air Lines',
    status: 'delayed',
    onClose: () => {},
  },
  LongCallsign: {
    callsign: 'SPEEDBIRD9',
    airline: 'British Airways',
    status: 'en_route',
    onClose: () => {},
  },
  ShortAirline: {
    callsign: 'AA1',
    airline: 'AA',
    status: 'landed',
    onClose: () => {},
  },
};

function Content() {
  const params = useSearchParams();
  const s = params.get('s') ?? 'EnRoute';
  const props = scenarios[s] ?? scenarios['EnRoute'];

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#080d1a' }}>
      <div id="codeyam-capture" style={{ display: 'inline-block' }}>
        <div style={{ width: 380, background: 'linear-gradient(180deg, rgba(8,13,26,0.98) 0%, rgba(3,6,15,0.99) 100%)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <FlightPanelHeader {...props} />
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
