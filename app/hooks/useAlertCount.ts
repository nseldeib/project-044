'use client';

import { useState, useEffect } from 'react';

/**
 * Fetches /api/alerts and returns the unread alert count plus loading state.
 */
export function useAlertCount(): { unreadCount: number; loading: boolean } {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/alerts')
      .then((r) => r.json())
      .then((data) => {
        setUnreadCount(data.unreadCount ?? 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { unreadCount, loading };
}
