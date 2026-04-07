'use client';

import { MapContainer } from 'react-leaflet';
import DarkTileLayer from './DarkTileLayer';
import FlightMarker from './FlightMarker';

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

function filterEnRouteFlights(flights: Flight[]): Flight[] {
  return flights.filter((f) => f.status === 'EN_ROUTE' && f.lat !== 0 && f.lon !== 0);
}

export default function FlightMap({ flights }: FlightMapProps) {
  const enRoute = filterEnRouteFlights(flights);

  return (
    <MapContainer
      center={[30, -40]}
      zoom={3}
      style={{ width: '100%', height: '100%', minHeight: 0 }}
      zoomControl={true}
    >
      <DarkTileLayer />
      {enRoute.map((flight) => (
        <FlightMarker key={flight.id} flight={flight} />
      ))}
    </MapContainer>
  );
}
