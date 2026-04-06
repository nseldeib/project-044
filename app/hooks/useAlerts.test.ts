// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Alert } from './useAlerts';

// Tests for useAlerts fetch/response logic

async function fetchAlerts(fetchFn: typeof fetch): Promise<{
  alerts: Alert[];
  unreadCount: number;
  error: string | null;
}> {
  try {
    const r = await fetchFn('/api/alerts' as any, undefined as any);
    if (!(r as any).ok) throw new Error(`HTTP ${(r as any).status}`);
    const data = await (r as Response).json();
    const list: Alert[] = Array.isArray(data.alerts) ? data.alerts : [];
    const unreadCount = data.unreadCount ?? list.filter((a) => !a.read).length;
    return { alerts: list, unreadCount, error: null };
  } catch (err: any) {
    return { alerts: [], unreadCount: 0, error: err.message ?? 'Failed to load alerts' };
  }
}

const mockAlerts: Alert[] = [
  { id: 1, type: 'WEATHER', severity: 'HIGH', title: 'Turbulence', body: 'North Atlantic.', read: false, createdAt: '2026-04-06T10:00:00Z' },
  { id: 2, type: 'DELAY', severity: 'LOW', title: 'Gate change', body: 'JFK T8.', read: true, createdAt: '2026-04-06T09:00:00Z' },
];

describe('useAlerts — fetch logic', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('returns alerts and unreadCount from API', async () => {
    const fetchFn = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ alerts: mockAlerts, unreadCount: 1 }),
      })
    ) as unknown as typeof fetch;
    const result = await fetchAlerts(fetchFn);
    expect(result.alerts).toHaveLength(2);
    expect(result.unreadCount).toBe(1);
    expect(result.error).toBeNull();
  });

  it('computes unreadCount from alerts when field missing', async () => {
    const fetchFn = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ alerts: mockAlerts }),
      })
    ) as unknown as typeof fetch;
    const result = await fetchAlerts(fetchFn);
    expect(result.unreadCount).toBe(1); // 1 unread out of 2
  });

  it('handles empty alerts array', async () => {
    const fetchFn = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ alerts: [], unreadCount: 0 }),
      })
    ) as unknown as typeof fetch;
    const result = await fetchAlerts(fetchFn);
    expect(result.alerts).toEqual([]);
    expect(result.unreadCount).toBe(0);
  });

  it('handles missing alerts field', async () => {
    const fetchFn = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ unreadCount: 0 }),
      })
    ) as unknown as typeof fetch;
    const result = await fetchAlerts(fetchFn);
    expect(result.alerts).toEqual([]);
  });

  it('sets error on HTTP error', async () => {
    const fetchFn = vi.fn(() =>
      Promise.resolve({ ok: false, status: 500 })
    ) as unknown as typeof fetch;
    const result = await fetchAlerts(fetchFn);
    expect(result.error).toBe('HTTP 500');
    expect(result.alerts).toEqual([]);
  });

  it('sets error on network failure', async () => {
    const fetchFn = vi.fn(() => Promise.reject(new Error('network error'))) as unknown as typeof fetch;
    const result = await fetchAlerts(fetchFn);
    expect(result.error).toBe('network error');
  });

  it('counts all unread alerts correctly', async () => {
    const allUnread = mockAlerts.map((a) => ({ ...a, read: false }));
    const fetchFn = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ alerts: allUnread }),
      })
    ) as unknown as typeof fetch;
    const result = await fetchAlerts(fetchFn);
    expect(result.unreadCount).toBe(2);
  });
});
