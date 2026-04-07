// OpenSky Network API helpers
// Docs: https://opensky-network.org/apidoc/rest.html
//
// State vector array indices:
//  0  icao24            — ICAO 24-bit address (hex)
//  1  callsign          — callsign (may have trailing spaces)
//  2  origin_country    — country of origin
//  4  last_contact      — Unix timestamp of last contact (s)
//  5  longitude         — WGS-84 longitude (degrees), null if unknown
//  6  latitude          — WGS-84 latitude (degrees), null if unknown
//  7  baro_altitude     — barometric altitude (meters), null if on ground
//  8  on_ground         — boolean — true if position is from ground transponder
//  9  velocity          — ground speed (m/s), null if unknown
// 10  true_track        — track angle in degrees (clockwise from north)
// 11  vertical_rate     — vertical rate (m/s), positive = climbing
// 14  squawk            — transponder code

export type StateVector = (string | number | boolean | null)[];

export interface FlightPositionUpdate {
  id: number;
  lat: number;
  lon: number;
  altitude: number;
  groundSpeed: number;
  heading: number;
  verticalRate: number;
  squawk: string;
}

/**
 * Extracts and normalizes the callsign from an OpenSky state vector.
 * Returns an empty string if the callsign field is missing or blank.
 */
export function extractOpenSkyCallsign(state: StateVector): string {
  return String(state[1] ?? '').trim().toUpperCase();
}

/**
 * Returns true if a state vector represents a valid, airborne, position-known aircraft
 * whose callsign exists in the provided known-callsigns set.
 */
export function isValidAirborneState(
  state: StateVector,
  knownCallsigns: Set<string>
): boolean {
  const callsign = extractOpenSkyCallsign(state);
  if (!callsign) return false;
  if (!knownCallsigns.has(callsign)) return false;
  if (state[6] === null || state[5] === null) return false; // no position
  if (state[8] === true) return false; // on ground
  return true;
}

/**
 * Converts meters to feet (aviation standard).
 */
export function metersToFeet(meters: number | null): number {
  if (!meters) return 0;
  return Math.round(meters * 3.28084);
}

/**
 * Converts m/s to knots (aviation standard).
 */
export function msToKnots(ms: number | null): number {
  if (!ms) return 0;
  return Math.round(ms * 1.94384);
}

/**
 * Maps an OpenSky state vector to a flight position update record.
 * Assumes the state has already been validated with isValidAirborneState.
 */
export function openSkyStateToFlightUpdate(
  state: StateVector,
  idByCallsign: Map<string, number>
): FlightPositionUpdate {
  const callsign = extractOpenSkyCallsign(state);
  return {
    id: idByCallsign.get(callsign)!,
    lat: state[6] as number,
    lon: state[5] as number,
    altitude: metersToFeet(state[7] as number | null),
    groundSpeed: msToKnots(state[9] as number | null),
    heading: (state[10] as number) ?? 0,
    verticalRate: metersToFeet(state[11] as number | null),
    squawk: String(state[14] ?? ''),
  };
}
