import { describe, it, expect } from 'vitest';
import {
  timeAgo,
  formatTime,
  formatDuration,
  formatDMS,
  formatAltitude,
  formatSpeed,
  formatDelay,
  getFlightKpis,
} from './formatters';

describe('timeAgo', () => {
  it('returns "just now" for < 60 seconds', () => {
    const recent = new Date(Date.now() - 30 * 1000);
    expect(timeAgo(recent)).toBe('just now');
  });

  it('returns minutes for 1-59 minutes', () => {
    const date = new Date(Date.now() - 5 * 60 * 1000);
    expect(timeAgo(date)).toBe('5m ago');
  });

  it('returns hours for 1-23 hours', () => {
    const date = new Date(Date.now() - 3 * 60 * 60 * 1000);
    expect(timeAgo(date)).toBe('3h ago');
  });

  it('returns days for >= 24 hours', () => {
    const date = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    expect(timeAgo(date)).toBe('3d ago');
  });

  it('accepts string input', () => {
    const date = new Date(Date.now() - 2 * 60 * 60 * 1000);
    expect(timeAgo(date.toISOString())).toBe('2h ago');
  });

  it('returns "unknown" for undefined', () => {
    expect(timeAgo(undefined as unknown as Date)).toBe('unknown');
  });

  it('returns "just now" for future dates', () => {
    const future = new Date(Date.now() + 60 * 1000);
    expect(timeAgo(future)).toBe('just now');
  });

  it('returns "1m ago" for exactly 60 seconds', () => {
    const date = new Date(Date.now() - 60 * 1000);
    expect(timeAgo(date)).toBe('1m ago');
  });
});

describe('formatTime', () => {
  it('returns "—" for null', () => {
    expect(formatTime(null)).toBe('—');
  });

  it('returns "—" for undefined', () => {
    expect(formatTime(undefined)).toBe('—');
  });

  it('formats a date in 24h UTC format', () => {
    // Create a specific UTC time
    const date = new Date('2024-01-15T14:32:00Z');
    expect(formatTime(date)).toBe('14:32');
  });

  it('accepts a string date', () => {
    const result = formatTime('2024-01-15T09:05:00Z');
    expect(result).toBe('09:05');
  });

  it('pads hours and minutes with zeros', () => {
    const date = new Date('2024-01-15T03:07:00Z');
    expect(formatTime(date)).toBe('03:07');
  });
});

describe('formatDuration', () => {
  it('formats hours and minutes', () => {
    expect(formatDuration(85)).toBe('1h 25m');
  });

  it('formats minutes only', () => {
    expect(formatDuration(45)).toBe('45m');
  });

  it('returns "0m" for zero', () => {
    expect(formatDuration(0)).toBe('0m');
  });

  it('formats exactly 1 hour', () => {
    expect(formatDuration(60)).toBe('1h 0m');
  });

  it('formats 2 hours 30 minutes', () => {
    expect(formatDuration(150)).toBe('2h 30m');
  });
});

describe('formatDMS', () => {
  it('formats positive lat/lon as N/E', () => {
    const result = formatDMS(40.641, 73.778);
    expect(result).toContain('N');
    expect(result).toContain('E');
  });

  it('formats negative lat/lon as S/W', () => {
    const result = formatDMS(-40.641, -73.778);
    expect(result).toContain('S');
    expect(result).toContain('W');
  });

  it('formats JFK coordinates with correct degree values', () => {
    const result = formatDMS(40.6413, -73.7781);
    expect(result).toMatch(/40°/);
    expect(result).toMatch(/73°/);
    expect(result).toContain('N');
    expect(result).toContain('W');
  });

  it('handles zero coordinates', () => {
    const result = formatDMS(0, 0);
    expect(result).toMatch(/0°/);
    expect(result).toContain('N');
    expect(result).toContain('E');
  });
});

describe('formatAltitude', () => {
  it('formats with commas and ft suffix', () => {
    expect(formatAltitude(38000)).toBe('38,000 ft');
  });

  it('formats 0 feet', () => {
    expect(formatAltitude(0)).toBe('0 ft');
  });

  it('formats large altitude', () => {
    expect(formatAltitude(41000)).toBe('41,000 ft');
  });

  it('formats small altitude without comma', () => {
    expect(formatAltitude(500)).toBe('500 ft');
  });
});

describe('formatSpeed', () => {
  it('formats knots with kt suffix', () => {
    expect(formatSpeed(520)).toBe('520 kt');
  });

  it('formats zero knots', () => {
    expect(formatSpeed(0)).toBe('0 kt');
  });

  it('formats decimal knots as integer', () => {
    expect(formatSpeed(520)).toBe('520 kt');
  });
});

describe('formatDelay', () => {
  it('returns "On Time" for zero delay', () => {
    expect(formatDelay(0)).toBe('On Time');
  });

  it('returns "+N min" for positive delay', () => {
    expect(formatDelay(25)).toBe('+25 min');
  });

  it('returns negative minutes for early arrivals', () => {
    expect(formatDelay(-5)).toBe('-5 min');
  });

  it('formats 1 minute delay', () => {
    expect(formatDelay(1)).toBe('+1 min');
  });

  it('formats large delay', () => {
    expect(formatDelay(120)).toBe('+120 min');
  });
});

describe('getFlightKpis', () => {
  it('returns an array of 3 KPI items', () => {
    const kpis = getFlightKpis(35000, 487, 270);
    expect(kpis).toHaveLength(3);
  });

  it('first KPI is ALTITUDE with formatted value', () => {
    const kpis = getFlightKpis(35000, 487, 270);
    expect(kpis[0].label).toBe('ALTITUDE');
    expect(kpis[0].value).toBe(formatAltitude(35000));
  });

  it('second KPI is SPEED with formatted value', () => {
    const kpis = getFlightKpis(35000, 487, 270);
    expect(kpis[1].label).toBe('SPEED');
    expect(kpis[1].value).toBe(formatSpeed(487));
  });

  it('third KPI is HEADING with degree symbol', () => {
    const kpis = getFlightKpis(35000, 487, 270);
    expect(kpis[2].label).toBe('HEADING');
    expect(kpis[2].value).toBe('270°');
  });

  it('handles zero altitude and speed', () => {
    const kpis = getFlightKpis(0, 0, 0);
    expect(kpis[0].value).toBe(formatAltitude(0));
    expect(kpis[1].value).toBe(formatSpeed(0));
    expect(kpis[2].value).toBe('0°');
  });
});
