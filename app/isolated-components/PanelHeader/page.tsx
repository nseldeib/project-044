'use client';
import { useSearchParams } from 'next/navigation';
import PanelHeader from '@/app/components/PanelHeader';

type Scenario = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
};

import React from 'react';

const PulsingDot = () => (
  <span
    style={{
      display: 'inline-block',
      width: 8,
      height: 8,
      borderRadius: '50%',
      backgroundColor: 'var(--accent-green)',
      boxShadow: '0 0 0 2px var(--accent-green-dim)',
      animation: 'pulse 2s infinite',
    }}
  />
);

const scenarios: Record<string, Scenario> = {
  Default: {
    title: 'ACTIVE FLIGHTS',
    subtitle: '15 tracked globally',
  },
  WithActions: {
    title: 'COMMAND CENTER',
    subtitle: 'NYC Region · Live',
    actions: <PulsingDot />,
  },
  TitleOnly: {
    title: 'SYSTEM ALERTS',
  },
};

export default function PanelHeaderIsolation() {
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
      <div
        id="codeyam-capture"
        style={{
          width: '100%',
          maxWidth: 600,
          backgroundColor: 'var(--bg-surface)',
          border: 'var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}
      >
        <PanelHeader {...props} />
      </div>
    </div>
  );
}
