# Intégration des Notifications en Temps Réel

## Vue d'ensemble

L'application Bit-P intègre maintenant des notifications en temps réel via MQTT pour afficher les événements système et les alertes des capteurs.

## Topic MQTT

**Topic**: `system/logs`

L'application s'abonne automatiquement à ce topic au démarrage pour recevoir les logs en temps réel.

## Formats JSON

### 1. Door Sensor (d239)
```json
{
  "origin": "device",
  "msg": "message descriptif",
  "timestamp": "2025-11-28T10:15:30.123+01:00",
  "deviceId": "d239",
  "isOpen": true
}
```

**Champs**:
- `origin`: "device"
- `msg`: Message descriptif de l'événement
- `timestamp`: Horodatage au format ISO 8601
- `deviceId`: "d239" (Door Sensor)
- `isOpen`: `true` (porte ouverte) ou `false` (porte fermée)

### 2. Motion Detector (d254)
```json
{
  "origin": "device",
  "msg": "message descriptif",
  "timestamp": "2025-11-28T10:15:34.123+01:00",
  "deviceId": "d254"
}
```

**Champs**:
- `origin`: "device"
- `msg`: Message descriptif de l'événement
- `timestamp`: Horodatage au format ISO 8601
- `deviceId`: "d254" (Motion Detector)

### 3. System Log
```json
{
  "origin": "system",
  "msg": "message descriptif",
  "timestamp": "2025-11-28T11:15:30.123+01:00"
}
```

**Champs**:
- `origin`: "system"
- `msg`: Message descriptif de l'événement système
- `timestamp`: Horodatage au format ISO 8601

## Fonctionnalités

### Notifications Push
- **Affichage automatique**: Les nouvelles notifications apparaissent en haut de l'écran
- **Auto-dismiss**: Les notifications disparaissent automatiquement après 5 secondes
- **Dismiss manuel**: Possibilité de fermer manuellement avec le bouton X
- **Animations**: Animations fluides d'apparition et de disparition

### Logs en Temps Réel
- **Badge "Temps réel"**: Les logs MQTT sont marqués avec un badge vert
- **Intégration avec l'API**: Les logs temps réel sont fusionnés avec les logs de l'API
- **Tri chronologique**: Tous les logs sont triés par timestamp (plus récent en premier)
- **Pas de doublons**: Système de déduplication basé sur l'ID

### Statuts Spécifiques

#### Door Sensor
- Icône de cadenas (ouvert/fermé)
- Couleur: Orange (ouvert) / Vert (fermé)
- Texte: "Porte ouverte" / "Porte fermée"

#### Motion Detector
- Icône de personne qui marche
- Couleur: Bleu
- Texte: "Mouvement détecté"

#### System
- Icône de cloche
- Couleur: Bleu primaire
- Texte: "Nouveau log système"

## Architecture Technique

### Hooks
1. **`useRealtimeLogs`**: Gère la subscription MQTT et le parsing des messages
2. **`useLogs`**: Combine les logs API + temps réel et gère le tri/déduplication
3. **`useMQTT`**: Hook MQTT de base (déjà existant)

### Composants
1. **`RealtimeNotification`**: Composant de notification animée
2. **`Log`**: Mise à jour pour afficher les statuts spécifiques et le badge temps réel

### Screens
1. **`HomeScreen`**: Affiche les notifications
2. **`SystemScreen`**: Affiche les notifications + liste des logs

## Device IDs Hardcodés

Pour le moment, les IDs suivants sont hardcodés:
- `d239`: Door Sensor
- `d254`: Motion Detector

Ces IDs sont mappés aux noms d'affichage correspondants dans `useRealtimeLogs.js`.

## Configuration MQTT

Le broker MQTT est configuré dans `src/services/mqttClient.js`:
- **Broker**: test.mosquitto.org
- **Port**: 8081 (WebSocket)
- **QoS**: 0 (par défaut)

## Test

Pour tester l'intégration, publiez un message sur le topic `system/logs` avec l'un des formats JSON ci-dessus.

### Exemple avec mosquitto_pub:
```bash
# Door sensor - porte ouverte
mosquitto_pub -h test.mosquitto.org -t "system/logs" -m '{"origin":"device","msg":"La porte d'\''entrée a été ouverte","timestamp":"2025-12-08T15:30:00.000Z","deviceId":"d239","isOpen":true}'

# Motion detector
mosquitto_pub -h test.mosquitto.org -t "system/logs" -m '{"origin":"device","msg":"Mouvement détecté dans le salon","timestamp":"2025-12-08T15:31:00.000Z","deviceId":"d254"}'

# System log
mosquitto_pub -h test.mosquitto.org -t "system/logs" -m '{"origin":"system","msg":"Système armé avec succès","timestamp":"2025-12-08T15:32:00.000Z"}'
```
