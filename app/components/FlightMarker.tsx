'use client';

import { Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

interface Airport {
  iata: string;
  lat: number;
  lon: number;
}

interface Flight {
  id: number;
  callsign: string;
  airline: string;
  altitude: number;
  groundSpeed: number;
  heading: number;
  lat: number;
  lon: number;
  origin: Airport;
  destination: Airport;
}

function createPlaneIcon(heading: number) {
  const svg = `<div style="background:transparent;border:none;line-height:0;"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="transform: rotate(${heading}deg)">
    <polygon points="12,2 8,18 12,15 16,18" fill="#f59e0b" stroke="#b45309" stroke-width="1"/>
  </svg></div>`;
  return L.divIcon({
    html: svg,
    className: 'plane-marker-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
}

interface FlightMarkerProps {
  flight: Flight;
}

export default function FlightMarker({ flight }: FlightMarkerProps) {
  const flightPos: [number, number] = [flight.lat, flight.lon];
  const hasRoute = flight.origin?.lat && flight.destination?.lat;
  const originPos: [number, number] = [flight.origin.lat, flight.origin.lon];
  const destPos: [number, number] = [flight.destination.lat, flight.destination.lon];

  return (
    <Marker position={flightPos} icon={createPlaneIcon(flight.heading)}>
      <Popup>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-primary)',
            minWidth: '180px',
          }}
        >
          <div
            style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--accent-amber)',
              marginBottom: 'var(--spacing-1)',
            }}
          >
            {flight.callsign}
          </div>
          <div style={{ marginBottom: 'var(--spacing-1)', color: 'var(--text-secondary)' }}>
            {flight.airline}
          </div>
          {hasRoute && (
            <div style={{ marginBottom: 'var(--spacing-1)' }}>
              {flight.origin.iata} → {flight.destination.iata}
            </div>
          )}
          <div style={{ marginBottom: 'var(--spacing-1)' }}>
            ALT: {flight.altitude.toLocaleString()} ft
          </div>
          <div style={{ marginBottom: 'var(--spacing-2)' }}>SPD: {flight.groundSpeed} kt</div>
          <a
            href={`/flights/${flight.callsign}`}
            style={{
              color: 'var(--accent-blue)',
              textDecoration: 'none',
              fontSize: 'var(--text-xs)',
            }}
          >
            View details →
          </a>
        </div>
      </Popup>
      {hasRoute && (
        <Polyline
          positions={[originPos, flightPos, destPos]}
          pathOptions={{ color: '#f59e0b', opacity: 0.6, weight: 1.5, dashArray: '4 4' }}
        />
      )}
    </Marker>
  );
}
