import { describe, it, expect } from 'vitest';
import {
  flightStatusVariant,
  alertSeverityVariant,
  subwayStatusVariant,
  bikeStationStatus,
  bikeStationVariant,
  watchlistTypeVariant,
  subwayLineTextColor,
} from './variants';

describe('flightStatusVariant', () => {
  it('EN_ROUTE → nominal', () => expect(flightStatusVariant('EN_ROUTE')).toBe('nominal'));
  it('BOARDING → blue', () => expect(flightStatusVariant('BOARDING')).toBe('blue'));
  it('DELAYED → warning', () => expect(flightStatusVariant('DELAYED')).toBe('warning'));
  it('DIVERTED → warning', () => expect(flightStatusVariant('DIVERTED')).toBe('warning'));
  it('CANCELLED → critical', () => expect(flightStatusVariant('CANCELLED')).toBe('critical'));
  it('LANDED → neutral', () => expect(flightStatusVariant('LANDED')).toBe('neutral'));
  it('unknown → neutral', () => expect(flightStatusVariant('UNKNOWN')).toBe('neutral'));
  it('empty string → neutral', () => expect(flightStatusVariant('')).toBe('neutral'));
});

describe('alertSeverityVariant', () => {
  it('CRITICAL → critical', () => expect(alertSeverityVariant('CRITICAL')).toBe('critical'));
  it('WARNING → warning', () => expect(alertSeverityVariant('WARNING')).toBe('warning'));
  it('INFO → info', () => expect(alertSeverityVariant('INFO')).toBe('info'));
  it('unknown → neutral', () => expect(alertSeverityVariant('UNKNOWN')).toBe('neutral'));
  it('empty string → neutral', () => expect(alertSeverityVariant('')).toBe('neutral'));
});

describe('subwayStatusVariant', () => {
  it('GOOD_SERVICE → nominal', () => expect(subwayStatusVariant('GOOD_SERVICE')).toBe('nominal'));
  it('DELAYS → warning', () => expect(subwayStatusVariant('DELAYS')).toBe('warning'));
  it('PLANNED_WORK → info', () => expect(subwayStatusVariant('PLANNED_WORK')).toBe('info'));
  it('SUSPENDED → critical', () => expect(subwayStatusVariant('SUSPENDED')).toBe('critical'));
  it('SERVICE_CHANGE → warning', () => expect(subwayStatusVariant('SERVICE_CHANGE')).toBe('warning'));
  it('unknown → neutral', () => expect(subwayStatusVariant('UNKNOWN')).toBe('neutral'));
});

describe('bikeStationStatus', () => {
  it('returns offline if !isInstalled', () => {
    expect(bikeStationStatus(10, true, false)).toBe('offline');
  });

  it('returns offline if !isRenting', () => {
    expect(bikeStationStatus(10, false, true)).toBe('offline');
  });

  it('returns empty if bikesAvailable === 0', () => {
    expect(bikeStationStatus(0, true, true)).toBe('empty');
  });

  it('returns low if bikesAvailable < 5', () => {
    expect(bikeStationStatus(3, true, true)).toBe('low');
  });

  it('returns low for exactly 4', () => {
    expect(bikeStationStatus(4, true, true)).toBe('low');
  });

  it('returns available if bikesAvailable >= 5', () => {
    expect(bikeStationStatus(5, true, true)).toBe('available');
  });

  it('returns available for high count', () => {
    expect(bikeStationStatus(20, true, true)).toBe('available');
  });
});

describe('bikeStationVariant', () => {
  it('available → nominal', () => expect(bikeStationVariant('available')).toBe('nominal'));
  it('low → warning', () => expect(bikeStationVariant('low')).toBe('warning'));
  it('empty → critical', () => expect(bikeStationVariant('empty')).toBe('critical'));
  it('offline → neutral', () => expect(bikeStationVariant('offline')).toBe('neutral'));
});

describe('watchlistTypeVariant', () => {
  it('FLIGHT → blue', () => expect(watchlistTypeVariant('FLIGHT')).toBe('blue'));
  it('BIKE_STATION → nominal', () => expect(watchlistTypeVariant('BIKE_STATION')).toBe('nominal'));
  it('SUBWAY_LINE → info', () => expect(watchlistTypeVariant('SUBWAY_LINE')).toBe('info'));
  it('AIRPORT → warning', () => expect(watchlistTypeVariant('AIRPORT')).toBe('warning'));
  it('unknown → neutral', () => expect(watchlistTypeVariant('UNKNOWN')).toBe('neutral'));
  it('empty string → neutral', () => expect(watchlistTypeVariant('')).toBe('neutral'));
});

describe('subwayLineTextColor', () => {
  it('SUSPENDED → var(--status-critical)', () =>
    expect(subwayLineTextColor('SUSPENDED')).toBe('var(--status-critical)'));

  it('DELAYS → var(--status-warning)', () =>
    expect(subwayLineTextColor('DELAYS')).toBe('var(--status-warning)'));

  it('PLANNED_WORK → var(--status-info)', () =>
    expect(subwayLineTextColor('PLANNED_WORK')).toBe('var(--status-info)'));

  it('SERVICE_CHANGE → var(--status-warning)', () =>
    expect(subwayLineTextColor('SERVICE_CHANGE')).toBe('var(--status-warning)'));

  it('GOOD_SERVICE → var(--status-nominal)', () =>
    expect(subwayLineTextColor('GOOD_SERVICE')).toBe('var(--status-nominal)'));

  it('unknown → var(--status-nominal)', () =>
    expect(subwayLineTextColor('UNKNOWN')).toBe('var(--status-nominal)'));
});
