'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import EmptyState from '@/app/components/EmptyState';

type Scenario = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

const scenarios: Record<string, Scenario> = {
  Default: {
    title: 'No Items Tracked',
    description: 'Add flights, stations, or lines to monitor them here',
  },
  WithAction: {
    title: 'No Flights Found',
    description: 'Try adjusting your filters or search terms to find what you need',
    action: (
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          color: 'var(--accent-blue)',
          letterSpacing: 'var(--tracking-wider)',
          cursor: 'pointer',
          textDecoration: 'underline',
        }}
        onClick={() => {}}
      >
        CLEAR FILTERS
      </span>
    ),
  },
  ErrorState: {
    title: 'Signal Lost',
    description: 'Could not connect to tracking service. Retrying in 15 seconds...',
  },
};

export default function EmptyStateIsolation() {
  const searchParams = useSearchParams();
  const scenarioName = searchParams.get('s') || 'Default';
  const props = scenarios[scenarioName] || scenarios['Default'];

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
      <div id="codeyam-capture" style={{ width: '100%', maxWidth: 400 }}>
        <EmptyState {...props} />
      </div>
    </div>
  );
}
