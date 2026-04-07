'use client';

import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { getMarkerColor, getMarkerGlowColor, getMarkerSize } from '@/app/lib/gbfs';
import BikeStationPopup from './BikeStationPopup';

interface BikeStation {
  id: number;
  name: string;
  lat: number;
  lon: number;
  capacity: number;
  bikesAvailable: number;
  docksAvailable: number;
  isInstalled: boolean;
  isRenting: boolean;
  isReturning: boolean;
}

function createBikeSvgHtml(color: string, size: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">
    <circle cx="6" cy="16" r="4.5" stroke="${color}" stroke-width="2"/>
    <circle cx="18" cy="16" r="4.5" stroke="${color}" stroke-width="2"/>
    <path d="M6 16 L10 8 L14 8 L18 16" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M10 8 L12 16" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M14 8 L16 6 L19 6" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="12" cy="8" r="1.5" fill="${color}"/>
  </svg>`;
}

function createMarkerLabelHtml(color: string, size: number, label: string): string {
  return `<div style="
    position:absolute;
    top:${size + 2}px;
    left:50%;
    transform:translateX(-50%);
    white-space:nowrap;
    font-family:var(--font-mono,'JetBrains Mono',monospace);
    font-size:10px;
    font-weight:600;
    color:${color};
    background:rgba(3,6,15,0.85);
    border:1px solid ${color};
    border-radius:2px;
    padding:1px 4px;
    letter-spacing:0.04em;
    pointer-events:none;
  ">${label}</div>`;
}

function createBikeIcon(color: string, zoom: number, showLabel: boolean, label: string): L.DivIcon {
  const size = getMarkerSize(zoom);
  const glow = getMarkerGlowColor(color);
  const svg = createBikeSvgHtml(color, size);
  const labelHtml = showLabel ? createMarkerLabelHtml(color, size, label) : '';

  return L.divIcon({
    className: '',
    html: `<div style="position:relative;width:${size}px;height:${size}px;filter:drop-shadow(0 0 4px ${glow});">${svg}${labelHtml}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  });
}

interface BikeStationMarkerProps {
  station: BikeStation;
  zoom: number;
}

export default function BikeStationMarker({ station, zoom }: BikeStationMarkerProps) {
  const color = getMarkerColor(station);
  const icon = createBikeIcon(color, zoom, zoom >= 16, station.name);

  return (
    <Marker position={[station.lat, station.lon]} icon={icon}>
      <Popup>
        <BikeStationPopup
          name={station.name}
          bikesAvailable={station.bikesAvailable}
          docksAvailable={station.docksAvailable}
          capacity={station.capacity}
          isInstalled={station.isInstalled}
          isRenting={station.isRenting}
        />
      </Popup>
    </Marker>
  );
}
