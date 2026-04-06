export default function Loading() {
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
      }}
    >
      {/* Radar rings */}
      <div
        style={{
          position: 'relative',
          width: '80px',
          height: '80px',
          marginBottom: 'var(--spacing-8)',
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 'var(--radius-full)',
              border: '2px solid var(--accent-amber)',
              opacity: 0,
              animation: `radar-ring 2s ease-out ${i * 0.6}s infinite`,
            }}
          />
        ))}
        {/* Center dot */}
        <span
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '10px',
            height: '10px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--accent-amber)',
            boxShadow: '0 0 8px var(--accent-amber)',
          }}
        />
      </div>

      <div
        style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-muted)',
          letterSpacing: 'var(--tracking-widest)',
          animation: 'blink 1.5s ease-in-out infinite',
        }}
      >
        ACQUIRING SIGNAL...
      </div>
    </div>
  );
}
