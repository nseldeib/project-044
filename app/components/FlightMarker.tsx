'use client';

import { Marker, Polyline } from 'react-leaflet';
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

function createPlaneIcon(heading: number, isSelected: boolean, isDimmed: boolean) {
  const size = isSelected ? 32 : 22;
  const opacity = isDimmed ? 0.1 : 1;
  const blur = isDimmed ? 'blur(1px)' : 'none';

  // Selected: pulsing glow + targeting reticle ring
  const glow = isSelected
    ? 'drop-shadow(0 0 8px rgba(245,158,11,0.9)) drop-shadow(0 0 16px rgba(245,158,11,0.5))'
    : 'none';

  const reticle = isSelected
    ? `<circle cx="16" cy="16" r="13" fill="none" stroke="rgba(245,158,11,0.6)" stroke-width="1" stroke-dasharray="3 3"/>
       <circle cx="16" cy="16" r="10" fill="none" stroke="rgba(245,158,11,0.3)" stroke-width="0.5"/>
       <line x1="3" y1="16" x2="8" y2="16" stroke="rgba(245,158,11,0.5)" stroke-width="0.8"/>
       <line x1="24" y1="16" x2="29" y2="16" stroke="rgba(245,158,11,0.5)" stroke-width="0.8"/>
       <line x1="16" y1="3" x2="16" y2="8" stroke="rgba(245,158,11,0.5)" stroke-width="0.8"/>
       <line x1="16" y1="24" x2="16" y2="29" stroke="rgba(245,158,11,0.5)" stroke-width="0.8"/>`
    : '';

  const planePath = isSelected
    ? `<polygon points="16,4 11,22 16,18 21,22" fill="#f59e0b" stroke="#fcd34d" stroke-width="1.5"/>`
    : `<polygon points="11,3 8,17 11,14 14,17" fill="#f59e0b" stroke="#b45309" stroke-width="1"/>`;

  const svgSize = isSelected ? 32 : 22;
  const viewBox = isSelected ? '0 0 32 32' : '0 0 22 22';
  const centerX = isSelected ? 16 : 11;
  const centerY = isSelected ? 16 : 11;

  const svg = `<div style="background:transparent;border:none;line-height:0;filter:${glow};opacity:${opacity};${isDimmed ? `filter:blur(1px)` : ''}">
    <svg xmlns="http://www.w3.org/2000/svg" width="${svgSize}" height="${svgSize}" viewBox="${viewBox}">
      <g transform="rotate(${heading}, ${centerX}, ${centerY})">
        ${reticle}
        ${planePath}
      </g>
    </svg>
  </div>`;

  return L.divIcon({
    html: svg,
    className: 'plane-marker-icon',
    iconSize: [svgSize, svgSize],
    iconAnchor: [svgSize / 2, svgSize / 2],
  });
}

interface FlightMarkerProps {
  flight: Flight;
  isSelected: boolean;
  isDimmed: boolean;
  onSelect: (flight: Flight) => void;
}

export default function FlightMarker({ flight, isSelected, isDimmed, onSelect }: FlightMarkerProps) {
  const flightPos: [number, number] = [flight.lat, flight.lon];
  const hasRoute = !!(flight.origin?.lat && flight.destination?.lat);
  const originPos: [number, number] = [flight.origin.lat, flight.origin.lon];
  const destPos: [number, number] = [flight.destination.lat, flight.destination.lon];
  const icon = createPlaneIcon(flight.heading, isSelected, isDimmed);

  return (
    <>
      <Marker
        position={flightPos}
        icon={icon}
        eventHandlers={{ click: () => onSelect(flight) }}
      />
      {hasRoute && (
        <Polyline
          positions={[originPos, flightPos, destPos]}
          pathOptions={{
            color: '#f59e0b',
            opacity: isDimmed ? 0.05 : isSelected ? 1 : 0.35,
            weight: isSelected ? 2.5 : 1.5,
            dashArray: isSelected ? undefined : '5 6',
          }}
        />
      )}
      {/* Selected: second glow pass for the route */}
      {hasRoute && isSelected && (
        <Polyline
          positions={[originPos, flightPos, destPos]}
          pathOptions={{
            color: '#fcd34d',
            opacity: 0.2,
            weight: 8,
            dashArray: undefined,
          }}
        />
      )}
    </>
  );
}
