import { prisma } from '@/app/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { StatusBadge } from '@/app/components/ui/badge';
import { ArrowLeft, MapPin } from 'lucide-react';
import { flightStatusVariant } from '@/app/lib/variants';
import { formatTime } from '@/app/lib/formatters';

function rowHighlight(status: string): string {
  if (status === 'DELAYED' || status === 'DIVERTED') return 'rgba(245, 158, 11, 0.05)';
  if (status === 'CANCELLED') return 'rgba(239, 68, 68, 0.05)';
  return 'transparent';
}

interface FlightWithAirports {
  id: number;
  callsign: string;
  airline: string;
  flightNumber: string;
  status: string;
  departureTime: Date;
  arrivalTime: Date;
  gate: string;
  terminal: string;
  delayMinutes: number;
  origin: { iata: string; city: string };
  destination: { iata: string; city: string };
}

function AirportFlightTable({
  title,
  flights,
  mode,
  accentColor,
}: {
  title: string;
  flights: FlightWithAirports[];
  mode: 'departure' | 'arrival';
  accentColor: string;
}) {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: 'var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: 'var(--spacing-4)',
          borderBottom: 'var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            letterSpacing: 'var(--tracking-wide)',
            color: accentColor,
          }}
        >
          {title}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>
          {flights.length} flights
        </span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['FLIGHT', 'AIRLINE', mode === 'departure' ? 'DEST' : 'ORIGIN', 'STATUS', 'TIME', 'GATE'].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      padding: 'var(--spacing-2) var(--spacing-3)',
                      textAlign: 'left',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-2xs)',
                      color: 'var(--text-muted)',
                      letterSpacing: 'var(--tracking-wider)',
                      fontWeight: 'var(--font-weight-normal)',
                      borderBottom: 'var(--border-subtle)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {flights.map((flight) => (
              <tr
                key={flight.id}
                style={{ borderBottom: 'var(--border-subtle)', backgroundColor: rowHighlight(flight.status) }}
              >
                <td style={{ padding: 'var(--spacing-3)' }}>
                  <Link
                    href={`/flights/${flight.callsign}`}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: accentColor,
                      textDecoration: 'none',
                    }}
                  >
                    {flight.callsign}
                  </Link>
                </td>
                <td
                  style={{
                    padding: 'var(--spacing-3)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-secondary)',
                    maxWidth: '120px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {flight.airline}
                </td>
                <td style={{ padding: 'var(--spacing-3)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                    {mode === 'departure' ? flight.destination.iata : flight.origin.iata}
                  </div>
                  <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>
                    {mode === 'departure' ? flight.destination.city : flight.origin.city}
                  </div>
                </td>
                <td style={{ padding: 'var(--spacing-3)' }}>
                  <StatusBadge variant={flightStatusVariant(flight.status)}>
                    {flight.status.replace('_', ' ')}
                  </StatusBadge>
                </td>
                <td style={{ padding: 'var(--spacing-3)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                    {formatTime(mode === 'departure' ? flight.departureTime : flight.arrivalTime)}
                  </div>
                  {flight.delayMinutes > 0 && (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--status-warning)' }}>
                      +{flight.delayMinutes}m
                    </div>
                  )}
                </td>
                <td
                  style={{
                    padding: 'var(--spacing-3)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {flight.gate || '—'}
                  {flight.terminal && (
                    <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-2xs)' }}>
                      {' '}T{flight.terminal}
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {flights.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}
                >
                  No flights
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default async function AirportPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const airport = await prisma.airport.findUnique({
    where: { iata: code.toUpperCase() },
  });

  if (!airport) notFound();

  const [departures, arrivals] = await Promise.all([
    prisma.flight.findMany({
      where: { originId: airport.id },
      include: { origin: true, destination: true },
      orderBy: { departureTime: 'asc' },
    }),
    prisma.flight.findMany({
      where: { destinationId: airport.id },
      include: { origin: true, destination: true },
      orderBy: { arrivalTime: 'asc' },
    }),
  ]);

  return (
    <div style={{ padding: 'var(--spacing-6)', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Back */}
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--spacing-2)',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-muted)',
          textDecoration: 'none',
          marginBottom: 'var(--spacing-6)',
        }}
      >
        <ArrowLeft size={14} />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: 'var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-6)',
          marginBottom: 'var(--spacing-6)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-2)' }}>
              <h1
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-4xl)',
                  fontWeight: 'var(--font-weight-black)',
                  color: 'var(--accent-amber)',
                  margin: 0,
                  lineHeight: 1,
                  letterSpacing: 'var(--tracking-widest)',
                }}
              >
                {airport.iata}
              </h1>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-muted)',
                  letterSpacing: 'var(--tracking-wide)',
                }}
              >
                {airport.icao}
              </span>
            </div>
            <div
              style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--text-primary)',
                marginBottom: 'var(--spacing-2)',
              }}
            >
              {airport.name}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-2)',
                color: 'var(--text-secondary)',
                fontSize: 'var(--text-sm)',
              }}
            >
              <MapPin size={14} />
              {airport.city}, {airport.country}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-sm)',
                color: 'var(--text-muted)',
                marginBottom: 'var(--spacing-2)',
              }}
            >
              <span style={{ letterSpacing: 'var(--tracking-wider)' }}>ELEVATION</span>
              <br />
              <span
                style={{
                  fontSize: 'var(--text-xl)',
                  color: 'var(--text-primary)',
                  fontWeight: 'var(--font-weight-bold)',
                }}
              >
                {airport.elevation.toLocaleString()} ft
              </span>
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                color: 'var(--text-muted)',
                letterSpacing: 'var(--tracking-wide)',
              }}
            >
              TZ: {airport.timezone}
            </div>
          </div>
        </div>
      </div>

      {/* Split View */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-6)' }}>
        <AirportFlightTable
          title="DEPARTURES"
          flights={departures}
          mode="departure"
          accentColor="var(--accent-amber)"
        />
        <AirportFlightTable
          title="ARRIVALS"
          flights={arrivals}
          mode="arrival"
          accentColor="var(--accent-blue)"
        />
      </div>
    </div>
  );
}
