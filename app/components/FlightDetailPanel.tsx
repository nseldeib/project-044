'use client';

import { flightProgressPercent } from '@/app/lib/calculations';
import { hasRouteData } from '@/app/lib/calculations';
import FlightPanelHeader from './FlightPanelHeader';
import FlightRouteSection from './FlightRouteSection';
import FlightKpiGrid from './FlightKpiGrid';
import FlightPositionRow from './FlightPositionRow';

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

interface FlightDetailPanelProps {
  flight: Flight;
  onClose: () => void;
}

export default function FlightDetailPanel({ flight, onClose }: FlightDetailPanelProps) {
  const routeExists = hasRouteData(flight.origin, flight.destination);
  const progress = routeExists
    ? flightProgressPercent(flight.origin, { lat: flight.lat, lon: flight.lon }, flight.destination)
    : 50;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: '380px',
        background: 'linear-gradient(180deg, rgba(8,13,26,0.98) 0%, rgba(3,6,15,0.99) 100%)',
        borderLeft: '1px solid var(--bg-border)',
        boxShadow: '-12px 0 48px rgba(0,0,0,0.8), -1px 0 0 rgba(245,158,11,0.15)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        overflowY: 'auto',
        animation: 'slideInRight var(--transition-slow) ease',
      }}
    >
      <FlightPanelHeader
        callsign={flight.callsign}
        airline={flight.airline}
        status={flight.status}
        onClose={onClose}
      />
      {routeExists && (
        <FlightRouteSection
          origin={flight.origin}
          destination={flight.destination}
          progress={progress}
        />
      )}
      <FlightKpiGrid
        altitude={flight.altitude}
        groundSpeed={flight.groundSpeed}
        heading={flight.heading}
      />
      <FlightPositionRow lat={flight.lat} lon={flight.lon} />
    </div>
  );
}
