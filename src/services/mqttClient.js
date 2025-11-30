/**
 * MQTT Client Service
 * 
 * Client MQTT pour se connecter au broker HiveMQ Cloud
 * Utilise WebSocket over TLS (WSS) pour la connexion sécurisée
 */

import Paho from 'paho-mqtt';

// Configuration du broker MQTT
const MQTT_CONFIG = {
  host: '4a4e84c1b433449f936feb25f099d793.s1.eu.hivemq.cloud',
  port: 8884, // Port WebSocket sécurisé (WSS)
  username: 'backend',
  password: 'Backend123',
  clientId: `bitpapp_${Math.random().toString(16).substr(2, 8)}`,
  reconnectTimeout: 5000,
  keepAliveInterval: 60,
};

class MQTTClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.subscriptions = new Map();
    this.messageHandlers = [];
    this.connectionHandlers = {
      onConnect: [],
      onDisconnect: [],
      onError: [],
    };
  }

  /**
   * Initialise et connecte le client MQTT
   */
  connect() {
    return new Promise((resolve, reject) => {
      try {
        // Créer le client Paho MQTT avec WebSocket sécurisé
        this.client = new Paho.Client(
          MQTT_CONFIG.host,
          MQTT_CONFIG.port,
          '/mqtt',
          MQTT_CONFIG.clientId
        );

        // Configurer les callbacks
        this.client.onConnectionLost = this._onConnectionLost.bind(this);
        this.client.onMessageArrived = this._onMessageArrived.bind(this);

        // Options de connexion
        const connectOptions = {
          useSSL: true,
          userName: MQTT_CONFIG.username,
          password: MQTT_CONFIG.password,
          keepAliveInterval: MQTT_CONFIG.keepAliveInterval,
          cleanSession: true,
          onSuccess: () => {
            console.log('[MQTT] ✅ Connecté au broker HiveMQ');
            this.isConnected = true;
            this._notifyHandlers('onConnect');
            resolve(true);
          },
          onFailure: (error) => {
            console.error('[MQTT] ❌ Échec de connexion:', error.errorMessage);
            this.isConnected = false;
            this._notifyHandlers('onError', error);
            reject(error);
          },
        };

        console.log('[MQTT] 🔄 Connexion en cours...');
        this.client.connect(connectOptions);

      } catch (error) {
        console.error('[MQTT] ❌ Erreur lors de l\'initialisation:', error);
        reject(error);
      }
    });
  }

  /**
   * Déconnecte le client MQTT
   */
  disconnect() {
    if (this.client && this.isConnected) {
      try {
        this.client.disconnect();
        this.isConnected = false;
        console.log('[MQTT] 🔌 Déconnecté');
        this._notifyHandlers('onDisconnect');
      } catch (error) {
        console.error('[MQTT] Erreur lors de la déconnexion:', error);
      }
    }
  }

  /**
   * S'abonner à un topic
   */
  subscribe(topic, qos = 0) {
    return new Promise((resolve, reject) => {
      if (!this.isConnected) {
        reject(new Error('Non connecté au broker MQTT'));
        return;
      }

      this.client.subscribe(topic, {
        qos,
        onSuccess: () => {
          console.log(`[MQTT] 📥 Abonné au topic: ${topic}`);
          this.subscriptions.set(topic, qos);
          resolve(true);
        },
        onFailure: (error) => {
          console.error(`[MQTT] ❌ Échec d'abonnement au topic ${topic}:`, error);
          reject(error);
        },
      });
    });
  }

  /**
   * Se désabonner d'un topic
   */
  unsubscribe(topic) {
    return new Promise((resolve, reject) => {
      if (!this.isConnected) {
        reject(new Error('Non connecté au broker MQTT'));
        return;
      }

      this.client.unsubscribe(topic, {
        onSuccess: () => {
          console.log(`[MQTT] 📤 Désabonné du topic: ${topic}`);
          this.subscriptions.delete(topic);
          resolve(true);
        },
        onFailure: (error) => {
          console.error(`[MQTT] ❌ Échec de désabonnement du topic ${topic}:`, error);
          reject(error);
        },
      });
    });
  }

  /**
   * Publier un message sur un topic
   */
  publish(topic, payload, qos = 0, retained = false) {
    if (!this.isConnected) {
      console.error('[MQTT] ❌ Non connecté au broker MQTT');
      return false;
    }

    try {
      const message = new Paho.Message(
        typeof payload === 'string' ? payload : JSON.stringify(payload)
      );
      message.destinationName = topic;
      message.qos = qos;
      message.retained = retained;

      this.client.send(message);
      console.log(`[MQTT] 📨 Message publié sur ${topic}:`, payload);
      return true;
    } catch (error) {
      console.error('[MQTT] ❌ Erreur lors de la publication:', error);
      return false;
    }
  }

  /**
   * Ajouter un handler pour les messages reçus
   */
  onMessage(callback) {
    this.messageHandlers.push(callback);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== callback);
    };
  }

  /**
   * Ajouter un handler pour les événements de connexion
   */
  onConnectionChange(event, callback) {
    if (this.connectionHandlers[event]) {
      this.connectionHandlers[event].push(callback);
      return () => {
        this.connectionHandlers[event] = this.connectionHandlers[event].filter(h => h !== callback);
      };
    }
  }

  /**
   * Callback interne - Connexion perdue
   */
  _onConnectionLost(responseObject) {
    this.isConnected = false;
    console.log('[MQTT] ⚠️ Connexion perdue:', responseObject.errorMessage);
    this._notifyHandlers('onDisconnect', responseObject);

    // Tentative de reconnexion automatique
    setTimeout(() => {
      if (!this.isConnected) {
        console.log('[MQTT] 🔄 Tentative de reconnexion...');
        this.connect().catch(console.error);
      }
    }, MQTT_CONFIG.reconnectTimeout);
  }

  /**
   * Callback interne - Message reçu
   */
  _onMessageArrived(message) {
    const topic = message.destinationName;
    const payload = message.payloadString;

    console.log(`[MQTT] 📩 Message reçu sur ${topic}:`, payload);

    // Parser le payload JSON si possible
    let parsedPayload = payload;
    try {
      parsedPayload = JSON.parse(payload);
    } catch (e) {
      // Le payload n'est pas du JSON, on garde la chaîne
    }

    // Notifier tous les handlers
    this.messageHandlers.forEach(handler => {
      try {
        handler(topic, parsedPayload, message);
      } catch (error) {
        console.error('[MQTT] Erreur dans le handler de message:', error);
      }
    });
  }

  /**
   * Notifier les handlers d'événements
   */
  _notifyHandlers(event, data) {
    if (this.connectionHandlers[event]) {
      this.connectionHandlers[event].forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`[MQTT] Erreur dans le handler ${event}:`, error);
        }
      });
    }
  }

  /**
   * Vérifier si le client est connecté
   */
  getConnectionStatus() {
    return this.isConnected;
  }

  /**
   * Obtenir la liste des topics souscrits
   */
  getSubscriptions() {
    return Array.from(this.subscriptions.keys());
  }
}

// Singleton - Instance unique du client MQTT
const mqttClient = new MQTTClient();

export default mqttClient;
export { MQTTClient, MQTT_CONFIG };
