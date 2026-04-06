import React from 'react';

interface SubwayLineBadgeProps {
  lineId: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: '20px',
  md: '28px',
  lg: '36px',
};

const fontSizeMap = {
  sm: 'var(--text-2xs)',
  md: 'var(--text-xs)',
  lg: 'var(--text-base)',
};

export default function SubwayLineBadge({ lineId, color, size = 'md' }: SubwayLineBadgeProps) {
  const dim = sizeMap[size];

  return (
    <span
      style={{
        width: dim,
        height: dim,
        borderRadius: '50%',
        backgroundColor: color,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: fontSizeMap[size],
        fontWeight: 'var(--font-weight-bold)',
        color: '#fff',
        flexShrink: 0,
      }}
    >
      {lineId}
    </span>
  );
}
