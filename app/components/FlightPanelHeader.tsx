'use client';

import { X } from 'lucide-react';

interface FlightPanelHeaderProps {
  callsign: string;
  airline: string;
  status: string;
  onClose: () => void;
}

export default function FlightPanelHeader({ callsign, airline, status, onClose }: FlightPanelHeaderProps) {
  return (
    <>
      {/* Amber top glow bar */}
      <div style={{
        height: '2px',
        background: 'linear-gradient(90deg, transparent, var(--accent-amber), transparent)',
        flexShrink: 0,
      }} />

      <div
        style={{
          padding: 'var(--spacing-6) var(--spacing-5) var(--spacing-4)',
          borderBottom: '1px solid var(--bg-border)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 'var(--spacing-3)',
          background: 'rgba(245,158,11,0.03)',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-4xl)',
              fontWeight: 'var(--font-weight-black)',
              color: 'var(--accent-amber)',
              letterSpacing: 'var(--tracking-wide)',
              lineHeight: 1,
              textShadow: '0 0 20px rgba(245,158,11,0.5)',
            }}
          >
            {callsign}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)',
              marginTop: 'var(--spacing-2)',
              letterSpacing: 'var(--tracking-wide)',
            }}
          >
            {airline}
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--spacing-1)',
              marginTop: 'var(--spacing-2)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-2xs)',
              fontWeight: 'var(--font-weight-semibold)',
              letterSpacing: 'var(--tracking-wider)',
              color: 'var(--status-nominal)',
              background: 'rgba(74,222,128,0.08)',
              border: '1px solid rgba(74,222,128,0.4)',
              borderRadius: 'var(--radius-full)',
              padding: '3px 10px',
            }}
          >
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--status-nominal)',
              boxShadow: '0 0 6px var(--status-nominal)',
              animation: 'pulse 2s infinite',
              display: 'inline-block',
            }} />
            {status.replace('_', ' ')}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--bg-border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: 'var(--spacing-1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent-amber)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent-amber)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--bg-border)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
          }}
        >
          <X size={14} />
        </button>
      </div>
    </>
  );
}
