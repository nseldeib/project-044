import React from 'react';

interface DataRowProps {
  label: string;
  value?: string | number;
  mono?: boolean;
  highlight?: string;
  children?: React.ReactNode;
}

export default function DataRow({ label, value, mono = false, highlight, children }: DataRowProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
      {children ?? (
        <span
          style={{
            fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
            fontSize: 'var(--text-sm)',
            color: highlight ?? 'var(--text-primary)',
          }}
        >
          {value}
        </span>
      )}
    </div>
  );
}
