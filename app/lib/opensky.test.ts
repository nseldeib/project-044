import { describe, it, expect } from 'vitest';
import {
  extractOpenSkyCallsign,
  isValidAirborneState,
  metersToFeet,
  msToKnots,
  openSkyStateToFlightUpdate,
  type StateVector,
} from './opensky';

// Helper to build a minimal valid state vector
function makeState(overrides: Partial<Record<number, string | number | boolean | null>> = {}): StateVector {
  const base: StateVector = [
    'abc123',    // 0 icao24
    'AAL100  ',  // 1 callsign (with trailing spaces)
    'United States', // 2 origin_country
    null,        // 3 (unused)
    1712345678,  // 4 last_contact
    -73.5,       // 5 longitude
    40.2,        // 6 latitude
    11278,       // 7 baro_altitude (meters)
    false,       // 8 on_ground
    256,         // 9 velocity (m/s)
    245,         // 10 true_track
    -2.5,        // 11 vertical_rate
    null,        // 12 sensors
    11000,       // 13 geo_altitude
    '2341',      // 14 squawk
    false,       // 15 spi
    0,           // 16 position_source
  ];
  Object.entries(overrides).forEach(([k, v]) => { base[Number(k)] = v as string | number | boolean | null; });
  return base;
}

// ── extractOpenSkyCallsign ─────────────────────────────────────────────────

describe('extractOpenSkyCallsign', () => {
  it('trims trailing spaces and uppercases the callsign', () => {
    expect(extractOpenSkyCallsign(makeState({ 1: 'aal100  ' }))).toBe('AAL100');
  });

  it('returns empty string for null callsign', () => {
    expect(extractOpenSkyCallsign(makeState({ 1: null }))).toBe('');
  });

  it('returns empty string for blank callsign', () => {
    expect(extractOpenSkyCallsign(makeState({ 1: '   ' }))).toBe('');
  });

  it('handles already-uppercase callsign', () => {
    expect(extractOpenSkyCallsign(makeState({ 1: 'UAL89' }))).toBe('UAL89');
  });
});

// ── isValidAirborneState ───────────────────────────────────────────────────

describe('isValidAirborneState', () => {
  const known = new Set(['AAL100', 'UAL89']);

  it('returns true for a valid airborne state with known callsign', () => {
    expect(isValidAirborneState(makeState(), known)).toBe(true);
  });

  it('returns false when callsign is not in known set', () => {
    expect(isValidAirborneState(makeState({ 1: 'DAL415' }), known)).toBe(false);
  });

  it('returns false when callsign is empty', () => {
    expect(isValidAirborneState(makeState({ 1: '' }), known)).toBe(false);
  });

  it('returns false when latitude is null', () => {
    expect(isValidAirborneState(makeState({ 6: null }), known)).toBe(false);
  });

  it('returns false when longitude is null', () => {
    expect(isValidAirborneState(makeState({ 5: null }), known)).toBe(false);
  });

  it('returns false when aircraft is on ground', () => {
    expect(isValidAirborneState(makeState({ 8: true }), known)).toBe(false);
  });
});

// ── metersToFeet ──────────────────────────────────────────────────────────

describe('metersToFeet', () => {
  it('converts meters to feet correctly', () => {
    expect(metersToFeet(1000)).toBe(3281);
  });

  it('returns 0 for null input', () => {
    expect(metersToFeet(null)).toBe(0);
  });

  it('returns 0 for 0 input', () => {
    expect(metersToFeet(0)).toBe(0);
  });

  it('rounds the result', () => {
    // 100m * 3.28084 = 328.084 → rounds to 328
    expect(metersToFeet(100)).toBe(328);
  });
});

// ── msToKnots ─────────────────────────────────────────────────────────────

describe('msToKnots', () => {
  it('converts m/s to knots correctly', () => {
    // 100 m/s * 1.94384 = 194.384 → 194
    expect(msToKnots(100)).toBe(194);
  });

  it('returns 0 for null input', () => {
    expect(msToKnots(null)).toBe(0);
  });

  it('returns 0 for 0 input', () => {
    expect(msToKnots(0)).toBe(0);
  });

  it('rounds the result', () => {
    // 250 m/s * 1.94384 = 485.96 → 486
    expect(msToKnots(250)).toBe(486);
  });
});

// ── openSkyStateToFlightUpdate ─────────────────────────────────────────────

describe('openSkyStateToFlightUpdate', () => {
  const idMap = new Map([['AAL100', 42]]);

  it('maps state vector to a flight position update', () => {
    const result = openSkyStateToFlightUpdate(makeState(), idMap);
    expect(result.id).toBe(42);
    expect(result.lat).toBe(40.2);
    expect(result.lon).toBe(-73.5);
    expect(result.altitude).toBe(metersToFeet(11278));
    expect(result.groundSpeed).toBe(msToKnots(256));
    expect(result.heading).toBe(245);
    expect(result.squawk).toBe('2341');
  });

  it('uses heading of 0 when true_track is null', () => {
    const result = openSkyStateToFlightUpdate(makeState({ 10: null }), idMap);
    expect(result.heading).toBe(0);
  });

  it('uses empty string for squawk when null', () => {
    const result = openSkyStateToFlightUpdate(makeState({ 14: null }), idMap);
    expect(result.squawk).toBe('');
  });

  it('converts vertical rate from m/s to feet/min equivalent', () => {
    const result = openSkyStateToFlightUpdate(makeState({ 11: 10 }), idMap);
    expect(result.verticalRate).toBe(metersToFeet(10));
  });
});
