'use client';
import { useSearchParams } from 'next/navigation';
import AlertPanel from '@/app/components/AlertPanel';
import type { Alert } from '@/app/components/AlertPanel';

const now = new Date();
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60 * 1000).toISOString();

const scenarios: Record<string, Alert[]> = {
  MultipleAlerts: [
    {
      id: 1,
      type: 'FLIGHT',
      severity: 'CRITICAL',
      title: 'AAL100 — Significant Delay',
      body: 'Flight AAL100 JFK→LHR is now delayed by 2h 15m due to a medical diversion. Expected departure 18:45 EST.',
      read: false,
      createdAt: minutesAgo(4),
    },
    {
      id: 2,
      type: 'SUBWAY',
      severity: 'WARNING',
      title: 'L Train Suspended',
      body: 'No service between Bedford Av and 1 Av. MTA reports a track fire at 1st Ave station — buses on parallel routes.',
      read: false,
      createdAt: minutesAgo(22),
    },
    {
      id: 3,
      type: 'BIKE',
      severity: 'INFO',
      title: 'Station Low on Bikes',
      body: 'E 47 St & Park Ave now has 2 bikes remaining out of 68 capacity. Nearest alternative: E 45 St & Vanderbilt Ave.',
      read: true,
      createdAt: minutesAgo(61),
    },
  ],
  SingleCritical: [
    {
      id: 4,
      type: 'FLIGHT',
      severity: 'CRITICAL',
      title: 'BAW202 — Emergency Declared',
      body: 'British Airways flight BAW202 has declared an emergency over the North Atlantic. Aircraft is diverting to Keflavik, Iceland.',
      read: false,
      createdAt: minutesAgo(2),
    },
  ],
  AllRead: [
    {
      id: 5,
      type: 'SUBWAY',
      severity: 'WARNING',
      title: 'Q Train Delays Resolved',
      body: 'Earlier delays on the Q Train due to track work at Canal St have been resolved. Normal service has resumed.',
      read: true,
      createdAt: minutesAgo(140),
    },
    {
      id: 6,
      type: 'FLIGHT',
      severity: 'INFO',
      title: 'DAL880 — Landed',
      body: 'Delta flight DAL880 ATL→CDG has landed at Charles de Gaulle Airport. Gate C27. Baggage claim carousel 4.',
      read: true,
      createdAt: minutesAgo(195),
    },
  ],
  Empty: [],
};

export default function AlertPanelIsolation() {
  const searchParams = useSearchParams();
  const scenarioName = searchParams.get('s') || 'MultipleAlerts';
  const alerts = scenarios[scenarioName] ?? scenarios['MultipleAlerts'];

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
          maxWidth: 480,
          backgroundColor: 'var(--bg-surface)',
          border: 'var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}
      >
        <AlertPanel alerts={alerts} />
      </div>
    </div>
  );
}
