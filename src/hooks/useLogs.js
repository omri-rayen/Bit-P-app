import { useCallback, useEffect, useState } from 'react';

const API_URL = 'https://bit-p-server.up.railway.app/api/logs';

export default function useLogs(limit = 6) {
  const [logs, setLogs] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async (cursor = null) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append('limit', String(limit));
      if (cursor) params.append('cursor', cursor);

      const url = `${API_URL}?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch logs: ${res.status} ${text}`);
      }
      const body = await res.json();

      const newLogs = Array.isArray(body.logs) ? body.logs : [];

      if (cursor) {
        setLogs(prev => [...prev, ...newLogs]);
      } else {
        setLogs(newLogs);
      }

      setNextCursor(body.nextCursor ?? null);
    } catch (err) {
      console.warn(err);
      setError(err.message || 'Error fetching logs');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const loadMore = useCallback(() => {
    if (loading) return;
    if (!nextCursor) return;
    fetchLogs(nextCursor);
  }, [loading, nextCursor, fetchLogs]);

  return {
    logs,
    loading,
    error,
    loadMore,
    hasMore: !!nextCursor
  };
}
