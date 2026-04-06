'use client';
import { useSearchParams } from 'next/navigation';
import FlightTable from '@/app/components/FlightTable';
import type { FlightRowData } from '@/app/components/FlightTableRow';

type Scenario = {
  flights: FlightRowData[];
  showRoute?: boolean;
  emptyMessage?: string;
};

const scenarios: Record<string, Scenario> = {
  MultipleFlights: {
    showRoute: true,
    flights: [
      {
        id: 1,
        callsign: 'AAL100',
        airline: 'American Airlines',
        status: 'EN_ROUTE',
        altitude: 38000,
        groundSpeed: 520,
        origin: { iata: 'JFK' },
        destination: { iata: 'LHR' },
      },
      {
        id: 2,
        callsign: 'BAW202',
        airline: 'British Airways',
        status: 'DELAYED',
        altitude: 34000,
        groundSpeed: 475,
        origin: { iata: 'EWR' },
        destination: { iata: 'LHR' },
      },
      {
        id: 3,
        callsign: 'DAL880',
        airline: 'Delta Air Lines',
        status: 'LANDED',
        altitude: 0,
        groundSpeed: 0,
        origin: { iata: 'ATL' },
        destination: { iata: 'CDG' },
      },
    ],
  },
  SingleFlight: {
    showRoute: true,
    flights: [
      {
        id: 4,
        callsign: 'UAL931',
        airline: 'United Airlines',
        status: 'BOARDING',
        altitude: 0,
        groundSpeed: 0,
        origin: { iata: 'SFO' },
        destination: { iata: 'NRT' },
      },
    ],
  },
  Empty: {
    flights: [],
    emptyMessage: 'No flights match the current filter',
  },
};

export default function FlightTableIsolation() {
  const searchParams = useSearchParams();
  const scenarioName = searchParams.get('s') || 'MultipleFlights';
  const props = scenarios[scenarioName] || scenarios['MultipleFlights'];

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
          maxWidth: 700,
          backgroundColor: 'var(--bg-surface)',
          border: 'var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}
      >
        <FlightTable {...props} />
      </div>
    </div>
  );
}
