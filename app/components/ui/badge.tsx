import React from 'react';

type BadgeVariant = 'nominal' | 'warning' | 'critical' | 'info' | 'neutral' | 'blue';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  nominal: {
    color: 'var(--accent-green)',
    backgroundColor: 'var(--accent-green-glow)',
    border: '1px solid rgba(74, 222, 128, 0.25)',
  },
  warning: {
    color: 'var(--accent-amber)',
    backgroundColor: 'var(--accent-amber-glow)',
    border: '1px solid rgba(245, 158, 11, 0.25)',
  },
  critical: {
    color: 'var(--status-critical)',
    backgroundColor: 'rgba(239, 68, 68, 0.10)',
    border: '1px solid rgba(239, 68, 68, 0.25)',
  },
  info: {
    color: 'var(--status-info)',
    backgroundColor: 'var(--accent-blue-glow)',
    border: '1px solid rgba(56, 189, 248, 0.25)',
  },
  neutral: {
    color: 'var(--text-muted)',
    backgroundColor: 'rgba(71, 85, 105, 0.15)',
    border: '1px solid rgba(71, 85, 105, 0.25)',
  },
  blue: {
    color: 'var(--accent-blue)',
    backgroundColor: 'var(--accent-blue-glow)',
    border: '1px solid rgba(56, 189, 248, 0.25)',
  },
};

export function StatusBadge({ variant = 'neutral', children, className }: BadgeProps) {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-2xs)',
    fontWeight: 'var(--font-weight-semibold)',
    letterSpacing: 'var(--tracking-wider)',
    textTransform: 'uppercase',
    padding: '2px 6px',
    borderRadius: 'var(--radius-sm)',
    whiteSpace: 'nowrap',
    lineHeight: '1.5',
    ...variantStyles[variant],
  };

  return (
    <span style={baseStyle} className={className}>
      {children}
    </span>
  );
}

export default StatusBadge;
