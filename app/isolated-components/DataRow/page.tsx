'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import DataRow from '@/app/components/DataRow';

type DataRowSpec = {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: string;
};

type Scenario = {
  rows: DataRowSpec[];
};

const scenarios: Record<string, Scenario> = {
  Default: {
    rows: [
      { label: 'CALLSIGN', value: 'AAL100', mono: true },
      { label: 'AIRLINE', value: 'American Airlines' },
      { label: 'STATUS', value: 'EN ROUTE', highlight: 'var(--status-nominal)' },
    ],
  },
  Telemetry: {
    rows: [
      { label: 'ALTITUDE', value: '38,000 ft', mono: true },
      { label: 'SPEED', value: '520 kt', mono: true },
      { label: 'HEADING', value: '065°', mono: true },
      { label: 'SQUAWK', value: '2341', mono: true },
    ],
  },
  AirportInfo: {
    rows: [
      { label: 'IATA', value: 'JFK', mono: true },
      { label: 'CITY', value: 'New York' },
      { label: 'ELEVATION', value: '13 ft MSL', mono: true },
      { label: 'TIMEZONE', value: 'America/New_York' },
    ],
  },
};

export default function DataRowIsolation() {
  const searchParams = useSearchParams();
  const scenarioName = searchParams.get('s') || 'Default';
  const { rows } = scenarios[scenarioName] || scenarios['Default'];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-base)',
      }}
    >
      <div
        id="codeyam-capture"
        style={{
          width: '100%',
          maxWidth: 360,
          backgroundColor: 'var(--bg-surface)',
          border: 'var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-4)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-3)',
        }}
      >
        {rows.map((row, i) => (
          <DataRow key={i} {...row} />
        ))}
      </div>
    </div>
  );
}
