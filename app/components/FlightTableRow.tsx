import React from 'react';
import Link from 'next/link';
import { StatusBadge } from '@/app/components/ui/badge';
import { flightStatusVariant } from '@/app/lib/variants';

export interface FlightRowData {
  id: number;
  callsign: string;
  airline: string;
  status: string;
  altitude: number;
  groundSpeed: number;
  origin: { iata: string };
  destination: { iata: string };
}

interface FlightTableRowProps {
  flight: FlightRowData;
  showRoute?: boolean;
}

export default function FlightTableRow({ flight, showRoute = true }: FlightTableRowProps) {
  return (
    <tr
      className="flight-row"
      style={{
        borderBottom: 'var(--border-subtle)',
        transition: 'background-color var(--transition-fast)',
      }}
    >
      <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
        <Link
          href={`/flights/${flight.callsign}`}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--accent-amber)',
            textDecoration: 'none',
          }}
        >
          {flight.callsign}
        </Link>
      </td>
      <td
        style={{
          padding: 'var(--spacing-3) var(--spacing-4)',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
        }}
      >
        {flight.airline}
      </td>
      {showRoute && (
        <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-primary)',
            }}
          >
            {flight.origin.iata} → {flight.destination.iata}
          </span>
        </td>
      )}
      <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
        <StatusBadge variant={flightStatusVariant(flight.status)}>
          {flight.status.replace('_', ' ')}
        </StatusBadge>
      </td>
      <td
        style={{
          padding: 'var(--spacing-3) var(--spacing-4)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
        }}
      >
        {flight.altitude.toLocaleString()}
      </td>
      <td
        style={{
          padding: 'var(--spacing-3) var(--spacing-4)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
        }}
      >
        {flight.groundSpeed}
      </td>
    </tr>
  );
}
