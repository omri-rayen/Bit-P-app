/**
 * useDevices.js
 *
 * Hook to fetch the list of devices for the current system.
 * Returns: { devices: Array, currentDevice: Object|null, loading, error, refresh }
 */

import { useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

const API_URL = 'https://bit-p-server.up.railway.app/api/devices';

export default function useDevices({ refreshOnFocus = true } = {}) {
  const [devices, setDevices] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDevices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setDevices(Array.isArray(json?.devices) ? json.devices : []);
    } catch (err) {
      setError(err?.message || 'Failed to load devices');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  useFocusEffect(
    useCallback(() => {
      if (refreshOnFocus) fetchDevices();
    }, [fetchDevices, refreshOnFocus])
  );

  const currentDevice = devices && devices.length > 0 ? devices[0] : null;

  return { devices, currentDevice, loading, error, refresh: fetchDevices };
}
