// components/SystemNameEditor.jsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  Keyboard
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from "@expo/vector-icons/Ionicons";
import GlassCard from './GlassCard';
import useSystemName from '../hooks/useSystemName';
import { useLanguage } from '../i18n/LanguageContext';
import { colors, typography, spacing, borderRadius, shadows } from '../theme/colors';

const API_URL = 'https://bit-p-server.up.railway.app/api/sysName';

export default function SystemNameEditor() {
  const { sysName, loading: loadingName, error: fetchError, refresh } = useSystemName();
  const { t } = useLanguage();
  const [newName, setNewName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (sysName) {
      setNewName(sysName);
    }
  }, [sysName]);

  const handleSave = async () => {
    if (!newName.trim()) {
      setError(t('settings.emptyNameError'));
      return;
    }

    if (newName.trim() === sysName) {
      setIsEditing(false);
      return;
    }

    Keyboard.dismiss();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(API_URL, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sysName: newName.trim() }),
      });

      if (!response.ok) {
        throw new Error(`${t('common.error')} HTTP ${response.status}`);
      }

      setSuccess(true);
      setIsEditing(false);
      refresh();
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || t('settings.updateFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setNewName(sysName || '');
    setIsEditing(false);
    setError(null);
    Keyboard.dismiss();
  };

  return (
    <GlassCard style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconWrapper}>
          <LinearGradient
            colors={colors.gradients.primary}
            style={styles.iconGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="pencil-outline" size={20} color={colors.text.primary} />
          </LinearGradient>
        </View>
        <Text style={styles.headerTitle}>{t('settings.systemNameTitle')}</Text>
      </View>

      {/* Contenu */}
      {loadingName ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      ) : (
        <View style={styles.content}>
          {isEditing ? (
            <>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={newName}
                  onChangeText={setNewName}
                  placeholder={t('settings.enterNewName')}
                  placeholderTextColor={colors.text.muted}
                  autoFocus
                  selectTextOnFocus
                  maxLength={50}
                />
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={handleCancel}
                  disabled={saving}
                >
                  <Ionicons name="close" size={18} color={colors.text.muted} />
                  <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
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
                      <>
                        <Ionicons name="checkmark" size={18} color={colors.text.primary} />
                        <Text style={styles.saveButtonText}>{t('common.save')}</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <TouchableOpacity 
              style={styles.nameDisplay} 
              onPress={() => setIsEditing(true)}
              activeOpacity={0.7}
            >
              <View style={styles.nameRow}>
                <Text style={styles.currentName}>{sysName || t('settings.notDefined')}</Text>
                <View style={styles.editIcon}>
                  <Ionicons name="create-outline" size={18} color={colors.primary} />
                </View>
              </View>
              <Text style={styles.hint}>{t('settings.tapToEdit')}</Text>
            </TouchableOpacity>
          )}

          {/* Messages d'erreur ou de succès */}
          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color={colors.status.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {success && (
            <View style={styles.successContainer}>
              <Ionicons name="checkmark-circle" size={16} color={colors.status.success} />
              <Text style={styles.successText}>{t('settings.nameUpdated')}</Text>
            </View>
          )}

          {fetchError && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color={colors.status.error} />
              <Text style={styles.errorText}>{fetchError}</Text>
            </View>
          )}
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
  headerTitle: {
    ...typography.small,
    color: colors.text.secondary,
    letterSpacing: 2,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  loadingText: {
    ...typography.caption,
    color: colors.text.muted,
    marginLeft: spacing.sm,
  },
  content: {
    width: '100%',
  },
  nameDisplay: {
    backgroundColor: colors.background.glass,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currentName: {
    ...typography.h3,
    color: colors.text.primary,
    flex: 1,
  },
  editIcon: {
    backgroundColor: colors.background.tertiary,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  hint: {
    ...typography.small,
    color: colors.text.muted,
    marginTop: spacing.xs,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.accent,
    color: colors.text.primary,
    ...typography.body,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  cancelButtonText: {
    ...typography.caption,
    color: colors.text.muted,
    marginLeft: spacing.xs,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    minWidth: 120,
    justifyContent: 'center',
  },
  saveButtonText: {
    ...typography.caption,
    color: colors.text.primary,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    backgroundColor: colors.status.errorBg,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  errorText: {
    ...typography.small,
    color: colors.status.error,
    marginLeft: spacing.xs,
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
