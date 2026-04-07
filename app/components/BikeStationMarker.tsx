'use client';

import { CircleMarker, Popup } from 'react-leaflet';
import { getBikeStationStatus } from '@/app/lib/gbfs';

interface BikeStation {
  id: number;
  name: string;
  lat: number;
  lon: number;
  capacity: number;
  bikesAvailable: number;
  docksAvailable: number;
  isInstalled: boolean;
  isRenting: boolean;
  isReturning: boolean;
}

function getMarkerColor(station: BikeStation): string {
  if (!station.isInstalled || !station.isRenting) return '#64748b';
  const pct = station.capacity > 0 ? (station.bikesAvailable / station.capacity) * 100 : 0;
  if (pct > 20) return '#4ade80';
  if (pct > 10) return '#f59e0b';
  return '#ef4444';
}

interface BikeStationMarkerProps {
  station: BikeStation;
}

export default function BikeStationMarker({ station }: BikeStationMarkerProps) {
  const color = getMarkerColor(station);

  return (
    <CircleMarker
      key={station.id}
      center={[station.lat, station.lon]}
      radius={6}
      pathOptions={{ color, fillColor: color, fillOpacity: 0.85, weight: 1.5 }}
    >
      <Popup>
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
          <div
            style={{
              marginTop: 'var(--spacing-1)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-muted)',
            }}
          >
            {getBikeStationStatus(station)}
          </div>
        </div>
      </Popup>
    </CircleMarker>
  );
}
