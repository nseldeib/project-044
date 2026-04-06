'use client';

import { MapContainer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import Link from 'next/link';

interface Airport {
  id: number;
  iata: string;
  lat: number;
  lon: number;
  name: string;
}

interface Flight {
  id: number;
  callsign: string;
  airline: string;
  flightNumber: string;
  status: string;
  altitude: number;
  groundSpeed: number;
  heading: number;
  lat: number;
  lon: number;
  origin: Airport;
  destination: Airport;
}

interface FlightMapProps {
  flights: Flight[];
}

function createPlaneIcon(heading: number) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="transform: rotate(${heading}deg)">
    <polygon points="12,2 8,18 12,15 16,18" fill="#f59e0b" stroke="#b45309" stroke-width="1"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
}

export default function FlightMap({ flights }: FlightMapProps) {
  const enRoute = flights.filter(
    (f) => f.status === 'EN_ROUTE' && f.lat !== 0 && f.lon !== 0
  );

  return (
    <MapContainer
      center={[30, -40]}
      zoom={3}
      style={{ width: '100%', height: '100%', minHeight: 0 }}
      zoomControl={true}
    >
      {enRoute.map((flight) => {
        const originPos: [number, number] = [flight.origin.lat, flight.origin.lon];
        const destPos: [number, number] = [flight.destination.lat, flight.destination.lon];
        const flightPos: [number, number] = [flight.lat, flight.lon];

        return (
          <Marker
            key={flight.id}
            position={flightPos}
            icon={createPlaneIcon(flight.heading)}
          >
            <Popup>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  minWidth: '180px',
                }}
              >
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: 'var(--accent-amber)',
                    marginBottom: '6px',
                  }}
                >
                  {flight.callsign}
                </div>
                <div style={{ marginBottom: '4px', color: '#94a3b8' }}>{flight.airline}</div>
                <div style={{ marginBottom: '4px' }}>
                  {flight.origin.iata} → {flight.destination.iata}
                </div>
                <div style={{ marginBottom: '4px' }}>ALT: {flight.altitude.toLocaleString()} ft</div>
                <div style={{ marginBottom: '8px' }}>SPD: {flight.groundSpeed} kt</div>
                <a
                  href={`/flights/${flight.callsign}`}
                  style={{
                    color: '#38bdf8',
                    textDecoration: 'none',
                    fontSize: '12px',
                  }}
                >
                  View details →
                </a>
              </div>
            </Popup>
            <Polyline
              positions={[originPos, flightPos, destPos]}
              pathOptions={{ color: '#f59e0b', opacity: 0.6, weight: 1.5, dashArray: '4 4' }}
            />
          </Marker>
        );
      })}
    </MapContainer>
  );
}
