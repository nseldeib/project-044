'use client';
import { useSearchParams } from 'next/navigation';
import StatCard from '@/app/components/StatCard';

type StatCardProps = {
  label: string;
  value: string | number;
  unit?: string;
  sub?: string;
  accentLeft?: boolean;
  variant?: 'amber' | 'red' | 'green' | 'blue' | 'default';
};

const scenarios: Record<string, StatCardProps> = {
  Default: {
    label: 'ACTIVE FLIGHTS',
    value: 10,
    variant: 'amber',
    accentLeft: true,
  },
  Critical: {
    label: 'UNREAD ALERTS',
    value: 3,
    variant: 'red',
    accentLeft: true,
  },
  Nominal: {
    label: 'STATIONS ONLINE',
    value: 27,
    unit: '/ 30',
    variant: 'green',
  },
  Zero: {
    label: 'DISRUPTED LINES',
    value: 0,
    variant: 'default',
  },
};

export default function StatCardIsolation() {
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
      <div id="codeyam-capture" style={{ width: '100%', maxWidth: 280 }}>
        <StatCard {...props} />
      </div>
    </div>
  );
}
