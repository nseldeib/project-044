import { describe, it, expect } from 'vitest';
import {
  bikeAvailabilityPercent,
  flightProgressPercent,
  haversineKm,
  latLonToString,
} from './calculations';

describe('bikeAvailabilityPercent', () => {
  it('returns 0 when capacity is 0', () => {
    expect(bikeAvailabilityPercent(0, 0)).toBe(0);
  });

  it('returns 100 for full capacity', () => {
    expect(bikeAvailabilityPercent(20, 20)).toBe(100);
  });

  it('returns 50 for half capacity', () => {
    expect(bikeAvailabilityPercent(10, 20)).toBe(50);
  });

  it('returns 0 when no bikes available', () => {
    expect(bikeAvailabilityPercent(0, 20)).toBe(0);
  });

  it('clamps to 100 when available > capacity', () => {
    expect(bikeAvailabilityPercent(25, 20)).toBe(100);
  });

  it('clamps to 0 for negative values', () => {
    expect(bikeAvailabilityPercent(-5, 20)).toBe(0);
  });

  it('rounds to integer', () => {
    const result = bikeAvailabilityPercent(1, 3);
    expect(result).toBe(33);
  });
});

describe('flightProgressPercent', () => {
  const origin = { lat: 0, lon: 0 };
  const destination = { lat: 10, lon: 10 };

  it('returns 0 when at origin', () => {
    expect(flightProgressPercent(origin, { lat: 0, lon: 0 }, destination)).toBe(0);
  });

  it('returns 100 when at destination', () => {
    expect(flightProgressPercent(origin, { lat: 10, lon: 10 }, destination)).toBe(100);
  });

  it('returns ~50 at midpoint', () => {
    const mid = { lat: 5, lon: 5 };
    const result = flightProgressPercent(origin, mid, destination);
    expect(result).toBeCloseTo(50, 0);
  });

  it('clamps to 0 when behind origin', () => {
    const result = flightProgressPercent(origin, { lat: -5, lon: -5 }, destination);
    expect(result).toBe(0);
  });

  it('clamps to 100 when past destination', () => {
    const result = flightProgressPercent(origin, { lat: 20, lon: 20 }, destination);
    expect(result).toBe(100);
  });

  it('returns 50 when same origin and destination', () => {
    const point = { lat: 5, lon: 5 };
    const result = flightProgressPercent(point, point, point);
    expect(result).toBe(50);
  });
});

describe('haversineKm', () => {
  it('returns 0 for same point', () => {
    expect(haversineKm(40, -73, 40, -73)).toBe(0);
  });

  it('returns ~5570 km for JFK to LHR (approx)', () => {
    // JFK: 40.6413, -73.7781 | LHR: 51.4700, -0.4543
    const km = haversineKm(40.6413, -73.7781, 51.4700, -0.4543);
    expect(km).toBeGreaterThan(5500);
    expect(km).toBeLessThan(5700);
  });

  it('is symmetric', () => {
    const d1 = haversineKm(40, -73, 51, -0);
    const d2 = haversineKm(51, -0, 40, -73);
    expect(d1).toBeCloseTo(d2, 5);
  });

  it('returns a positive number for different points', () => {
    expect(haversineKm(0, 0, 1, 1)).toBeGreaterThan(0);
  });
});

describe('latLonToString', () => {
  it('formats positive lat/lon as N/E', () => {
    expect(latLonToString(40.6413, 73.7781)).toBe('40.6413°N, 73.7781°E');
  });

  it('formats negative lat as S', () => {
    expect(latLonToString(-33.8688, 151.2093)).toBe('33.8688°S, 151.2093°E');
  });

  it('formats negative lon as W', () => {
    expect(latLonToString(40.6413, -73.7781)).toBe('40.6413°N, 73.7781°W');
  });

  it('formats both negative as S/W', () => {
    expect(latLonToString(-34.6037, -58.3816)).toBe('34.6037°S, 58.3816°W');
  });

  it('handles zero coordinates', () => {
    expect(latLonToString(0, 0)).toBe('0.0000°N, 0.0000°E');
  });
});
