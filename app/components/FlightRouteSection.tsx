'use client';

import RouteProgressArc from './RouteProgressArc';

interface Airport {
  iata: string;
  city: string;
  lat: number;
  lon: number;
}

interface FlightRouteSectionProps {
  origin: Airport;
  destination: Airport;
  progress: number;
}

export default function FlightRouteSection({ origin, destination, progress }: FlightRouteSectionProps) {
  return (
    <div
      style={{
        padding: 'var(--spacing-5)',
        borderBottom: '1px solid var(--bg-border)',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-2xs)',
          color: 'var(--text-muted)',
          letterSpacing: 'var(--tracking-widest)',
          marginBottom: 'var(--spacing-4)',
        }}
      >
        ROUTE
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-4)',
          marginBottom: 'var(--spacing-5)',
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--text-primary)',
              letterSpacing: 'var(--tracking-wide)',
              lineHeight: 1,
            }}
          >
            {origin.iata}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-muted)',
              marginTop: 'var(--spacing-1)',
            }}
          >
            {origin.city}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
          <div style={{
            width: 48,
            height: 1,
            background: 'linear-gradient(90deg, var(--text-muted), var(--accent-amber), var(--text-muted))',
          }} />
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-2xs)',
            color: 'var(--accent-amber-dim)',
            letterSpacing: 'var(--tracking-widest)',
          }}>✈</span>
          <div style={{
            width: 48,
            height: 1,
            background: 'linear-gradient(90deg, var(--text-muted), var(--accent-amber), var(--text-muted))',
          }} />
        </div>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--text-primary)',
              letterSpacing: 'var(--tracking-wide)',
              lineHeight: 1,
            }}
          >
            {destination.iata}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-muted)',
              marginTop: 'var(--spacing-1)',
            }}
          >
            {destination.city}
          </div>
        </div>
      </div>
      <RouteProgressArc
        origin={origin}
        destination={destination}
        current={origin}
        progress={progress}
      />
    </div>
  );
}
