// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { WatchlistItem } from './useWatchlist';

// Tests for useWatchlist fetch/response logic

async function fetchWatchlist(fetchFn: typeof fetch): Promise<{
  items: WatchlistItem[];
  error: string | null;
}> {
  try {
    const r = await fetchFn('/api/watchlist' as any, undefined as any);
    if (!(r as any).ok) throw new Error(`HTTP ${(r as any).status}`);
    const data = await (r as Response).json();
    return { items: Array.isArray(data) ? data : [], error: null };
  } catch (err: any) {
    return { items: [], error: err.message ?? 'Failed to load watchlist' };
  }
}

async function deleteWatchlistItem(
  id: number,
  fetchFn: typeof fetch
): Promise<boolean> {
  try {
    const res = await fetchFn(`/api/watchlist/${id}` as any, { method: 'DELETE' } as any);
    return !!(res as any).ok;
  } catch {
    return false;
  }
}

const mockItem: WatchlistItem = {
  id: 1,
  type: 'FLIGHT',
  label: 'AAL100 JFK→LHR',
  refId: 'AAL100',
  notes: 'Transatlantic watch',
  createdAt: '2026-04-06T10:00:00Z',
  flight: { callsign: 'AAL100', status: 'EN_ROUTE', airline: 'American Airlines' },
  alerts: [],
};

describe('useWatchlist — fetch logic', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('returns items on success', async () => {
    const fetchFn = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve([mockItem]) })
    ) as unknown as typeof fetch;
    const result = await fetchWatchlist(fetchFn);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].refId).toBe('AAL100');
    expect(result.error).toBeNull();
  });

  it('returns empty array when response is not an array', async () => {
    const fetchFn = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
    ) as unknown as typeof fetch;
    const result = await fetchWatchlist(fetchFn);
    expect(result.items).toEqual([]);
  });

  it('sets error on HTTP error', async () => {
    const fetchFn = vi.fn(() =>
      Promise.resolve({ ok: false, status: 404 })
    ) as unknown as typeof fetch;
    const result = await fetchWatchlist(fetchFn);
    expect(result.error).toBe('HTTP 404');
  });

  it('sets error on network failure', async () => {
    const fetchFn = vi.fn(() => Promise.reject(new Error('timeout'))) as unknown as typeof fetch;
    const result = await fetchWatchlist(fetchFn);
    expect(result.error).toBe('timeout');
  });
});

describe('useWatchlist — deleteItem logic', () => {
  it('returns true on successful delete', async () => {
    const fetchFn = vi.fn(() =>
      Promise.resolve({ ok: true })
    ) as unknown as typeof fetch;
    const ok = await deleteWatchlistItem(1, fetchFn);
    expect(ok).toBe(true);
    expect(fetchFn).toHaveBeenCalledWith('/api/watchlist/1', { method: 'DELETE' });
  });

  it('returns false on HTTP error', async () => {
    const fetchFn = vi.fn(() =>
      Promise.resolve({ ok: false })
    ) as unknown as typeof fetch;
    const ok = await deleteWatchlistItem(1, fetchFn);
    expect(ok).toBe(false);
  });

  it('returns false on network error', async () => {
    const fetchFn = vi.fn(() => Promise.reject(new Error('network'))) as unknown as typeof fetch;
    const ok = await deleteWatchlistItem(1, fetchFn);
    expect(ok).toBe(false);
  });
});
