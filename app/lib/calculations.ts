/**
 * Pure calculation utilities for VECTOR — Mission Control
 */

/**
 * Returns 0-100 representing how full a bike station is.
 * Edge: capacity === 0 → 0. Clamps to [0, 100].
 */
export function bikeAvailabilityPercent(available: number, capacity: number): number {
  if (capacity === 0) return 0;
  const pct = (available / capacity) * 100;
  return Math.round(Math.min(100, Math.max(0, pct)));
}

/**
 * Returns 0-100 representing how far along a route a flight is.
 * Uses Euclidean distance (not great-circle). Clamps to [0, 100].
 */
export function flightProgressPercent(
  origin: { lat: number; lon: number },
  current: { lat: number; lon: number },
  destination: { lat: number; lon: number },
): number {
  const totalLat = destination.lat - origin.lat;
  const totalLon = destination.lon - origin.lon;
  const totalDist = Math.sqrt(totalLat ** 2 + totalLon ** 2);

  if (totalDist === 0) return 50;

  const coveredLat = current.lat - origin.lat;
  const coveredLon = current.lon - origin.lon;

  // Project covered vector onto the route vector to get signed progress
  const dot = (coveredLat * totalLat + coveredLon * totalLon) / (totalDist ** 2);
  const raw = dot * 100;
  return Math.round(Math.min(100, Math.max(0, raw)));
}

/**
 * Great-circle distance in km using the Haversine formula.
 */
export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth radius in km
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Returns "40.6413°N, 73.7781°W" from decimal degrees.
 */
export function latLonToString(lat: number, lon: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lon).toFixed(4)}°${lonDir}`;
}
