/**
 * useMQTT Hook
 * 
 * Hook React pour gérer la connexion MQTT et les messages
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import mqttClient from '../services/mqttClient';

export default function useMQTT(autoConnect = true) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [lastMessage, setLastMessage] = useState(null);
  const unsubscribeRef = useRef([]);

  // Connexion au broker MQTT
  const connect = useCallback(async () => {
    try {
      setError(null);
      await mqttClient.connect();
      setIsConnected(true);
    } catch (err) {
      setError(err.errorMessage || err.message || 'Erreur de connexion MQTT');
      setIsConnected(false);
    }
  }, []);

  // Déconnexion
  const disconnect = useCallback(() => {
    mqttClient.disconnect();
    setIsConnected(false);
  }, []);

  // S'abonner à un topic
  const subscribe = useCallback(async (topic, qos = 0) => {
    try {
      await mqttClient.subscribe(topic, qos);
      return true;
    } catch (err) {
      setError(err.errorMessage || err.message);
      return false;
    }
  }, []);

  // Se désabonner d'un topic
  const unsubscribe = useCallback(async (topic) => {
    try {
      await mqttClient.unsubscribe(topic);
      return true;
    } catch (err) {
      setError(err.errorMessage || err.message);
      return false;
    }
  }, []);

  // Publier un message
  const publish = useCallback((topic, payload, qos = 0, retained = false) => {
    return mqttClient.publish(topic, payload, qos, retained);
  }, []);

  // Effet pour gérer la connexion et les événements
  useEffect(() => {
    // Handler pour les messages
    const messageUnsub = mqttClient.onMessage((topic, payload, rawMessage) => {
      const msg = {
        id: Date.now().toString(),
        topic,
        payload,
        timestamp: new Date(),
      };
      setLastMessage(msg);
      setMessages(prev => [...prev.slice(-99), msg]); // Garder les 100 derniers messages
    });
    unsubscribeRef.current.push(messageUnsub);

    // Handler pour la connexion
    const connectUnsub = mqttClient.onConnectionChange('onConnect', () => {
      setIsConnected(true);
      setError(null);
    });
    unsubscribeRef.current.push(connectUnsub);

    // Handler pour la déconnexion
    const disconnectUnsub = mqttClient.onConnectionChange('onDisconnect', () => {
      setIsConnected(false);
    });
    unsubscribeRef.current.push(disconnectUnsub);

    // Handler pour les erreurs
    const errorUnsub = mqttClient.onConnectionChange('onError', (err) => {
      setError(err.errorMessage || 'Erreur MQTT');
    });
    unsubscribeRef.current.push(errorUnsub);

    // Connexion automatique si demandé
    if (autoConnect && !mqttClient.getConnectionStatus()) {
      connect();
    } else {
      setIsConnected(mqttClient.getConnectionStatus());
    }

    // Cleanup
    return () => {
      unsubscribeRef.current.forEach(unsub => unsub && unsub());
      unsubscribeRef.current = [];
    };
  }, [autoConnect, connect]);

  // Effacer les messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    setLastMessage(null);
  }, []);

  return {
    isConnected,
    error,
    messages,
    lastMessage,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    publish,
    clearMessages,
    client: mqttClient,
  };
}
