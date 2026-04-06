'use client';

import { MapContainer, CircleMarker, Popup } from 'react-leaflet';

interface BikeStation {
  id: number;
  stationId: string;
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

interface BikeMapProps {
  stations: BikeStation[];
}

function getMarkerColor(station: BikeStation): string {
  if (!station.isInstalled || !station.isRenting) return '#64748b';
  const pct = station.capacity > 0 ? (station.bikesAvailable / station.capacity) * 100 : 0;
  if (pct > 20) return '#4ade80';
  if (pct > 10) return '#f59e0b';
  return '#ef4444';
}

export default function BikeMap({ stations }: BikeMapProps) {
  return (
    <MapContainer
      center={[40.7128, -74.006]}
      zoom={12}
      style={{ width: '100%', height: '100%', minHeight: 0 }}
    >
      {stations.map((station) => (
        <CircleMarker
          key={station.id}
          center={[station.lat, station.lon]}
          radius={6}
          pathOptions={{
            color: getMarkerColor(station),
            fillColor: getMarkerColor(station),
            fillOpacity: 0.85,
            weight: 1.5,
          }}
        >
          <Popup>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                color: 'var(--text-primary)',
                minWidth: '200px',
              }}
            >
              <div style={{ fontWeight: '700', marginBottom: '6px', color: '#38bdf8' }}>
                {station.name}
              </div>
              <div style={{ marginBottom: '4px' }}>
                Bikes available:{' '}
                <span style={{ color: '#f59e0b' }}>{station.bikesAvailable}</span>
              </div>
              <div style={{ marginBottom: '4px' }}>
                Docks available: <span style={{ color: '#94a3b8' }}>{station.docksAvailable}</span>
              </div>
              <div style={{ marginBottom: '4px' }}>
                Capacity: {station.capacity}
              </div>
              <div style={{ marginTop: '6px', fontSize: '12px', color: '#64748b' }}>
                {!station.isInstalled ? 'OFFLINE' : !station.isRenting ? 'NOT RENTING' : 'OPERATIONAL'}
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
