/**
 * Shared formatting utilities for VECTOR — Mission Control
 */

/**
 * Returns a human-readable relative time string: "2m ago", "1h ago", "3d ago", "just now" (< 60s)
 * Edge cases: undefined → "unknown", future dates → "just now"
 */
export function timeAgo(date: Date | string | undefined | null): string {
  if (date == null) return 'unknown';
  const d = new Date(date as Date);
  if (isNaN(d.getTime())) return 'unknown';

  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/**
 * Returns time in 24h format "HH:MM" (UTC by default), or "—" if null/undefined.
 */
export function formatTime(
  date: Date | string | null | undefined,
  timezone = 'UTC',
): string {
  if (date == null) return '—';
  const d = new Date(date as Date);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone,
    hour12: false,
  });
}

/**
 * Returns "1h 25m", "45m", "0m" from a duration in minutes.
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

/**
 * Returns "40°38'29"N 73°46'41"W" from decimal lat/lon.
 */
export function formatDMS(lat: number, lon: number): string {
  function toDMS(decimal: number, isLat: boolean): string {
    const dir = isLat ? (decimal >= 0 ? 'N' : 'S') : decimal >= 0 ? 'E' : 'W';
    const abs = Math.abs(decimal);
    const deg = Math.floor(abs);
    const minFloat = (abs - deg) * 60;
    const min = Math.floor(minFloat);
    const sec = Math.round((minFloat - min) * 60);
    return `${deg}°${min}'${sec}"${dir}`;
  }
  return `${toDMS(lat, true)} ${toDMS(lon, false)}`;
}

/**
 * Returns "38,000 ft" with commas.
 */
export function formatAltitude(feet: number): string {
  return `${feet.toLocaleString('en-US')} ft`;
}

/**
 * Returns "520 kt".
 */
export function formatSpeed(knots: number): string {
  return `${knots} kt`;
}

/**
 * Returns the three KPI items for a flight detail panel: altitude, speed, and heading.
 */
export function getFlightKpis(
  altitude: number,
  groundSpeed: number,
  heading: number,
): { label: string; value: string }[] {
  return [
    { label: 'ALTITUDE', value: formatAltitude(altitude) },
    { label: 'SPEED',    value: formatSpeed(groundSpeed) },
    { label: 'HEADING',  value: `${heading}°` },
  ];
}

/**
 * Returns "+25 min", "On Time" if 0, or "-5 min" if negative.
 */
export function formatDelay(minutes: number): string {
  if (minutes === 0) return 'On Time';
  if (minutes > 0) return `+${minutes} min`;
  return `${minutes} min`;
}
