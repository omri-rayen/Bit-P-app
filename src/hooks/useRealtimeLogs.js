/**
 * useRealtimeLogs Hook
 * 
 * Hook pour gérer les logs en temps réel via MQTT
 * S'abonne au topic system/logs et reçoit les notifications
 */

import { useState, useEffect, useCallback } from 'react';
import useMQTT from './useMQTT';

const LOGS_TOPIC = 'system/logs';

export default function useRealtimeLogs() {
  const { isConnected, subscribe, unsubscribe, lastMessage } = useMQTT(true);
  const [realtimeLogs, setRealtimeLogs] = useState([]);
  const [latestLog, setLatestLog] = useState(null);

  // S'abonner au topic des logs
  useEffect(() => {
    if (isConnected) {
      console.log('[useRealtimeLogs] Subscribing to', LOGS_TOPIC);
      subscribe(LOGS_TOPIC, 0);
      
      return () => {
        console.log('[useRealtimeLogs] Unsubscribing from', LOGS_TOPIC);
        unsubscribe(LOGS_TOPIC);
      };
    }
  }, [isConnected, subscribe, unsubscribe]);

  // Traiter les messages reçus
  useEffect(() => {
    if (lastMessage && lastMessage.topic === LOGS_TOPIC) {
      try {
        const logData = typeof lastMessage.payload === 'string' 
          ? JSON.parse(lastMessage.payload)
          : lastMessage.payload;

        console.log('[useRealtimeLogs] Received log:', logData);

        // Créer un log formaté avec un ID unique
        const formattedLog = {
          id: `realtime_${Date.now()}_${Math.random()}`,
          origin: logData.origin || 'device',
          msg: logData.msg || '',
          timestamp: logData.timestamp || new Date().toISOString(),
          deviceId: logData.deviceId || null,
          dName: getDeviceName(logData.deviceId),
          // Données spécifiques aux capteurs
          isOpen: logData.isOpen !== undefined ? logData.isOpen : null,
          // Marquer comme log temps réel
          isRealtime: true,
        };

        setLatestLog(formattedLog);
        setRealtimeLogs(prev => [formattedLog, ...prev.slice(0, 49)]); // Garder les 50 derniers
      } catch (err) {
        console.error('[useRealtimeLogs] Error parsing log:', err);
      }
    }
  }, [lastMessage]);

  // Fonction pour obtenir le nom du device
  const getDeviceName = (deviceId) => {
    if (!deviceId) return null;
    
    // Hardcoded device names
    const deviceNames = {
      'd239': 'Door Sensor',
      'd254': 'Motion Detector',
    };
    
    return deviceNames[deviceId] || deviceId;
  };

  // Effacer les logs
  const clearRealtimeLogs = useCallback(() => {
    setRealtimeLogs([]);
    setLatestLog(null);
  }, []);

  return {
    realtimeLogs,
    latestLog,
    clearRealtimeLogs,
    isConnected,
  };
}
