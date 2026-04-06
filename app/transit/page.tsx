import { prisma } from '@/app/lib/prisma';
import { StatusBadge } from '@/app/components/ui/badge';
import { AlertTriangle, Train } from 'lucide-react';
import SubwayLineCard from '@/app/components/SubwayLineCard';
import PanelHeader from '@/app/components/PanelHeader';

function trainStatusVariant(status: string): 'nominal' | 'warning' | 'critical' | 'info' | 'neutral' | 'blue' {
  switch (status) {
    case 'IN_TRANSIT': return 'nominal';
    case 'AT_STATION':  return 'blue';
    case 'DELAYED':     return 'warning';
    default:            return 'neutral';
  }
}

export default async function TransitPage() {
  const lines = await prisma.subwayLine.findMany({
    orderBy: { lineId: 'asc' },
    include: {
      trains: { orderBy: { updatedAt: 'desc' } },
    },
  });

  const disrupted = lines.filter((l) => l.status !== 'GOOD_SERVICE');
  const suspended = lines.filter((l) => l.status === 'SUSPENDED');
  const nominal = lines.filter((l) => l.status === 'GOOD_SERVICE');
  const allTrains = lines.flatMap((l) => l.trains.map((t) => ({ ...t, line: l })));

  return (
    <div style={{ padding: 'var(--spacing-6)', maxWidth: '1200px', margin: '0 auto' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
            <Train size={24} style={{ color: 'var(--accent-blue)' }} />
            <h1
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-3xl)',
                fontWeight: 'var(--font-weight-bold)',
                letterSpacing: 'var(--tracking-widest)',
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              NYC MTA SUBWAY
            </h1>
          </div>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-muted)',
              marginTop: 'var(--spacing-2)',
              letterSpacing: 'var(--tracking-wide)',
            }}
          >
            {nominal.length} lines nominal · {disrupted.length} with issues · {allTrains.length} active trains
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: disrupted.length > 0 ? 'var(--status-warning)' : 'var(--accent-green)',
              }}
            >
              {disrupted.length}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-2xs)',
                color: 'var(--text-muted)',
                letterSpacing: 'var(--tracking-wider)',
              }}
            >
              DISRUPTED
            </div>
          </div>
        </div>
      </div>

      {/* Critical Banners */}
      {suspended.length > 0 && (
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-4)',
            marginBottom: 'var(--spacing-4)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--spacing-3)',
          }}
        >
          <AlertTriangle size={18} style={{ color: 'var(--status-critical)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--status-critical)',
                letterSpacing: 'var(--tracking-wide)',
                marginBottom: 'var(--spacing-2)',
              }}
            >
              SERVICE SUSPENSION IN EFFECT
            </div>
            {suspended.map((line) => (
              <div
                key={line.id}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-1)' }}
              >
                <SubwayLineCard line={line} />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  {line.statusText}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disrupted Lines (non-suspended) */}
      {disrupted.filter((l) => l.status !== 'SUSPENDED').length > 0 && (
        <div
          style={{
            backgroundColor: 'var(--accent-amber-glow)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-4)',
            marginBottom: 'var(--spacing-4)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--accent-amber)',
              letterSpacing: 'var(--tracking-wide)',
              marginBottom: 'var(--spacing-3)',
            }}
          >
            SERVICE ADVISORIES
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            {disrupted
              .filter((l) => l.status !== 'SUSPENDED')
              .map((line) => (
                <div key={line.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                  <SubwayLineCard line={line} />
                  <StatusBadge variant="warning">{line.status.replace(/_/g, ' ')}</StatusBadge>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    {line.statusText || line.name}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* All Lines Grid */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: 'var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          marginBottom: 'var(--spacing-6)',
        }}
      >
        <PanelHeader title="ALL LINES — SERVICE STATUS" />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1px',
            backgroundColor: 'var(--bg-border)',
          }}
        >
          {lines.map((line) => (
            <SubwayLineCard key={line.id} line={line} />
          ))}
        </div>
      </div>

      {/* Active Trains Table */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: 'var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: 'var(--spacing-4)', borderBottom: 'var(--border-subtle)' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              letterSpacing: 'var(--tracking-wide)',
              color: 'var(--text-primary)',
            }}
          >
            ACTIVE TRAINS
            <span style={{ marginLeft: 'var(--spacing-2)', fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>
              {allTrains.length} total
            </span>
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['TRAIN ID', 'LINE', 'DIRECTION', 'CURRENT STOP', 'NEXT STOP', 'STATUS', 'DELAY'].map((h) => (
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
              {allTrains.map((train) => (
                <tr key={train.id} style={{ borderBottom: 'var(--border-subtle)' }}>
                  <td
                    style={{
                      padding: 'var(--spacing-3) var(--spacing-4)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {train.trainId}
                  </td>
                  <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: train.line.color,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: '#fff',
                      }}
                    >
                      {train.lineId}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: 'var(--spacing-3) var(--spacing-4)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {train.direction === 'N' ? 'NORTHBOUND' : 'SOUTHBOUND'}
                  </td>
                  <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                    {train.currentStop}
                  </td>
                  <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    {train.nextStop}
                  </td>
                  <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                    <StatusBadge variant={trainStatusVariant(train.status)}>
                      {train.status.replace(/_/g, ' ')}
                    </StatusBadge>
                  </td>
                  <td
                    style={{
                      padding: 'var(--spacing-3) var(--spacing-4)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-sm)',
                      color: train.delay > 0 ? 'var(--status-warning)' : 'var(--text-muted)',
                    }}
                  >
                    {train.delay > 0 ? `+${train.delay} min` : '—'}
                  </td>
                </tr>
              ))}
              {allTrains.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}
                  >
                    No active trains
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
