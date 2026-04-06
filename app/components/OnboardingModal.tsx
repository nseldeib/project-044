'use client';
import { useState, useEffect } from 'react';

export default function OnboardingModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('vector-onboarded');
    if (!seen) {
      const timer = setTimeout(() => setOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem('vector-onboarded', '1');
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(3, 6, 15, 0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--spacing-10)',
          maxWidth: '480px',
          width: '90%',
          boxShadow: '0 0 60px rgba(245, 158, 11, 0.12), var(--shadow-lg)',
          position: 'relative',
        }}
      >
        {/* Top scan line decoration */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(to right, transparent, var(--accent-amber), transparent)',
            borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
          }}
        />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-8)' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-2xs)',
              color: 'var(--text-muted)',
              letterSpacing: 'var(--tracking-widest)',
              marginBottom: 'var(--spacing-3)',
            }}
          >
            CLASSIFIED SYSTEM — AUTHORIZED ACCESS ONLY
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-3xl)',
              fontWeight: 'var(--font-weight-black)',
              letterSpacing: 'var(--tracking-widest)',
              color: 'var(--accent-amber)',
              margin: '0 0 var(--spacing-2) 0',
              lineHeight: 1.1,
            }}
          >
            WELCOME TO VECTOR
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)',
              letterSpacing: 'var(--tracking-wide)',
              margin: 0,
            }}
          >
            Real-Time Movement Intelligence
          </p>
        </div>

        {/* Feature bullets */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-3)',
            marginBottom: 'var(--spacing-8)',
            backgroundColor: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-4)',
          }}
        >
          {[
            { icon: '✈', label: '15 aircraft tracked globally', color: 'var(--accent-amber)' },
            { icon: '🚲', label: '30 Citi Bike stations monitored', color: 'var(--accent-blue)' },
            { icon: '🚇', label: '21 NYC MTA subway lines in real-time', color: 'var(--accent-green)' },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-3)',
              }}
            >
              <span style={{ fontSize: 'var(--text-lg)', lineHeight: 1 }}>{item.icon}</span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-primary)',
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={dismiss}
          style={{
            width: '100%',
            padding: 'var(--spacing-4)',
            backgroundColor: 'var(--accent-amber)',
            color: 'var(--text-inverse)',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--font-weight-bold)',
            letterSpacing: 'var(--tracking-widest)',
            cursor: 'pointer',
            transition: 'all var(--transition-base)',
            marginBottom: 'var(--spacing-3)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--accent-amber-dim)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = 'var(--shadow-amber)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--accent-amber)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
          }}
        >
          ENTER MISSION CONTROL
        </button>
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={dismiss}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-muted)',
              letterSpacing: 'var(--tracking-wide)',
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
            }}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
