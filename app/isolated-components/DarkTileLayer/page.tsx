'use client';

import { use } from 'react';

const scenarios = {
  WorldView: { label: 'World View', zoom: 'z=2', center: '20°N 0°E', description: 'Global overview' },
  NYC: { label: 'NYC Detail', zoom: 'z=11', center: '40.7°N 74.0°W', description: 'City-level detail' },
  Atlantic: { label: 'North Atlantic', zoom: 'z=4', center: '40°N 30°W', description: 'Regional view' },
};

export default function DarkTileLayerIsolation({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = use(searchParams);
  const name = (params.s ?? 'WorldView') as keyof typeof scenarios;
  const scenario = scenarios[name] ?? scenarios.WorldView;

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
          width: 600,
          background: 'var(--bg-surface)',
          border: 'var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}
      >
        {/* Simulated dark map tile area */}
        <div
          style={{
            height: 300,
            background: '#03060f',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: 'var(--border-subtle)',
          }}
        >
          {/* Grid lines to suggest map tile boundaries */}
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.08 }}>
            {[1,2,3,4,5].map((i) => (
              <line key={`v${i}`} x1={`${i * 20}%`} y1="0" x2={`${i * 20}%`} y2="100%" stroke="#38bdf8" strokeWidth="1" />
            ))}
            {[1,2,3,4].map((i) => (
              <line key={`h${i}`} x1="0" y1={`${i * 25}%`} x2="100%" y2={`${i * 25}%`} stroke="#38bdf8" strokeWidth="1" />
            ))}
          </svg>
          <div style={{ textAlign: 'center', zIndex: 1 }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-2xs)',
                color: 'var(--text-muted)',
                letterSpacing: 'var(--tracking-wider)',
                marginBottom: 'var(--spacing-1)',
              }}
            >
              CARTO DARK MATTER
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)',
              }}
            >
              {scenario.center} · {scenario.zoom}
            </div>
          </div>
        </div>

        {/* Metadata panel */}
        <div style={{ padding: 'var(--spacing-4)' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--text-primary)',
              marginBottom: 'var(--spacing-1)',
            }}
          >
            {scenario.label}
          </div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            {scenario.description} · Proxied via /api/tiles
          </div>
          <div
            style={{
              marginTop: 'var(--spacing-3)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            © OpenStreetMap contributors © CARTO
          </div>
        </div>
      </div>
    </div>
  );
}
