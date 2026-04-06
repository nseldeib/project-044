'use client';

import { useState, useEffect } from 'react';

export interface BikeStation {
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

export interface BikeStationSummary {
  totalStations: number;
  totalBikes: number;
  totalDocks: number;
  stationsLow: number;
  stationsEmpty: number;
}

/**
 * Fetches /api/bikes and returns { stations, summary, loading, error }.
 */
export function useBikeStations(): {
  stations: BikeStation[];
  summary: BikeStationSummary | null;
  loading: boolean;
  error: string | null;
} {
  const [stations, setStations] = useState<BikeStation[]>([]);
  const [summary, setSummary] = useState<BikeStationSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/bikes')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setStations(data.stations ?? []);
        setSummary(data.summary ?? null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message ?? 'Failed to load bike stations');
        setLoading(false);
      });
  }, []);

  return { stations, summary, loading, error };
}
