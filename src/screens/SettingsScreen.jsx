// screens/SettingsScreen.jsx
import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SystemMode from '../components/systemMode';
import SystemNameEditor from '../components/SystemNameEditor';
import DeviceNameEditor from '../components/DeviceNameEditor';
import LanguageSelector from '../components/LanguageSelector';
import ThemeToggle from '../components/ThemeToggle';
import useSystemMode from '../hooks/useSystemMode';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import Header from '../components/Header';
import GradientBackground from '../components/GradientBackground';
import GlassCard from '../components/GlassCard';
import { typography, spacing } from '../theme/colors';

export default function SettingsScreen () {
    const { isArmed, loading, error } = useSystemMode();
    const { t } = useLanguage();
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <GradientBackground>
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={[
                    styles.contentContainer,
                    { paddingBottom: insets.bottom + spacing.xl }
                ]}
                showsVerticalScrollIndicator={false}
            >
                <Header 
                    title={t('settings.title')} 
                    subtitle={t('settings.subtitle')}
                    loading={loading}
                />
                
                <View style={styles.content}>
                    {error && (
                        <GlassCard style={[styles.errorCard, { borderColor: 'rgba(239, 68, 68, 0.3)' }]}>
                            <Text style={[styles.errorText, { color: theme.status.error }]}>{t('common.error')}: {error}</Text>
                        </GlassCard>
                    )}
                    
                    {/* Mode système */}
                    {isArmed !== null && <SystemMode initialIsArmed={isArmed} />}
                    
                    {/* Éditeur du nom du système */}
                    <View style={styles.sectionSpacing}>
                        <SystemNameEditor />
                    </View>
                    
                    {/* Éditeur des noms d'appareils */}
                    <DeviceNameEditor />
                    
                    {/* Thème */}
                    <View style={styles.sectionSpacing}>
                        <ThemeToggle />
                    </View>
                    
                    {/* Sélecteur de langue */}
                    <View style={styles.sectionSpacing}>
                        <LanguageSelector />
                    </View>
                    
                    {/* Version de l'application - tout en bas */}
                    <View style={styles.versionContainer}>
                        <Text style={[styles.versionText, { color: theme.text.muted }]}>Bit-P App</Text>
                        <Text style={[styles.versionNumber, { color: theme.text.muted }]}>v1.0.0</Text>
                    </View>
                </View>
            </ScrollView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
    },
    content: {
        paddingHorizontal: spacing.lg,
    },
    sectionSpacing: {
        marginTop: spacing.xl,
    },
    errorCard: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        marginBottom: spacing.md,
    },
    errorText: {
        ...typography.caption,
    },
    versionContainer: {
        alignItems: 'center',
        marginTop: spacing.xl * 2,
        paddingVertical: spacing.lg,
    },
    versionText: {
        ...typography.caption,
        marginBottom: spacing.xs,
    },
    versionNumber: {
        ...typography.small,
        opacity: 0.6,
    },
});
