'use client';

import { useState, useEffect } from 'react';

export interface Airport {
  id: number;
  iata: string;
  lat: number;
  lon: number;
  name: string;
  city: string;
}

export interface Flight {
  id: number;
  callsign: string;
  airline: string;
  flightNumber: string;
  aircraftType: string;
  status: string;
  altitude: number;
  groundSpeed: number;
  heading: number;
  lat: number;
  lon: number;
  delayMinutes: number;
  origin: Airport;
  destination: Airport;
}

/**
 * Fetches /api/flights and returns { flights, loading, error }.
 */
export function useFlights(): {
  flights: Flight[];
  loading: boolean;
  error: string | null;
} {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/flights')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setFlights(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message ?? 'Failed to load flights');
        setLoading(false);
      });
  }, []);

  return { flights, loading, error };
}
