// components/DeviceNameEditor.jsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  Keyboard,
  Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from "@expo/vector-icons/Ionicons";
import GlassCard from './GlassCard';
import useDevices from '../hooks/useDevices';
import { colors, typography, spacing, borderRadius, shadows } from '../theme/colors';

const API_URL = 'https://bit-p-server.up.railway.app/api/dName';

// Configuration des icônes par type d'appareil
const deviceConfig = {
  windowSensor: {
    icon: 'apps-outline',
    label: 'Capteur Fenêtre',
    gradient: ['#3B82F6', '#1D4ED8'],
  },
  motionSensor: {
    icon: 'walk-outline',
    label: 'Capteur Mouvement',
    gradient: ['#8B5CF6', '#6D28D9'],
  },
  doorSensor: {
    icon: 'enter-outline',
    label: 'Capteur Porte',
    gradient: ['#10B981', '#059669'],
  },
  camera: {
    icon: 'videocam-outline',
    label: 'Caméra',
    gradient: ['#F59E0B', '#D97706'],
  },
  default: {
    icon: 'hardware-chip-outline',
    label: 'Appareil',
    gradient: colors.gradients.secondary,
  },
};

function DeviceEditItem({ device, onRename }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(device.dName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const config = deviceConfig[device.dType] || deviceConfig.default;

  const handleSave = async () => {
    if (!newName.trim()) {
      setError('Le nom ne peut pas être vide');
      return;
    }

    if (newName.trim() === device.dName) {
      setIsEditing(false);
      return;
    }

    Keyboard.dismiss();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(API_URL, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          dName: device.dName,
          newdName: newName.trim() 
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      setIsEditing(false);
      onRename(); // Rafraîchir la liste des appareils
    } catch (err) {
      setError(err.message || 'Échec de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setNewName(device.dName);
    setIsEditing(false);
    setError(null);
    Keyboard.dismiss();
  };

  return (
    <View style={styles.deviceItem}>
      <View style={styles.deviceHeader}>
        <LinearGradient
          colors={config.gradient}
          style={styles.deviceIcon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name={config.icon} size={18} color={colors.text.primary} />
        </LinearGradient>
        
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceType}>{config.label}</Text>
          {!isEditing && (
            <Text style={styles.deviceName}>{device.dName}</Text>
          )}
        </View>

        {!isEditing && (
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Ionicons name="create-outline" size={18} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {isEditing && (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.input}
            value={newName}
            onChangeText={setNewName}
            placeholder="Nouveau nom"
            placeholderTextColor={colors.text.muted}
            autoFocus
            selectTextOnFocus
            maxLength={30}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={handleCancel}
              disabled={saving}
            >
              <Ionicons name="close" size={16} color={colors.text.muted} />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={colors.gradients.primary}
                style={styles.saveButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={colors.text.primary} />
                ) : (
                  <Ionicons name="checkmark" size={16} color={colors.text.primary} />
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

export default function DeviceNameEditor() {
  const { devices, loading, error, refresh } = useDevices();
  const [successMessage, setSuccessMessage] = useState(null);

  const handleRename = () => {
    refresh();
    setSuccessMessage('Nom de l\'appareil mis à jour');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <GlassCard style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconWrapper}>
          <LinearGradient
            colors={colors.gradients.secondary}
            style={styles.iconGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="hardware-chip-outline" size={20} color={colors.text.primary} />
          </LinearGradient>
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>APPAREILS</Text>
          {devices && devices.length > 0 && (
            <Text style={styles.deviceCount}>{devices.length} appareil{devices.length > 1 ? 's' : ''}</Text>
          )}
        </View>
      </View>

      {/* Contenu */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={16} color={colors.status.error} />
          <Text style={styles.errorBannerText}>{error}</Text>
        </View>
      ) : devices && devices.length > 0 ? (
        <View style={styles.devicesList}>
          {devices.map((device, index) => (
            <DeviceEditItem 
              key={`${device.dName}-${index}`} 
              device={device} 
              onRename={handleRename}
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="cube-outline" size={32} color={colors.text.muted} />
          <Text style={styles.emptyText}>Aucun appareil trouvé</Text>
        </View>
      )}

      {/* Message de succès */}
      {successMessage && (
        <View style={styles.successContainer}>
          <Ionicons name="checkmark-circle" size={16} color={colors.status.success} />
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      )}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  iconWrapper: {
    marginRight: spacing.md,
  },
  iconGradient: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.subtle,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    ...typography.small,
    color: colors.text.secondary,
    letterSpacing: 2,
    fontWeight: '600',
  },
  deviceCount: {
    ...typography.small,
    color: colors.primary,
    marginTop: 2,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  loadingText: {
    ...typography.caption,
    color: colors.text.muted,
    marginLeft: spacing.sm,
  },
  devicesList: {
    width: '100%',
  },
  deviceItem: {
    backgroundColor: colors.background.glass,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.secondary,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceType: {
    ...typography.small,
    color: colors.text.muted,
  },
  deviceName: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  editButton: {
    backgroundColor: colors.background.tertiary,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  editContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.secondary,
  },
  input: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.accent,
    color: colors.text.primary,
    ...typography.body,
    marginBottom: spacing.sm,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  cancelButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  saveButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.sm,
  },
  errorContainer: {
    marginTop: spacing.sm,
  },
  errorText: {
    ...typography.small,
    color: colors.status.error,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.status.errorBg,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
  },
  errorBannerText: {
    ...typography.caption,
    color: colors.status.error,
    marginLeft: spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    ...typography.caption,
    color: colors.text.muted,
    marginTop: spacing.sm,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    backgroundColor: colors.status.successBg,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  successText: {
    ...typography.small,
    color: colors.status.success,
    marginLeft: spacing.xs,
  },
});
