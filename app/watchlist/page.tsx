'use client';

import { useState } from 'react';
import { Bookmark, Bell } from 'lucide-react';
import { useWatchlist } from '@/app/hooks/useWatchlist';
import WatchlistItemCard, { WatchlistItem } from '@/app/components/WatchlistItemCard';
import AlertPanel from '@/app/components/AlertPanel';
import EmptyState from '@/app/components/EmptyState';
import PanelHeader from '@/app/components/PanelHeader';

type ItemType = 'FLIGHT' | 'BIKE_STATION' | 'SUBWAY_LINE' | 'AIRPORT';

const TYPE_LABELS: Record<ItemType, string> = {
  FLIGHT: 'FLIGHTS',
  BIKE_STATION: 'BIKE STATIONS',
  SUBWAY_LINE: 'SUBWAY LINES',
  AIRPORT: 'AIRPORTS',
};

export default function WatchlistPage() {
  const { items, loading, deleteItem } = useWatchlist();
  const [deleting, setDeleting] = useState<number | null>(null);

  async function handleDelete(id: number) {
    setDeleting(id);
    await deleteItem(id);
    setDeleting(null);
  }

  const allAlerts = items
    .flatMap((i) => i.alerts)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const groups = (
    ['FLIGHT', 'BIKE_STATION', 'SUBWAY_LINE', 'AIRPORT'] as ItemType[]
  )
    .map((type) => ({
      type,
      label: TYPE_LABELS[type],
      items: items.filter((i) => i.type === type),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div style={{ padding: 'var(--spacing-6)', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: 'var(--spacing-6)',
          paddingBottom: 'var(--spacing-4)',
          borderBottom: 'var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
          <Bookmark size={24} style={{ color: 'var(--accent-amber)' }} />
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-3xl)',
                fontWeight: 'var(--font-weight-bold)',
                letterSpacing: 'var(--tracking-widest)',
                color: 'var(--text-primary)',
                margin: 0,
                lineHeight: 1,
              }}
            >
              MY WATCHLIST
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
              {loading ? '...' : `${items.length} items tracked`}
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--spacing-6)' }}>
        {/* Items */}
        <div>
          {loading && (
            <div
              style={{
                padding: 'var(--spacing-12)',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-sm)',
              }}
            >
              Loading...
            </div>
          )}

          {!loading && items.length === 0 && (
            <EmptyState
              icon={<Bookmark size={40} />}
              title="NO ITEMS TRACKED"
              description="Add flights, stations, or lines from their detail pages."
            />
          )}

          {groups.map((group) => (
            <div key={group.type} style={{ marginBottom: 'var(--spacing-6)' }}>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-muted)',
                  letterSpacing: 'var(--tracking-widest)',
                  marginBottom: 'var(--spacing-3)',
                  paddingBottom: 'var(--spacing-2)',
                  borderBottom: 'var(--border-subtle)',
                }}
              >
                {group.label} ({group.items.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                {group.items.map((item) => (
                  <WatchlistItemCard
                    key={item.id}
                    item={item as WatchlistItem}
                    onDelete={handleDelete}
                    deleting={deleting === item.id}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Alerts Panel */}
        <div>
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: 'var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              position: 'sticky',
              top: 'calc(56px + var(--spacing-6))',
            }}
          >
            <PanelHeader
              title="WATCHLIST ALERTS"
              actions={<Bell size={16} style={{ color: 'var(--accent-amber)' }} />}
            />
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              <AlertPanel alerts={allAlerts} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
