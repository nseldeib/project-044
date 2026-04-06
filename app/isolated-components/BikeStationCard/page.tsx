'use client';
import { useSearchParams } from 'next/navigation';
import BikeStationCard from '@/app/components/BikeStationCard';
import type { BikeStation } from '@/app/components/BikeStationCard';

const scenarios: Record<string, BikeStation> = {
  Available: {
    id: 1,
    stationId: 'citibike-359',
    name: 'E 47 St & Park Ave',
    lat: 40.755,
    lon: -73.976,
    capacity: 68,
    bikesAvailable: 52,
    docksAvailable: 16,
    isInstalled: true,
    isRenting: true,
    isReturning: true,
  },
  Low: {
    id: 2,
    stationId: 'citibike-112',
    name: 'LaGuardia Pl & W 3 St',
    lat: 40.727,
    lon: -74.001,
    capacity: 35,
    bikesAvailable: 2,
    docksAvailable: 33,
    isInstalled: true,
    isRenting: true,
    isReturning: true,
  },
  Empty: {
    id: 3,
    stationId: 'citibike-208',
    name: 'MacDougal St & Prince St',
    lat: 40.727,
    lon: -74.001,
    capacity: 27,
    bikesAvailable: 0,
    docksAvailable: 27,
    isInstalled: true,
    isRenting: false,
    isReturning: true,
  },
  Offline: {
    id: 4,
    stationId: 'citibike-417',
    name: 'St James Pl & Pearl St',
    lat: 40.711,
    lon: -74.001,
    capacity: 23,
    bikesAvailable: 0,
    docksAvailable: 0,
    isInstalled: false,
    isRenting: false,
    isReturning: false,
  },
};

export default function BikeStationCardIsolation() {
  const searchParams = useSearchParams();
  const scenarioName = searchParams.get('s') || 'Available';
  const station = scenarios[scenarioName] || scenarios['Available'];

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
          maxWidth: 320,
          backgroundColor: 'var(--bg-surface)',
          border: 'var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}
      >
        <BikeStationCard station={station} onClick={() => {}} />
      </div>
    </div>
  );
}
