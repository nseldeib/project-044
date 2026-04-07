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
