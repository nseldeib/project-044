'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
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
      {/* Error icon */}
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'var(--spacing-6)',
          fontSize: 'var(--text-2xl)',
        }}
      >
        ⚠
      </div>

      <div
        style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--status-critical)',
          letterSpacing: 'var(--tracking-wider)',
          marginBottom: 'var(--spacing-2)',
        }}
      >
        SYSTEM ERROR
      </div>

      <p
        style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-muted)',
          letterSpacing: 'var(--tracking-wide)',
          marginBottom: 'var(--spacing-6)',
        }}
      >
        An unrecoverable fault has been detected.
      </p>

      {/* Error message */}
      <div
        style={{
          backgroundColor: 'var(--bg-elevated)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-4)',
          maxWidth: '480px',
          width: '100%',
          textAlign: 'left',
          marginBottom: 'var(--spacing-8)',
        }}
      >
        <div
          style={{
            fontSize: 'var(--text-2xs)',
            color: 'var(--text-muted)',
            letterSpacing: 'var(--tracking-wider)',
            marginBottom: 'var(--spacing-2)',
          }}
        >
          ERROR LOG
        </div>
        <code
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--status-critical)',
            display: 'block',
            wordBreak: 'break-word',
            lineHeight: 1.5,
          }}
        >
          {error.message || 'Unknown error'}
        </code>
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'center' }}>
        <button
          onClick={reset}
          style={{
            padding: 'var(--spacing-3) var(--spacing-6)',
            backgroundColor: 'var(--accent-amber)',
            color: 'var(--text-inverse)',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-bold)',
            letterSpacing: 'var(--tracking-wide)',
            cursor: 'pointer',
            transition: 'all var(--transition-base)',
          }}
        >
          RETRY MISSION
        </button>
        <a
          href="/"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            letterSpacing: 'var(--tracking-wide)',
          }}
        >
          ABORT TO COMMAND CENTER
        </a>
      </div>
    </div>
  );
}
