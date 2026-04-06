'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import FlightTableRow from '@/app/components/FlightTableRow';
import type { FlightRowData } from '@/app/components/FlightTableRow';

type Scenario = {
  flight: FlightRowData;
  showRoute?: boolean;
};

const scenarios: Record<string, Scenario> = {
  EnRoute: {
    showRoute: true,
    flight: {
      id: 1,
      callsign: 'AAL100',
      airline: 'American Airlines',
      status: 'EN_ROUTE',
      altitude: 38000,
      groundSpeed: 520,
      origin: { iata: 'JFK' },
      destination: { iata: 'LHR' },
    },
  },
  Delayed: {
    showRoute: true,
    flight: {
      id: 2,
      callsign: 'BAW112',
      airline: 'British Airways',
      status: 'DELAYED',
      altitude: 35000,
      groundSpeed: 490,
      origin: { iata: 'JFK' },
      destination: { iata: 'LHR' },
    },
  },
  Landed: {
    showRoute: true,
    flight: {
      id: 3,
      callsign: 'DAL401',
      airline: 'Delta Air Lines',
      status: 'LANDED',
      altitude: 0,
      groundSpeed: 0,
      origin: { iata: 'ATL' },
      destination: { iata: 'LAX' },
    },
  },
  Cancelled: {
    showRoute: true,
    flight: {
      id: 4,
      callsign: 'AAL300',
      airline: 'American Airlines',
      status: 'CANCELLED',
      altitude: 0,
      groundSpeed: 0,
      origin: { iata: 'ORD' },
      destination: { iata: 'MIA' },
    },
  },
};

const HEADERS = ['CALLSIGN', 'AIRLINE', 'ROUTE', 'STATUS', 'ALT (ft)', 'SPD (kt)'];

export default function FlightTableRowIsolation() {
  const searchParams = useSearchParams();
  const scenarioName = searchParams.get('s') || 'EnRoute';
  const props = scenarios[scenarioName] || scenarios['EnRoute'];

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
      <div id="codeyam-capture" style={{ width: '100%', maxWidth: 700 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {HEADERS.map((h) => (
                <th
                  key={h}
                  style={{
                    padding: 'var(--spacing-2) var(--spacing-4)',
                    textAlign: 'left',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-2xs)',
                    color: 'var(--text-muted)',
                    letterSpacing: 'var(--tracking-wider)',
                    fontWeight: 'var(--font-weight-normal)',
                    borderBottom: 'var(--border-subtle)',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <FlightTableRow {...props} />
          </tbody>
        </table>
      </div>
    </div>
  );
}
