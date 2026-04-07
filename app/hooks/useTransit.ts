'use client';

import { useState, useEffect, useCallback } from 'react';

export interface SubwayTrain {
  id: number;
  trainId: string;
  lineId: string;
  direction: string;
  currentStop: string;
  nextStop: string;
  status: string;
  delay: number;
  lat: number;
  lon: number;
  updatedAt: string;
}

export interface SubwayLine {
  id: number;
  lineId: string;
  name: string;
  color: string;
  status: string;
  statusText: string;
  trains: SubwayTrain[];
}

export interface TransitSummary {
  totalLines: number;
  linesWithIssues: number;
  suspended: number;
  totalTrains: number;
}

export function useTransit(): {
  lines: SubwayLine[];
  summary: TransitSummary | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
} {
  const [lines, setLines] = useState<SubwayLine[]>([]);
  const [summary, setSummary] = useState<TransitSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    fetch('/api/transit')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setLines(data.lines ?? []);
        setSummary(data.summary ?? null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message ?? 'Failed to load transit data');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { lines, summary, loading, error, refresh };
}
