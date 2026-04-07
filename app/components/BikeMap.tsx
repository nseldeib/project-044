'use client';

import { MapContainer, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import DarkTileLayer from './DarkTileLayer';
import BikeStationMarker from './BikeStationMarker';

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

function ZoomTracker({ onZoom }: { onZoom: (z: number) => void }) {
  useMapEvents({
    zoomend: (e) => onZoom(e.target.getZoom()),
  });
  return null;
}

export default function BikeMap({ stations }: BikeMapProps) {
  const [zoom, setZoom] = useState(12);

  return (
    <MapContainer
      center={[40.7128, -74.006]}
      zoom={12}
      style={{ width: '100%', height: '100%', minHeight: 0 }}
    >
      <DarkTileLayer />
      <ZoomTracker onZoom={setZoom} />
      {stations.map((station) => (
        <BikeStationMarker key={station.id} station={station} zoom={zoom} />
      ))}
    </MapContainer>
  );
}
