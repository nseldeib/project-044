'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import FlightDetailPanel from '@/app/components/FlightDetailPanel';

const jfk = { id: 1, iata: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', lat: 40.6413, lon: -73.7781 };
const lhr = { id: 2, iata: 'LHR', name: 'Heathrow Airport', city: 'London', lat: 51.477, lon: -0.4543 };
const lax = { id: 3, iata: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', lat: 33.9425, lon: -118.408 };
const ord = { id: 4, iata: 'ORD', name: "O'Hare International Airport", city: 'Chicago', lat: 41.9742, lon: -87.9073 };
const noAirport = { id: 0, iata: '', name: '', city: '', lat: 0, lon: 0 };

const scenarios = {
  TransatlanticEnRoute: {
    flight: {
      id: 1, callsign: 'UAL901', airline: 'United Airlines', flightNumber: 'UA901',
      status: 'en_route', altitude: 38000, groundSpeed: 520, heading: 75,
      lat: 51.2, lon: -30.4, origin: jfk, destination: lhr,
    },
    onClose: () => {},
  },
  DomesticDelayed: {
    flight: {
      id: 2, callsign: 'AAL234', airline: 'American Airlines', flightNumber: 'AA234',
      status: 'delayed', altitude: 32000, groundSpeed: 490, heading: 270,
      lat: 38.9, lon: -100.5, origin: ord, destination: lax,
    },
    onClose: () => {},
  },
  NoRouteData: {
    flight: {
      id: 3, callsign: 'N12345', airline: 'Private', flightNumber: '',
      status: 'en_route', altitude: 8500, groundSpeed: 215, heading: 182,
      lat: 29.5, lon: -95.2, origin: noAirport, destination: noAirport,
    },
    onClose: () => {},
  },
  NearLanding: {
    flight: {
      id: 4, callsign: 'DAL88', airline: 'Delta Air Lines', flightNumber: 'DL88',
      status: 'en_route', altitude: 4200, groundSpeed: 280, heading: 340,
      lat: 40.9, lon: -73.9, origin: lax, destination: jfk,
    },
    onClose: () => {},
  },
};

function Content() {
  const params = useSearchParams();
  const s = params.get('s') ?? 'TransatlanticEnRoute';
  const props = scenarios[s as keyof typeof scenarios] ?? scenarios['TransatlanticEnRoute'];

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#080d1a' }}>
      <div id="codeyam-capture" style={{ display: 'inline-block' }}>
        <div style={{ width: 380, position: 'relative' }}>
          <FlightDetailPanel {...props} />
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <Content />
    </Suspense>
  );
}
