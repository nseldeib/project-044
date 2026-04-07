'use client';

import { use } from 'react';
import { getBikeStationStatus, getMarkerColor, getMarkerGlowColor, getMarkerSize } from '@/app/lib/gbfs';

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

function BikeSvg({ color, size }: { color: string; size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="6" cy="16" r="4.5" stroke={color} strokeWidth="2"/>
      <circle cx="18" cy="16" r="4.5" stroke={color} strokeWidth="2"/>
      <path d="M6 16 L10 8 L14 8 L18 16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M10 8 L12 16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M14 8 L16 6 L19 6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="8" r="1.5" fill={color}/>
    </svg>
  );
}

export default function BikeStationMarkerIsolation({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = use(searchParams);
  const name = (params.s ?? 'Available') as ScenarioName;
  const station = scenarios[name] ?? scenarios.Available;
  const color = getMarkerColor(station);
  const glow = getMarkerGlowColor(color);
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
      <div id="codeyam-capture" style={{ display: 'flex', gap: 'var(--spacing-8)', alignItems: 'center' }}>
        {/* Zoom level previews */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-6)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase' }}>Zoom levels</span>

          {([13, 14, 16] as const).map((zoom) => {
            const size = getMarkerSize(zoom);
            const showLabel = zoom >= 16;
            return (
              <div key={zoom} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-1)' }}>
                <div style={{ filter: `drop-shadow(0 0 4px ${glow})` }}>
                  <BikeSvg color={color} size={size} />
                </div>
                {showLabel && (
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    fontWeight: 'var(--font-weight-semibold)',
                    color,
                    background: 'rgba(3,6,15,0.85)',
                    border: `1px solid ${color}`,
                    borderRadius: 'var(--radius-sm)',
                    padding: '1px 4px',
                    letterSpacing: 'var(--tracking-wide)',
                    maxWidth: 140,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {station.name}
                  </div>
                )}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>
                  {zoom <= 13 ? 'z≤13' : zoom <= 15 ? `z${zoom}` : 'z≥16'}
                </span>
              </div>
            );
          })}
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
          <div style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--accent-blue)', marginBottom: 'var(--spacing-1)' }}>
            {station.name}
          </div>
          <div style={{ marginBottom: 'var(--spacing-1)' }}>
            Bikes available: <span style={{ color: 'var(--accent-amber)' }}>{station.bikesAvailable}</span>
          </div>
          <div style={{ marginBottom: 'var(--spacing-1)' }}>
            Docks available: <span style={{ color: 'var(--text-secondary)' }}>{station.docksAvailable}</span>
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
