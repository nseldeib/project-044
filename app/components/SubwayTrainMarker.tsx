'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { SubwayTrain, SubwayLine } from '@/app/hooks/useTransit';

// Use L.icon with a data URL — renders as <img>, no Leaflet div wrapper, no white box ever.
function makeTrainIcon(color: string, status: string, direction: string): L.Icon {
  const isNorth = direction === 'N' || direction === 'UPTOWN';
  const isDelayed = status === 'DELAYED';
  const isAtStation = status === 'AT_STATION';
  const headlight = isAtStation ? 'rgba(56,189,248,0.95)' : 'rgba(255,251,150,0.95)';
  const delayStripe = isDelayed ? `<rect x="1" y="9" width="14" height="3" rx="1" fill="rgba(239,68,68,0.55)"/>` : '';

  // SVG pointing north. Wrap in a group with transform to flip for south.
  const inner = `
  <rect x="1" y="9" width="14" height="24" rx="2.5" fill="${color}"/>
  <path d="M1,13 Q1,2 8,2 Q15,2 15,13 Z" fill="${color}"/>
  <rect x="7" y="3" width="2" height="30" rx="1" fill="rgba(0,0,0,0.13)"/>
  <rect x="1" y="16" width="4" height="4" rx="1.2" fill="rgba(195,230,255,0.82)"/>
  <rect x="1" y="24" width="4" height="4" rx="1.2" fill="rgba(195,230,255,0.82)"/>
  <rect x="11" y="16" width="4" height="4" rx="1.2" fill="rgba(195,230,255,0.82)"/>
  <rect x="11" y="24" width="4" height="4" rx="1.2" fill="rgba(195,230,255,0.82)"/>
  <rect x="3" y="33" width="10" height="3.5" rx="1.8" fill="rgba(0,0,0,0.28)"/>
  <circle cx="5"  cy="35" r="1.2" fill="rgba(255,50,50,0.75)"/>
  <circle cx="11" cy="35" r="1.2" fill="rgba(255,50,50,0.75)"/>
  <circle cx="5"  cy="7" r="2.2" fill="${headlight}"/>
  <circle cx="11" cy="7" r="2.2" fill="${headlight}"/>
  ${delayStripe}`;

  const transform = isNorth ? '' : ' transform="rotate(180 8 19)"';
  const svg = `<svg width="16" height="38" viewBox="0 0 16 38" xmlns="http://www.w3.org/2000/svg"><g${transform}>${inner}</g></svg>`;
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

  return L.icon({
    iconUrl: url,
    iconSize: [16, 38],
    iconAnchor: [8, 19],
    popupAnchor: [0, -22],
  });
}

interface SubwayTrainMarkerProps {
  train: SubwayTrain;
  line: SubwayLine;
}

export default function SubwayTrainMarker({ train, line }: SubwayTrainMarkerProps) {
  const markerRef = useRef<L.Marker>(null);
  const rafRef = useRef<number>(0);
  // Tracks current animated position so mid-animation handoffs start from the right place
  const currentPosRef = useRef<L.LatLng>(L.latLng(train.lat, train.lon));

  // Stable initial position ref — never changes, so React-Leaflet never calls setLatLng
  // on re-renders. All position updates go through the effect below instead.
  const initialPosRef = useRef<[number, number]>([train.lat, train.lon]);

  const icon = useMemo<L.Icon>(
    () => makeTrainIcon(line.color, train.status, train.direction),
    [line.color, train.status, train.direction]
  );

  // Animate directly on the Leaflet marker instance — no React state, no re-renders
  useEffect(() => {
    const marker = markerRef.current;
    if (!marker || !train.lat || !train.lon) return;

    const from = currentPosRef.current;
    const to = L.latLng(train.lat, train.lon);
    if (Math.abs(from.lat - to.lat) < 1e-7 && Math.abs(from.lng - to.lng) < 1e-7) return;

    cancelAnimationFrame(rafRef.current);
    let start: number | null = null;
    const DURATION = 2500;

    const step = (ts: number) => {
      if (!start) start = ts;
      const t = Math.min((ts - start) / DURATION, 1);
      const e = 1 - Math.pow(1 - t, 3); // ease-out cubic
      const pos = L.latLng(
        from.lat + (to.lat - from.lat) * e,
        from.lng + (to.lng - from.lng) * e,
      );
      currentPosRef.current = pos;
      marker.setLatLng(pos);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [train.lat, train.lon]);

  if (!train.lat || !train.lon) return null;

  return (
    <Marker ref={markerRef} position={initialPosRef.current} icon={icon}>
      <Popup>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '12px',
          background: '#080d1a',
          color: '#e2e8f0',
          padding: '8px 12px',
          minWidth: '160px',
          lineHeight: 1.7,
          borderRadius: '4px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              width: '22px', height: '22px', borderRadius: '50%',
              background: line.color, display: 'inline-flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '10px', fontWeight: 800, color: '#fff',
            }}>{line.lineId}</span>
            <span style={{ fontWeight: 700, fontSize: '13px' }}>{train.trainId}</span>
          </div>
          <div style={{ color: '#94a3b8', fontSize: '11px' }}>
            {train.direction === 'N' || train.direction === 'UPTOWN' ? '▲ UPTOWN' : '▼ DOWNTOWN'}
          </div>
          <div>{train.currentStop}</div>
          <div style={{ color: '#475569' }}>→ {train.nextStop}</div>
          {train.delay > 0 && (
            <div style={{ color: '#ef4444', marginTop: '4px', fontWeight: 700 }}>⚠ +{train.delay} min</div>
          )}
        </div>
      </Popup>
    </Marker>
  );
}
