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
} from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import GlassCard from './GlassCard';
import useDevices from '../hooks/useDevices';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import { typography, spacing, borderRadius } from '../theme/colors';

const API_URL = 'https://bit-p-server.up.railway.app/api/dName';

// Configuration des icônes par type d'appareil
const getDeviceConfig = (t) => ({
  windowSensor: {
    icon: 'apps-outline',
    label: t('devices.windowSensor'),
    color: '#3B82F6',
  },
  motionSensor: {
    icon: 'walk-outline',
    label: t('devices.motionSensor'),
    color: '#8B5CF6',
  },
  doorSensor: {
    icon: 'enter-outline',
    label: t('devices.doorSensor'),
    color: '#10B981',
  },
  camera: {
    icon: 'videocam-outline',
    label: t('devices.camera'),
    color: '#F59E0B',
  },
  default: {
    icon: 'hardware-chip-outline',
    label: t('devices.device'),
    color: '#6366F1',
  },
});

function DeviceEditItem({ device, onRename, t, theme }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(device.dName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const deviceConfig = getDeviceConfig(t);
  const config = deviceConfig[device.dType] || deviceConfig.default;

  const handleSave = async () => {
    if (!newName.trim()) {
      setError(t('settings.emptyNameError'));
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
        throw new Error(`${t('common.error')} HTTP ${response.status}`);
      }

      setIsEditing(false);
      onRename();
    } catch (err) {
      setError(err.message || t('settings.updateFailed'));
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

  const styles = getStyles(theme);

  return (
    <View style={styles.deviceItem}>
      <View style={styles.deviceHeader}>
        <View style={[styles.deviceIcon, { backgroundColor: config.color + '15' }]}>
          <Ionicons name={config.icon} size={18} color={config.color} />
        </View>
        
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
            <Ionicons name="create-outline" size={18} color={theme.primary} />
          </TouchableOpacity>
        )}
      </View>

      {isEditing && (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.input}
            value={newName}
            onChangeText={setNewName}
            placeholder={t('settings.newName')}
            placeholderTextColor={theme.text.muted}
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
              <Ionicons name="close" size={16} color={theme.text.muted} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.saveButton, { backgroundColor: theme.primary }]}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.8}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              )}
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
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [successMessage, setSuccessMessage] = useState(null);
  
  const styles = getStyles(theme);

  const handleRename = () => {
    refresh();
    setSuccessMessage(t('settings.deviceNameUpdated'));
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <GlassCard style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.headerIcon, { backgroundColor: theme.isDark ? theme.primary + '15' : '#FFFFFF', borderWidth: theme.isDark ? 0 : 1, borderColor: theme.border.primary }]}>
          <Ionicons name="hardware-chip-outline" size={20} color={theme.primary} />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>{t('devices.title')}</Text>
          {devices && devices.length > 0 && (
            <Text style={styles.deviceCount}>{devices.length} {t('devices.device')}{devices.length > 1 ? 's' : ''}</Text>
          )}
        </View>
      </View>

      {/* Contenu */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.primary} />
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      ) : error ? (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={16} color={theme.status.error} />
          <Text style={styles.errorBannerText}>{error}</Text>
        </View>
      ) : devices && devices.length > 0 ? (
        <View style={styles.devicesList}>
          {devices.map((device, index) => (
            <DeviceEditItem 
              key={`${device.dName}-${index}`} 
              device={device} 
              onRename={handleRename}
              t={t}
              theme={theme}
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="cube-outline" size={32} color={theme.text.muted} />
          <Text style={styles.emptyText}>{t('devices.noDevices')}</Text>
        </View>
      )}

      {/* Message de succès */}
      {successMessage && (
        <View style={styles.successContainer}>
          <Ionicons name="checkmark-circle" size={16} color={theme.status.success} />
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      )}
    </GlassCard>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    ...typography.body,
    color: theme.text.primary,
    fontWeight: '600',
  },
  deviceCount: {
    ...typography.small,
    color: theme.text.muted,
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
    color: theme.text.muted,
    marginLeft: spacing.sm,
  },
  devicesList: {
    width: '100%',
  },
  deviceItem: {
    backgroundColor: theme.background.secondary,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: theme.border.primary,
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
    color: theme.text.muted,
  },
  deviceName: {
    ...typography.body,
    color: theme.text.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  editButton: {
    backgroundColor: theme.background.tertiary,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  editContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.border.secondary,
  },
  input: {
    backgroundColor: theme.background.tertiary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: theme.border.accent,
    color: theme.text.primary,
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
    backgroundColor: theme.background.tertiary,
    borderWidth: 1,
    borderColor: theme.border.primary,
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
    color: theme.status.error,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.status.errorBg,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
  },
  errorBannerText: {
    ...typography.caption,
    color: theme.status.error,
    marginLeft: spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    ...typography.caption,
    color: theme.text.muted,
    marginTop: spacing.sm,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    backgroundColor: theme.status.successBg,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  successText: {
    ...typography.small,
    color: theme.status.success,
    marginLeft: spacing.xs,
  },
});
