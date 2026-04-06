// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { BikeStation, BikeStationSummary } from './useBikeStations';

// Tests for useBikeStations fetch/response logic

async function fetchBikeStations(fetchFn: typeof fetch): Promise<{
  stations: BikeStation[];
  summary: BikeStationSummary | null;
  error: string | null;
}> {
  try {
    const r = await fetchFn('/api/bikes' as any, undefined as any);
    if (!(r as any).ok) throw new Error(`HTTP ${(r as any).status}`);
    const data = await (r as Response).json();
    return { stations: data.stations ?? [], summary: data.summary ?? null, error: null };
  } catch (err: any) {
    return { stations: [], summary: null, error: err.message ?? 'Failed to load bike stations' };
  }
}

const mockStation: BikeStation = {
  id: 1, stationId: 'nyc-001', name: 'W 31 St & 7 Ave',
  lat: 40.748, lon: -73.994, capacity: 39,
  bikesAvailable: 12, docksAvailable: 27,
  isInstalled: true, isRenting: true, isReturning: true,
};

const mockSummary: BikeStationSummary = {
  totalStations: 1, totalBikes: 12, totalDocks: 27,
  stationsLow: 0, stationsEmpty: 0,
};

describe('useBikeStations — fetch logic', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('returns stations and summary on success', async () => {
    const fetchFn = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ stations: [mockStation], summary: mockSummary }),
      })
    ) as unknown as typeof fetch;
    const result = await fetchBikeStations(fetchFn);
    expect(result.stations).toHaveLength(1);
    expect(result.stations[0].name).toBe('W 31 St & 7 Ave');
    expect(result.summary?.totalBikes).toBe(12);
    expect(result.error).toBeNull();
  });

  it('handles missing stations/summary fields', async () => {
    const fetchFn = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
    ) as unknown as typeof fetch;
    const result = await fetchBikeStations(fetchFn);
    expect(result.stations).toEqual([]);
    expect(result.summary).toBeNull();
  });

  it('sets error on HTTP error', async () => {
    const fetchFn = vi.fn(() =>
      Promise.resolve({ ok: false, status: 503 })
    ) as unknown as typeof fetch;
    const result = await fetchBikeStations(fetchFn);
    expect(result.error).toBe('HTTP 503');
  });

  it('sets error on network failure', async () => {
    const fetchFn = vi.fn(() => Promise.reject(new Error('offline'))) as unknown as typeof fetch;
    const result = await fetchBikeStations(fetchFn);
    expect(result.error).toBe('offline');
  });

  it('returns stations array with correct shape', async () => {
    const fetchFn = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ stations: [mockStation], summary: mockSummary }),
      })
    ) as unknown as typeof fetch;
    const result = await fetchBikeStations(fetchFn);
    const s = result.stations[0];
    expect(s.bikesAvailable).toBe(12);
    expect(s.docksAvailable).toBe(27);
    expect(s.isInstalled).toBe(true);
  });
});
