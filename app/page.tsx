import { prisma } from '@/app/lib/prisma';
import Link from 'next/link';
import { Plane, Bike, AlertTriangle, Train } from 'lucide-react';
import StatCard from '@/app/components/StatCard';
import PanelHeader from '@/app/components/PanelHeader';
import FlightTable from '@/app/components/FlightTable';
import AlertPanel from '@/app/components/AlertPanel';
import SubwayLineBadge from '@/app/components/SubwayLineBadge';
import { StatusBadge } from '@/app/components/ui/badge';
import { bikeAvailabilityPercent } from '@/app/lib/calculations';

export default async function CommandCenter() {
  const [flights, alerts, bikeStations, subwayLines, watchlistItems, airports] = await Promise.all([
    prisma.flight.findMany({
      include: { origin: true, destination: true },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.alert.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.bikeStation.findMany(),
    prisma.subwayLine.findMany({ orderBy: { lineId: 'asc' } }),
    prisma.watchlistItem.findMany({ take: 4, orderBy: { createdAt: 'desc' } }),
    prisma.airport.findMany({ where: { iata: { in: ['JFK', 'LGA', 'EWR'] } } }),
  ]);

  const activeFlights = flights.filter((f) => f.status === 'EN_ROUTE');
  const unreadAlerts = await prisma.alert.count({ where: { read: false } });
  const bikeStationsOnline = bikeStations.filter((s) => s.isInstalled && s.isRenting).length;
  const transitDisrupted = subwayLines.filter((l) => l.status !== 'GOOD_SERVICE').length;

  const now = new Date();

  return (
    <div style={{ padding: 'var(--spacing-6)', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 'var(--spacing-6)',
          paddingBottom: 'var(--spacing-4)',
          borderBottom: 'var(--border-subtle)',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              letterSpacing: 'var(--tracking-widest)',
              color: 'var(--accent-amber)',
              margin: 0,
              lineHeight: 1,
            }}
          >
            COMMAND CENTER
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-muted)',
              marginTop: 'var(--spacing-2)',
              letterSpacing: 'var(--tracking-wide)',
            }}
          >
            {now.toUTCString()}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-muted)',
              letterSpacing: 'var(--tracking-wider)',
            }}
          >
            UPTIME: 99.97%
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--accent-green)',
                display: 'block',
                boxShadow: '0 0 6px var(--accent-green)',
                animation: 'pulse 2s infinite',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                color: 'var(--accent-green)',
                letterSpacing: 'var(--tracking-wider)',
              }}
            >
              LIVE DATA
            </span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'var(--spacing-4)',
          marginBottom: 'var(--spacing-6)',
        }}
      >
        <StatCard
          label="ACTIVE FLIGHTS"
          value={activeFlights.length}
          sub={`${flights.length} total tracked`}
          accentColor="var(--accent-amber)"
          accentLeft
          icon={<Plane size={20} style={{ color: 'var(--accent-amber)' }} />}
        />
        <StatCard
          label="UNREAD ALERTS"
          value={unreadAlerts}
          sub={`${alerts.length} recent`}
          accentColor={unreadAlerts > 0 ? 'var(--status-critical)' : 'var(--accent-green)'}
          icon={<AlertTriangle size={20} style={{ color: 'var(--status-critical)' }} />}
        />
        <StatCard
          label="BIKE STATIONS"
          value={bikeStationsOnline}
          sub={`of ${bikeStations.length} online`}
          accentColor="var(--accent-blue)"
          icon={<Bike size={20} style={{ color: 'var(--accent-blue)' }} />}
        />
        <StatCard
          label="LINES DISRUPTED"
          value={transitDisrupted}
          sub={`of ${subwayLines.length} lines`}
          accentColor={transitDisrupted > 0 ? 'var(--status-warning)' : 'var(--accent-green)'}
          icon={
            <Train
              size={20}
              style={{ color: transitDisrupted > 0 ? 'var(--status-warning)' : 'var(--accent-green)' }}
            />
          }
        />
      </div>

      {/* Main Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.6fr 1fr',
          gap: 'var(--spacing-4)',
          marginBottom: 'var(--spacing-4)',
        }}
      >
        {/* Active Flights Table */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: 'var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}
        >
          <PanelHeader
            title="ACTIVE FLIGHTS"
            actions={
              <Link
                href="/air"
                style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-blue)', textDecoration: 'none' }}
              >
                View all →
              </Link>
            }
          />
          <FlightTable
            flights={activeFlights.slice(0, 10)}
            emptyMessage="No active flights"
          />
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          {/* Recent Alerts */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: 'var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
            }}
          >
            <PanelHeader
              title="RECENT ALERTS"
              actions={
                unreadAlerts > 0 ? (
                  <StatusBadge variant="warning">{unreadAlerts} UNREAD</StatusBadge>
                ) : undefined
              }
            />
            <AlertPanel alerts={alerts.slice(0, 5)} />
          </div>

          {/* Subway Status */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: 'var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
            }}
          >
            <PanelHeader
              title="SUBWAY STATUS"
              actions={
                <Link
                  href="/transit"
                  style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-blue)', textDecoration: 'none' }}
                >
                  View all →
                </Link>
              }
            />
            <div
              style={{
                padding: 'var(--spacing-3)',
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 'var(--spacing-2)',
              }}
            >
              {subwayLines.map((line) => (
                <Link
                  key={line.id}
                  href="/transit"
                  style={{ textDecoration: 'none', position: 'relative', display: 'inline-block' }}
                  title={`${line.name}: ${line.status.replace(/_/g, ' ')}`}
                >
                  <SubwayLineBadge
                    lineId={line.lineId}
                    color={line.color}
                    size="sm"
                  />
                  {line.status !== 'GOOD_SERVICE' && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '-3px',
                        right: '-3px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor:
                          line.status === 'SUSPENDED'
                            ? 'var(--status-critical)'
                            : 'var(--status-warning)',
                      }}
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--spacing-4)',
        }}
      >
        {/* Top Airports */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: 'var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}
        >
          <PanelHeader title="TOP AIRPORTS" />
          <div>
            {airports.map((airport) => (
              <Link
                key={airport.id}
                href={`/airport/${airport.iata}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--spacing-3) var(--spacing-4)',
                  borderBottom: 'var(--border-subtle)',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-base)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--accent-amber)',
                    }}
                  >
                    {airport.iata}
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    {airport.name}
                  </div>
                </div>
                <span style={{ color: 'var(--accent-blue)', fontSize: 'var(--text-xs)' }}>→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Bike Hotspots */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: 'var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}
        >
          <PanelHeader
            title="BIKE HOTSPOTS"
            actions={
              <Link
                href="/bikes"
                style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-blue)', textDecoration: 'none' }}
              >
                View all →
              </Link>
            }
          />
          <div>
            {bikeStations
              .sort((a, b) => b.bikesAvailable - a.bikesAvailable)
              .slice(0, 3)
              .map((station) => {
                const pct = bikeAvailabilityPercent(station.bikesAvailable, station.capacity);
                const barColor =
                  pct > 60
                    ? 'var(--accent-green)'
                    : pct > 20
                    ? 'var(--accent-amber)'
                    : 'var(--status-critical)';
                return (
                  <div
                    key={station.id}
                    style={{
                      padding: 'var(--spacing-3) var(--spacing-4)',
                      borderBottom: 'var(--border-subtle)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 'var(--spacing-2)',
                      }}
                    >
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                        {station.name}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 'var(--text-xs)',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {station.bikesAvailable}/{station.capacity}
                      </span>
                    </div>
                    <div
                      style={{
                        height: '4px',
                        backgroundColor: 'var(--bg-border)',
                        borderRadius: 'var(--radius-full)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${pct}%`,
                          backgroundColor: barColor,
                          borderRadius: 'var(--radius-full)',
                          transition: 'width var(--transition-slow)',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Watchlist Preview */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: 'var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}
        >
          <PanelHeader
            title="WATCHLIST"
            actions={
              <Link
                href="/watchlist"
                style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-blue)', textDecoration: 'none' }}
              >
                Manage →
              </Link>
            }
          />
          <div>
            {watchlistItems.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: 'var(--spacing-3) var(--spacing-4)',
                  borderBottom: 'var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-primary)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}
                  >
                    {item.label}
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                    {item.refId}
                  </div>
                </div>
                <StatusBadge variant={
                  ({ FLIGHT: 'nominal', BIKE_STATION: 'blue', SUBWAY_LINE: 'info', AIRPORT: 'warning' } as Record<string, 'nominal' | 'warning' | 'critical' | 'info' | 'neutral' | 'blue'>)[item.type] ?? 'neutral'
                }>
                  {item.type}
                </StatusBadge>
              </div>
            ))}
            {watchlistItems.length === 0 && (
              <div
                style={{
                  padding: 'var(--spacing-6)',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: 'var(--text-sm)',
                }}
              >
                No items tracked yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
