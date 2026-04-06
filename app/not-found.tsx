import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 56px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-base)',
        fontFamily: 'var(--font-mono)',
        padding: 'var(--spacing-8)',
        textAlign: 'center',
      }}
    >
      {/* Radar SVG */}
      <div
        style={{
          position: 'relative',
          width: '120px',
          height: '120px',
          marginBottom: 'var(--spacing-8)',
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer ring */}
          <circle cx="60" cy="60" r="55" stroke="rgba(245,158,11,0.15)" strokeWidth="1" />
          {/* Mid ring */}
          <circle cx="60" cy="60" r="38" stroke="rgba(245,158,11,0.2)" strokeWidth="1" />
          {/* Inner ring */}
          <circle cx="60" cy="60" r="20" stroke="rgba(245,158,11,0.3)" strokeWidth="1" />
          {/* Crosshairs */}
          <line x1="60" y1="5" x2="60" y2="115" stroke="rgba(245,158,11,0.1)" strokeWidth="1" />
          <line x1="5" y1="60" x2="115" y2="60" stroke="rgba(245,158,11,0.1)" strokeWidth="1" />
          {/* No signal — X */}
          <line x1="42" y1="42" x2="78" y2="78" stroke="var(--status-critical)" strokeWidth="2" strokeLinecap="round" />
          <line x1="78" y1="42" x2="42" y2="78" stroke="var(--status-critical)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* 404 */}
      <div
        style={{
          fontSize: 'var(--text-4xl)',
          fontWeight: 'var(--font-weight-black)',
          color: 'var(--accent-amber)',
          letterSpacing: 'var(--tracking-widest)',
          lineHeight: 1,
          marginBottom: 'var(--spacing-3)',
        }}
      >
        404
      </div>

      <div
        style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--text-primary)',
          letterSpacing: 'var(--tracking-wider)',
          marginBottom: 'var(--spacing-3)',
        }}
      >
        SIGNAL LOST
      </div>

      <p
        style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          maxWidth: '340px',
          lineHeight: 1.6,
          marginBottom: 'var(--spacing-8)',
          letterSpacing: 'var(--tracking-wide)',
        }}
      >
        The target you&apos;re tracking has gone off radar.
      </p>

      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--spacing-2)',
          padding: 'var(--spacing-3) var(--spacing-6)',
          backgroundColor: 'var(--bg-elevated)',
          border: 'var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          fontSize: 'var(--text-sm)',
          color: 'var(--accent-amber)',
          textDecoration: 'none',
          letterSpacing: 'var(--tracking-wide)',
          transition: 'all var(--transition-base)',
        }}
      >
        ← RETURN TO COMMAND CENTER
      </Link>
    </div>
  );
}
