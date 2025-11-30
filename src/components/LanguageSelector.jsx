// components/LanguageSelector.jsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Modal,
  Pressable
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from "@expo/vector-icons/Ionicons";
import GlassCard from './GlassCard';
import { useLanguage } from '../i18n/LanguageContext';
import { languageNames, languageFlags } from '../i18n/translations';
import { colors, typography, spacing, borderRadius, shadows } from '../theme/colors';

export default function LanguageSelector() {
  const { language, setLanguage, t, availableLanguages } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectLanguage = (lang) => {
    setLanguage(lang);
    setModalVisible(false);
  };

  return (
    <>
      <GlassCard style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <LinearGradient
              colors={['#F59E0B', '#D97706']}
              style={styles.iconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="language-outline" size={20} color={colors.text.primary} />
            </LinearGradient>
          </View>
          <Text style={styles.headerTitle}>{t('settings.language')}</Text>
        </View>

        {/* Sélecteur de langue */}
        <TouchableOpacity 
          style={styles.selector}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <View style={styles.selectedLanguage}>
            <Text style={styles.flag}>{languageFlags[language]}</Text>
            <Text style={styles.languageName}>{languageNames[language]}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
        </TouchableOpacity>
      </GlassCard>

      {/* Modal de sélection */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('settings.selectLanguage')}</Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.languageList}>
              {availableLanguages.map((lang) => (
                <TouchableOpacity
                  key={lang}
                  style={[
                    styles.languageOption,
                    language === lang && styles.selectedOption
                  ]}
                  onPress={() => handleSelectLanguage(lang)}
                  activeOpacity={0.7}
                >
                  <View style={styles.languageInfo}>
                    <Text style={styles.optionFlag}>{languageFlags[lang]}</Text>
                    <Text style={[
                      styles.optionName,
                      language === lang && styles.selectedOptionText
                    ]}>
                      {languageNames[lang]}
                    </Text>
                  </View>
                  
                  {language === lang && (
                    <LinearGradient
                      colors={colors.gradients.primary}
                      style={styles.checkmark}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Ionicons name="checkmark" size={16} color={colors.text.primary} />
                    </LinearGradient>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
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
    marginBottom: spacing.md,
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
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.glass,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  selectedLanguage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  languageName: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border.primary,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.secondary,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  closeButton: {
    padding: spacing.xs,
  },
  languageList: {
    padding: spacing.md,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.background.glass,
    borderWidth: 1,
    borderColor: colors.border.secondary,
  },
  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(0, 217, 255, 0.1)',
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionFlag: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  optionName: {
    ...typography.body,
    color: colors.text.primary,
  },
  selectedOptionText: {
    color: colors.primary,
    fontWeight: '600',
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
