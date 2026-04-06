'use client';

import React from 'react';
import Link from 'next/link';
import { StatusBadge } from '@/app/components/ui/badge';
import { Trash2, AlertTriangle } from 'lucide-react';
import { watchlistTypeVariant } from '@/app/lib/variants';

export interface WatchlistItem {
  id: number;
  type: string;
  label: string;
  refId: string;
  notes: string;
  createdAt: string;
  flight: { callsign: string; status: string; airline: string } | null;
  alerts: { id: number }[];
}

interface WatchlistItemCardProps {
  item: WatchlistItem;
  onDelete: (id: number) => void;
  deleting?: boolean;
}

export default function WatchlistItemCard({ item, onDelete, deleting = false }: WatchlistItemCardProps) {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: 'var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-4)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-3)',
            marginBottom: 'var(--spacing-2)',
          }}
        >
          <StatusBadge variant={watchlistTypeVariant(item.type)}>
            {item.type.replace('_', ' ')}
          </StatusBadge>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--text-primary)',
            }}
          >
            {item.label}
          </span>
        </div>

        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            marginBottom: item.notes ? 'var(--spacing-2)' : 0,
          }}
        >
          REF: {item.refId}
        </div>

        {item.notes && (
          <div
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
            }}
          >
            {item.notes}
          </div>
        )}

        {item.flight && (
          <div
            style={{
              marginTop: 'var(--spacing-2)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-2)',
            }}
          >
            <Link
              href={`/flights/${item.flight.callsign}`}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                color: 'var(--accent-blue)',
                textDecoration: 'none',
              }}
            >
              {item.flight.callsign} →
            </Link>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              {item.flight.airline}
            </span>
          </div>
        )}

        {item.alerts.length > 0 && (
          <div
            style={{
              marginTop: 'var(--spacing-2)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-1)',
            }}
          >
            <AlertTriangle size={12} style={{ color: 'var(--status-warning)' }} />
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--status-warning)' }}>
              {item.alerts.length} alert{item.alerts.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      <button
        onClick={() => onDelete(item.id)}
        disabled={deleting}
        style={{
          background: 'none',
          border: 'none',
          cursor: deleting ? 'not-allowed' : 'pointer',
          color: 'var(--text-muted)',
          padding: 'var(--spacing-1)',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: deleting ? 0.4 : 1,
          transition: 'color var(--transition-fast)',
          flexShrink: 0,
        }}
        title="Remove from watchlist"
        onMouseEnter={(e) => {
          if (!deleting) (e.currentTarget as HTMLButtonElement).style.color = 'var(--status-critical)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
        }}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
