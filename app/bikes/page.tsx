'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { StatusDot } from '@/app/components/ui/status-dot';
import { Search, Bike } from 'lucide-react';
import { useBikeStations } from '@/app/hooks/useBikeStations';
import BikeStationCard from '@/app/components/BikeStationCard';

const BikeMap = dynamic(() => import('@/app/components/BikeMap'), { ssr: false });

export default function BikesPage() {
  const { stations, summary, loading } = useBikeStations();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return stations;
    return stations.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
  }, [stations, search]);

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 56px)', overflow: 'hidden' }}>
      {/* Left Panel */}
      <div
        style={{
          width: '360px',
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-2)',
              marginBottom: 'var(--spacing-3)',
            }}
          >
            <Bike size={18} style={{ color: 'var(--accent-blue)' }} />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                letterSpacing: 'var(--tracking-wide)',
                color: 'var(--accent-blue)',
              }}
            >
              NYC CITI BIKE
            </span>
          </div>

          {/* Stats */}
          {summary && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 'var(--spacing-2)',
                marginBottom: 'var(--spacing-3)',
              }}
            >
              {[
                { label: 'BIKES', value: summary.totalBikes, color: 'var(--accent-green)' },
                { label: 'LOW', value: summary.stationsLow, color: 'var(--status-warning)' },
                { label: 'EMPTY', value: summary.stationsEmpty, color: 'var(--status-critical)' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--spacing-2) var(--spacing-3)',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-xl)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: stat.color,
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-2xs)',
                      color: 'var(--text-muted)',
                      letterSpacing: 'var(--tracking-wider)',
                      marginTop: '2px',
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Search */}
          <div style={{ position: 'relative' }}>
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
              placeholder="Search stations..."
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
        </div>

        {/* Station List */}
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
              Loading stations...
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
              No stations found.
            </div>
          )}
          {filtered.map((station) => (
            <BikeStationCard key={station.id} station={station} />
          ))}
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
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-2xs)',
              color: 'var(--text-muted)',
              letterSpacing: 'var(--tracking-wide)',
            }}
          >
            {loading ? 'LOADING...' : `${filtered.length} STATIONS`}
          </span>
        </div>
      </div>

      {/* Map */}
      <div style={{ flex: 1, position: 'relative', minHeight: 0, height: '100%' }}>
        <BikeMap stations={filtered} />
      </div>
    </div>
  );
}
