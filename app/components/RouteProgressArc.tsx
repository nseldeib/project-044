import React from 'react';

export interface Airport {
  iata: string;
  lat: number;
  lon: number;
}

interface RouteProgressArcProps {
  origin: Airport;
  destination: Airport;
  current: { lat: number; lon: number };
  progress: number; // 0–100
}

export default function RouteProgressArc({
  origin,
  destination,
  current,
  progress,
}: RouteProgressArcProps) {
  const t = Math.max(0, Math.min(1, progress / 100));

  // Bezier control point at top of arc
  const planeX = (1 - t) * (1 - t) * 20 + 2 * (1 - t) * t * 200 + t * t * 380;
  const planeY = (1 - t) * (1 - t) * 50 + 2 * (1 - t) * t * 5 + t * t * 50;

  return (
    <div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-2xs)',
          color: 'var(--text-muted)',
          letterSpacing: 'var(--tracking-wider)',
          marginBottom: 'var(--spacing-2)',
        }}
      >
        ROUTE PROGRESS — {Math.round(progress)}% COMPLETE
      </div>
      <svg
        width="100%"
        height="60"
        viewBox="0 0 400 60"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Dotted full arc */}
        <path
          d="M 20,50 Q 200,5 380,50"
          fill="none"
          stroke="rgba(245,158,11,0.2)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        {/* Completed arc */}
        <path
          d="M 20,50 Q 200,5 380,50"
          fill="none"
          stroke="var(--accent-amber)"
          strokeWidth="2"
          strokeDasharray={`${t * 440} 440`}
        />
        {/* Origin dot */}
        <circle cx="20" cy="50" r="4" fill="var(--accent-amber-dim)" />
        {/* Origin label */}
        <text
          x="20"
          y="60"
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="8"
          fill="var(--text-muted)"
        >
          {origin.iata}
        </text>
        {/* Destination dot */}
        <circle cx="380" cy="50" r="4" fill="var(--accent-amber-dim)" />
        {/* Destination label */}
        <text
          x="380"
          y="60"
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="8"
          fill="var(--text-muted)"
        >
          {destination.iata}
        </text>
        {/* Plane marker */}
        <g transform={`translate(${planeX}, ${planeY})`}>
          <polygon
            points="0,-7 -4,5 0,2 4,5"
            fill="var(--accent-amber)"
            stroke="var(--accent-amber-dim)"
            strokeWidth="0.5"
          />
        </g>
      </svg>
    </div>
  );
}
