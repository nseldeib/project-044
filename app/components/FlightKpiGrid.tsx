'use client';

import { getFlightKpis } from '@/app/lib/formatters';

interface FlightKpiGridProps {
  altitude: number;
  groundSpeed: number;
  heading: number;
}

export default function FlightKpiGrid({ altitude, groundSpeed, heading }: FlightKpiGridProps) {
  const kpis = getFlightKpis(altitude, groundSpeed, heading);

  return (
    <div
      style={{
        padding: 'var(--spacing-5)',
        borderBottom: '1px solid var(--bg-border)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 'var(--spacing-3)',
      }}
    >
      {kpis.map(({ label, value }) => (
        <div
          key={label}
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--bg-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-4) var(--spacing-2)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0, left: '20%', right: '20%', height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.4), transparent)',
          }} />
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-2xs)',
              color: 'var(--text-muted)',
              letterSpacing: 'var(--tracking-widest)',
              marginBottom: 'var(--spacing-2)',
            }}
          >
            {label}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--accent-amber)',
              letterSpacing: 'var(--tracking-wide)',
              textShadow: '0 0 12px rgba(245,158,11,0.4)',
            }}
          >
            {value}
          </div>
        </div>
      ))}
    </div>
  );
}
