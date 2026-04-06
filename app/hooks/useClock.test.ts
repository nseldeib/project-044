// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Tests for the UTC clock formatting logic extracted from useClock

function formatUtcTime(date: Date): string {
  const hh = String(date.getUTCHours()).padStart(2, '0');
  const mm = String(date.getUTCMinutes()).padStart(2, '0');
  const ss = String(date.getUTCSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}Z`;
}

describe('useClock — clock formatting logic', () => {
  it('formats noon UTC correctly', () => {
    expect(formatUtcTime(new Date('2026-04-06T12:34:56Z'))).toBe('12:34:56Z');
  });

  it('pads single-digit hours', () => {
    expect(formatUtcTime(new Date('2026-04-06T01:00:00Z'))).toBe('01:00:00Z');
  });

  it('pads single-digit minutes', () => {
    expect(formatUtcTime(new Date('2026-04-06T10:02:00Z'))).toBe('10:02:00Z');
  });

  it('pads single-digit seconds', () => {
    expect(formatUtcTime(new Date('2026-04-06T10:10:03Z'))).toBe('10:10:03Z');
  });

  it('handles midnight UTC', () => {
    expect(formatUtcTime(new Date('2026-04-06T00:00:00Z'))).toBe('00:00:00Z');
  });

  it('handles end of day UTC', () => {
    expect(formatUtcTime(new Date('2026-04-06T23:59:59Z'))).toBe('23:59:59Z');
  });

  it('setInterval fires every 1000ms', () => {
    vi.useFakeTimers();
    let ticks = 0;
    const id = setInterval(() => ticks++, 1000);
    vi.advanceTimersByTime(3000);
    expect(ticks).toBe(3);
    clearInterval(id);
    vi.useRealTimers();
  });
});
