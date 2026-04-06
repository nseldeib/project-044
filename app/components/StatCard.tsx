import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  sub?: string;
  accentColor?: string;
  accentLeft?: boolean;
  variant?: 'amber' | 'red' | 'green' | 'blue' | 'default';
}

const variantColor: Record<NonNullable<StatCardProps['variant']>, string> = {
  amber:   'var(--accent-amber)',
  red:     'var(--status-critical)',
  green:   'var(--accent-green)',
  blue:    'var(--accent-blue)',
  default: 'var(--text-primary)',
};

export default function StatCard({
  label,
  value,
  unit,
  icon,
  sub,
  accentColor,
  accentLeft = false,
  variant = 'default',
}: StatCardProps) {
  const color = accentColor ?? variantColor[variant];

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: 'var(--border-subtle)',
        borderLeft: accentLeft ? `3px solid ${color}` : 'var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-4)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 'var(--spacing-3)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-2xs)',
            color: 'var(--text-muted)',
            letterSpacing: 'var(--tracking-wider)',
          }}
        >
          {label}
        </span>
        {icon}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-4xl)',
          fontWeight: 'var(--font-weight-bold)',
          color,
          lineHeight: 1,
          marginBottom: 'var(--spacing-2)',
        }}
      >
        {value}
        {unit && (
          <span
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-muted)',
              marginLeft: 'var(--spacing-1)',
            }}
          >
            {unit}
          </span>
        )}
      </div>
      {sub && (
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-2xs)',
            color: 'var(--text-muted)',
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}
