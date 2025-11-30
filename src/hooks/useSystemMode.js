/**
 * useSystemMode.js
 *
 * Custom hook to fetch and manage the system mode from the server.
 * Provides: `isArmed` (null | boolean), `loading`, `error`, and `refresh`.
 *
 * Usage:
 * const { isArmed, loading, error, refresh } = useSystemMode();
 */

import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

const API_URL = 'https://bit-p-server.up.railway.app/api/sysMode';

export default function useSystemMode({ refreshOnFocus = true } = {}) {
  const [isArmed, setIsArmed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMode = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setIsArmed(Boolean(json?.isArmed));
    } catch (err) {
      setError(err?.message || 'Failed to load system mode');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMode();
  }, [fetchMode]);

  useFocusEffect(
    useCallback(() => {
      if (refreshOnFocus) fetchMode();
    }, [fetchMode, refreshOnFocus])
  );

  return { isArmed, loading, error, refresh: fetchMode };
}
