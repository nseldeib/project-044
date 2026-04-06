'use client';

import React from 'react';

type DotStatus = 'nominal' | 'warning' | 'critical' | 'neutral';

interface StatusDotProps {
  status: DotStatus;
  size?: number;
}

const colorMap: Record<DotStatus, string> = {
  nominal: 'var(--accent-green)',
  warning: 'var(--accent-amber)',
  critical: 'var(--status-critical)',
  neutral: 'var(--text-muted)',
};

const glowMap: Record<DotStatus, string> = {
  nominal: 'rgba(74, 222, 128, 0.5)',
  warning: 'rgba(245, 158, 11, 0.5)',
  critical: 'rgba(239, 68, 68, 0.5)',
  neutral: 'transparent',
};

export function StatusDot({ status, size = 8 }: StatusDotProps) {
  const color = colorMap[status];
  const glow = glowMap[status];
  const isPulsing = status === 'nominal';

  return (
    <>
      {isPulsing && (
        <style>{`
          @keyframes status-pulse {
            0%, 100% { opacity: 1; box-shadow: 0 0 0 0 ${glow}; }
            50% { opacity: 0.85; box-shadow: 0 0 0 4px transparent; }
          }
          .status-dot-pulse {
            animation: status-pulse 2s ease-in-out infinite;
          }
        `}</style>
      )}
      <span
        className={isPulsing ? 'status-dot-pulse' : undefined}
        style={{
          display: 'inline-block',
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: color,
          flexShrink: 0,
          boxShadow: isPulsing ? `0 0 6px ${glow}` : 'none',
        }}
      />
    </>
  );
}

export default StatusDot;
