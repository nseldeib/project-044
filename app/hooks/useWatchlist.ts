'use client';

import { useState, useEffect } from 'react';

export interface WatchlistAlert {
  id: number;
  type: string;
  severity: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface WatchlistItem {
  id: number;
  type: string;
  label: string;
  refId: string;
  notes: string;
  createdAt: string;
  flight: { callsign: string; status: string; airline: string } | null;
  alerts: WatchlistAlert[];
}

/**
 * Fetches /api/watchlist and provides deleteItem(id) to remove an item.
 */
export function useWatchlist(): {
  items: WatchlistItem[];
  loading: boolean;
  error: string | null;
  deleteItem: (id: number) => Promise<void>;
} {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/watchlist')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message ?? 'Failed to load watchlist');
        setLoading(false);
      });
  }, []);

  async function deleteItem(id: number) {
    try {
      const res = await fetch(`/api/watchlist/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
      }
    } catch {
      // silently ignore network errors
    }
  }

  return { items, loading, error, deleteItem };
}
