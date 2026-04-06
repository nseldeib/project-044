import { prisma } from '@/app/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { StatusBadge } from '@/app/components/ui/badge';
import { StatusDot } from '@/app/components/ui/status-dot';
import { ArrowLeft, Plane, BookmarkPlus } from 'lucide-react';
import DataRow from '@/app/components/DataRow';
import AlertPanel from '@/app/components/AlertPanel';
import RouteProgressArc from '@/app/components/RouteProgressArc';
import { flightStatusVariant } from '@/app/lib/variants';
import { formatTime, formatDMS } from '@/app/lib/formatters';
import { flightProgressPercent } from '@/app/lib/calculations';

export default async function FlightDetailPage({
  params,
}: {
  params: Promise<{ callsign: string }>;
}) {
  const { callsign } = await params;
  const flight = await prisma.flight.findUnique({
    where: { callsign: callsign.toUpperCase() },
    include: {
      origin: true,
      destination: true,
      alerts: { orderBy: { createdAt: 'desc' } },
      watchlistItems: true,
    },
  });

  if (!flight) notFound();

  const isEnRoute = flight.status === 'EN_ROUTE';
  const vertRateSign = flight.verticalRate > 0 ? '+' : '';

  const progress = flightProgressPercent(
    { lat: flight.origin.lat, lon: flight.origin.lon },
    { lat: flight.lat, lon: flight.lon },
    { lat: flight.destination.lat, lon: flight.destination.lon },
  );

  return (
    <div style={{ padding: 'var(--spacing-6)', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Back Link */}
      <Link
        href="/air"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--spacing-2)',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-muted)',
          textDecoration: 'none',
          marginBottom: 'var(--spacing-6)',
          transition: 'color var(--transition-fast)',
        }}
      >
        <ArrowLeft size={14} />
        Back to Air Traffic
      </Link>

      {/* Hero */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: 'var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-6)',
          marginBottom: 'var(--spacing-4)',
        }}
      >
        <div
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-4)' }}
        >
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-4xl)',
                fontWeight: 'var(--font-weight-black)',
                letterSpacing: 'var(--tracking-widest)',
                color: 'var(--accent-amber)',
                margin: 0,
                lineHeight: 1,
              }}
            >
              {flight.callsign}
            </h1>
            <div style={{ marginTop: 'var(--spacing-2)', fontSize: 'var(--text-lg)', color: 'var(--text-secondary)' }}>
              {flight.airline} · Flight {flight.flightNumber}
            </div>
            <div
              style={{
                marginTop: 'var(--spacing-1)',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-sm)',
                color: 'var(--text-muted)',
              }}
            >
              {flight.aircraftType} · {flight.registration}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--spacing-2)' }}>
            <StatusBadge variant={flightStatusVariant(flight.status)}>
              {flight.status.replace('_', ' ')}
            </StatusBadge>
            {isEnRoute && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <StatusDot status="nominal" />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--accent-green)',
                    letterSpacing: 'var(--tracking-wide)',
                  }}
                >
                  LIVE
                </span>
              </div>
            )}
            <Link
              href="/watchlist"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--spacing-2)',
                padding: 'var(--spacing-2) var(--spacing-3)',
                backgroundColor: 'var(--bg-elevated)',
                border: 'var(--border-default)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-xs)',
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent-amber)',
                textDecoration: 'none',
                letterSpacing: 'var(--tracking-wide)',
              }}
            >
              <BookmarkPlus size={12} />
              TRACK THIS FLIGHT
            </Link>
          </div>
        </div>

        {/* Route */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-4)',
            padding: 'var(--spacing-4)',
            backgroundColor: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-3xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--text-primary)',
                lineHeight: 1,
              }}
            >
              {flight.origin.iata}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 'var(--spacing-1)' }}>
              {flight.origin.city}
            </div>
            <div
              style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--spacing-1)' }}
            >
              {formatTime(flight.actualDep ?? flight.departureTime)}
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-1)' }}>
            <Plane size={20} style={{ color: 'var(--accent-amber)' }} />
            <div
              style={{
                height: '1px',
                width: '100%',
                backgroundImage: 'linear-gradient(to right, var(--accent-amber-dim), var(--accent-amber), var(--accent-amber-dim))',
              }}
            />
          </div>

          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-3xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--text-primary)',
                lineHeight: 1,
              }}
            >
              {flight.destination.iata}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 'var(--spacing-1)' }}>
              {flight.destination.city}
            </div>
            <div
              style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--spacing-1)' }}
            >
              {formatTime(flight.actualArr ?? flight.arrivalTime)}
            </div>
          </div>
        </div>

        {/* Route Arc Visualization */}
        {isEnRoute && (
          <div style={{ marginTop: 'var(--spacing-4)' }}>
            <RouteProgressArc
              origin={flight.origin}
              destination={flight.destination}
              current={{ lat: flight.lat, lon: flight.lon }}
              progress={progress}
            />
          </div>
        )}
      </div>

      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}
      >
        {/* Status Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: 'var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-4)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-muted)',
              letterSpacing: 'var(--tracking-wider)',
              marginBottom: 'var(--spacing-4)',
            }}
          >
            FLIGHT STATUS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            <DataRow label="STATUS">
              <StatusBadge variant={flightStatusVariant(flight.status)}>
                {flight.status.replace('_', ' ')}
              </StatusBadge>
            </DataRow>
            {flight.delayMinutes > 0 && (
              <DataRow label="DELAY">
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--status-warning)' }}>
                  +{flight.delayMinutes} minutes
                </span>
              </DataRow>
            )}
            {flight.gate && (
              <DataRow label="GATE">
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                  {flight.gate}
                </span>
              </DataRow>
            )}
            {flight.terminal && (
              <DataRow label="TERMINAL">
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                  {flight.terminal}
                </span>
              </DataRow>
            )}
            <DataRow label="SQUAWK">
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--accent-blue)' }}>
                {flight.squawk || '—'}
              </span>
            </DataRow>
            <DataRow label="ON GROUND">
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-sm)',
                  color: flight.onGround ? 'var(--accent-green)' : 'var(--text-muted)',
                }}
              >
                {flight.onGround ? 'YES' : 'NO'}
              </span>
            </DataRow>
          </div>
        </div>

        {/* Live Telemetry */}
        {isEnRoute && (
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-4)',
              boxShadow: 'var(--shadow-amber)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                color: 'var(--accent-amber)',
                letterSpacing: 'var(--tracking-wider)',
                marginBottom: 'var(--spacing-4)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-2)',
              }}
            >
              <StatusDot status="nominal" />
              LIVE TELEMETRY
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-4)' }}>
              {[
                { label: 'ALTITUDE', value: `${flight.altitude.toLocaleString()}`, unit: 'ft' },
                { label: 'GROUND SPEED', value: `${flight.groundSpeed}`, unit: 'kt' },
                { label: 'HEADING', value: `${flight.heading.toFixed(0)}`, unit: '°' },
                { label: 'VERT RATE', value: `${vertRateSign}${flight.verticalRate}`, unit: 'ft/min' },
              ].map((metric) => (
                <div key={metric.label}>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-2xs)',
                      color: 'var(--text-muted)',
                      letterSpacing: 'var(--tracking-wider)',
                      marginBottom: 'var(--spacing-1)',
                    }}
                  >
                    {metric.label}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-2xl)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--text-primary)',
                      lineHeight: 1,
                    }}
                  >
                    {metric.value}
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginLeft: '4px' }}>
                      {metric.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Position */}
      {isEnRoute && (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: 'var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-4)',
            marginBottom: 'var(--spacing-4)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-muted)',
              letterSpacing: 'var(--tracking-wider)',
              marginBottom: 'var(--spacing-3)',
            }}
          >
            POSITION
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-8)' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', marginBottom: '2px' }}>
                LATITUDE
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                {formatDMS(flight.lat, flight.lon).split(' ')[0]}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', marginBottom: '2px' }}>
                LONGITUDE
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                {formatDMS(flight.lat, flight.lon).split(' ')[1]}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', marginBottom: '2px' }}>
                DECIMAL
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                {flight.lat.toFixed(4)}, {flight.lon.toFixed(4)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alerts */}
      {flight.alerts.length > 0 && (
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
              alignItems: 'center',
              gap: 'var(--spacing-2)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                letterSpacing: 'var(--tracking-wide)',
                color: 'var(--text-primary)',
              }}
            >
              ALERTS ({flight.alerts.length})
            </span>
          </div>
          <AlertPanel
            alerts={flight.alerts.map((a) => ({
              ...a,
              createdAt: a.createdAt.toISOString(),
              body: a.body ?? '',
            }))}
          />
        </div>
      )}
    </div>
  );
}
