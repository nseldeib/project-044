'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { StatusBadge } from '@/app/components/ui/badge';
import { StatusDot } from '@/app/components/ui/status-dot';
import { Search } from 'lucide-react';
import { useFlights } from '@/app/hooks/useFlights';
import { flightStatusVariant } from '@/app/lib/variants';

const FlightMap = dynamic(() => import('@/app/components/FlightMap'), { ssr: false });

type StatusFilter = 'ALL' | 'EN_ROUTE' | 'DELAYED' | 'BOARDING' | 'LANDED' | 'DIVERTED' | 'CANCELLED';

export default function AirTrafficPage() {
  const { flights, loading } = useFlights();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');

  const filtered = useMemo(() => {
    return flights.filter((f) => {
      const matchSearch =
        !search ||
        f.callsign.toLowerCase().includes(search.toLowerCase()) ||
        f.airline.toLowerCase().includes(search.toLowerCase()) ||
        f.origin.iata.toLowerCase().includes(search.toLowerCase()) ||
        f.destination.iata.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || f.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [flights, search, statusFilter]);

  const statuses: StatusFilter[] = ['ALL', 'EN_ROUTE', 'BOARDING', 'DELAYED', 'DIVERTED', 'LANDED', 'CANCELLED'];

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 56px)', overflow: 'hidden' }}>
      {/* Left Panel */}
      <div
        style={{
          width: '320px',
          flexShrink: 0,
          backgroundColor: 'var(--bg-surface)',
          borderRight: 'var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Panel Header */}
        <div style={{ padding: 'var(--spacing-4)', borderBottom: 'var(--border-subtle)' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              letterSpacing: 'var(--tracking-wide)',
              color: 'var(--accent-amber)',
              marginBottom: 'var(--spacing-3)',
            }}
          >
            AIR TRAFFIC
            <span
              style={{
                marginLeft: 'var(--spacing-2)',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-2xs)',
                color: 'var(--text-muted)',
              }}
            >
              {loading ? '...' : `${filtered.length} flights`}
            </span>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 'var(--spacing-3)' }}>
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: 'var(--spacing-2)',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              placeholder="Search callsign, airline, route..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'var(--bg-elevated)',
                border: 'var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--spacing-2) var(--spacing-2) var(--spacing-2) var(--spacing-6)',
                fontSize: 'var(--text-sm)',
                color: 'var(--text-primary)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-1)' }}>
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-2xs)',
                  letterSpacing: 'var(--tracking-wide)',
                  padding: '2px var(--spacing-2)',
                  borderRadius: 'var(--radius-sm)',
                  border: statusFilter === s ? '1px solid var(--accent-amber)' : 'var(--border-subtle)',
                  backgroundColor: statusFilter === s ? 'var(--accent-amber-glow)' : 'transparent',
                  color: statusFilter === s ? 'var(--accent-amber)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {s === 'EN_ROUTE' ? 'EN ROUTE' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Flight List */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {loading && (
            <div
              style={{
                padding: 'var(--spacing-8)',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-sm)',
              }}
            >
              Loading...
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div
              style={{
                padding: 'var(--spacing-8)',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: 'var(--text-sm)',
              }}
            >
              No flights match your filters.
            </div>
          )}
          {filtered.map((flight) => (
            <Link
              key={flight.id}
              href={`/flights/${flight.callsign}`}
              style={{
                display: 'block',
                padding: 'var(--spacing-3) var(--spacing-4)',
                borderBottom: 'var(--border-subtle)',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'background-color var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'var(--bg-elevated)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent';
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--spacing-1)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--accent-amber)',
                  }}
                >
                  {flight.callsign}
                </span>
                <StatusBadge variant={flightStatusVariant(flight.status)}>
                  {flight.status.replace('_', ' ')}
                </StatusBadge>
              </div>
              <div
                style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-1)' }}
              >
                {flight.airline}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}
                >
                  {flight.origin.iata} → {flight.destination.iata}
                </span>
                {flight.status === 'EN_ROUTE' && (
                  <span
                    style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}
                  >
                    {flight.altitude.toLocaleString()}ft · {flight.groundSpeed}kt
                  </span>
                )}
              </div>
              {flight.delayMinutes > 0 && (
                <div
                  style={{
                    marginTop: 'var(--spacing-1)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-2xs)',
                    color: 'var(--status-warning)',
                  }}
                >
                  +{flight.delayMinutes} min delay
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Live indicator */}
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
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-2xs)',
              color: 'var(--text-muted)',
              letterSpacing: 'var(--tracking-wide)',
            }}
          >
            LIVE TRACKING
          </span>
        </div>
      </div>

      {/* Map */}
      <div style={{ flex: 1, position: 'relative', minHeight: 0, height: '100%' }}>
        <FlightMap flights={filtered} />
      </div>
    </div>
  );
}
