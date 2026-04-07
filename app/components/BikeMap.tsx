'use client';

import { MapContainer } from 'react-leaflet';
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

export default function BikeMap({ stations }: BikeMapProps) {
  return (
    <MapContainer
      center={[40.7128, -74.006]}
      zoom={12}
      style={{ width: '100%', height: '100%', minHeight: 0 }}
    >
      <DarkTileLayer />
      {stations.map((station) => (
        <BikeStationMarker key={station.id} station={station} />
      ))}
    </MapContainer>
  );
}
