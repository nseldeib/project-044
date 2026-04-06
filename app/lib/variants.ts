/**
 * Pure functions that map status strings to visual variants for VECTOR badges & indicators.
 */

export type BadgeVariant = 'nominal' | 'warning' | 'critical' | 'info' | 'neutral' | 'blue';

export function flightStatusVariant(status: string): BadgeVariant {
  switch (status) {
    case 'EN_ROUTE':  return 'nominal';
    case 'BOARDING':  return 'blue';
    case 'DELAYED':   return 'warning';
    case 'DIVERTED':  return 'warning';
    case 'CANCELLED': return 'critical';
    case 'LANDED':    return 'neutral';
    default:          return 'neutral';
  }
}

export function alertSeverityVariant(severity: string): BadgeVariant {
  switch (severity) {
    case 'CRITICAL': return 'critical';
    case 'WARNING':  return 'warning';
    case 'INFO':     return 'info';
    default:         return 'neutral';
  }
}

export function subwayStatusVariant(status: string): BadgeVariant {
  switch (status) {
    case 'GOOD_SERVICE':   return 'nominal';
    case 'DELAYS':         return 'warning';
    case 'PLANNED_WORK':   return 'info';
    case 'SUSPENDED':      return 'critical';
    case 'SERVICE_CHANGE': return 'warning';
    default:               return 'neutral';
  }
}

export function bikeStationStatus(
  bikesAvailable: number,
  isRenting: boolean,
  isInstalled: boolean,
): 'available' | 'low' | 'empty' | 'offline' {
  if (!isInstalled || !isRenting) return 'offline';
  if (bikesAvailable === 0) return 'empty';
  if (bikesAvailable < 5) return 'low';
  return 'available';
}

export function bikeStationVariant(
  status: 'available' | 'low' | 'empty' | 'offline',
): BadgeVariant {
  switch (status) {
    case 'available': return 'nominal';
    case 'low':       return 'warning';
    case 'empty':     return 'critical';
    case 'offline':   return 'neutral';
  }
}

export function watchlistTypeVariant(type: string): BadgeVariant {
  switch (type) {
    case 'FLIGHT':       return 'blue';
    case 'BIKE_STATION': return 'nominal';
    case 'SUBWAY_LINE':  return 'info';
    case 'AIRPORT':      return 'warning';
    default:             return 'neutral';
  }
}

/**
 * Returns a CSS variable string representing the text color for a given subway line status.
 */
export function subwayLineTextColor(status: string): string {
  switch (status) {
    case 'SUSPENDED':      return 'var(--status-critical)';
    case 'DELAYS':         return 'var(--status-warning)';
    case 'PLANNED_WORK':   return 'var(--status-info)';
    case 'SERVICE_CHANGE': return 'var(--status-warning)';
    default:               return 'var(--status-nominal)';
  }
}
