/**
 * useSystemName.js
 *
 * Hook to fetch the system name from the server.
 * Returns: { sysName: string|null, loading: boolean, error: string|null, refresh: fn }
 */

import { useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

const API_URL = 'https://bit-p-server.up.railway.app/api/sysName';

export default function useSystemName({ refreshOnFocus = true } = {}) {
  const [sysName, setSysName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchName = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setSysName(json?.sysName ?? null);
    } catch (err) {
      setError(err?.message || 'Failed to load system name');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchName();
  }, [fetchName]);

  useFocusEffect(
    useCallback(() => {
      if (refreshOnFocus) fetchName();
    }, [fetchName, refreshOnFocus])
  );

  return { sysName, loading, error, refresh: fetchName };
}
