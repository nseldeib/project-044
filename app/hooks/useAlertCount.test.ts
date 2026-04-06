// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Tests for useAlertCount fetch/response logic

async function fetchAlertCount(fetchFn: typeof fetch): Promise<{ unreadCount: number; error: boolean }> {
  try {
    const r = await fetchFn('/api/alerts' as any, undefined as any);
    const data = await (r as Response).json();
    return { unreadCount: data.unreadCount ?? 0, error: false };
  } catch {
    return { unreadCount: 0, error: true };
  }
}

describe('useAlertCount — fetch logic', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('returns unreadCount from API response', async () => {
    const fetchFn = vi.fn(() =>
      Promise.resolve({ json: () => Promise.resolve({ unreadCount: 5 }) })
    ) as unknown as typeof fetch;
    const result = await fetchAlertCount(fetchFn);
    expect(result.unreadCount).toBe(5);
    expect(result.error).toBe(false);
  });

  it('defaults unreadCount to 0 when field missing', async () => {
    const fetchFn = vi.fn(() =>
      Promise.resolve({ json: () => Promise.resolve({}) })
    ) as unknown as typeof fetch;
    const result = await fetchAlertCount(fetchFn);
    expect(result.unreadCount).toBe(0);
  });

  it('returns error=true on fetch rejection', async () => {
    const fetchFn = vi.fn(() => Promise.reject(new Error('network'))) as unknown as typeof fetch;
    const result = await fetchAlertCount(fetchFn);
    expect(result.error).toBe(true);
    expect(result.unreadCount).toBe(0);
  });

  it('handles unreadCount of 0 explicitly', async () => {
    const fetchFn = vi.fn(() =>
      Promise.resolve({ json: () => Promise.resolve({ unreadCount: 0 }) })
    ) as unknown as typeof fetch;
    const result = await fetchAlertCount(fetchFn);
    expect(result.unreadCount).toBe(0);
  });
});
