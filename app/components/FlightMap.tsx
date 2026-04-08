'use client';

import { MapContainer } from 'react-leaflet';
import { useState } from 'react';
import DarkTileLayer from './DarkTileLayer';
import FlightMarker from './FlightMarker';
import FlightDetailPanel from './FlightDetailPanel';

interface Airport {
  id: number;
  iata: string;
  name: string;
  city: string;
  lat: number;
  lon: number;
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
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const enRoute = filterEnRouteFlights(flights);

  function handleSelect(flight: Flight) {
    setSelectedFlight((prev) => (prev?.id === flight.id ? null : flight));
  }

  function handleClose() {
    setSelectedFlight(null);
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <MapContainer
        center={[30, -40]}
        zoom={3}
        style={{ width: '100%', height: '100%', minHeight: 0 }}
        zoomControl={true}
      >
        <DarkTileLayer />
        {enRoute.map((flight) => (
          <FlightMarker
            key={flight.id}
            flight={flight}
            isSelected={selectedFlight?.id === flight.id}
            isDimmed={selectedFlight !== null && selectedFlight.id !== flight.id}
            onSelect={handleSelect}
          />
        ))}
      </MapContainer>
      {selectedFlight && (
        <FlightDetailPanel flight={selectedFlight} onClose={handleClose} />
      )}
    </div>
  );
}
