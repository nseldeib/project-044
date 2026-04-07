import { describe, it, expect } from 'vitest';
import {
  mergeGbfsFeeds,
  isDataStale,
  computeBikesSummary,
  getBikeStationStatus,
  getMarkerColor,
  getMarkerGlowColor,
  getMarkerSize,
  type GbfsStationInfo,
  type GbfsStationStatus,
} from './gbfs';

// ── mergeGbfsFeeds ─────────────────────────────────────────────────────────

describe('mergeGbfsFeeds', () => {
  const baseInfo: GbfsStationInfo = {
    station_id: 'abc',
    name: 'Central Park North',
    lat: 40.7,
    lon: -74.0,
    capacity: 20,
  };
  const baseStatus: GbfsStationStatus = {
    station_id: 'abc',
    num_bikes_available: 5,
    num_docks_available: 15,
    is_installed: 1,
    is_renting: 1,
    is_returning: 1,
    last_reported: 1000000,
  };

  it('merges matching info and status records', () => {
    const result = mergeGbfsFeeds([baseInfo], [baseStatus]);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      stationId: 'abc',
      name: 'Central Park North',
      lat: 40.7,
      lon: -74.0,
      capacity: 20,
      bikesAvailable: 5,
      docksAvailable: 15,
      isInstalled: true,
      isRenting: true,
      isReturning: true,
    });
  });

  it('converts last_reported unix timestamp to Date', () => {
    const result = mergeGbfsFeeds([baseInfo], [baseStatus]);
    expect(result[0].lastUpdated).toBeInstanceOf(Date);
    expect(result[0].lastUpdated.getTime()).toBe(1000000 * 1000);
  });

  it('excludes status entries with no matching info', () => {
    const orphanStatus: GbfsStationStatus = { ...baseStatus, station_id: 'xyz' };
    const result = mergeGbfsFeeds([baseInfo], [orphanStatus]);
    expect(result).toHaveLength(0);
  });

  it('handles is_installed=0 as false', () => {
    const offlineStatus: GbfsStationStatus = { ...baseStatus, is_installed: 0 };
    const result = mergeGbfsFeeds([baseInfo], [offlineStatus]);
    expect(result[0].isInstalled).toBe(false);
  });

  it('handles is_renting=0 as false', () => {
    const notRenting: GbfsStationStatus = { ...baseStatus, is_renting: 0 };
    const result = mergeGbfsFeeds([baseInfo], [notRenting]);
    expect(result[0].isRenting).toBe(false);
  });

  it('returns empty array for empty inputs', () => {
    expect(mergeGbfsFeeds([], [])).toHaveLength(0);
  });

  it('merges multiple stations correctly', () => {
    const info2: GbfsStationInfo = { ...baseInfo, station_id: 'def', name: 'Times Square' };
    const status2: GbfsStationStatus = { ...baseStatus, station_id: 'def', num_bikes_available: 0 };
    const result = mergeGbfsFeeds([baseInfo, info2], [baseStatus, status2]);
    expect(result).toHaveLength(2);
    expect(result.find((r) => r.stationId === 'def')?.bikesAvailable).toBe(0);
  });
});

// ── isDataStale ────────────────────────────────────────────────────────────

describe('isDataStale', () => {
  it('returns true when lastUpdated is null', () => {
    expect(isDataStale(null, 60_000)).toBe(true);
  });

  it('returns true when data is older than interval', () => {
    const old = new Date(Date.now() - 120_000);
    expect(isDataStale(old, 60_000)).toBe(true);
  });

  it('returns false when data is fresher than interval', () => {
    const fresh = new Date(Date.now() - 10_000);
    expect(isDataStale(fresh, 60_000)).toBe(false);
  });

  it('returns false exactly at boundary (age equals interval — not yet stale)', () => {
    // isDataStale uses strict >, so data aged exactly at the interval is NOT yet stale
    const atBoundary = new Date(Date.now() - 59_999);
    expect(isDataStale(atBoundary, 60_000)).toBe(false);
  });
});

// ── computeBikesSummary ────────────────────────────────────────────────────

describe('computeBikesSummary', () => {
  it('returns zeros for empty stations list', () => {
    const result = computeBikesSummary([]);
    expect(result).toEqual({
      totalStations: 0,
      totalBikes: 0,
      totalDocks: 0,
      stationsLow: 0,
      stationsEmpty: 0,
    });
  });

  it('sums bikes and docks correctly', () => {
    const stations = [
      { bikesAvailable: 10, docksAvailable: 5, isRenting: true },
      { bikesAvailable: 3, docksAvailable: 12, isRenting: true },
    ];
    const result = computeBikesSummary(stations);
    expect(result.totalBikes).toBe(13);
    expect(result.totalDocks).toBe(17);
    expect(result.totalStations).toBe(2);
  });

  it('counts stationsLow for bikesAvailable < 3', () => {
    const stations = [
      { bikesAvailable: 2, docksAvailable: 5, isRenting: true },
      { bikesAvailable: 0, docksAvailable: 7, isRenting: true },
      { bikesAvailable: 10, docksAvailable: 0, isRenting: true },
    ];
    const result = computeBikesSummary(stations);
    expect(result.stationsLow).toBe(2);
  });

  it('counts stationsEmpty only for renting stations with 0 bikes', () => {
    const stations = [
      { bikesAvailable: 0, docksAvailable: 10, isRenting: true },   // empty + renting = counts
      { bikesAvailable: 0, docksAvailable: 5, isRenting: false },   // empty but not renting = skip
      { bikesAvailable: 5, docksAvailable: 0, isRenting: true },    // renting but not empty = skip
    ];
    const result = computeBikesSummary(stations);
    expect(result.stationsEmpty).toBe(1);
  });
});

// ── getBikeStationStatus ───────────────────────────────────────────────────

describe('getBikeStationStatus', () => {
  it('returns OFFLINE when not installed', () => {
    expect(getBikeStationStatus({ isInstalled: false, isRenting: true })).toBe('OFFLINE');
  });

  it('returns NOT RENTING when installed but not renting', () => {
    expect(getBikeStationStatus({ isInstalled: true, isRenting: false })).toBe('NOT RENTING');
  });

  it('returns OPERATIONAL when installed and renting', () => {
    expect(getBikeStationStatus({ isInstalled: true, isRenting: true })).toBe('OPERATIONAL');
  });

  it('prioritizes OFFLINE over NOT RENTING', () => {
    expect(getBikeStationStatus({ isInstalled: false, isRenting: false })).toBe('OFFLINE');
  });
});

// ── getMarkerColor ─────────────────────────────────────────────────────────

describe('getMarkerColor', () => {
  const base = { isInstalled: true, isRenting: true, capacity: 20 };

  it('returns gray when station is not installed', () => {
    expect(getMarkerColor({ ...base, isInstalled: false, bikesAvailable: 10 })).toBe('#64748b');
  });

  it('returns gray when station is not renting', () => {
    expect(getMarkerColor({ ...base, isRenting: false, bikesAvailable: 10 })).toBe('#64748b');
  });

  it('returns green when availability > 20%', () => {
    expect(getMarkerColor({ ...base, bikesAvailable: 10 })).toBe('#4ade80'); // 50%
  });

  it('returns amber when availability is between 10% and 20%', () => {
    expect(getMarkerColor({ ...base, bikesAvailable: 3 })).toBe('#f59e0b'); // 15%
  });

  it('returns red when availability is <= 10%', () => {
    expect(getMarkerColor({ ...base, bikesAvailable: 0 })).toBe('#ef4444'); // 0%
  });

  it('returns red when availability is exactly 10%', () => {
    expect(getMarkerColor({ ...base, bikesAvailable: 2 })).toBe('#ef4444'); // exactly 10%
  });

  it('returns red when capacity is zero (guards against division by zero)', () => {
    expect(getMarkerColor({ ...base, capacity: 0, bikesAvailable: 0 })).toBe('#ef4444');
  });
});

// ── getMarkerGlowColor ────────────────────────────────────────────────────

describe('getMarkerGlowColor', () => {
  it('returns green glow for green marker', () => {
    expect(getMarkerGlowColor('#4ade80')).toBe('rgba(74,222,128,0.35)');
  });

  it('returns amber glow for amber marker', () => {
    expect(getMarkerGlowColor('#f59e0b')).toBe('rgba(245,158,11,0.35)');
  });

  it('returns red glow for red marker', () => {
    expect(getMarkerGlowColor('#ef4444')).toBe('rgba(239,68,68,0.35)');
  });

  it('returns neutral glow for gray/unknown color', () => {
    expect(getMarkerGlowColor('#64748b')).toBe('rgba(100,116,139,0.25)');
  });

  it('returns neutral glow for unrecognized color', () => {
    expect(getMarkerGlowColor('#ffffff')).toBe('rgba(100,116,139,0.25)');
  });
});

// ── getMarkerSize ─────────────────────────────────────────────────────────

describe('getMarkerSize', () => {
  it('returns 14 at zoom 12 (city view)', () => {
    expect(getMarkerSize(12)).toBe(14);
  });

  it('returns 14 at zoom 13 (boundary)', () => {
    expect(getMarkerSize(13)).toBe(14);
  });

  it('returns 20 at zoom 14', () => {
    expect(getMarkerSize(14)).toBe(20);
  });

  it('returns 20 at zoom 15 (boundary)', () => {
    expect(getMarkerSize(15)).toBe(20);
  });

  it('returns 26 at zoom 16 (street view)', () => {
    expect(getMarkerSize(16)).toBe(26);
  });

  it('returns 26 at zoom 18 (max zoom)', () => {
    expect(getMarkerSize(18)).toBe(26);
  });
});
