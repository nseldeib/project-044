import React from 'react';
import { StatusBadge } from '@/app/components/ui/badge';
import { alertSeverityVariant } from '@/app/lib/variants';
import { timeAgo } from '@/app/lib/formatters';

export interface Alert {
  id: number;
  type?: string;
  severity: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string | Date;
}

interface AlertPanelProps {
  alerts: Alert[];
}

export default function AlertPanel({ alerts }: AlertPanelProps) {
  return (
    <div>
      {alerts.length === 0 && (
        <div
          style={{
            padding: 'var(--spacing-8)',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: 'var(--text-sm)',
          }}
        >
          No alerts.
        </div>
      )}
      {alerts.map((alert) => (
        <div
          key={alert.id}
          style={{
            padding: 'var(--spacing-3) var(--spacing-4)',
            borderBottom: 'var(--border-subtle)',
            opacity: alert.read ? 0.6 : 1,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 'var(--spacing-1)',
            }}
          >
            <StatusBadge variant={alertSeverityVariant(alert.severity)}>
              {alert.severity}
            </StatusBadge>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-2xs)',
                color: 'var(--text-muted)',
              }}
            >
              {timeAgo(alert.createdAt instanceof Date ? alert.createdAt : new Date(alert.createdAt))}
            </span>
          </div>
          <div
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--text-primary)',
              marginBottom: 'var(--spacing-1)',
            }}
          >
            {alert.title}
          </div>
          <div
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {alert.body}
          </div>
        </div>
      ))}
    </div>
  );
}
