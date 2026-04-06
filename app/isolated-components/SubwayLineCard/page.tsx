'use client';
import { useSearchParams } from 'next/navigation';
import SubwayLineCard from '@/app/components/SubwayLineCard';
import type { SubwayLine } from '@/app/components/SubwayLineCard';

const scenarios: Record<string, SubwayLine> = {
  GoodService: {
    id: 1,
    lineId: '1',
    name: '1 Train',
    color: '#EE352E',
    status: 'GOOD_SERVICE',
    statusText: '',
    trains: [],
  },
  Delayed: {
    id: 2,
    lineId: 'Q',
    name: 'Q Train',
    color: '#FCCC0A',
    status: 'DELAYS',
    statusText: 'Delays due to track work at Canal St — expect 10–15 min wait times',
    trains: [],
  },
  Suspended: {
    id: 3,
    lineId: 'L',
    name: 'L Train',
    color: '#A7A9AC',
    status: 'SUSPENDED',
    statusText: 'No service between Bedford Av and 1 Av — track fire reported at 0342',
    trains: [],
  },
  PlannedWork: {
    id: 4,
    lineId: '5',
    name: '5 Train',
    color: '#00933C',
    status: 'PLANNED_WORK',
    statusText: 'No service between Fulton St and Atlantic Av this weekend — use 4 train',
    trains: [],
  },
};

export default function SubwayLineCardIsolation() {
  const searchParams = useSearchParams();
  const scenarioName = searchParams.get('s') || 'GoodService';
  const line = scenarios[scenarioName] || scenarios['GoodService'];

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
          maxWidth: 400,
          border: 'var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}
      >
        <SubwayLineCard line={line} />
      </div>
    </div>
  );
}
