'use client';

import { formatDMS } from '@/app/lib/formatters';

interface FlightPositionRowProps {
  lat: number;
  lon: number;
}

export default function FlightPositionRow({ lat, lon }: FlightPositionRowProps) {
  return (
    <div style={{ padding: 'var(--spacing-5)' }}>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-2xs)',
          color: 'var(--text-muted)',
          letterSpacing: 'var(--tracking-widest)',
          marginBottom: 'var(--spacing-2)',
        }}
      >
        POSITION
      </div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-sm)',
          color: 'var(--accent-blue)',
          background: 'rgba(56,189,248,0.05)',
          border: '1px solid rgba(56,189,248,0.2)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--spacing-3)',
          letterSpacing: 'var(--tracking-wide)',
        }}
      >
        {formatDMS(lat, lon)}
      </div>
    </div>
  );
}
