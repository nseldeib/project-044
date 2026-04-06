import React from 'react';
import { StatusBadge } from '@/app/components/ui/badge';
import { bikeStationStatus, bikeStationVariant } from '@/app/lib/variants';
import { bikeAvailabilityPercent } from '@/app/lib/calculations';

export interface BikeStation {
  id: number;
  stationId: string;
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

interface BikeStationCardProps {
  station: BikeStation;
  onClick?: () => void;
}

export default function BikeStationCard({ station, onClick }: BikeStationCardProps) {
  const pct = bikeAvailabilityPercent(station.bikesAvailable, station.capacity);
  const status = bikeStationStatus(station.bikesAvailable, station.isRenting, station.isInstalled);
  const variant = bikeStationVariant(status);
  const statusLabel = {
    available: 'AVAILABLE',
    low:       'LOW',
    empty:     'EMPTY',
    offline:   station.isInstalled ? 'NOT RENTING' : 'OFFLINE',
  }[status];

  const barColor =
    pct > 60
      ? 'var(--accent-green)'
      : pct > 20
      ? 'var(--accent-amber)'
      : 'var(--status-critical)';

  return (
    <div
      onClick={onClick}
      style={{
        padding: 'var(--spacing-3) var(--spacing-4)',
        borderBottom: 'var(--border-subtle)',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 'var(--spacing-2)',
        }}
      >
        <span
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--text-primary)',
            flex: 1,
            paddingRight: 'var(--spacing-2)',
          }}
        >
          {station.name}
        </span>
        <StatusBadge variant={variant}>{statusLabel}</StatusBadge>
      </div>

      <div
        style={{
          height: '4px',
          backgroundColor: 'var(--bg-border)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          marginBottom: 'var(--spacing-2)',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            backgroundColor: barColor,
            borderRadius: 'var(--radius-full)',
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-2xs)',
          color: 'var(--text-muted)',
        }}
      >
        <span>
          {station.bikesAvailable} bikes / {station.capacity} capacity
        </span>
        <span>{station.docksAvailable} docks free</span>
      </div>
    </div>
  );
}
