'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import SubwayLineBadge from '@/app/components/SubwayLineBadge';

type BadgeSpec = { lineId: string; color: string; size: 'sm' | 'md' | 'lg' };

type Scenario = {
  badges: BadgeSpec[];
};

const scenarios: Record<string, Scenario> = {
  AllSizes: {
    badges: [
      { lineId: 'Q', color: '#FCCC0A', size: 'sm' },
      { lineId: 'Q', color: '#FCCC0A', size: 'md' },
      { lineId: 'Q', color: '#FCCC0A', size: 'lg' },
    ],
  },
  RedLine: {
    badges: [{ lineId: '1', color: '#EE352E', size: 'lg' }],
  },
  BlueLine: {
    badges: [{ lineId: 'A', color: '#0039A6', size: 'md' }],
  },
};

export default function SubwayLineBadgeIsolation() {
  const searchParams = useSearchParams();
  const scenarioName = searchParams.get('s') || 'AllSizes';
  const { badges } = scenarios[scenarioName] || scenarios['AllSizes'];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-base)',
      }}
    >
      <div
        id="codeyam-capture"
        style={{
          maxWidth: 200,
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-3)',
          flexWrap: 'wrap',
        }}
      >
        {badges.map((b, i) => (
          <SubwayLineBadge key={i} lineId={b.lineId} color={b.color} size={b.size} />
        ))}
      </div>
    </div>
  );
}
