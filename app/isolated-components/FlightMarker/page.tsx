'use client';

import { use } from 'react';

const jfk = { iata: 'JFK', lat: 40.6413, lon: -73.7781 };
const lhr = { iata: 'LHR', lat: 51.47, lon: -0.4543 };
const sfo = { iata: 'SFO', lat: 37.6213, lon: -122.379 };
const nrt = { iata: 'NRT', lat: 35.7647, lon: 140.3864 };

const scenarios = {
  Transatlantic: {
    callsign: 'AAL100', airline: 'American Airlines',
    altitude: 38000, groundSpeed: 520, heading: 65,
    lat: 48.2, lon: -35.1, origin: jfk, destination: lhr,
  },
  Pacific: {
    callsign: 'UAL89', airline: 'United Airlines',
    altitude: 36000, groundSpeed: 510, heading: 295,
    lat: 51.3, lon: 168.4, origin: sfo, destination: nrt,
  },
  NoRoute: {
    callsign: 'SKY42', airline: 'Unknown',
    altitude: 22000, groundSpeed: 380, heading: 180,
    lat: 35.0, lon: -80.0,
    origin: { iata: '', lat: 0, lon: 0 },
    destination: { iata: '', lat: 0, lon: 0 },
  },
};

type ScenarioName = keyof typeof scenarios;

function PlaneIcon({ heading }: { heading: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      style={{ transform: `rotate(${heading}deg)`, display: 'block' }}
    >
      <polygon points="12,2 8,18 12,15 16,18" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
    </svg>
  );
}

export default function FlightMarkerIsolation({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = use(searchParams);
  const name = (params.s ?? 'Transatlantic') as ScenarioName;
  const flight = scenarios[name] ?? scenarios.Transatlantic;
  const hasRoute = flight.origin?.iata && flight.destination?.iata;

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
        {/* Plane icon */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-2)' }}>
          <PlaneIcon heading={flight.heading} />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-2xs)',
              color: 'var(--text-muted)',
              letterSpacing: 'var(--tracking-wider)',
            }}
          >
            {flight.heading}°
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
            minWidth: 200,
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-primary)',
          }}
        >
          <div
            style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--accent-amber)',
              marginBottom: 'var(--spacing-1)',
            }}
          >
            {flight.callsign}
          </div>
          <div style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-1)' }}>
            {flight.airline}
          </div>
          {hasRoute && (
            <div style={{ marginBottom: 'var(--spacing-1)' }}>
              {flight.origin.iata} → {flight.destination.iata}
            </div>
          )}
          <div style={{ marginBottom: 'var(--spacing-1)' }}>
            ALT: {flight.altitude.toLocaleString()} ft
          </div>
          <div style={{ marginBottom: 'var(--spacing-2)' }}>
            SPD: {flight.groundSpeed} kt
          </div>
          <a
            href={`/flights/${flight.callsign}`}
            style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontSize: 'var(--text-xs)' }}
          >
            View details →
          </a>
        </div>
      </div>
    </div>
  );
}
