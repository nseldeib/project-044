import React from 'react';
import SubwayLineBadge from './SubwayLineBadge';
import { StatusBadge } from '@/app/components/ui/badge';
import { StatusDot } from '@/app/components/ui/status-dot';
import { subwayStatusVariant, subwayLineTextColor } from '@/app/lib/variants';

export interface SubwayLine {
  id: number;
  lineId: string;
  name: string;
  color: string;
  status: string;
  statusText?: string | null;
  trains?: { id: number }[];
}

interface SubwayLineCardProps {
  line: SubwayLine;
}

export default function SubwayLineCard({ line }: SubwayLineCardProps) {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        padding: 'var(--spacing-4)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-3)',
          marginBottom: 'var(--spacing-2)',
        }}
      >
        <SubwayLineBadge lineId={line.lineId} color={line.color} size="lg" />
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-primary)',
              fontWeight: 'var(--font-weight-medium)',
            }}
          >
            {line.name}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-2)',
              marginTop: '2px',
            }}
          >
            <StatusDot status={subwayStatusVariant(line.status) as 'nominal' | 'warning' | 'critical' | 'neutral'} />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-2xs)',
                color: subwayLineTextColor(line.status),
                letterSpacing: 'var(--tracking-wider)',
              }}
            >
              {line.status.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
        {line.trains != null && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-2xs)',
              color: 'var(--text-muted)',
            }}
          >
            {line.trains.length} trains
          </span>
        )}
      </div>
      {line.status !== 'GOOD_SERVICE' && line.statusText && (
        <div
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-secondary)',
            paddingLeft: 'calc(36px + var(--spacing-3))',
            lineHeight: 1.5,
          }}
        >
          {line.statusText}
        </div>
      )}
    </div>
  );
}
