'use client';

import { useState, useEffect } from 'react';

export interface Alert {
  id: number;
  type: string;
  severity: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

/**
 * Fetches /api/alerts and returns { alerts, unreadCount, loading, error }.
 */
export function useAlerts(): {
  alerts: Alert[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
} {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/alerts')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        const list: Alert[] = Array.isArray(data.alerts) ? data.alerts : [];
        setAlerts(list);
        setUnreadCount(data.unreadCount ?? list.filter((a) => !a.read).length);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message ?? 'Failed to load alerts');
        setLoading(false);
      });
  }, []);

  return { alerts, unreadCount, loading, error };
}
