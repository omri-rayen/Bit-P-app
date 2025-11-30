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
import Ionicons from "@expo/vector-icons/Ionicons";
import GlassCard from './GlassCard';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import { languageNames, languageFlags } from '../i18n/translations';
import { typography, spacing, borderRadius } from '../theme/colors';

export default function LanguageSelector() {
  const { language, setLanguage, t, availableLanguages } = useLanguage();
  const { theme } = useTheme();
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
          <View style={[styles.headerIcon, { backgroundColor: theme.isDark ? '#F59E0B20' : '#FFFFFF', borderWidth: theme.isDark ? 0 : 1, borderColor: theme.border.primary }]}>
            <Ionicons name="language-outline" size={18} color="#F59E0B" />
          </View>
          <Text style={[styles.headerTitle, { color: theme.text.secondary }]}>{t('settings.language')}</Text>
        </View>

        {/* Sélecteur de langue */}
        <TouchableOpacity 
          style={[styles.selector, { backgroundColor: theme.background.glass, borderColor: theme.border.primary }]}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <View style={styles.selectedLanguage}>
            <Text style={styles.flag}>{languageFlags[language]}</Text>
            <Text style={[styles.languageName, { color: theme.text.primary }]}>{languageNames[language]}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.text.muted} />
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
          <View style={[styles.modalContent, { backgroundColor: theme.background.secondary, borderColor: theme.border.primary }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.border.secondary }]}>
              <Text style={[styles.modalTitle, { color: theme.text.primary }]}>{t('settings.selectLanguage')}</Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={theme.text.secondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.languageList}>
              {availableLanguages.map((lang) => (
                <TouchableOpacity
                  key={lang}
                  style={[
                    styles.languageOption,
                    { backgroundColor: theme.background.glass, borderColor: theme.border.secondary },
                    language === lang && { borderColor: theme.primary, backgroundColor: 'rgba(0, 217, 255, 0.1)' }
                  ]}
                  onPress={() => handleSelectLanguage(lang)}
                  activeOpacity={0.7}
                >
                  <View style={styles.languageInfo}>
                    <Text style={styles.optionFlag}>{languageFlags[lang]}</Text>
                    <Text style={[
                      styles.optionName,
                      { color: theme.text.primary },
                      language === lang && { color: theme.primary, fontWeight: '600' }
                    ]}>
                      {languageNames[lang]}
                    </Text>
                  </View>
                  
                  {language === lang && (
                    <View style={[styles.checkmark, { backgroundColor: theme.primary }]}>
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    </View>
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
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  headerTitle: {
    ...typography.small,
    letterSpacing: 2,
    fontWeight: '600',
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
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
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
  },
  modalTitle: {
    ...typography.h3,
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
    borderWidth: 1,
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
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
