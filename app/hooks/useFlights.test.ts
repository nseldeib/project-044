// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Flight } from './useFlights';

// Tests for useFlights fetch/response logic

async function fetchFlights(fetchFn: typeof fetch): Promise<{ flights: Flight[]; error: string | null }> {
  try {
    const r = await fetchFn('/api/flights' as any, undefined as any);
    if (!(r as any).ok) throw new Error(`HTTP ${(r as any).status}`);
    const data = await (r as Response).json();
    return { flights: Array.isArray(data) ? data : [], error: null };
  } catch (err: any) {
    return { flights: [], error: err.message ?? 'Failed to load flights' };
  }
}

const mockFlight: Flight = {
  id: 1,
  callsign: 'AAL100',
  airline: 'American Airlines',
  flightNumber: 'AA100',
  aircraftType: 'B77W',
  status: 'EN_ROUTE',
  altitude: 39000,
  groundSpeed: 525,
  heading: 63,
  lat: 50.2,
  lon: -28.1,
  delayMinutes: 0,
  origin: { id: 1, iata: 'JFK', lat: 40.64, lon: -73.78, name: 'JFK', city: 'New York' },
  destination: { id: 10, iata: 'LHR', lat: 51.47, lon: -0.45, name: 'Heathrow', city: 'London' },
};

describe('useFlights — fetch logic', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('returns flights array on success', async () => {
    const fetchFn = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve([mockFlight]) })
    ) as unknown as typeof fetch;
    const result = await fetchFlights(fetchFn);
    expect(result.flights).toHaveLength(1);
    expect(result.flights[0].callsign).toBe('AAL100');
    expect(result.error).toBeNull();
  });

  it('returns empty array when response is not an array', async () => {
    const fetchFn = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ flights: [] }) })
    ) as unknown as typeof fetch;
    const result = await fetchFlights(fetchFn);
    expect(result.flights).toEqual([]);
  });

  it('sets error on non-ok HTTP response', async () => {
    const fetchFn = vi.fn(() =>
      Promise.resolve({ ok: false, status: 500 })
    ) as unknown as typeof fetch;
    const result = await fetchFlights(fetchFn);
    expect(result.error).toBe('HTTP 500');
    expect(result.flights).toEqual([]);
  });

  it('sets error on network failure', async () => {
    const fetchFn = vi.fn(() => Promise.reject(new Error('network error'))) as unknown as typeof fetch;
    const result = await fetchFlights(fetchFn);
    expect(result.error).toBe('network error');
  });

  it('handles multiple flights', async () => {
    const fetchFn = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([mockFlight, { ...mockFlight, id: 2, callsign: 'UAL87' }]),
      })
    ) as unknown as typeof fetch;
    const result = await fetchFlights(fetchFn);
    expect(result.flights).toHaveLength(2);
    expect(result.flights[1].callsign).toBe('UAL87');
  });
});
