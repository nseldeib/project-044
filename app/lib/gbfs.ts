// GBFS (General Bikeshare Feed Specification) data helpers
// Used by /api/bikes to sync Citi Bike live data

export interface GbfsStationInfo {
  station_id: string;
  name: string;
  lat: number;
  lon: number;
  capacity: number;
}

export interface GbfsStationStatus {
  station_id: string;
  num_bikes_available: number;
  num_docks_available: number;
  is_installed: number;
  is_renting: number;
  is_returning: number;
  last_reported: number;
}

export interface MergedStation {
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
  lastUpdated: Date;
}

export interface BikesSummary {
  totalStations: number;
  totalBikes: number;
  totalDocks: number;
  stationsLow: number;
  stationsEmpty: number;
}

/**
 * Merges GBFS station_information and station_status feeds into a unified shape.
 * Stations without matching info entries are excluded.
 */
export function mergeGbfsFeeds(
  infoStations: GbfsStationInfo[],
  statusStations: GbfsStationStatus[]
): MergedStation[] {
  const infoMap = new Map<string, GbfsStationInfo>(
    infoStations.map((s) => [s.station_id, s])
  );

  return statusStations
    .filter((s) => infoMap.has(s.station_id))
    .map((s) => {
      const info = infoMap.get(s.station_id)!;
      return {
        stationId: s.station_id,
        name: info.name,
        lat: info.lat,
        lon: info.lon,
        capacity: info.capacity,
        bikesAvailable: s.num_bikes_available,
        docksAvailable: s.num_docks_available,
        isInstalled: s.is_installed === 1,
        isRenting: s.is_renting === 1,
        isReturning: s.is_returning === 1,
        lastUpdated: new Date(s.last_reported * 1000),
      };
    });
}

/**
 * Returns true if the last sync time is older than intervalMs, or if there is no last sync time.
 */
export function isDataStale(lastUpdated: Date | null, intervalMs: number): boolean {
  if (!lastUpdated) return true;
  return Date.now() - lastUpdated.getTime() > intervalMs;
}

/**
 * Computes summary statistics from a list of bike stations.
 */
export function computeBikesSummary(
  stations: { bikesAvailable: number; docksAvailable: number; isRenting: boolean }[]
): BikesSummary {
  const totalBikes = stations.reduce((sum, s) => sum + s.bikesAvailable, 0);
  const totalDocks = stations.reduce((sum, s) => sum + s.docksAvailable, 0);
  const stationsLow = stations.filter((s) => s.bikesAvailable < 3).length;
  const stationsEmpty = stations.filter((s) => s.bikesAvailable === 0 && s.isRenting).length;

  return {
    totalStations: stations.length,
    totalBikes,
    totalDocks,
    stationsLow,
    stationsEmpty,
  };
}

/**
 * Returns the operational status label for a bike station.
 */
export function getBikeStationStatus(station: {
  isInstalled: boolean;
  isRenting: boolean;
}): string {
  if (!station.isInstalled) return 'OFFLINE';
  if (!station.isRenting) return 'NOT RENTING';
  return 'OPERATIONAL';
}

/**
 * Returns the hex color for a bike station marker based on availability percentage.
 * Green > 20%, amber 10-20%, red ≤ 10%, gray if offline.
 */
export function getMarkerColor(station: {
  isInstalled: boolean;
  isRenting: boolean;
  capacity: number;
  bikesAvailable: number;
}): string {
  if (!station.isInstalled || !station.isRenting) return '#64748b';
  const pct = station.capacity > 0 ? (station.bikesAvailable / station.capacity) * 100 : 0;
  if (pct > 20) return '#4ade80';
  if (pct > 10) return '#f59e0b';
  return '#ef4444';
}

/**
 * Returns the CSS rgba glow color string matching a marker hex color.
 */
export function getMarkerGlowColor(color: string): string {
  if (color === '#4ade80') return 'rgba(74,222,128,0.35)';
  if (color === '#f59e0b') return 'rgba(245,158,11,0.35)';
  if (color === '#ef4444') return 'rgba(239,68,68,0.35)';
  return 'rgba(100,116,139,0.25)';
}

/**
 * Returns the pixel size for a bike marker icon based on map zoom level.
 * 14px at z≤13, 20px at z14-15, 26px at z≥16.
 */
export function getMarkerSize(zoom: number): number {
  if (zoom <= 13) return 14;
  if (zoom <= 15) return 20;
  return 26;
}
