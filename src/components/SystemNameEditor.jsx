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
import { useTheme } from '../theme/ThemeContext';
import { typography, spacing, borderRadius } from '../theme/colors';

const API_URL = 'https://bit-p-server.up.railway.app/api/sysName';

export default function SystemNameEditor() {
  const { sysName, loading: loadingName, error: fetchError, refresh } = useSystemName();
  const { t } = useLanguage();
  const { theme } = useTheme();
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
            colors={theme.gradients.primary}
            style={styles.iconGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="pencil-outline" size={20} color={theme.text.primary} />
          </LinearGradient>
        </View>
        <Text style={[styles.headerTitle, { color: theme.text.secondary }]}>{t('settings.systemNameTitle')}</Text>
      </View>

      {/* Contenu */}
      {loadingName ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text.muted }]}>{t('common.loading')}</Text>
        </View>
      ) : (
        <View style={styles.content}>
          {isEditing ? (
            <>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.background.tertiary, borderColor: theme.border.accent, color: theme.text.primary }]}
                  value={newName}
                  onChangeText={setNewName}
                  placeholder={t('settings.enterNewName')}
                  placeholderTextColor={theme.text.muted}
                  autoFocus
                  selectTextOnFocus
                  maxLength={50}
                />
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[styles.cancelButton, { backgroundColor: theme.background.tertiary, borderColor: theme.border.primary }]} 
                  onPress={handleCancel}
                  disabled={saving}
                >
                  <Ionicons name="close" size={18} color={theme.text.muted} />
                  <Text style={[styles.cancelButtonText, { color: theme.text.muted }]}>{t('common.cancel')}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={handleSave}
                  disabled={saving}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={theme.gradients.primary}
                    style={styles.saveButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {saving ? (
                      <ActivityIndicator size="small" color={theme.text.primary} />
                    ) : (
                      <>
                        <Ionicons name="checkmark" size={18} color={theme.text.primary} />
                        <Text style={[styles.saveButtonText, { color: theme.text.primary }]}>{t('common.save')}</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <TouchableOpacity 
              style={[styles.nameDisplay, { backgroundColor: theme.background.glass, borderColor: theme.border.primary }]} 
              onPress={() => setIsEditing(true)}
              activeOpacity={0.7}
            >
              <View style={styles.nameRow}>
                <Text style={[styles.currentName, { color: theme.text.primary }]}>{sysName || t('settings.notDefined')}</Text>
                <View style={[styles.editIcon, { backgroundColor: theme.background.tertiary }]}>
                  <Ionicons name="create-outline" size={18} color={theme.primary} />
                </View>
              </View>
              <Text style={[styles.hint, { color: theme.text.muted }]}>{t('settings.tapToEdit')}</Text>
            </TouchableOpacity>
          )}

          {/* Messages d'erreur ou de succès */}
          {error && (
            <View style={[styles.errorContainer, { backgroundColor: theme.status.errorBg }]}>
              <Ionicons name="alert-circle" size={16} color={theme.status.error} />
              <Text style={[styles.errorText, { color: theme.status.error }]}>{error}</Text>
            </View>
          )}

          {success && (
            <View style={[styles.successContainer, { backgroundColor: theme.status.successBg }]}>
              <Ionicons name="checkmark-circle" size={16} color={theme.status.success} />
              <Text style={[styles.successText, { color: theme.status.success }]}>{t('settings.nameUpdated')}</Text>
            </View>
          )}

          {fetchError && (
            <View style={[styles.errorContainer, { backgroundColor: theme.status.errorBg }]}>
              <Ionicons name="alert-circle" size={16} color={theme.status.error} />
              <Text style={[styles.errorText, { color: theme.status.error }]}>{fetchError}</Text>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    ...typography.small,
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
    marginLeft: spacing.sm,
  },
  content: {
    width: '100%',
  },
  nameDisplay: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currentName: {
    ...typography.h3,
    flex: 1,
  },
  editIcon: {
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  hint: {
    ...typography.small,
    marginTop: spacing.xs,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  input: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
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
    borderWidth: 1,
  },
  cancelButtonText: {
    ...typography.caption,
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
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  errorText: {
    ...typography.small,
    marginLeft: spacing.xs,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  successText: {
    ...typography.small,
    marginLeft: spacing.xs,
  },
});
