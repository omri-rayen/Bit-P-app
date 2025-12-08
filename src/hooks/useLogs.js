import { useCallback, useEffect, useState, useMemo } from 'react';
import useRealtimeLogs from './useRealtimeLogs';

const API_URL = 'https://bit-p-server.up.railway.app/api/logs';

export default function useLogs(limit = 6) {
  const [logs, setLogs] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Hook pour les logs en temps réel
  const { realtimeLogs, latestLog } = useRealtimeLogs();

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

  // Combiner les logs de l'API avec les logs en temps réel
  const allLogs = useMemo(() => {
    // Fusionner les logs en temps réel avec les logs de l'API
    // Les logs temps réel en premier (plus récents)
    const combined = [...realtimeLogs, ...logs];
    
    // Supprimer les doublons basés sur l'ID
    const uniqueLogs = combined.filter((log, index, self) =>
      index === self.findIndex((l) => l.id === log.id)
    );
    
    // Trier par timestamp (plus récent en premier)
    return uniqueLogs.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return timeB - timeA;
    });
  }, [logs, realtimeLogs]);

  return {
    logs: allLogs,
    loading,
    error,
    loadMore,
    hasMore: !!nextCursor,
    latestLog, // Dernier log reçu en temps réel
  };
}
