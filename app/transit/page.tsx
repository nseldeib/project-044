'use client';

import { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { AlertTriangle, Train, CheckCircle } from 'lucide-react';
import { StatusDot } from '@/app/components/ui/status-dot';
import { useTransit } from '@/app/hooks/useTransit';

const SubwayMap = dynamic(() => import('@/app/components/SubwayMap'), { ssr: false });

const STATUS_ORDER: Record<string, number> = {
  SUSPENDED: 0,
  DELAYS: 1,
  PLANNED_WORK: 2,
  SERVICE_CHANGE: 3,
  GOOD_SERVICE: 4,
};

const STATUS_LABEL: Record<string, string> = {
  GOOD_SERVICE: 'GOOD SERVICE',
  DELAYS: 'DELAYS',
  PLANNED_WORK: 'PLANNED WORK',
  SERVICE_CHANGE: 'SERVICE CHANGE',
  SUSPENDED: 'SUSPENDED',
};

const STATUS_COLOR: Record<string, string> = {
  GOOD_SERVICE: 'var(--accent-green)',
  DELAYS: 'var(--status-warning)',
  PLANNED_WORK: 'var(--accent-amber)',
  SERVICE_CHANGE: 'var(--accent-blue)',
  SUSPENDED: 'var(--status-critical)',
};

export default function TransitPage() {
  const { lines, summary, loading, refresh } = useTransit();
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);

  // Sync train positions every 15s: POST sync to move trains, then refresh data
  useEffect(() => {
    const sync = () => {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 8_000);
      fetch('/api/transit/sync', { method: 'POST', signal: ctrl.signal })
        .then(() => refresh())
        .catch(() => {})
        .finally(() => clearTimeout(timer));
    };
    sync();
    const interval = setInterval(sync, 15_000);
    return () => clearInterval(interval);
  }, [refresh]);

  const sortedLines = useMemo(
    () => [...lines].sort((a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9)),
    [lines]
  );

  const disrupted = lines.filter((l) => l.status !== 'GOOD_SERVICE');
  const allTrains = useMemo(
    () =>
      lines
        .flatMap((l) => l.trains.map((t) => ({ ...t, line: l })))
        .filter((t) => t.lat !== 0 && t.lon !== 0),
    [lines]
  );

  const visibleTrains = selectedLineId
    ? allTrains.filter((t) => t.lineId === selectedLineId)
    : allTrains;

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 56px)', overflow: 'hidden' }}>
      {/* ── Left Panel ── */}
      <div
        style={{
          width: '340px',
          flexShrink: 0,
          backgroundColor: 'var(--bg-surface)',
          borderRight: 'var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ padding: 'var(--spacing-4)', borderBottom: 'var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-3)' }}>
            <Train size={16} style={{ color: 'var(--accent-blue)' }} />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                letterSpacing: 'var(--tracking-wide)',
                color: 'var(--accent-blue)',
              }}
            >
              NYC MTA SUBWAY
            </span>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-2)' }}>
            {[
              { label: 'LINES', value: summary?.totalLines ?? '—', color: 'var(--text-primary)' },
              { label: 'DISRUPTED', value: summary?.linesWithIssues ?? '—', color: summary && summary.linesWithIssues > 0 ? 'var(--status-warning)' : 'var(--accent-green)' },
              { label: 'TRAINS', value: summary?.totalTrains ?? '—', color: 'var(--accent-blue)' },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--spacing-2) var(--spacing-3)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-bold)', color: s.color, lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', letterSpacing: 'var(--tracking-wider)', marginTop: '2px' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disruption Banners */}
        {disrupted.length > 0 && (
          <div style={{ padding: 'var(--spacing-3) var(--spacing-4)', borderBottom: 'var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            {disrupted.slice(0, 3).map((line) => (
              <div
                key={line.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-2)',
                  padding: 'var(--spacing-2) var(--spacing-3)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: line.status === 'SUSPENDED' ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)',
                  border: line.status === 'SUSPENDED' ? '1px solid rgba(239,68,68,0.25)' : '1px solid rgba(245,158,11,0.2)',
                }}
              >
                <AlertTriangle size={12} style={{ color: STATUS_COLOR[line.status], flexShrink: 0 }} />
                <span
                  style={{
                    width: '22px', height: '22px', borderRadius: '50%',
                    background: line.color, display: 'inline-flex', alignItems: 'center',
                    justifyContent: 'center', fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-2xs)', fontWeight: 'var(--font-weight-bold)',
                    color: '#fff', flexShrink: 0,
                  }}
                >
                  {line.lineId}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: STATUS_COLOR[line.status], letterSpacing: 'var(--tracking-wide)' }}>
                    {STATUS_LABEL[line.status]}
                  </div>
                  {line.statusText && (
                    <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {line.statusText}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Line List */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {loading && (
            <div style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>
              Loading...
            </div>
          )}

          {/* All clear banner */}
          {!loading && disrupted.length === 0 && lines.length > 0 && (
            <div
              style={{
                margin: 'var(--spacing-3) var(--spacing-4)',
                padding: 'var(--spacing-2) var(--spacing-3)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(74,222,128,0.08)',
                border: '1px solid rgba(74,222,128,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-2)',
              }}
            >
              <CheckCircle size={13} style={{ color: 'var(--accent-green)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--accent-green)', letterSpacing: 'var(--tracking-wide)' }}>
                ALL LINES OPERATING NORMALLY
              </span>
            </div>
          )}

          {/* Line rows */}
          {sortedLines.map((line) => {
            const isSelected = selectedLineId === line.lineId;
            return (
              <button
                key={line.id}
                onClick={() => setSelectedLineId(isSelected ? null : line.lineId)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-3)',
                  width: '100%',
                  padding: 'var(--spacing-3) var(--spacing-4)',
                  borderBottom: 'var(--border-subtle)',
                  background: isSelected ? 'var(--bg-elevated)' : 'transparent',
                  border: 'none',
                  borderLeft: isSelected ? `3px solid ${line.color}` : '3px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background var(--transition-fast)',
                }}
              >
                {/* Line dot */}
                <span
                  style={{
                    width: '28px', height: '28px', borderRadius: '50%', background: line.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-weight-bold)', color: '#fff', flexShrink: 0,
                    boxShadow: isSelected ? `0 0 8px ${line.color}66` : 'none',
                  }}
                >
                  {line.lineId}
                </span>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--spacing-2)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 'var(--font-weight-medium)' }}>
                      {line.name}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)',
                        letterSpacing: 'var(--tracking-wide)',
                        color: STATUS_COLOR[line.status],
                        flexShrink: 0,
                      }}
                    >
                      {line.status !== 'GOOD_SERVICE' ? STATUS_LABEL[line.status] : ''}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginTop: '2px' }}>
                    {line.status === 'GOOD_SERVICE' ? (
                      <StatusDot status="nominal" />
                    ) : line.status === 'SUSPENDED' ? (
                      <StatusDot status="critical" />
                    ) : (
                      <StatusDot status="warning" />
                    )}
                    <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>
                      {line.trains.length} train{line.trains.length !== 1 ? 's' : ''} active
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: 'var(--spacing-3) var(--spacing-4)',
            borderTop: 'var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-2)',
          }}
        >
          <StatusDot status="nominal" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-muted)', letterSpacing: 'var(--tracking-wide)' }}>
            {loading ? 'LOADING...' : `${visibleTrains.length} TRAINS ON MAP`}
          </span>
          {selectedLineId && (
            <button
              onClick={() => setSelectedLineId(null)}
              style={{
                marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)',
                color: 'var(--accent-amber)', background: 'none', border: 'none', cursor: 'pointer',
                letterSpacing: 'var(--tracking-wide)',
              }}
            >
              SHOW ALL
            </button>
          )}
        </div>
      </div>

      {/* ── Map ── */}
      <div style={{ flex: 1, position: 'relative', minHeight: 0, height: '100%' }}>
        <SubwayMap lines={lines} selectedLineId={selectedLineId} />

        {/* Train detail overlay — active trains for selected line */}
        {selectedLineId && visibleTrains.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: 'var(--spacing-4)',
              right: 'var(--spacing-4)',
              zIndex: 1000,
              width: '260px',
              backgroundColor: 'var(--bg-surface)',
              border: 'var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ padding: 'var(--spacing-3) var(--spacing-4)', borderBottom: 'var(--border-subtle)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', letterSpacing: 'var(--tracking-wider)', color: 'var(--text-muted)' }}>
                ACTIVE TRAINS — {selectedLineId} LINE
              </span>
            </div>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {visibleTrains.map((train) => (
                <div
                  key={train.id}
                  style={{
                    padding: 'var(--spacing-3) var(--spacing-4)',
                    borderBottom: 'var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 'var(--font-weight-medium)' }}>
                      {train.trainId}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)',
                      color: train.status === 'DELAYED' ? 'var(--status-critical)' : train.status === 'AT_STATION' ? 'var(--accent-blue)' : 'var(--accent-green)',
                      letterSpacing: 'var(--tracking-wide)',
                    }}>
                      {train.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    {train.direction === 'N' ? '↑' : '↓'} {train.currentStop}
                  </div>
                  {train.delay > 0 && (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--status-warning)' }}>
                      +{train.delay} min
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
