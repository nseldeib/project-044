'use client';

import { use } from 'react';
import { getBikeStationStatus } from '@/app/lib/gbfs';

const baseStation = {
  id: 1,
  stationId: 'abc',
  name: 'Central Park S & 6 Ave',
  lat: 40.7655,
  lon: -73.9795,
  capacity: 55,
};

const scenarios = {
  Available: {
    ...baseStation,
    bikesAvailable: 32, docksAvailable: 23,
    isInstalled: true, isRenting: true, isReturning: true,
  },
  Low: {
    ...baseStation,
    name: 'W 42 St & 8 Ave',
    lat: 40.7572, lon: -73.9906,
    bikesAvailable: 2, docksAvailable: 43,
    isInstalled: true, isRenting: true, isReturning: true,
  },
  Empty: {
    ...baseStation,
    name: 'E 86 St & Park Ave',
    lat: 40.7790, lon: -73.9560,
    bikesAvailable: 0, docksAvailable: 55,
    isInstalled: true, isRenting: true, isReturning: true,
  },
  Offline: {
    ...baseStation,
    name: 'Broadway & W 74 St',
    lat: 40.7813, lon: -73.9817,
    bikesAvailable: 0, docksAvailable: 0,
    isInstalled: false, isRenting: false, isReturning: false,
  },
};

type ScenarioName = keyof typeof scenarios;

function markerColor(station: typeof scenarios.Available): string {
  if (!station.isInstalled || !station.isRenting) return '#64748b';
  const pct = station.capacity > 0 ? (station.bikesAvailable / station.capacity) * 100 : 0;
  if (pct > 20) return '#4ade80';
  if (pct > 10) return '#f59e0b';
  return '#ef4444';
}

export default function BikeStationMarkerIsolation({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = use(searchParams);
  const name = (params.s ?? 'Available') as ScenarioName;
  const station = scenarios[name] ?? scenarios.Available;
  const color = markerColor(station);
  const status = getBikeStationStatus(station);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-base)',
        minHeight: '100vh',
        gap: 'var(--spacing-8)',
      }}
    >
      <div id="codeyam-capture" style={{ display: 'flex', gap: 'var(--spacing-6)', alignItems: 'center' }}>
        {/* Circle marker */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-2)' }}>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: color,
              border: `2px solid ${color}`,
              opacity: 0.85,
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-2xs)',
              color,
              letterSpacing: 'var(--tracking-wider)',
            }}
          >
            {status}
          </span>
        </div>

        {/* Popup card */}
        <div
          style={{
            background: 'var(--bg-elevated)',
            border: 'var(--border-default)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            padding: 'var(--spacing-4)',
            minWidth: 220,
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-primary)',
          }}
        >
          <div
            style={{
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--accent-blue)',
              marginBottom: 'var(--spacing-1)',
            }}
          >
            {station.name}
          </div>
          <div style={{ marginBottom: 'var(--spacing-1)' }}>
            Bikes available:{' '}
            <span style={{ color: 'var(--accent-amber)' }}>{station.bikesAvailable}</span>
          </div>
          <div style={{ marginBottom: 'var(--spacing-1)' }}>
            Docks available:{' '}
            <span style={{ color: 'var(--text-secondary)' }}>{station.docksAvailable}</span>
          </div>
          <div style={{ marginBottom: 'var(--spacing-1)' }}>Capacity: {station.capacity}</div>
          <div style={{ marginTop: 'var(--spacing-1)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            {status}
          </div>
        </div>
      </div>
    </div>
  );
}
