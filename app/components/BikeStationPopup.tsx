'use client';

import { getBikeStationStatus } from '@/app/lib/gbfs';

interface BikeStationPopupProps {
  name: string;
  bikesAvailable: number;
  docksAvailable: number;
  capacity: number;
  isInstalled: boolean;
  isRenting: boolean;
}

export default function BikeStationPopup({
  name,
  bikesAvailable,
  docksAvailable,
  capacity,
  isInstalled,
  isRenting,
}: BikeStationPopupProps) {
  const status = getBikeStationStatus({ isInstalled, isRenting });

  return (
    <div
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-primary)',
        minWidth: '200px',
      }}
    >
      <div
        style={{
          fontWeight: 'var(--font-weight-bold)',
          marginBottom: 'var(--spacing-1)',
          color: 'var(--accent-blue)',
        }}
      >
        {name}
      </div>
      <div style={{ marginBottom: 'var(--spacing-1)' }}>
        Bikes available:{' '}
        <span style={{ color: 'var(--accent-amber)' }}>{bikesAvailable}</span>
      </div>
      <div style={{ marginBottom: 'var(--spacing-1)' }}>
        Docks available:{' '}
        <span style={{ color: 'var(--text-secondary)' }}>{docksAvailable}</span>
      </div>
      <div style={{ marginBottom: 'var(--spacing-1)' }}>Capacity: {capacity}</div>
      <div
        style={{
          marginTop: 'var(--spacing-1)',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-muted)',
        }}
      >
        {status}
      </div>
    </div>
  );
}
