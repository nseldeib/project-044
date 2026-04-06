import React from 'react';
import FlightTableRow, { FlightRowData } from './FlightTableRow';

interface FlightTableProps {
  flights: FlightRowData[];
  showRoute?: boolean;
  emptyMessage?: string;
}

export default function FlightTable({
  flights,
  showRoute = true,
  emptyMessage = 'No flights',
}: FlightTableProps) {
  const headers = showRoute
    ? ['CALLSIGN', 'AIRLINE', 'ROUTE', 'STATUS', 'ALT (ft)', 'SPD (kt)']
    : ['CALLSIGN', 'AIRLINE', 'STATUS', 'ALT (ft)', 'SPD (kt)'];

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {headers.map((h) => (
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
          {flights.map((flight) => (
            <FlightTableRow key={flight.id} flight={flight} showRoute={showRoute} />
          ))}
          {flights.length === 0 && (
            <tr>
              <td
                colSpan={headers.length}
                style={{
                  padding: 'var(--spacing-8)',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: 'var(--text-sm)',
                }}
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
