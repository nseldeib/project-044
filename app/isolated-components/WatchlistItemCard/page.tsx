'use client';
import { useSearchParams } from 'next/navigation';
import WatchlistItemCard from '@/app/components/WatchlistItemCard';
import type { WatchlistItem } from '@/app/components/WatchlistItemCard';

const scenarios: Record<string, WatchlistItem> = {
  FlightItem: {
    id: 1,
    type: 'FLIGHT',
    label: 'AA100 · JFK→LHR',
    refId: 'AAL100',
    notes: 'Business trip to London — monitor for delays',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    flight: {
      callsign: 'AAL100',
      status: 'EN_ROUTE',
      airline: 'American Airlines',
    },
    alerts: [],
  },
  BikeItem: {
    id: 2,
    type: 'BIKE_STATION',
    label: 'E 47 St & Park Ave',
    refId: 'citibike-359',
    notes: 'Near office — check availability before leaving',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    flight: null,
    alerts: [],
  },
  SubwayItem: {
    id: 3,
    type: 'SUBWAY_LINE',
    label: 'L Train',
    refId: 'L',
    notes: 'Daily commute — check weekends for planned work',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    flight: null,
    alerts: [{ id: 1 }],
  },
};

export default function WatchlistItemCardIsolation() {
  const searchParams = useSearchParams();
  const scenarioName = searchParams.get('s') || 'FlightItem';
  const item = scenarios[scenarioName] || scenarios['FlightItem'];

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
      <div id="codeyam-capture" style={{ width: '100%', maxWidth: 400 }}>
        <WatchlistItemCard item={item} onDelete={() => {}} />
      </div>
    </div>
  );
}
