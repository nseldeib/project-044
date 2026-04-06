import React from 'react';

interface PanelHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function PanelHeader({ title, subtitle, actions }: PanelHeaderProps) {
  return (
    <div
      style={{
        padding: 'var(--spacing-4)',
        borderBottom: 'var(--border-subtle)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--text-primary)',
            letterSpacing: 'var(--tracking-wide)',
            display: 'block',
          }}
        >
          {title}
        </span>
        {subtitle && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-2xs)',
              color: 'var(--text-muted)',
              letterSpacing: 'var(--tracking-wide)',
              display: 'block',
              marginTop: '2px',
            }}
          >
            {subtitle}
          </span>
        )}
      </div>
      {actions && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
          {actions}
        </div>
      )}
    </div>
  );
}
