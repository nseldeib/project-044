'use client';

import { use } from 'react';
import BikeStationPopup from '@/app/components/BikeStationPopup';

const scenarios = {
  Available: {
    name: 'Central Park S & 6 Ave',
    bikesAvailable: 32,
    docksAvailable: 23,
    capacity: 55,
    isInstalled: true,
    isRenting: true,
  },
  Low: {
    name: 'W 42 St & 8 Ave',
    bikesAvailable: 2,
    docksAvailable: 43,
    capacity: 55,
    isInstalled: true,
    isRenting: true,
  },
  Empty: {
    name: 'E 86 St & Park Ave',
    bikesAvailable: 0,
    docksAvailable: 55,
    capacity: 55,
    isInstalled: true,
    isRenting: true,
  },
  Offline: {
    name: 'Broadway & W 74 St',
    bikesAvailable: 0,
    docksAvailable: 0,
    capacity: 55,
    isInstalled: false,
    isRenting: false,
  },
};

type ScenarioName = keyof typeof scenarios;

export default function BikeStationPopupIsolation({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = use(searchParams);
  const name = (params.s ?? 'Available') as ScenarioName;
  const props = scenarios[name] ?? scenarios.Available;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-base)',
        minHeight: '100vh',
      }}
    >
      <div
        id="codeyam-capture"
        style={{
          background: 'var(--bg-elevated)',
          border: 'var(--border-default)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)',
          padding: 'var(--spacing-4)',
        }}
      >
        <BikeStationPopup {...props} />
      </div>
    </div>
  );
}
